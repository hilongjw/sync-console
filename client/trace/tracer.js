import LogManager from './lib/log-cat'

const el = document.createElement('div')
el.id = 'ddd'
el.setAttribute('style', 'height: 20px; width: 20px; background: red;')
document.body.appendChild(el)

const defaultOptions = {
    el: '#ddd', // default window
    clickCount: 5, // in 10s
    maxLogCount: 50,
    report: 'http://xxxxx.com/api/report',
    Vue: null
}

class LogTracer {
    constructor (options) {
        this.options = Object.assign({}, defaultOptions, options)
        
        this.state = {
            clickCount: 0
        }

        window.logManager =  this.logManager = new LogManager({
            maxLogCount: this.options.maxLogCount,
            report: this.options.report,
            socket: this.options.socket
        })

        if (options.Vue) {
            options.Vue.config.errorHandler = (function () {
                this.logManager.errorHandler(arguments)
            }).bind(this)
        }

        const el = window.document.body.querySelector(this.options.el)

        if (!el) {
            return console.error('invalid el selector with LogTracer')
        }

        el.addEventListener('click', this.clickMark.bind(this))

        this.startReset()
        this.show()    
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
        import('./app')
            .then(module => {
                const app = module.install(this.logManager)
                app.show()
            })
    }

    hide () {
        this.startReset()
        app.hide()
    }
}

export default LogTracer