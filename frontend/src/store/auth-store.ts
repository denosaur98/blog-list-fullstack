import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import axios from 'axios';
import type { UserInterface } from '../interfaces/user-interface';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf()

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      user: useLocalStorage('user', {
        email: null,
        access_token: null
      })
    }
  },

  actions: {
    async auth(type: string, authUser: UserInterface) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/${type}`, authUser)

        this.user = {
          access_token: response.data.access_token,
          email: response.data.email,
        }

        return 'success'
      } catch(error) {
        console.error(`Ошибка при ${type === 'login' ? 'авторизации' : 'регистрации'}: ${error}`)
        notyf.error(`Ошибка при ${type === 'login' ? 'авторизации' : 'регистрации'}: ${error}`);
      }
    },

    async logout(): Promise<Object> {
      return this.user = {
        email: null,
        access_token: null
      }
    }
  }
})