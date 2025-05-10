<template>
    <el-card :body-style="{ padding: '12px' }" shadow="never">
      <div class="card-row">
        <strong>{{ experiment.name }}</strong>
        <el-tag
          :type="tagType"
          size="small"
          effect="plain"
        >{{ experiment.status }}</el-tag>
      </div>
  
      <div class="card-row small">
        Step: {{ experiment.step.toLocaleString() }} |
        Reward: {{ experiment.reward }}
      </div>
    </el-card>
  </template>
  
  <script setup>
  defineProps({
    experiment: {
      type: Object,
      required: true,
    },
  })
  
  const tagType = {
    running: 'success',
    paused: 'warning',
    finished: 'info',
  }[props.experiment.status] ?? 'info'
  </script>
  
  <style scoped>
  .card-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }
  .card-row.small {
    font-size: 0.85rem;
    color: #666;
  }
  </style>
  