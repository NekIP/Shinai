"use strict";
var merge = require('webpack-merge');
var common = require('./webpack.common.js');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
module.exports = merge(common, {
    mode: 'production',
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    beautify: true,
                    comments: true,
                    compress: {
                        sequences: true,
                        booleans: true,
                        loops: true,
                        unused: true,
                        warnings: false,
                        drop_console: true,
                        unsafe: true
                    }
                }
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    }
});
