import LogManager from './lib/log-cat'
import { checkFlag } from './utils'

const defaultOptions = {
    clickCount: 5, // in 10s
    maxLogCount: 50,
    server: '/',
    report: '',
    Vue: null
}

class LogTracer {
    constructor (options) {
        this.options = Object.assign({}, defaultOptions, options)
        this.app = undefined
        this.state = {
            clickCount: 0
        }

        window.logManager = this.logManager = new LogManager(this.options)

        if (options.Vue) {
            options.Vue.config.errorHandler = function () {
                window.logManager.errorHandler(arguments)
            }
        }

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
        if (checkFlag()) {
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

    show () {
        clearInterval(this.timer)
        // for async load log ui
        if (this.app) return this.app.show()

        import('./app')
            .then(module => {
                this.app = module.install(this.logManager)
                this.app.show()
            })
    }

    hide () {
        this.startReset()
        this.app.hide()
    }
}

export default LogTracer
