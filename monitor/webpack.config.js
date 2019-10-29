var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');


module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, "dist"),
    filename: '[name].[hash].js'
  },
  watch: true,
  plugins: [
    new HtmlWebpackPlugin( {
      template: "./index.html"
    })
  ]
};