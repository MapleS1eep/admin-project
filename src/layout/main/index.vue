<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" v-if="flag"></component>
    </transition>
  </router-view>
</template>
<script setup lang="ts">
import useLayoutSettingStore from '@/store/modules/setting'
import { storeToRefs } from 'pinia'
import { ref, watch, nextTick } from 'vue'

// 控制当前组件是否重新渲染
let flag = ref(true)

let layoutSettingStore = useLayoutSettingStore()
let { refresh } = storeToRefs(layoutSettingStore)
// 监听仓库数据refresh是否变化,发生变化即说明用户点击了刷新按钮
watch(
  () => refresh.value,
  () => {
    flag.value = false
    nextTick(() => {
      flag.value = true
    })
  }
)
</script>
<script lang="ts">
export default {
  name: 'MainContent'
}
</script>
<style lang="scss" scoped>
.fade-enter-from {
  opacity: 0;
}
.fade-enter-active {
  transition: all 0.5s;
}
.fade-enter-to {
  opacity: 1;
}
.fade-leave-to {
  opacity: 0;
}
.fade-leave-active {
  transition: opacity 0.5s ease;
}
</style>
