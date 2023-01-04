// 实现一个能够 随机选取内容的模块
// 当前模块下有两个方法, 一个是 randomInt 和 randomPick
// randomInt 返回一定范围内的整数, 用于控制随机生成的文章和段落的长度范围

export const randomInt = (min, max) => {
  const p = Math.random();
  return Math.floor(min * (1 - p) + max * p);
};

/**
 * 主要通过闭包返回一个函数来进行随机, 同时防止原有数组发生变化
 * @param {*} arr 原始数组
 * @returns 新的函数
 */
export const createRandomPicker = (arr) => {
  arr = [...arr];
  const randomPick = () => {
    const len = arr.length - 1;
    const index = randomInt(0, len);
    [arr[index], arr[len]] = [arr[len], arr[index]];
    return arr[index];
  };
  // 抛弃第一次选择的结果, 避开第一次选择时永远选择不到最后一个元素的问题
  randomPick();
  return randomPick;
}
