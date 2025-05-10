<template>
    <el-card shadow="hover" :body-style="{ padding: '18px' }">
      <div class="tile">
        <span class="icon" :style="{ background: color }">{{ icon }}</span>
        <div class="info">
          <p class="count">{{ count }}</p>
          <p class="label">{{ label }}</p>
        </div>
      </div>
    </el-card>
  </template>
  
  <script setup>
  defineProps({
    icon: String,
    color: String,
    count: Number,
    label: String
  })
  </script>
  
  <style scoped>
  .tile {
    display: flex;
    align-items: center;
  }
  .icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    font-size: 24px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 14px;
  }
  .info .count {
    font-size: 1.6rem;
    font-weight: 600;
  }
  .info .label {
    color: #666;
    font-size: 0.85rem;
  }
  </style>
  