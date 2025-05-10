<template>
    <el-card shadow="always" class="card"  @click="go">
      <div class="card-header">
        <h3>{{ course.title }}</h3>
        <el-tag :type="levelColor">{{ course.level }}</el-tag>
      </div>
  
      <p class="brief">{{ course.brief }}</p>
  
      <el-progress
        :percentage="Math.round(course.progress * 100)"
        :stroke-width="6"
        style="margin: 8px 0"
      />
  
      <div class="tag-row">
        <el-tag
          v-for="t in course.tags"
          :key="t"
          size="small"
          effect="plain"
          type="info"
        >{{ t }}</el-tag>
      </div>
    </el-card>
  </template>
  
  <script setup>
  const props = defineProps({ course: Object })
  import { useRouter } from 'vue-router'

/* 拿到路由实例 */
  const router = useRouter()

  const levelColor = {
    入门: 'success',
    进阶: 'warning',
    硬核: 'danger'
  }[props.course.level] || 'info'

  function go () {
  router.push(`/course/${props.course.id}`)
}
  </script>
  
  <style scoped>
  .card { cursor: pointer; transition: transform .15s; }
  .card:hover { transform: translateY(-4px); }
  .card-header { display: flex; justify-content: space-between; align-items: center; }
  .brief { color: #666; font-size: 0.87rem; min-height: 38px; }
  .tag-row :deep(.el-tag) { margin-right: 4px; margin-top: 4px; }
  </style>
  