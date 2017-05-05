import Event from './event'
import {
    getUniqueId
} from '../../utils'

function formatHeader (header) {
    let headers = {}
    let tmp = []

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

class MockXhr extends Event {
    constructor () {
        super()
        this.mockXMLHttpRequest()
    }

    update (req) {
        const net = this.requestFormat(req, {
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
            // UNSENT OPENED
            data.startTime = Date.now()
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
        const ignoreReg = /socket.io/
        const noop = () => {}
        let that = this
        let _open = window.XMLHttpRequest.prototype.open

        window.XMLHttpRequest.prototype.open = function (...args) {
            let XMLReq = this
            let url = args[1]
            const _onprogress = this.onprogress || noop
            const _onload = this.onload || noop
            XMLReq._requestId = getUniqueId()
            XMLReq._URL = url

            let _onreadystatechange = XMLReq.onreadystatechange || noop

            if (!ignoreReg.test(url)) {
                XMLReq.onreadystatechange = function () {
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
