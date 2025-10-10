<template>
  <header class="header__user">
    <RouterLink to="/profile" class="user-link">
      <div class="user__avatar-wrapper">
        <img
          :src="getAvatarPath(store.user.avatar)"
          class="user__icon"
          v-if="store.user.avatar"
        >
        <font-awesome-icon
          v-else
          icon="fa-solid fa-user-circle"
          class="user__icon"
        />
      </div>
      <p class="user__info">{{ store.user.email }}</p>
      <p class="user__info">{{ store.user.name }}</p>
    </RouterLink>
    <RouterLink to="/" class="base-link" style="margin-bottom: 5px;">Главная</RouterLink>
    <button class="base-link" @click="logout">Выйти</button>
  </header>
</template>

<script setup lang="ts">
import { RouterLink, useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../store/auth-store';
import { getAvatarPath } from '../utils/avatar-path.ts';

const router = useRouter()
const route = useRoute()
const store = useAuthStore()

async function logout(): Promise<void> {
  await store.logout()
  router.push('/auth')
}
</script>

<style lang="scss" scoped>
.header__user {
  position: fixed;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: var(--base-white);
  box-shadow: 1px 1px 5px 1px var(--base-black);
  border-radius: 5px;
  width: 150px;
  padding: 10px;

  .user-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 15px;
    text-decoration: none;
    width: 100%;
    gap: 5px;

    .user__avatar-wrapper {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      overflow: hidden;

      .user__icon {
        width: 100%;
        height: 100%;
        color: var(--base-black);
        object-fit: cover;
      }
    }

    .user__info {
      font-size: 12px;
      font-weight: 400;
      color: var(--base-black);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
      width: 100%;
    }
  }
}
</style>