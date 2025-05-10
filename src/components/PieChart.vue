<template>
    <el-card shadow="hover" style="height:400px">
      <template #header>技术栈分布</template>
      <div ref="pieEl" style="height:320px"></div>
    </el-card>
  </template>
  
  <script setup>
  import { ref, onMounted, onActivated, watch } from 'vue'
  import * as echarts from 'echarts'
  
  const props = defineProps({
    data: {
      type: Array,
      required: true
    }
  })
  
  const pieEl = ref(null)
  let chart = null
  
  function render () {
    if (!pieEl.value) return
    if (!chart) chart = echarts.init(pieEl.value)
  
    chart.setOption({
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        radius: ['55%', '75%'],
        data: props.data.map(item => ({ name: item.name, value: item.value })),
        label: { formatter: '{b}: {d}%' }
      }]
    })
  
    chart.resize()
  }
  
  // 首次挂载时渲染
  onMounted(render)
  // Tab页切换回来时重新resize
  onActivated(render)
  // 监听数据变化，自动更新图表
  watch(() => props.data, () => {
    if (chart) {
      render()
    }
  })
  </script>
  