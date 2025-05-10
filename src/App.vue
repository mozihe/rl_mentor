<template>
  <el-container style="min-height: 100vh">
    <!-- ───────── 顶栏 ───────── -->
    <el-header v-if="!isLogin" class="header">
      <!-- Logo -->
      <div class="logo">RL&nbsp;Mentor</div>

      <!-- 主菜单 -->
      <el-menu
        mode="horizontal"
        router
        class="menu"
        :default-active="route.path"
        background-color="transparent"
        active-text-color="#fff"
      >
        <el-menu-item index="/dashboard">面板</el-menu-item>
        <el-menu-item index="/courses">课程</el-menu-item>
        <el-menu-item index="/sandbox">沙盒工具</el-menu-item>
        <el-menu-item index="/community">社区</el-menu-item>
        <el-menu-item index="/leaderboard">排行榜</el-menu-item>
        <el-menu-item index="/mentor">AI 导师</el-menu-item>

      </el-menu>

      <!-- 右侧头像 ↓ -->
      <el-dropdown trigger="hover" @command="handleCmd">
        <span class="avatar-wrapper">
          <el-avatar
            size="small"
            src="https://api.dicebear.com/6.x/fun-emoji/svg"
          />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">个人中心</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-header>

    <!-- ───────── 主内容 ───────── -->
    <el-main class="main">
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route   = useRoute()
const router  = useRouter()
const isLogin = computed(() => route.path === '/')

/* 处理头像下拉命令 */
function handleCmd(cmd){
  if(cmd==='profile'){
    router.push('/profile')
  }else if(cmd==='logout'){      // 伪登出
    ElMessage.success('已退出登录')
    router.push('/')
  }
}

/* 首页 padding 逻辑保留 */
watch(route, newRoute => {
  const elMain = document.querySelector('.main')
  if (newRoute.path === '/') {
    elMain.style.setProperty('padding', '0', 'important')
  } else {
    elMain.style.setProperty('padding', '24px')
  }
})
onMounted(() => {
  const elMain = document.querySelector('.main')
  if (route.path === '/') {
    elMain.style.setProperty('padding', '0', 'important')
  }
})
</script>

<style scoped>
/* 顶栏：品牌蓝 */
.header{
  display:flex;
  align-items:center;
  padding:0 24px;
  background:#409eff;
  color:#fff;
}

/* Logo */
.logo{
  font-weight:700;
  font-size:1.2rem;
  margin-right:32px;
}

/* 菜单 */
.menu{ flex:1 }
.menu :deep(.el-menu-item){
  color:#e5f2ff;
  transition:background .2s,color .2s;
}
.menu :deep(.el-menu-item:hover){
  background:rgba(255,255,255,0.15);
  color:#fff;
}
.menu :deep(.el-menu-item.is-active){
  background:rgba(255,255,255,0.28)!important;
  color:#fff!important;
  border-radius:4px;
}

/* 头像 */
.avatar-wrapper{
  display:flex;
  align-items:center;
  cursor:pointer;
  margin-left:24px;
}

/* 主区域背景 */
.main{
  padding:24px;
  background:#f5f7fa;
}
</style>
