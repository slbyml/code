import { createElement, setInitialProperties, diffProperties } from './ReactDOMComponent'

// 如果子节点只有一个字符串或者数字，则将其设置为文本内容，不需要创建fiber节点
export function shouldSetTextContent(type, pendingProps) {
  return typeof pendingProps.children === 'string' || typeof pendingProps.children === 'number'
}

export function createInstance(type) {
  return createElement(type)
}

export function finalizeInitialChildren(domElement, type, props) {
  setInitialProperties(domElement, type, props)
}

export function appendChild(parentInstance, child) {
  parentInstance.appendChild(child)
}

export function removeChild(parentInstance, child) {
  parentInstance.removeChild(child)
}

export function prepareUpdate(domElement, tag, oldProps, newProps) {
  return diffProperties(
    domElement,
    tag,
    oldProps,
    newProps
  )
}
