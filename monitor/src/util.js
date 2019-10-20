let isOnload = false
// let isDOMReady = false
const cycleFreq = 100 // 循环轮询的时间

export const Util = {
  addEventListener: function (name, callback, useCapture) {
    if (window.addEventListener) {
      return window.addEventListener(name, callback, useCapture);
    } else if (window.attachEvent) {
      return window.attachEvent('on' + name, callback);
    }
  },

  domready: function (callback) {
    if ( isOnload === true ) { return void 0; }
    let timer = null;

    if ( document.readyState === 'interactive' ) { //文档加载完成，已被解析，但是图片等资源仍在加载
      runCheck();
    } else if (document.addEventListener) {
      document.addEventListener('DOMContentLoaded', function () {
        runCheck();
      }, false);
    } else if (document.attachEvent) {
      document.attachEvent('onreadystatechange', function () {
        runCheck();
      });
    }

    function runCheck() {
      // domInteractive可能为0，因为domInteractive是在监听DOM解析完成后才会有值，但是此函数是在纯HTML被完全加载以及解析时，被调用；因此可以用轮训方式获取
      if ( performance.timing.domInteractive ) {
        clearTimeout(timer);
        callback();
        // isDOMReady = true;
      } else {
        timer = setTimeout(runCheck, cycleFreq);
      }
    }
  },

  onload: function (callback) {
    let timer = null;

    if (document.readyState === 'complete') { //资源加载完，load即将被触发
      runCheck();
    } else {
      Util.addEventListener('load', function () {
        runCheck();
      }, false);
    }

    function runCheck() {
      // loadEventEnd可能为0，因为loadEventEnd是在load事件发送后才会有值，但是此函数是在资源加载完成时，被调用；因此可以用轮训方式获取
      if ( performance.timing.loadEventEnd ) {
        clearTimeout(timer);
        callback();
        isOnload = true;
      } else {
        timer = setTimeout(runCheck, cycleFreq);
      }
    }
  }
}

export const noop = () => {};

export const onload = (cb) => {
  if (document.readyState === 'complete') {
    cb();
  }
  window.addEventListener('load', cb);
};

// 过滤无效数据
export const filterTime = (a, b) => {
  return (a > 0 && b > 0 && (a - b) >= 0) ? (a - b) : undefined;
}

export const performance = window.performance || window.mozPerformance || window.msPerformance || window.webkitPerformance;