<template>
    <el-header class="back-row">
      <el-button link @click="$router.back()">← 返回</el-button>
    </el-header>
  
    <el-main>
      <el-row :gutter="24">
        <!-- 左列 -->
        <el-col :span="17" :xs="24">
          <h2 class="title">{{ course?.title }} · {{ currentChapter?.title }}</h2>
  
          <el-button
            v-if="course && !course.enrolled"
            type="primary"
            style="margin-bottom:24px"
            @click="joinCourse"
          >开始学习</el-button>
  
          <div class="pill-bar">
            <el-tag
              v-for="(p,k) in pillList"
              :key="k"
              effect="dark"
              :type="pane===k?'primary':'info'"
              size="large"
              @click="pane=k"
            >{{ p }}</el-tag>
          </div>
  
          <component :is="paneComp" :course="course" :chapter="currentChapter" />
        </el-col>
  
        <!-- 右列 -->
        <el-col :span="7" :xs="24">
          <el-tabs v-model="sideTab">
            <el-tab-pane label="目录" name="toc">
              <el-tree
                :data="toc"
                node-key="id"
                default-expand-all
                :current-node-key="currentNodeId"
                highlight-current
                @node-click="select"
              >
                <template #default="{ data }">
                  <span>{{ data.title }}</span>
                  <el-icon v-if="data.done" style="margin-left:4px">
                    <CircleCheckFilled/>
                  </el-icon>
                </template>
              </el-tree>
            </el-tab-pane>
  
            <el-tab-pane label="讨论" name="discuss">
              <el-card v-for="c in comments" :key="c.id" shadow="never" class="comment">
                <template #header>
                  <span class="comment-user">{{ c.user }}</span>
                  <span class="comment-time">{{ c.time }}</span>
                </template>
                <p>{{ c.text }}</p>
              </el-card>
              <el-empty v-if="!comments.length" description="暂无讨论"/>
            </el-tab-pane>
  
            <el-tab-pane label="笔记" name="note">
              <el-card v-for="n in notes" :key="n.id" shadow="never" class="note-card">
                <template #header>{{ n.title }}</template>
                <p>{{ n.content }}</p>
              </el-card>
              <el-empty v-if="!notes.length" description="暂无笔记"/>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-main>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { CircleCheckFilled } from '@element-plus/icons-vue'
  import { useMainStore } from '../store'
  
  /* ── 课程数据 ── */
  const route = useRoute()
  const store = useMainStore()
  const course = computed(() =>
    store.courses.find(c => String(c.id) === String(route.params.id))
  )
  
  /* ── 目录 ── */
  const toc = computed(() => course.value?.toc || [])
  const flat = computed(() => toc.value.flatMap(n=>[n,...(n.children||[])]))
  const currentNodeId = ref(toc.value[0]?.id || null)
  const currentChapter = computed(() => flat.value.find(n=>n.id===currentNodeId.value)||{})
  function select(node){ currentNodeId.value=node.id }
  watch(toc,()=> currentNodeId.value = toc.value[0]?.id || null)
  
  /* ── 左侧 4 标签 ── */
  const pane = ref('intro')
  const pillList = { intro:'章节介绍', video:'教学视频', quiz:'课程测验', assn:'课程作业' }
  import ChapterIntroPane from './parts/ChapterIntroPane.vue'
  import VideoPane        from './parts/VideoPane.vue'
  import QuizPane         from './parts/QuizPane.vue'
  import AssignmentPane   from './parts/AssignmentPane.vue'
  const paneComp = computed(() => ({
    intro: ChapterIntroPane,
    video: VideoPane,
    quiz:  QuizPane,
    assn:  AssignmentPane
  }[pane.value]))
  
  /* ── 右侧讨论/笔记 ── */
  const sideTab = ref('toc')
  const comments = [
    { id:1,user:'Alice',text:'Bellman 推导那段讲得通俗易懂~',time:'1 天前' },
    { id:2,user:'Bob',  text:'γ=0.99 的意义原来是这样，学到了！',time:'3 小时前' }
  ]
  const notes = [
    { id:1,title:'理解 γ',content:'γ 越小越贪心，越大越看长远。' }
  ]
  
  /* 加入课程 */
  function joinCourse(){
    course.value.enrolled=true
    course.value.progress=0
  }
  </script>
  
  <style scoped>
  .back-row{ border-bottom:1px solid #dcdfe6 }
  .title{ font-weight:600;font-size:1.5rem;margin-bottom:24px }
  .pill-bar{ margin-bottom:24px }
  .pill-bar :deep(.el-tag){ cursor:pointer;margin-right:8px }
  .comment-user{font-weight:600}
  .comment-time{float:right;font-size:12px;color:#999}
  .comment{margin-bottom:12px}
  .note-card{margin-bottom:12px}
  </style>
  