<template>
  <div class="age-box">
    <div class="title">
      <p>年龄比例</p>
      <img src="../../images/dataScreen-title.png" />
    </div>
    <!-- 图表容器 -->
    <div class="charts" ref="chartsRef"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const chartsRef = ref()

onMounted(() => {
  const mycharts = echarts.init(chartsRef.value)
  mycharts.setOption({
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: '25%',
      textStyle: {
        color: 'white',
        fontSize: '14px'
      }
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['30%', '80%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'inside',
          color: 'white'
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 250, name: '<20岁' },
          { value: 750, name: '20~30岁' },
          { value: 680, name: '30~40岁' },
          { value: 520, name: '40~50岁' },
          { value: 360, name: '50~60岁' },
          { value: 240, name: '>60岁' }
        ]
      }
    ],
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    }
  })
})
</script>
<style lang="scss" scoped>
.age-box {
  width: 100%;
  height: 100%;
  background: url('../../images/dataScreen-main-cb.png') no-repeat;
  background-size: 100% 100%;
  .title {
    margin-left: 20px;
    p {
      color: white;
      font-size: 20px;
      margin-bottom: 10px;
    }
  }
  .charts {
    width: 100%;
    height: 300px;
  }
}
</style>
