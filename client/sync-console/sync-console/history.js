import { setStorage, getStorage, isFunction } from '../utils'

export default class History {
    constructor ({ maxLogCount }) {
        this.queue = this.load()
        this.maxLogCount = maxLogCount || 30
        this._onbeforeunload = null
        this.mockQueuePush()
        this.onCloseSave()
    }

    mockQueuePush () {
        const _push = this.queue.push
        this.queue.push = (item) => {
            if (this.queue.length > this.maxLogCount) {
                while (this.queue.length > this.maxLogCount) {
                    this.queue.shift()
                }
            }
            _push.call(this.queue, item)
        }
    }

    offCloseSave () {
        if (isFunction(this._onbeforeunload)) {
            window.onbeforeunload = this._onbeforeunload
        }
    }

    onCloseSave () {
        this._onbeforeunload = window.onbeforeunload
        window.onbeforeunload = () => {
            this.save()
            if (isFunction(this._onbeforeunload)) {
                this._onbeforeunload()
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

    destroy () {
        this.offCloseSave()
        this.queue = []
    }
}
