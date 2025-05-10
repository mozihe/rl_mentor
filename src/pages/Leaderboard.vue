<template>
    <div class="rank-page">
      <el-tabs v-model="tab" class="rank-tabs">
        <!-- 1. 积分榜 -->
        <el-tab-pane label="积分榜" name="score">
          <RankTable :rows="scoreRows" score-label="积分" />
        </el-tab-pane>
  
        <!-- 2. 新星榜 -->
        <el-tab-pane label="新星榜" name="rookie">
          <RankTable :rows="rookieRows" score-label="近7日积分" />
        </el-tab-pane>
  
        <!-- 3. 解答榜 -->
        <el-tab-pane label="解答榜" name="answer">
          <RankTable :rows="answerRows" score-label="评论数" />
        </el-tab-pane>
  
        <!-- 4. 活跃榜 -->
        <el-tab-pane label="活跃榜" name="active">
          <RankTable :rows="activeRows" score-label="活跃度" />
        </el-tab-pane>
      </el-tabs>
  
      <!-- 🏅固定底部显示我的排名 -->
      <div class="my-rank">
        <span>🏅 昵称：{{ myName }}</span>
        <span style="margin-left: 16px;">{{ currentMyRank }}</span>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useMainStore } from '../store'
  import RankTable from '../components/RankTable.vue'
  import dayjs from 'dayjs'
  
  /* 当前Tab */
  const tab = ref('score')
  
  /* 固定我的昵称 */
  const myName = '墨心 Rosy'
  
  /* 工具：打乱数组 */
  function shuffle(arr) {
    return arr.slice().sort(() => Math.random() - 0.5)
  }
  
  /* 汇总每个用户 */
  const store = useMainStore()
  const userMap = computed(() => {
    const map = {}
    store.posts.forEach(p => {
      const u = map[p.author] ??= { name: p.author, likes: 0, cmts: 0, posts: 0, latest: p.ts ?? dayjs().subtract(10, 'day') }
      u.likes += p.likes
      u.posts += 1
      u.latest = dayjs().isAfter(dayjs(p.latest)) ? dayjs() : u.latest
      p.comments.forEach(c => {
        const v = map[c.user] ??= { name: c.user, likes: 0, cmts: 0, posts: 0, latest: c.ts }
        v.cmts += 1
      })
    })
    return Object.values(map)
  })
  
  /* 积分榜 */
  const scoreRows = computed(() =>
    shuffle(userMap.value.map(u => ({ name: u.name, score: u.likes + u.cmts * 5 })))
  )
  
  /* 新星榜 */
  const rookieRows = computed(() =>
    shuffle(userMap.value.map(u => ({ name: u.name, score: u.cmts })))
  )
  
  /* 解答榜 */
  const answerRows = computed(() =>
    shuffle(userMap.value.map(u => ({ name: u.name, score: u.cmts })))
  )
  
  /* 活跃榜 */
  const activeRows = computed(() =>
    shuffle(userMap.value.map(u => ({ name: u.name, score: u.posts * 2 + u.cmts })))
  )
  
  /* 每个榜单自己的一份我的排名（分数+名次） */
  const myRankData = {
    score: { score: Math.floor(Math.random() * 500) + 100, rank: Math.floor(Math.random() * 50) + 1 },
    rookie: { score: Math.floor(Math.random() * 80) + 10, rank: Math.floor(Math.random() * 50) + 1 },
    answer: { score: Math.floor(Math.random() * 100) + 10, rank: Math.floor(Math.random() * 50) + 1 },
    active: { score: Math.floor(Math.random() * 200) + 30, rank: Math.floor(Math.random() * 50) + 1 },
  }
  
  /* 动态根据当前tab展示我的排名信息 */
  const currentMyRank = computed(() => {
    const cur = myRankData[tab.value]
    if (!cur) return ''
    switch (tab.value) {
      case 'score': return `积分：${cur.score} ｜ 排名：第${cur.rank}名`
      case 'rookie': return `近7日积分：${cur.score} ｜ 排名：第${cur.rank}名`
      case 'answer': return `评论数：${cur.score} ｜ 排名：第${cur.rank}名`
      case 'active': return `活跃度：${cur.score} ｜ 排名：第${cur.rank}名`
      default: return ''
    }
  })
  </script>
  
  <style scoped>
  .rank-page {
    padding-bottom: 80px; /* 预留底部空间，否则最后一行会被挡住 */
  }
  
  .rank-tabs {
    margin-bottom: 20px;
  }
  
  /* 固定在底部，不滚动 */
  .my-rank {
  position: fixed;
  top: 72px;
  left: 50%;
  transform: translateX(-50%);
  background: #f9f9f9;
  border: 1px solid #ddd;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 6px 20px;
  border-radius: 12px;
  font-size: 14px;
  z-index: 999;
  display: flex;
  align-items: center;
  backdrop-filter: blur(6px);
}

  </style>
  