<template>
  <div class="sex-box">
    <div class="title">
      <p>男女比例</p>
      <img src="../../images/dataScreen-title.png" />
    </div>
    <div class="sex">
      <div class="male">
        <img src="../../images/man.png" />
      </div>
      <div class="female">
        <img src="../../images/woman.png" />
      </div>
    </div>
    <div class="rate">
      <p>男士58%</p>
      <p>女士42%</p>
    </div>
    <div class="charts" ref="chartsRef"></div>
  </div>
</template>
<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
const chartsRef = ref()

onMounted(() => {
  const mycharts = echarts.init(chartsRef.value)
  mycharts.setOption({
    xAxis: {
      show: false,
      min: 0,
      max: 100
    },
    yAxis: {
      show: false,
      type: 'category'
    },
    series: [
      {
        type: 'bar',
        data: [58],
        barWidth: 20,
        z: 100,
        itemStyle: {
          color: '#3347FF',
          borderRadius: 20
        }
      },
      {
        type: 'bar',
        data: [100],
        barWidth: 20,
        barGap: '-100%',
        itemStyle: {
          color: '#EC7063',
          borderRadius: 20
        }
      }
    ],
    grid: {
      left: 50,
      top: 0,
      right: 50,
      bottom: 0
    }
  })
})
</script>
<style lang="scss" scoped>
.sex-box {
  width: 100%;
  height: 100%;
  background: url('../../images/dataScreen-main-cb.png') no-repeat;
  background-size: 100% 100%;
  margin: 15px 0;
  .title {
    margin-left: 20px;
    p {
      color: white;
      font-size: 20px;
      margin-bottom: 10px;
    }
  }
  .sex {
    display: flex;
    justify-content: center;
    align-items: center;
    .male {
      margin: 20px;
      width: 111px;
      height: 115px;
      background: url('../../images/man-bg.png') no-repeat;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .female {
      margin: 20px;
      width: 111px;
      height: 115px;
      background: url('../../images/woman-bg.png') no-repeat;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .rate {
    display: flex;
    justify-content: center;
    align-items: center;
    p {
      margin: 20px;
      color: white;
      font-size: 20px;
    }
  }
  .charts {
    height: 50px;
  }
}
</style>
