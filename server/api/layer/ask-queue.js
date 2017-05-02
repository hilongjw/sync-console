'use strict'

class AskQueue {
    constructor (loader, sender) {
        this.loader = loader
        this.sender = sender
        this.queue = {}
        this.timer = null
        this.last = Date.now()
        this.wait = 50
    }

    sendData (key, data) {
        this.queue[key].map(ctx => {
            this.sender(data, ctx.res, ctx.req)
        })
        this.queue[key] = []
    }

    sendError (key, err) {
        this.queue[key].map(ctx => {
            ctx.res.status(err.code)
            ctx.res.send(err)
        })
        this.queue[key] = []
    }

    runner () {
        this.last = Date.now()
        Object.keys(this.queue).map(key => {
            if (this.queue[key].length) {
                let req = this.queue[key][0].req
                this.loader(req)
                    .then(data => {
                        this.sendData(key, data)
                    })
                    .catch(err => {
                        this.sendError(key, err)
                    })
            }
        })
    }

    tryload () {
        const now = Date.now()

        if (this.timer) clearTimeout(this.timer)

        if (now - this.last > this.wait) {
            return this.runner()
        }

        this.timer = setTimeout(() => {
            this.runner()
        }, this.wait)
    }

    add (req, res) {
        const dataStr = JSON.stringify(req.query)
        if (!this.queue[dataStr]) {
            this.queue[dataStr] = [{ req, res }]
        } else {
            this.queue[dataStr].push({ req, res })
        }
        this.tryload()
    }
}

module.exports = AskQueue
