class Node {
  constructor(data) {
    this.data = data; 
    this.next = null;
  }
}
class LinkList {
  constructor() {
    this.length = 0; // 长度
    this.head = null; // 头节点 
    this.tail = null; // 尾节点
  }
  // 添加⼀一个新元素
  append(data) {
    // 创建新节点
    var node = new Node(data); 
    if (this.head === null) { // 如果是空链表 
      this.head = node;
      this.tail = this.head; 
    } else {
      this.tail.next = node; 
      this.tail = node;
    }

    this.length += 1; 
    return true;
  }
  // 输出链表
  print() {
    let curr_node = this.head; 
    let str_link = "" 
    while(curr_node){
      str_link += curr_node.data.toString() + " ->";
      curr_node = curr_node.next; 
    }
    str_link += "null"; 

    console.log(str_link); 
    console.log("长度为"+ this.length.toString());
  }

  //在指定位置插⼊入新的元素
  insert(index, data) {
    if(index === this.length){
      return this.append(data);
    } else if (index > this.length || index < 0){
      return false;
    }
    var new_node = new Node(data); 
    if (index === 0) {
      new_node.next= this.head;
      this.head = new_node; 
    } else {
      var insert_index = 1;
      var curr_node = this.head;
      // 找到应该插⼊入的位置 
      while(insert_index < index){
        curr_node = curr_node.next;
        insert_index += 1;
      }
      var next_node = curr_node.next; 
      curr_node.next = new_node; 
      new_node.next = next_node;
    }
    this.length += 1; 
    return true;
  }
  // 移除指定位置元素
  remove(index) {
    if (index < 0 || index >= this.length) {
      return null;
    } 
    var del_node = null; 
    if (index === 0) {
      // head指向下⼀一个节点 
      del_node = this.head; 
      this.head = this.head.next;
    } else {
      var del_index = 0;
      var pre_node = null;
      var curr_node = this.head; 
      while(del_index < index){
        del_index += 1;
        pre_node = curr_node; curr_node =curr_node.next;
      }
      del_node = curr_node; 
      pre_node.next = curr_node.next; 
      // 如果删除的是尾节点 
      if (curr_node.next === null) {
        this.tail = pre_node; 
      }
    }
    this.length -= 1; 
    del_node.next = null; 
    return del_node.data;
  }
  // 删除尾节点
  remove_tail (){
    return this.remove(this.length-1); 
  }
  // 删除头节点
  remove_head (){
    return this.remove(0); 
  }
  // 获取指定位置模块
  get(index) {
    if (index < 0 || index >= this.length) { 
      return null;
    }
    var node_index = 0;
    var curr_node = this.head; 
    while(node_index < index){
      node_index += 1;
      curr_node = curr_node.next; 
    }
    return curr_node.data;
  }
  // 返回链表头节点的值 
  head (){ 
    return this.get(0);
  }
  // 返回链表尾节点的值 
  tail (){
    return this.get(this.length-1); 
  }
  // 返回指定元素的索引,如果没有,返回-1 
  // 有多个相同元素,返回第⼀一个
  indexOf(data) {
    var index = -1;
    var curr_node = this.head; 
    while(curr_node){
      index += 1 
      if(curr_node.data === data){
        return index;
      }else{
        curr_node = curr_node.next; 
      }
    }
    return -1;
  }
  // 是否为空
  isEmpty () {
    return this.length == 0;
  }
  // 清空链表
  clear() {
    this.head = null
    this.tail = null
    this.length = 0
  }
}

const list = new LinkList()
list.append(1)
list.append(2)
list.append(3)
list.print()
list.insert(2, 4)
list.print()
list.remove(1)
list.print()


export default LinkList