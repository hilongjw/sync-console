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
        this.oldMethodMap = {}
        this.mockConsole()
    }

    mockConsole () {
        const methods = this.options.methods
        methods.map(method => {
            this.oldMethodMap[method] = console[method]
            let old = console[method]
            let vm = this

            console[method] = function (...args) {
                if (!args || !args.length) {
                    return old.apply(console, args)
                }

                const log = {
                    id: vm.logIndex++,
                    type: method,
                    date: Date.now(),
                    args: JSON.parse(stringify(args, stringifyVue))
                }

                vm.$emit('new', log)

                old.apply(console, args)
            }
        })
    }

    destroy () {
        const methods = this.options.methods
        methods.map(method => {
            console[method] = this.oldMethodMap[method]
        })
        this.oldMethodMap = {}
    }
}

export default MockConsole
