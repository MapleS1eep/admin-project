<template>
  <div class="year-box">
    <div class="title">
      <p>年度游客量对比</p>
      <img src="../../images/dataScreen-title.png" />
    </div>
    <div class="charts" ref="chartsRef"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { randomArr, randomColor } from '@/utils/random'

const chartsRef = ref()
const data = ref(randomArr())

onMounted(() => {
  const mycharts = echarts.init(chartsRef.value)
  mycharts.setOption({
    title: {
      text: '散点图',
      textStyle: {
        color: '#fff',
        fontSize: 14
      },
      left: 'center',
      top: 0,
      lineColor: '#fff'
    },
    xAxis: {
      type: 'category',
      show: true,
      axisLine: {
        show: true,
        lineStyle: {
          color: '#fff'
        }
      },
      // 轴线设置
      axisTick: {
        show: true
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#fff',
          fontSize: 14
        }
      }
    },
    yAxis: {
      show: false
    },
    grid: {
      left: 30,
      top: 50,
      right: 30,
      bottom: 30
    },
    series: [
      {
        type: 'scatter',
        data: data.value,
        symbol: 'diamond',
        symbolSize: 15,
        itemStyle: {
          color: randomColor
        }
      }
    ]
  })
})
</script>
<style lang="scss" scoped>
.year-box {
  width: 100%;
  height: 100%;
  background: url('../../images/dataScreen-main-cb.png') no-repeat;
  background-size: 100% 100%;
  margin: 15px 0;
  .title {
    // margin-left: 20px;
    p {
      color: white;
      font-size: 16px;
      margin-bottom: 10px;
    }
  }
  .charts {
    height: calc(100% - 30px);
  }
}
</style>
