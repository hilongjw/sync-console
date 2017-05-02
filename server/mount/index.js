'use strict'

const fs = require('fs')
const path = require('path')

const isJS = /\.js/

function parseService (service, servicePath) {
    return {
        method: service.method ||'get',
        path: servicePath,
        handler: service.handler
    }
}

function flatten (arr) {
    const newArr = []
    return newArr.concat.apply(newArr, arr)
}

function loadService (filePath) {
    const mod = require(filePath)

    if (!mod instanceof(Object)) throw new Error('failed at loadService: module must export object')

    const serviceList = Object.keys(mod).map(servicePath => {
        return parseService(mod[servicePath], servicePath)
    })

    return serviceList
}

function serviceMount (service, router) {
    router[service.method](service.path, service.handler)
}

function routerMount (router, dir) {
    fs.readdir(dir, (err, data) => {
        if (err) throw err

        data
            .filter(file => isJS.test(file))
            .map(file => path.resolve(dir, file))
            .map(loadService)
            .reduce((p, c, i, l) => flatten(l))
            .map(service => serviceMount(service, router))
    })
}

module.exports = routerMount
