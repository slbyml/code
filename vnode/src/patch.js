import * as nodeOps from './node-ops'
import VNode from "./vnode"
import {
  isUndef,
  isDef,
  isTrue,
  isPrimitive
} from "./util"

export const emptyNode = new VNode('', {}, [])

/**
 * 判断是否是相同节点
 * key相同
 * tag（当前节点的标签名）相同
 * isComment（注释节点）相同
 * 是否data都有定义
 * 当标签是<input>的时候，type必须相同
 * @param {vnode} a  oldVnode
 * @param {vnode} b  newVnode
 */
function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      )
    )
  )
}
/**
 * 判断是否是相同input
 * 某些浏览器不支持动态修改<input>类型，所以他们被视为不同类型
 * @param {vnode} a  oldVnode
 * @param {vnode} b  newVnode
 */
function sameInputType (a, b) {
  if (a.tag !== 'input') return true
  let i
  const typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type
  const typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type
  return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
}

function createPatchFunction() {

  // 将真实node 转换成vnode
  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  /**
   * 创建一个节点
   * @param {vnode} vnode 
   * @param {Array} insertedVnodeQueue 
   * @param {node} parentElm 
   * @param {node} refElm  // 如果有，当前节点（children[3]）会插入到refElm之前
   * @param {*} nested 
   * @param {Array} ownerArray 当前节点（children[3]）所在得数组(children)
   * @param {number} index   当前节点（children[3]）在数组中的位置（3）
   */
  function createElm (vnode, insertedVnodeQueue, parentElm, refElm, nested, ownerArray, index) {
    // 克隆??????????????
    if (isDef(vnode.elm) && isDef(ownerArray)) {
      vnode = ownerArray[index] = cloneVNode(vnode)
    }
    /*insertedVnodeQueue为空数组[]的时候isRootInsert标志为true*/
    vnode.isRootInsert = !nested

    const data = vnode.data
    const children = vnode.children
    const tag = vnode.tag
    if (isDef(tag)) {

      // 在根节点得elm上挂载dom
      vnode.elm = nodeOps.createElement(tag, vnode)

      // 在各children得elm上挂载dom
      createChildren(vnode, children, insertedVnodeQueue)
      if (isDef(data)) {
        invokeCreateHooks(vnode, insertedVnodeQueue)
      }
      insert(parentElm, vnode.elm, refElm)
      
    } else if (isTrue(vnode.isComment)) {   // 创建注释节点
      vnode.elm = nodeOps.createComment(vnode.text)
      insert(parentElm, vnode.elm, refElm)
    } else {    // 创建文本节点
      vnode.elm = nodeOps.createTextNode(vnode.text)
      insert(parentElm, vnode.elm, refElm)
    }
  }

  function insert (parent, elm, ref) {
    if (isDef(parent)) {
      if (isDef(ref)) {   // 有ref说明是在ref节点前面拆入节点
        if (nodeOps.parentNode(ref) === parent) {
          nodeOps.insertBefore(parent, elm, ref)
        }
      } else {
        nodeOps.appendChild(parent, elm)
      }
    }
  }
  
  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      if (process.env.NODE_ENV !== 'production') {
        checkDuplicateKeys(children)    // 在循环中（v-for）判断是否有相同的key
      }
      for (let i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i)
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)))
    }
  }
  // 判断keys是否正确
  function checkDuplicateKeys (children) {
    const seenKeys = {}
    for (let i = 0; i < children.length; i++) {
      const vnode = children[i]
      const key = vnode.key
      if (isDef(key)) {
        if (seenKeys[key]) {  // 例如：v-for的key已经存在，则报错
          warn(
            `Duplicate keys detected: '${key}'. This may cause an update error.`,
            vnode.context
          )
        } else {
          seenKeys[key] = true
        }
      }
    }
  }
  // 挂载data里面的属性
  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (let i = 0; i < cbs.create.length; ++i) {
      cbs.create[i](emptyNode, vnode)
    }
  }
  /**
   * createPatchFunction的返回值，是一个patch函数
   * @param {vnode} oldVnode 
   * @param {Array} vnode 
   * @param {boolean} hydrating  // 非ssr下为false
   */
  return function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
    const insertedVnodeQueue = []

    if (isUndef(oldVnode)) {  // oldVnode未定义的时候，其实也就是root节点，创建一个新的节点
      createElm(vnode, insertedVnodeQueue)
    } else {
      const isRealElement = isDef(oldVnode.nodeType) // 判断是否是真实node,第一次渲染是必定是真实node
      if (!isRealElement && sameVnode(oldVnode, vnode)) { 

      } else {
        if (isRealElement) {  // 如果是真实node 则转换成vnode
          oldVnode = emptyNodeAt(oldVnode)
        }
        const oldElm = oldVnode.elm
        const parentElm = nodeOps.parentNode(oldElm)

        createElm(
          vnode,
          insertedVnodeQueue,
          parentElm,
          nodeOps.nextSibling(oldElm)
        )
      }
    }

  }
}

// 渲染入口
const patch = createPatchFunction()
export default patch
