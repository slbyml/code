/**
 * 逆波兰表达式, 也做后缀表达式
 * ["4", "13", "5", "/", "+"] 等价于(4 + (13 / 5)) = 6
 */
import Stack from './index.js'

function calc_exp(exp){
  var stack = new Stack();
  for(var i = 0; i < exp.length;i++){
    var item = exp[i];
    if(["+", "-", "*", "/"].indexOf(item) >= 0){ // 从栈顶弹出两个元素
      var value_1 = stack.pop();
      var value_2 = stack.pop();
      // 拼成表达式
      var exp_str = value_2 + item + value_1; // 计算并取整
      var res = parseInt(eval(exp_str));
      // 将计算结果压如栈 
      stack.push(res.toString());
    }else{ stack.push(item);
    } }
  // 表达式如果是正确的,最终,栈⾥里里还有⼀一个元素,且正是表达式的计算结果
  return stack.pop(); 
}
var exp_1 = ["4", "13", "5", "/", "+"];
console.log(calc_exp(exp_1));