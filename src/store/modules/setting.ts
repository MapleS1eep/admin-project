//  layout组件配置相关的仓库
import { defineStore } from 'pinia'
import { ref } from 'vue'

const useLayoutSettingStore = defineStore('settingStore', () => {
  const fold = ref(false) //用于控制菜单折叠或者打开
  const refresh = ref(false) // 是否点击刷新按钮
  return { fold, refresh }
})

export default useLayoutSettingStore
