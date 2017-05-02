'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = new Schema({
    name: {
        type: String,
        default: ''
    },
    intro: {
        type: String,
        default: ''
    },
    link: {
        type: String,
        default: ''
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})
