'use strict'
const path = require('path')
const Koa = require('koa')
const router = require('koa-router')()
const serve = require('koa-static')
const Config = require('./config')
const cors = require('koa-cors')
const app = new Koa()

// global
let WEBPACK_HASH = global.WEBPACK_HASH = require('./config/webpack-hash') || ''
const NODE_ENV = global.NODE_ENV = process.env.NODE_ENV || 'production'

// router mount
const routerMount = require('./server/mount')
routerMount(router, path.resolve(__dirname, 'server/routers'))

app.use(cors())
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

app.use(serve(__dirname + '/public'))

const server = app.listen(Config.PORT)

const io = require('socket.io')(server)
const logTrace = io.of('/log')

const onlineClientQueue = {
    queue: [],
    add (client) {
        logTrace.emit('add-client', {
            id: client.id,
            system: client.data.system
        })
        this.queue.push(client)
    },
    remove (client) {
        console.log('start remove', this.queue.length)
        this.queue.map((c, i) => {
            if (c === client || c.id === client.id) {
                this.queue.splice(i, 1)
            }
        })
        logTrace.emit('remove-client', {
            id: client.id
        })
        console.log('removed', this.queue.length)
    }
}

logTrace.on('connection', function (socket) {
    console.log('connection')

    socket.on('regist', data => {
        socket.data = data
        onlineClientQueue.add(socket)
    })

    socket.on('run-code-callback', log => {
        logTrace.emit('run-code-callback', log)
    })

    socket.on('run-code', function (data) {
        onlineClientQueue.queue.map(c => {
            if (c.id === data.target) {
                c.emit('run-code', data)
            }
        })
    })

    socket.on('disconnect', function () {
        onlineClientQueue.remove(socket)
    })
})

router.get('/clients', ctx => {
    ctx.body = onlineClientQueue.queue.map(c => {
        return {
            id: c.id,
            system: c.data.system
        }
    })
})

console.log(`listening on port ${ Config.PORT }`)

module.exports = app
