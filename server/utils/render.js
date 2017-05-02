const pug = require('pug')
const path = require('path')

const AdminRole = 'admin'

function render (view, data) {
    return pug.compileFile(path.join(__dirname, '../views/' + view + '.pug'), {
        cache: true
    })(data)
}

module.exports = render