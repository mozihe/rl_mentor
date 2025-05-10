<template>
  <div class="page-wrapper">
    <!-- ───────── 顶部统计磁贴 ───────── -->
    <el-row :gutter="20" style="margin-bottom:12px">
      <el-col :span="6" v-for="s in stats" :key="s.label">
        <StatsTile v-bind="s" />
      </el-col>
    </el-row>

    <!-- ───────── 第一排 ───────── -->
    <el-row :gutter="20" style="margin-bottom:24px">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>课程平均完成度</template>
          <div ref="progressEl" style="height:260px"></div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>GPU 占用分布</template>
          <div ref="gpuEl" style="height:260px"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- ───────── 第二排 ───────── -->
    <el-row :gutter="20" style="margin-bottom:24px">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>最近 14 天学习时长 (h)</template>
          <div ref="studyEl" style="height:260px"></div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>实验状态分布</template>
          <div ref="expPieEl" style="height:260px"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- ───────── 第三排 ───────── -->
    <el-row :gutter="20">
      <!-- Top5 -->
      <el-col :span="16">
        <el-card shadow="hover" style="height:300px">
          <template #header>课程完成度 Top 5</template>
          <div ref="topBarEl" style="height:240px"></div>
        </el-card>
      </el-col>

      <!-- 虚拟机环境 -->
      <el-col :span="8">
        <el-card shadow="hover" class="vm-card" style="height:300px">
          <template #header>虚拟机环境</template>

          <ul class="env-list">
            <li><b>CPU：</b>{{ env.cpu }}</li>
            <li><b>GPU：</b>{{ env.gpu }}</li>
            <li><b>磁盘：</b>{{ env.disk }} GB</li>
            <li><b>CUDA：</b>{{ env.cuda }}</li>
            <li><b>Python：</b>{{ env.python }}</li>

          </ul>

          <el-button
            class="cfg-btn"
            type="primary"
            size="small"
            @click="cfgOpen = true"
          >一键配置环境</el-button>



        </el-card>
      </el-col>
    </el-row>

    <!-- ───────── 环境配置弹窗 ───────── -->
    <el-dialog v-model="cfgOpen" title="一键配置环境" width="440px">
      <el-form :model="cfgForm" label-width="120px">
        <el-form-item label="Python 版本">
          <el-select v-model="cfgForm.python" style="width:200px">
            <el-option
              v-for="v in ['3.8','3.9','3.10','3.11']"
              :key="v"
              :label="v"
              :value="v"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Ubuntu 版本">
          <el-select v-model="cfgForm.ubuntu" style="width:200px">
            <el-option v-for="v in ['20.04','22.04']" :key="v" :label="v" :value="v" />
          </el-select>
        </el-form-item>

        <el-form-item label="附带 PyTorch">
          <el-switch v-model="cfgForm.torch" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="cfgOpen = false">取消</el-button>
        <el-button type="primary" @click="applyCfg">应用</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
