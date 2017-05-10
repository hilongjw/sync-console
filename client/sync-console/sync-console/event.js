export default class Event {
    constructor () {
        this._listeners = {}
    }

    $on (type, cb, ctx) {
        ctx = ctx || null
        if (!this._listeners[type]) this._listeners[type] = []
        this._listeners[type].push({
            cb: cb,
            ctx: ctx
        })
        return this._listeners[type].length - 1
    }

    $once (type, cb, ctx) {
        ctx = ctx || null
        const func = function (...args) {
            cb.apply(ctx, args)
            this.$off(type, func)
        }
    }

    $off (type, cb) {
        if (!this._listeners[type] || !this._listeners[type].length) return
        if (!cb) {
            this._listeners[type].map(cb => (cb = null))
            this._listeners[type] = []
        }
        if (typeof cb === 'function') {
            this._listeners[type].map((func, i) => {
                if (func.cb === cb) {
                    this._listeners[type].splice(i, 1)
                    func = null
                }
            })
        }
        if (typeof cb === 'number') {
            this._listeners[type].splice(cb, 1)
        }
    }

    $emit (...args) {
        if (!args.length) return
        const type = args[0]
        args.shift()
        if (this._listeners[type] && this._listeners[type].length) {
            this._listeners[type].map(item => {
                item.cb.apply(item.ctx, args)
            })
        }
    }
}
