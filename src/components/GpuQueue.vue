<template>
    <el-card shadow="hover">
      <template #header>实验排队队列</template>
      <el-table
        :data="queue"
        size="small"
        style="width:100%"
      >
        <el-table-column prop="name" label="实验" />
        <el-table-column prop="gpu" label="GPU" width="80" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="s">
            <el-tag :type="map[s.row.status]" size="small">{{ s.row.status }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useMainStore } from '../store'
  
  const store = useMainStore()
  const queue = computed(() =>
    store.experiments
      .filter(e => e.status === 'queued' || e.status === 'running')
      .sort((a,b)=>(a.status>b.status?1:-1))
  )
  const map={running:'success',queued:'warning'}
  </script>
  