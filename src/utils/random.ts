// 生成随机数和颜色的方法

// 获取随机颜色的两种方法
// const randomColor = () => {
//   const r = Math.floor(Math.random() * 256)
//   const g = Math.floor(Math.random() * 256)
//   const b = Math.floor(Math.random() * 256)
//   return `rgb(${r},${g},${b})`
// }
export const randomColor = (): string => {
  const random = Math.random()
  if (random === 0) {
    return randomColor()
  }
  return '#' + random.toString(16).substring(2, 8)
}

// 一个包含7个在0~100之间数字的数组的方法
export const randomArr = (): Array<number> => {
  const arr = []
  for (let i = 0; i < 10; i++) {
    const number = Math.floor(Math.random() * 101)
    arr.push(number)
  }
  return arr
}
