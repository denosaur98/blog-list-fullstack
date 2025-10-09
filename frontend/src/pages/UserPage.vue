<template>
  <div class="base-page">
    <HeaderItem/>
    <UserForm :type="'update'"/>
  </div>
</template>

<script setup lang="ts">
import HeaderItem from '../components/HeaderItem.vue';
import UserForm from '../components/UserForm.vue';

</script>

<style lang="scss" scoped>

</style>