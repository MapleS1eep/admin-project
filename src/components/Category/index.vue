<template>
  <el-card>
    <el-form inline>
      <el-form-item label="一级分类">
        <el-select
          style="width: 240px"
          placeholder="请选择"
          v-model="c1Id"
          @change="handleC1"
          :disabled="!scene"
        >
          <el-option
            v-for="c1 in c1Arr"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          style="width: 240px"
          placeholder="请选择"
          v-model="c2Id"
          @change="handleC2"
          :disabled="!scene"
        >
          <el-option
            v-for="c2 in c2Arr"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          style="width: 240px"
          placeholder="请选择"
          v-model="c3Id"
          @change="handleC3"
          :disabled="!scene"
        >
          <el-option
            v-for="c3 in c3Arr"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
// 引入分类相关的仓库
import useCategoryStore from '@/store/modules/category'
import { storeToRefs } from 'pinia'
let categoryStore = useCategoryStore()
const { c1Arr, c1Id, c2Arr, c2Id, c3Arr, c3Id } = storeToRefs(categoryStore)
onMounted(() => {
  getC1()
})
// 通知仓库获取一级分类的方法
const getC1 = () => {
  categoryStore.getC1()
}
// 点击一级分类触发的回调
const handleC1 = () => {
  // 将二级和三级分类的数据先清除
  c2Id.value = ''
  c3Arr.value = []
  c3Id.value = ''
  categoryStore.getC2()
}
// 二级分类的回调
const handleC2 = () => {
  // 三级分类的数据先清除
  c3Id.value = ''
  categoryStore.getC3()
}
// 三级分类的回调
const handleC3 = (id: any) => {
  c3Id.value = id
}
// 接收父组件传的值
defineProps(['scene'])
</script>
<style lang="scss" scoped></style>
