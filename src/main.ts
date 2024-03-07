import { createApp } from 'vue'
import App from '@/App.vue'
// 引入element-plus插件与样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入全局样式
import '@/styles/index.scss'
// 暗黑模式样式
import 'element-plus/theme-chalk/dark/css-vars.css'
// 全局配置国际化
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// svg插件需要配置代码
import 'virtual:svg-icons-register'
// 引入自定义插件对象，注册整个项目的全局组件
import globalComponent from '@/components'
// 引入路由
import router from './router'
// 引入仓库
import pinia from '@/store'
// 引入路由鉴权文件
import './permission'
// 引入自定义指令文件
import directives from './directives'

const app = createApp(App)

// 安装指令
app.use(directives)
// 安装element-plus插件
app.use(ElementPlus, {
  locale: zhCn
})
// 安装自定义插件
app.use(globalComponent)
// 注册模板路由
app.use(router)
// 安装仓库
app.use(pinia)
// 将应用挂载到容器中
app.mount('#app')
