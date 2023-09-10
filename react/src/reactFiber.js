import { HostRoot } from './ReactWorkTags'

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
