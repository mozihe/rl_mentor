<template>
    <!-- 卡片包裹 -->
    <el-card shadow="never">
      <template #header>测验1</template>
  
      <p style="margin:4px 0">1. Python 中打印函数是 <code>print()</code> 吗？</p>
      <p style="margin:4px 0">2. 快速排序平均时间复杂度是？</p>
  
      <el-button type="primary" size="small" @click="open = true">
        开始答题
      </el-button>
    </el-card>
  
    <!-- 测验弹窗 -->
    <el-dialog v-model="open" width="520px" title="测验1">
      <el-form label-width="200px">
        <el-form-item label="1. print() 是否打印？">
          <el-radio-group v-model="ans1">
            <el-radio label="是" />
            <el-radio label="否" />
          </el-radio-group>
        </el-form-item>
  
        <el-form-item label="2. 快速排序平均复杂度">
          <el-input v-model="ans2" placeholder="如：O(n log n)" />
        </el-form-item>
      </el-form>
  
      <template #footer>
        <el-button @click="open=false">取消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </template>
    </el-dialog>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { ElMessage } from 'element-plus'
  
  const open = ref(false)
  const ans1 = ref('')
  const ans2 = ref('')
  
  function submit(){
    ElMessage.success('答案已提交')
    open.value = false
  }
  </script>
  
  <style scoped>
  /* 卡片底部留点空 */
  </style>
  