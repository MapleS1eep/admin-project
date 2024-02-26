// 品牌管理模块相关的接口
import request from '@/utils/request'
// 品牌管理相关的数据类型
import type { TradeMarkResponseData, TradeMark } from './type'
// 品牌管理模块接口地址
enum API {
  // 获取已有品牌的接口地址
  TRADEMARK_URL = '/admin/product/baseTrademark/',
  // 添加品牌
  ADD_TRADEMARK_URL = '/admin/product/baseTrademark/save',
  // 修改品牌
  UPDATE_TRADEMARK_URL = '/admin/product/baseTrademark/update',
  // 删除已有品牌
  DELETE_TRADEMARK_URL = '/admin/product/baseTrademark/remove/'
}
// 获取已有品牌的方法
// page:获取第几页 默认第一页 limit:获取几条数据
export const reqHasTrademark = (page: number, limit: number) =>
  request.get<any, TradeMarkResponseData>(
    `${API.TRADEMARK_URL}${page}/${limit}`
  )
// 添加品牌和修改品牌的方法
export const reqAddOrUpdateTrademark = (data: TradeMark) => {
  // 修改已有品牌
  if (data.id) {
    return request.put<any, any>(API.UPDATE_TRADEMARK_URL, data)
  } else {
    // 新增品牌
    return request.post<any, any>(API.ADD_TRADEMARK_URL, data)
  }
}
// 删除品牌的方法
export const reqDeleteTrademark = (id: number) => {
  return request.delete<any, any>(`${API.DELETE_TRADEMARK_URL}${id}`)
}
