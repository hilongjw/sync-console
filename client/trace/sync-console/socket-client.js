let io
class SocketClient {
    constructor (nsp) {
        this.client = null
        this.nsp = nsp
    }

    init () {
        if (this.client) return Promise.resolve(this.client)
        if (io) return io.connect(this.nsp)
        return import('socket.io-client')
            .then(_io => {
                io = _io
                this.client = io.connect(this.nsp)
                return this.client
            })
    }

    remove () {
        this.client.close()
        this.client = null
    }
}

export default SocketClient
