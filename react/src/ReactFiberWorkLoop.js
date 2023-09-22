import { createWorkInProgess } from './reactFiber'
import { HostRoot } from './ReactWorkTags'
import { beginWork } from './ReactFiberBeginWork'
// 正在更新的根
let workInProgressRoot = null
// 正在更新的fiber
let workInProgress = null
/**
 * 调度更新fiber
 */
export function  scheduleUpdateOnFiber(fiber) {
  const fiberRoot = markUpdateLaneFromFiberToRoot(fiber)
  performSyncWorkOnRoot(fiberRoot)
}

/**
 * 向上查找更新fiber的根节点
 * @param {*} sourceFiber
 */
function markUpdateLaneFromFiberToRoot(sourceFiber){
  let node = sourceFiber;
  let parent = sourceFiber.return;
  while (parent) {
    node = parent;
    parent = parent.return;
  }

  if (node.tag === HostRoot) {
    return node.stateNode;
  } else {
    return null;
  }
}

/**
 * 根据老的fiber树和更新对象创建新的fiber树，然后根据新的fiber树更新真实DOM
 * @param {*} fiberRoot
 */
function performSyncWorkOnRoot(fiberRoot) {
  workInProgressRoot = fiberRoot
  workInProgress = createWorkInProgess(workInProgressRoot.current)
  console.log(workInProgress);
  workLoopSync()
}
/**
 * 开始自上而下的创建fiber
 */
function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

/**
 * 开始执行每个单元
 */
function performUnitOfWork(unitOfWork) {
  // 正在处理的fiber替身
  const current = unitOfWork.alternate;
  // 处理当前fiber的子fiber链表
  // 返回下一个要处理的fiber，一般为unitOfWork的第一个子fiber
  let next = beginWork(current, unitOfWork);
  // 将新熟悉同步到老属性上
  unitOfWork.memoizedProps = unitOfWork.pendingProps
  if (next === null) {
    // completeUnitOfWork(unitOfWork);
  } else {
    workInProgress = next;
  }

}
