// 统一管理项目中用户相关的接口
import request from '@/utils/request'
// 引入数据类型
import type { loginFormData, loginResponseData, userResponseData } from './type'
// 统一管理接口
enum API {
  LOGIN_URL = '/admin/acl/index/login',
  USERINFO_URL = '/admin/acl/index/info',
  LOGOUT_URL = '/admin/acl/index/logout'
}
// 暴露请求函数
// 登录接口
export const reqLogin = (data: loginFormData) =>
  request.post<any, loginResponseData>(API.LOGIN_URL, data)
// 获取用户信息接口
export const reqUserInfo = () =>
  request.get<any, userResponseData>(API.USERINFO_URL)
// 退出登录接口
export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL)
