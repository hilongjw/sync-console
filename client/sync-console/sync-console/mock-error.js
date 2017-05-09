import Event from './event'
import TraceKit from './trace-kit'
import stringifyVue from './vue-state'
import { isFunction } from '../utils'

class MockError extends Event {
    constructor (options = {}) {
        super()
        this.options = options
        this.mockOnError()
        if (this.options.Vue) {
            this.options.Vue.config.errorHandler = (...args) => {
                this.VueErrorHandler.apply(this, args)
            }
        }
    }

    VueErrorHandler (error, vm, info) {
        const stack = TraceKit.computeStackTrace(error)
        if (!stack) {
            return console.error(error, stringifyVue('', vm), info)
        }
        let lineNo
        let colNo

        if (stack.stack.length) {
            lineNo = stack.stack[0].line
            colNo = stack.stack[0].column
        }

        this.$emit('update', {
            lineNo: lineNo,
            colNo: colNo,
            source: stack.url,
            name: stack.name,
            error: error,
            message: error.message,
            stack: stack.stack,
            info: info,
            vm: stringifyVue('', vm)
        })
    }

    mockOnError () {
        TraceKit.collectWindowErrors = false
        this.windowOnError = window.onerror
        window.onerror = (message, source, lineNo, colNo, error) => {
            const stack = error && TraceKit.computeStackTrace(error)
            if (!stack) return console.error(message, source, lineNo, colNo, error)

            const err = {
                name: stack.name,
                message: message,
                source: source,
                lineNo: lineNo,
                colNo: colNo,
                error: error,
                stack: stack.stack
            }

            this.$emit('update', err)

            if (isFunction(this.windowOnError)) {
                this.windowOnError.call(window, message, source, lineNo, colNo, error)
            }
        }
    }
}

export default MockError
