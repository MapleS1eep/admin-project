// 用户管理模块的接口
import request from '@/utils/request'
import {
  AllUsersResponseData,
  User,
  AllRolesResponseData,
  SetRoleData
} from './type'

enum API {
  // 获取全部已有用户的账号信息
  ALL_USER_URL = '/admin/acl/user/',
  // 新增用户
  ADD_USER_URL = '/admin/acl/user/save',
  // 修改用户
  UPDATE_USER_URL = '/admin/acl/user/update',
  // 获取全部角色数据以及当前用户拥有的角色
  ALL_ROLE_URL = '/admin/acl/user/toAssign/',
  // 给已有用户分配角色
  SET_ROLE_URL = '/admin/acl/user/doAssignRole',
  // 删除某一个用户
  DELETE_USER_URL = '/admin/acl/user/remove/',
  // 批量删除用户
  BATCH_DELETE_USER_URL = '/admin/acl/user/batchRemove'
}
// 获取全部用户的请求方法
export const reqAllUsers = (page: number, limit: number, username: string) =>
  request.get<any, AllUsersResponseData>(
    API.ALL_USER_URL + `${page}/${limit}?username=${username}`
  )
// 新增和修改用户的请求方法
export const reqAddOrUpdateUser = (data: User) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATE_USER_URL, data)
  } else {
    return request.post<any, any>(API.ADD_USER_URL, data)
  }
}
// 获取全部角色数据和当前用户拥有角色的请求方法
export const reqAllRoles = (userId: number) =>
  request.get<any, AllRolesResponseData>(API.ALL_ROLE_URL + userId)
// 给已有用户分配角色的请求方法
export const reqSetRole = (data: SetRoleData) =>
  request.post<any, any>(API.SET_ROLE_URL, data)
// 删除某个已有用户的请求方法
export const reqDeleteUser = (userId: number) =>
  request.delete<any, any>(API.DELETE_USER_URL + userId)
// 批量删除用户的请求方法
export const reqBatchDeleteUser = (idList: Array<number>) =>
  request.delete(API.BATCH_DELETE_USER_URL, { data: idList })
