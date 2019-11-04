/* eslint-disable */
// 更改this指向模拟实现

// call的模拟
Function.prototype.call2 = (content = window) => {
  content.fn = this
  const args = [...arguments].slice(1)
  const result = content.fn(...args)
  delete content.fn
  return result
}

// apply的模拟
Function.prototype.apply2 = (content = window) => {
  content.fn = this
  const result = content.fn(...[...arguments].slice(1))
  delete content.fn
  return result 
}

// bind的模拟 实现机制就是一个柯里化函数
Function.prototype.bind2 = () => {
  if(typeof this != "function") {
    throw Error("not a function")
  }
  const _self=this
  const args=Array.from(arguments)
  const ctx=args.shift()
  return function(){
    return _self.apply(ctx,args.concat(Array.from(arguments)))
  }
}

Function.prototype.bind22 = function(ctx, ...arg1) {
  let res =  (...arg2) => this.call(ctx, ...arg1, ...arg2)
  let fn = function() {}
  if (this.prototype) {
    fn.prototype = this.prototype
  }
  res.prototype= new fn()
  return res
}