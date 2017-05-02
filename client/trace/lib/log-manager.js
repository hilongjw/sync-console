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

    writeLocal (log) {
        if (this.historyQueue.length > 100) {
            this.historyQueue.shift()
        }
        this.historyQueue.push(log)
        this.LogQueue.push(log)
        
        const str = JSON.stringify(this.historyQueue)
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
                this.writeLocal({
                    id: this.logIndex++,
                    type: method,
                    date: Date.now(),
                    args: args
                })
                old.apply(console, args)
            }
            
        })
    }
}