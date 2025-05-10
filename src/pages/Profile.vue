<template>
  <div class="page">
    <!-- ─── 顶部信息卡 ─── -->
    <el-card shadow="hover">
      <div class="card-row">
        <!-- ① 个人信息 (含打卡) -->
        <section class="info-area">
          <div class="header">
            <el-avatar :src="avatar" size="64" />
            <span class="uname">{{ user.name }}</span>
            <el-button link icon="Edit" @click="settings = true">编辑资料</el-button>
          </div>

          <el-descriptions direction="vertical" :column="2" size="small">
            <el-descriptions-item label="积分">{{ user.points }}</el-descriptions-item>
            <el-descriptions-item label="帖子数">{{ store.posts.length }}</el-descriptions-item>
            <el-descriptions-item label="评论数">{{ myComments }}</el-descriptions-item>
            <el-descriptions-item label="获赞">{{ myLikes }}</el-descriptions-item>
          </el-descriptions>

          <div class="checkin-header">打卡信息</div>
          <div class="checkin-grid">
            <div
              v-for="(d,i) in checkins"
              :key="i"
              :class="['cell', 'lv'+d]"
            />
          </div>
        </section>

        <!-- ② 技术栈饼图 -->
        <section class="pie-area">
          <div class="pie-header">技术栈分布</div>
          <div ref="pieEl" class="pie-chart" />
        </section>

        <!-- ③ 勋章 -->
        <section class="badge-area">
          <BadgeWall :badges="badges" />
        </section>
      </div>
    </el-card>

    <!-- ─── 下方三列 ─── -->
    <div class="triple">
      <!-- 我的帖子 -->
      <el-card shadow="hover">
        <template #header>我的帖子</template>
        <div class="masonry">
          <PostCard v-for="p in randomPosts" :key="p.id" :post="p" @open="open" />
        </div>
      </el-card>

      <!-- 点过赞 -->
      <el-card shadow="hover">
        <template #header>点过赞的帖子</template>
        <div class="masonry">
          <PostCard v-for="p in likedPosts" :key="p.id" :post="p" @open="open" />
        </div>
      </el-card>

      <!-- 我的课程（内部滚动） -->
      <el-card shadow="hover">
        <template #header>我的课程</template>
        <div class="course-scroll">
          <CourseCard
            v-for="c in myCourses"
            :key="c.id"
            :course="c"
            style="margin-bottom:12px"
          />
        </div>
      </el-card>
    </div>

    <!-- 弹窗 -->
    <PostDialog     v-model="postDialog" :post="current" />
    <SettingsDialog v-model="settings" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated, watch } from 'vue'
import * as echarts from 'echarts'
import { useMainStore } from '../store'
import PostCard       from '../components/PostCard.vue'
import CourseCard     from '../components/CourseCard.vue'
import PostDialog     from '../components/PostDialog.vue'
import BadgeWall      from '../components/BadgeWall.vue'
import SettingsDialog from '../components/SettingsDialog.vue'

/* ---------- 数据 ---------- */
const store = useMainStore()
const user  = store.user
const avatar = computed(() => user.avatar || 'https://api.dicebear.com/6.x/fun-emoji/svg')

/* 我的课程 */
const myCourses = computed(() => store.courses.filter(c => c.enrolled))

/* 帖子与统计 */
const randomPosts = computed(() => [...store.posts].sort(()=>0.5-Math.random()).slice(0,3))
const likedPosts  = computed(() => store.posts.slice(0,6))
const myComments  = computed(() =>
  store.posts.reduce((s,p)=> s + p.comments.filter(c=>c.user===user.name).length ,0)
)
const myLikes = computed(() =>
  store.posts.reduce((s,p)=> s + (p.likes||0),0)
)

/* 勋章示例 */
const badges=[
  { id:1,name:'首贴发布',img:'https://img.icons8.com/fluency/48/medal.png' },
  { id:2,name:'人气之星',img:'https://img.icons8.com/fluency/48/trophy.png' },
  { id:3,name:'训练狂人',img:'https://img.icons8.com/fluency/48/brain.png' },
  { id:4,name:'热心解答',img:'https://img.icons8.com/fluency/48/helping-hand.png' }
]

/* 技术栈饼图 */
const pieEl = ref(null)
let chart=null
const techStack = ref([
  { name:'Python', value:40 },
  { name:'C++',    value:30 },
  { name:'Vue',    value:20 },
  { name:'其他',    value:10 }
])
function renderPie(){
  if(!pieEl.value) return
  chart ||= echarts.init(pieEl.value)
  chart.setOption({
    tooltip:{ trigger:'item' },
    series:[{
      type:'pie',
      radius:['55%','75%'],
      data:techStack.value,
      label:{ formatter:'{b}: {d}%' }
    }]
  })
  chart.resize()
}
onMounted(renderPie)
onActivated(renderPie)
watch(techStack,renderPie)

/* 打卡格子数据 */
const checkins = Array.from({length:52*7},()=> Math.floor(Math.random()*5))

/* 弹窗控制 */
const postDialog = ref(false)
const current    = ref(null)
function open(p){ current.value=p; postDialog.value=true }
const settings   = ref(false)
</script>

<style scoped>
.page{ display:flex; flex-direction:column; gap:24px }

/* 顶部三列 */
.card-row{ display:flex; gap:24px }
.info-area,.pie-area,.badge-area{
  flex:1 1 33%; display:flex; flex-direction:column
}

/* 个人信息 */
.header{ display:flex; align-items:center; gap:12px; margin-bottom:12px }
.uname{ font-weight:600; font-size:1.1rem }

/* 打卡热图 */
.checkin-header{ font-weight:600; margin:12px 0 6px }
.checkin-grid{
  display:grid;
  grid-template-columns:repeat(52,10px);
  grid-auto-rows:10px;
  gap:2px;
}
.cell{ width:10px;height:10px;border-radius:2px;background:#ebedf0 }
.lv1{ background:#c6e48b }
.lv2{ background:#7bc96f }
.lv3{ background:#239a3b }
.lv4{ background:#196127 }

/* 技术栈饼图 */
.pie-area{ align-items:center }
.pie-header{ font-weight:bold; font-size:1.1rem; margin-bottom:8px }
.pie-chart{ width:100%; height:320px }

/* 勋章列 */
.badge-area{ border-left:1px solid #e5e6eb; padding-left:24px }

/* 下方三列 */
.triple{ display:flex; gap:24px }
.triple>*{ flex:1 }

/* 帖子 Masonry */
.masonry{ column-count:2; column-gap:16px }
.masonry :deep(.card){ break-inside:avoid; margin-bottom:16px }

/* 课程列表滚动 */
.course-scroll{
  max-height:490px;   /* 课程区可见高度 */
  overflow-y:auto;
  padding-right:4px;
}

/* 响应式 */
@media (max-width:900px){
  .card-row{ flex-direction:column }
  .badge-area{ border-left:none; padding-left:0 }
  .triple{ flex-direction:column }
  .masonry{ column-count:1 }
}
</style>
