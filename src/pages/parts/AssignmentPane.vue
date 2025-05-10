<template>
    <el-card shadow="never">
      <template #header>
        <span>示例作业 · CLI 计算器</span>
        <el-tag type="danger" style="float:right">截至 2025-12-31</el-tag>
      </template>
  
      <p style="white-space:pre-wrap">
        编写一个命令行计算器，支持 + − × ÷，输入形如
        <code>3 + 5</code> 并输出结果。
      </p>
  
      <!-- 上传区 -->
      <el-upload
        :auto-upload="false"
        :limit="1"
        :on-change="fileChosen"
        style="display:inline-block;margin-right:8px"
      >
        <el-button type="primary" size="small">选择文件</el-button>
      </el-upload>
  
      <el-button
        type="success"
        size="small"
        :disabled="!file"
        @click="submitFile"
      >提交作业</el-button>
    </el-card>
  
    <!-- 上传结果弹窗 -->
    <el-dialog v-model="done" width="420px" title="提交成功" center>
      <el-result
        icon="success"
        title="已收到你的文件"
        sub-title="评测结果会在 1 个工作日内反馈"
      />
    </el-dialog>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { ElMessage } from 'element-plus'
  
  const file = ref(null)
  const done = ref(false)
  
  function fileChosen(raw){
    file.value = raw.raw
    ElMessage.info(`已选择：${raw.name}`)
  }
  
  function submitFile(){
    // 这里只做前端演示：直接弹成功
    done.value = true
    file.value = null
  }
  </script>
  
  <style scoped>
  /* 让按钮紧凑排一行 */
  </style>
  