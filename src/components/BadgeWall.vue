<template>
    <el-card shadow="hover">
      <template #header>已解锁徽章</template>
      <div class="wall">
        <el-tooltip
          v-for="b in badges"
          :key="b.id"
          :content="b.name"
          placement="top"
        >
          <img :src="b.img" :alt="b.name" class="badge" />
        </el-tooltip>
      </div>
    </el-card>
  </template>
  
  <script setup>
  defineProps({
    badges: Array
  })
  </script>
  
  <style scoped>
  .wall  { display:flex; flex-wrap:wrap; gap:12px; }
  .badge {
    width:64px;height:64px; object-fit:contain;
    filter: drop-shadow(0 1px 2px rgba(0,0,0,.15));
  }
  </style>
  