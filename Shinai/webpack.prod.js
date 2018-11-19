const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = merge(common, {
	mode: 'production',
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    beautify: true,
                    comments: true,				/* remove comments if was set path for saving extracted comments */
                    compress: {
                        sequences     : true,
                        booleans      : true,
                        loops         : true,
                        unused      : true,
                        warnings    : false,
                        drop_console: true,		/* WARNING: delete all console.log */
                        unsafe      : true
                    }
                }
			}),
			new OptimizeCSSAssetsPlugin({})
        ]
    }
});