const SystemInfo = {
    init () {
        return {
            UA: navigator.userAgent,
            system: SystemInfo.system(),
            browser: SystemInfo.browser(),
            wechat: SystemInfo.wechat(),
            network: SystemInfo.network()
        }
    },

    info (cb) {
        this.performance(this.init(), cb)
    },

    browser () {
        const UA = navigator.userAgent
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
    },

    system () {
        let ua = navigator.userAgent
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
    },

    wechat () {
        let ua = navigator.userAgent
        let version = ua.match(/MicroMessenger\/([\d.]+)/i)
        let wechat = 'Unknown'

        if (version && version[1]) {
            wechat = ' WeChat ' + version[1]
        }

        return wechat
    },

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
    },

    network () {
        let ua = navigator.userAgent
        let network = ua.toLowerCase().match(/ nettype\/([^ ]+)/g)
        let msg = 'Unknown'

        if (network && network[0]) {
            network = network[0].split('/')
            msg = network[1]
        }

        return msg
    },

    performance (data, callback) {
        let performance = window.performance || window.msPerformance || window.webkitPerformance
        if (!performance || !performance.timing) {
            return callback(null, data)
        }

        setTimeout(() => {
            let t = performance.timing

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
