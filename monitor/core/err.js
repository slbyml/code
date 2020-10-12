/**
 * 
 * 错误收集
 */
import { getTimestamp, formatError } from "./util"

let errorCatch = {
  init: (cb) => {
    let _originOnerror = window.onerror;
    window.onerror = (...arg) => {
      let [errorMessage, scriptURI, lineNumber, columnNumber, errorObj] = arg;
      let errorInfo = formatError(errorObj);
      errorInfo._errorMessage = errorMessage;
      errorInfo._scriptURI = scriptURI;
      errorInfo._lineNumber = lineNumber;
      errorInfo._columnNumber = columnNumber;
      errorInfo.type = 'onerror';
      errorInfo.sTime= getTimestamp(),
      cb(errorInfo);
      _originOnerror && _originOnerror.apply(window, arg);
      return true // 可以防止错误输出到控制台
    };

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