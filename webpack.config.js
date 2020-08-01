const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const packageData = require('./package.json');

module.exports = [
	{
		mode: 'production',
		name: 'Schema',
		entry: './src/index.js',
		target: 'web',
		output: {
			library: 'Schema',
			libraryTarget: 'var',
			filename: 'schema.js',
			path: path.resolve(__dirname, './dist')
		},
		plugins: [
			new webpack.BannerPlugin({
				banner: `Schema v${packageData.version}\nhttps://github.com/alexspirgel/schema`
			})
		],
		optimization: {
			minimize: false
		}
	},
	{
		mode: 'production',
		name: 'Schema',
		entry: './src/index.js',
		target: 'web',
		output: {
			library: 'Schema',
			libraryTarget: 'var',
			filename: 'schema.min.js',
			path: path.resolve(__dirname, './dist')
		},
		plugins: [
			new webpack.BannerPlugin({
				banner: `Schema v${packageData.version}\nhttps://github.com/alexspirgel/schema`
			})
		],
		optimization: {
			minimize: true,
			minimizer: [
				new TerserPlugin({
					extractComments: false,
					terserOptions: {
						keep_classnames: true
					}
				})
			]
		}
	}
];