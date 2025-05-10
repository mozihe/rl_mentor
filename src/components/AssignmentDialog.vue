<template>
    <el-dialog v-model="visible" :title="assn.title" width="540px">
      <p style="margin:0 0 4px 0"><strong>截止：</strong>{{ assn.deadline }}</p>
      <p style="white-space:pre-wrap;margin:0 0 16px 0">{{ assn.spec }}</p>
  
      <el-upload
        drag
        action="#"
        :auto-upload="false"
        :file-list="files"
        :on-change="f=>files=[f]"
      >
        <i class="el-icon-upload"/>
        <div class="el-upload__text">拖拽文件到此处，或点击选择</div>
      </el-upload>
  
      <el-button
        type="primary"
        style="margin-top:16px"
        :disabled="!files.length"
        @click="submit"
      >提交</el-button>
  
      <el-result
        v-if="submitted"
        icon="success"
        title="上传成功"
        sub-title="仅本地模拟"
      />
    </el-dialog>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  
  const props = defineProps({ modelValue:Boolean, assn:Object })
  const emit  = defineEmits(['update:modelValue'])
  
  const visible = computed({
    get:()=>props.modelValue,
    set:v=>emit('update:modelValue',v)
  })
  
  const files = ref([])
  const submitted = ref(false)
  function submit(){ submitted.value = true }
  </script>
  