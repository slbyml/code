// 只能用来处理整数,且数据不能有重复的
export default class BitMap{
  // size 标识可以表示的最大数为:size*32
  constructor(size) {
    this.bit_arr = new Array(size)
    for(var i=0;i<this.bit_arr.length;i++){
      this.bit_arr[i] = 0; 
    }
  }
  addMember(member) {
    const arr_index = Math.floor(member / 32);  // 决定在数组中的索引
    const bit_index = member % 32;  // 决定在整数的32个bit位的哪⼀位
    this.bit_arr[arr_index] = this.bit_arr[arr_index] | 1<<bit_index;
  }
  isExist(member) {
    const arr_index = Math.floor(member / 32); // 决定在数组中的索引
    const bit_index = member % 32; // 决定在整数的32个bit位的哪⼀一位 上
    const value = this.bit_arr[arr_index] & 1<<bit_index; 
    if(value != 0){
      return true;
    }
    return false;

  }
}