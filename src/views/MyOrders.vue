<template>
  <div>
    <AppHeader />
    <main class="container">
      <h2>我的报名订单</h2>

      <!-- 阶段一：处理外层容器状态 -->
      <div v-if="isLoading" class="status-message">正在加载订单...</div>
      <div v-else-if="error" class="status-message error-message">{{ error }}</div>
      <div v-else-if="!orders || orders.length === 0" class="status-message">您还没有报名任何活动。</div>

      <!-- 阶段二：当确认有订单数据时，渲染列表 -->
      <div v-else class="orders-list">
        <!--
          使用 <template> 进行 v-for 循环。
          这是一种轻量级的做法，不会在 DOM 中创建额外的元素。
          我们在这里也做一个防御性判断 v-if="order"，确保不会渲染 null 或 undefined 的订单项。
        -->
        <template v-for="order in orders" :key="order ? order.id : Math.random()">
          <div v-if="order" class="card order-card">

            <!-- 阶段三：处理单条订单的两种渲染情况 -->

            <!-- 情况 A: 订单有效，且关联的活动也存在 -->
            <div v-if="order.activity" class="order-content">
              <h4>{{ order.activity.name }}</h4>
              <p><strong>报名时间:</strong> {{ formatDateTime(order.createdAt) }}</p>
              <p><strong>活动地点:</strong> {{ order.activity.location }}</p>
              <p><strong>活动开始时间:</strong> {{ formatDateTime(order.activity.startTime) }}</p>
              <router-link :to="`/activities/${order.activity.id}`" class="button">查看活动详情</router-link>
            </div>

            <!-- 情况 B: 订单有效，但关联的活动不存在 (activity is null) -->
            <div v-else class="order-content">
              <h4>关联的活动信息已失效</h4>
              <p><strong>报名时间:</strong> {{ formatDateTime(order.createdAt) }}</p>
              <p class="deleted-activity-warning">该活动可能已被管理员删除或信息已过期。</p>
            </div>

          </div>
        </template>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getMyOrders } from '../api';
import AppHeader from '../components/AppHeader.vue';

// --- 状态定义 ---
const orders = ref([]);
const isLoading = ref(true);
const error = ref(null);

// --- 辅助函数 ---
// 将所有日期格式化逻辑封装到一个函数中，使模板更干净
const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleString();
  } catch (e) {
    return '无效日期';
  }
};

// --- 数据获取逻辑 ---
async function fetchMyOrders() {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await getMyOrders();

    // 调试日志 (需要时取消注释)
    // console.log('[MyOrders.vue] Fetched raw data:', JSON.stringify(response.data, null, 2));

    // 确保返回的是一个数组，防止后端返回非数组类型的数据导致 .length 报错
    if (Array.isArray(response.data)) {
      orders.value = response.data;
    } else {
      console.error("API did not return an array for orders:", response.data);
      orders.value = [];
      error.value = "从服务器获取的数据格式不正确。";
    }

  } catch (err) {
    console.error("获取我的订单失败:", err);
    error.value = "无法加载您的订单，请稍后再试。";
  } finally {
    isLoading.value = false;
  }
}

// --- 生命周期钩子 ---
onMounted(fetchMyOrders);
</script>

<style scoped>
.status-message {
  text-align: center;
  color: #666;
  padding: 40px 0;
  font-size: 1.1rem;
}

.error-message {
  color: #f56c6c;
}

.order-card {
  margin-bottom: 20px;
}

.order-content {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.order-content h4 {
  margin-top: 0;
  color: #333;
}

.order-content p {
  margin: 5px 0 10px;
  color: #555;
  line-height: 1.5;
}

.order-content .button {
  align-self: flex-end;
  margin-top: 10px;
}

.deleted-activity-warning {
  color: #e6a23c; /* 使用警告黄，比红色柔和一些 */
  font-style: italic;
  margin-top: 10px;
}
</style>