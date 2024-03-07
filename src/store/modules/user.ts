import { ref } from 'vue'
// 用户数据有关的小仓库
import { defineStore } from 'pinia'
// 引入用户相关数据类型
import type {
  loginFormData,
  loginResponseData,
  userResponseData
} from '@/api/user/type'
// 引入接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
// 引入token方法
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
// 引入路由(常量路由)
import { constantRoutes, asyncRoutes, anyRoutes } from '@/router/routes'
import router from '@/router'
import cloneDeep from 'lodash/cloneDeep'

// 用于过滤当前用户有权限展示的异步路由
const filterAsyncRoutes = (allAsyncRoutes: any, routes: any) => {
  return allAsyncRoutes.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoutes(item.children, routes)
      }
      return true
    }
  })
}
// 创建用户小仓库
const useUserStore = defineStore('User', () => {
  const menuRoutes = ref(constantRoutes) //存储生成菜单需要的数组
  const token = ref<string>(GET_TOKEN()) //用户唯一标识token
  const username = ref<string>('')
  const avatar = ref<string>('')
  const buttons = ref<string[]>([]) // 存储当前用户按钮权限标识
  // 用户登录的方法
  const userLogin = async (data: loginFormData) => {
    const result: loginResponseData = await reqLogin(data)
    // 成功：200，保存token
    // 失败：201，弹出失败信息
    if (result.code === 200) {
      token.value = result.data
      // 本地化持久存储
      SET_TOKEN(result.data)
      // 保证当前async函数返回一个成功的promise
      return 'ok'
    } else {
      return Promise.reject(new Error(result.data))
    }
  }
  // 获取用户信息
  const userInfo = async () => {
    // 获取用户信息并存储到仓库中
    const result: userResponseData = await reqUserInfo()
    //  如果获取用户信息成功，就存储用户信息
    if (result.code == 200) {
      username.value = result.data.name
      avatar.value = result.data.avatar
      buttons.value = result.data.buttons
      // 计算当前用户需要展示的异步路由
      const userAsyncRoutes = filterAsyncRoutes(
        cloneDeep(asyncRoutes),
        result.data.routes
      )
      menuRoutes.value = [...constantRoutes, ...userAsyncRoutes, ...anyRoutes]
      // 将异步路由和任意路由动态追加到路由器对象
      userAsyncRoutes.concat(anyRoutes).forEach((route: any) => {
        router.addRoute(route)
      })

      return 'ok'
    } else {
      return Promise.reject(new Error(result.message))
    }
  }
  // 退出登录
  const userLogout = async () => {
    const result: any = await reqLogout()
    if (result.code == 200) {
      token.value = ''
      REMOVE_TOKEN()
      username.value = ''
      avatar.value = ''
      return 'ok'
    } else {
      return Promise.reject(new Error(result.message))
    }
  }

  return {
    menuRoutes,
    token,
    username,
    avatar,
    buttons,
    userLogin,
    userInfo,
    userLogout
  }
})

export default useUserStore
