const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const merge = require('webpack-merge')

const config = process.env.npm_config_config

const webpack = {
  mode: "development",
  devServer: {
    contentBase: './dist'
  },
  output: {
    filename: '[name].bundle.js'
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
}

let pro = {}

if (config === 'easy') {      // 简单版本
  pro = {
    entry : {
      easy: "./src/router-easy.js"
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "简单版",
        template: "./index.html"
      })
    ]
  }
} else if (config === 'dif') {    // 稍微复杂版本
  pro = {
    entry : {
      router: "./src/router.js"
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "前端路由",
        template: "./index.html"
      })
    ]
  }
} else {        // 多个版本
  pro = {
    entry : {
      easy: "./src/router-easy.js",
      router: "./src/router.js"
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "前端路由",
        template: "./index.html",
        chunks: ['router']
      }),
      new HtmlWebpackPlugin({
        title: "简单版",
        template: "./index.html",
        filename: "index-easy.html",
        chunks: ['easy']
      })
    ]
  }
}
module.exports = merge(webpack, pro)