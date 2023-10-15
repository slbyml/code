import { createWorkInProgess } from './reactFiber'
import { HostRoot } from './ReactWorkTags'
import { beginWork } from './ReactFiberBeginWork'
import { completeWork } from './ReactFiberCompleteWork'
import { Deletion, Placement, Update, PlacemetAndUpdate } from './ReactFiberFlags'
import { commitPlacement, commitWork, commitDeletion } from './ReactFiberCommitWork'
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
  workLoopSync()
  commitRoot()
}
function commitRoot() {
  const finishedWork = workInProgressRoot.current.alternate
  workInProgressRoot.finishedWork = finishedWork
  commitMutationEffects(workInProgressRoot)
}
function getflag(flags) {
  switch (flags) {
  case Placement:
    return '插入';
  case Update:
    return '更新';
  case Deletion:
    return '删除';
  case PlacemetAndUpdate:
    return '移动&更新';
  default:
    break;
  }
}
function commitMutationEffects(root) {
  const finishedWork = root.finishedWork
  let nextEffect = finishedWork.firstEffect
  while (nextEffect) {
    const flags = nextEffect.flags
    const current = nextEffect.alternate
    // 插入
    if (flags === Placement) {
      commitPlacement(nextEffect)
    } else if (flags === PlacemetAndUpdate) {
      // 0110
      commitPlacement(nextEffect)
      // 0100
      nextEffect.flags = Update
      commitWork(current, nextEffect)
    } else if (flags === Update) {
      commitWork(current, nextEffect)
    } else if(flags === Deletion) {
      commitDeletion(nextEffect)
    }
    console.log(`${getflag(nextEffect.flags)}—${nextEffect.type}—key:#${nextEffect.key}`);
    nextEffect = nextEffect.nextEffect
  }
  root.current = finishedWork
}

/**
 * 开始自上而下的创建fiber
 */
function workLoopSync() {
  while (workInProgress) {
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
  // 将新属性同步到老属性上
  unitOfWork.memoizedProps = unitOfWork.pendingProps
  if (next) {
    workInProgress = next;
  } else {
    completeUnitOfWork(unitOfWork);
  }
}

function collectEffectList(returnFiber, completedWork) {
  if (!returnFiber) return;
  if (!returnFiber.firstEffect) {
    returnFiber.firstEffect = completedWork.firstEffect
  }
  if (completedWork.lastEffect) {
    if (returnFiber.lastEffect) {
      returnFiber.lastEffect.nextEffect = completedWork.firstEffect
    }
    returnFiber.lastEffect = completedWork.lastEffect
  }
  const flags =  completedWork.flags
  if (flags) {
    if (returnFiber.lastEffect) {
      returnFiber.lastEffect.nextEffect = completedWork
    } else {
      returnFiber.firstEffect = completedWork
    }
    returnFiber.lastEffect = completedWork
  }
}

function completeUnitOfWork(unitOfWork) {
  let completedWork = unitOfWork
  do {
    const current = completedWork.alternate
    const returnFiber = completedWork.return
    // 此fiber对应真实DOM节点的创建和属性赋值
    completeWork(current, completedWork)
    // 收集当前fiber的副作用
    collectEffectList(returnFiber, completedWork)
    const siblingFiber = completedWork.sibling
    if (siblingFiber) {
      workInProgress = siblingFiber
      return;
    }
    completedWork = returnFiber
    workInProgress = completedWork
  } while (workInProgress);
}
