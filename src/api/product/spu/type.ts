//服务器所有接口返回的数据类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
// SPU数据的TS类型
export interface SpuData {
  category3Id: number | string
  id?: number | string
  spuName: string
  description: string
  spuImageList: null | Array<SpuImage>
  tmId: number | string
  spuSaleAttrList: null | Array<SaleAttr>
}
// 包含已有SPU数据的数组的ts类型
export type Records = Array<SpuData>
// 已有SPU接口返回数据的ts类型
export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}
// 品牌数据的ts类型
export interface Trademark {
  id: number
  tmName: string
  logoUrl: string
}
//品牌数据接口返回数据的ts类型
export interface AllTrademark extends ResponseData {
  data: Array<Trademark>
}
// SPU下商品图片的ts类型
export interface SpuImage {
  id?: number
  imgName?: string
  imgUrl?: string
  createTime?: string
  updateTime?: string
  spuId?: number
  name?: string
  url?: string
}
// 已有Spu的图片墙数据类型
export interface SpuHasImage extends ResponseData {
  data: Array<SpuImage>
}
//已有的销售属性值对象的ts类型
export interface SaleAttrValue {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrValueName: string
  saleAttrName?: string
  isChecked?: null
}
// 已有的销售属性值数组的ts类型
export type SpuSaleAttrValueList = Array<SaleAttrValue>
//销售属性对象的ts类型
export interface SaleAttr {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrName: string
  spuSaleAttrValueList: SpuSaleAttrValueList
  flag?: boolean
  saleAttrValue?: string
}
// SPU已有的销售属性接口返回数据的类型
export interface SaleAttrResponseData extends ResponseData {
  data: Array<SaleAttr>
}

// 已有的全部销售属性的返回数据ts类型
export interface HasSaleAttr {
  id: number
  name: string
}
// 已有全部销售属性接口返回数据ts类型
export interface HasSaleAttrResponseData extends ResponseData {
  data: Array<HasSaleAttr>
}
// sku数据
export interface SkuAttrValue {
  attrId: number | string
  valueId: number | string
}
export interface SkuSaleAttrValue {
  saleAttrId: number | string
  saleAttrValueId: number | string
}
export interface SkuData {
  category3Id: number | string
  spuId: number | string
  tmId: number | string
  skuName: string
  price: number | string
  weight: number | string
  skuDesc: string
  skuAttrValueList: Array<SkuAttrValue>
  skuSaleAttrValueList: Array<SkuSaleAttrValue>
  skuDefaultImg: string
}

// 获取SKU数据接口的ts类型
export interface SkuInfoData extends ResponseData {
  data: Array<SkuData>
}
