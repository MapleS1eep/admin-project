// 属性分类全局组件的小仓库
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { reqCategory1, reqCategory2, reqCategory3 } from '@/api/product/attr'
import type { CategoryObj, CategoryResponseData } from '@/api/product/attr/type'

const userCategoryStore = defineStore('Category', () => {
  // 存储一级分类的数据
  const c1Arr = ref<Array<CategoryObj>>([])
  // 收集一级分类id
  const c1Id = ref<number | string>('')
  // 存储二级分类的数据
  const c2Arr = ref<Array<CategoryObj>>([])
  // 收集二级分类id
  const c2Id = ref<number | string>('')
  // 存储三级分类的数据
  const c3Arr = ref<Array<CategoryObj>>([])
  // 收集三级分类id
  const c3Id = ref<number | string>('')

  // 获取一级分类的数据
  const getC1 = async () => {
    const result: CategoryResponseData = await reqCategory1()
    if (result.code == 200) {
      c1Arr.value = result.data
    }
  }

  // 获取二级分类的数据
  const getC2 = async () => {
    const result: CategoryResponseData = await reqCategory2(c1Id.value)
    if (result.code == 200) {
      c2Arr.value = result.data
    }
  }

  // 获取二级分类的数据
  const getC3 = async () => {
    const result: CategoryResponseData = await reqCategory3(c2Id.value)
    if (result.code == 200) {
      c3Arr.value = result.data
    }
  }
  return {
    c1Arr,
    c1Id,
    getC1,
    c2Arr,
    c2Id,
    getC2,
    c3Arr,
    c3Id,
    getC3
  }
})
export default userCategoryStore
