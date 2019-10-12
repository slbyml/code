const path = require("path")
const program = require("commander")
const { version } = require('constants')

// program
//   .command("create")
//   .alias('c')
//   .description("创建项目")
const mapActions = {
  create: {
    alias: "c",
    description: "创建项目"
  },
  test: {
    alias: "t",
    description: "这是一个测试命令"
  },
  '*': {
    alias: "",
    description: "找不到对应的command"
  }
}

Reflect.ownKeys(mapActions).forEach(action => {
  program
    .command(action)
    .alias(mapActions[action].alias)
    .description(mapActions[action].description)
    .action(() => { // 执行对应命令后，程序要执行的动作
      require(path.resolve(__dirname, "actions", action))(...process.argv.slice(3))
    })
})

program
  .version(version)
  .parse(process.argv)  // 解析用户传过来的参数
 