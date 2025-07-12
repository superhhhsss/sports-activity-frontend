<!-- src/views/NotFound.vue -->
<template>
  <div class="not-found-container">
    <h1>404 - 页面未找到</h1>
    <p>您要找的页面不存在。</p>
    <router-link to="/" class="button">返回首页</router-link>
  </div>
</template>

<style scoped>
.not-found-container {
  text-align: center;
  margin-top: 100px;
}
</style>