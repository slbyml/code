import { stringify } from "./util"

const send = (obj) => {
  const url = window.__monitor__.config.sendUrl
  const opt = window.__monitor__.config.options || {}
  obj = Object.assign({}, opt, obj)
  // TODO 可以设置采集率只采集 30%；可以通过sendBeacon来发送数据
  // if(Math.random() > 0.3) return false; 
  let i = new Image();
  i.onload = i.onerror = i.onabort = function () {
    i = i.onload = i.onerror = i.onabort = null;
  }
  i.src = url + '?' + stringify(obj);
}
export default send