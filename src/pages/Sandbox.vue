<template>
  <!-- ========== 顶级布局 ========== -->
  <el-row :gutter="20">
    <!-- ----- 左侧面板 ----- -->
    <el-col :span="6" style="height:620px">
      <!-- 超参编辑 -->
      <HyperParamPanel :init="exp.params" @update="updateParams" />

      <!-- 设备 & 环境选择 -->
      <el-form label-width="70px" class="mt-4">
        <el-form-item label="设备">
          <el-select v-model="selDeviceId" style="width:180px">
            <el-option v-for="d in devices" :key="d.id" :label="d.name" :value="d.id" />
          </el-select>
          <el-button
            v-if="selDevice.cheap"
            type="primary"
            style="margin-left:8px"
            @click="startCheap"
          >启动</el-button>
          <el-button
            v-else
            type="warning"
            style="margin-left:8px"
            @click="applyGPU"
          >申请</el-button>
        </el-form-item>

        <el-form-item label="环境">
          <el-select v-model="selEnv" style="width:180px">
            <el-option v-for="e in envs" :key="e.id" :label="e.name" :value="e.id" />
          </el-select>
        </el-form-item>
      </el-form>

      <!-- 暂停 / 继续 -->
      <el-button
        :type="exp.status==='running' ? 'danger' : 'success'"
        style="margin-top:16px;width:100%"
        @click="toggleRun"
      >
        {{ exp.status==='running' ? '暂停' : '继续' }}
      </el-button>
    </el-col>

    <!-- ----- 右侧日志/曲线/配置/调试 ----- -->
    <el-col :span="18">
      <el-card shadow="hover" style="height:620px">
        <el-tabs v-model="tab">
          <!-- 日志 -->
          <el-tab-pane label="日志" name="log">
            <div class="log-box" ref="logBox">
              <pre v-for="l in exp.logs" :key="l.ts">{{ l.ts }}  {{ l.msg }}</pre>
            </div>
          </el-tab-pane>

          <!-- 曲线 -->
          <el-tab-pane label="曲线" name="curve">
            <div ref="chartEl" style="height:480px"></div>
          </el-tab-pane>

          <!-- 配置 -->
          <el-tab-pane label="配置" name="cfg">
            <ConfigPanel :params="exp.params" />
          </el-tab-pane>

          <!-- 调试 -->
          <el-tab-pane label="调试" name="debug">
            <div ref="editorBox" class="editor-box"></div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>
  </el-row>

  <!-- ========== 机械臂仿真区域 ========== -->
  <el-divider content-position="left">机械臂仿真 · RL 参数</el-divider>
  <el-row :gutter="20">
    <el-col :span="6">
      <el-card shadow="never">
        <el-form label-width="90px">
          <el-form-item label="RL 算法">
            <el-select v-model="simAlgo" style="width:150px">
              <el-option v-for="a in ['PPO','SAC','TD3']" :key="a" :label="a" :value="a" />
            </el-select>
          </el-form-item>
          <el-form-item label="学习率">
            <el-input-number v-model="lr" :min="1e-5" :max="1e-3" :step="1e-5" :precision="5" />
          </el-form-item>
          <el-form-item label="折扣因子 γ">
            <el-input-number v-model="gamma" :min="0.8" :max="0.999" :step="0.001" :precision="3" />
          </el-form-item>
          <el-form-item label="噪声 σ">
            <el-input-number v-model="sigma" :min="0" :max="1" :step="0.05" :precision="2" />
          </el-form-item>
        </el-form>
        <div style="display:flex;align-items:center;margin-top:12px;">
          <el-button type="primary" style="flex:1" @click="resetSim">重置</el-button>
          <el-switch v-model="armRunning" style="margin-left:12px" />
        </div>
      </el-card>
    </el-col>
    <el-col :span="18">
      <RobotModel :running="armRunning" :reset-flag="resetCounter" />
    </el-col>
  </el-row>

  <!-- ========== 弹窗区 ========== -->
  <DiagnosisDialog v-model="showDiag" />
  <el-dialog
    v-model="applying"
    title="GPU 申请中"
    width="420px"
    center
    close-on-click-modal="false"
    close-on-press-escape="false"
  >
    <el-result icon="info" title="已提交申请" sub-title="系统正在为你分配，请稍候…" />
  </el-dialog>
