<template>
    <div class="login-wrap">
      <h1 class="site-title">RLMentor</h1> <!-- 标题放在上方 -->
      <el-card shadow="always" class="panel">
        <el-tabs v-model="mode">
          <!-- 登录 -->
          <el-tab-pane name="login" label="登录">
            <el-form :model="login" :rules="loginRules" ref="loginRef" label-width="90px">
              <el-form-item label="用户名" prop="user">
                <el-input v-model="login.user" placeholder="邮箱 / 手机 / 用户名" />
              </el-form-item>
              <el-form-item label="密码" prop="pass">
                <el-input v-model="login.pass" type="password" show-password />
              </el-form-item>
              <el-button type="primary" style="width:100%" @click="handleLogin">登录</el-button>
            </el-form>
          </el-tab-pane>
    
          <!-- 注册 -->
          <el-tab-pane name="reg" label="注册">
            <el-form :model="reg" :rules="regRules" ref="regRef" label-width="90px">
              <el-form-item label="用户名" prop="user">
                <el-input v-model="reg.user" />
              </el-form-item>
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="reg.phone" maxlength="11" />
              </el-form-item>
              <el-form-item label="验证码" prop="code">
                <el-input v-model="reg.code" maxlength="6" style="width:150px" />
                <el-button
                  :disabled="count>0"
                  style="margin-left:8px"
                  @click="sendCode"
                >{{ count>0 ? count+'s' : '发送验证码' }}</el-button>
              </el-form-item>
              <el-form-item label="密码" prop="pass">
                <el-input v-model="reg.pass" type="password" show-password />
              </el-form-item>
              <el-form-item label="确认密码" prop="pass2">
                <el-input v-model="reg.pass2" type="password" show-password />
              </el-form-item>
              <el-button type="primary" style="width:100%" @click="handleReg">注册并登录</el-button>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { reactive, ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import { useMainStore } from '../store'
  
  /* -------- 表单数据 -------- */
  const mode   = ref('login')
  const login  = reactive({ user:'', pass:'' })
  const reg    = reactive({ user:'', phone:'', code:'', pass:'', pass2:'' })
  
  /* -------- 校验规则 -------- */
  const loginRules = {
    user:[{ required:true, message:'必填', trigger:'blur' }],
    pass:[{ required:true, message:'必填', trigger:'blur' }]
  }
  const phoneReg  = /^1\d{10}$/
  const regRef    = ref()
  const regRules = {
    user :[{ required:true, message:'必填', trigger:'blur' }],
    phone:[{ validator:(r,v,cb)=>cb(phoneReg.test(v)?undefined:new Error('手机号格式错误')) }],
    code :[{ required:true, message:'必填', trigger:'blur' }],
    pass :[{ min:6, message:'至少 6 位', trigger:'blur' }],
    pass2:[{ validator:(r,v,cb)=>cb(v===reg.pass?undefined:new Error('两次密码不一致')) }]
  }
  
  /* -------- 发送验证码倒计时 -------- */
  const count = ref(0)
  function sendCode(){
    if(!phoneReg.test(reg.phone)){
      ElMessage.error('请输入有效手机号'); return
    }
    ElMessage.success('验证码已发送')
    count.value = 60
    const timer = setInterval(()=>{ if(--count.value<=0) clearInterval(timer) },1000)
  }
  
  /* -------- 登录/注册逻辑 -------- */
  const store = useMainStore()
  const router= useRouter()
  function handleLogin(){
    store.user.name = login.user || 'Guest'
    ElMessage.success('登录成功')
    router.push('/dashboard')
  }
  function handleReg(){
    regRef.value.validate(valid=>{
      if(!valid) return
      store.user.name = reg.user
      ElMessage.success('注册成功')
      router.push('/dashboard')
    })
  }
  </script>
  
  <style scoped>
  .login-wrap {
    margin: 0;
    padding: 0;
    height: 100vh;
    display: flex;
    flex-direction: column; /* 使标题和表单垂直排列 */
    justify-content: center;
    align-items: center;
    background: radial-gradient(circle at 30% 30%, #5aa9ff 0%, #3485ff 100%);
  }
  
  .site-title { /* 标题样式 */
    font-size: 48px;
    font-weight: bold;
    color: #fff;
    margin-bottom: 20px; /* 调整与登录框的间距 */
    text-align: center;
  }
  
  .panel {
    width: 420px;
    border: none;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.25);
  }

  </style>
  