const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')
const getEntries = require('./getEntries')
const webpackHotMiddlewareConfig = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000'

const developmentConf = merge(baseConfig, {
    entry: getEntries(webpackHotMiddlewareConfig, ['components', 'assets', 'lib']),
    devtool: 'eval',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"',
                __SYNC_CONSOLE_PATH_: '"http://127.0.0.1:8666/"',
                __SYNC_CONSOLE_API_: '"http://127.0.0.1:9999/"'
            }
        }),
        new webpack.LoaderOptionsPlugin({
            vue: {
                postcss: [
                    require('autoprefixer')({
                        browsers: ['last 3 versions']
                    })
                ]
            }
        })
    ]
})

module.exports = developmentConf
