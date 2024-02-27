// 属性管理相关api
import request from '@/utils/request'
// 引入数据类型
import type { CategoryResponseData, AttrResponseData, Attr } from './type'
// 接口地址
enum API {
  // 获取一级分类接口地址
  C1_URL = '/admin/product/getCategory1',
  // 获取二级分类接口地址
  C2_URL = '/admin/product/getCategory2/',
  // 获取三级分类接口地址
  C3_URL = '/admin/product/getCategory3/',
  // 获取分类下已有的属性和属性值的接口地址
  ATTR_URL = '/admin/product/attrInfoList/',
  // 添加或修改已有属性的接口地址
  ADD_OR_UPDATE_ATTR_URL = '/admin/product/saveAttrInfo',
  // 删除已有属性的接口地址
  DELETE_ATTR_URL = '/admin/product/deleteAttr/'
}
// 获取一级分类方法
export const reqCategory1 = () =>
  request.get<any, CategoryResponseData>(API.C1_URL)
export const reqCategory2 = (categoryId1: number | string) =>
  request.get<any, CategoryResponseData>(API.C2_URL + categoryId1)
// 获取三级分类方法
export const reqCategory3 = (categoryId2: number | string) =>
  request.get<any, CategoryResponseData>(API.C3_URL + categoryId2)
//获取分类下已有的属性和属性值的方法
export const reqAttr = (
  categoryId1: number | string,
  categoryId2: number | string,
  categoryId3: number | string
) =>
  request.get<any, AttrResponseData>(
    `${API.ATTR_URL}${categoryId1}/${categoryId2}/${categoryId3}`
  )
// 添加或者修改已有属性的方法
export const reqAddOrUpdateAttr = (data: Attr) =>
  request.post<any, any>(API.ADD_OR_UPDATE_ATTR_URL, data)
// 删除已有属性的方法
export const reqDeleteAttr = (attrId: number) =>
  request.delete<any, any>(API.DELETE_ATTR_URL + attrId)
