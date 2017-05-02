const path = require('path')
const fs = require('fs')
const buildConfig = require('../config/build')
const projectDir = buildConfig.clientPath
const clientName = buildConfig.clientName
const serverName = buildConfig.serverName

module.exports = function (webpackHotMiddlewareConfig, exceptList, server) {
    let except = ['.DS_Store']
    except = except.concat(exceptList)
    let entries = {}
    const floders = fs.readdirSync(projectDir)

    floders.forEach(floder => {
        if (except.indexOf(floder) !== -1) return

        if (server) {
            entries[floder] = [projectDir + '/' + floder + '/' + serverName ]
        } else {
            if (webpackHotMiddlewareConfig) {
                entries[floder] = [webpackHotMiddlewareConfig, projectDir + '/' + floder + '/' + clientName]
            } else {
                entries[floder] = [projectDir + '/' + floder + '/' + clientName]
            }
        }
    })
    return entries
}
