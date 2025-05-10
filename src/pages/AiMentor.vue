<template>
    <div class="chat-page">
      <!-- 聊天窗口 -->
      <div ref="chatBox" class="chat-box">
        <div
          v-for="(m,i) in messages"
          :key="i"
          :class="['msg', m.role]"
        >
          <el-avatar
            :src="m.role==='user' ? userAvatar : botAvatar"
            :size="36"
            class="avatar"
          />
          <div class="bubble">
            <div v-html="m.content" />
          </div>
        </div>
      </div>
  
      <!-- 输入栏 -->
      <div class="input-bar">
        <el-input
          v-model="draft"
          type="textarea"
          :autosize="{minRows:1,maxRows:4}"
          placeholder="输入你的问题…"
          @keydown.ctrl.enter.prevent="send"
        />
        <el-button
          type="primary"
          :disabled="!draft.trim()"
          @click="send"
          style="margin-left:12px"
        >发送 (Ctrl+Enter)</el-button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, nextTick } from 'vue'
  
  /* 自行替换头像 */
  const userAvatar = 'https://api.dicebear.com/6.x/fun-emoji/svg'
  const botAvatar  = 'https://img.icons8.com/fluency/96/000000/chatbot.png'
  
  /* 聊天记录 */
  const messages = ref([
    { role:'bot', content:'你好！我是 **AI 导师**，有什么强化学习问题想聊？' }
  ])
  
  /* 固定回答逻辑 */
  function botReply(q){
    return `你问：“${q}”？太简单啦，答案当然是——<br><br>` +
           `> **固定回复示范**<br>` +
           `1. 查看 RL 教程\n` +
           `2. 多练习，多打卡\n` +
           `3. 要相信自己！`
  }
  
  /* 发送处理 */
  const draft = ref('')
  const chatBox = ref(null)
  function send(){
    const txt = draft.value.trim()
    if(!txt) return
    messages.value.push({ role:'user', content:txt })
    draft.value=''
  
    /* 模拟思考 600 ms */
    setTimeout(async()=>{
      messages.value.push({ role:'bot', content:botReply(txt) })
      await nextTick()
      chatBox.value.scrollTo({ top:chatBox.value.scrollHeight })
    },600)
  }
  </script>
  
  <style scoped>
  .chat-page{
    display:flex;
    flex-direction:column;
    height:calc(100vh - 100px);   /* 适配顶栏高度，视情况调整 */
    background:#f4f6f8;
    border-radius:6px;
    overflow:hidden;
  }
  
  /* 消息列表 */
  .chat-box{
    flex:1;
    padding:16px 24px;
    overflow-y:auto;
  }
  
  /* 单条消息 */
  .msg{
    display:flex;
    gap:12px;
    margin-bottom:12px;
  }
  .msg.user{ flex-direction:row-reverse }
  .bubble{
    max-width:70%;
    padding:10px 14px;
    border-radius:8px;
    line-height:1.5;
    white-space:pre-wrap;
    word-break:break-word;
    background:#fff;
    box-shadow:0 1px 3px rgba(0,0,0,0.06);
  }
  .msg.user .bubble{ background:#409eff; color:#fff }
  
  /* 输入区 */
  .input-bar{
    display:flex;
    padding:12px 24px;
    border-top:1px solid #dcdfe6;
    background:#fff;
  }
  </style>
  