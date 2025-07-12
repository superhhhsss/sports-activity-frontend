<!-- src/views/ActivityDetail.vue -->
<template>
  <div>
    <AppHeader />
    <main class="container">
      <div v-if="isLoading">正在加载...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else-if="activity" class="activity-detail-card card">
        <h2>{{ activity.name }}</h2>
        <p>{{ activity.description }}</p>
        <ul>
          <li><strong>地点:</strong> {{ activity.location }}</li>
          <li><strong>开始时间:</strong> {{ new Date(activity.startTime).toLocaleString() }}</li>
          <li><strong>结束时间:</strong> {{ new Date(activity.endTime).toLocaleString() }}</li>
          <li><strong>总名额:</strong> {{ activity.capacity }}</li>
          <li><strong>已报名:</strong> {{ activity.enrolledCount || 0 }}</li>
        </ul>
        <button v-if="canEnroll" @click="handleEnroll" class="button" :disabled="isEnrolling">
          {{ isEnrolling ? '报名中...' : '立即报名' }}
        </button>
        <p v-if="!user">请<router-link to="/login">登录</router-link>后报名</p>
        <p v-else-if="isFull" class="full-message">名额已满！</p>
      </div>

      <CommentSection :activity-id="id" />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getActivityById, enrollActivity } from '../api';
import store from '../store';
import AppHeader from '../components/AppHeader.vue';
import CommentSection from '../components/CommentSection.vue';

const props = defineProps({
  id: {
    type: String,
    required: true
  }
});

const activity = ref(null);
const isLoading = ref(true);
const isEnrolling = ref(false);
const error = ref(null);
const user = computed(() => store.state.user);

const isFull = computed(() => {
  return activity.value && (activity.value.enrolledCount || 0) >= activity.value.capacity;
});

const canEnroll = computed(() => {
  return user.value && !isFull.value;
});

async function fetchActivity() {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await getActivityById(props.id);
    activity.value = response.data;
  } catch (err) {
    error.value = "无法加载活动详情。";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
}

async function handleEnroll() {
  isEnrolling.value = true;
  try {
    await enrollActivity(props.id);
    alert('报名成功！');
    // 报名成功后，更新页面上的报名人数
    if(activity.value.enrolledCount !== undefined) {
      activity.value.enrolledCount++;
    } else {
      activity.value.enrolledCount = 1;
    }
  } catch (err) {
    alert(err.response?.data?.message || '报名失败，可能您已报名或名额已满。');
    console.error(err);
  } finally {
    isEnrolling.value = false;
  }
}

onMounted(fetchActivity);
</script>

<style scoped>
.activity-detail-card ul {
  list-style: none;
  padding: 0;
}
.activity-detail-card li {
  margin-bottom: 10px;
}
.full-message {
  color: #f56c6c;
  font-weight: bold;
}
</style>