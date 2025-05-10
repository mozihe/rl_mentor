<template>
  <div>
    <h3>教学视频</h3>
    <iframe src="https://player.bilibili.com/player.html?bvid=BV1qW4y1a7fU" 
        scrolling="no" 
        border="0" 
        frameborder="no" 
        framespacing="0" 
        allowfullscreen="true"
        controls style="width:100%;height:480px">
</iframe>
    <!-- <el-empty v-else description="暂无视频"/> -->
  </div>
</template>
<script setup>
const props = defineProps({ course:Object })
</script>
