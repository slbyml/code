import { HostRoot } from './ReactWorkTags'
// 正在更新的根
let workInProgressRoot = null
// 正在更新的fiber
let workInProgress = null
/**
 * 调度更新fiber
 */
export function scheduleUpdateOnFiber(fiber) {
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
    parent = parent.parent;
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
}
