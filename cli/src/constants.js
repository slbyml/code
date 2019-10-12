// 存放用户所需要的常量
const { version  } = require("../package.json")

// 下载的模版保存文件位置,一半放在.template隐藏文件夹下 
const downLoadDirecory =`${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}/.template`

module.exports = {
  version,
  downLoadDirecory
}