// 本地持久化存储主题色设置
export const SET_THEME = (color: string) => {
  const html = document.documentElement
  html.style.setProperty('--el-color-primary', color)
  localStorage.setItem('theme', color)
}
// 获取主题色配置
export const GET_THEME = () => localStorage.getItem('theme')

// 清除主题色配置
export const CLEAR_THEME = () => {
  localStorage.removeItem('theme')
}
