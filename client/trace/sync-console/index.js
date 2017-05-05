import Event from './event'
import MockConsole from './mock-console'
import MockNetwork from './mock-xhr'
import MockError from './mock-error'

class SyncConsole extends Event {
    constructor (options) {
        super()
        this.options = options

        this.logQueue = []
        this.historyQueue = []

        this.mockConsole = null
        this.mockNetWork = null
        this.mockError = null

        this.initConsole()
        this.initNetWork()
        this.initMockError()
    }

    initConsole () {
        this.mockConsole = new MockConsole()
        this.mockConsole.$on('new', this.newLog)
    }

    newLog (log) {
        this.historyQueue.push(log)
        this.logQueue.push(log)
        this.$emit('newLog', log)
    }

    initNetWork () {
        this.netWork = new MockNetwork()
        this.netWork.$on('update', this.updateNetWrok)
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
}

export default SyncConsole
