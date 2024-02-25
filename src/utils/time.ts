// 封装一个方法用来判断当前时间段
export const getTime = () => {
  let message: string = ''
  const hours = new Date().getHours()
  if (hours < 9) {
    message = '早上'
  } else if (hours <= 12) {
    message = '上午'
  } else if (hours <= 18) {
    message = '下午'
  } else {
    message = '晚上'
  }
  return message
}
