/**
 * Created by Cyril on 6/23/2017.
 */

var debug = process.env.NODE_ENV === "production";
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var CompressionPlugin  = require('compression-webpack-plugin');
var path = require('path');

module.exports = {
    // The standard entry point and output config

    entry: {
        //head: './config/head',
        footer: './config/footer',
        vendor: './config/vendor',
        flex: './config/flex',
        steps: './config/steps',
        full: './config/full',
    },
    output: {
        filename: "./public/assets/gzip/[name].js",
        chunkFilename: "./public/assets/gzip/[id].js",
    },
    module: {
        loaders: [
            // Extract css files

            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader?{discardComments:{removeAll:true}}')
            },
            { test: /\.(png|woff|woff2|eot|ttf|svg|gif|jpg)$/, loader: 'url-loader?limit=100000&name=./public/assets/gzip/[name].[ext]'},
        ],
    },
    // Use the plugin to specify the resulting filename (and add needed behavior to the compiler)
    plugins: [
        new webpack.optimize.UglifyJsPlugin({    mangle: {except: ['$super', '$', 'export', 'require']}}),
        new webpack.optimize.UglifyJsPlugin({
            comments: false,
        }),
        /*new webpack.optimize.UglifyJsPlugin({
         compress: { warnings: false }
         }),*/
        new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false }}),
        new ExtractTextPlugin('./public/assets/gzip/[name].css', {allChunks: true, disable: false}),
        new CompressionPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.woff$|\.ttf$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        }),
        /*new webpack.ProvidePlugin({
         $: "jquery",
         jQuery: "jquery",
         "window.jQuery": "jquery",
         "Tether": 'tether'
         })*/
    ]
}
