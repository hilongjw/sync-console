'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = new Schema({
    alias: {
        type: String
    },
    title: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        default: ''
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
