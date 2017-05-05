import stringify from 'json-stringify-safe'
import SystemInfo from './lib/log-cat/system'
import Event from './lib/log-cat/event'
import {
    setStorage,
    getStorage,
    isFunction,
    checkFlag,
    getUniqueId
} from '../../utils'

class SyncConsole extends Event {
    constructor () {
        this.options = {
            server: 'http://127.0.0.1:8666/',
            maxLogCount: 30
        }

        this.client = undefined

        this.state = {
            role: 'client' // 'remote'
        }

        this.system = SystemInfo.init()

        SystemInfo.info((err, data) => {
            if (err) console.error(err)
            this.system = data
        })

        this.logQueue = []
        this.historyQueue = this.load()
        this.errorQueue = []
        this.netWorkQueue = []

        this.mock()
    }

    save () {
        const str = JSON.stringify(this.historyQueue)
        const sucsess = setStorage('historyQueue', str)
        if (!sucsess) this.historyQueue = []
    }

    load () {
        const localStr = getStorage('historyQueue') || '[]'
        let queue = []

        try {
            queue = JSON.parse(localStr)
        } catch (e) {
            console.error(e)
        }

        return queue
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

        clearTimeout(this.timer)
        this.timer = setTimeout(this.save.bind(this), 100)
    }

        mockConsole (methods) {
        methods.map(method => {
            let old = console[method]
            let vm = this
            console[method] = function (...args) {
                if (!args || !args.length) {
                    return old.apply(console, args)
                }

                vm.write(method, JSON.parse(stringify(args, stringifyVue)))

                old.apply(console, args)
            }
        })
    }

    mockOnError () {
        TraceKit.collectWindowErrors = false
        this.windowOnError = window.onerror
        window.onerror = (message, source, lineNo, colNo, error) => {
            const stack = error && TraceKit.computeStackTrace(error)
            if (!stack) return console.log('simple report')

            const err = {
                name: stack.name,
                message: message,
                source: source,
                lineNo: lineNo,
                colNo: colNo,
                error: error,
                stack: stack.stack
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
            // data.loading = true
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

    addNetworkQueue (net) {
        let has = false
        for (let i = 0, len = this.netWorkQueue.length; i < len; i++) {
            if (this.netWorkQueue[i]._requestId === net._requestId) {
                has = true
                this.netWorkQueue[i] = net
                break
            }
        }
        if (!has) {
            this.netWorkQueue.push(net)
        }
        if (this.socket) {
            this.socket.emit('sync-update', {
                remoteAdmin: this.remoteAdmin,
                net: net
            })
        }
    }

    addOrUpdateRequest (req) {
        let has = false
        let net
        for (let i = 0, len = this.netWorkQueue.length; i < len; i++) {
            if (this.netWorkQueue[i]._requestId === req._requestId) {
                has = true
                net = this.requestFormat(req, this.netWorkQueue[i])
                break
            }
        }
        if (!has) {
            net = this.requestFormat(req, {
                _requestId: req._requestId,
                startTime: 0,
                costTime: 0,
                status: 0,
                header: '',
                headers: {},
                response: '',
                url: req._URL
            })
        }

        this.addNetworkQueue(net)
    }

    mockXMLHttpRequest () {
        if (!window.XMLHttpRequest) return
        const ignoreReg = /socket.io/
        const noop = () => {}
        let that = this
        let _open = window.XMLHttpRequest.prototype.open

        window.XMLHttpRequest.prototype.open = function (...args) {
            let XMLReq = this
            let url = args[1]
            const _onprogress = this.onprogress || noop
            const _onload = this.onload || noop
            XMLReq._requestId = getUniqueId()
            XMLReq._URL = url

            let _onreadystatechange = XMLReq.onreadystatechange || noop

            if (!ignoreReg.test(url)) {
                XMLReq.onreadystatechange = function () {
                    that.addOrUpdateRequest(this)
                    return _onreadystatechange.apply(XMLReq, arguments)
                }

                this.onprogress = function (...args) {
                    that.addOrUpdateRequest(this)
                    return _onprogress.apply(XMLReq, args)
                }

                this.onload = function (...args) {
                    that.addOrUpdateRequest(this)
                    return _onload.apply(XMLReq, args)
                }
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

export default SyncConsole
