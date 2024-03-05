<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider">
      <Logo />
      <!-- 滚动组件 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu
          :default-active="$route.path"
          background-color="#001529"
          text-color="#fff"
          :collapse="fold ? true : false"
        >
          <Menu-Item :menuList="menuRoutes" />
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div class="layout_tabbar" :class="{ fold: fold ? true : false }">
      <Tabbar></Tabbar>
    </div>
    <!-- 内容展示区域 -->
    <div class="layout_main" :class="{ fold: fold ? true : false }">
      <Main></Main>
    </div>
  </div>
</template>
<script setup lang="ts">
// 引入顶部导航栏组件
import Tabbar from './tabbar/index.vue'
// 引入左侧logo子组件
import Logo from './logo/index.vue'
// 引入菜单组件
import MenuItem from './menu/index.vue'
// 引入右侧展示内容组件
import Main from './main/index.vue'
// 获取路由对象
import { useRoute } from 'vue-router'
// 获取用户相关的小仓库
import useUserStore from '@/store/modules/user'
// layout配置相关的小仓库
import useLayoutSettingStore from '@/store/modules/setting'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

let { menuRoutes } = useUserStore()
let layoutSettingStore = useLayoutSettingStore()
let { fold } = storeToRefs(layoutSettingStore)

let $route = useRoute()

onMounted(() => {
  layoutSettingStore.setTheme()
})
</script>
<script lang="ts">
export default {
  name: 'Layout'
}
</script>
<style lang="scss" scoped>
.layout_container {
  width: 100%;
  height: 100vh;
  // background: #ee53bf;
  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-background;
    color: #fff;
    transition: all 0.3s;
    .scrollbar {
      height: calc(100vh - $base-menu-logo-height);
      .el-menu {
        border-right: none;
      }
    }
  }
  .layout_tabbar {
    position: fixed;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    top: 0;
    left: $base-menu-width;
    transition: all 0.3s;
    &.fold {
      left: $base-menu-min-width;
      width: calc(100% - $base-menu-min-width);
    }
  }
  .layout_main {
    position: absolute;
    left: $base-menu-width;
    top: $base-tabbar-height;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;
    &.fold {
      left: $base-menu-min-width;
      width: calc(100% - $base-menu-min-width);
    }
  }
}
</style>
