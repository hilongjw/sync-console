import Event from './event'
import MockConsole from './mock-console'
import MockNetwork from './mock-xhr'
import MockError from './mock-error'
import SocketClient from './socket-client'
import SystemInfo from './system'
import TraceKit from './trace-kit'

TraceKit.collectWindowErrors = false

class SyncConsole extends Event {
    constructor (options) {
        super()
        this.options = options

        this.remoteMode = false

        this.logQueue = []
        this.historyQueue = []
        this.netWorkQueue = []
        this.clientQueue = []

        this.mockConsole = null
        this.mockNetWork = null
        this.mockError = null

        this.scoketClient = null

        this.system = SystemInfo.init()

        SystemInfo.info((err, data) => {
            if (err) {
                console.error(err)
            }
            this.system = data
        })

        this.initConsole()
        this.initNetWork()
        this.initMockError()
        this.initClient()
    }

    initConsole () {
        this.mockConsole = new MockConsole()
        this.mockConsole.$on('new', this.newLog.bind(this))
    }

    newLog (log) {
        this.historyQueue.push(log)
        this.logQueue.push(log)
        this.$emit('newLog', log)
        this.scoketClient.$emit('ask-update', {
            log: log
        })
    }

    initNetWork () {
        this.netWork = new MockNetwork()
        this.netWork.$on('update', this.updateNetWrok.bind(this))
    }

    updateNetWrok (net) {
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
        this.$emit('newNet', net)
        this.scoketClient.$emit('ask-update', {
            net: net
        })
    }

    initMockError () {
        this.mockError = new MockError()
        this.mockError.$on('update', (err) => {
            console.log(err)
            this.$emit('newError')
        })
    }

    initClient () {
        this.scoketClient = new SocketClient(this.options.server + 'sync-console')
        this.scoketClient.init()

        this.scoketClient.$on('system', (cb) => {
            cb(this.system)
        })

        this.scoketClient.$on('ask-data', (cb) => {
            cb(null, {
                system: this.system,
                logQueue: this.logQueue,
                historyQueue: this.historyQueue,
                netWorkQueue: this.netWorkQueue
            })
        })

        this.scoketClient.$on('init', data => {
            this.system = data.system || {}
            this.logQueue = data.logQueue || []
            this.historyQueue = data.historyQueue || []
            this.netWorkQueue = data.netWorkQueue || []

            this.$emit('init-log', this.logQueue)
            this.$emit('init-net', this.netWorkQueue)
            this.$emit('init-history', this.historyQueue)
        })

        this.scoketClient.$on('update', data => {
            if (data.log) {
                this.newLog(data.log)
            }
            if (data.net) {
                this.updateNetWrok(data.net)
            }
        })

        this.scoketClient.$on('run-code', code => {
            this.execCommand(code)
        })

        this.scoketClient.$on('remote-mode', () => {
            this.remoteSync = true
        })

        this.scoketClient.$on('init-clients', () => {
            this.clientQueue = this.scoketClient.clientQueue
            this.$emit('init-clients', this.clientQueue)
        })

        this.scoketClient.$on('update-clients', () => {
            this.clientQueue = this.scoketClient.clientQueue
        })
    }

    setRemoteMode () {
        this.remoteMode = true
        this.scoketClient.remoteMode()
    }

    removeClient () {
        this.scoketClient.remove()
    }

    execCommand (code) {
        if (this.remoteSync) {
            return this.scoketClient.$emit('run-code-remote', code)
        }
        console.info(code)
        try {
            // eslint-disable-next-line
            let result = eval(code)
            console.info(result)
        } catch (e) {
            console.error(TraceKit.computeStackTrace(e))
        }
    }

    remove () {
        this.removeClient()
    }
}

export default SyncConsole
