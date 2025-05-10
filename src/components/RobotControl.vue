<template>
    <div class="panel">
      <div v-for="(j,i) in joints" :key="j.name" class="slider">
        <label>{{ j.label }}</label>
        <input type="range" :min="j.min" :max="j.max" :step="j.step"
               v-model.number="vals[i]"
               @input="emit('joint-change',{jointName:j.name,angle:vals[i]})"/>
        <span>{{ vals[i].toFixed(2) }} rad</span>
      </div>
  
      <div class="slider">
        <label>夹爪</label>
        <input type="range" min="0" max="0.8" step="0.01"
               v-model.number="grip"
               @input="emit('gripper-change',grip)"/>
        <span>{{ grip.toFixed(2) }}</span>
      </div>
  
      <el-button class="w-full" type="primary" @click="resetAll">复位</el-button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  const emit=defineEmits(['joint-change','gripper-change','reset-all'])
  
  const joints=[
    {name:'shoulder_joint',label:'肩',min:-3.0,max:3.0,step:0.01},
    {name:'upperArm_joint',label:'上臂',min:-3.0,max:3.0,step:0.01},
    {name:'foreArm_joint', label:'前臂',min:-3.0,max:3.0,step:0.01},
    {name:'wrist1_joint',  label:'腕1',min:-3.0,max:3.0,step:0.01},
    {name:'wrist2_joint',  label:'腕2',min:-3.0,max:3.0,step:0.01},
    {name:'wrist3_joint',  label:'腕3',min:-3.0,max:3.0,step:0.01}
  ]
  const INIT=[0,0,1.57,0,1.57,0]
  const vals=ref([...INIT])
  const grip=ref(0)
  
  function resetAll(){
    vals.value=[...INIT];grip.value=0
    emit('reset-all',{
      shoulder_joint:INIT[0],upperArm_joint:INIT[1],foreArm_joint:INIT[2],
      wrist1_joint:INIT[3],wrist2_joint:INIT[4],wrist3_joint:INIT[5],
      finger_joint:0
    })
  }
  </script>
  
  <style scoped>
  .panel{padding:16px;height:100%;overflow:auto;background:#fafafa}
  .slider{margin-bottom:14px}
  .slider label{display:block;margin-bottom:4px;font-weight:600}
  .slider input[type=range]{width:100%}
  </style>
  