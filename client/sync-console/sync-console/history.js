import { setStorage, getStorage, isFunction } from '../utils'

export default class History {
    constructor () {
        this.queue = this.load()

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
