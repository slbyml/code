export  default class VNode {
  constructor(tag, data, children, text, elm, context) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.context = context
    this.isComment = false   // 注释节点
    this.key = data && data.key
    this.parent = undefined
  }
}

export const createEmptyVNode = (text = "") => {
  const node = new VNode()
  node.text = text
  return node
}

export function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}


export function cloneVNode (vnode) {
  const cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context
  )
  cloned.key = vnode.key
  cloned.isComment = vnode.isComment
  cloned.isCloned = true
  return cloned
}
