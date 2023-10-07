import { REACT_ELEMENT_TYPE } from './ReactSymbols.js'
// 保留属性
const RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true
}
/**
 * 创建虚拟DOM
 * @param {*} type 标签类型
 * @param {*} config 配置对象
 * @param {*} children 子元素，多个子元素，并列排法规
 */
function createElement(type, config, children) {
  let propName;
  const props = {}
  let key = null
  let ref = null
  if (config) {
    if(config.key) {
      key  = config.key
    }
    if(config.ref) {
      ref  = config.ref
    }
    for (propName in config) {
      if (!RESERVED_PROPS[propName]) {
        props[propName] = config[propName]
      }
    }
  }
  // 处理子元素
  const childrenLength = arguments.length - 2 // 第二个以后都是子元素
  if (childrenLength === 1) {
    props.children = children
  } else if(childrenLength > 1){
    const childArray = new Array(childrenLength)
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i+2]
    }
    props.children = childArray
  }
  return {
    $$typeof: REACT_ELEMENT_TYPE, // react元素，基本用不到
    type,
    key,
    ref,
    props
  }
}

const React = {
  createElement
}
export default React
