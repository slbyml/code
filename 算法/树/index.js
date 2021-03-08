import Stack from '../栈'
class BinTreeNode{
  constructor(data){
    this.data = data;
    this.leftChild = null;     // 左节点
    this.rightChild = null;    // 右节点
    this.parentNode = null;    // 父节点
  }
}

export default class BinaryTree{
  constructor() {
    this.root = null
  }
  /**
   * 采用广义表表示的建立二叉树方法
   * A(B(D,E(G,)),C(,F))#
   * 广义表的表名放在表前，表示树的根节点，括号中的是根的左右子树
   * 每个节点的左右子树用逗号隔开，如果有仅有右子树没有左子树，逗号不省略
   * 整个广义表的最后加上特殊符号#表示输入结束
   */
  init_tree(string) {
    const stack = new Stack.Stack();
    let k = 0;  // 标记是左树还是右树
    let new_node = null;
    for(var i =0; i < string.length;i++){
      var item = string[i];
      if(item=="("){
        stack.push(new_node);
        k = 1;
      }else if(item==")"){
        stack.pop();
      }else if(item==","){
        k = 2;
      }else{
        new_node = BinTreeNode(item);
        if(this.root==null){
          this.root = new_node;
        }else if(k==1){
          // 左子树
          let top_item = stack.top();
          top_item.leftChild = new_node;
          new_node.parentNode = top_item;
        }else{
          // 右子树
          let top_item = stack.top();
          top_item.rightChild = new_node;
          new_node.parentNode = top_item;
        }
      }
    }

  }
  get_root() {
    return this.root
  }

  // 中序遍历
  in_order(node=this.root){
    if(node==null){
      return;
    }
    this.in_order(node.leftChild);
    console.log(node.data);
    this.in_order(node.rightChild);
  }

  // 前序遍历
  pre_order(node = this.root){
    if(node==null){
      return;
    }
    console.log(node.data);
    this.pre_order(node.leftChild);
    this.pre_order(node.rightChild);
  }

  // 后序遍历
  post_order(node = this.root){
    if(node==null){
      return;
    }
    this.post_order(node.leftChild);
    this.post_order(node.rightChild);
    console.log(node.data);
  }

  // 返回节点数量
  size(root = this.root){

    var tree_node_count = function(node){
    // 左子树的节点数量加上右子树的节点数量 再加上1
      if(!node){
        return 0;
      }
      var left_node_count = tree_node_count(node.leftChild);
      var right_node_count = tree_node_count(node.rightChild);
      return left_node_count + right_node_count + 1;
    };
    return tree_node_count(root);
  }

  // 返回高度
  height(root = this.root){  
    var tree_height = function(node){
      // 左子树的高度和右子树的高度取最大值,加上当前的高度
      if(!node){
        return 0;
      }

      var left_child_height = tree_height(node.leftChild);
      var right_child_height = tree_height(node.rightChild);
      if(left_child_height > right_child_height){
        return left_child_height + 1;
      }else{
        return right_child_height + 1;
      }

    };
    return tree_height(root);
  }

  // 查找data
  find(data, root = this.root){
    var find_node = function(node, data){
      if(!node){
        return null;
      }
      if(node.data == data){
        return node;
      }

      const left_res = find_node(node.leftChild, data);
      if(left_res){
        return left_res;
      }

      return find_node(node.rightChild, data);
    };
    return find_node(root, data);
  }

}