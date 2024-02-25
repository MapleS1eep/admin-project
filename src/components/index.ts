// 引入全部的自定义组件
import SvgIcon from '@/components/SvgIcon/index.vue'
import Pagination from '@/components/Pagination/index.vue'
// 引入element-plus的所有图标组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const allGlobalComponents = { SvgIcon, Pagination }

// 对外暴露插件对象
export default {
  // app.use会自动触发install方法
  install(app: { component: (arg0: string, arg1: any) => void }) {
    // 注册全部的全局组件
    Object.keys(allGlobalComponents).forEach((key) => {
      app.component(key, (allGlobalComponents as any)[key])
    })
    // 注册所有图标组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  }
}
