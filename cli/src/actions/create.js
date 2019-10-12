const path = require('path')
const fs = require('fs')
// 将非promise的函数转换为promise
const { promisify } = require('util')
const axios = require('axios')
// loading
const ora = require('ora')
// 可交互式命令
const Inquirer = require('inquirer')
// 下载模版文件
let downloadGitRepo = require('download-git-repo')
downloadGitRepo = promisify(downloadGitRepo)

// 遍历模版， 查找是否需要渲染
const Metalsmith = require('metalsmith')
// 统一所有模版引擎 ,编译模版
let { render } = require('consolidate').ejs
render = promisify(render)

let ncp = require('ncp')
ncp = promisify(ncp)
 
const { downLoadDirecory } = require('../constants')
// 执行cli create执行此文件
// https://api.github.com/users/slbyml/repos 
// 拉取所有项目以供选择安装那个项目 


// 获取项目所有模版 
const fetchRepos = async () => {
  const {data} = await axios.get('https://api.github.com/users/slbyml/repos')
  return data 
}

// 获取选择项目的版本号
const fetchTags = async (repo) => {
  const {data} = await axios.get(`https://api.github.com/repos/slbyml/${repo}/tags`)
  return data 
}

const waitFnLoading =  (fn, mes) => async(...args) => {
  const spinner = ora(mes)
  spinner.start( )
  // 显示项目中所有模版 
  let result = await fn(...args)
  spinner.succeed()
  return result
}

const download = async(repo, tag ) => {
  let api = `slbyml/${repo}`
  if(tag) {
    api += `#${tag }`
  }
  // 下载最终路径   user/XXX/.template/repo
  const dest = `${downLoadDirecory}/${repo}`
  await downloadGitRepo(api, dest )
  return dest 
}

module.exports = async (projectName) => {
  // 显示项目中所有模版 
  let repos = await waitFnLoading(fetchRepos, '开始获取模版信息 ………… ')()
  repos = repos.map(i => i.name)
  // 选择模版
  const { repo } = await Inquirer.prompt({
    name: 'repo',
    type: 'list',
    message: '请选择一个模版',
    choices: repos
  })
  
  // 显示选择项目的版本号 
  let tags  = await waitFnLoading(fetchTags, '开始获取模版版本号 ………… ')(repo)
  tags = tags.map(i => i.name)
  // 选择版本号
  const { tag } = await Inquirer.prompt({
    name: 'tag',
    type: 'list',
    message: '请选择一个版本号',
    choices: tags
  })
  
  // 下载模版
  const result  = await waitFnLoading(download, '开始下载模版文件 ………… ')(repo, tag)
  
  // 把下载好的文件拷贝到当前执行命令目录
  if(!fs.existsSync(path.join(result, 'ask.js'))) {
    // 简单模版则直接拷贝
    await ncp(result, path.resolve(projectName))
  } else {
    //复杂模版需要先编译好后再拷贝
    await new Promise((resolve, reject) => {
      Metalsmith(__dirname)
        .source(result)
        .destination(path.resolve(projectName))
        .use(async (files, metal, done) => {
          // 获取用户选择和输入
          const args  = require(path.join(result, 'ask.js'))
          let obj = await Inquirer.prompt(args)
          let meta = metal.metadata()
          Object.assign(meta, obj)
          delete files['ask.js']
          done()
        })
        .use((files, metal, done) => {
          // 根据选择来替换模版
          Reflect.ownKeys(files).forEach(async file => {
            // 只编译有固定后缀的文件
            if (file.includes('js') || file.includes('json')) {
              let content = files[file].contents.toString()
              // 查看当前文件是否是模版
              if(content.includes('<%')) {
                content = await render(content, metal.metadata())
                files[file].contents = Buffer.from(content)
              }
            }
          })
          done()
        })
        .build((err) => {
          if(err) {
            reject(err)
          } else {
            resolve()
          }
        })

    })
  }
} 