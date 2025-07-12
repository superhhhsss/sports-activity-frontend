<!-- src/components/SearchBar.vue -->
<template>
  <div class="search-bar">
    <input
        type="text"
        v-model="query"
        @keyup.enter="handleSearch"
        placeholder="搜索活动名称或描述..."
    />
    <button @click="handleSearch" class="button">搜索</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const query = ref('');
const emit = defineEmits(['search']);

function handleSearch() {
  emit('search', query.value);
}
</script>

<style scoped>
.search-bar {
  display: flex;
  margin-bottom: 20px;
}
.search-bar input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
}
.search-bar button {
  border-radius: 0 4px 4px 0;
}
</style>