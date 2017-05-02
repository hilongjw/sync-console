'use strict'
const fs = require('fs')
const path = require('path')
const express = require('express')
const TokenAuth = require('./service/user').TokenAuth

const Router = express.Router()
const isJS = /\.js/

const commonConfig = {
    create: {
        auth: 'force',
        method: 'post',
        path: '/{{name}}/'
    },
    find: {
        auth: 'force',
        method: 'get',
        path: '/{{name}}/'
    },
    update: {
        auth: 'force',
        method: 'put',
        path: '/{{name}}/:id'
    },
    get: {
        auth: 'ask',
        method: 'get',
        path: '/{{name}}/:id'
    },
    delete: {
        auth: 'force',
        method: 'delete',
        path: '/{{name}}/:id'
    }
}

function genPath (action, service) {
    let path = ''
    if (commonConfig[action]) {
        path = commonConfig[action].path.replace('{{name}}', service.name)
    } else {
        path = commonConfig['create'].path.replace('{{name}}', service.name) + action
    }
    return path
}

function parseService (link, APIS) {
    let service = require(link)
    Object.keys(service.methods).forEach(action => {
        if (typeof service.methods[action] === 'function') {
            APIS.push({
                auth: commonConfig[action].auth || 'ask',
                method: commonConfig[action].method || 'get',
                path: genPath(action, service),
                handler: service.methods[action]
            })
        } else if (typeof service.methods[action] === 'object') {
            APIS.push({
                auth: service.methods[action] && service.methods[action].auth || commonConfig[action] && commonConfig[action].auth || 'ask',
                method: service.methods[action].method || commonConfig[action] && commonConfig[action].method || 'get',
                path: genPath(action, service),
                handler: service.methods[action].handler
            })
        }
    })
}

function init (router) {
    fs.readdir(path.resolve(__dirname, './api'), (err, data) => {
        if (err) throw err
        let files = data.filter(file => isJS.test(file))
        files = files.map(file => path.resolve(__dirname, './api', file))
        let APIS = []
        files.map(filepath => parseService(filepath, APIS))
        APIMount(router, APIS)
    })
}

function APIMount (router, APIS) {
    APIS.forEach(route => {
        switch (route.auth) {
        case 'ask':
            router[route.method].apply(router, [route.path, TokenAuth.ask, route.handler])
            break
        case 'force':
            router[route.method].apply(router, [route.path, TokenAuth.force, route.handler])
            break
        default:
            router[route.method].apply(router, [route.path, route.handler])
        }
    })
    console.log(APIS)
}

init(Router)

module.exports = Router
