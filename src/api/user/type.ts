// 登录接口需要传入参数的ts类型
export interface loginFormData {
  username: string
  password: string
}

// 全部接口返回数据都有的ts类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 登录接口返回的数据ts类型
export interface loginResponseData extends ResponseData {
  data: string
}

// 获取用户信息接口返回数据的类型
export interface userResponseData extends ResponseData {
  data: {
    routes: Array<string>
    buttons: Array<string>
    roles: Array<string>
    name: string
    avatar: string
  }
}
