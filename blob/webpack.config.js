const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const webpack = require('webpack')
module.exports = {
  mode: "development",
  devServer: {
    contentBase: './dist',
    host:'localhost',
    port:'8080',
    open:true,//自动拉起浏览器
    hot:true,//热更新，然后自动刷新
    hotOnly:true  // 修改hot为支持热更新
  },
  entry: {
    clip: './src/clip.js',
  },
  output: {
    filename: '[name].bundle.js'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: "裁剪",
      filename: "clip.html",
      template: "./clip.html",
    })
  ]
}