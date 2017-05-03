import SystemInfo from '../system'
import { getRandomKey, isFunction } from '../../utils'
import io from 'socket.io-client'

export default class LogManager {
    constructor (props) {
        this.options = {
            maxLogCount: props.maxLogCount || 50,
            report: props.report,
            socket: props.socket
        }

        this.logQueue = []
        this.historyQueue = this.load()
        this.errorQueue = []
        this.logIndex = 0
        this.system = {}
        this.listeners = {}

        SystemInfo.info((err, data) => {
            this.system = data
        })

        this.mock(['log', 'error', 'warn'])
        this.initSocket()
    }

    initSocket () {
        this.socket = io.connect(this.options.socket)
        this.socket.on('connect', () => {
            this.socket.emit('regist', {
                system: this.system
            })

            this.socket.on('run-code', (data) => {
                this.execCommand(data.code)
            })
        })
    }

    $on (type, cb) {
        if (!this.listeners[type]) this.listeners[type] = []
        this.listeners[type].push(cb)
        return this.listeners[type].length - 1
    }

    $off (type, cb) {
        if (!this.listeners[type] || !this.listeners[type].length) return
        if (!cb) {
            this.listeners[type].map(cb => cb = null)
            this.listeners[type] = []
        }
        if (typeof cb === 'function') {
            this.listeners[type].map((func, i) => {
                if (func === cb) {
                    this.listeners[type].splice(i, 1)
                    func = null
                }
            })
        }
        if (typeof cb === 'number') {
            this.listeners[type].splice(cb, 1)
        }
    }

    $emit (...args) {
        if (!args.length) return
        const type = args[0]
        args.shift()
        if (this.listeners[type] && this.listeners[type].length) {
            this.listeners[type].map(cb => {
                cb.apply(null, args)
            })
        }
    }

    toJSON () {
        return 'LogManager'
    }

    clearHistory () {
        this.historyQueue = []
        this.save()
        this.$emit('clearHistory')
    }

    clear () {
        this.logQueue = []
        this.$emit('clear')
    }

    errorHandler (error, vm, info) {
        console.debug(error, vm)
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

        this.$emit('newLog', log)

        this.socket.emit('run-code-callback', log)

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

    execCommand (code) {
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

            console.error(message, ' source: ' + source + ' lineNo: ' + lineNo + ' colNo: '+ colNo + ' ', error)

            if (isFunction(this.windowOnError)) {
                this.windowOnError.call(window, message, source, lineNo, colNo, error)
            }
        }
    }

    mock (methods) {
        this.mockConsole(methods)
        this.mockOnError()
    }
}