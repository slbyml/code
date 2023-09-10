import { creatFiberRoot } from './creatFiberRoot'
import { updateContainer } from './ReactFiberReconciler'

function render(element, container, callback) {
  // 创建
  let fiberRoot = creatFiberRoot(container)
  // 更新
  updateContainer(element, fiberRoot)

  console.log(fiberRoot);
}

const ReactDOM = {
  render
}
export default ReactDOM
