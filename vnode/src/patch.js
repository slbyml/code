import * as nodeOps from './node-ops'
import VNode, {cloneVNode} from "./vnode"
import {
  isUndef,
  isDef,
  isTrue,
  isPrimitive
} from "./util"
import updateProp from "./modules"


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
    // 如果新虚拟节点存在真实DOM元素和ownerArray，
    // 则代表它在之前的渲染中用过。
    // 现在要被用作新节点时有潜在的错误
    // 所以将它改为从本身克隆的节点
    if (isDef(vnode.elm) && isDef(ownerArray)) {
      vnode = ownerArray[index] = cloneVNode(vnode)
    }
    
    const data = vnode.data
    const children = vnode.children
    const tag = vnode.tag
    if (isDef(tag)) {

      // 在根节点得elm上挂载dom
      vnode.elm = nodeOps.createElement(tag, vnode)

      // 在各children得elm上挂载dom
      createChildren(vnode, children, insertedVnodeQueue)
      if (isDef(data)) {
        createProp(emptyNode, vnode)
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

  /**
   * 移除真实node节点
   * @param {node} parentElm  父
   * @param {vnode} vnodes    要移除的vnode
   * @param {number} startIdx  
   * @param {number} endIdx 
   */
  function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      const ch = vnodes[startIdx]
      const elm = ch.elm
      const parent = nodeOps.parentNode(elm)
      
      if (isDef(parent)) {
        nodeOps.removeChild(parent, elm)
      }
    }
  }
  
  /**
   * 添加节点
   * @param {node} parentElm  父节点 
   * @param {node} refElm // 如果有，当前节点（children[3]）会插入到refElm之前
   * @param {vnode} vnodes    // 要插入的节点
   * @param {*} startIdx  // 开始拆入的位置
   * @param {*} endIdx 
   * @param {*} insertedVnodeQueue 
   */
  function addVnodes(parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {  // 循环拆入子节点
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx)
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
          console.error(
            `Duplicate keys detected: '${key}'. This may cause an update error.`,
            vnode.context
          )
        } else {
          seenKeys[key] = true
        }
      }
    }
  }
  
  //生产key与vnode的key的映射哈希表
  //比如childre是这样的 [{xx: xx, key: 'keya'}, {xx: xx, key: 'keyb'}, {xx: xx, key: 'keyc'}]  beginIdx = 0   endIdx = 2  
  //结果生成{keya: 0, keyb: 1, keyc: 2}
  function createKeyToOldIdx(children, beginIdx, endIdx) {
    let i, key
    const map = {}
    for (i=beginIdx; i<=endIdx; ++i) {
      key = children[i].key
      if(isDef(key)) map[key] = i
    }
  }
  
  // 
  function findIdxInOld (node, oldCh, start, end) {
    for (let i = start; i < end; i++) {
      const c = oldCh[i]
      if (isDef(c) && sameVnode(node, c)) return i
    }
  }

  // 挂载data里面的属性
  function createProp (oldNode, vnode) {
    for (let i = 0; i < updateProp.length; ++i) {
      updateProp[i](oldNode, vnode)
    }
  }

  // vnode diff
  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    let oldStartIdx = 0
    let newStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let oldStartVnode = oldCh[0]
    let oldEndVnode = oldCh[oldEndIdx]
    let newEndIdx = newCh.length - 1
    let newStartVnode = newCh[0]
    let newEndVnode = newCh[newEndIdx]
    let oldKeyToIdx, idxInOld, vnodeToMove, refElm

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx]
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        // oldstar <==> newstar
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        // oldend <==> newend
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
        oldEndVnode = oldCh[--oldEndIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        // oldstar <==> newend
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)
        nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
        oldStartVnode = oldCh[++oldStartIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        // oldend <==> newstar
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)
        nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
        oldEndVnode = oldCh[--oldEndIdx]
        newStartVnode = newCh[++newStartIdx]
      } else {
        // 检测重复的key
        // 创建vnode的key；eq：{key: 0, key: 1, key: 2}}
        if (isUndef(oldKeyToIdx))  oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
        // 如果newStartVnode(新的VNode节点)存在key并且这个key在oldVnode中能找到，则idxInOld等于oldKeyToIdx中对应key的索引
        // 否则寻找旧节点数组中与当前newStartVnode(新的VNode节点)相同的节点索引赋予idxInOld
        idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
        if (isUndef(idxInOld)) {
          // 如果没有找到这个key,则创建这个节点
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm)
        } else {
          // 在旧节点数组中找到了相应的节点的索引时，则移动节点
          // 将vnodeToMove赋值为相应的节点
          vnodeToMove = oldCh[idxInOld]
          if (sameVnode(vnodeToMove, newStartVnode)) {
            // 如果相同，则继续对比子级
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue)
             // 将旧节点数组中的该节点设置为undefined
            oldCh[idxInOld] = undefined
            // 移动找到的节点到当前旧首节点之前
            nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
          } else {
            // 如不同，则说明虽然key相同，但是不同元素，当作新元素处理
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
          }
        }
        newStartVnode = newCh[++newStartIdx]
      }
    }
    // 新旧节点开始索引任一方大于其结束索引时结束循环
    if (oldStartIdx > oldEndIdx) {
      /*如果oldStartIdx > oldEndIdx的话，说明老节点已经遍历完了，新节点比老节点多，所以这时候多出来的新节点需要一个一个创建出来加入到真实Dom中*/
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
    } else if (newStartIdx > newEndIdx) {
      /*如果newStartIdx > newEndIdx，说明新节点已经遍历完了，老节点多余新节点，则在父级中移除未处理的剩余旧节点，范围是oldStartIdx~oldEndIdx*/
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
    }
  }

  // 补丁vnode
  function patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    if (oldVnode === vnode) {
      return
    }
    // 让vnode.el引用到现在的真实dom，当el修改时，vnode.el会同步变化。
    const elm = vnode.elm = oldVnode.elm
    const oldCh = oldVnode.children
    const ch = vnode.children

    // 初始化标签属性
    if (isDef(vnode.data) && isDef(vnode.tag)) {
      createProp(oldVnode, vnode)
    }

     /*如果没有text时*/
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        /*新老vnode均有children子节点，则对子节点进行diff操作*/
        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
      } else if (isDef(ch)) {
        /*如果oldVnode没有子节点，先清空elm的文本内容，然后为当前节点加入新的子节点*/
        if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
      } else if (isDef(oldCh)) {
        /*当newVnode没有子节点，则移除所有ele的子节点*/
        removeVnodes(elm, oldCh, 0, oldCh.length - 1)
      } else if (isDef(oldVnode.text)) {
        /*当新老vnode都无子节点，只是文本的替换，因为这个逻辑中新节点text不存在，所以直接去除ele的文本*/
        nodeOps.setTextContent(elm, '')
      }
    } else if (oldVnode.text !== vnode.text) {
      /*当新老vnode的text不一样时，替换文本*/
      nodeOps.setTextContent(elm, vnode.text)
    }

  }

  /**
   * createPatchFunction的返回值，是一个patch函数
   * @param {vnode} oldVnode 
   * @param {Array} vnode 
   * @param {boolean} hydrating  非ssr下为false
   * @param {boolean} removeOnly 特殊的flag，用于transition-group组件
   */
  return function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
    const insertedVnodeQueue = []

    if (isUndef(oldVnode)) {  // oldVnode未定义的时候，其实也就是root节点，创建一个新的节点
      createElm(vnode, insertedVnodeQueue)
    } else {
      const isRealElement = isDef(oldVnode.nodeType) // 判断是否是真实node,第一次渲染是必定是真实node
      // 如果是两个vnode，且相同则执行diff计算
      if (!isRealElement && sameVnode(oldVnode, vnode)) { 
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly)
      } else {
        if (isRealElement) {  // 如果是真实node 则转换成空vnode
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
        // 移除旧的节点
        removeVnodes(parentElm, [oldVnode], 0, 0)
      }
    }

    return vnode.elm
  }
}

// 渲染入口
const patch = createPatchFunction()
export default patch
