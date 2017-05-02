const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {
        type: String,
        trim: true,
        required: true,
        index: true
    },
    role: {
        type: String,
        required: true
    },
    gender: {
        type: String
    },
    password: {
        type: String,
        required: true,
        index: true
    },
    sessionToken: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    phone: {
        type: String,
        trim: true,
        index: true
    },
    avatar: {
        type: String,
        required: true
    },
    intro: String,
    black: Boolean,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = UserSchema
