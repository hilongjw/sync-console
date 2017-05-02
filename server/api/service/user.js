const UserApi = require('../api/user').api

const ErrorMap = {
    401: {
        code: 401,
        message: '该API需要登录才能访问'
    }
}

function findUserByToken (token) {
    return UserApi.DataModel._get({
        data: {
            sessionToken: token
        },
        user: {
            role: 'system'
        }
    })
}

const TokenAuth = {
    ask: (req, res, next) => {
        const token = req.headers['authorization'] || req.query.authorization
        if (!token) return next()

        findUserByToken(token)
            .then(user => {
                req.currentUser = user
                next()
            })
            .catch(() => {
                next()
            })
    },
    force: (req, res, next) => {
        const token = req.headers['authorization'] || req.query.authorization

        if (!token) return res.status(ErrorMap[401].code).send(ErrorMap[401])

        findUserByToken(token)
            .then(user => {
                req.currentUser = user
                next()
            })
            .catch(() => {
                let err = ErrorMap[401]
                res.status(err.code).send(err)
            })
    }
}

module.exports = {
    TokenAuth
}
