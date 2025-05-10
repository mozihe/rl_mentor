<template>
    <el-card shadow="never">
      <template #header>
        <span>🔥 今日热点</span>
      </template>
  
      <ol class="hot">
        <li
          v-for="(p, i) in top"
          :key="p.id"
          @click="$emit('open', p)"
        >
          <span class="rank">{{ i + 1 }}</span>
          <span class="title">{{ p.title }}</span>
          <el-tag size="small" effect="plain">👍 {{ p.likes }}</el-tag>
        </li>
      </ol>
    </el-card>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useMainStore } from '../store'
  
  const store = useMainStore()
  const top = computed(() =>
    [...store.posts]
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 5)
  )
  </script>
  
  <style scoped>
  .hot { list-style:none; padding:0; margin:0; }
  .hot li {
    display:flex; align-items:center; gap:6px;
    padding:6px 0; cursor:pointer;
  }
  .rank { width:18px; color:#f56c6c; font-weight:600; }
  .title {
    flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  }
  </style>
  