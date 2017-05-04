const webpack = require('webpack');
const path = require('path')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')
const getEntries = require('./getEntries')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const BunddleInsert = require('./bunddleInsert')

const productionConf = merge(baseConfig, {
    entry: getEntries(null, ['components', 'assets', 'lib'], false),
    stats: { children: false },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
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
                    ],
                    // css: ExtractTextPlugin.extract({
                    //     loader: "css-loader",
                    //     fallbackLoader: "vue-style-loader"
                    // })
                }
            }
        }),
        new BunddleInsert(),
        // new ExtractTextPlugin({
        //     filename: 'css/[name]-[hash].css',
        //     allChunks: true
        // })
    ]
})

module.exports = productionConf
