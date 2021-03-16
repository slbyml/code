// Map结构能够记住键的原始插入顺序
var LRUCache = function(capacity) {
  this.cache = new Map()
  this.capacity = capacity
}

LRUCache.prototype.get = function(key) {
  if (this.cache.has(key)) {
    // 存在即更新
    let temp = this.cache.get(key)
    this.cache.delete(key)
    this.cache.set(key, temp)
    return temp
  }
  return -1
}

LRUCache.prototype.put = function(key, value) {
  if (this.cache.has(key)) {
    // 存在即更新（删除后加入）
    this.cache.delete(key)
  } else if (this.cache.size >= this.capacity) {
    // 不存在即加入
    // 缓存超过最大值，则移除最近没有使用的
    console.log(this.cache.keys()[0]);
    this.cache.delete(this.cache.keys().next().value)
  }
  this.cache.set(key, value)
}

//方法2就是使用类似于vue的方式,通过用数组保存key值,以保证顺序,用对象保存具体的value来实现,以此保证算法复杂度度为O(1)
