'use strict'
const APILayer = require('../layer')
const Project = require('../model/index').Project

const API = new APILayer({
    Name: 'project',
    UserKey: 'user',
    Model: Project,
    Auth: {
        create: 2,
        get: 2,
        find: 2,
        update: 11,
        delete: 11
    },
    Key: {
        admin: {
            name: String,
            intro: String,
            link: String
        },
        user: {
            name: String,
            intro: String,
            link: String
        }
    },
    Hook: {
        beforeCreate (data, req) {
            data.user = req.currentUser._id
            return data
        }
    }
})

module.exports = {
    api: API,
    name: API.name,
    methods: {
        create: {
            handler: API.create.bind(API),
            auth: 'force'
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
