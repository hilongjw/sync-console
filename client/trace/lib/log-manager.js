import SystemInfo from './system'
import { getRandomKey } from '../utils'

export default class LogManager {
    constructor (props) {
        this.options = {
            maxLogCount: props.maxLogCount || 50,
            report: props.report
        }

        this.logQueue = []
        this.historyQueue = this.load()
        this.errorQueue = []
        this.logIndex = 0
        this.system = {}

        SystemInfo.info((err, data) => {
            this.system = data
        })
        this.mock(['log', 'error', 'warn'])
    }

    toJSON () {
        return 'LogManager'
    }

    errorHandler (error, vm, info) {
        this.report({
            message: error.message,
            stack: error.stack,
            info: info
        })
    }

    report ({ message, stack, info, source, lineNo, colNo }) {
        let reportData = {
            requestId: getRandomKey(),
            message: message,
            stack: stack,
            info: info,
            source: source,
            lineNo: lineNo,
            colNo: colNo,
            historyQueue: this.historyQueue
        }
        console.debug('report to ' + this.options.report, reportData)
    }

    write (method, logs) {
        const log = {
            id: this.logIndex++,
            type: method,
            date: Date.now(),
            args: logs
        }
        if (this.historyQueue.length > this.options.maxLogCount) {
            this.historyQueue.shift()
        }
        this.historyQueue.push(log)
        this.logQueue.push(log)

        clearTimeout(this.timer)
        this.timer = setTimeout(this.save.bind(this), 100)
    }

    save () {
        const str = JSON.stringify(this.historyQueue)
        localStorage['LogManager'] = str
    }

    load () {
        const localStr = localStorage['LogManager'] || '[]'
        let queue = []

        try {
            queue = JSON.parse(localStr)
        } catch (e) {
            console.error(e)
        }

        return queue
    }

    evalCommand (code) {
        console.log(code)
        try {
            let result = eval(code)
            console.log(result)
        } catch (e) {
            console.error(e)
        }
    }

    mockConsole (methods) {
        methods.map(method => {
            let old = console[method]
            let vm = this
            console[method] = function (...args) {
                if (!args || !args.length) {
                    return old.apply(console, args)
                }
                vm.write.call(vm, method, args)
                old.apply(console, args)
            }
        })
    }

    mockOnError () {
        this.windowOnError = window.onerror
        window.onerror = (message, source, lineNo, colNo, error) => {
            const err = {
                message: message,
                source: source,
                lineNo: lineNo,
                colNo: colNo,
                error: error,
                stack: error.error
            }

            this.errorQueue.push(err)

            this.report(err)

            this.windowOnError.call(window, message, source, lineNo, colNo, error)
        }
    }

    mock (methods) {
        this.mockConsole(methods)
        this.mockOnError()
    }
}