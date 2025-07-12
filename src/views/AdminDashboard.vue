<!-- src/views/AdminDashboard.vue -->
<template>
  <div>
    <AppHeader />
    <main class="container">
      <h2>管理员后台 - 活动管理</h2>

      <div class="card">
        <h3>创建新活动</h3>
        <form @submit.prevent="handleCreateActivity">
          <div class="form-group">
            <label for="name">活动名称</label>
            <input type="text" id="name" v-model="newActivity.name" required>
          </div>
          <div class="form-group">
            <label for="description">活动描述</label>
            <textarea id="description" v-model="newActivity.description" rows="3" required></textarea>
          </div>
          <div class="form-group">
            <label for="location">活动地点</label>
            <input type="text" id="location" v-model="newActivity.location" required>
          </div>
          <div class="form-group">
            <label for="capacity">总名额</label>
            <input type="number" id="capacity" v-model.number="newActivity.capacity" required>
          </div>
          <div class="form-group">
            <label for="startTime">开始时间</label>
            <input type="datetime-local" id="startTime" v-model="newActivity.startTime" required>
          </div>
          <div class="form-group">
            <label for="endTime">结束时间</label>
            <input type="datetime-local" id="endTime" v-model="newActivity.endTime" required>
          </div>
          <button type="submit" class="button" :disabled="isCreating">
            {{ isCreating ? '创建中...' : '创建活动' }}
          </button>
        </form>
      </div>

      <!-- 未来可以添加活动列表管理、编辑、删除等功能 -->
      <div class="card">
        <h3>现有活动列表</h3>
        <p>此处将显示活动列表，并提供编辑和删除按钮。</p>
        <!-- 可以复用 ActivityList 的逻辑来显示，并加上管理按钮 -->
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { createActivity } from '../api';
import AppHeader from '../components/AppHeader.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isCreating = ref(false);
const newActivity = ref({
  name: '',
  description: '',
  location: '',
  capacity: 10,
  startTime: '',
  endTime: '',
});

async function handleCreateActivity() {
  isCreating.value = true;
  try {
    const activityData = {
      ...newActivity.value,
      // 确保时间格式是后端需要的 ISO 字符串
      startTime: new Date(newActivity.value.startTime).toISOString(),
      endTime: new Date(newActivity.value.endTime).toISOString(),
    };
    const response = await createActivity(activityData);
    alert('活动创建成功！');
    // 跳转到新创建活动的详情页
    router.push(`/activities/${response.data.id}`);
  } catch (error) {
    console.error("创建活动失败:", error);
    alert('创建活动失败: ' + (error.response?.data?.message || '未知错误'));
  } finally {
    isCreating.value = false;
  }
}
</script>

<style scoped>
/* AdminDashboard 特有样式 */
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-sizing: border-box;
}
</style>