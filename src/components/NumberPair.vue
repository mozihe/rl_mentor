<template>
    <div class="pair">
      <el-slider
        v-model="inner"
        :min="min"
        :max="max"
        :step="step"
        @change="emitAll"
        style="flex:1"
      />
      <el-input-number
        v-model="inner"
        :min="min"
        :max="max"
        :step="step"
        @change="emitAll"
        controls-position="right"
        style="width:100px"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  
  const props = defineProps({
    modelValue: Number,
    min: Number,
    max: Number,
    step: Number
  })
  const emit = defineEmits(['update:modelValue', 'change'])
  
  const inner = ref(props.modelValue)
  watch(() => props.modelValue, v => (inner.value = v))
  
  function emitAll() {
    emit('update:modelValue', inner.value)
    emit('change', inner.value)
  }
  </script>
  
  <style scoped>
  .pair { display:flex; align-items:center; gap:10px; width:100%; }
  </style>
  