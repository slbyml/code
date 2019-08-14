class promise{
  constructor(executor) {
    this.status = "pending"  // 当前的状态
    this.value = undefined    // 成功时传给下一步的值
    this.reason = undefined    // 失败时传给下一步的错误信息
    // 存放then中所有失败&成功的回调数组
    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []
    /**
     * 成功的回调
     * @param {*} value  成功后传给下一步的值 
     */
    const resolve = value => {     
      if(this.status === "pending"){    // 只能从pending态改为成功态
        this.status = "resolved"
        this.value = value
        this.onResolvedCallbacks.forEach(fn => fn())
      }
    }
    /**
     * 失败的回调
     * @param {*} reason  失败时传给下一步的错误信息 
     */
    const reject = reason => {
      this.status = "rejected"      // 只能充pending态改为失败态
      this.reason = reason
      this.onRejectedCallbacks.forEach(fn => fn())
    }

    try {
      executor(resolve, reject)  // 先执行executor方法，并将成功&失败的回调方法传入
    } catch (error) {
      reject(error)
    }
  }
  then(onFulfilled, onRejected) {
    let promise2;
    if (this.status === "resolved") {
      onFulfilled(this.value)
    }
    if (this.status === "rejected") {
      onRejected(this.reason)
    }
    if (this.status === "pending") {   // 异步调用，暂存回调
      this.onResolvedCallbacks.push(() => {
        onFulfilled(this.value)
      })
      this.onRejectedCallbacks.push(() => {
        onRejected(this.reason)
      })
    }
    return promise2
  }
}


//  testinggggggggggggggg
const test = new promise(() => {
  console.log('start');
  throw new Error("错误错误错误错误")
  // setTimeout(() => {
  //   resolve('123')
  // },2000)
})
test.then((value) => {
  console.log('123');
  console.log('123', value);  
},reason => {
  console.log(reason);
})
// test.then((value) => {
//   console.log('123');
//   console.log('123', value);  
// })

// export default promise
