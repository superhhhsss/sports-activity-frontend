<!-- src/views/Register.vue -->
<template>
  <div class="register-container">
    <div class="register-card card">
      <h2>注册</h2>
      <form @submit.prevent="handleRegister">
        <div v-if="error" class="error-message">{{ error }}</div>
        <div class="form-group">
          <label for="username">用户名</label>
          <input type="text" id="username" v-model="username" required>
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <button type="submit" class="button" :disabled="isLoading">{{ isLoading ? '注册中...' : '注册' }}</button>
      </form>
      <p class="switch-form">已有账号? <router-link to="/login">立即登录</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { register } from '../api';

const router = useRouter();
const username = ref('');
const password = ref('');
const error = ref(null);
const isLoading = ref(false);

async function handleRegister() {
  error.value = null;
  isLoading.value = true;
  try {
    await register({ username: username.value, password: password.value });
    alert('注册成功！现在您可以登录了。');
    router.push('/login');
  } catch (err) {
    error.value = err.response?.data?.message || '注册失败，用户名可能已被占用。';
    console.error("注册失败:", err);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.register-card {
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