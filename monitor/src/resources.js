/**
 * 页面资源监控
 */
import { onload, filterTime, performance } from './util';



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

let resolveEntries = (entries) => entries.map(item => resolvePerformanceTiming(item));

let resources = {
  init: (cb) => {
    if (!performance || !performance.getEntries) {
      return void 0;
    }

    if (window.PerformanceObserver) {
      // 此方法存在问题，独有放在此脚步之前的资源，没法监控到
      let observer = new window.PerformanceObserver((list) => {
        try {
          let entries = list.getEntries();
          cb(resolveEntries(entries));
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
        cb(resolveEntries(entries));
      });
    }
  },
};

export default resources;
