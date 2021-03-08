/**
 * 反转链表
 */
import LinkList from './index'
export default class ReverseLinkList extends LinkList {
  // 迭代方式反转
  iteration(head) {
    if(!head){
      return null;
    }
    let pre_node = null; // 前一个节点
    let curr_node = head; // 当前要翻转的节点
    while(curr_node){
      let next_node = curr_node.next; // 下一个节点
      curr_node.next = pre_node; // 对当前节点进⾏行行翻转
      pre_node = curr_node; // pre_node向后滑动
      curr_node = next_node; // curr_node向后滑动
    }
    //最后要返回pre_node,当循环结束时,pre_node指向翻转前链表的最后⼀一个节点
    return pre_node;
  }
  // 递归的方式反转
  recursion(head) {
    // 如果head 为null
    if(!head){
      return null;
    }
    if(head.next==null){ 
      return head;
    }
    // 从下一个节点开始进⾏行行翻转
    let new_head = this.recursion(head.next); 
    head.next.next = head; // 把当前节点连接到新链表上 
    head.next = null;
    return new_head;
  }
}
