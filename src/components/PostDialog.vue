<template>
  <el-dialog
    v-model="visible"
    :title="post?.title"
    width="720px"
    top="6vh"
    destroy-on-close
  >
    <!-- ========== 标签 + 作者 ========== -->
    <div class="sub-meta">
      <el-tag
        v-if="post.tag"
        :type="tagColors[post.tag] || 'info'"
        size="small"
        style="margin-right:8px"
      >
        {{ post.tag }}
      </el-tag>
      <span class="author">作者 · {{ post.author }}</span>
    </div>

    <!-- ========== 正文（含代码高亮） ========== -->
    <div class="content" v-html="formatted" />

    <!-- ========== 点赞 + 评论数 ========== -->
    <div class="meta">
      <el-button link @click="like">👍 {{ post.likes }}</el-button>
      <span>评论 · {{ post.comments.length }}</span>
    </div>

    <!-- ========== 评论列表 ========== -->
    <el-scrollbar height="240px" class="comment-list">
      <el-card
        v-for="c in post.comments"
        :key="c.ts"
        shadow="never"
        class="comment"
      >
        <div class="c-author">{{ c.user }}</div>
        <div class="c-body">{{ c.body }}</div>
        <div class="c-time">{{ c.ts }}</div>
      </el-card>
    </el-scrollbar>

    <!-- ========== 发表评论 ========== -->
    <el-input
      v-model="newComment"
      type="textarea"
      :rows="3"
      placeholder="写点什么，Ctrl+Enter 发送"
      @keyup.ctrl.enter="submit"
    />
    <el-button
      type="primary"
      style="margin-top:8px"
      :disabled="!newComment.trim()"
      @click="submit"
    >发表</el-button>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import Prism from 'prismjs'
import 'prismjs/themes/prism.css'
import clipboard from 'clipboard-copy'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: Boolean,
  post: Object
})
const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})

if (props.post && !props.post.comments) props.post.comments = []

/* 标签颜色映射 */
const tagColors = {
  教学贴: 'success',
  求助贴: 'danger',
  讨论贴: 'info',
  经验贴: 'warning'
}

/* 正文高亮处理 */
const formatted = computed(() => {
  if (!props.post) return ''
  return props.post.content
    .replace(/```(\w+)\n([\s\S]+?)```/g, (_, lang, code) => {
      const html = Prism.highlight(
        code,
        Prism.languages[lang] || Prism.languages.plain,
        lang
      )
      return `
        <pre class="code-wrap"><code class="language-${lang}">${html}</code>
          <button class="copy-btn" data-code="${encodeURIComponent(code)}">复制</button>
        </pre>`
    })
    .replace(/\n/g, '<br>')
})

watch(visible, v => {
  if (!v) return
  nextTick(() => {
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.onclick = async () => {
        const code = decodeURIComponent(btn.dataset.code)
        try {
          await clipboard(code)
          ElMessage.success('已复制代码')
        } catch (e) {
          ElMessage.warning('浏览器拒绝剪贴板，已选中文本')
          const range = document.createRange()
          range.selectNode(btn.previousElementSibling)
          const sel = window.getSelection()
          sel.removeAllRanges()
          sel.addRange(range)
        }
      }
    })
  })
})

function like() {
  props.post.likes++
}

const newComment = ref('')
function submit() {
  if (!newComment.value.trim()) return
  props.post.comments.push({
    user: 'Rosy',
    body: newComment.value,
    ts: new Date().toLocaleTimeString()
  })
  newComment.value = ''
}
</script>

<style scoped>
.sub-meta {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: #555;
}

.author {
  font-weight: 500;
}

.content {
  line-height: 1.6;
  margin-bottom: 12px;
}
.code-wrap {
  position: relative;
}
.copy-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  padding: 2px 6px;
  font-size: 12px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}
.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 12px 0;
}
.comment-list .comment {
  margin-bottom: 8px;
}
.comment .c-author {
  font-weight: 600;
}
.comment .c-time {
  font-size: 0.75rem;
  color: #999;
}
</style>
