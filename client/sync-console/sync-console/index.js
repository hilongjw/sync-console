import Event from './event'
import MockConsole from './mock-console'
import MockNetwork from './mock-xhr'
import MockError from './mock-error'
import SocketClient from './socket-client'
import SystemInfo from './system'
import TraceKit from './trace-kit'
import History from './history'

TraceKit.collectWindowErrors = false

class SyncConsole extends Event {
    constructor (options) {
        super()
        this.options = options

        this.remoteMode = false
        this._history = new History(this.options)

        this.logQueue = []
        this.historyQueue = this._history.queue
        this.netWorkQueue = []
        this.clientQueue = []

        this.mockConsole = null
        this.mockNetWork = null
        this.mockError = null

        this.scoketClient = null

        this.systemInfo = new SystemInfo()
        this.system = this.systemInfo.data

        this.systemMemory = []

        // SystemInfo.info((err, data) => {
        //     if (err) console.error(err)
        //     this.system = data
        // })

        this.initConsole({
            methods: this.options.consoleMethods
        })
        this.initNetWork()
        this.initMockError({
            Vue: this.options.Vue
        })

        this.socketOptions = {
            nsp: this.options.server + 'sync-console',
            token: this.options._sync_console_token,
            project: this.options.project
        }

        if (this.options._sync_console_remote) {
            this.initClient()
        }
    }

    initConsole (options) {
        this.mockConsole = new MockConsole(options)
        this.mockConsole.$on('new', this.newLog.bind(this))
    }

    newLog (log) {
        this.historyQueue.push(log)
        this.logQueue.push(log)
        this.$emit('update-log', log)
        this.scoketClient && this.scoketClient.$emit('ask-update', {
            log: log
        })
    }

    initNetWork () {
        this.mockNetWork = new MockNetwork()
        this.mockNetWork.$on('update', this.updateNetWrok, this)
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
        this.$emit('update-net', net)
        this.scoketClient && this.scoketClient.$emit('ask-update', {
            net: net
        })
    }

    initMockError (options) {
        this.mockError = new MockError(options)
        this.mockError.$on('update', (err) => {
            console.error(err)
            this.$emit('new-error')
        })
    }

    initClient () {
        if (this.scoketClient) return Promise.resolve(this.scoketClient.client)
        this.scoketClient = new SocketClient(this.socketOptions)

        return this.scoketClient.init()
            .then(() => {
                this.scoketClient.$emit('system', this.system)

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
                return this.scoketClient.client
            })
            .catch(err => {
                console.debug(err)
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
        console.log(code)
        try {
            // eslint-disable-next-line
            const result = eval(code)
            console.log(result)
        } catch (e) {
            console.error(TraceKit.computeStackTrace(e))
        }
    }

    remove () {
        this.removeClient()
    }
}

export default SyncConsole
