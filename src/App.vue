<!-- src/App.vue -->
<template>
  <div id="app-container">
    <!-- RouterView会根据当前路由动态渲染对应的页面组件 -->
    <router-view />
  </div>
</template>

<script setup>
// 这里通常不需要太多逻辑，主要作为路由的挂载点
</script>

<style scoped>
#app-container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
