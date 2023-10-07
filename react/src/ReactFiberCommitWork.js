import { appendChild, removeChild } from './ReactDomHostConfig';
import { HostComponent, HostRoot } from './ReactWorkTags'
import { updateProperties } from './ReactDOMComponent'

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
  appendChild(parentStateNode, stateNode)
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
