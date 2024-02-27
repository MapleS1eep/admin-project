import axios from 'axios'
import { ElMessage } from 'element-plus'
// 引入用户相关的仓库
import useUserStore from '@/store/modules/user'

// 创建axios实例
// 基础路径会带上/api
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000 // 超时时间
})

// 请求拦截器
request.interceptors.request.use((config) => {
  //获取仓库存储的用户token，登录成功以后发送请求时携带
  const { token } = useUserStore()
  if (token) {
    config.headers.token = token
  }
  return config
})

// 响应拦截器
request.interceptors.response.use(
  // 成功的回调
  (response) => {
    // 简化返回的对象
    return response.data
  },
  // 失败的回调: 处理http网络错误
  (error) => {
    //定义变量存储网络错误的信息
    let message = ''
    const status = error.response?.status
    switch (status) {
      case 401:
        message = 'token已过期'
        break
      case 403:
        message = '权限不足无法访问'
        break
      case 404:
        message = '请求地址错误'
        break
      case 500:
        message = '服务器异常'
        break
      default:
        message = '网络异常'
    }
    // 弹出错误的提示信息
    ElMessage({
      type: 'error',
      message
    })
    return Promise.reject(error)
  }
)

// 对外暴露
export default request
