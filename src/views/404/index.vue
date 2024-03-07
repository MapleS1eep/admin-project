<template>
  <div class="page-404">
    <span @click="goHome">去首页</span>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()

const goHome = () => {
  router.replace('/home')
}
</script>
<style lang="scss" scoped>
.page-404 {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: url('@/assets/images/404.png') no-repeat;
  background-size: 100% 100%;
  span {
    color: #fff;
    text-align: center;
    position: fixed;
    top: 1%;
    right: 1%;
    cursor: pointer;
  }
}
</style>
