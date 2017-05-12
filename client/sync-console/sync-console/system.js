import Event from './event'

class SystemInfo extends Event {
    constructor () {
        super()
        this.UA = ((window && window.navigator && window.navigator.userAgent) ? window.navigator.userAgent : '')
        this.data = this.syncData()
        this.systemMemory = []
        this.asyncData()
        this.updateMemory()
    }

    syncData () {
        return {
            UA: this.UA,
            viewportWidth: window.innerWidth || document.documentElement.clientWidth,
            viewportHeight: window.innerHeight || document.documentElement.clientHeight,
            layoutWidth: document.documentElement.clientWidth,
            layoutHeight: document.documentElement.clientHeight,
            zoom: document.documentElement.clientHeight / window.innerHeight,
            dpr: window.devicePixelRatio,
            system: this.system(),
            browser: this.browser(),
            wechat: this.wechat(),
            network: this.network()
        }
    }

    asyncData () {
        this.performance((err, data) => {
            if (err) console.error(err)
            this.data = Object.assign(this.data, data)
            this.$emit('update', this.data)
        })
    }

    browser () {
        const UA = this.UA
        let result = ''

        const chrome = UA.match(/(chrome)\/([\d.]+)/i)
        const safari = UA.match(/(safari)\/([\d.]+)/i)
        const firefox = UA.match(/(firefox)\/([\d.]+)/i)
        const opera = UA.match(/opera (.*)\/(.*\d);/i)
        const isIE = /msie|trident/i.test(UA)
        const ieVersion = UA.match(/(?:msie |rv:)(\d+(\.\d+)?)/i)

        if (chrome) {
            result = 'Chrome ' + chrome[2].replace(/_/g, '.')
        } else if (safari) {
            result = 'Safari ' + safari[2].replace(/_/g, '.')
        } else if (firefox) {
            result = 'Firefox ' + firefox[2].replace(/_/g, '.')
        } else if (opera) {
            result = 'Opera ' + opera[2].replace(/_/g, '.')
        } else if (isIE) {
            result = 'Internet Explorer ' + ieVersion[1]
        }

        return result
    }

    system () {
        let ua = this.UA
        let system = 'Unknown'

        // device & system
        let ipod = ua.match(/(ipod).*\s([\d_]+)/i)
        let ipad = ua.match(/(ipad).*\s([\d_]+)/i)
        let iphone = ua.match(/(iphone)\sos\s([\d_]+)/i)
        let android = ua.match(/(android)\s([\d.]+)/i)
        let chromeos = ua.match(/CrOS/i)
        let mac = ua.match(/mac (.*) ([\d_]+)/i)
        let windows = ua.match(/windows (.*) ([\d.]+)/i)

        if (android) {
            system = 'Android ' + android[2]
        } else if (iphone) {
            system = 'iPhone, iOS ' + iphone[2].replace(/_/g, '.')
        } else if (ipad) {
            system = 'iPad, iOS ' + ipad[2].replace(/_/g, '.')
        } else if (ipod) {
            system = 'iPod, iOS ' + ipod[2].replace(/_/g, '.')
        } else if (mac) {
            system = 'Mac ' + mac[1] + ' ' + mac[2].replace(/_/g, '.')
        } else if (windows) {
            system = 'Windows ' + windows[1] + ' ' + windows[2].replace(/_/g, '.')
        } else if (chromeos) {
            system = 'Chromeos'
        }

        return system
    }

    wechat () {
        let ua = this.UA
        let version = ua.match(/MicroMessenger\/([\d.]+)/i)
        let wechat = 'Unknown'

        if (version && version[1]) {
            wechat = ' WeChat ' + version[1]
        }

        return wechat
    }

    // HTTP protocol
    protocol () {
        let protocol = 'Unknown'

        if (location.protocol === 'https:') {
            protocol = 'HTTPS'
        } else if (location.protocol === 'http:') {
            protocol = 'HTTP'
        } else {
            protocol = location.protocol.replace(':', '')
        }

