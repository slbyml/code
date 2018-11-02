import {
  isUndef
} from "../util"

// 更新样式
export default function updateStyle(oldVnode, vnode) {
  
  const data = vnode.data
  const oldData = oldVnode.data
  const style = data.style

  if(isUndef(data.style) && isUndef(oldData.style)) return;

  let cur, name
  const el = vnode.elm
  const oldStyleBinding = oldData.normalizedStyle || oldData.style || {}    // 上一次绑定的style

  // 下次执行会用到，下次的oldStyle
  vnode.data.normalizedStyle = style

  const newStyle = style

  // 如果旧vnode有样式，新vnode没有，则删除
  for (name in oldStyleBinding) {
    if (isUndef(newStyle[name])) {
      el.style[name] = ""
    }
  }
  // 如果旧vnode和新vnode样式不一样，则更新
  for (name in newStyle) {
    cur = newStyle[name]
    if (cur !== oldStyleBinding[name]) {
      // ie9 设置为NULL没有效果，必须使用空字符串
      cur == null ? '' : cur
      el.style[name] = cur
    }
  } 
}
