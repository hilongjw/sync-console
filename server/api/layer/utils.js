'use strict'

const UserParams = {
    admin: ['_id', 'black', 'username', 'role', 'sessionToken', 'avatar', 'createdAt', 'updatedAt'],
    self: ['_id', 'username', 'black', 'role', 'sessionToken', 'avatar', 'createdAt', 'updatedAt'],
    public: ['_id', 'username', 'role', 'avatar', 'createdAt', 'updatedAt'],
}

function dataWithPublicUser (data) {
    if (!data.user) return data
    if (!data.user._id) return data

    let tmp = JSON.parse(JSON.stringify(data))
    tmp.user = getSomeFields(tmp.user, UserParams.public)
    return tmp
}

const checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$")

function isMongoId (str) {
    return checkForHexRegExp.test(str)
}

function toNumber (val) {
    let skip = Number(val)
    skip = Number.isNaN(skip) ? 0 : skip
    return skip
}

function isMongoIdsArray (str) {
    let done = true
    let arr = []

    try {
        arr = JSON.parse(str)
    } catch (e) {
        return false
    }

    if (!arr instanceof Array) {
        return false
    }

    arr.forEach(tag => {
        if (!isMongoId(tag)) {
            done = false
        }
    })

    if (done) {
        return arr
    } else {
        return false
    }

}

function toArray (str) {
    if (str instanceof Array) {
        return str
    }
    let tags = []
    try {
        tags = JSON.parse(str)
    } catch (e) {
        tags = []
    }
    return tags
}

function toObject (str) {
    if (str instanceof Object) {
        return str
    }
    let obj
    try {
        obj = JSON.parse(str)
    } catch (e) {
        obj = {}
    }
    return obj
}

function paramsCheck (data, keys) {
    let error = false
    let message = ''
    keys.forEach(key => {
        if (!data[key]) {
            error = true
            message += key + ' is must be required; '
        }
    })
    return {
        error: error,
        code: 428,
        message: message
    }
}

function getSomeFields (obj, keys) {
    let data = {}
    keys.map(key => {
        data[key] = obj[key]
    })
    return data
}

function handleError (err, res, detail) {
    if (!res || !res.send) return console.log('miss res?!')
    console.log('handleError--------', err, detail)

    let message
    let code

    if (err && err.name) {
        if (err.name === 'MongoError') {
            switch (err.code) {
                case 11000:
                    if (detail && detail.from === 'sign') {
                        code = 409
                        message = '用户名已经被使用啦，请更换一个尝试'
                    }
                    break
                default: 
            }
        }
    }

    if (detail) {
        if (detail.message) {
            message = detail.message
        }
        if (detail.code) {
            code = detail.code
        }
    }

    if (code) {
        res.status(code)
    } else {
        res.status(500)
    }

    res.send({
        code: code,
        message: message
    })
}

function firstToUpperCase (type) {
    let arr = type.split('')
    arr[0] = arr[0].toUpperCase()
    return arr.join('')
}

module.exports = {
    paramsCheck,
    getSomeFields,
    handleError,
    UserParams,
    dataWithPublicUser,
    toNumber,
    toArray,
    toObject,
    isMongoId,
    isMongoIdsArray,
    firstToUpperCase
}