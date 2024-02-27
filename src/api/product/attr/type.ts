// 分类相关的数据的ts类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
// 分类
export interface CategoryObj {
  id: number | string
  name: string
  category1Id?: number
  category2Id?: number
}
// 分类接口返回数据的ts类型
export interface CategoryResponseData extends ResponseData {
  data: Array<CategoryObj>
}

//属性与属性值的类型
// 已有属性值对象的ts类型
export interface AttrValue {
  id?: number
  valueName: string
  attrId?: number
  flag?: boolean
}
// 存储每个属性值的数组的类型
export type AttrValueList = Array<AttrValue>
// 属性对象
export interface Attr {
  id?: number
  attrName: string
  categoryId: number | string
  categoryLevel: number
  attrValueList: AttrValueList
}
// 存储每个属性对象的数组的类型
export type AttrList = Array<Attr>
// 属性接口返回数据的类型
export interface AttrResponseData extends ResponseData {
  data: AttrList
}
