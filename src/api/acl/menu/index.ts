// 菜单管理模块的相关接口
import request from '@/utils/request'
import type { PermissionListResponseData, MenuParams } from './type'
enum API {
  // 获取全部菜单与按钮的标识
  ALL_PERMISSION_URL = '/admin/acl/permission',
  // 新增菜单
  ADD_PERMISSION_URL = '/admin/acl/permission/save',
  // 修改菜单
  UPDATE_PERMISSION_URL = '/admin/acl/permission/update',
  // 删除菜单
  DELETE_PERMISSION_URL = '/admin/acl/permission/remove/'
}
// 获取全部菜单与按钮数据的请求方法
export const reqAllPermission = () =>
  request.get<any, PermissionListResponseData>(API.ALL_PERMISSION_URL)
// 新增或修改菜单的请求方法
export const reqAddOrUpdateMenu = (data: MenuParams) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATE_PERMISSION_URL, data)
  } else {
    return request.post<any, any>(API.ADD_PERMISSION_URL, data)
  }
}
// 删除菜单的请求方法
export const reqDeleteMenu = (id: number) =>
  request.delete<any, any>(API.DELETE_PERMISSION_URL + id)
