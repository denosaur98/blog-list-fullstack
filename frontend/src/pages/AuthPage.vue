<template>
  <div class="base-page">
    <form class="auth-form">
      <h2 class="base-title">{{ changeButtonActive === 'login' ? 'Авторизация' : 'Регистрация' }}</h2>
      <div class="form__change-wrapper">
        <button
          :class="changeButtonActive === 'login' ? 'change__action-button active' : 'change__action-button'"
          @click="changeFormType('login')"
          type="button"
        >
          Авторизация
        </button>
        <button
          :class="changeButtonActive === 'register' ? 'change__action-button active' : 'change__action-button'"
          @click="changeFormType('register')"
          type="button"
        >
          Регистрация
        </button>
      </div>
      <div class="form__actions-wrapper">
        <input class="base-input" placeholder="Введите почту:" v-model="mail">
        <input class="base-input" placeholder="Введите имя:" v-model="name" v-if="changeButtonActive === 'register'">
        <input class="base-input" placeholder="Введите пароль:" v-model="password">
      </div>
      <button class="base-button background-green" type="button" style="width: 100%;">Отправить</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../store/auth-store';

const router = useRoute()
const store = useAuthStore()

const changeButtonActive = ref<String>('login')
function changeFormType(type: string) {
  changeButtonActive.value = type
}

const mail = ref<String>('')
const name = ref<String>('')
const password = ref<String>('')

async function register() {

}
async function login() {
  
}
</script>

<style lang="scss" scoped>
.auth-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 30px 20px;
  background: var(--base-white);
  border: 1px solid var(--base-black);
  border-radius: 5px;
  width: 500px;
  height: 347px;

  @media (max-width: 900px) {
    width: 100%;
  }

  h2 { text-align: center; overflow: visible; }

  .form__change-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 30px;

    .change__action-button {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: none;
      color: var(--base-black);
      font-size: 15px;
      font-weight: 400;
      transition: .3s;

      &.active { color: var(--base-yellow); }

      @media (hover: hover) {
        &:hover {
          color: var(--base-yellow);
        }
      }
    }
  }

  .form__actions-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
    margin: 30px 0;
    gap: 10px;
  }
}
</style>