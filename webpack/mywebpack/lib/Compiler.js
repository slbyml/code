let fs = require('fs')
let path = require("path")
// 将源码转换成AST
// let babylon = require('babylon')
const parseAst = require('@babel/parser')

// 遍历节点
let traverse = require('@babel/traverse').default
// traverse
let t = require('@babel/types')
// 生成
let generator = require('@babel/generator').default
//模板
let template = require('./MainTemplate')
let { SyncHook } = require('tapable')

class Compiler {
  constructor(config) {
    this.config = config;

    // 保存入口文件的路径
    this.entryId;

    // 保存所有模块依赖
    this.modules = {}

    this.entry = config.entry

    // 工作路径
    this.root = process.cwd()

    this.hooks = {
      entryOption: new SyncHook(),
      compile: new SyncHook(),
      afterCompile: new SyncHook(),
      afterPlugins: new SyncHook(),
      run: new SyncHook(),
      emit: new SyncHook(),
      done: new SyncHook()
    }
    let plugins = this.config.plugins
    if (Array.isArray(plugins)) {
      plugins.forEach(plugin => {
        plugin.apply(this)
      })
    }
    this.hooks.afterPlugins.call()
  }
  // 获取文件源码并递归执行匹配到的loader
  getSource(modulePath) {
    let content = fs.readFileSync(modulePath, 'utf-8')
    let rules = this.config.module.rules;
    for (let i = 0; i < rules.length; i++) {
      let rule = rules[i]
      let { test, use } = rule
      let len = use.length - 1
      if (test.test(modulePath)) {  // 匹配到需要用loader处理的文件
        function normalLoader() {
          let loader = require(use[len--])
          content = loader(content)
          if (len >= 0) {
            normalLoader()

          }
        }
        normalLoader()
      }
    }
    return content
  }
  /**
   * 构建依赖关系
   * @param {*} modulePath  依赖绝对路径
   * @param {*} isEntry 是否是入口文件
   */
  buildModule(modulePath, isEntry) {
    let source = this.getSource(modulePath)

    //获取模块id 及打包后的key  相对路径
    let moduleName = './' + path.relative(this.root, modulePath)

    if (isEntry) {
      this.entryId = moduleName
    }
    // 解析并改造源码，并返回一个依赖列表
    let { sourceCode, dependencies } = this.parse(source, path.dirname(moduleName))
    this.modules[moduleName] = sourceCode

    // 遍历文件的依赖项
    dependencies.forEach(dep => {
      this.buildModule(path.join(this.root, dep), false)
    })

  }
  /**
   * 解析源码
   * @param {*} source 文件源码
   * @param {*} parentPath 父路径（./src）
   */
  parse(source, parentPath) {
    let ast = parseAst.parse(source)
    let dependencies = []
    traverse(ast, {
      CallExpression(p) {
        let node = p.node
        if (node.callee.name === 'require') {
          node.callee.name = '__webpack_require__';
          let moduleName = node.arguments[0].value  // 模块的名字
          moduleName = moduleName + (path.extname(moduleName) ? '' : '.js')
          moduleName = './' + path.join(parentPath, moduleName)
          dependencies.push(moduleName)
          node.arguments = [t.stringLiteral(moduleName)] // 更改AST树
        }
      }
    })
    let sourceCode = generator(ast).code
    return { sourceCode, dependencies }
  }
  emitFile() {
    let main = path.join(this.config.output.path, this.config.output.filename) // 输出的目录

    this.assets = {}
    this.assets[main] = template(this.entryId, this.modules)

    fs.writeFileSync(main, this.assets[main])
  }
  run() {
    this.hooks.run.call() // 生命周期
    this.hooks.compile.call() // 生命周期

    // 创建模块的依赖关系
    this.buildModule(path.resolve(this.root, this.entry), true)
    this.hooks.afterCompile.call() // 生命周期 
    // 发射文件，及打包后的文件
    this.emitFile()

    // 触发生命周期 
    this.hooks.emit.call()
    this.hooks.done.call()
  }
}

module.exports = Compiler
