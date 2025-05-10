<template>
    <div>
      <h3>章节介绍</h3>
      <p>{{ chapter.desc || `这是「${chapter.title}」的简介。` }}</p>
    </div>
  </template>
  <script setup>
  const props = defineProps({ chapter:Object })
  </script>
  