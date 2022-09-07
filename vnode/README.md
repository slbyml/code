当有数据被改动时会触发`observe`中数据的`setter`，此时会调用`dep.notify`方法给所有订阅的`watcher`发通知进行视图更新，此时会进行diff流程
## vue中vdom-diff解析
> vdom源码分析，删除大部分影响分析diff的代码，并为主要代码书写注释，方便查看

### diff总结
* 先判断根结点及变化后的节点是否是`sameVnode`，如果不是的化，就会创建新的根结点并进行替换
* 如果不是`sameVnode`，则进入`patchVnode`函数，其基本判断  
  1. 如果两个节点是相等`oldVnode === vnode`则直接`return`
  2. 如果`新节点是文本节点`，则判断新旧文本节点是否一致，不一致(`oldVnode.text !== vnode.text`)则替换
  3. 如果`新节点不是文本节点`，则开始比较新旧节点的子节点`oldCh`和`ch`：
  4. 如果`子节点都存在`，则进行`updateChildren`计算（稍后讲）
  5. 如果`只有新子节点存在`,则如果旧节点有文本节点，则移除文本节点，然后将新子节点拆入
  6. 如果`只有旧子节点存在`，则移除所有子节点
  7. 如果`均无子节点且旧节点是文本节点`，则移除文本节点（此时新节点一定不是文本节点）
* `updateChildren`函数做细致对比
  1. start && oldStart对比
  2. end && oldEnd对比
  3. start && oldEnd对比
  4. end && oldStart  对比
  5. 生成map映射，（key:旧子节点上的key，value:旧子节点在自己点中的位置）,根据key记录下老节点在新节点的位置（`idxInOld`）
      1) 如果`找到了idxInOld`,如果是`相同节点`则移动旧节点到新的对应的地方，否则虽然`key`相同但元素不同，当作新元素节点去创建
      2) 如果`没有找到idxInOld`，则创建节点         

  对应代码：
  ```
    // 检测重复的key
    // 创建vnode的key；eq：{key: 0, key: 1, key: 2}}
    if (isUndef(oldKeyToIdx))  oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
    // 如果newStartVnode(新的VNode节点)存在key并且这个key在oldVnode中能找到，则idxInOld等于oldKeyToIdx中对应key的索引
    // 否则寻找旧节点数组中与当前newStartVnode(新的VNode节点)相同的节点索引赋予idxInOld
    idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
    if (isUndef(idxInOld)) {
      // 如果没有找到这个key,则创建这个节点
      createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm)
    } else {
      // 在旧节点数组中找到了相应的节点的索引时，则移动节点
      // 将vnodeToMove赋值为相应的节点
      vnodeToMove = oldCh[idxInOld]
      if (sameVnode(vnodeToMove, newStartVnode)) {
        // 如果相同，则继续对比子级
        patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue)
          // 将旧节点数组中的该节点设置为undefined
        oldCh[idxInOld] = undefined
        // 移动找到的节点到当前旧首节点之前
        nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
      } else {
        // 如不同，则说明虽然key相同，但是不同元素，当作新元素处理
        createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
      }
  ```
  6. 如果`老节点先遍历完`，则新节点比老节点多,将新节点多余的插入进去
  7. 如果`新节点先遍历完`，则就节点比新节点多,将旧节点多余的删除  

  代码：
  ```
    // 新旧节点开始索引任一方大于其结束索引时结束循环
    if (oldStartIdx > oldEndIdx) {
      /*如果oldStartIdx > oldEndIdx的话，说明老节点已经遍历完了，新节点比老节点多，所以这时候多出来的新节点需要一个一个创建出来加入到真实Dom中*/
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
    } else if (newStartIdx > newEndIdx) {
      /*如果newStartIdx > newEndIdx，说明新节点已经遍历完了，老节点多余新节点，则在父级中移除未处理的剩余旧节点，范围是oldStartIdx~oldEndIdx*/
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
    }
  ```
