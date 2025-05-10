<template>
    <el-dialog v-model="visible" title="智能诊断" width="460px" destroy-on-close>
      <p style="margin-bottom:16px">
        检测到 <code>CUDA out of memory</code>，建议：
      </p>
      <ul>
        <li>减少 batch size</li>
        <li>启用梯度累积</li>
        <li>尝试 <code>torch.cuda.empty_cache()</code></li>
      </ul>
      <template #footer>
        <el-button @click="visible = false">忽略</el-button>
      </template>
    </el-dialog>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  const props = defineProps({ modelValue: Boolean })
  const emit  = defineEmits(['update:modelValue'])
  const visible = computed({
    get: () => props.modelValue,
    set: v  => emit('update:modelValue', v)
  })
  </script>
  