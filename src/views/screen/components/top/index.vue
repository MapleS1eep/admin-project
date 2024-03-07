<template>
  <div class="top">
    <div class="left">
      <span class="left-btn" @click="goHome">首页</span>
    </div>
    <div class="center">
      <div class="title">智慧旅游可视化大数据平台</div>
    </div>
    <div class="right">
      <span class="right-btn">统计报告</span>
      <span class="time">当前时间 {{ time }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import moment from 'moment'

const time = ref(moment().format('YYYY年MM月DD日 HH:mm:ss'))
const $router = useRouter()
const timer = ref(0)

const goHome = () => {
  $router.push({ path: '/home' })
}
// 实时更新时间
onMounted(() => {
  timer.value = setInterval(() => {
    time.value = moment().format('YYYY年MM月DD日 HH:mm:ss')
  }, 1000)
})
// 组件销毁时销毁计时器
onBeforeUnmount(() => {
  clearInterval(timer.value)
})
</script>
<style lang="scss" scoped>
.top {
  width: 100%;
  height: 40px;
  display: flex;
  .left {
    flex: 1.5;
    background: url('../../images/dataScreen-header-left-bg.png') no-repeat;
    background-size: cover;
    .left-btn {
      width: 150px;
      height: 40px;
      background: url('../../images//dataScreen-header-btn-bg-l.png');
      background-size: 100% 100%;
      float: right;
      text-align: center;
      line-height: 40px;
      color: #29fcff;
      font-size: 20px;
      cursor: pointer;
    }
  }
  .right {
    flex: 1.5;
    background: url('../../images//dataScreen-header-right-bg.png') no-repeat;
    background-size: cover;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #29fcff;
    font-size: 20px;
    .right-btn {
      width: 150px;
      height: 40px;
      background: url('../../images//dataScreen-header-btn-bg-r.png');
      background-size: 100% 100%;
      text-align: center;
      line-height: 40px;
    }
  }
  .center {
    flex: 2;
    .title {
      width: 100%;
      height: 74px;
      background: url('../../images//dataScreen-header-center-bg.png') no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 74px;
      color: #29fcff;
      font-size: 30px;
    }
  }
}
</style>
