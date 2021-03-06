import Event from './event'
import {
    getUniqueId
} from '../utils'

function formatHeader (header) {
    let headers = {}
    let tmp = []

    if (!header) return headers

    header
        .split('\n')
        .map(item => {
            tmp = item.split(':')
            if (item && tmp.length) {
                headers[tmp[0]] = tmp[1]
            }
        })

    return headers
}

const ignoreSocketPolling = /socket.io/

function urlCheck (url, ignores) {
    let result = false
    for (let i = 0, len = ignores.length; i < len; i++) {
        if (ignores[i].test(url)) {
            result = true
            break
        }
    }
    return result
}

class MockXhr extends Event {
    constructor ({ ignores } = {}) {
        super()

        this.options = {
            ignores: [ignoreSocketPolling]
        }
        ignores = ignores || []
        this.options.ignores = this.options.ignores.concat(ignores)
        this.mockXMLHttpRequest()
    }

    update (req) {
        const net = this.formatRequest(req, {
            requestHeader: {},
            _requestId: req._requestId,
            startTime: 0,
            costTime: 0,
            status: 0,
            header: '',
            headers: {},
            response: '',
            url: req._URL
        })
        this.$emit('update', net)
    }

    formatRequest (req, data) {
        switch (req.readyState) {
        case 0:
        case 1:
            // UNSENT and OPENED
            req._startTime = data.startTime = Date.now()
            break
        case 2:
            // HEADERS_RECEIVED
            data.header = req.getAllResponseHeaders()
            break
        case 3:
            // LOADING
            // data.loading = true
            break
        case 4:
            // DONE
            data.requestHeader = req._SyncHeader
            data.startTime = req._startTime
            data.header = req.getAllResponseHeaders()
            data.headers = formatHeader(data.header)
            data.response = req.response
            data.endTime = Date.now()
            data.costTime = data.endTime - data.startTime
            break
        }
        data.status = req.status
        return data
    }

    mockXMLHttpRequest () {
        if (!window.XMLHttpRequest) return

        const noop = () => {}
        let that = this
        const _open = window.XMLHttpRequest.prototype.open
        // const _send = window.XMLHttpRequest.prototype.send
        const _setRequestHeader = window.XMLHttpRequest.prototype.setRequestHeader

        window.XMLHttpRequest.prototype.setRequestHeader = function (key, val) {
            if (!this._SyncHeader) this._SyncHeader = {}
            this._SyncHeader[key] = val
            return _setRequestHeader.call(this, key, val)
        }

        window.XMLHttpRequest.prototype.open = function (...args) {
            let XMLReq = this
            let url = args[1]

            const isIgnore = urlCheck(url, that.options.ignores)

            if (isIgnore) return _open.apply(XMLReq, args)

            const _onprogress = this.onprogress || noop
            const _onload = this.onload || noop

            XMLReq._requestId = getUniqueId()
            XMLReq._URL = url

            let _onreadystatechange = XMLReq.onreadystatechange || noop

            if (url) {
                this.onreadystatechange = function () {
                    that.update(this)
                    return _onreadystatechange.apply(XMLReq, arguments)
                }

                this.onprogress = function (...args) {
                    that.update(this)
                    return _onprogress.apply(XMLReq, args)
                }

                this.onload = function (...args) {
                    that.update(this)
                    return _onload.apply(XMLReq, args)
                }
            }

            return _open.apply(XMLReq, args)
        }
    }
}

export default MockXhr
