const render = require('../utils/render')

function index (ctx) {
    ctx.body = render('index',
        {
            title: 'um im',
            bundle: 'im',
            hash: WEBPACK_HASH
        }
    )
}

function dash (ctx) {
    ctx.body = render('dash',
        {
            title: 'dash',
            bundle: 'dash',
            hash: WEBPACK_HASH
        }
    )
}

module.exports = {
    '/': {
        method: 'get',
        handler: index
    },
    '/dash': {
        method: 'get',
        handler: dash
    }
}