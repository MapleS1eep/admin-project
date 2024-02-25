// 封装本地持久化存储与读取数据的方法
export const SET_TOKEN = (token: string) => {
  localStorage.setItem('TOKEN', token)
}
export const GET_TOKEN = () => localStorage.getItem('TOKEN')
// 删除本地存储数据的方法
export const REMOVE_TOKEN = () => localStorage.removeItem('TOKEN')
