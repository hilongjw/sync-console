import Event from './event'
import { getLocationHref, getParams } from '../utils'

let io
class SocketClient extends Event {
    constructor (options) {
        super()
        const { token, nsp, project } = options
        this.token = token
        this.remote = false
        this.client = null
        this.nsp = nsp
        this.project = project || getLocationHref()
        this.target = ''
        this.clientQueue = []
    }

    addClient (client) {
        for (let i = 0, len = this.clientQueue.length; i < len; i++) {
            if (this.clientQueue[i].id === client.id) {
                return
            }
        }
        this.clientQueue.push(client)
        this.$emit('update-clients')
    }

    removeClient (client) {
        for (let i = 0, len = this.clientQueue.length; i < len; i++) {
            if (this.clientQueue[i].id === client.id) {
                this.clientQueue.splice(i, 1)
                break
            }
        }
        this.$emit('update-clients')
    }

    loadClients () {
        const query = getParams()

        this.client.emit('admin:init-req', {
            token: this.token,
            project: query._sync_console_project
        })

        this.client.on('admin:init-res', (clients) => {
            clients.map(this.addClient.bind(this))
            this.$emit('init-clients')
        })

        this.client.on('admin:add-client', client => {
            this.addClient(client)
        })

        this.client.on('admin:remove-client', client => {
            this.removeClient(client)
        })
    }

    clearOldRemoteModeListenner () {
        this.$off('run-code-remote')
    }

    remoteMode (target) {
        if (!this.client) return
        this.remote = true
        this.target = target

        this.clearOldRemoteModeListenner()
        this.client.off('admin:sync-update')
        this.client.off('admin:sync-init')

        // if (module.hot) {
        //     module.hot.accept()
        //     this.clearOldRemoteModeListenner()
        // }

        this.$emit('remote-mode')

        this.client.emit('admin:sync-req', {
            target: target,
            token: this.token
        })

        this.client.on('admin:sync-init', data => {
            this.$emit('init', data.data)
        })

        this.client.on('admin:sync-update', data => {
            this.$emit('update', data.data)
        })

        this.$on('run-code-remote', code => {
            this.client.emit('admin:run-code', {
                code: code,
                token: this.token,
                target: this.target
            })
        })
    }

    clientMode () {
        if (!this.client) return
        this.$off('ask-update')
        this.$off('system')

        this.$on('system', (system) => {
            this.client.emit('client:init', {
                system: system,
                project: this.project
            })
        })

        this.client.on('client:sync-req', (data) => {
            // TODO auth check
            this.target = data.target

            this.$emit('ask-data', (err, vm) => {
                if (err) return
                this.client.emit('client:sync-init', {
                    target: this.target,
                    data: vm
                })
            })
        })

        this.$on('ask-update', (vm) => {
            if (!this.target || this.remote) return
            this.client.emit('client:sync-update', {
                target: this.target,
                data: vm
            })
        })

        this.client.on('client:run-code', (data) => {
            this.$emit('run-code', data.code)
        })

        this.client.on('client:error', (data) => {
            console.error(data.message)
            this.$emit('error-msg', data.message)
        })
    }

    init () {
        if (this.client) return Promise.resolve(this.client)
        return import('socket.io-client')
            .then(_io => {
                io = _io
                this.client = io.connect(this.nsp)
                this.clientMode()
                return this.client
            })
    }

    remove () {
        this.client.close()
        this.client = null
    }
}

export default SocketClient
