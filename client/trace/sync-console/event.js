export default class Event {
    constructor () {
        this._listeners = {}
    }

    $on (type, cb) {
        if (!this._listeners[type]) this._listeners[type] = []
        this._listeners[type].push(cb)
        return this._listeners[type].length - 1
    }

    $off (type, cb) {
        if (!this._listeners[type] || !this._listeners[type].length) return
        if (!cb) {
            this._listeners[type].map(cb => (cb = null))
            this._listeners[type] = []
        }
        if (typeof cb === 'function') {
            this._listeners[type].map((func, i) => {
                if (func === cb) {
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
            this._listeners[type].map(cb => {
                cb.apply(null, args)
            })
        }
    }
}
