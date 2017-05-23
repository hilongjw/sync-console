import { getParams } from './utils'
import MockConsole from './sync-console/mock-console'
import History from './sync-console/history'

const defaultOptions = {
    maxLogCount: 50,
    duration: 3 * 1000,
    clickCount: 5,
    server: process.env.__SYNC_CONSOLE_API_ || location.host,
    Vue: null
}

class SyncConsoleManager {
    constructor (options) {
        this.query = getParams()
        this.options = Object.assign({}, defaultOptions, this.query, options)
        this.app = undefined
        this.state = {
            clickCount: 0
        }
        this.mockConsole = null

        if (this.options.el) this.mount(this.options.el)

        this.check()
        this.initLogHistory(this.options)
    }

    mount (selector) {
        let el
        try {
            el = window.document.querySelector(selector)
        } catch (e) {
            console.error(e)
        }
        if (!el) return console.error('error at mount: invalid selector %s', selector)
        el.addEventListener('click', this.clickMark.bind(this))
    }

    initLogHistory (options) {
        this.history = new History(options)
        this.mockConsole = new MockConsole({
            methods: options.consoleMethods
        })

        this.mockConsole.$on('new', log => {
            this.history.queue.push(log)
            this.history.save()
        })
    }

    destroyLogHistory () {
        if (this.mockConsole) {
            this.mockConsole.destroy()
            this.mockConsole = null
        }
        if (this.history) {
            this.history.destroy()
            this.history = null
        }
    }

    // async load sync console core
    initSyncConsole () {
        if (this.syncConsole) {
            this.destroyLogHistory()
            return Promise.resolve()
        }
        return import('./sync-console')
            .then(module => {
                const SyncConsole = module.default
                this.destroyLogHistory()
                this.syncConsole = new SyncConsole(this.options)
                return this.syncConsole
            })
            .catch(err => {
                console.error(err)
            })
    }

    check () {
        if (this.options._sync_console_show) {
            this.show()
        } else if (this.options._sync_console_remote) {
            this.initSyncConsole()
        }
    }

    startReset () {
        clearInterval(this.timer)
        this.timer = setInterval(() => {
            this.state.clickCount = 0
        }, this.options.duration)
    }

    clickMark () {
        if (!this.timer) this.startReset()
        this.state.clickCount++

        if (this.state.clickCount > this.options.clickCount) {
            this.show()
            this.state.clickCount = 0
            clearInterval(this.timer)
            this.timer = undefined
        }
    }

    loadApp () {
        if (this.app) return Promise.resolve(this.app)
        let app
        return import('./app')
            .then(module => {
                app = module
                return this.initSyncConsole()
            })
            .then(() => {
                this.app = app.install(this.syncConsole)
                return this.app
            })
    }

    // for async load log ui
    show () {
        this.loadApp()
            .then(app => {
                app.show()
                if (this.query._sync_console_token) {
                    app.startRemote()
                }
            })
    }

    hide () {
        this.app.hide()
    }
}

export default SyncConsoleManager
