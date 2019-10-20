import perf from './per'
import resources from './resources'
import xhrHook from './xhr'
import errorCatch from './err'
import behavior from './behavior';

perf.init((pers) => {
  console.log('上传数据',pers);
})

//TODO 此方法可扩展，可增加配置项过滤不需要上报的静态资源,比如上报的图片请求
resources.init((lists) => {
  console.log('资源监控',lists);
})

//TODO数据上报的请求不需要再次拦截
xhrHook.init((xhrInfo) => {
  console.log(xhrInfo);
});

errorCatch.init((err) => {
  console.log('errorCatch', err);
});

behavior.init(() => {
  console.log('behavior init');
});