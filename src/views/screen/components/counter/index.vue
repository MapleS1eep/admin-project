<template>
  <div class="counter-box">
    <div class="title">
      <p>数据统计</p>
      <img src="../../images/dataScreen-title.png" />
    </div>
    <div class="charts" ref="chartsRef"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

import { randomColor } from '@/utils/random'

const chartsRef = ref()

onMounted(() => {
  const mycharts = echarts.init(chartsRef.value)
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c}%'
    },
    legend: {
      left: '5%',
      orient: 'vertical', //图例列表的布局朝向：垂直
      top: 'center', //图例组件离容器左侧的距离：居中
      data: ['饮食', '购物', '住宿', '交通', '娱乐'],
      textStyle: {
        color: '#fff',
        fontSize: 14
      }
    },
    series: [
      {
        type: 'funnel',
        right: 0,
        top: 0,
        bottom: 10,
        width: '80%',
        sort: 'ascending',
        gap: 2,
        label: {
          show: true,
          position: 'inside',
          fontSize: 14
        },
        labelLine: {
          length: 10,
          lineStyle: {
            width: 1,
            type: 'solid'
          }
        },
        itemStyle: {
          // borderColor: '#fff',
          // borderWidth: 1,
          color: randomColor
        },
        emphasis: {
          label: {
            fontSize: 18
          }
        },
        data: [
          { value: 60, name: '饮食' },
          { value: 40, name: '购物' },
          { value: 20, name: '住宿' },
          { value: 80, name: '交通' },
          { value: 100, name: '娱乐' }
        ]
      }
    ]
  }
  mycharts.setOption(option)
})
</script>
<style lang="scss" scoped>
.counter-box {
  width: 100%;
  height: 100%;
  background: url('../../images/dataScreen-main-cb.png') no-repeat;
  background-size: 100% 100%;
  margin: 0 15px;
  .title {
    margin-left: 10px;
    p {
      color: white;
      font-size: 20px;
      margin-bottom: 10px;
    }
  }
  .charts {
    height: 80%;
  }
}
</style>
