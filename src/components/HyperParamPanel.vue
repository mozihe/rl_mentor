<template>
    <el-card shadow="hover" class="panel">
      <el-collapse v-model="active">
        <!-- 基础 -->
        <el-collapse-item name="basic">
          <template #title><strong>基础</strong></template>
          <el-form label-width="90px" size="small">
            <el-form-item label="γ">
              <NumberPair v-model="p.gamma" :min="0.8" :max="0.999" :step="0.001" @change="emitChange"/>
            </el-form-item>
  
            <el-form-item label="学习率">
              <NumberPair v-model="p.lr" :min="1e-5" :max="1e-3" :step="1e-5" @change="emitChange"/>
            </el-form-item>
  
            <el-form-item label="Batch">
              <NumberPair v-model="p.batch" :min="32" :max="512" :step="32" @change="emitChange"/>
            </el-form-item>
          </el-form>
        </el-collapse-item>
  
        <!-- 策略 -->
        <el-collapse-item name="policy">
          <template #title><strong>策略</strong></template>
          <el-form label-width="90px" size="small">
            <el-form-item label="ε-decay">
              <NumberPair v-model="p.eps" :min="0.9" :max="0.9999" :step="0.0001" @change="emitChange"/>
            </el-form-item>
  
            <el-form-item label="隐藏层">
              <el-input-number v-model="p.hidden" :min="64" :max="1024" :step="64" @change="emitChange"/>
            </el-form-item>
          </el-form>
        </el-collapse-item>
  
        <!-- 训练 -->
        <el-collapse-item name="train">
          <template #title><strong>训练</strong></template>
          <el-form label-width="90px" size="small">
            <el-form-item label="Epoch">
              <el-input-number v-model="p.epoch" :min="1" :max="500" @change="emitChange"/>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </template>
  
  <script setup>
  import { reactive, watch, ref } from 'vue'
  import NumberPair from './NumberPair.vue'
  
  const props = defineProps({ init: Object })
  const emit  = defineEmits(['update'])
  
  const p = reactive({ ...props.init })
  const active = ref(['basic'])          // 默认展开
  
  watch(() => props.init, v => Object.assign(p, v))
  function emitChange() { emit('update', p) }
  </script>
  
  <style scoped>
  .panel :deep(.el-form-item__content){ justify-content:flex-end }
  </style>
  