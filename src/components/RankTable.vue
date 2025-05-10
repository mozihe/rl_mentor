<template>
    <el-card shadow="hover">
      <el-table :data="rows" size="small" stripe>
        <el-table-column type="index" width="50" label="#" />
        <el-table-column prop="name" label="用户名" />
        <el-table-column prop="score" :label="scoreLabel" width="120" />
      </el-table>
    </el-card>
  </template>
  
  <script setup>
  defineProps({
    rows: Array,
    scoreLabel: { type: String, default: '得分' }
  })
  </script>
  