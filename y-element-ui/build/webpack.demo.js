const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackConfig = {
	mode: process.env.NODE_ENV,
	entry: '../examples/entry.js',
	output: {
		path: path.resolve(process.cwd(), './examples/element-ui/'),
		publicPath: '',
		filename: '[name].[hash:7].js',
		chunkFilename: '[name].js',
	},
	devServer: {
		host: '0.0.0.0',
		port: 8085,
		publicPath: '/',
		hot: true,
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					compilerOptions: {
						preserveWhitespace: false,
					},
				},
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			// template: './examples/index.html',
			// filename: './index.html',
			// favicon: './examples/favicon.ico',
		}),
	],
};
