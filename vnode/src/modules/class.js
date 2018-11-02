import {
  isUndef
} from "../util"
// 更新class
export default function updateClass(oldVnode, vnode) {
  const el = vnode.elm
  const data = vnode.data
  const oldData = oldVnode.data
  if (isUndef(data.class) && (isUndef(oldData) || isUndef(oldData.class))) return;

  const cls = data.class

  if (cls !== el._prevClass) {
    el.setAttribute('class', cls)
    el._prevClass = cls
  }
}