import Watcher from "./watcher"
/**
 * 获取dom，并放在文档碎片中
 * 编译并解析文档碎片中模板文件，
 * 回填入真是dom中 
 * @param {*} el 需要绑定的 根dom
 * @param {*} vm MVVM实例
 */
export default class Complite{
  constructor(el, vm) {
    // 根节点挂在实例中，方便外部调用； eq:Vue.$el形式
    vm.$el = this.isElementNode(el) ? el : document.querySelector(el)  
    this.$vm = vm
    if (vm.$el) {
      this.$el = vm.$el
      this.$fragment = document.createDocumentFragment()
      let child;
      // 依次将原生节点拷贝到文档碎片中
      while (child = vm.$el.firstChild) {
        this.$fragment.appendChild(child)
      }
      this.compileElement()
      vm.$el.appendChild(this.$fragment)
    }
  }
  // 判断是否是元素节点
  isElementNode(node) {
    return node.nodeType === 1
  }
  // 判断是否是文本节点
  isTextNode(node) {
    return node.nodeType === 3
  }
  // 编译模板
  compileElement(el = this.$fragment) {
    const reg=/\{\{(.*?)\}\}/g
    Array.from(el.childNodes).forEach(node => {
      const text= node.textContent
      if (this.isTextNode(node) && reg.test(text)) {  // 文本节点
        this.compileText(node, text, reg)
      } else if (this.isElementNode(node)) {   // 元素节点

      }
      if (node.childNodes && node.childNodes.length) {
        this.compileElement(node)
      }
    })
  }
  // 替换文本节点
  compileText(node, text, reg) {
    // 将匹配到的{{值}}转换成数组；eq: a.b.c -> [a,b,c]
    let arr = RegExp.$1.split(".")
    let val = this.$vm
    // 获取到真正的key对应的value
    arr.forEach(key => {
      val = val[key]
    })
    new Watcher(this.$vm, RegExp.$1, (newVal) => {
      node.textContent = text.replace(reg, newVal)
    })
    node.textContent = text.replace(reg, val)
  }
}