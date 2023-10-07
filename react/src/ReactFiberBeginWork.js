import { HostRoot, HostComponent } from "./ReactWorkTags";
import { mountChildFibers, reconcileChildFibers } from './ReactChildFiber';
import { shouldSetTextContent } from './ReactDomHostConfig'

// 创建当前fiber的子fiber
export function beginWork(current, workInProgress) {
  switch (workInProgress.tag) {
  case HostRoot:
    return updateHostRoot(current, workInProgress);

  case HostComponent:
    return updateHostComponent(current, workInProgress);

  default:
    break;
  }
}

/**
 * 更新｜挂载根节点
 * @param {*} current 老fiber
 * @param {*} workInProgress 处理中的新fiber
 */
function  updateHostRoot(current, workInProgress) {
  const updateQueue = workInProgress.updateQueue
  // 要更新的虚拟DOM
  const nextChildren = updateQueue.shared.pending.payload.element
  // 旧fiber和新的虚拟DOM对比，创建新的fiber
  reconcileChildren(current, workInProgress, nextChildren);
  // 返回第一个子fiber
  return workInProgress.child
}
function  updateHostComponent(current, workInProgress) {
  const type = workInProgress.type
  const nextProps = workInProgress.pendingProps
  let nextChildren = nextProps.children
  // 如果子元素是文本，则优化下，
  const isDirectTextChild = shouldSetTextContent(type, nextProps)
  if (isDirectTextChild) {
    nextChildren = null
  }

  // 旧fiber和新的虚拟DOM对比，创建新的fiber
  reconcileChildren(current, workInProgress, nextChildren);
  // 返回第一个子fiber
  return workInProgress.child
}

export function reconcileChildren(current, workInProgress, nextChildren) {
  if (current) { // 如果有current则说明是更细
    // 进行比较，得到差异进行更新
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren, // 新的虚拟DOM
    );
  } else { // 否则说明是创建
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren, // 新的虚拟DOM
    )
  }

}
