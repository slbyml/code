/**
 * ajax 
 */
let xhrHook = {
  init: (cb) => {
    let xhr = window.XMLHttpRequest;
    // 防止多次修改
    if (xhr._eagle_flag === true) {
      return void 0;
    }
    xhr._eagle_flag = true;

    let _oldOpen = xhr.prototype.open;
    xhr.prototype.open = function (method, url) {
      this.xhr_info = {
        url: url,
        method: method,
        status: null
      };
      return _oldOpen.apply(this, arguments);
    };

    let _oldSend = xhr.prototype.send;
    xhr.prototype.send = function (value) {
      let _self = this;
      this.start_time = Date.now();

      let ajaxEnd = (event) => () => {
        if (_self.response) {
          let responseSize = null;
          switch(_self.responseType) {
          case 'json':
            responseSize = JSON && JSON.stringify(_self.response).length;
            break;
          case 'blob':
          case 'moz-blob':
            responseSize = _self.response.size;
            break;
          case 'arraybuffer':
            responseSize = _self.response.byteLength;
            break;
          case 'document':
            responseSize = _self.response.documentElement && _self.response.documentElement.innerHTML && (_self.response.documentElement.innerHTML.length + 28);
            break;
          default:
            responseSize = _self.responseText.length;
          }
          _self.xhr_info.event = event;
          _self.xhr_info.status = _self.status;
          _self.xhr_info.success = (_self.status >= 200 && _self.status <= 206) || _self.status === 304;
          _self.xhr_info.duration = Date.now() - _self.start_time;
          _self.xhr_info.responseSize = responseSize; // 相应大小
          _self.xhr_info.requestSize = value ? value.length : 0;
          _self.xhr_info.type = 'xhr';
          cb(_self.xhr_info);
        }
      };

      
      if (this.addEventListener) {
        // 请求已经结束
        this.addEventListener('load', ajaxEnd('load'), false);
        this.addEventListener('error', ajaxEnd('error'), false);
        this.addEventListener('abort', ajaxEnd('abort'), false);
      } else {
        let _origin_onreadystatechange = this.onreadystatechange;
        this.onreadystatechange = function () {
          if (_origin_onreadystatechange) {
            _oldOpen.apply(this, arguments);
          }
          if (this.readyState === 4) {
            ajaxEnd('end')();
          }
        };
      }
      return _oldSend.apply(this, arguments);
    };

    // fetch hook
    if (window.fetch) {
      let _origin_fetch = window.fetch;
      window.fetch = function () {
        let startTime = Date.now();
        let args = Array.from(arguments);

        let fetchInput = args[0];
        let method = 'GET';
        let url;

        if (typeof fetchInput === 'string') {
          url = fetchInput;
        } else if ('Request' in window && fetchInput instanceof window.Request) {
          url = fetchInput.url;
          if (fetchInput.method) {
            method = fetchInput.method;
          }
        } else {
          url = '' + fetchInput;
        }

        if (args[1] && args[1].method) {
          method = args[1].method;
        }
        
        let fetchData = {
          method: method,
          url: url,
          status: null,
        };

        return _origin_fetch.apply(this, args).then(function(response) {
          fetchData.status = response.status;
          fetchData.type = 'fetch';
          fetchData.duration = Date.now() - startTime;
          cb(fetchData);
          return response;
        });
      }
    }
  }
};

export default xhrHook;