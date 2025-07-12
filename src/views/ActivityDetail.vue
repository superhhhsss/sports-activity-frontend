<!-- sports-activity-frontend/src/views/ActivityDetail.vue -->
<template>
  <div>
    <AppHeader />
    <main class="container">
      <div v-if="isLoading">正在加载...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else-if="activity" class="activity-detail-card card">
        <h2>{{ activity.name }}</h2>
        <p class="description">{{ activity.description }}</p>
        <ul class="info-list">
          <li><strong>地点:</strong> {{ activity.location }}</li>
          <li><strong>开始时间:</strong> {{ new Date(activity.startTime).toLocaleString() }}</li>
          <li><strong>结束时间:</strong> {{ new Date(activity.endTime).toLocaleString() }}</li>
          <li><strong>总名额:</strong> {{ activity.capacity }}</li>
          <li><strong>已报名:</strong> {{ activity.enrolledCount || 0 }}</li>
        </ul>

        <!-- 操作按钮区域 -->
        <div class="actions">
          <button v-if="canEnroll" @click="handleEnroll" class="button" :disabled="isEnrolling">
            {{ isEnrolling ? '报名中...' : '立即报名' }}
          </button>

          <!-- 管理员删除按钮 -->
          <button v-if="user && user.role === 'admin'" @click="handleDelete" class="button button-danger" :disabled="isDeleting">
            {{ isDeleting ? '删除中...' : '删除此活动' }}
          </button>
        </div>

        <!-- 提示信息区域 -->
        <p v-if="!user && !activity.isPast">请<router-link to="/login">登录</router-link>后报名</p>
        <p v-if="isFull" class="full-message">名额已满！</p>
        <p v-if="activity.isPast" class="past-message">活动已结束。</p>

      </div>

      <CommentSection :activity-id="id" />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router'; // 导入 useRouter
import { getActivityById, enrollActivity, deleteActivity } from '../api'; // 导入 deleteActivity
import store from '../store';
import AppHeader from '../components/AppHeader.vue';
import CommentSection from '../components/CommentSection.vue';

// --- Props 和 Router ---
const props = defineProps({
  id: {
    type: String,
    required: true
  }
});
const router = useRouter();

// --- 组件状态 (Refs) ---
const activity = ref(null);
const isLoading = ref(true);
const isEnrolling = ref(false);
const isDeleting = ref(false); // 新增删除状态
const error = ref(null);

// --- 计算属性 (Computed) ---
const user = computed(() => store.state.user);

const isFull = computed(() => {
  return activity.value && (activity.value.enrolledCount || 0) >= activity.value.capacity;
});

// 新增计算属性，判断活动是否已结束
const isPast = computed(() => {
  return activity.value && new Date(activity.value.endTime) < new Date();
});

const canEnroll = computed(() => {
  // 必须是登录用户、名额未满、活动未结束
  return user.value && !isFull.value && !isPast.value;
});

// --- 方法 (Functions) ---
async function fetchActivity() {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await getActivityById(props.id);
    // 在这里直接给 activity 对象添加一个 isPast 属性，方便模板使用
    activity.value = {
      ...response.data,
      isPast: new Date(response.data.endTime) < new Date()
    };
  } catch (err) {
    error.value = "无法加载活动详情。该活动可能已被删除。";
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

// 新增的删除方法
async function handleDelete() {
  if (!confirm('确定要删除这个活动吗？所有相关的报名和评论记录都将被永久删除！')) {
    return;
  }
  isDeleting.value = true;
  try {
    await deleteActivity(props.id);
    alert('活动已成功删除');
    router.push('/activities'); // 删除后跳转回活动列表
  } catch (error) {
    console.error('删除活动失败:', error);
    alert('删除失败：' + (error.response?.data?.message || '未知错误'));
  } finally {
    isDeleting.value = false;
  }
}

// ---生命周期钩子 ---
onMounted(fetchActivity);
</script>

<style scoped>
.description {
  color: #555;
  line-height: 1.6;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 20px 0;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.info-list li {
  margin-bottom: 10px;
  font-size: 1rem;
}

.actions {
  display: flex;
  gap: 10px; /* 按钮之间的间距 */
  margin-top: 20px;
}

.full-message, .past-message {
  color: #f56c6c;
  font-weight: bold;
  margin-top: 15px;
}
</style>