<template>
    <!-- 整张卡片可点击 -->
    <el-card
      shadow="hover"
      class="card"
      @click="$emit('open', post)"
    >
      <!-- 1️⃣ 标题 -->
      <h4 class="title">{{ post.title }}</h4>

          <!-- 标签展示 -->
          <el-tag
      v-if="post.tag"
      :type="tagColors[post.tag] || 'info'"
      size="small"
      style="margin-bottom: 6px;"
    >
      {{ post.tag }}
    </el-tag>

  
      <!-- 2️⃣ 预览（自动截断） -->
      <p class="preview">{{ preview }}</p>
  
      <!-- 3️⃣ 作者 + 点赞，永远贴底 -->
      <div class="meta">
        <span>{{ post.author }}</span>
  
        <el-button
          link
          size="small"
          @click.stop="like"
        >
          👍 {{ likes }}
        </el-button>
      </div>
    </el-card>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const props = defineProps({ post: Object })
  const likes = ref(props.post.likes || 0)
  
  const tagColors = {
  教学贴: 'success',
  求助贴: 'danger',
  讨论贴: 'info',
  经验贴: 'warning'
}
  /* 60 字截断显示 */
  const preview =
    props.post.content.length > 60
      ? props.post.content.slice(0, 60) + '…'
      : props.post.content
  
  function like() {
    likes.value++
    props.post.likes = likes.value
  }
  </script>
  
  <style scoped>
  /* 整卡定高，flex 垂直分区 */
  .card {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    height: 160px;          /* ← 你可按需再调 */
  }
  
  /* 标题最多两行，超出省略 */
  .title {
    margin: 0 0 6px;
    font-weight: 600;
    line-height: 1.3;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  
  /* 预览段文字占位，flex:1 让 meta 顶到底 */
  .preview {
    color: #666;
    font-size: 0.85rem;
    line-height: 1.3;
    overflow: hidden;
    flex: 1;
  }
  
  /* 作者 / 点赞 放卡片底部 */
  .meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    margin-top: auto;      /* 关键：推到底部 */
  }
  </style>
  