// 角色管理模块相关数据的ts类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 角色信息的ts类型
export interface Role {
  id?: number
  createTime?: string
  updateTime?: string
  roleName: string
  remark?: null
}
// 包含所有角色信息的列表ts类型
export type Records = Array<Role>
// 获取角色列表接口返回数据的ts类型
export interface RolesListResponseData extends ResponseData {
  dataL: {
    records: Records
    total: number
    size: number
    current: number
    pages: number
  }
}
// 菜单和按钮权限数据的ts类型
export interface MenuData {
  id: number
  createTime: string
  updateTime: string
  pid: number
  name: string
  code: null
  toCode: null
  type: number
  status: null
  level: number
  children?: MenuArr
  select: boolean
}
export type MenuArr = Array<MenuData>

// 菜单和按钮权限接口返回数据的ts类型
export interface MenuResponseData extends ResponseData {
  data: MenuArr
}
