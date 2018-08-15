import observe from "./observe"
import Compile from "./compile"

function MVVM( options = {}) {
  this.$options = options
  const data = this._data = options.data
  // 劫持数据
  observe(data)
  // 将data中的值挂在MVVM上，方便调用
  // eq：vm.xxx -> vm._data.xxx形式
  Object.keys(data).forEach(key => {
    Object.defineProperty(this, key, {      
      configurable:true,
      enumerable:true,
      set(newVal) {
        data[key] = newVal
      },
      get() {
        return data[key]
      }
    })
  })
  new Compile(options.el || document.body, this)
}


window.MVVM = MVVM