const path = require('path')
const webpack = require('webpack')
const webpackHotMiddlewareConfig = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000'
const getEntries = require('./getEntries')
const buildConfig = require('../config/build')

const staticPath = buildConfig.staticPath

module.exports = {
    context: path.resolve(__dirname, '../'),
    output: {
        path: staticPath,
        publicPath: '/',
        filename: buildConfig.filename,
        chunkFilename: buildConfig.chunkFilename
    },
    resolve: {
        extensions: ['.js', '.vue', '.css']
    },
    module: {
        loaders: [{
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
    ],
}