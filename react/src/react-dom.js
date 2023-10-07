import { creatFiberRoot } from './creatFiberRoot'
import { updateContainer } from './ReactFiberReconciler'

function render(element, container) {
  let fiberRoot = container._reactRootContainer
  if (!fiberRoot) {
    // 创建
    fiberRoot = container._reactRootContainer = creatFiberRoot(container)
  }
  // 更新
  updateContainer(element, fiberRoot)

  console.log(fiberRoot);
}

const ReactDOM = {
  render
}
export default ReactDOM
