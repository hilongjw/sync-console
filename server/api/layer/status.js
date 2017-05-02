'use strict'

const pusage = require('pidusage')

// function pad (num) {
//     if (num < 10) return '0' + num
//     return '' + num
// }

const OneMB = 1024 * 1024

function getProcessCPUUsage (cb) {
    pusage.stat(process.pid, (err, stat) => {
        if (err) return cb(err)
        cb(null, stat)
    })
}

class APIStatus {
    constructor (interval) {
        this.interval = interval || 5000
        this.time = this.interval / 1000
        this.logCache = {}
        this.lastUpdate = Date.now()
        this.cpu = 0
        this.logQueue = [
        // {
        //     time: '12:05',
        //     qps: 199,
        //     detail: [{
        //         name: 'GET:shop',
        //         qps: 90
        //     }, {
        //         name: 'FIND:shop',
        //         qps: 109
        //     }]
        // }
        ]

        this.start()
    }

    stop () {
        if (this.worker) {
            clearInterval(this.worker)
            this.worker = null
        }
        pusage.unmonitor(process.pid)
    }

    start () {
        this.stop()
        this.worker = setInterval(() => this.genLog(), this.interval)
    }

    mark (type, name) {
        const key = type + ':' + name
        if (this.logCache[key]) {
            this.logCache[key]++
        } else {
            this.logCache[key] = 1
        }
    }

    show () {
        return this.logQueue
    }

    genLog () {
        let totalCount = 0
        let detailCountCache = {}
        let totalQps = 0

        if (this.logQueue.length > 50) this.logQueue.shift()

        let count = 0
        Object.keys(this.logCache).map(key => {
            count = this.logCache[key]
            detailCountCache[key] = {
                count: count,
                qps: count / this.time
            }
            totalCount += count
        })

        this.logCache = {}

        totalQps = Math.floor(totalCount / this.time)

        getProcessCPUUsage((err, stat) => {
            if (err) return console.log(err)

            const newLog = {
                memoryUsage: stat.memory / OneMB,
                cpuUsage: stat.cpu,
                time: Date.now(),
                qps: totalQps,
                count: totalCount,
                detail: detailCountCache
            }
            this.logQueue.push(newLog)
        })
    }
}

module.exports = new APIStatus()
