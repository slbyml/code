import { appendChild, removeChild, insertBefore} from './ReactDomHostConfig';
import { HostComponent, HostRoot } from './ReactWorkTags'
import { updateProperties } from './ReactDOMComponent'
import { Placement } from './ReactFiberFlags';

function getParentStateNode(fiber) {
  let parent = fiber.return
  do {
    if (parent.tag === HostComponent) {
      return parent.stateNode
    } else if ( parent.tag === HostRoot) {
      // 根
      return parent.stateNode.containerInfo
    } else {
      // 组件
      parent = parent.return
    }
  } while (parent);
}
// 插入节点
export function commitPlacement(nextEffect) {
  let stateNode = nextEffect.stateNode
  let parentStateNode = getParentStateNode(nextEffect)
  let before = getHostSibling(nextEffect)
  if (before) {
    insertBefore(parentStateNode, stateNode, before)
  } else {
    appendChild(parentStateNode, stateNode)
  }
}
function getHostSibling(fiber) {
  let node = fiber.sibling
  while (node) {
    // 找到当前节点之后最近的一个不是插入的节点
    if(!(node.flags & Placement)) {
      return node.stateNode
    }
    node = node.sibling
  }
  return null
}
// 更新
export function commitWork(current, finishedWork) {
  const updateQueue = finishedWork.updateQueue
  finishedWork.updateQueue = null
  if (updateQueue) {
    updateProperties(finishedWork.stateNode, updateQueue)
  }
}
// 删除
export function commitDeletion(fiber) {
  if (!fiber) return;
  let parentStateNode = getParentStateNode(fiber)
  removeChild(parentStateNode, fiber.stateNode)
}
