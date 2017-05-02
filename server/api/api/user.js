'use strict'
const MD5 = require('md5')

const APILayer = require('../layer')
const User = require('../model/index').User
const Utils = require('../layer/utils')

const getSomeFields = Utils.getSomeFields
const UserParams = Utils.UserParams

const userError = {
    nonFields: {
        code: 400,
        message: '填写数据不完整'
    },
    unInvite: {
        code: 400,
        message: '邀请码输入不正确'
    },
    unMatchVerify: {
        code: 400,
        message: '验证码输入不正确'
    },
    DB: {
        code: 500,
        message: '服务器开小差了'
    },
    unMatchPwd: {
        code: 400,
        message: '用户名或密码输入不正确'
    },
    repeat: {
        code: 400,
        message: '该用户名已经被注册'
    }
}

const API = new APILayer({
    Name: 'user',
    UserKey: '_id',
    Model: User,
    Auth: {
        create: 1,
        get: 2,
        find: 2,
        update: 11,
        delete: 100
    },
    Key: {
        admin: {
            username: String,
            role: String,
            sessionToken: String,
            phone: String,
            avatar: String
        },
        user: {
            username: String,
            phone: String,
            avatar: String
        }
    },
    Hook: {
        afterGet (data, req) {
            return getSomeFields(data, UserParams.public)
        },
        afterFind (data, req) {
            return data.map(user => {
                return getSomeFields(user, UserParams.public)
            })
        }
    }
})

function newToken () {
    let code = Date.now() + ''
    let i = 0
    while (i < 256) {
        i++
        code += Math.floor(Math.random() * 10)
    }
    return MD5(code)
}

function getSalt () {
    return 'UMOON_$#%@@!##!@><'
}

function encryptPassword (password) {
    return MD5(password + getSalt())
}

function checkLength ({ value, min, max, name }) {
    if (!value) {
        return {
            code: 400,
            message: name + '长度至少' + min + '位'
        }
    }
    if (min && value.length < min) {
        return {
            code: 400,
            message: name + '长度至少' + min + '位'
        }
    }
    if (max && value.length > max) {
        return {
            code: 400,
            message: name + '最多' + max + '位'
        }
    }
}

function findUserByName (name) {
    return new Promise((resolve, reject) => {
        API.DataModel.get({
            data: {
                username: name
            },
            user: {
                role: 'system'
            }
        })
        .then(user => {
            resolve(user)
        })
        .catch(err => {
            if (err && err.code === 404) {
                resolve()
            } else {
                reject(err)
            }
        })
    })
}
const inviteCode = '!LU0J1LAB'

function signUp (req, res) {
    const { username, password, invite } = req.body

    if (invite !== inviteCode) {
        return res.status(userError.unInvite.code).send(userError.unInvite)
    }

    let lenCheck = checkLength({
        value: username,
        min: 3,
        max: 16,
        name: '用户名'
    })

    if (lenCheck) {
        res.status(lenCheck.code)
        return res.send(lenCheck)
    }

    lenCheck = checkLength({
        value: password,
        min: 6,
        max: 32,
        name: '用户名'
    })

    if (lenCheck) {
        res.status(lenCheck.code)
        return res.send(lenCheck)
    }

    findUserByName(username)
    .then(user => {
        if (user) {
            return Promise.reject(userError.repeat)
        } else {
            return API.DataModel._create({
                data: {
                    avatar: '//static.umoon.net/4a05c461b52364a1439523a405ef35eb.png',
                    username: username,
                    sessionToken: newToken(),
                    password: encryptPassword(password),
                    role: 'user'
                },
                user: {
                    role: 'system'
                }
            })
        }
    })
    .then(user => {
        res.send(user)
    })
    .catch(err => {
        res.status(err.code)
        res.send(err)
    })
}

function signIn (req, res) {
    const { username, password } = req.body

    API.DataModel._get({
        data: {
            username: username,
            password: encryptPassword(password)
        },
        user: {
            role: 'system'
        }
    })
    .then(user => {
        res.send(user)
    })
    .catch(err => {
        if (err && err.code === 404) {
            err = userError.unMatchPwd
            res.status(err.code)
            res.send(err)
        } else {
            res.status(err.code)
            res.send(err)
        }
    })
}

module.exports = {
    api: API,
    name: API.name,
    methods: {
        signup: {
            handler: signUp,
            method: 'post'
        },
        signin: {
            handler: signIn,
            method: 'post'
        },
        update: {
            handler: API.update.bind(API),
            auth: 'force'
        },
        find: {
            handler: API.find.bind(API),
            auth: 'ask'
        },
        get: {
            handler: API.get.bind(API),
            auth: 'ask'
        },
        delete: {
            handler: API.delete.bind(API),
            auth: 'force'
        }
    }
}
