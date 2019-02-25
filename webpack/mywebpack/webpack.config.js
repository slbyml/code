let path = require("path");

// plugin测试
class Test{
  apply(compiler) {    
    compiler.hooks.emit.tap('emit',() => {
      console.log('emit');
    })
  }
}

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          path.resolve(__dirname,'loader','style-loader'),
          path.resolve(__dirname,'loader','less-loader')
        ]
      }
    ]
  },
  plugins: [
    new Test()
  ]
}