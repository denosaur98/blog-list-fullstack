<template>
  <header class="header-item">
    <div class="header__user">
      <font-awesome-icon icon="fa-solid fa-user-circle" class="user__icon"/>
      <p class="user__mail">{{ store.user.email }}</p>
      <button class="logout__action-button" @click="logout">Выйти</button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
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
    padding: 10px;
    gap: 10px;

    .user__icon {
      width: 40px;
      height: 40px;
      color: var(--base-black);
    }

    .user__mail {
      font-size: 12px;
      font-weight: 400;
      color: var(--base-black);
      margin-top: 5px 0 15px;
    }

    .logout__action-button {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: none;
      font-size: 15px;
      font-weight: 400;
      color: var(--base-black);
    }
  }
}
</style>