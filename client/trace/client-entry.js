import { app } from './app'

const el = document.createElement('div')
document.body.appendChild(el)

console.log('will mount')

app.$mount(el)

const logEl = el.cloneNode(true)
logEl.id = 'rdLog'

document.body.appendChild(logEl)

const defaultOptions = {
    el: logEl // '.selector'
}

class LogDash {
    constructor (options) {
        this.options = Object.assign({}, defaultOptions, options)

        this.state = {
            clickCount: 0
        }

        this.options.el.addEventListener('click', this.clickMark.bind(this))
    }

    clickMark () {
        console.log(this)
        this.state.clickCount++
        if (this.state.clickCount > 5) {
            this.show()
        }
    }

    show () {
        app.show()
    }

    hide () {
        app.hide()
    }
}

const logger = new LogDash()

export default logger
