/**
 *
 * 错误收集
 */
import { getTimestamp, formatError, getLocationHref } from "./util"

let errorCatch = {
  init: (cb) => {
    let _originOnerror = window.onerror; // 无法捕获语法错误,静态资源异常，或者接口异常
    window.onerror = (...arg) => {
      let [errorMessage, scriptURI, lineNumber, columnNumber, errorObj] = arg;
      let errorInfo = formatError(errorObj);
      errorInfo._errorMessage = errorMessage;
      errorInfo._scriptURI = scriptURI;
      errorInfo._lineNumber = lineNumber;
      errorInfo._columnNumber = columnNumber;
      errorInfo.pageUrl = getLocationHref()
      errorInfo.type = 'onerror';
      errorInfo.sTime= getTimestamp(),
      cb(errorInfo);
      _originOnerror && _originOnerror.apply(window, arg);
      return true // 可以防止错误输出到控制台
    };
    // 捕获静态资源报错
    window.addEventListener("error", function (event) {
      const target = event.target || event.srcElement;
      const isElementTarget =
          target instanceof HTMLScriptElement ||
          target instanceof HTMLLinkElement ||
          target instanceof HTMLImageElement;
      if (!isElementTarget) return false;

      const url = target.src || target.href;
      cb({
        type: 'resources-error',
        sTime: getTimestamp(),
        pageUrl: getLocationHref(),
        resources: url
      });

    }, true );

    let _originOnunhandledrejection = window.onunhandledrejection;
    window.onunhandledrejection = (...arg) => {
      let e = arg[0];
      e.preventDefault()  // 去掉控制台的异常
      let reason = e.reason;
      cb({
        type: e.type || 'unhandledrejection',
        sTime: getTimestamp(),
        reason
      });
      _originOnunhandledrejection && _originOnunhandledrejection.apply(window, arg);
    };
  },
};

export default errorCatch;
