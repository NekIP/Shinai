const path = require('path');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let Webpack = require("webpack");
let cssExtractor = new ExtractTextPlugin('style.css', { allChunk: true });
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require('autoprefixer');

const jsLoader = [
	{
		loader: 'babel-loader',
		options: {
			presets: ['env', 'es2015', 'stage-0', 'vue'],
			sourceMap: true
		}
	}
];

/* IMPORTANT: handlers convert code strictly from bottom to top */
const sassLoader = cssExtractor.extract({
	fallback: "style-loader",
	use: [
		{
			loader: "css-loader"
		},
		"postcss-loader",						/* prefixes */
		"resolve-url-loader", 					/* need for resolve paths to resources in css */
		{
			loader: "sass-loader?sourceMap", 	/* first resolver is source-map, after this will be sass-loader */
			options: {
				includePaths: [
					path.resolve(__dirname, 'images'), 
					path.resolve(__dirname, 'dist')
				],
				sourceMap: true
			}
		}
	]
});

module.exports = {
    entry: './wwwroot/app.js',
    output: {
        path: path.resolve(__dirname, 'wwwroot/dist'),
        filename: 'build.js'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    configFile: 'tsconfig.json',
                    appendTsSuffixTo: [/\.vue$/]		/* vue supprot for typescript */
                }
            },
            {
				test: /\.vue$/,
				/* 
				 * vue loader is a bit old but 
				 * if you need to change the vue loader to version 15 and above, 
				 * you will have to change the webpack config 
				 */
                loader: 'vue-loader',
                options: {
                    loaders: {
						scss: sassLoader,					/* <style lang="scss"> */
						sass: sassLoader,					/* <style lang="sass"> */
						js: jsLoader,						/* js with babel translation */
						i18n: '@kazupon/vue-i18n-loader'	/* localization */
                    },
					sourceMap: true
                }
            },
            {
                test: /.js$/,
                exclude: /node_modules/,
                use: jsLoader
            },
            {
                test: /\.css$/,
				loaders: cssExtractor.extract({
					fallback: "style-loader",
					use: [
						{
							loader: "css-loader"
						}, 
						"postcss-loader",
						"resolve-url-loader"
					]
				})
            },
            {
				test: /\.(sass|scss)$/,
				use: sassLoader
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: "[name].[hash].[ext]"
						}
					}
				]
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: "[name].[hash].[ext]"
						}
					}
				]
			}
        ]
    },
	resolve: {
		modules: [
			"node_modules",
			path.resolve(__dirname, "wwwroot")
		]
	},
    plugins: [
        cssExtractor,							/* extract css from js files */
        new Webpack.ProvidePlugin({
            Vue: "vue/dist/vue.min.js"
		}),
		new MiniCssExtractPlugin({
			filename: "[name].css",
			chunkFilename: "[id].css"
		}),
		new Webpack.LoaderOptionsPlugin({
			options: {
				postcss: [
					autoprefixer()		/* add prefixes to css code: -moz-transform: */
				]
			}
		})
	]
};