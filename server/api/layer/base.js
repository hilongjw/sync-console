'use strict'

const LRU = require('lru-cache')
const options = {
    max: 50 * 1024 * 1024,
    maxAge: 1000 * 60 * 60
}
const Cache = (process.__API__BASE__ || (process.__API__BASE__ = LRU(options)))

const RoleWeight = {
    system: 101,
    admin: 100,
    owner: 11,
    user: 2,
    unauth: 1,
    black: 0
}

const defualtData = {
    Auth: {
        create: 2,
        get: 1,
        find: 1,
        update: 11,
        delete: 11,
        count: 1
    },
    UserKey: 'user',
    sort: {
        updatedAt: -1
    },
    limit: 20
}

const ErrorHandler = {
    UnLogin: {
        code: 401,
        message: '没有登录'
    },
    Auth: {
        code: 403,
        message: '没有访问权限'
    },
    NotFound: {
        code: 404,
        message: 'Not found'
    },
    MongoError (err) {
        let result
        console.log(err)
        switch (err.name) {
        case 'ValidationError':
            result = {
                code: 403,
                name: err.name,
                message: '数据输入不合法: ' + err.message
            }
            break
        default:
            result = {
                code: 500,
                name: err.name,
                message: '数据库出事了: ' + err.message
            }
        }

        return result
    }
}

class DataModel {
    constructor ({ Name, UserKey, Model, Auth, Hook }) {
        this.Name = Name
        this.Model = Model
        this.UserKey = UserKey || defualtData.UserKey
        this.Auth = Auth || defualtData.Auth
        this.Hook = Hook || {}
    }

    _authCheck (type, user, isOwner) {
        let AuthWeight = 1
        if (user) {
            AuthWeight = RoleWeight[user.role] || 1
            if (user.black) AuthWeight = 0
        }
        if (isOwner) {
            AuthWeight = 11
        }
        if (AuthWeight < this.Auth[type]) {
            return ErrorHandler.Auth
        }
    }

    _ownerCheck (item, user) {
        if (!user || !item) return false

        let result = true
        let itemUserId
        const userKey = this.UserKey

        if (typeof item[userKey] === 'undefined') {
            return false
        }
        if (typeof item[userKey] === 'object') {
            if (item[userKey]._id) {
                itemUserId = String(item[userKey]._id)
            } else {
                itemUserId = String(item[userKey])
            }
        }
        if (typeof item[userKey] === 'string') {
            itemUserId = String(item[userKey])
        }
        const userId = String(user._id)
        result = itemUserId === userId

        return result
    }

    check (type, user, item) {
        return new Promise((resolve, reject) => {
            const isOwner = this._ownerCheck(item, user)
            const authCheck = this._authCheck(type, user, isOwner)
            if (authCheck) return reject(authCheck)
            resolve(item)
        })
    }

    _count ({ data, user }) {
        const authCheck = this._authCheck('count', user)
        if (authCheck) return Promise.reject(authCheck)
        return new Promise((resolve, reject) => {
            const query = this.Model.count(data)
            query.exec((err, result) => {
                if (err) return reject(ErrorHandler.MongoError(err))
                resolve({
                    count: result
                })
            })
        })
    }

    get ({ id, data, user, include }) {
        return new Promise((resolve, reject) => {
            let query

            if (id) {
                query = this.Model.findById(id)
            } else {
                query = this.Model.findOne(data)
            }

            if (include) {
                include.forEach(field => {
                    query.populate(field)
                })
            }
            query.exec((err, model) => {
                if (err) return reject(ErrorHandler.MongoError(err))
                if (!model) return reject(ErrorHandler.NotFound)
                resolve(model)
            })
        })
    }

    _get ({ id, data, user, include }) {
        const cacheKey = this.getCacheKey({ id, data, include })

        if (Cache.has(cacheKey)) {
            const model = Cache.get(cacheKey)
            return this.check('get', user, model)
        }

        return this.get({ id, data, user, include })
            .then(model => {
                Cache.set(cacheKey, model, 60 * 1000)
                return this.check('get', user, model)
            })
    }

    find ({ data, user, sort, limit, skip, include }) {

        limit = limit || defualtData.limit
        sort = sort || defualtData.sort

        return new Promise((resolve, reject) => {
            const query = this.Model.find(data)
            query.limit(limit)
            query.sort(sort)
            query.skip(skip)

            if (include) {
                include.forEach(field => {
                    query.populate(field)
                })
            }

            query.exec((err, model) => {
                if (err) return reject(ErrorHandler.MongoError(err))
                resolve(model)
            })
        })
    }

    _find ({ data, user, sort, limit, skip, include }) {
        return this.check('find', user)
            .then(() => {
                return this.find({ data, user, sort, limit, skip, include })
            })
    }

    _create ({ data, user }) {
        const authCheck = this._authCheck('create', user)
        if (authCheck) return Promise.reject(authCheck)

        return new Promise((resolve, reject) => {
            const model = new this.Model(data)
            model.save(err => {
                if (err) return reject(ErrorHandler.MongoError(err))
                resolve(model)
            })
        })
    }

    _update ({ id, data, user }) {
        return new Promise((resolve, reject) => {
            let model
            this._get({ id, user })
                .then(m => {
                    model = m
                    const isOwner = this._ownerCheck(model, user)
                    const authCheck = this._authCheck('update', user, isOwner)
                    if (authCheck) return reject(authCheck)

                    let beforeUpdate

                    if (this.Hook.beforeUpdate) {
                        beforeUpdate = this.Hook.beforeUpdate
                    } else {
                        beforeUpdate = () => Promise.resolve(data)
                    }

                    return beforeUpdate(model, data, user)
                })
                .then(data => {
                    Object.keys(data).forEach(key => {
                        model[key] = data[key]
                    })

                    if (model.updatedAt) {
                        model.updatedAt = Date.now()
                    }

                    model.save((err, updated) => {
                        if (err) return reject(ErrorHandler.MongoError(err))
                        this.removeCache(model._id)
                        resolve(updated)
                    })
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    getCacheKey ({ id, data, include }) {
        const cacheKey = 'API_BS_GET:' + this.Name + ':' + id + ':' + (data ? JSON.stringify({ data, include }) : '')
        return cacheKey
    }

    removeCache (id) {
        if (!id) return
        const modelReg = new RegExp('API_BS_GET:' + this.Name + ':' + id)
        const findReg = new RegExp('API_BS_FIND:' + this.Name)

        Cache.forEach((value, key, cache) => {
            if (modelReg.test(key) || findReg.test(key)) {
                Cache.del(key)
            }
        })
    }

    _delete ({ id, user }) {
        return new Promise((resolve, reject) => {
            this._get({ id, user })
                .then(model => {
                    const isOwner = this._ownerCheck(model, user)
                    const authCheck = this._authCheck('delete', user, isOwner)
                    if (authCheck) return reject(authCheck)

                    model.remove((err) => {
                        if (err) return reject(ErrorHandler.MongoError(err))
                        this.removeCache(model._id)
                        resolve(model)
                    })
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
}

module.exports = DataModel
