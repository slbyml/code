import { createHostRootFiber } from './reactFiber'
import { initializeUpdateQueue } from './ReactUpdateQueue'
export function creatFiberRoot (containerInfo) {
  const fiberRoot = { containerInfo }
  // 创建fiber根节点
  const hostRootFiber = createHostRootFiber()

  fiberRoot.current = hostRootFiber
  hostRootFiber.stateNode = fiberRoot
  initializeUpdateQueue(hostRootFiber)
  return fiberRoot
}

