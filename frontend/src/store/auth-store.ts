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
        id: null,
        email: null,
        access_token: null,
        name: null
      })
    }
  },

  actions: {
    async auth(type: string, authUser: UserInterface) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/${type}`, authUser)

        this.user = {
          id: response.data.userId,
          access_token: response.data.access_token,
          email: response.data.email,
          name: response.data.name
        }

        return 'success'
      } catch(error) {
        console.error(`Ошибка при ${type === 'login' ? 'авторизации' : 'регистрации'}: ${error.response?.data?.message}`)
        notyf.error(`Ошибка при ${type === 'login' ? 'авторизации' : 'регистрации'}: ${error.response?.data?.message}`);
      }
    },

    async updateUser(newUserData: UserInterface): Promise<void> {
      try {
        const response = await axios.patch(
          `${import.meta.env.VITE_API_URL}/auth/${this.user.id}`,
          newUserData,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${this.user.access_token}`
            }
          }
        )

        this.user = {
          id: response.data.id,
          access_token: response.data.access_token,
          email: response.data.email,
          name: response.data.name
        }

        return response.data
      } catch(error) {
        console.error(`Ошибка при редактировании пользователя: ${error.response?.data?.message}`)
        notyf.error(`Ошибка при редактировании пользователя: ${error.response?.data?.message}`);
      }
    },

    async logout(): Promise<Object> {
      return this.user = {
        id: null,
        email: null,
        access_token: null,
        name: null
      }
    }
  }
})