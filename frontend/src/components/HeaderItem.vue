<template>
  <header class="header-item">
    <div class="header__user">
      <RouterLink to="/profile" class="user-link">
        <font-awesome-icon icon="fa-solid fa-user-circle" class="user__icon"/>
        <p class="user__mail">{{ store.user.email }}</p>
      </RouterLink>
      <RouterLink to="/" class="base-link" style="margin-bottom: 5px;">Главная</RouterLink>
      <button class="base-link" @click="logout">Выйти</button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth-store';

const router = useRouter()
const store = useAuthStore()

async function logout(): Promise<void> {
  await store.logout()
  router.push('/auth')
}
</script>

<style lang="scss" scoped>
.header-item {
  position: fixed;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  top: 0;
  left: 0;

  .header__user {
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

      .user__icon {
        width: 45px;
        height: 45px;
        color: var(--base-black);
      }

      .user__mail {
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
}
</style>