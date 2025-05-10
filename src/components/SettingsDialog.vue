<template>
    <el-dialog
      v-model="visible"
      title="编辑资料 / 设置"
      width="640px"
      destroy-on-close
    >
      <el-form label-width="90px" :model="form" size="small">
        <el-form-item label="用户名">
          <el-input v-model="form.name" />
        </el-form-item>
  
        <el-form-item label="邮箱">
          <el-input v-model="form.email" />
        </el-form-item>
  
        <el-form-item label="个人简介">
          <el-input v-model="form.bio" type="textarea" :rows="3" />
        </el-form-item>
  
        <!-- <el-form-item label="夜间模式">
          <el-switch v-model="isDark" />
        </el-form-item> -->
  
        <el-form-item label="语言">
          <el-select v-model="lang" style="width:140px">
            <el-option label="简体中文" value="zh" />
            <el-option label="English" value="en" />
          </el-select>
        </el-form-item>
  
        <el-form-item label="头像">
          <el-upload
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="fakeUpload"
          >
            <el-avatar :src="preview" :size="64" class="avatar-uploader" />
          </el-upload>
        </el-form-item>
      </el-form>
  
      <template #footer>
        <el-button @click="visible=false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </template>
  
  <script setup>
  import { reactive, ref, computed } from 'vue'
  import { useTheme } from '../composables/useTheme'
  import { useMainStore } from '../store'
  import { ElMessage } from 'element-plus'
  
  const props = defineProps({ modelValue:Boolean })
  const emit  = defineEmits(['update:modelValue'])
  
  const visible = computed({
    get:()=>props.modelValue,
    set:v => emit('update:modelValue', v)
  })

  const store = useMainStore()
  const form = reactive({
    name: store.user.name,
    email:'rosy@example.com',
    bio: '热爱强化学习的探索者 🧠',
    avatar: 'https://api.dicebear.com/6.x/fun-emoji/svg'
  })
  const preview = ref(form.avatar)
  
  /* 夜间模式 & 语言 */
  const { isDark } = useTheme()
  const lang = ref('zh')
  
  function fakeUpload(file){
    preview.value = URL.createObjectURL(file.raw)   // 仅前端预览
  }
  
  function save(){
    store.user.name = form.name
    store.user.avatar = preview.value
    ElMessage.success('已保存（仅本地）')
    visible.value=false
  }
  </script>
  
  <style scoped>
  .avatar-uploader { cursor: pointer; transition: .3s; }
  .avatar-uploader:hover { transform:scale(1.05); }
  </style>
  