/* ─────────── import ─────────── */
import { ref, computed, onMounted, onActivated, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import { useMainStore } from '../store'
import StatsTile from '../components/StatsTile.vue'

/* ─────────── Pinia store ─────────── */
const store = useMainStore()

/* ─────────── 统计磁贴数据 ─────────── */
const stats = computed(() => [
  { label: '总课程',     count: store.courses.length,                                    icon: '📚', color: '#42b983' },
  { label: '已完成课程', count: store.courses.filter(c => c.progress >= 1).length,       icon: '✅', color: '#67c23a' },
  { label: '运行中实验', count: store.experiments.filter(e => e.status === 'running').length, icon: '⚙️', color: '#409eff' },
  { label: '累计积分',   count: store.user?.points ?? 0,                                 icon: '🏆', color: '#e6a23c' }
])

/* ─────────── 虚拟机环境 (前端模拟) ─────────── */
const env = ref({
  cpu: 'Intel Xeon E5-2680 v4 × 2',
  gpu: 'NVIDIA A100 40GB',
  disk: 500,
  cuda: '12.4',
  python: '3.10'
})

/* 每 5 秒随机波动磁盘容量 */
let envTimer = null
function tickEnv () {
  env.value.disk = 480 + Math.floor(Math.random() * 40) // 480‒520 GB
}
onMounted(() => (envTimer = setInterval(tickEnv, 5000)))
onUnmounted(() => clearInterval(envTimer))

/* ─────────── 环境配置弹窗 ─────────── */
const cfgOpen = ref(false)
const cfgForm = ref({
  python: '3.10',
  ubuntu: '22.04',
  torch: true
})
function applyCfg () {
  env.value.python = cfgForm.value.python
  env.value.cuda = cfgForm.value.torch ? '12.4' : 'N/A'
  cfgOpen.value = false
}

/* ─────────── DOM refs ─────────── */
const progressEl = ref(null)
const gpuEl = ref(null)
const studyEl = ref(null)
const expPieEl = ref(null)
const topBarEl = ref(null)

/* ─────────── ECharts 实例 ─────────── */
let progChart, gpuChart, studyChart, expChart, barChart

/* ---------- 1. 课程平均完成度环形 ---------- */
function renderProgress () {
  const avg = (
    store.courses.reduce((s, c) => s + c.progress, 0) / store.courses.length * 100
  ).toFixed(1)

  progChart = echarts.init(progressEl.value)
  progChart.setOption({
    series: [{
      type: 'pie',
      radius: ['72%', '90%'],
      data: [
        { value: avg, name: '完成',   itemStyle: { color: '#67c23a' } },
        { value: 100 - avg, name: '未完成', itemStyle: { color: '#ebeef5' } }
      ],
      label: { show: true, formatter: '{d}%', fontSize: 20, color: '#303133' }
    }]
  })
}

/* ---------- 2. GPU 占用饼图 ---------- */
function renderGpuPie () {
  const gpuCounts = store.experiments.reduce((m, e) => {
    m[e.gpu] = (m[e.gpu] || 0) + 1
    return m
  }, {})
  gpuChart = echarts.init(gpuEl.value)
  gpuChart.setOption({
    legend: { bottom: 0 },
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: ['55%', '75%'],
      center: ['50%', '45%'],
      label: { show: false },
      data: Object.entries(gpuCounts).map(([k, v]) => ({ name: k, value: v }))
    }]
  })
}

/* ---------- 3. 学习时长折线 ---------- */
function renderStudy () {
  const dates = Array.from({ length: 14 }, (_, i) =>
    dayjs().subtract(13 - i, 'day').format('MM-DD')
  )
  const hours = dates.map(() => +(Math.random() * 3 + 1).toFixed(1))

  studyChart = echarts.init(studyEl.value)
  studyChart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: dates },
    yAxis: { type: 'value' },
    series: [{
      type: 'line',
      data: hours,
      smooth: true,
      areaStyle: {}
    }]
  })
}

/* ---------- 4. 实验状态饼图 ---------- */
function renderExpStatus () {
  const cnt = store.experiments.reduce((m, e) => {
    m[e.status] = (m[e.status] || 0) + 1
    return m
  }, {})
  expChart = echarts.init(expPieEl.value)
  expChart.setOption({
    legend: { bottom: 0 },
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: ['50%', '75%'],
      data: Object.entries(cnt).map(([k, v]) => ({ name: k, value: v }))
    }]
  })
}

/* ---------- 5. Top 5 条形 ---------- */
function renderTopBar () {
  const palette = ['#f56c6c', '#e6a23c', '#67c23a', '#a347ff', '#ff7aa8']
  const top = [...store.courses]
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 5)
    .reverse()

  barChart = echarts.init(topBarEl.value)
  barChart.setOption({
    grid: { left: 100, right: 20, top: 10, bottom: 30 },
    xAxis: { type: 'value', max: 1 },
    yAxis: { type: 'category', data: top.map(c => c.title) },
    tooltip: { formatter: p => `${p.name}: ${(p.value * 100).toFixed(0)}%` },
    series: [{
      type: 'bar',
      data: top.map((c, i) => ({
        value: c.progress,
        itemStyle: { color: palette[i] }
      })),
      label: {
        show: true,
        formatter: ({ value }) => `${(value * 100).toFixed(0)}%`
      }
    }]
  })
}

/* ─────────── 生命周期 ─────────── */
onMounted(() => {
  renderProgress()
  renderGpuPie()
  renderStudy()
  renderExpStatus()
  renderTopBar()
})
onActivated(() => {
  [progChart, gpuChart, studyChart, expChart, barChart].forEach(c => c?.resize())
})
onUnmounted(() => {
  [progChart, gpuChart, studyChart, expChart, barChart].forEach(c => c?.dispose())
})
</script>

<style scoped>
.page-wrapper { padding: 0 4px }

/* 虚拟机卡片布局 */
.vm-card :deep(.el-card__body){
  display: flex;
  flex-direction: column;
  height: 100%;
}
.env-list{
  list-style: none;
  padding: 0;
  margin: 0;
  line-height: 1.6;
}
.cfg-btn{
  margin:16px 500px 0 0;     /* 关键：把按钮挤到底部 */
}
</style>
