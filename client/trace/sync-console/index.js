import Event from './event'
import MockConsole from './mock-console'
import MockNetwork from './mock-xhr'
import MockError from './mock-error'
import SocketClient from './socket-client'

class SyncConsole extends Event {
    constructor (options) {
        super()
        this.options = options

        this.logQueue = []
        this.historyQueue = []
        this.netWorkQueue = []

        this.mockConsole = null
        this.mockNetWork = null
        this.mockError = null

        this.scoketClient = null

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
            .then(client => {
                client.on('connect', () => {
                    client.emit('regist', {
                        system: this.system
                    })

                    let serverSignKey = ''

                    client.on('server-sign', data => {
                        serverSignKey = data.key
                    })

                    client.on('join-room', data => {
                        if (serverSignKey === data.key) client.join(data.room)
                    })

                    client.on('leave-room', data => {
                        if (serverSignKey === data.key) client.join(data.room)
                    })
                })
            })
    }

    removeClient () {
        this.scoketClient.remove()
    }
}

export default SyncConsole
