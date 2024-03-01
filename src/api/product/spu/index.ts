// SPU管理模块的接口
import request from '@/utils/request'
import type {
  HasSpuResponseData,
  AllTrademark,
  SpuHasImage,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
  SpuData,
  SkuData,
  SkuInfoData
} from './type'
enum API {
  // 获取已有SPU数据
  HAS_SPU_URL = '/admin/product/',
  // 获取全部品牌数据
  ALL_TRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  // 获取某个SPU下全部售卖商品的图片的数据
  IMAGE_URL = '/admin/product/spuImageList/',
  // 获取某个SPU下的全部销售属性
  SPU_SALE_ATTR_URL = '/admin/product/spuSaleAttrList/',
  // 获取整个项目全部的销售属性【颜色、版本、尺寸】
  ALL_SALE_ATTR_URL = '/admin/product/baseSaleAttrList',
  // 添加新的SPU
  ADD_SPU_URL = '/admin/product/saveSpuInfo',
  // 修改已有SPU
  UPDATE_SPU_URL = '/admin/product/updateSpuInfo',
  // 添加一个新的SKU
  ADD_SKU_URL = '/admin/product/saveSkuInfo',
  // 查看某个已有SPU下的全部售卖商品
  SKU_INFO_URL = '/admin/product/findBySpuId/',
  // 删除已有SPU
  DELETE_SPU_URL = '/admin/product/deleteSpu/'
}
// 获取某个三级分类下已有SPU数据的方法
export const reqHasSpu = (
  page: number,
  limit: number,
  categoryId: number | string
) =>
  request.get<any, HasSpuResponseData>(
    `${API.HAS_SPU_URL}${page}/${limit}?category3Id=${categoryId}`
  )
// 获取全部品牌
export const reqAllTrademark = () =>
  request.get<any, AllTrademark>(API.ALL_TRADEMARK_URL)
// 获取SPU下全部售卖商品图片
export const reqSpuImageList = (spuId: number) =>
  request.get<any, SpuHasImage>(API.IMAGE_URL + spuId)
// 获取SPU下全部销售属性
export const reqSpuSaleAttr = (spuId: number) =>
  request.get<any, SaleAttrResponseData>(API.SPU_SALE_ATTR_URL + spuId)
// 获取全部的销售属性
export const reqAllSaleAttr = () =>
  request.get<any, HasSaleAttrResponseData>(API.ALL_SALE_ATTR_URL)
// 添加新的SPU 修改已有SPU
export const reqAddOrUpdateSpu = (data: SpuData) => {
  if (data.id) {
    return request.post<any, any>(API.UPDATE_SPU_URL, data)
  } else {
    return request.post<any, any>(API.ADD_SPU_URL, data)
  }
}
// 添加sku请求的方法
export const reqAddSku = (data: SkuData) =>
  request.post<any, any>(API.ADD_SKU_URL, data)
// 查看某个sku下全部商品
export const reqSkuInfo = (spuId: number | string) =>
  request.get<any, SkuInfoData>(API.SKU_INFO_URL + spuId)
// 删除已有SPU
export const reqDeleteSpu = (spuId: number | string) =>
  request.delete<any, any>(API.DELETE_SPU_URL + spuId)
