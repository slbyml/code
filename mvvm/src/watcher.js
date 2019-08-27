import Dep from './dep'
import util from './util'
/**
 * watch方法
 * 链接模板和数据
 * 所有模板里面的相应数据都会通过发布订阅模式和data中的数据进行关联，当data里面的数据有变化是才能通知模板里的数据更新
 * @param {*} vm 当前实例
 * @param {*} exp 通过正则在dom中匹配到的key
 * @param {*} cb 数据更改后的回调函数，回调函数是用来更新dom
 */
export default class watcher {
  constructor (vm, exp, cb) {
    this.vm = vm
    this.exp = exp
    this.cb = cb
    Dep.target = this // 1、防止dom中同一位置的数据多次订阅，2、方便订阅是拿到此watcher
    this.getVal()
    Dep.target = null
  }

  update () {
    const val = this.getVal()
    this.cb(val) // 当有数据更新是，通知模板编译（compile.js）那边更新页面
  }

  // 获取key对应的val,此时会触发getter,会将当前的dom对应的watcher放在对应的key所在的发布订阅模式中
  getVal () {
    return util.getVMVal(this.vm, this.exp)
  }
}
