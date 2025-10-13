<template>
  <div class="blog-list">
    <ActionItem v-model="searchValue"/>
    <div class="list-wrapper">
      <BlogItem
        v-if="filteredBlogs.length > 0"
        v-for="blog in filteredBlogs"
        :key="blog.id"
        :blogData="blog"
      />
      <div class="empty-wrapper" v-else>
        <p>Пусто</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useBlogsStore } from '../store/blogs-store';
import ActionItem from './ActionItem.vue';
import BlogItem from './BlogItem.vue';
import type { BlogInterface } from '../interfaces/blog-interface';

const store = useBlogsStore()

const searchValue = ref<string>('')
const filteredBlogs = computed(() => {
  return store.blogsList.filter((b: BlogInterface) => b.title.toLowerCase().includes(searchValue.value))
})

onMounted(async() => {
  await store.fetchAllBlogs()
})
</script>

<style lang="scss" scoped>
.blog-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  max-width: 1100px;

  .list-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    gap: 10px;
    margin-top: 100px;
  }
}
</style>