        return protocol
    }

    network () {
        let ua = this.UA
        let network = ua.toLowerCase().match(/ nettype\/([^ ]+)/g)
        let msg = 'Unknown'

        if (network && network[0]) {
            network = network[0].split('/')
            msg = network[1]
        }

        return msg
    }

    updateMemory () {
        this.systemMemoryTimer = setInterval(() => {
            if (this.systemMemory.length > 100) this.systemMemory.shift()
            this.systemMemory.push(this.memory())
        }, 500)
    }

    memory () {
        const performance = window.performance || window.msPerformance || window.webkitPerformance
        if (!performance) return
        const memory = performance.memory
        if (!memory) return

        const jsHeapSizeLimit = memory.jsHeapSizeLimit
        const usedJSHeapSize = memory.usedJSHeapSize

        const MBSize = Math.pow(1024, 2)

        return {
            size: Math.floor(usedJSHeapSize / MBSize),
            percent: (usedJSHeapSize / jsHeapSizeLimit).toFixed(2)
        }
    }

    performance (callback) {
        let performance = window.performance || window.msPerformance || window.webkitPerformance
        if (!performance || !performance.timing) return callback(new Error('unsupport  performance'))

        let data = {}

        setTimeout(() => {
            let m = performance.memory
            let t = performance.timing

            const MBSize = Math.pow(1024, 2)

            if (m && m.usedJSHeapSize) {
                data['usedJSHeapSize'] = Math.floor(m.usedJSHeapSize / MBSize) + ' MB'
            }

            if (m && m.totalJSHeapSize) {
                data['totalJSHeapSize'] = Math.floor(m.totalJSHeapSize / MBSize) + ' MB'
            }

            if (m && m.jsHeapSizeLimit) {
                data['jsHeapSizeLimit'] = Math.floor(m.jsHeapSizeLimit / MBSize) + ' MB'
            }

            if (t.navigationStart) {
                data['navigationStart'] = t.navigationStart
            }
            if (t.navigationStart && t.domainLookupStart) {
                data['navigation'] = (t.domainLookupStart - t.navigationStart) + 'ms'
            }
            if (t.domainLookupEnd && t.domainLookupStart) {
                data['dns'] = (t.domainLookupEnd - t.domainLookupStart) + 'ms'
            }
            if (t.connectEnd && t.connectStart) {
                if (t.connectEnd && t.secureConnectionStart) {
                    data['tcp (ssl)'] = (t.connectEnd - t.connectStart) + 'ms (' + (t.connectEnd - t.secureConnectionStart) + 'ms)'
                } else {
                    data['tcp'] = (t.connectEnd - t.connectStart) + 'ms'
                }
            }
            if (t.responseStart && t.requestStart) {
                data['request'] = (t.responseStart - t.requestStart) + 'ms'
            }
            if (t.responseEnd && t.responseStart) {
                data['response'] = (t.responseEnd - t.responseStart) + 'ms'
            }
            if (t.domComplete && t.domLoading) {
                if (t.domContentLoadedEventStart && t.domLoading) {
                    data['domComplete'] = (t.domComplete - t.domLoading) + 'ms (' + (t.domContentLoadedEventStart - t.domLoading) + 'ms)'
                } else {
                    data['domComplete'] = (t.domComplete - t.domLoading) + 'ms'
                }
            }
            if (t.loadEventEnd && t.loadEventStart) {
                data['loadEvent'] = (t.loadEventEnd - t.loadEventStart) + 'ms'
            }
            if (t.navigationStart && t.loadEventEnd) {
                data['total (DOM)'] = (t.loadEventEnd - t.navigationStart) + 'ms (' + (t.domComplete - t.navigationStart) + 'ms)'
            }
            callback(null, data)
        }, 1)
    }
}

export default SystemInfo
