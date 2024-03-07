// 引入自定义指令
import has from './vhas'
//指令对象
const directives: any = {
  has
}
export default {
  install(app: any) {
    Object.keys(directives).forEach((key) => {
      app.directive(key, directives[key])
    })
  }
}
