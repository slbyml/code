import VNode, { createEmptyVNode } from './vnode'
import { normalizeChildren } from './normalize-children'
import {
  isDef,
  isPrimitive,
  isReservedTag
} from './util'

/**
 * 外部调用生成vnode入口
 * @param {*} tag 标签名
 * @param {*} data attr参数
 * @param {*} children 子元素
 */
export function createElement (tag, data, children) {
  // 如果没有传data, 兼容参数个数处理
  if (Array.isArray(data) || isPrimitive(data)) {
    children = data
    data = undefined
  }
  return _createElement(tag, data, children)
}

/**
 * 生成vnode
 * @param {*} tag 标签名
 * @param {*} data attr参数
 * @param {*} children 子元素
 */
export function _createElement (tag, data, children) {
  /* 如果tag不存在创建一个空节点 */
  if (!tag) {
    return createEmptyVNode()
  }

  children = normalizeChildren(children)

  let vnode
  if (typeof tag === 'string') {
    // 判断是否是保留标签
    if (isReservedTag(tag)) {
      vnode = new VNode(
        tag, data, children, undefined, undefined
      )
    } else {
      console.log('vue 可能是一个components')
    }
  } else {
    console.log('tag不是字符串的时候则是组件的构造类')
  }
  if (isDef(vnode)) {
    return vnode
  } else {
    /* 如果vnode没有成功创建则创建空节点 */
    return createEmptyVNode()
  }
}
