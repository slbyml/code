import perf from './per'
import resources from './resources'
import xhrHook from './xhr'
import errorCatch from './err'
import behavior from './behavior';
import vueError from './vueError'
import send from './send'
import defaultConfig from './config'

window.__monitor__ = window.__monitor__ || {}

const monitor = {
  init(opt) {
    try {
      if (window.__monitor__.install) return;

      const config = window.__monitor__.config = Object.assign({}, defaultConfig, opt)
      window.__monitor__.install = true
      window.__monitor__.send = send

      // 加载性能
      perf.init((pers) => {
        send(pers)
        console.log('初始化数据',pers);
      })
      
      // 资源加载
      new resources({
        types: ['img'],
        excludes: [new RegExp(config.sendUrl)]
      }).init((lists) => {
        send(lists)
        console.log('资源监控：',lists);
      })
    
      //TODO数据上报的请求不需要再次拦截
      // ajax请求
      xhrHook.init((xhrInfo) => {
        send(xhrInfo)
        console.log('xhr:',xhrInfo);
      });
      
      // 代码报错
      errorCatch.init((err) => {
        send(err)
        console.log('错误上报：', err);
      });
      
      // 事件路径
      new behavior().init((path) => {
        send(path)
        console.log(`event path:`,path);
      });
    } catch (err) {
      console.log(err);
    }
  },
  install(Vue, opt = {}) {
    vueError.init(err => {
      send(err)
    }, Vue)
    if (!window.__monitor__ || !window.__monitor__.install) {
      monitor.init(opt)
    }
  },
  send
}

export default monitor