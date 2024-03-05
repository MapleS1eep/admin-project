// 菜单管理模块相关的数据类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
// 菜单与按钮数据的ts类型
export interface Permission {
  id: number
  createTime: string
  updateTime: string
  pid: number
  name: string
  code: string
  toCode: string
  type: number
  status: null
  level: number
  children: PermissionList | []
  select: boolean
}
export type PermissionList = Array<Permission>

// 获取菜单与按钮接口返回数据的ts类型
export interface PermissionListResponseData extends ResponseData {
  data: PermissionList
}
// 添加与修改菜单请求参数的ts类型
export interface MenuParams {
  id?: number
  name: string
  code: string
  pid: number
  level: number
}
