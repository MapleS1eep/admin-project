<template>
  <div class="rank-box">
    <div class="title">
      <p>热门景区排行</p>
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

const data = ref<Array<number>>(randomArr())

onMounted(() => {
  const mycharts = echarts.init(chartsRef.value)
  mycharts.setOption({
    title: {
      text: '景区排行',
      link: 'https://cn.vuejs.org',
      left: 'center',
      textStyle: {
        color: '#fff',
        fontSize: 16
      },
      subtext: '各大景区',
      subtextStyle: {
        color: '#fff'
      }
    },
    xAxis: {
      // 在x轴均分
      type: 'category',
      data: ['北京', '上海', '广州', '深圳', '杭州', '西安', '重庆'],
      splitLine: {
        show: false
      },
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
      splitLine: {
        show: false
      },
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
    grid: {
      right: 10,
      bottom: 30
    },
    // 控制要显示图形图表的类型
    series: [
      {
        type: 'bar',
        data: data.value,
        label: {
          show: true,
          position: 'insideTop',
          color: '#fff'
        },
        // 柱条背景
        // showBackground: true,
        // backgroundStyle: {
        //   color: '#ddd'
        // },
        itemStyle: {
          borderRadius: [10, 10, 0, 0],
          color: randomColor
        }
      },
      {
        type: 'line',
        data: data.value,
        itemStyle: {
          color: randomColor
        },
        lineStyle: {
          color: randomColor,
          width: 3
        },
        smooth: true
      }
    ]
  })
})
</script>
<style lang="scss" scoped>
.rank-box {
  width: 100%;
  height: 100%;
  background: url('../../images/dataScreen-main-cb.png') no-repeat;
  background-size: 100% 100%;
  margin: 15px 0;
  .title {
    // margin-left: 0px;
    p {
      color: white;
      font-size: 18px;
      margin-bottom: 10px;
    }
  }
  .charts {
    height: calc(100% - 30px);
  }
}
</style>
