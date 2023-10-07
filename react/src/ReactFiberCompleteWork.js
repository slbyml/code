import { HostComponent } from "./ReactWorkTags";
import { appendChild, createInstance, finalizeInitialChildren, prepareUpdate } from './ReactDomHostConfig'
import { Update } from "./ReactFiberFlags";

export function completeWork (current, workInProgress) {
  const newProps = workInProgress.pendingProps
  switch (workInProgress.tag) {
  case HostComponent:
    // 有老节点，则进行更新
    if (current && workInProgress.stateNode) {
      updateHostComponent(current, workInProgress, workInProgress.tag, newProps)
    } else {
      // 原生节点，则创建真实DOM节点
      const type = workInProgress.type
      const instance = createInstance(type, newProps)
      appendAllChild(instance, workInProgress)
      workInProgress.stateNode = instance
      // 为真实DOM添加属性
      finalizeInitialChildren(instance, type, newProps)
    }
    break;

  default:
    break;
  }
}

function appendAllChild(parent, workInProgress) {
  let node = workInProgress.child
  while (node) {
    if (node.tag === HostComponent) {
      appendChild(parent, node.stateNode)
    }
    node = node.sibling
  }
}

function updateHostComponent(current, workInProgress, tag, newProps) {
  let oldProps = current.memoizedProps
  // 真实节点
  const instance = workInProgress.stateNode
  const updatePayload = prepareUpdate(instance, tag, oldProps, newProps)
  workInProgress.updateQueue = updatePayload
  if (updatePayload) {
    // 原来是0则变为100，原来是010，则变为110
    workInProgress.flags |= Update
  }
}
