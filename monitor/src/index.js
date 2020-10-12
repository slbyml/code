import perf from './per'
import resources from './resources'
import xhrHook from './xhr'
import errorCatch from './err'
import behavior from './behavior';
import send from './send'
import { sendUrl } from './config'

try {
  perf.init((pers) => {
    send(pers)
    console.log('初始化数据',pers);
  })
  
  new resources({
    types: ['img'],
    excludes: [new RegExp(sendUrl)]
  }).init((lists) => {
    send(lists)
    console.log('资源监控：',lists);
  })

  //TODO数据上报的请求不需要再次拦截
  xhrHook.init((xhrInfo) => {
    send(xhrInfo)
    console.log('xhr:',xhrInfo);
  });

  errorCatch.init((err) => {
    send(err)
    console.log('错误上报：', err);
  });

  new behavior().init((path) => {
    send(path)
    console.log(`event path:`,path);
  });
} catch (err) {
  console.log(err);
}