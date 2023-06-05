const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './src/index.html',
  filename: 'index.html',
  inject: 'body'
})
// const mime = require("mime");

module.exports = { 
  entry: './src/index.js', 
  output: { 
    path: path.resolve('dist'), 
    filename: 'index_bundle.js'
  },
	mode: 'development',
	// devServer: {
  //   headers: {
  //     "Content-Type": "text/css",
  //   },
  // },
  module: {
		rules: [
			// {
      //   test: /\.css$/,
      //   use: ["style-loader", "css-loader"],
      //   type: "asset/resource",
      //   generator: {
      //     filename: "assets/[name][ext]",
      //   },
      // },
			{
				test: /\.(?:js|mjs|cjs)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							['@babel/preset-env', { targets: "defaults" }]
						]
					}
				}
			}
		]
	}, 
  plugins: [
		HtmlWebpackPluginConfig,
		// {
    //   apply: (compiler) => {
    //     compiler.hooks.afterCompile.tap("SetMimeTypesPlugin", (compilation) => {
    //       for (const file of Object.keys(compilation.assets)) {
    //         const type = mime.getType(file);
    //         if (type) {
    //           compilation.assets[file].info.contentType = type;
    //         }
    //       }
    //     });
    //   },
    // }
	]
}
