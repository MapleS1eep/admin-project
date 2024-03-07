<template>
  <div class="box">
    <div class="top">
      <p class="title">实时游客统计</p>
      <p class="bg"></p>
      <p class="right">
        可预约总量：
        <span>99999人</span>
      </p>
    </div>
    <div class="number">
      <span v-for="(item, index) in people" :key="index">{{ item }}</span>
    </div>
    <!-- echarts展示图形图表的节点 -->
    <div class="charts" ref="chartsRef"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 引入echart以及水球图组件
import * as echarts from 'echarts'
import 'echarts-liquidfill'

const people = ref('216908人')
const chartsRef = ref()

onMounted(() => {
  // 获取echarts类的实例
  const myCharts = echarts.init(chartsRef.value)
  // 设置实例的配置项
  myCharts.setOption({
    // title: {
    //   text: '水球图'
    // },
    series: [
      {
        type: 'liquidFill',
        data: [0.6, 0.5, 0.4, 0.3],
        radius: '80%'
      }
    ]
  })
})
</script>
<style lang="scss" scoped>
.box {
  background: url('../../images/dataScreen-main-lb.png') no-repeat;
  background-size: 100% 100%;
  margin-top: 10px;
  .top {
    margin-left: 20px;
    .title {
      color: white;
      font-size: 20px;
    }
    .bg {
      width: 68px;
      height: 7px;
      background: url('../../images/dataScreen-title.png') no-repeat;
      background-size: 100% 100%;
      margin-top: 15px;
    }
    .right {
      float: right;
      color: white;
      font-size: 20px;
      margin-right: 10px;
      span {
        color: yellowgreen;
      }
    }
  }
  .number {
    padding: 10px;
    margin-top: 30px;
    display: flex;
    span {
      flex: 1;
      height: 68px;
      text-align: center;
      line-height: 68px;
      background: url('../../images//total.png') no-repeat;
      background-size: 100% 100%;
      color: #29fcff;
      font-size: 30px;
    }
  }
  .charts {
    width: 100%;
    height: 180px;
  }
}
</style>
