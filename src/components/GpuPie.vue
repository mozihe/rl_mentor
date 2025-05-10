<template>
    <el-card shadow="hover" style="height:400px">
      <template #header>GPU 占用分布</template>
      <div ref="pieEl" style="height:320px"></div>
    </el-card>
  </template>
  
  <script setup>
  import { onMounted, onActivated, ref } from 'vue'
  import * as echarts from 'echarts'
  import { useMainStore } from '../store'
  
  const store = useMainStore()
  const pieEl = ref(null)
  let chart   = null
  
  function render () {
    const counts = store.experiments.reduce((m,e)=>(m[e.gpu]=(m[e.gpu]||0)+1,m),{})
    if (!chart) chart = echarts.init(pieEl.value)
    chart.setOption({
      tooltip:{trigger:'item'},
      series:[{
        type:'pie',
        radius:['55%','75%'],
        data:Object.entries(counts).map(([k,v])=>({name:k,value:v})),
        label:{formatter:'{b}: {d}%'}
      }]
    })
    chart.resize()
  }
  
  onMounted(render)
  onActivated(render)     // Tab 激活时重算尺寸
  </script>
  