<!-- src/components/ActivityCard.vue -->
<template>
  <div class="activity-card card">
    <h3>{{ activity.name }}</h3>
    <p class="description">{{ activity.description }}</p>
    <div class="info">
      <span><strong>地点:</strong> {{ activity.location }}</span>
      <span><strong>时间:</strong> {{ new Date(activity.startTime).toLocaleString() }}</span>
    </div>
    <div class="footer">
      <span class="spots">剩余名额: {{ activity.capacity - (activity.enrolledCount || 0) }} / {{ activity.capacity }}</span>
      <router-link :to="`/activities/${activity.id}`" class="button">查看详情</router-link>
    </div>
  </div>
</template>

<script setup>
defineProps({
  activity: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.activity-card h3 {
  margin-top: 0;
}
.description {
  color: #666;
  min-height: 40px; /* 保持卡片高度相对一致 */
}
.info {
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
  color: #333;
  font-size: 0.9rem;
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #eee;
  padding-top: 15px;
  margin-top: 15px;
}
.spots {
  font-weight: bold;
  color: #e6a23c;
}
</style>