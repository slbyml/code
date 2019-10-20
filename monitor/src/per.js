/**
 * 页面加载监控
 */
import { Util, filterTime, performance } from './util.js'

export default {
  init(cb) {
    let reportPerf = function () {
      if (!performance) {
        return void 0;
      }

      let timing = performance.timing;

      let perfData = {
        // 网络建连
        pervPage: filterTime(timing.fetchStart, timing.navigationStart), // 上一个页面离开时间
        redirect: filterTime(timing.responseEnd, timing.redirectStart), // 页面重定向时间
        dns: filterTime(timing.domainLookupEnd, timing.domainLookupStart), // DNS查找时间
        connect: filterTime(timing.connectEnd, timing.connectStart), // TCP建连时间
        network: filterTime(timing.connectEnd, timing.navigationStart), // 网络链接总耗时

        // 网络接收
        send: filterTime(timing.responseStart, timing.requestStart), // 前端从发送到接收到后端第一个返回
        receive: filterTime(timing.responseEnd, timing.responseStart), // 接受页面时间
        request: filterTime(timing.responseEnd, timing.requestStart), // 请求页面总时间

        // 前端渲染
        dom: filterTime(timing.domComplete, timing.domLoading), // dom解析时间
        loadEvent: filterTime(timing.loadEventEnd, timing.loadEventStart), // loadEvent时间
        frontend: filterTime(timing.loadEventEnd, timing.domLoading), // 前端总时间

        // 关键阶段，包括DNS查询及重定向时间
        load: filterTime(timing.loadEventEnd, timing.navigationStart), // 从开始到页面完全加载总时间
        domReady: filterTime(timing.domContentLoadedEventStart, timing.navigationStart), // 从开始到domready时间
        interactive: filterTime(timing.domInteractive, timing.navigationStart), // 从开始到可操作时间
        ttfb: filterTime(timing.responseStart, timing.navigationStart),  // 从开始到首字节时间
      };

      return perfData;
    };

    Util.domready(() => {
      let perfData = reportPerf('domready');
      perfData.type = 'domready';
      cb(perfData);
    });

    Util.onload(() => {
      let perfData = reportPerf('onload');
      perfData.type = 'onload';
      cb(perfData);
    });
  }
  
}