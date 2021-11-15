const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
	mode: 'production',
	entry: {
		app: ['./src/index.js'],
	},
	output: {
		path: path.resolve(process.cwd(), './lib'),
		publicPath: '/dist',
		filename: 'yelement-ui.common.js',
		chunkFilename: '[id].js',
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
	plugins: [new VueLoaderPlugin()],
};
