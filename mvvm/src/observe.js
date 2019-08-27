import Dep from './dep'
/**
 * 劫持数据
 * @param {*} data
 */

function Observe (data) {
  Object.keys(data).forEach(key => {
    const dep = new Dep()
    let val = data[key]
    // 为key对应的值递归绑定
    observe(val)
    // 为所有key绑定setter和getter
    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,
      set (newVal) {
        if (val === newVal) return
        // 因为赋的值可能是对象或数组
        observe(newVal)
        val = newVal
        // 设置新的值就要通知所有订阅者
        dep.notify()
      },
      get () {
        // watcher过来的才会订阅，也就是只有data中的值在dom中应用过才会订阅
        Dep.target && dep.addSub(Dep.target)
        return val
      }
    })
  })
}

// 方便递归调用
export default function observe (data) {
  if (!data || typeof data !== 'object') return // 防止递归溢出
  return new Observe(data)
}
