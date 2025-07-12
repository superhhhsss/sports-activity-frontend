<!-- src/components/CommentSection.vue -->
<template>
  <div class="comment-section card">
    <h4>活动评论</h4>
    <div v-if="user" class="comment-form">
      <textarea v-model="newComment" placeholder="发表你的看法..."></textarea>
      <button @click="submitComment" class="button">发表评论</button>
    </div>
    <p v-else>请<router-link to="/login">登录</router-link>后发表评论。</p>

    <div class="comment-list">
      <div v-if="comments.length === 0">暂无评论。</div>
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <p><strong>{{ comment.user.username }}</strong> <span class="time">{{ new Date(comment.createdAt).toLocaleString() }}</span></p>
        <p>{{ comment.content }}</p>
      </div>
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
const user = computed(() => store.state.user);

async function fetchComments() {
  try {
    const response = await getComments(props.activityId);
    comments.value = response.data;
  } catch (error) {
    console.error("获取评论失败:", error);
  }
}

async function submitComment() {
  if (!newComment.value.trim()) {
    alert('评论内容不能为空');
    return;
  }
  try {
    const response = await postComment(props.activityId, { content: newComment.value });
    comments.value.unshift(response.data); // 将新评论添加到列表顶部
    newComment.value = '';
  } catch (error) {
    console.error("发表评论失败:", error);
    alert('发表评论失败，请稍后再试。');
  }
}

onMounted(fetchComments);
</script>

<style scoped>
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
.comment-item {
  border-bottom: 1px solid #eee;
  padding: 15px 0;
}
.comment-item:last-child {
  border-bottom: none;
}
.comment-item p {
  margin: 5px 0;
}
.comment-item .time {
  font-size: 0.8rem;
  color: #999;
  margin-left: 10px;
}
</style>