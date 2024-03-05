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
  <el-popover
    placement="bottom"
    trigger="click"
    title="主题设置"
    :width="250"
    :visible="popoverVisible"
  >
    <!-- 表单组件 -->
    <el-form>
      <el-form-item label="主题颜色">
        <el-color-picker
          v-model="theme"
          :predefine="predefineColors"
          @change="changeTheme"
        />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch
          v-model="dark"
          inline-prompt
          active-icon="Moon"
          inactive-icon="Sunny"
          @change="changeDark"
        />
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button circle icon="Setting" @click="setColor"></el-button>
    </template>
  </el-popover>

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
import { ref } from 'vue'
import useUserStore from '@/store/modules/user'
import useLayoutSettingStore from '@/store/modules/setting'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'

const predefineColors = ref<Array<string>>([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)'
  // 'hsva(120, 40, 94, 0.5)',
  // 'hsl(181, 100%, 37%)',
  // 'hsla(209, 100%, 56%, 0.73)',
  // '#c7158577'
])
// 控制气泡弹框的显示隐藏
const popoverVisible = ref<boolean>(false)
// 控制暗黑模式开关
const dark = ref<boolean>(false)

let $router = useRouter()
let $route = useRoute()

let userStore = useUserStore()

let { username, avatar } = storeToRefs(userStore)

let layoutSettingStore = useLayoutSettingStore()
let { refresh, theme } = storeToRefs(layoutSettingStore)
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
// 点击设置主题色和暗黑模式
const setColor = () => {
  popoverVisible.value = !popoverVisible.value
}
// 切换暗黑模式
const changeDark = () => {
  // 获取HTML根节点
  const html = document.documentElement
  // 判断HTML标签是否有类名dark
  dark.value ? (html.className = 'dark') : (html.className = '')
  popoverVisible.value = false
}
// 设置主题色
const changeTheme = () => {
  // 主题色的封装方法
  layoutSettingStore.setTheme()
  popoverVisible.value = false
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
