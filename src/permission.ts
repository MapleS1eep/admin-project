// 路由鉴权：控制项目中各个路由的访问权限
import router from '@/router'
import setting from './setting'
// 引入nprogress进度条插件
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
nprogress.configure({ showSpinner: false })
// 获取用户相关的小仓库
import useUserStore from './store/modules/user'
import pinia from './store'
const userStore = useUserStore(pinia)
// 全局守卫：项目中任意路由切换都会触发的钩子
// 全局前置守卫
router.beforeEach(async (to: any, _from: any, next: any) => {
  // 标签页名字
  document.title = `${setting.title} - ${to.meta.title}`
  // to: 将要访问的路由
  // from: 从哪个路由跳转来的
  // next: 路由的放行函数
  nprogress.start()
  // 获取token,判断用户是否已登录
  const token = userStore.token
  // 获取用户名字
  const username = userStore.username
  // 已登录
  if (token) {
    // 登录成功后不能访问/login，访问时直接跳转到首页
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      // 访问其他组件时，必须有用户信息才能放行
      if (username) {
        next()
      } else {
        // 没有用户信息，先发送请求获取到用户信息之后再放行
        try {
          await userStore.userInfo()
          // 访问异步路由时，已获取到用户信息，但路由还没加载完，next()会直接放行从而匹配不到
          // 解决: ...to
          next({ ...to })
        } catch (error) {
          // token过期获取不到用户信息或者用户手动修改了本地token
          // 退出登录：清空用户相关数据
          await userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    // 未登录
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})
// 全局后置守卫
router.afterEach((_to: any, _from: any) => {
  nprogress.done()
})

// 问题1：任意路由切换实现进度条业务 =>nprogress插件
// 问题2：路由鉴权（路由组件权限的设置）
// 全部路由组件：登录|404|任意路由|首页|数据大屏|权限管理（3个子路由）|商品管理（4个子路由）

// 用户未登录：可以访问login，其余禁止访问（指向login）
//用户登录成功：不可以访问login（指向首页），其余的可以访问
