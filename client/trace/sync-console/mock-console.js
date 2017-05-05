import Event from './event'
import stringify from 'json-stringify-safe'
import stringifyVue from './vue-state'

class MockConsole extends Event {
    constructor (options = {}) {
        super()
        this.options = {
            methods: options.methods || ['log', 'warn', 'info', 'error']
        }
        this.logIndex = 0
        this.mockConsole(this.options.methods)
    }

    mockConsole (methods) {
        methods.map(method => {
            let old = console[method]
            let vm = this

            console[method] = function (...args) {
                if (!args || !args.length) {
                    return old.apply(console, args)
                }

                const log = {
                    id: this.logIndex++,
                    type: method,
                    date: Date.now(),
                    args: JSON.parse(stringify(args, stringifyVue))
                }

                vm.$emit('new', log)

                old.apply(console, args)
            }
        })
    }
}

export default MockConsole
