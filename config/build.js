const path = require('path')

module.exports = {
    clientName: 'client-entry.js',
    serverName: 'server-entry.js',
    clientPath: path.resolve(__dirname, '../client/'),
    staticPath: path.resolve(__dirname, '../public/'),
    filename: 'client/[name]-[hash].js',
    chunkFilename: 'client/[name]-[hash].js'
}