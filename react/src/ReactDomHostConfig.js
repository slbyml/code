// 如果子节点只有一个字符串或者数字，则将其设置为文本内容，不需要创建fiber节点
export function shouldSetTextContent(type, pendingProps) {
  return typeof pendingProps.children === 'string' || typeof pendingProps.children === 'number'
}
