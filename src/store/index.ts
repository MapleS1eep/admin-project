// 大仓库
import { createPinia } from 'pinia'

// 创建大仓库
const pinia = createPinia()
// 解决setup组合式api定义的store不能使用$reset方法的问题
pinia.use(({ store }) => {
  const initialState = JSON.parse(JSON.stringify(store.$state))
  store.$reset = () => {
    store.$state = JSON.parse(JSON.stringify(initialState))
  }
})

export default pinia
