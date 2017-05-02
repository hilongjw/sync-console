'use strict'

const mongoose = require('mongoose')
const updatedAt = require('./plugin/updated-at')
mongoose.Promise = global.Promise

const ArticleSchema = require('./schema/article')
const UserSchema = require('./schema/user')
const ProjectSchema = require('./schema/project')

const Article = mongoose.model('Article', ArticleSchema)
const User = mongoose.model('User', UserSchema)
const Project = mongoose.model('Project', ProjectSchema)

mongoose.plugin(updatedAt, { index: true })

module.exports = {
    Article,
    User,
    Project
}
