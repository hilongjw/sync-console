const webpack = require('webpack')
// const path = require('path')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')
const getEntries = require('./getEntries')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// const ExtractTextPlugin = require('extract-text-webpack-plugin')
const BunddleInsert = require('./bunddleInsert')
const version = process.env.VERSION || require('../package.json').version

const banner =
  'SyncConsole.js v' + version + '\n' +
  '(c) ' + new Date().getFullYear() + ' Awe <hilongjw@gmail.com>\n' +
  'Released under the MIT License.\n'

const productionConf = merge(baseConfig, {
    entry: getEntries(null, ['components', 'assets', 'lib'], false),
    stats: { children: false },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"',
                __SYNC_CONSOLE_PATH_: '"http://sync.bood.in/"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            }
        }),
        new OptimizeCssAssetsPlugin({
            cssProcessor: require('cssnano'),
            cssProcessorOptions: { discardComments: { removeAll: true } },
            canPrint: true
        }),
        new webpack.LoaderOptionsPlugin({
            vue: {
                loaders: {
                    postcss: [
                        require('autoprefixer')({
                            browsers: ['last 3 versions']
                        })
                    ]
                    // css: ExtractTextPlugin.extract({
                    //     loader: "css-loader",
                    //     fallbackLoader: "vue-style-loader"
                    // })
                }
            }
        }),
        new BunddleInsert(),
        new webpack.BannerPlugin(banner)
    ]
})

module.exports = productionConf
