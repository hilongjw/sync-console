import { getParams } from './utils'
import SyncConsole from './sync-console'

const defaultOptions = {
    maxLogCount: 50,
    server: '/',
    Vue: null
}

class SyncConsoleManager {
    constructor (options) {
        this.options = Object.assign({}, defaultOptions, options)
        this.app = undefined
        this.state = {
            clickCount: 0
        }
        this.query = getParams()

        this.syncConsole = new SyncConsole(options)

        const el = window.document.body.querySelector(this.options.el)

        if (!el) {
            console.warn('invalid el selector with LogTracer')
        } else {
            el.addEventListener('click', this.clickMark.bind(this))
        }

        this.startReset()
        this.check()
    }

    check () {
        if (this.query._sync_console_show) {
            this.show()
        }
    }

    startReset () {
        clearInterval(this.timer)
        this.timer = setInterval(() => {
            this.state.clickCount = 0
        }, 10 * 1000)
    }

    clickMark () {
        this.state.clickCount++
        if (this.state.clickCount > this.options.clickCount) {
            this.show()
            this.options.clickCount = 0
        }
    }

    loadApp () {
        if (this.app) return Promise.resolve(this.app)
        return import('./app')
            .then(module => {
                console.log(module)
                this.app = module.install(this.syncConsole)
                return this.app
            })
    }

    // for async load log ui
    show () {
        clearInterval(this.timer)

        this.loadApp()
            .then(app => {
                app.show()
                if (this.query._sync_console_token) {
                    app.startRemote()
                }
            })
    }

    hide () {
        this.startReset()
        this.app.hide()
    }
}

export default SyncConsoleManager
