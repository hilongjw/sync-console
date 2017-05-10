import { getParams } from './utils'
import SyncConsole from './sync-console'

const defaultOptions = {
    maxLogCount: 50,
    duration: 3 * 1000,
    clickCount: 10,
    server: '/',
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

        this.syncConsole = new SyncConsole(this.options)

        if (this.options.el) this.mount(this.options.el)

        this.check()
    }

    mount (selector) {
        let el
        try {
            el = window.document.body.querySelector(selector)
        } catch (e) {
            console.error(e)
        }
        if (!el) return
        el.addEventListener('click', this.clickMark.bind(this))
    }

    check () {
        if (this.options._sync_console_show) {
            this.show()
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
        return import('./app')
            .then(module => {
                this.app = module.install(this.syncConsole)
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
