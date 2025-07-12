<template>
  <div class="comment-section card">
    <h4>活动评论</h4>
    <div v-if="user" class="comment-form">
      <textarea v-model="newComment" placeholder="发表你的看法..."></textarea>
      <button @click="submitComment" class="button" :disabled="isSubmitting">{{ isSubmitting ? '发表中...' : '发表评论' }}</button>
    </div>
    <p v-else>请<router-link to="/login">登录</router-link>后发表评论。</p>

    <div class="comment-list">
      <div v-if="!comments || comments.length === 0" class="no-comments">暂无评论。</div>

      <template v-for="comment in comments" :key="comment ? comment.id : Math.random()">
        <div v-if="comment" class="comment-item">
          <p class="comment-header">
            <strong>{{ comment.user ? comment.user.username : '匿名用户' }}</strong>
            <span v-if="comment.createdAt" class="time">{{ new Date(comment.createdAt).toLocaleString() }}</span>
          </p>
          <p class="comment-content">{{ comment.content }}</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getComments, postComment } from '../api';
import store from '../store';

const props = defineProps({
  activityId: {
    type: [String, Number],
    required: true,
  }
});

const comments = ref([]);
const newComment = ref('');
const isSubmitting = ref(false); // 添加一个提交状态，防止重复点击
const user = computed(() => store.state.user);

async function fetchComments() {
  try {
    const response = await getComments(props.activityId);
    if (Array.isArray(response.data)) {
      comments.value = response.data;
    }
  } catch (error) {
    console.error("获取评论失败:", error);
  }
}

async function submitComment() {
  // 检查是否正在提交
  if (isSubmitting.value) return;

  // 严谨输入检查
  if (!newComment.value || typeof newComment.value.trim !== 'function' || !newComment.value.trim()) {
    alert('评论内容不能为空');
    return;
  }

  isSubmitting.value = true;
  try {
    const response = await postComment(props.activityId, { content: newComment.value });

    // 确保返回的数据有效再添加到列表
    if (response.data && response.data.id) {
      comments.value.unshift(response.data);
    }

    newComment.value = '';
  } catch (error) {
    console.error("发表评论失败:", error);
    alert('发表评论失败，请稍后再试。');
  } finally {
    isSubmitting.value = false; // 无论成功失败，最后都恢复提交状态
  }
}

onMounted(fetchComments);
</script>

<style scoped>
/* 样式部分保持不变，或者使用你之前的样式 */
.comment-form {
  margin-bottom: 20px;
}
.comment-form textarea {
  width: 100%;
  min-height: 80px;
  padding: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-sizing: border-box;
  margin-bottom: 10px;
}
.comment-list {
  margin-top: 20px;
}
.no-comments {
  color: #999;
  text-align: center;
  padding: 20px 0;
}
.comment-item {
  border-bottom: 1px solid #eee;
  padding: 15px 0;
}
.comment-item:last-child {
  border-bottom: none;
}
.comment-item p {
  margin: 0;
}
.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.comment-header strong {
  color: #333;
}
.comment-header .time {
  font-size: 0.8rem;
  color: #999;
}
.comment-content {
  color: #666;
  line-height: 1.6;
  white-space: pre-wrap; /* 保留换行和空格 */
}
</style>