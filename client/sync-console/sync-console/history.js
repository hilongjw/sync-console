import { setStorage, getStorage, isFunction } from '../utils'

export default class History {
    constructor ({ maxLogCount }) {
        this.queue = this.load()
        maxLogCount = maxLogCount || 30
        const _push = this.queue.push
        this.queue.push = (item) => {
            if (this.queue.length > maxLogCount) {
                while (this.queue.length > maxLogCount) {
                    this.queue.shift()
                }
            }
            _push.call(this.queue, item)
        }
        const _onbeforeunload = window.onbeforeunload
        window.onbeforeunload = () => {
            this.save()
            if (isFunction(_onbeforeunload)) {
                _onbeforeunload()
            }
        }
    }

    save () {
        const str = JSON.stringify(this.queue)
        const sucsess = setStorage('historyQueue', str)
        if (!sucsess) this.queue = []
    }

    load () {
        const localStr = getStorage('historyQueue') || '[]'
        let queue = []

        try {
            queue = JSON.parse(localStr)
        } catch (e) {
            console.error(e)
        }

        return queue
    }
}
