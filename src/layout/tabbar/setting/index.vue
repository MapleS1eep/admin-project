<template>
  <el-button
    circle
    size="small"
    icon="Refresh"
    @click="updateRefresh"
  ></el-button>
  <el-button
    circle
    size="small"
    icon="FullScreen"
    @click="fullScreen"
  ></el-button>
  <el-button circle size="small" icon="Setting"></el-button>
  <img :src="avatar" />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup lang="ts">
import useUserStore from '@/store/modules/user'
import useLayoutSettingStore from '@/store/modules/setting'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'

let $router = useRouter()
let $route = useRoute()

let userStore = useUserStore()

let { username, avatar } = storeToRefs(userStore)

let layoutSettingStore = useLayoutSettingStore()
let { refresh } = storeToRefs(layoutSettingStore)
// 点击刷新按钮的回调
const updateRefresh = () => {
  refresh.value = !refresh.value
}
// 点击全屏
const fullScreen = () => {
  //DOM对象的属性，判断当前是否为全屏模式
  let full = document.fullscreenElement
  if (!full) {
    // 切换成全屏
    document.documentElement.requestFullscreen()
  } else {
    // 退出全屏
    document.exitFullscreen()
  }
}
// 点击退出登录
const logout = async () => {
  await userStore.userLogout()
  $router.push({
    path: '/login',
    query: {
      redirect: $route.path
    }
  })
}
</script>
<script lang="ts">
export default {
  name: 'Setting'
}
</script>
<style lang="scss" scoped>
img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin: 0 10px;
}
</style>
