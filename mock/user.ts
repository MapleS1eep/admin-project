// createUserList: 此函数会返回一个数组，数组包含两个用户信息
function createUserList() {
  return [
    {
      userId: 1,
      avatar:
        'https://pic2.zhimg.com/v2-9ac11c8d91707d305cf6ec8a3efc140b_r.jpg',
      username: 'admin',
      password: '111111',
      desc: '平台管理员',
      roles: ['平台管理员'],
      buttons: ['cuser.detail'],
      routes: ['home'],
      token: 'Admin Token'
    },
    {
      userId: 2,
      avatar:
        'https://tse3-mm.cn.bing.net/th/id/OIP-C.tm6WK2JPevj3uX9Y7AH9oAHaHa?rs=1&pid=ImgDetMain',
      username: 'system',
      password: '111111',
      desc: '系统管理员',
      roles: ['系统管理员'],
      buttons: ['cuser.detail', 'cuser.user'],
      routes: ['home'],
      token: 'Admin Token'
    }
  ]
}

// 登录接口和获取用户信息接口
export default [
  // 登录
  {
    url: '/api/user/login',
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body
      const checkUser = createUserList().find(
        (item) => item.username === username && item.password === password
      )
      // 无用户返回失败信息
      if (!checkUser) {
        return { code: 201, data: { message: '账号或者密码不正确' } }
      }
      // 如果有返回成功信息
      const { token } = checkUser
      return { code: 200, data: { token } }
    }
  },
  // 获取用户信息
  {
    url: '/api/user/info',
    method: 'get',
    response: (request) => {
      const token = request.headers.token
      const checkUser = createUserList().find((item) => item.token === token)
      if (!checkUser) {
        return { code: 201, data: { message: '获取用户信息失败' } }
      }
      return { code: 200, data: { checkUser } }
    }
  }
]
