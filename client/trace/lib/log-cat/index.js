import SystemInfo from '../system'
import Event from './event'
import { getRandomKey, isFunction } from '../../utils'
import stringify from 'json-stringify-safe'
import stringifyVue from './vue-instance'

function getUniqueID () {
    let id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8)
        return v.toString(16)
    })
    return id
}

function formatHeader (header) {
    let headers = {}
    let tmp = []

    header
        .split('\n')
        .map(item => {
            tmp = item.split(':')
            if (item && tmp.length) {
                headers[tmp[0]] = tmp[1]
            }
        })

    return headers
}

export default class LogManager extends Event {
    constructor (props) {
        super()
        this.options = {
            maxLogCount: props.maxLogCount || 50,
            report: props.report,
            socket: props.socket
        }

        this.logQueue = []
        this.historyQueue = this.load()
        this.errorQueue = []
        this.netWorkQueue = []
        this.logIndex = 0
        this.system = {}

        SystemInfo.info((err, data) => {
            this.system = data
        })

        this.mock(['log', 'error', 'warn'])
        this.initSocket()
    }

    initSocket () {
        import('socket.io-client')
            .then(io => {
                this.socket = io.connect(this.options.socket)
                this.socket.on('connect', () => {
                    this.socket.emit('regist', {
                        system: this.system
                    })

                    this.socket.on('run-code', (data) => {
                        this.execCommand(data.code)
                    })
                })
            })
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
        this.report({
            message: error.message,
            stack: error.stack,
            info: info,
            vm: vm
        })
    }

    report ({ message, stack, info, vm, source, lineNo, colNo }) {
        let reportData = {
            requestId: getRandomKey(),
            message: message,
            stack: stack,
            info: info,
            source: source,
            lineNo: lineNo,
            colNo: colNo,
            vue: vm,
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

                vm.write.call(vm, method, JSON.parse(stringify(args, stringifyVue)))

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
                stack: error && error.stack
            }

            this.errorQueue.push(err)

            this.report(err)

            if (isFunction(this.windowOnError)) {
                this.windowOnError.call(window, message, source, lineNo, colNo, error)
            }
        }
    }

    requestFormat (req, data) {
        switch (req.readyState) {
            case 0:
            case 1:
                // UNSENT OPENED
                data.startTime = Date.now()  
                break
            case 2:
                // HEADERS_RECEIVED
                data.header = req.getAllResponseHeaders()
                break
            case 3:
                // LOADING
                data.state = 1
                break
            case 4:
                // DONE
                data.header = req.getAllResponseHeaders()
                data.headers = formatHeader(data.header) 
                data.response = req.response
                data.endTime = Date.now()
                data.costTime = data.endTime - data.startTime
                break
        }
        data.status = req.status
        return data
    }

    addOrUpdateRequest (req) {
        let has = false
        for (let i = 0, len = this.netWorkQueue.length; i < len; i++) {
            if (this.netWorkQueue[i]._requestId === req._requestId) {
                has = true
                this.netWorkQueue[i] = this.requestFormat(req, this.netWorkQueue[i])
                break
            }
        }
        if (!has) {
            this.netWorkQueue.push(this.requestFormat(req, {
                _requestId: req._requestId,
                startTime: 0,
                costTime: 0,
                status: 0,
                header: '',
                headers: {},
                response: '',
                url: req._URL
            }))
        }
    }

    mockXMLHttpRequest () {
        if (!window.XMLHttpRequest) return
        let _XMLHttpRequest = window.XMLHttpRequest
        const noop = () => {}
        let self = this
        let _open = window.XMLHttpRequest.prototype.open
        let _send = window.XMLHttpRequest.prototype.send

        window.XMLHttpRequest.prototype.open = function(...args){
            let XMLReq = this
            let url = args[1]
            const _onprogress = this.onprogress || noop
            const _onload = this.onload || noop
            XMLReq._requestId = getUniqueID()
            XMLReq._URL = url

            let _onreadystatechange = XMLReq.onreadystatechange || function() {
                console.debug('no onreadystatechange event')
            }

            XMLReq.onreadystatechange = function () {
                self.addOrUpdateRequest.call(self, this)
                return _onreadystatechange.apply(XMLReq, arguments)
            }

            this.onprogress = function(...args){
                self.addOrUpdateRequest.call(self, this)
                return _onprogress.apply(XMLReq, args)
            }

            this.onload = function(...args) {
                self.addOrUpdateRequest.call(self, this)
                return _onload.apply(XMLReq, args)
            }

            return _open.apply(XMLReq, args)
        }
    }

    mock (methods) {
        this.mockConsole(methods)
        this.mockOnError()
        this.mockXMLHttpRequest()
    }
}