</template>

<script setup>
/* ------------ 基础 import ------------ */
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import { ElMessage } from 'element-plus'
import 'element-plus/es/components/message/style/css'
import * as echarts from 'echarts'
import * as monaco from 'monaco-editor'
import dayjs from 'dayjs'
import { useMainStore } from '../store'

/* ------------ 组件 import ------------ */
import HyperParamPanel from '../components/HyperParamPanel.vue'
import DiagnosisDialog from '../components/DiagnosisDialog.vue'
import ConfigPanel     from '../components/ConfigPanel.vue'
import RobotModel      from '../components/RobotModel.vue'

/* ========== 机械臂模拟参数 ========== */
const simAlgo = ref('PPO')
const lr      = ref(0.0003)
const gamma   = ref(0.99)
const sigma   = ref(0.2)
const armRunning  = ref(true)
const resetCounter= ref(0)
function resetSim(){
  ElMessage.success('仿真已重置')
  resetCounter.value++
}

/* ========== 设备 / 环境列表 ========== */
const devices = [
  { id:1, name:'RTX 3060 (免费)',          cheap:true  },
  { id:2, name:'T4 (免费)',                cheap:true  },
  { id:3, name:'RTX 4090 (申请)',          cheap:false },
  { id:4, name:'NVIDIA A100 (申请)',       cheap:false }
]
const envs = [
  { id:'cart', name:'Gym CartPole' },
  { id:'pong', name:'Atari Pong'   },
  { id:'ant',  name:'MuJoCo Ant'   }
]
const selDeviceId = ref(devices[0].id)
const selDevice   = computed(()=> devices.find(d=>d.id===selDeviceId.value))
const selEnv      = ref(envs[0].id)

/* ========== Pinia 实验数据 ========== */
const store = useMainStore()
const exp   = store.experiments[0]                                     // demo 用第 0 条
if(!exp.params)  exp.params  = { gamma:0.99, lr:1e-4, batch:128, eps:0.995, hidden:256, epoch:10 }
if(!exp.logs)    exp.logs    = []
if(!exp.rewards) exp.rewards = []
if(!exp.loss)    exp.loss    = []
if(!exp.epsilon) exp.epsilon = []
if(!exp.actor_lr)exp.actor_lr= []
if(!exp.status)  exp.status  = 'paused'
if(!exp.errors)  exp.errors  = []

/* ========== 左侧按钮动作 ========== */
function startCheap(){
  if(exp.status!=='running'){
    exp.status='running'
    store.toggleExperiment(exp.id,{status:'running'})
  }
}
const applying = ref(false)
function applyGPU(){
  applying.value=true
  setTimeout(()=>{
    applying.value=false
    startCheap()
    exp.logs.push({ ts:new Date().toLocaleTimeString(), msg:`已获批 ${selDevice.value.name}` })
  },3000)
}
function toggleRun(){
  exp.status = exp.status==='running' ? 'paused' : 'running'
  store.toggleExperiment(exp.id,{status:exp.status})
}
function updateParams(p){ store.toggleExperiment(exp.id,{params:p}) }

/* ========== 实验循环 (模拟数据流) ========== */
let timer=null
const lrPool=[1e-4,5e-5,8e-5]
function startLoop(){
  clearInterval(timer)
  timer=setInterval(async()=>{
    if(exp.status!=='running') return
    const idx = exp.rewards.length
    const rew = +(Math.random()*250).toFixed(2)
    const loss= +(Math.random()*0.2).toFixed(3)
    const eps = +(exp.params.eps**(idx/50)).toFixed(4)
    const lr  = lrPool[Math.floor(idx/50)%3]

    exp.rewards .push(rew)
    exp.loss    .push(loss)
    exp.epsilon .push(eps)
    exp.actor_lr.push(lr)
    exp.logs.push({ ts:new Date().toLocaleTimeString(), msg:`reward=${rew} loss=${loss}` })

    if(Math.random()<0.02){ exp.errors.push('CUDA out of memory'); showDiag.value=true }

    await nextTick()
    logBox.value?.scrollTo({ top:logBox.value.scrollHeight })
    updateCurve()
  },1500)
}

