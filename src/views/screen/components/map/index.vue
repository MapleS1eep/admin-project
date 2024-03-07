<template>
  <div class="map-box" ref="mapRef"></div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
// 引入中国地图的json数据
import chinaJson from './china.json'

const mapRef = ref()
// 注册中国地图
echarts.registerMap('china', chinaJson as any)

onMounted(() => {
  const mycharts = echarts.init(mapRef.value)
  mycharts.setOption({
    // 地图组件
    geo: {
      map: 'china',
      roam: true,
      left: 30,
      top: 50,
      right: 0,
      bottom: 0,
      label: {
        show: true,
        color: '#fff',
        fontSize: '14px'
      },
      itemStyle: {
        color: '#3498DB',
        opacity: 0.8
      },
      // 地图高亮效果
      emphasisP: {
        itemStyle: {
          color: 'orange'
        },
        label: {
          fontSize: '30px'
        }
      }
    },
    // 布局位置
    // grid: {
    //   left: 0,
    //   top: 0,
    //   right: 0,
    //   bottom: 0
    // },
    series: [
      {
        // 航线系列
        type: 'lines',
        data: [
          {
            coords: [
              [116.405285, 39.904989], // 起点
              [113.280637, 23.125178] //终点
            ],
            lineStyle: {
              color: 'blue',
              width: 3
            }
          },
          {
            coords: [
              [108.320004, 22.82402], // 起点
              [110.33119, 20.031971] //终点
            ],
            lineStyle: {
              color: 'blue',
              width: 3
            }
          },
          {
            coords: [
              [106.504962, 29.533155], // 起点
              [121.509062, 25.044332] //终点
            ],
            lineStyle: {
              color: 'blue',
              width: 3
            }
          },
          {
            coords: [
              [116.405285, 39.904989], // 起点
              [91.132212, 29.660361] //终点
            ],
            lineStyle: {
              color: 'blue',
              width: 3
            }
          }
        ],
        // 是否显示特效
        effect: {
          show: true,
          symbol: 'arrow',
          color: 'orange',
          symbolSize: 10
        }
      }
    ]
  })
})
</script>
<style lang="scss" scoped></style>
