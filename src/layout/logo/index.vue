<template>
  <div class="logo" v-if="setting.showLogo">
    <img :src="setting.logo" />
    <p>{{ setting.title }}</p>
  </div>
</template>
<script setup lang="ts">
// 引入设置标题和logo的配置文件
import setting from '@/setting'
</script>
<script lang="ts">
export default {
  name: 'Logo'
}
</script>
<style lang="scss" scoped>
.logo {
  width: 100%;
  height: $base-menu-logo-height;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 10px;
  img {
    width: 24px;
  }
  p {
    font-size: $base-logo-title-fontSize;
    margin-left: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
