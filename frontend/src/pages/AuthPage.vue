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
        <input class="base-input" placeholder="Введите почту:" v-model="email">
        <input class="base-input" placeholder="Введите имя:" v-model="name" v-if="changeButtonActive === 'register'">
        <input class="base-input" placeholder="Введите пароль:" v-model="password">
      </div>
      <button
        :class="validateForm ? 'base-button background-green' : 'base-button disabled'"
        type="button"
        style="width: 100%;"
        @click="auth"
        :disabled="!validateForm"
      >
        Отправить
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth-store';
import type { UserInterface } from '../interfaces/user-interface'

const router = useRouter()
const store = useAuthStore()

const changeButtonActive = ref<String>('login')
function changeFormType(type: string) {
  changeButtonActive.value = type
}

const email = ref<String>('')
const name = ref<String>('')
const password = ref<String>('')

const validateForm = computed(() => {
  if(email.value.trim() !== '' && password.value.trim() !== '') {
    return true
  } else {
    return false
  }
})

async function auth(): Promise<void> {
  const userReg: UserInterface = {
    email: email.value,
    name: name.value,
    password: password.value
  }
  const userLog: UserInterface = {
    email: email.value,
    password: password.value
  }

  const response = await store.auth(changeButtonActive.value, changeButtonActive.value === 'login' ? userLog : userReg)

  if(response === 'success') {
    router.push('/')
  }
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