// 更新attr
import {
  isUndef
} from "../util"
import {
  isBooleanAttr,
  isFalsyAttrValue
} from "../util"

function setAttr(el, key, value) {
  // 判断是否是val只为boolean的元素
  if (isBooleanAttr(key)) {
    // 判断val是否不存在或者为false
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key)
    } else {
      el.setAttribute(key, value)
    }
  } else {
    baseSetAttr(el, key, value)
  }
}


function baseSetAttr(el, key, value) {
  // 判断val是否不存在或者为false
  if (isFalsyAttrValue(value)) {
    el.removeAttribute(key)
  } else {
    el.setAttribute(key, value)
  }
}

export default function updateAttrs (oldVnode, vnode) {
  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return
  }
  let key, cur, old
  const elm = vnode.elm
  const oldAttrs = oldVnode.data.attrs || {}
  let attrs = vnode.data.attrs || {}
  // 新vnode如果和旧vnode的属性不一样，则更新node
  for (key in attrs) {
    cur = attrs[key]
    old = oldAttrs[key]
    if (old !== cur) {
      setAttr(elm, key, cur)
    }
  }

  // 如果旧的vnode有属性，新的没有，则移除
  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      elm.removeAttribute(key)
    }
  }
}
