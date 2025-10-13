<template>
  <form class="auth-form">
    <h2 class="base-title" v-html="formTypeTitle"></h2>
    <div class="form__change-wrapper" v-if="props.type === 'auth'">
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
    <div class="form__avatar-wrapper" v-if="props.type === 'update'">
      <AvatarItem/>
    </div>
    <div class="form__actions-wrapper">
      <div class="base-error-wrapper">
        <input class="base-input" placeholder="Введите почту:" v-model="email">
        <Transition name="fade">
          <p v-if="emailErrorMessage">{{ emailErrorMessage }}</p>
        </Transition>
      </div>
      <div class="base-error-wrapper" v-if="changeButtonActive === 'register' || props.type === 'update'">
        <input
          class="base-input"
          placeholder="Введите имя:"
          v-model="name"
        >
        <Transition name="fade">
          <p v-if="nameErrorMessage">{{ nameErrorMessage }}</p>
        </Transition>
      </div>
      <div class="base-error-wrapper">
        <div class="password__input-wrapper">
          <input
            class="base-input"
            :placeholder="props.type === 'auth' ? 'Введите пароль:' : 'Введите новый пароль:'"
            v-model="password"
            :type="isPasswordOpen ? 'text' : 'password'"
          >
          <Transition name="fade">
            <button
              v-if="password.trim() !== ''"
              class="open__password-button"
              @click="togglePassword"
              type="button"
            >
              <font-awesome-icon icon="fa-solid fa-eye"/>
            </button>
          </Transition>
        </div>
        <Transition name="fade">
          <p v-if="passwordErrorMessage">{{ passwordErrorMessage }}</p>
        </Transition>
      </div>
    </div>
    <div class="form__buttons-wrapper">
      <button
        :class="validateForm ? 'base-button background-green' : 'base-button disabled'"
        type="button"
        style="width: 100%;"
        @click="props.type === 'auth' ? auth() : updateUser()"
        :disabled="!validateForm"
      >
        Отправить
      </button>
      <button
        v-if="props.type === 'update'"
        class="base-button background-red"
        type="button"
        style="width: 100%;"
        @click="openConfirmPopup"
      >
        Удалить профиль
      </button>
    </div>
  </form>
  <Transition name="fade">
    <ConfirmPopup
      v-if="isConfirmPopupOpen"
      :type="'auth'"
      :confirmTitle="`Вы уверены что хотите удалить пользователя: <br><span>${name}</span> ?`"
      @close="closeConfirmPopup"
    />
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, onMounted, onUnmounted } from 'vue';
import { useSessionStorage } from '@vueuse/core';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth-store';
import type { UserInterface } from '../interfaces/user-interface';
import AvatarItem from './AvatarItem.vue';
import ConfirmPopup from './ConfirmPopup.vue';

const props = defineProps({
  type: {
    String,
    default: 'auth'
  }
})
const router = useRouter()
const store = useAuthStore()

let timerId: ReturnType<typeof setTimeout> | null = null
const isPasswordOpen = ref<boolean>(false)
function togglePassword() {
  isPasswordOpen.value = !isPasswordOpen.value

  if(timerId) {
    clearTimeout(timerId)
  }

  timerId = setTimeout(() => {
    isPasswordOpen.value = false
    timerId = null
  }, 5000)
}

const loginFormData = useSessionStorage('login-form', {
  email: '',
  password: ''
})
const registerFormData = useSessionStorage('register-form', {
  email: '',
  name: '',
  password: ''
})
const changeButtonActive = ref<string>('login')
function changeFormType(type: string) {
  if(timerId) {
    clearTimeout(timerId)
    timerId = null
  }

  isPasswordOpen.value = false

  saveCurrentFormData()

  changeButtonActive.value = type

  loadFormData()
}
function saveCurrentFormData() {
  if(props.type === 'auth') {
    if(changeButtonActive.value === 'login') {
      loginFormData.value = {
        email: email.value,
        password: password.value
      }
    } else if(changeButtonActive.value === 'register') {
      registerFormData.value = {
        email: email.value,
        name: name.value,
        password: password.value
      }
    }
  }
}
function loadFormData() {
  if(props.type === 'auth') {
    if(changeButtonActive.value === 'login') {
      email.value = loginFormData.value.email
      name.value = ''
      password.value = loginFormData.value.password
    } else if(changeButtonActive.value === 'register') {
      email.value = registerFormData.value.email
      name.value = registerFormData.value.name
      password.value = registerFormData.value.password
    }
  }
}

