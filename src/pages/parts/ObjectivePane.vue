<template>
    <div>
      <h3>学习目标</h3>
      <ol v-if="course?.objectives?.length">
        <li v-for="(o,i) in course.objectives" :key="i">{{ o }}</li>
      </ol>
      <el-empty v-else description="暂无目标"/>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({ course:Object })
  </script>
  