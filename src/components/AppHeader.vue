<!-- src/components/AppHeader.vue -->
<template>
  <header class="app-header">
    <div class="header-content">
      <router-link to="/" class="logo">体育活动室</router-link>
      <nav class="navigation">
        <router-link to="/activities">活动列表</router-link>
        <template v-if="user">
          <router-link to="/my-orders">我的订单</router-link>
          <a href="#" @click.prevent="handleLogout">退出登录</a>
          <span>欢迎, {{ user.username }}</span>
          <router-link v-if="user.role === 'admin'" to="/admin/dashboard" class="admin-link">管理后台</router-link>
        </template>
        <template v-else>
          <router-link to="/login">登录</router-link>
          <router-link to="/register">注册</router-link>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import store from '../store';

const router = useRouter();
const user = computed(() => store.state.user);

function handleLogout() {
  store.logout();
  router.push('/login');
}
</script>

<style scoped>
.app-header {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0 20px;
}
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  height: 60px;
}
.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}
.navigation a {
  margin: 0 15px;
  color: #555;
  font-weight: 500;
}
.navigation a.router-link-exact-active {
  color: #409eff;
}
.navigation span {
  margin-left: 15px;
  color: #999;
}
.admin-link {
  color: #f56c6c !important;
}
</style>