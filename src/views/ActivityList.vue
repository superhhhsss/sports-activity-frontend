<!-- src/views/ActivityList.vue -->
<template>
  <div>
    <AppHeader />
    <main class="container">
      <h2>活动列表</h2>
      <SearchBar @search="performSearch" />
      <div v-if="isLoading">正在加载活动...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else-if="activities.length === 0">没有找到相关活动。</div>
      <div v-else class="activity-grid">
        <ActivityCard
            v-for="activity in activities"
            :key="activity.id"
            :activity="activity"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getActivities } from '../api';
import AppHeader from '../components/AppHeader.vue';
import SearchBar from '../components/SearchBar.vue';
import ActivityCard from '../components/ActivityCard.vue';

const activities = ref([]);
const isLoading = ref(true);
const error = ref(null);

async function fetchActivities(query = '') {
  isLoading.value = true;
  error.value = null;
  try {
    const params = {};
    if (query) {
      params.q = query;
    }
    const response = await getActivities(params);
    activities.value = response.data;
  } catch (err) {
    error.value = "无法加载活动列表，请稍后再试。";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
}

function performSearch(query) {
  fetchActivities(query);
}

onMounted(() => {
  fetchActivities();
});
</script>

<style scoped>
.activity-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
</style>