/* ========== ECharts 曲线 ========== */
const chartEl = ref(null)
let chart=null
function initCurve(){
  chart = echarts.init(chartEl.value)
  chart.setOption({
    grid:{ left:50,right:60,top:40,bottom:60 },
    tooltip:{ trigger:'axis' },
    legend:{ bottom:0, icon:'roundRect', itemWidth:18, itemHeight:8 },
    xAxis:{ type:'category', boundaryGap:false },
    yAxis:[
      { type:'value', name:'reward', nameGap:22, axisLine:{lineStyle:{color:'#409eff'}} },
      { type:'value', name:'loss / ε / lr', nameGap:30, min:0, max:1, position:'right',
        axisLine:{lineStyle:{color:'#f56c6c'}} }
    ],
    series:[
      { name:'reward',      type:'line', yAxisIndex:0, smooth:true, showSymbol:false,
        lineStyle:{color:'#409eff',width:2}, itemStyle:{color:'#409eff'} },
      { name:'loss',        type:'line', yAxisIndex:1, smooth:true, showSymbol:false,
        lineStyle:{color:'#f56c6c',width:2}, itemStyle:{color:'#f56c6c'} },
      { name:'ε-greedy',    type:'line', yAxisIndex:1, smooth:true, showSymbol:false,
        lineStyle:{color:'#67c23a',width:2}, itemStyle:{color:'#67c23a'} },
      { name:'actor_lr×1e4',type:'line', yAxisIndex:1, smooth:true, showSymbol:false,
        lineStyle:{color:'#a347ff',width:2}, itemStyle:{color:'#a347ff'} }
    ]
  })
}
function updateCurve(){
  if(!chart) return
  const xs = exp.rewards.map((_,i)=>i)
  chart.setOption({
    xAxis:{ data:xs },
    series:[
      { data:exp.rewards },
      { data:exp.loss },
      { data:exp.epsilon },
      { data:exp.actor_lr.map(v=>v*1e4) }
    ]
  })
  chart.resize()
}

/* ========== Monaco Editor ========== */
const editorBox = ref(null)
let editor=null
const torchDemo=`import torch, torch.nn as nn
class Net(nn.Module):
    def __init__(self): super().__init__()
    def forward(self,x): return x
print('hello torch')
`
function initEditor(){
  if(editor) return
  editor = monaco.editor.create(editorBox.value,{
    value:torchDemo,
    language:'python',
    theme:'vs-dark',
    automaticLayout:true,
    minimap:{enabled:false},
    fontSize:14,
    scrollBeyondLastLine:false
  })
}

/* ========== Tab & 诊断弹窗 ========== */
const tab = ref('log')
const showDiag = ref(false)
const logBox   = ref(null)

/* ========== 监听 Tab 切换 ========== */
watch(tab, async t=>{
  if(t==='curve'){ await nextTick(); updateCurve() }
  if(t==='debug'){ await nextTick(); initEditor() }
})

/* ========== 生命周期 ========== */
onMounted(()=>{
  initCurve()
  startLoop()
  if(tab.value==='debug') initEditor()
})
onUnmounted(()=>{
  clearInterval(timer)
  editor?.dispose()
})
</script>

<style scoped>
.mt-4{ margin-top:24px }

/* 日志窗口 */
.log-box{
  height:480px;
  overflow-y:auto;
  background:#111;
  color:#39ff14;
  padding:12px;
  font-family:monospace;
}

/* Monaco 编辑器容器 */
.editor-box{
  height:480px;
  border:1px solid #dcdfe6;
  border-radius:4px;
  overflow:hidden;
}

/* 机械臂参数面板间距 */
.el-input-number{ width:150px }

/* 其他样式保持原样 */
</style>
