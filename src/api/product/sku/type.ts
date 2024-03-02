export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
// SKU对象的ts类型
export interface SkuAttrValue {
  attrId: number | string
  valueId: number | string
  id?: number | string
  createTime?: string
  updateTime?: string
  skuId?: number | string
  attrName?: string
  valueName?: string
}
export interface SkuSaleAttrValue {
  saleAttrId: number | string
  saleAttrValueId: number | string
  id?: number | string
  createTime?: string
  updateTime?: string
  skuId?: number | string
  spuId?: number | string
  saleAttrValueId?: number | string
  saleAttrName?: string
  saleAttrValueName?: string
}
export interface SkuImg {
  createTime: string
  id: number
  imgName: string
  imgUrl: string
  isDefault: string
  skuId: number
  spuImgId: number
  updateTime: string
}
export interface SkuData {
  category3Id: number | string
  createTime: string
  id: number
  isSale?: number
  price: number | string
  weight: number | string
  skuAttrValueList: Array<SkuAttrValue>
  skuSaleAttrValueList: Array<SkuSaleAttrValue>
  skuDefaultImg: string
  skuDesc: string
  skuImageList: Array<SkuImg>
  skuName: string
  spuId: number | string
  tmId: number | string
  updateTime: string
}
// 获取sku接口返回数据的ts类型
export interface SkuResponseData extends ResponseData {
  data: {
    records: Array<SkuData>
    total: number
    size: number
    current: number
    countId: null
    hitCount: boolean
    maxLimit: null
    searchCount: boolean
    pages: number
    orders?: Array<null>
    optimizeCountSql: boolean
  }
}

// 获取sku商品详情接口的ts类型
export interface SkuInfoData extends ResponseData {
  data: SkuData
}
