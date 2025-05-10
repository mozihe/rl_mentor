<template>
    <el-dialog
      v-model="visible"
      width="720px"
      :title="`📋 ${quiz.title}`"
      top="10vh"
      center
    >
      <template #default>
        <el-scrollbar height="400px">
          <!-- 题目卡片 -->
          <el-card
            v-for="q in quiz.questions"
            :key="q.id"
            shadow="never"
            style="margin-bottom:24px"
          >
            <template #header>
              <strong>Q{{ q.id }}.</strong> {{ q.q }}
            </template>
  
            <!-- choice / blank -->
            <component
              :is="q.type==='choice' ? 'el-radio-group' : 'el-input'"
              v-model="ans[q.id]"
              :placeholder="q.type==='blank' ? '请作答' : ''"
              style="margin-top:12px"
            >
              <el-radio
                v-for="o in q.opts"
                :key="o"
                :label="o"
                border
                style="margin:4px 12px 4px 0"
              >{{ o }}</el-radio>
            </component>
          </el-card>
        </el-scrollbar>
      </template>
  
      <template #footer>
        <el-button plain @click="visible=false">稍后再做</el-button>
        <el-button type="primary" @click="submit">提交答案</el-button>
      </template>
    </el-dialog>
  </template>
  
  <script setup>
  import { reactive, ref, computed } from 'vue'
  
  const props = defineProps({ modelValue:Boolean, quiz:Object })
  const emit  = defineEmits(['update:modelValue'])
  
  const visible = computed({
    get: () => props.modelValue,
    set: v  => emit('update:modelValue', v)
  })
  
  const ans = reactive({})
  const submitted = ref(false)
  function submit() {
    submitted.value = true
    visible.value   = false
    ElMessage.success('已提交（本地评测）')
  }
  </script>
  