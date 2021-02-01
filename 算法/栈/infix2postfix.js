/**
 * 将中续转为后续
 * 输⼊:["12","+", "3"] 
 * 输出:["12","3","+"]
 */
import Stack from './index.js'

// 定义运算符的优先级
var priority_map = { "+": 1, "-": 1, "*": 2, "/": 2};
function infix2postfix(exp){
  var stack = new Stack();
  var postfix_lst = [];
  for(var i = 0;i<exp.length;i++){
    var item = exp[i];
    // 如果是数字,直接放⼊入到postfix_lst中
    if(!isNaN(item)){
      postfix_lst.push(item);
    }else if (item == "("){
    // 遇到左括号⼊入栈
      stack.push(item);
    } else if (item == ")"){
      // 遇到右括号,把栈顶元素弹出,直到遇到左括号
      while(stack.top() != "("){
        postfix_lst.push(stack.pop());
      }
      stack.pop(); // 左括号出栈
    }else{
      // 遇到运算符,把栈顶的运算符弹出,直到栈顶的运算符优先级⼩小于当前运算符
      while(!stack.isEmpty() && ["+", "-", "*", "/"].indexOf(stack.top()) >= 0 && priority_map[stack.top()] >= priority_map[item]){
        // 把弹出的运算符加⼊入到postfix_lst
        postfix_lst.push(stack.pop());
      }
      // 当前的运算符⼊入栈
      stack.push(item);
    }
  }
  // for循环结束后, 栈⾥里里可能还有元素,都弹出放⼊入到postfix_lst中
  while(!stack.isEmpty()) {
    postfix_lst.push(stack.pop())
  }
  return postfix_lst
}

var exp = ["(","1","+","(","4","+","5","+","3",")","-","3",")","+","(","9","+","8" ,")"];
console.log(infix2postfix(exp))
