import { REACT_ELEMENT_TYPE } from './ReactSymbols.js'
import { createFiberFromFragment, createWorkInProgess } from './reactFiber.js'
import { Deletion, Placement } from './ReactFiberFlags.js'
/**
 * @param {*} shouldTrackSideEffects  是否跟踪副作用
 * @returns
 */
function childReconciler(shouldTrackSideEffects) {
  // 旧子fiber标记为删除
  function deleteChild(returnFiber, childToDelete) {
    if (!shouldTrackSideEffects) {
      return;
    }
    const lastEffect = returnFiber.lastEffect
    if (lastEffect) {
      lastEffect.nextEffect = childToDelete
      returnFiber.lastEffect = childToDelete
    } else {
      returnFiber.firstEffect = returnFiber.lastEffect = childToDelete
    }
    childToDelete.nextEffect = null
    childToDelete.flags = Deletion
  }
  function deleteRemainingChildren(returnFiber, childToDelete) {
    while (childToDelete) {
      deleteChild(returnFiber, childToDelete)
      childToDelete = childToDelete.sibling
    }
  }
  function placeSingleChild(newFiber) {
    if (shouldTrackSideEffects && !newFiber.alternate) {
      // 需要跟踪副作用，但其替身不存在，则为其添加副作用，表示未来提交阶段DOM操作会向真实DOM树中添加此节点
      newFiber.flags = Placement;
    }
    return newFiber
  }

  function createChild(returnFiber, newChild) {
    const created = createFiberFromFragment(newChild)
    created.return = returnFiber
    return created
  }
  // 多节点处理
  function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren) {
    // 生成的第一个新fiber
    let resultingFirstChild = null
    // 存储上一个新处理的fiber
    let previousNewFiber = null
    // 第一个老fiber
    let oldFiber = currentFirstChild
    // let newIdx = 0
    if (!oldFiber) {
      for (let newIdx=0; newIdx < newChildren.length; newIdx++) {
        const newFiber = createChild(returnFiber, newChildren[newIdx])
        if (!previousNewFiber) {
          resultingFirstChild = newFiber
        } else {
          previousNewFiber.sibling = newFiber
        }
        previousNewFiber = newFiber
      }
      return resultingFirstChild
    }
    return resultingFirstChild
  }

  function useFiber(oldFiber, pendingProps) {
    let clone = createWorkInProgess(oldFiber, pendingProps)
    clone.index = 0
    clone.sibling = null
    return clone
  }
  // currentFirstChild 第一个旧的fiber
  // 单节点
  function reconcileSingleElement(returnFiber, currentFirstChild, element) {
    let key = element.key
    let child = currentFirstChild
    while(child) {
      if (child.key === key) {
        if (child.type === element.type) {
          // 除了当前fiber，其他都删除
          deleteRemainingChildren(returnFiber, child.sibling)
          // 复用当前fiber
          const existing = useFiber(child, element.props)
          existing.return = returnFiber
          return existing
        } else {
          // 删除包括当前fiber在内的所有旧fiber
          deleteRemainingChildren(returnFiber, child)
          break;
        }
      } else {
        // 旧fiber标记为删除
        deleteChild(returnFiber, child)
      }
      child = child.sibling
    }

    const created = createFiberFromFragment( element );
    created.return = returnFiber;
    return created;
  }
  /**
   * @param {*} returnFiber 新的父fiber
   * @param {*} currentFirstChild 旧的第一个子fiber
   * @param {*} newChild 新的虚拟DOM
   */
  function reconcileChildFibers(returnFiber, currentFirstChild, newChild) {

    //判断newChild是不是一个对象，如果是说明新的虚拟DOM只有一个元素节点
    const isObject = typeof newChild === 'object' && (newChild);
    if (isObject) { // 单节点
      switch (newChild.$$typeof) {
      case REACT_ELEMENT_TYPE:
        return placeSingleChild(
          reconcileSingleElement(returnFiber, currentFirstChild, newChild )
        )

      default:
        break;
      }
    }
    if (Array.isArray(newChild)) {  // 多节点
      return reconcileChildrenArray(returnFiber, currentFirstChild, newChild)
    }
  }
  return reconcileChildFibers
}
export const mountChildFibers = childReconciler(false)
export const reconcileChildFibers = childReconciler(true)
