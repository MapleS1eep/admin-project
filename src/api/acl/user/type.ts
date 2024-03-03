// 用户管理模块相关数据的类型

export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
// 每个用户账号的数据ts类型
export interface User {
  id?: number
  createTime?: string
  updateTime?: string
  username?: string
  password?: string
  name?: string
  phone?: null
  roleName?: string
}
// 包含全部用户信息的数组ts类型
export type Records = Array<User>

// 获取全部用户信息接口返回数据的类型
export interface AllUsersResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    pages: number
  }
}
// 一个角色的ts类型
export interface RoleData {
  id?: number
  createTime?: string
  updateTime?: string
  roleName: string
  remark: null
}
// 所有角色列表的ts类型
export type AllRoles = Array<RoleData>
// 获取全部角色的接口返回数据的ts类型
export interface AllRolesResponseData extends ResponseData {
  data: {
    assignRoles: AllRoles
    allRolesList: AllRoles
  }
}
// 给用户分配角色接口返回数据的ts类型
export interface SetRoleData {
  roleIdList: Array<number>
  userId: number
}
