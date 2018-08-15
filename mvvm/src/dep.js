/**
 * 发布订阅模式
 */
export default class Dep{
  constructor() {
    this.subs = []
  }
  // 订阅
  addSub(sub) {
    this.subs.push(sub)
  }
  // 通知所有订阅者更新
  notify() {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
  // 删除订阅者
  // removeSub(sub) {
  //   const index = this.subs.indexOf(sub);
  //   if(index !== -1) {
  //     this.subs.splice(index, 1)
  //   }
  // }
}