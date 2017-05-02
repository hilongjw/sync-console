'use strict'
const path = require('path')
const Koa = require('koa')
const router = require('koa-router')()
const serve = require('koa-static')
const Config = require('./config')

const app = new Koa()

// global
let WEBPACK_HASH = global.WEBPACK_HASH = require('./config/webpack-hash') || ''
const NODE_ENV = global.NODE_ENV = process.env.NODE_ENV || 'production'

// router mount
const routerMount = require('./server/mount')
routerMount(router, path.resolve(__dirname, 'server/routers'))

app.use(serve(__dirname + '/public'))
app.use(router.routes())
app.use(router.allowedMethods())

// dev-webpack
const isDev = /development/

if (isDev.test(NODE_ENV)) {
    const webpack = require('webpack')
    const koaWebpack = require('koa-webpack')

    const webpackConfig = require('./build/webpack.config')
    const compiler = webpack(webpackConfig)

    compiler.plugin('emit', function (compilation, callback) {
        WEBPACK_HASH = global.WEBPACK_HASH = compilation.hash
        callback()
    })

    const koaWebpackMiddleware = koaWebpack({
        compiler: compiler,
        dev: {
             noInfo: true,
             stats: {
                colors: true
            }
        }
    })

    app.use(koaWebpackMiddleware)
}


const server = app.listen(Config.PORT)

console.log(`listening on port ${ Config.PORT }`);

module.exports = app
