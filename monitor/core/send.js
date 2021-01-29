import { stringify } from "./util"

const assignData = (obj) => {
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

const send = (obj) => {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(assignData(obj))
  } else if(typeof Promise !== 'undefined' && /native code/.test(Promise.toString()){
    Promise.resolve().then(() => assignData(obj))
  } else {
    setTimeout(() => {
      assignData(obj)
    })
  }
}
export default send
