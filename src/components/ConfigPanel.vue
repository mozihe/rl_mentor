<template>
    <el-card shadow="never" body-style="padding:12px 16px">
      <!-- 复制按钮 -->
      <div class="header">
        <span>当前超参数</span>
        <el-button
          text
          size="small"
          icon="CopyDocument"
          @click="copyJson"
        >复制 JSON</el-button>
      </div>
  
      <!-- 描述表 -->
      <el-descriptions :column="2" border size="small" class="desc">
        <el-descriptions-item
          v-for="(v, k) in params"
          :key="k"
          :label="k"
        >
          <el-tag v-if="typeof v==='number'" effect="plain">{{ v }}</el-tag>
          <span v-else>{{ v }}</span>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </template>
  
  <script setup>
  import { ElMessage } from 'element-plus'
  const props = defineProps({ params: Object })
  
  function copyJson() {
    navigator.clipboard.writeText(JSON.stringify(props.params, null, 2))
    ElMessage.success('已复制到剪贴板')
  }
  </script>
  
  <style scoped>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-weight: 600;
  }
  
  .desc :deep(.el-descriptions-row:nth-child(odd)) {
    background: #fafafa;
  }
  </style>
  