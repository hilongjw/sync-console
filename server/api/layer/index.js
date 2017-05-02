'use strict'

const BaseModel = require('./base')
const Utils = require('./utils')
const APIStatus = require('./status')
const AskQueue = require('./ask-queue')
const toNumber = Utils.toNumber
const toArray = Utils.toArray
const toObject = Utils.toObject
const dataWithPublicUser = Utils.dataWithPublicUser

function DataWithType (value, type) {
    switch (type) {
    case Number:
        return toNumber(value)
    case Array:
        return toArray(value)
    case Object:
        return toObject(value)
    default:
        return value
    }
}

function dataFormat (source, Key, user, type) {
    if (!user || !user.role || !Key[user.role]) return {}
    let data = {}
    let keyMap = Key[user.role]

    if (keyMap[type]) {
        keyMap = keyMap[type]
    }

    Object.keys(keyMap).forEach(key => {
        if (source[key] !== undefined) {
            data[key] = DataWithType(source[key], keyMap[key])
        }
    })
    return data
}

function genInclude (data) {
    let include = []
    if (data.include) {
        include = data.include.split(',')
        delete data.include
    }
    return include
}

function genPagi (data) {
    const limit = Number(data.limit) || 20
    const skip = Number(data.skip) || 0

    delete data.skip
    delete data.limit

    return {
        limit: limit,
        skip: skip
    }
}

function genSort (data) {
    if (!data.ascending && !data.descending) return
    let key = data.ascending
    if (data.ascending) {
        key = data.ascending
        delete data.ascending
        return {
            [key]: 1
        }
    }
    key = data.descending
    delete data.descending
    return {
        [key]: -1
    }
}

class APILayer {
    constructor ({ Name, UserKey, Model, Auth, Key, Hook }) {
        this.name = Name
        this.DataModel = new BaseModel({
            Name,
            UserKey,
            Model,
            Auth
        })
        this.Hook = Hook || {}
        this.Key = Key || {}

        this.findQueue = new AskQueue(this.findLoader.bind(this), this.findSender.bind(this))
    }

    create (req, res) {
        let data = dataFormat(req.body, this.Key, req.currentUser, 'create')

        if (this.Hook.beforeCreate) {
            data = this.Hook.beforeCreate(data, req)
        }

        let yeildCreate

        if (this.Hook.yeildCreate) {
            yeildCreate = this.Hook.yeildCreate
        } else {
            yeildCreate = () => Promise.resolve(data)
        }

        yeildCreate(data, req)
            .then(data => {
                return this.DataModel._create({
                    data: data,
                    user: req.currentUser
                })
            })
            .then(result => {
                if (this.Hook.afterCreate) {
                    this.Hook.afterCreate(result)
                }
                res.send(result)
                APIStatus.mark('create', this.name)
            })
            .catch(err => {
                res.status(err.code)
                res.send(err)
            })
    }

    get (req, res) {
        const id = req.params.id
        let data = req.query

        let include = genInclude(data)

        if (this.Hook.beforeGet) {
            data = this.Hook.beforeGet(data, req)
        }

        this.DataModel._get.call(this.DataModel, {
            id: id,
            data: data,
            user: req.currentUser,
            include: include
        })
        .then(result => {
            if (this.Hook.afterGet) {
                result = this.Hook.afterGet(result)
            }
            result = dataWithPublicUser(result)
            res.send(result)
            APIStatus.mark('get', this.name)
        })
        .catch(err => {
            res.status(err.code)
            res.send(err)
        })
    }

    findLoader (req) {
        let data = Object.assign({}, req.query)

        const include = genInclude(data)
        const sort = genSort(data)
        const { limit, skip } = genPagi(data)

        if (this.Hook.beforeFind) {
            data = this.Hook.beforeFind(data, req)
        }

        return this.DataModel._find({
            data: data,
            user: req.currentUser,
            include: include,
            sort: sort,
            limit: limit,
            skip: skip
        })
    }

    findSender (result, res, req) {
        if (this.Hook.afterFind) {
            result = this.Hook.afterFind(result, req)
        }
        result = result.map(dataWithPublicUser)
        res.send(result)
        APIStatus.mark('find', this.name)
    }

    _find (req, res) {
        this.findQueue.add(req, res)
    }

    find (req, res) {
        let data = req.query

        const include = genInclude(data)
        const sort = genSort(data)
        const { limit, skip } = genPagi(data)

        if (this.Hook.beforeFind) {
            data = this.Hook.beforeFind(data, req)
        }
        this.DataModel._find.call(this.DataModel, {
            data: data,
            user: req.currentUser,
            include: include,
            sort: sort,
            limit: limit,
            skip: skip
        })
        .then(result => {
            if (this.Hook.afterFind) {
                result = this.Hook.afterFind(result, req)
            }
            result = result.map(dataWithPublicUser)
            res.send(result)
        })
        .catch(err => {
            res.status(err.code)
            res.send(err)
        })
    }

    update (req, res) {
        const id = req.params.id
        let data = dataFormat(req.body, this.Key, req.currentUser, 'update')

        if (this.Hook.beforeUpdate) {
            data = this.Hook.beforeUpdate(data, req)
        }

        let yeildUpdate
        if (this.Hook.yeildUpdate) {
            yeildUpdate = this.Hook.yeildUpdate
        } else {
            yeildUpdate = () => Promise.resolve(data)
        }

        yeildUpdate(data, req)
            .then(data => {
                return this.DataModel._update({
                    id: id,
                    data: data,
                    user: req.currentUser
                })
            })
            .then(result => {
                if (this.Hook.afterUpdate) {
                    this.Hook.afterUpdate(result)
                }
                res.send(result)
                APIStatus.mark('update', this.name)
            })
            .catch(err => {
                res.status(err.code)
                res.send(err)
            })
    }

    count (req, res) {
        const data = req.query

        this.DataModel._count.call(this.DataModel, {
            data: data,
            user: req.currentUser
        })
        .then(result => {
            if (this.Hook.afterCount) {
                this.Hook.afterCount(result)
            }
            res.send(result)
            APIStatus.mark('count', this.name)
        })
        .catch(err => {
            res.status(err.code)
            res.send(err)
        })
    }

    delete (req, res) {
        const id = req.params.id

        if (this.Hook.beforeDelete) {
            this.Hook.beforeDelete(id, req)
        }

        this.DataModel._delete.call(this.DataModel, {
            id: id,
            user: req.currentUser
        })
        .then(result => {
            if (this.Hook.afterDelete) {
                this.Hook.afterDelete(result)
            }
            res.send(result)
            APIStatus.mark('delete', this.name)
        })
        .catch(err => {
            res.status(err.code)
            res.send(err)
        })
    }
}

module.exports = APILayer