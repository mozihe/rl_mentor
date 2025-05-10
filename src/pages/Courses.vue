<template>
  <!-- ─────────── 顶部工具栏 ─────────── -->
  <div class="toolbar">
    <!-- 模式切换 -->
    <el-radio-group v-model="mode" size="small">
      <el-radio-button label="all">所有课程</el-radio-button>
      <el-radio-button label="mine">我的课程</el-radio-button>
    </el-radio-group>

    <!-- 难度过滤：只在列表视图里显示 -->
    <el-radio-group
      v-if="view === 'list' || mode === 'all'"
      v-model="filter"
      size="small"
      class="level-filter"
      style="margin-left: 16px"
    >
      <el-radio-button label="全部" />
      <el-radio-button label="入门" />
      <el-radio-button label="进阶" />
      <el-radio-button label="硬核" />
    </el-radio-group>

    <div style="flex: 1"></div>

    <!-- 视图选择：仅“我的课程”可见 -->
    <el-radio-group
      v-if="mode === 'mine'"
      v-model="view"
      size="small"
      style="width: 120px"
    >
      <el-radio-button label="列表" value="list" />
      <el-radio-button label="路线图" value="roadmap" />
    </el-radio-group>
  </div>

  <!-- ─────────── 列表视图 ─────────── -->
  <div v-if="view === 'list' || mode === 'all'">
    <el-row :gutter="20">
      <el-col
        v-for="c in visibleCourses"
        :key="c.id"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
      >
        <CourseCard :course="c" />
      </el-col>
    </el-row>
  </div>

  <!-- ─────────── 路线图视图 ─────────── -->
  <div v-else class="graph-box">
    <div ref="netEl" class="full" />
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Network } from 'vis-network'
import { useMainStore } from '../store'
import CourseCard from '../components/CourseCard.vue'

/* ================== 状态 ================== */
const mode   = ref('all')   // all | mine
const view   = ref('list')  // list | roadmap（仅 mine 用）
const filter = ref('全部')  // 入门 | 进阶 | 硬核

/* ================== 课程数据 ================== */
const store        = useMainStore()
const allCourses   = computed(() => store.courses)
const myCourses    = computed(() => store.courses.filter(c => c.enrolled))

const filtered = (courses) =>
  filter.value === '全部'
    ? courses
    : courses.filter((c) => c.level === filter.value)

const visibleCourses = computed(() =>
  mode.value === 'all' ? filtered(allCourses.value) : filtered(myCourses.value)
)

/* ================== 路线图 ================== */
const router  = useRouter()
const netEl   = ref(null)
let   network = null

function buildNetwork () {
  if (network) { network.destroy(); network = null }

  const colors = { 入门: '#67c23a', 进阶: '#e6a23c', 硬核: '#f56c6c' }

  const nodes = myCourses.value.map((c, idx) => ({
    id: c.id,
    label: c.title,
    course: c,
    x: idx * 350,
    y: 0,
    fixed: true,
    shape: 'box',
    widthConstraint: { minimum: 220 },
    font: { size: 14, color: '#000' },
    color: { background: '#fff', border: colors[c.level] }
  }))

  const edges = nodes.slice(1).map((n, i) => ({ from: nodes[i].id, to: n.id }))

  network = new Network(
    netEl.value,
    { nodes, edges },
    {
      interaction: { dragNodes: false, dragView: true, zoomView: true },
      edges: { arrows: { to: true }, color: '#909399', width: 2 },
      physics: false
    }
  )

  network.on('click', (p) => {
    if (p.nodes.length) {
      const n = network.body.data.nodes.get(p.nodes[0])
      n.course && router.push(`/course/${n.course.id}`)
    }
  })
}

/* ================== 监听切换 ================== */
watch([mode, view, filter], () => {
  // 离开路线图时销毁网络释放内存
  if (network && (mode.value !== 'mine' || view.value !== 'roadmap')) {
    network.destroy(); network = null
  }

  // 进入路线图时重建
  if (mode.value === 'mine' && view.value === 'roadmap') {
    nextTick(buildNetwork)
  }
})

onUnmounted(() => network && network.destroy())
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.level-filter :deep(.el-radio-button__inner) {
  padding: 4px 12px;
}

.graph-box {
  height: calc(100vh - 180px);
  border: 2px solid #dcdfe6;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.full {
  width: 100%;
  height: 100%;
}
</style>
