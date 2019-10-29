/**
 * 页面资源监控
 */
import { onload, filterTime, performance, extend } from './util';



let resolvePerformanceTiming = (timing) => {
  let o = {
    initiatorType: timing.initiatorType, //资源类型
    name: timing.name,  // 资源路径
    duration: parseInt(timing.duration),
    redirect: filterTime(timing.redirectEnd, timing.redirectStart), // 重定向
    dns: filterTime(timing.domainLookupEnd, timing.domainLookupStart), // DNS解析
    connect: filterTime(timing.connectEnd, timing.connectStart), // TCP建连
    network: filterTime(timing.connectEnd, timing.startTime), // 网络总耗时

    send: filterTime(timing.responseStart, timing.requestStart), // 发送开始到接受第一个返回
    receive: filterTime(timing.responseEnd, timing.responseStart), // 接收总时间
    request: filterTime(timing.responseEnd, timing.requestStart), // 总时间

    ttfb: filterTime(timing.responseStart, timing.requestStart), // 首字节时间
  };

  return o;
};

// 过滤静态资源
let filterResources = (entries, config) => {
  const types = config.types
  const includes = config.includes
  const excludes = config.excludes
  const len = Math.max(types && types.length, includes && includes.length, excludes && excludes.length, 0)
  if (len === 0) return entries
  return entries.filter(item => {
    for (let i = 0; i < len; i++) {
      let flag = true
      if(flag && types && types[i] !== item.initiatorType) flag = false;
      if(flag && includes && !includes[i].test(item.name)) flag = false;
      if(flag && excludes && excludes[i].test(item.name)) flag = false;
      
      if(flag) return true 
      if (i === len - 1) return false
    }
  })
}

const defaultOptions = {
  types: null, //统计静态资源类型
  includes: null, // 统计的资源需要包含的链接
  excludes: null // 统计的资源需要排除的链接
}

class resources{
  constructor(config){
    this.config = extend({}, defaultOptions, config)
  }
  init(cb) {
    if (!performance || !performance.getEntries) {
      return void 0;
    }

    if (!window.PerformanceObserver) {
      // 此方法存在问题，独有放在此脚步之前的资源，没法监控到
      let observer = new window.PerformanceObserver((list) => {
        try {
          let entries = list.getEntries();
          this.callback(entries, cb)
        } catch (e) {
          console.error('PerformanceObserver', e);
        }
      });
      observer.observe({
        entryTypes: ['resource']
      })
    } else {
      onload(() => {
        let entries = performance.getEntriesByType('resource');
        this.callback(entries, cb)
      });
    }
  }
  resolveEntries(entries) {
    return filterResources(entries, this.config).map(item => resolvePerformanceTiming(item));
  }
  callback(entries, cb) {
    const lists = this.resolveEntries(entries)
    if (lists && lists.length) {
      cb(lists)
    }
  }
}

export default resources;
