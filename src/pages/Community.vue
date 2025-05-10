<template>
    <div class="page">
      <!-- 左：瀑布流列表 -->
      <section class="feed">
        <!-- 顶部：搜索框 + 标签筛选 -->
        <div style="margin-bottom:12px;">
          <el-input
            v-model="keyword"
            prefix-icon="Search"
            placeholder="搜索标题 / 作者 / 标签…"
            clearable
            size="small"
            style="width:260px; margin-right: 12px;"
          />
  
          <!-- 标签筛选器 -->
          <el-select
            v-model="selectedTags"
            multiple
            collapse-tags
            collapse-tags-tooltip
            placeholder="筛选标签"
            size="small"
            style="width: 260px;"
          >
            <el-option label="教学贴" value="教学贴" />
            <el-option label="求助贴" value="求助贴" />
            <el-option label="讨论贴" value="讨论贴" />
            <el-option label="经验贴" value="经验贴" />
          </el-select>
        </div>
  
        <!-- Masonry 用 CSS columns -->
        <div class="masonry">
          <PostCard
            v-for="p in visible"
            :key="p.id"
            :post="p"
            @open="open"
          />
        </div>
  
        <!-- 无限滚动占位 -->
        <div ref="sentinel" style="height:1px"></div>
      </section>
  
      <!-- 右：今日热点 + 发布按钮 -->
      <aside class="sidebar">
  <section class="hotlist-section">
    <h4>🔥 今日热点</h4>
    <HotList :posts="hotToday" @open="open" />
  </section>

  <section class="hotlist-section">
    <h4>📈 本周点赞榜</h4>
    <HotList :posts="hotLiked" @open="open" />
  </section>

  <section class="hotlist-section">
    <h4>🆕 最新发布</h4>
    <HotList :posts="hotNew" @open="open" />
  </section>

  <el-button
    type="primary"
    icon="Edit"
    class="publish-btn"
    @click="publishVisible = true"
  >写帖子</el-button>
</aside>

  
      <!-- 弹窗组件 -->
      <PostDialog v-model="postDialog" :post="current" />
      <PostPublishDialog v-model="publishVisible" />
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useMainStore } from '../store'
  import PostCard from '../components/PostCard.vue'
  import PostDialog from '../components/PostDialog.vue'
  import HotList from '../components/HotList.vue'
  import PostPublishDialog from '../components/PostPublishDialog.vue'
  
  /* 数据 & 过滤 */
  const store = useMainStore()
  const keyword = ref('')
  const selectedTags = ref([]) // ← 新增：勾选的标签
  const page = ref(1)
  const pageSize = 12

const commentTemplates = [
  '写得真不错，学到了！',
  '这个点子挺有意思，能详细说说吗？',
  '同感！我也遇到过类似的问题。',
  '太强了，膜拜大佬！',
  '新手求带，讲得好清楚！',
]

// 随机用户昵称
const usernames = ['小明', '小红', '小蓝', '小绿', '小黑']

// 随机生成 1-2 条评论（正确格式！）
function generateComments(postId) {
  const n = Math.floor(Math.random() * 2) + 1 // 1或2条
  const comments = []
  for (let i = 0; i < n; i++) {
    const body = commentTemplates[Math.floor(Math.random() * commentTemplates.length)]
    const user = usernames[Math.floor(Math.random() * usernames.length)]
    const ts = new Date(Date.now() - Math.random() * 3600 * 1000).toLocaleTimeString() // 随机过去一小时内时间
    comments.push({ user, body, ts })
  }
  return comments
}

// 给id 1~5的帖子生成评论
store.posts.forEach(p => {
    p.comments = generateComments(p.id)

})

  
  const filtered = computed(() => {
    return store.posts.filter(p => {
      const matchKeyword =
        !keyword.value ||
        p.title.includes(keyword.value) ||
        p.author.includes(keyword.value) ||
        p.tag?.includes(keyword.value)
      const matchTag =
        selectedTags.value.length === 0 ||
        selectedTags.value.includes(p.tag)
      return matchKeyword && matchTag
    })
  })
  
  const visible = computed(() =>
    filtered.value.slice(0, page.value * pageSize)
  )
  
  /* 无限滚动 */
  const sentinel = ref(null)
  onMounted(() => {
    new IntersectionObserver(e => {
      if (e[0].isIntersecting) page.value++
    }).observe(sentinel.value)
  })
  
  /* 帖子弹窗控制 */
  const postDialog = ref(false)
  const current    = ref(null)
  function open(p) {
    current.value = p
    postDialog.value = true
  }
  
  /* 发布弹窗控制 */
  const publishVisible = ref(false)
  </script>
  
  <style scoped>
  .page{
    display:grid;
    grid-template-columns: 1fr 260px;
    gap:20px;
  }
  
  /* Masonry：仅两列示例，可自行调 columns 数 */
  .masonry{
    column-count: 2;
    column-gap: 16px;
  }
  .masonry :deep(.card){
    break-inside: avoid;
    margin-bottom: 16px;
  }
  
  .sidebar {
  position: fixed;
  top: 80px; /* 距离浏览器顶部一点，避免挡到顶部导航栏 */
  right: 20px; /* 靠右一点点 */
  width: 240px; /* 固定宽度，注意和你的 grid 布局协调 */
  max-height: calc(100vh - 100px); /* 窗口高度减去上下留白 */
  overflow-y: auto;
  background: #fff; /* 可选，加个背景避免透明穿透 */
  padding: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1); /* 可选，提点质感 */
  border-radius: 8px; /* 圆角好看一点 */
}

  
  .publish-btn{
    margin-top: 16px; width: 100%;
  }
  
  @media (max-width: 900px){
    .page{ grid-template-columns: 1fr; }
    .sidebar{ position:static; }
    .masonry{ column-count: 1; }
  }
  </style>
  