const formTypeTitle = computed<string>(() => {
  if(props.type === 'auth') {
    if(changeButtonActive.value === 'login') {
      return 'Авторизация'
    } else if (changeButtonActive.value === 'register') {
      return 'Регистрация'
    }
  } else if(props.type === 'update') {
    return `Редактировать пользователя\n<span>${store.user.email}</span>`
  }

  return ''
})

const email = ref<string>('')
const name = ref<string>('')
const password = ref<string>('')
const emailErrorMessage = ref<string>('')
const nameErrorMessage = ref<string>('')
const passwordErrorMessage = ref<string>('')

const validateForm = computed<boolean>(() => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  emailErrorMessage.value = ''
  nameErrorMessage.value = ''
  passwordErrorMessage.value = ''
  
  if(props.type === 'auth') {
    return validateAuth(emailRegex)
  } else if(props.type === 'update') {
    return validateUpdate(emailRegex)
  }

  return false
})
function validateAuth(emailValid: RegExp) {
  const errors = []

  if(email.value.trim() === '') {
    emailErrorMessage.value = 'Почта не может быть пустой'
    errors.push('email')
  } else if(!emailValid.test(email.value)) {
    emailErrorMessage.value = 'Некорректный формат почты'
    errors.push('email')
  }

  if(password.value.trim() === '') {
    passwordErrorMessage.value = 'Пароль не может быть пустым'
    errors.push('password')
  } else if(password.value.length < 5) {
    passwordErrorMessage.value = 'Пароль не может быть короче 5 символов'
    errors.push('password')
  }

  if(changeButtonActive.value === 'register' && name.value.trim() !== '' && name.value.trim().length < 2) {
    nameErrorMessage.value = 'Имя не может быть короче 2 символов'
    errors.push('name')
  }

  return errors.length === 0
}
function validateUpdate(emailValid: RegExp): boolean {
  const errors = []
  let hasValidChanges = false
  
  if (email.value.trim() !== '') {
    if (!emailValid.test(email.value)) {
      emailErrorMessage.value = 'Некорректный формат почты'
      errors.push('email')
    } else {
      hasValidChanges = true
    }
  }
  
  if (password.value.trim() !== '') {
    if (password.value.trim().length < 5) {
      passwordErrorMessage.value = 'Пароль не может быть короче 5 символов'
      errors.push('password')
    } else {
      hasValidChanges = true
    }
  }
  
  if (name.value.trim() !== '' && name.value.trim().length < 2) {
    nameErrorMessage.value = 'Имя не может быть короче 2 символов'
    errors.push('name')
  } else {
    hasValidChanges = true
  }
  
  return hasValidChanges && errors.length === 0
}

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
async function updateUser() {
  const newUserData: UserInterface = {
    email: email.value || '',
    name: name.value || '',
    password: password.value || ''
  }

  await store.updateUser(newUserData)

  email.value = store.user.email || ''
  name.value = store.user.name || ''
}

const isConfirmPopupOpen = ref(false)
function openConfirmPopup() {
  isConfirmPopupOpen.value = true
}
function closeConfirmPopup() {
  isConfirmPopupOpen.value = false
}

onMounted(() => {
  emailErrorMessage.value = ''
  nameErrorMessage.value = ''
  passwordErrorMessage.value = ''

  if(props.type === 'update') {
    email.value = store.user.email || ''
    name.value = store.user.name || ''
  }
})
onUnmounted(() => {
  if(timerId) {
    clearTimeout(timerId)
  }
})
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
  height: max-content;

  @media (max-width: 900px) {
    width: 100%;
  }

  h2 {
    text-align: center;
    overflow: visible;
    white-space: normal;
  }

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

  .form__avatar-wrapper {
    width: 120px;
    height: 150px;
  }

  .form__actions-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 150px;
    margin: 30px 0;
    gap: 20px;
  }

  .form__buttons-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 10px;

    @media (max-width: 600px) {
      flex-direction: column;
    }

    .background-red { color: var(--base-white); border: 1px solid var(--base-red); }
  }
}
</style>