import { REACT_ELEMENT_TYPE } from './ReactSymbols.js'
import { createFiberFromFragment } from './reactFiber.js'
import { Placement } from './ReactFiberFlags.js'
/**
 * @param {*} shouldTrackSideEffects  是否跟踪副作用
 * @returns
 */
function childReconciler(shouldTrackSideEffects) {
  function placeSingleChild(newFiber) {
    if (shouldTrackSideEffects && newFiber.alternate === null) {
      // 需要跟踪副作用，但其替身不存在，则为其添加副作用，表示未来提交阶段DOM操作会向真实DOM树中添加此节点
      newFiber.flags = Placement;
    }
    return newFiber
  }
  function reconcileSingleElement(returnFiber, currentFirstChild, element) {
    const created = createFiberFromFragment( element.props.children );
    created.return = returnFiber;
    return created;
  }
  /**
   * @param {*} returnFiber 新的父fiber
   * @param {*} currentFirstChild 旧的第一个子fiber
   * @param {*} newChild 新的虚拟DOM
   */
  function reconcileChildFibers( returnFiber, currentFirstChild, newChild) {
    //判断newChild是不是一个对象，如果是说明新的虚拟DOM只有一个元素节点
    const isObject = typeof newChild === 'object' && (newChild);
    if (isObject) { // 单节点
      switch (newChild.$$typeof) {
      case REACT_ELEMENT_TYPE:
        return placeSingleChild(
          reconcileSingleElement( returnFiber, currentFirstChild, newChild )
        )

      default:
        break;
      }
    }
  }
  return reconcileChildFibers
}
export const mountChildFibers = childReconciler(false)
export const reconcileChildFibers = childReconciler(true)
