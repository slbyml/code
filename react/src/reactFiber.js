import { HostComponent, HostRoot } from './ReactWorkTags'
import { NoFlags } from './ReactFiberFlags'

export function createHostRootFiber () {
  return createFiber(HostRoot)
}

/**
 * 创建fiber根节点
 * @param {*} tag fiber的标签
 * @param {*} pendigProps 等待生效的属性对象
 * @param {*} key
 */
function  createFiber (tag, pendigProps, key ) {
  return new FiberNode(tag, pendigProps, key )
}

function FiberNode(tag, pendigProps, key) {
  this.tag = tag
  this.pendigProps = pendigProps
  this.key = key
}

/**
 * 根据老fiber创建新fiber
 * @param {*} current
 * @param {*} pendigProps
 */
export function createWorkInProgess (current, pendigProps) {
  let workInProgress = current.alternate
  if (!workInProgress) {
    workInProgress = createFiber(current.tag, pendigProps, current.key)
    workInProgress.type = current.type
    workInProgress.stateNode = current.stateNode
    workInProgress.alternate = current
    current.alternate = workInProgress
  } else {
    workInProgress.pendigProps = pendigProps
  }
  workInProgress.flags = NoFlags
  workInProgress.child = null
  workInProgress.sibling = null
  workInProgress.updateQueue = current.updateQueue
  // 在diff过程中给fiber添加副作用
  workInProgress.firstEffect = workInProgress.lastEffect = workInProgress.nextEffect = null
  return workInProgress
}

/**
 * 根据虚拟DOM创建fiber
 * @param {*} element
 */
export function createFiberFromFragment(element) {
  const { key, type, props} = element
  let tag;
  if (typeof type === 'string') { // 说明是原生节点
    tag = HostComponent
  }
  const fiber = createFiber(tag, props, key)
  fiber.type = type
  return fiber
}
