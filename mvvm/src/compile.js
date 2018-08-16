import Watcher from "./watcher"
import util from "./util"
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
  // 编译模板
  compileElement(el = this.$fragment) {
    const reg=/\{\{(.*?)\}\}/g
    Array.from(el.childNodes).forEach(node => {
      const text= node.textContent
      if (this.isTextNode(node) && reg.test(text)) {  // 文本节点，可能有·v-·这种指令     
        this.compileText(this.$vm, node, text, reg)
      } else if (this.isElementNode(node)) {   // 元素节点
        this.compileNode(node)
      }
      if (node.childNodes && node.childNodes.length) {
        this.compileElement(node)
      }
    })
  }
  // 指令
  compileNode(node) {
    const nodeAttrs = node.attributes
    Array.from(nodeAttrs).forEach(attr => {
      const attrName = attr.name;   // 获取属性名
      if(this.isDirective(attrName)){
        const exp = attr.value    // 获取属性的value
        const directiveType = attrName.substring(2)   // 获取指令的类型
        if (this.isEventDirective(directiveType)) {   // v-on事件指令
          directiveUtil.eventHandler(node, this.$vm, exp, directiveType)
        } else {
          directiveUtil[directiveType] &&  directiveUtil[directiveType](node, this.$vm, exp)
        }
        node.removeAttribute(attrName);
      }      
    })    
  }
  // 替换文本节点
  compileText(vm, node, text, reg) {
    // const val = util.getVMVal(this.$vm, RegExp.$1)
    // new Watcher(this.$vm, RegExp.$1, newVal => {
    //   updater.text(node, text, reg, newVal)
    // })
    // updater.text(node, text, reg, val)
    !function replaceTxt() {
      node.textContent = text.replace(reg, (matched, placeholder) => {
        // console.log(matched, placeholder);
        new Watcher(vm, placeholder, replaceTxt)
        return util.getVMVal(vm, placeholder)
      })
    }();
    
  }
  // 判断是否是元素节点
  isElementNode(node) {
    return node.nodeType === 1
  }
  // 判断是否是文本节点
  isTextNode(node) {
    return node.nodeType === 3
  }
  // 判断是否时指令
  isDirective(attr) {
    return attr.startsWith('v-')
  }
  // 判断指令是否时事件
  isEventDirective(dir) {
    return dir.startsWith('on')    
  }
}

// 指令处理
const directiveUtil = {
  /**
   * v-model双向绑定
   * @param {*} exp // input中v-model对应的值
   */
  model(node, vm, exp) {     // v-model
    const val = util.getVMVal(vm, exp)
    new Watcher(vm, exp, newVal => {
      updater.model(node, newVal)
    })
    updater.model(node, val)
    node.addEventListener("input", e=> {
      const newVal = e.target.value
      if(newVal === val) return false;
      util.setVMVal(vm, exp, newVal)
    })
  },
  /**
   * 事件指令
   * @param {*} node 
   * @param {*} vm 
   * @param {*} exp // 方法名
   * @param {*} directiveType // 指令名称
   */
  eventHandler(node, vm, exp, directiveType) {
    const eventType = directiveType.split(":")[1]     // 具体事件
    const fn = vm.$options.methods && vm.$options.methods[exp]
    if(eventType && fn){
      node.addEventListener(eventType, fn.bind(vm), false)
    }
  }
}


// 数据更新
const updater = {
  // 文本替换
  // text(node, text, reg, newVal) {
  //   node.textContent = text.replace(reg, newVal)
  // },
  // v-model
  model(node, newVal) {
    node.value = typeof newVal == 'undefined' ? '' : newVal;
  }
}