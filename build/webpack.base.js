const path = require('path')
const webpack = require('webpack')
const buildConfig = require('../config/build')

const staticPath = buildConfig.staticPath

module.exports = {
    context: path.resolve(__dirname, '../'),
    output: {
        path: staticPath,
        publicPath: '/',
        filename: buildConfig.filename,
        chunkFilename: buildConfig.chunkFilename,
        library: 'LogTracer',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['.js', '.vue', '.css']
    },
    module: {
        rules: [{
            enforce: 'pre',
            test: /.vue$/,
            exclude: /node_modules/,
            use: [{
                loader: 'eslint-loader',
                options: {
                    formatter: require('eslint-friendly-formatter')
                }
            }]
        }, {
            enforce: 'pre',
            test: /.js$/,
            exclude: /node_modules/,
            use: [{
                loader: 'eslint-loader',
                options: {
                    formatter: require('eslint-friendly-formatter')
                }
            }]
        }, {
            test: /\.vue$/,
            loader: 'vue-loader'
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules|swiper/
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        }, {
            test: /\.(png|jpg|gif|svg|ttf|woff|eot)$/,
            loader: 'file-loader',
            query: {
                name: 'file/[name].[ext]'
            }
        }]
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
}
