import { eventMethod, getClass, extend } from "./util"
/**
 * 点击上报路径
 */
let getpath = (element, config) => {
  if (!(element instanceof Element)) {
    console.warn("不是一个标准的html标签");
    return void 0;
  }

  if (element.nodeType !== 1) {
    return void 0;
  }

  let childIndex = (ele) => {
    let parent = ele.parentNode;
    let children = Array.from(parent.childNodes).filter(_ => _.nodeType === 1);
    let index = 0;
    for (let i = 0; i < children.length; i++) {
      if (children[i] === ele) {
        index = i;
        break;
      }
    }
    return index === 0 ? '' : `:nth-child(${index + 1})`;
  };

  let _path = '';

  while (element !== document && element !== document.documentElement && element !== document.body) {
    const tag = element.tagName.toLowerCase();
    // 如果遇到有id的标签则直接返回
    if (element.id) {
      _path = `#${element.id}${_path}`
      break
    }

    // 获取标签在同级标签的位置：nth-child
    const eleIndex = childIndex(element);
    
    // 获取类名
    let _class = ''
    if (config.useClass) {
      _class = getClass(element)
    }

    _path = '>' + tag + eleIndex + _class + _path;

    // 一旦能够精确找到dom则立即返回，不在向parent遍历
    if(document.querySelector && document.querySelectorAll(_path.substr(1)).length <= 1){
      break
    }
    element = element.parentNode;
  }
  // 需要去掉开头的”>“符号
  return _path === '' ? '' : _path.substr(1)
};

// 默认参数
const defaultOptions = {
  useClass: true, //是否显示class
  events: 'click', // 监听事件
  attr: '' // 当有attr参数的时候，则默认只手机带有此参数的事件
}

export default class behavior {
  constructor(config) {
    this.config = extend({}, defaultOptions, config)
  }
  init(cb){
    document.body[eventMethod.method](eventMethod.prefix + this.config.events, (event) => {
      const _event = event || window.event
      const _target = _event.target || _event.srcElement
      
      // 只对有特殊标记的标签埋点
      if(this.config.attr !== ''){
        const _attr = _target.getAttribute(this.config.attr)
        if(_attr !== '' && _attr !== true)  return false
      }
      
      //TODO 待完善：对有特殊标记的标签增加自定义参数
      //例：<div v-monitor="{data: 123}"></div>

      let _path = getpath(_target, this.config);
      if(!_path) return;
      cb({
        path: _path,
        event: 'click'
      });
    }, false);
  }
}