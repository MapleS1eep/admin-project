<template>
  <el-card>
    <div class="box">
      <img :src="avatar" class="avatar" />
      <div>
        <h3 class="title">{{ getTime() }}好，{{ username }}</h3>
        <p class="subtitle">后台管理运营平台</p>
      </div>
    </div>
  </el-card>
  <div class="bottom">
    <svg-icon name="welcome" width="600px" height="300px"></svg-icon>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
// 引入保存用户信息的仓库
import useUserStore from '@/store/modules/user'
import { getTime } from '@/utils/time'
const userStore = useUserStore()
const { username, avatar } = userStore
</script>
<style lang="scss" scoped>
.box {
  display: flex;
  align-items: center;
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-right: 50px;
  }
  .title {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .subtitle {
    font-style: italic;
    color: #aaaaaa;
  }
}
.bottom {
  margin-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
