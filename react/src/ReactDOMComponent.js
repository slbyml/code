export function createElement(type) {
  return document.createElement(type)
}

// 初始化属性
export function setInitialProperties(domElement, type, props) {
  for (const propKey in props) {
    const nextProps = props[propKey]
    if (propKey === 'children') {
      if (typeof nextProps === 'string' || typeof nextProps === 'number') {
        domElement.textContent = nextProps
      }
    } else if(propKey === 'style') {
      for (const stylePropKey in nextProps) {
        domElement.style[stylePropKey] = nextProps[stylePropKey]
      }
    } else {
      domElement[propKey] = nextProps
    }
  }
}

// 获取要更新的属性
export function diffProperties( domElement, tag, lastProps = {}, nextProps = {} ) {
  let updatePayload = null
  for (const propKey in lastProps) {
    if (Object.hasOwnProperty(lastProps, propKey) && !Object.hasOwnProperty(nextProps, propKey)) {
      // [更新key1, 更新的值1， 更新key2, 更新的值2]
      (updatePayload = updatePayload || []).push(propKey, null)
    }
  }
  for (const propKey in nextProps) {
    const nextProp = nextProps[propKey]
    if (propKey === 'children') {
      if (typeof nextProp === 'string' || typeof nextProp === 'number') {
        if (nextProp !== lastProps[propKey]) {
          (updatePayload = updatePayload || []).push(propKey, nextProp)
        }
      }
    } else {
      if (nextProp !== lastProps[propKey]) {
        (updatePayload = updatePayload || []).push(propKey, nextProp)
      }
    }
  }
  return updatePayload
}

// 更新属性
export function  updateProperties(domElement, updatePayload) {
  for (let i = 0; i < updatePayload.length; i+=2) {
    const propKey = updatePayload[i]
    const propValue = updatePayload[i+1]
    if (propKey === 'children') {
      domElement.textContent = propValue
    } else {
      domElement.setAttribute(propKey, propValue)
    }

  }
}
