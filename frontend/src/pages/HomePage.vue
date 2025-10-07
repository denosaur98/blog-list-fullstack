<template>
  <div class="home-page">
    <BlogsList/>
  </div>
</template>

<script setup lang="ts">
import BlogsList from '../components/BlogsList.vue';

</script>

<style lang="scss" scoped>
.home-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 50px;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background: #2A7B9B;
  background: linear-gradient(180deg,rgba(42, 123, 155, 1) 0%, rgba(87, 199, 133, 1) 50%, rgba(237, 221, 83, 1) 100%);

  @media (max-width: 900px) {
    padding: 50px 20px;
  }
}
</style>