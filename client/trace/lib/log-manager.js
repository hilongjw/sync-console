export default class LogManager {
    constructor(props) {
        this.LogQueue = []
        this.historyQueue = this.loadLocal()
        this.logIndex = 0
        this.console = this.init(['log', 'error', 'warn'])
    }

    toJSON () {
        return this.LogQueue
    }

    writeLocal () {
        if (this.LogQueue.length > 100) {
            this.LogQueue.shift()
        }
        const str = JSON.stringify(this.LogQueue)
        localStorage['LogManager'] = str
    }

    loadLocal () {
        const localStr = localStorage['LogManager'] || '[]'
        let queue = []

        try {
            queue = JSON.parse(localStr)
        } catch (e) {
            console.error(e)
        }

        return queue
    }

    init (methods) {
        methods.map(method => {
            let old = console[method]
            console[method] = (...args) => {
                this.LogQueue.push({
                    id: this.logIndex++,
                    type: method,
                    date: Date.now(),
                    args: args
                })
                this.writeLocal()
                old.apply(console, args)
            }
            
        })
    }
}