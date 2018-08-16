// 公用方法
export default {
  // 获取数据
  getVMVal(vm, exp) {
    // 将匹配到的{{值}}转换成数组；eq: a.b.c -> [a,b,c]
    // let arr = exp.split(".")
    // let val = vm
    // // 获取到真正的key对应的value
    // arr.forEach(key => {
    //   val = val[key]
    // })
    // return val
    return exp.split(".").reduce((val, key)=> {
      return val[key]
    },vm)

  },
  // 设置数据
  setVMVal(vm, exp, newVal) {
    const val = vm;
    exp = exp.split('.');
    exp.forEach((k, i) => {
        // 非最后一个key，更新val的值
        if (i < exp.length - 1) {
            val = val[k];
        } else {
            val[k] = newVal;
        }
    });
  }
}