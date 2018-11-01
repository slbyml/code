// 将vnode渲染到页面
import patch from "./patch"
export function update(el, vnode, prevVnode) {
  if (!prevVnode) {
    // 初始渲染
    patch(el, vnode, false, false)
  } else {
    patch(prevVnode, vnode)
  }
}