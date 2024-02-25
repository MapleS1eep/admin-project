<template>
  <!-- 左侧图标 -->
  <el-icon @click="changeIcon">
    <component :is="fold ? 'Expand' : 'Fold'"></component>
  </el-icon>
  <!-- 左侧面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <!-- 面包屑动态展示路由的名字和标题 -->
    <el-breadcrumb-item
      v-for="(item, index) in $route.matched"
      :key="index"
      v-show="item.meta.title"
      :to="item.path"
    >
      <el-icon>
        <component :is="item.meta.icon" />
      </el-icon>
      <span>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script setup lang="ts">
import useLayoutSettingStore from '@/store/modules/setting'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

// 当前路由对象
let $route = useRoute()
// 控制图标切换 折叠/打开
let settingStore = useLayoutSettingStore()
let { fold } = storeToRefs(settingStore)
// 点击图标的方法
const changeIcon = () => {
  fold.value = !fold.value
}
</script>
<script lang="ts">
export default {
  name: 'BreadCrumb'
}
</script>
<style lang="scss" scoped>
.el-icon {
  margin-right: 10px;
}
.el-breadcrumb-item {
  display: flex;
  align-items: center;
}
</style>
