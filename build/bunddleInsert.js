'use strict'

const fs = require('fs')
const path = require('path')

function Cov() {}

Cov.prototype.apply = function (compiler) {
    compiler.plugin('emit', function (compilation, callback) {
        console.log(compilation.hash)
        fs.writeFileSync(path.join(__dirname, '/../config/webpack-hash.js'), 'module.exports = "' + compilation.hash + '"')
        callback()
    })
}

module.exports = Cov
