import Event from './event'
import MockConsole from './mock-console'
import MockNetwork from './mock-xhr'
import MockError from './mock-error'
import SocketClient from './socket-client'
import SystemInfo from './system'
import TraceKit from './trace-kit'
import History from './history'

import { parseNode, diffElement, patchElement } from '../lib/dom-parse'

TraceKit.collectWindowErrors = false

class SyncConsole extends Event {
    constructor (options) {
        super()
        this.options = options

        this.remoteMode = false
        this.clientMode = true

        this._history = new History(this.options)

        this.logQueue = []
        this.historyQueue = this._history.queue
        this.netWorkQueue = []
        this.clientQueue = []

        this.mockConsole = null
        this.mockNetWork = null
        this.mockError = null

        this.elementTimer = null
        this.element = null

        this.scoketClient = null

        this.systemInfo = new SystemInfo()
        this.system = this.systemInfo.data
        this.systemInfo.$on('update', () => {
            this.system = this.systemInfo.data
        })

        this.initConsole({
            methods: this.options.consoleMethods
        })

        this.initNetWork({
            ignores: this.options.netIgnores // [ <regexp> ]
        })

        this.initMockError({
            Vue: this.options.Vue
        })

        this.socketOptions = {
            nsp: this.options.server + 'sync-console',
            token: this.options._sync_console_token,
            project: this.options.project,
            system: this.system
        }

        this.initElement()

        if (this.options._sync_console_remote) {
            this.initClient()
        }
    }

    initElement () {
        this.element = {
            key: 1,
            index: 0,
            is_SCONSOLE_DOM: true,
            tag: 'html',
            props: {},
            children: [] // [ /*<String>*/ /* <Node> */ ]
        } // parseNode(document.querySelector('html'))

        this.elementTimer = setInterval(() => {
            let element = parseNode(document.querySelector('html'))

            const patches = diffElement(element, this.element)

            patchElement(this.element, patches)

            this.$emit('update-element', this.element)

            if (!Object.keys(patches).length) return
            console.debug((JSON.stringify(patches).length / 1024).toFixed(2) + ' KB')
            // TODO diff and real-time
            // if (index % 2 === 0) {
            //     this.uploadSyncData({
            //         element: this.element
            //     })
            // }
        }, 50)
    }

    updateElement (element) {
        this.element = element
        this.$emit('update-element', this.element)
    }

    initConsole (options) {
        this.mockConsole = new MockConsole(options)
        this.mockConsole.$on('new', this.newLog.bind(this))
    }

    newLog (log) {
        this.historyQueue.push(log)
        this.logQueue.push(log)
        this.$emit('update-log', log)

        this.uploadSyncData({
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

        this.uploadSyncData({
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
                this.scoketClient.$on('ask-data', (cb) => {
                    cb(null, {
                        element: this.element,
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
                    this.element = data.element || {}

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
                    if (data.element) {
                        this.updateElement(data.element)
                    }
                })

                this.scoketClient.$on('run-code', code => {
                    this.execCommand(code)
                })

                this.scoketClient.$on('remote-mode', () => {
                    this.remoteSync = true
                    clearInterval(this.elementTimer)
                })

                this.scoketClient.$on('init-clients', () => {
                    this.clientQueue = this.scoketClient.clientQueue
                    this.$emit('init-clients', this.clientQueue)
                })

                this.scoketClient.$on('update-clients', () => {
                    this.clientQueue = this.scoketClient.clientQueue
                    this.$emit('init-clients', this.clientQueue)
                })

                return this.scoketClient.client
            })
            .catch(err => {
                console.debug(err)
            })
    }

    uploadSyncData (data) {
        if (!this.clientMode) return
        this.scoketClient && this.scoketClient.$emit('ask-update', data)
    }

    setRemoteMode () {
        this.remoteMode = true
        this.clientMode = false
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
        this.clearInterval(this.elementTimer)
        this.removeClient()
    }
}

export default SyncConsole
