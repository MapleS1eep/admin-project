<template>
  <div class="line-box">
    <div class="title">
      <p>未来7天游客数量趋势图</p>
      <img src="../../images/dataScreen-title.png" />
    </div>
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
    title: {
      text: '游客访问量',
      right: 0,
      // top: 0,
      textStyle: {
        color: '#ccc',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontFamily: 'sans-serif',
        fontSize: 18
      }
    },
    // x轴和y轴
    xAxis: {
      type: 'category',
      // 两侧不填充
      boundaryGap: false,
      // 去除分割线
      splitLine: {
        show: false
      },
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      // 轴线
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
      // 轴线
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
      left: 50,
      top: 30,
      right: 20,
      bottom: 30
    },
    series: [
      {
        type: 'line',
        data: [121, 57, 256, 88, 326, 168, 32],
        smooth: true,
        // 区域填充样式
        areaStyle: {
          // 径向渐变，前三个参数分别是圆心 x, y 和半径，取值同线性渐变
          color: {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.5,
            colorStops: [
              {
                offset: 0,
                color: '#1BE2F1' // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#1BE2F1' // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        }
      }
    ]
  })
})
</script>
<style lang="scss" scoped>
.line-box {
  width: 100%;
  height: 100%;
  background: url('../../images/dataScreen-main-cb.png') no-repeat;
  background-size: 100% 100%;
  margin: 0 20px;
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
