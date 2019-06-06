//new操作符具体干了什么呢?其实很简单，就干了三件事情。

// 1，我们创建了一个空对象obj
// 2，我们将这个空对象的__proto__成员指向了Base函数对象prototype成员对象
// 3，我们将Base函数对象的this指针替换成obj，然后再调用Base函数，于是我们就给obj对象赋值了一个id成员变量，这个成员变量的值是”base”
// 4，如果有返回且返回为对象，则返回，如果没有，则默认返回原对象

function New(fun) {
  var obj  = {}; 
  if (func.prototype !== null) {
    obj.__proto__ = Base.prototype; 
  }
  var ret = Base.call(obj);  
  if((typeof ret === "object" || typeof ret === "function") && ret !== null){
    return ret
  }else {
    return obj
  }
}

// instanceof的实现
function _instanceof(left, right) {
  // 获得类型的原型
  let prototype = right.prototype
  // 获得对象的原型
  left = left.__proto__
  // 判断对象的类型是否等于类型的原型
  while (true) {
    if (left === null)
      return false
    if (prototype === left)
      return true
    left = left.__proto__
  }
}