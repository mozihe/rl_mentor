<template>
    <el-dialog
      v-model="visible"
      title="发表新帖子"
      width="640px"
      destroy-on-close
    >
      <el-form label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>

        <el-form-item label="标签">
        <el-select v-model="form.tag" placeholder="请选择标签">
          <el-option label="教学贴" value="教学贴">
            <el-tag type="success">教学贴</el-tag>
          </el-option>
          <el-option label="求助贴" value="求助贴">
            <el-tag type="danger">求助贴</el-tag>
          </el-option>
          <el-option label="讨论贴" value="讨论贴">
            <el-tag type="info">讨论贴</el-tag>
          </el-option>
          <el-option label="经验贴" value="经验贴">
            <el-tag type="warning">经验贴</el-tag>
          </el-option>
        </el-select>
      </el-form-item>
  
        <el-form-item label="内容">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="8"
            placeholder="Markdown/纯文本均可"
          />
        </el-form-item>
  
        <el-form-item label="附件">
          <el-upload
            drag
            action="#"
            :auto-upload="false"
            :on-change="fileChange"
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">拖拽文件到此处，或点击选择</div>
          </el-upload>
        </el-form-item>
      </el-form>
  
      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button
          type="primary"
          :disabled="!form.title.trim() || !form.content.trim()"
          @click="submit"
        >发布</el-button>
      </template>
    </el-dialog>
  </template>
  
  <script setup>
  import { reactive, ref, computed } from 'vue'
  import { ElMessage } from 'element-plus'
  import { useMainStore } from '../store'
  
  const props = defineProps({ modelValue: Boolean })
  const emit  = defineEmits(['update:modelValue'])
  
  const visible = computed({
    get: () => props.modelValue,
    set: v => emit('update:modelValue', v)
  })
  
  const form = reactive({ title: '', content: '', files: [] })
  function fileChange(file) { form.files.push(file.name) }
  
  const store = useMainStore()
  function submit() {
    store.posts.unshift({
      id: crypto.randomUUID(),
      author: 'Rosy',
      title: form.title,
      content: form.content + (form.files.length ? `\n\n附件: ${form.files.join(', ')}` : ''),
      likes: 0,
      comments: []
    })
    ElMessage.success('发布成功')
    visible.value = false
    Object.assign(form, { title: '', content: '', files: [] })
  }
  </script>
  