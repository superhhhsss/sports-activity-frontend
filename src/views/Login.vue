<!-- src/views/Login.vue -->
<template>
  <div class="login-container">
    <div class="login-card card">
      <h2>登录</h2>
      <form @submit.prevent="handleLogin">
        <div v-if="error" class="error-message">{{ error }}</div>
        <div class="form-group">
          <label for="username">用户名</label>
          <input type="text" id="username" v-model="username" required>
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <button type="submit" class="button" :disabled="isLoading">{{ isLoading ? '登录中...' : '登录' }}</button>
      </form>
      <p class="switch-form">还没有账号? <router-link to="/register">立即注册</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login, getProfile } from '../api';
import store from '../store';

const router = useRouter();
const username = ref('');
const password = ref('');
const error = ref(null);
const isLoading = ref(false);

async function handleLogin() {
  error.value = null;
  isLoading.value = true;
  try {
    const response = await login({ username: username.value, password: password.value });
    store.setToken(response.data.token);

    // 登录成功后获取用户信息
    const profileResponse = await getProfile();
    store.setUser(profileResponse.data);

    router.push('/'); // 跳转到首页
  } catch (err) {
    error.value = err.response?.data?.message || '登录失败，请检查您的用户名和密码。';
    console.error("登录失败:", err);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.login-card {
  width: 400px;
}
.error-message {
  color: #f56c6c;
  margin-bottom: 1rem;
}
.switch-form {
  text-align: center;
  margin-top: 1rem;
}
</style>