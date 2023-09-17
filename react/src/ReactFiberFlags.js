/**
 * fiber副作用标识，代表其对应的节点需要进行什么样子的操作
 */
export const NoFlags =  0b0000000000000000000000000000; // 什么也不做
export const Placement = 0b0000000000000000000000000010; // 添加｜创建
export const Update = 0b0000000000000000000000000100; // 更新
export const PlacemetAndUpdate = 0b0000000000000000000000000110 // 移动
export const Deletion = 0b0000000000000000000000001000 // 删除
