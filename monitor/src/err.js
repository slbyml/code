/**
 * 
 * 错误收集
 */
import { getTimestamp } from "./util"

let formatError = (errObj) => {
  let col = errObj.column || errObj.columnNumber; // Safari Firefox
  let row = errObj.line || errObj.lineNumber; // Safari Firefox
  let message = errObj.message;
  let name = errObj.name;

  let {stack} = errObj;
  if (stack) {
    let matchUrl = stack.match(/https?:\/\/[^\n]+/);
    let urlFirstStack = matchUrl ? matchUrl[0] : '';
    let regUrlCheck = /https?:\/\/(\S)*\.js/;

    let resourceUrl = '';
    if (regUrlCheck.test(urlFirstStack)) {
      resourceUrl = urlFirstStack.match(regUrlCheck)[0];
    }

    let stackCol = null;
    let stackRow = null;
    let posStack = urlFirstStack.match(/:(\d+):(\d+)/);
    if (posStack && posStack.length >= 3) {
      [, stackCol, stackRow] = posStack;
    }

    // TODO formatStack
    return {
      content: stack,
      col: Number(col || stackCol),
      row: Number(row || stackRow),
      message, name, resourceUrl
    };
  }

  return {
    row, col, message, name
  }
};

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