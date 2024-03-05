//  layout组件配置相关的仓库
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { SET_THEME, GET_THEME } from '@/utils/theme'

const useLayoutSettingStore = defineStore('settingStore', () => {
  //用于控制菜单折叠或者打开
  const fold = ref<boolean>(false)
  // 是否点击刷新按钮
  const refresh = ref<boolean>(false)
  // 用于设置主题颜色
  const theme = ref<string>(GET_THEME())
  // 改变主题色
  const setTheme = () => {
    SET_THEME(theme.value)
  }
  return { fold, refresh, theme, setTheme }
})

export default useLayoutSettingStore
