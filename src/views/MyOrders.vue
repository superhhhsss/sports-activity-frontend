<!-- src/views/MyOrders.vue -->
<template>
  <div>
    <AppHeader />
    <main class="container">
      <h2>我的报名订单</h2>
      <div v-if="isLoading">正在加载订单...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else-if="orders.length === 0">您还没有报名任何活动。</div>
      <div v-else>
        <div v-for="order in orders" :key="order.id" class="card order-card">
          <h4>{{ order.activity.name }}</h4>
          <p><strong>报名时间:</strong> {{ new Date(order.createdAt).toLocaleString() }}</p>
          <p><strong>活动地点:</strong> {{ order.activity.location }}</p>
          <p><strong>活动开始时间:</strong> {{ new Date(order.activity.startTime).toLocaleString() }}</p>
          <router-link :to="`/activities/${order.activity.id}`" class="button">查看活动详情</router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getMyOrders } from '../api';
import AppHeader from '../components/AppHeader.vue';

const orders = ref([]);
const isLoading = ref(true);
const error = ref(null);

async function fetchMyOrders() {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await getMyOrders();
    orders.value = response.data;
  } catch (err) {
    error.value = "无法加载您的订单。";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchMyOrders);
</script>

<style scoped>
.order-card {
  display: flex;
  flex-direction: column;
}
.order-card h4 {
  margin-top: 0;
}
.order-card .button {
  align-self: flex-end; /* 按钮靠右 */
  margin-top: 10px;
}
</style>