// 埋点发送的的地址
const sendUrl = '/log.gif'

// 过滤ajax请求的的地址
const filterXhrUrl = []

const defaultConfig = {
  version: '1.0.0',
  pid: '', //项目ID
  uuid: 'uuid-'+Math.round(), //设备ID
  ucid: 'ucid-'+Math.round(), //用户ID
  sendUrl,
  filterXhrUrl
}


// https://slb-blog-monitor.cn-beijing.log.aliyuncs.com/logstores/monitor-store/track?APIVersion=0.6.0&test=monitor
export default defaultConfig