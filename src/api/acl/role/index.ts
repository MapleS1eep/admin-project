// 角色管理相关的接口
import request from '@/utils/request'
import type { RolesListResponseData, Role } from './type'
enum API {
  // 获取角色分页列表
  ROLES_LIST_URL = '/admin/acl/role/',
  // 添加角色
  ADD_ROLE_URL = '/admin/acl/role/save',
  // 修改角色
  UPDATE_ROLE_URL = '/admin/acl/role/update',
  // 根据角色获取菜单和按钮权限
  ALL_PERMISSION_URL = '/admin/acl/permission/toAssign/',
  // 给角色分配权限
  SET_PRTMISSION_URL = '/admin/acl/permission/doAssign?',
  // 删除角色
  DELETE_ROLE_URL = '/admin/acl/role/remove/'
}
// 获取角色列表的请求方法
export const reqRolesList = (page: number, limit: number, roleName: string) =>
  request.get<any, RolesListResponseData>(
    API.ROLES_LIST_URL + `${page}/${limit}?roleName=${roleName}`
  )
// 添加或修改角色的请求方法
export const reqAddOrUpdateRole = (data: Role) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATE_ROLE_URL, data)
  } else {
    return request.post<any, any>(API.ADD_ROLE_URL, data)
  }
}
// 获取角色全部权限的请求方法
export const reqAllPermission = (roleId: number) =>
  request.get<any, MenuResponseData>(API.ALL_PERMISSION_URL + roleId)
// 给角色分配权限的请求方法
export const reqSetPermission = (roleId: number, permissionId: Array<number>) =>
  request.post<any, any>(
    API.SET_PRTMISSION_URL,
    `roleId=${roleId}&permissionId=${permissionId}`
  )
// 删除角色的请求方法
export const reqDeleteRole = (roleId: number) =>
  request.delete<any, any>(API.DELETE_ROLE_URL + roleId)
