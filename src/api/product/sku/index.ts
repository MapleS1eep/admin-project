// sku接口相关的数据类型
import request from '@/utils/request'
import type { SkuResponseData, SkuInfoData } from './type'
// 接口相关地址
enum API {
  // 获取已有商品的数据
  SKU_URL = '/admin/product/list/',
  // 下架商品
  CANCEL_SALE_URL = '/admin/product/cancelSale/',
  // 上架商品
  ON_SALE_URL = '/admin/product/onSale/',
  // 商品详细信息
  SKU_INFO_URL = '/admin/product/getSkuInfo/',
  // 删除SKU
  DELETE_SKU_URL = '/admin/product/deleteSku/'
}
// 获取sku的接口方法
export const reqSkuList = (page: number, limit: number) =>
  request.get<any, SkuResponseData>(API.SKU_URL + `${page}/${limit}`)
// 下架商品的接口方法
export const reqCancelSale = (skuId: number) =>
  request.get<any, any>(API.CANCEL_SALE_URL + skuId)
// 上架商品的接口方法
export const reqOnSale = (skuId: number) =>
  request.get<any, any>(API.ON_SALE_URL + skuId)
// 获取商品详细信息接口方法
export const reqSkuInfo = (skuId: number) =>
  request.get<any, SkuInfoData>(API.SKU_INFO_URL + skuId)
// 删除skud的接口方法
export const reqDeleteSku = (skuId: number) =>
  request.delete<any, any>(API.DELETE_SKU_URL + skuId)
