import { createUpdate, enqueueUpdate } from "./ReactUpdateQueue"
import { scheduleUpdateOnFiber } from './ReactFiberWorkLoop'

/**
 * 将虚拟DOM渲染到cotainer内
 * @param {*} element
 * @param {*} container
 */
export function updateContainer(element, container) {
  const current = container.current
  const update = createUpdate()
  update.payload = { element };
  enqueueUpdate(current, update)
  scheduleUpdateOnFiber(current)

}
