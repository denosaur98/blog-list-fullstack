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
        id: null as string | null,
        email: null as string | null,
        access_token: null as string | null,
        name: null as string | null,
        avatar: null as string | null
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
          name: response.data.name,
          avatar: response.data.avatar || null
        }

        notyf.success(`Вы вошли как ${this.user.name}`);

        return 'success'
      } catch(error: any) {
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
          id: response.data.userId,
          access_token: response.data.access_token,
          email: response.data.email,
          name: response.data.name,
          avatar: response.data.avatar
        }

        notyf.success(`Данные пользователя ${this.user.name} успешно обновлены`);

        return response.data
      } catch(error: any) {
        console.error(`Ошибка при редактировании пользователя: ${error.response?.data?.message}`)
        notyf.error(`Ошибка при редактировании пользователя: ${error.response?.data?.message}`);
      }
    },

    async deleteUser(agree: string): Promise<void> {
      alert(`${import.meta.env.VITE_API_URL}/auth/${this.user.id}?keepData=${agree}`)

      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/auth/${this.user.id}?keepData=${agree}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${this.user.access_token}`
            }
          }
        )

        await this.logout()
        notyf.success(`Пользователь ${this.user.name} успешно удалён`)

        response.data
      } catch(error: any) {
        console.error(`Ошибка при удалении пользователя: ${error.response?.data?.message}`)
        notyf.error(`Ошибка при удалении пользователя: ${error.response?.data?.message}`);
      }
    },

    async updateAvatar(file: File): Promise<void> {
      try {
        const formData = new FormData()
        formData.append('avatar', file)

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/avatar/${this.user.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "Authorization": `Bearer ${this.user.access_token}`
            }
          }
        )

        this.user.avatar = response.data.avatar
        notyf.success(`Аватарка успешно добавлена`)

        return response.data
      } catch(error: any) {
        console.error(`Ошибка при добавлении аватарки: ${error.response?.data?.message}`)
        notyf.error(`Ошибка при добавлении аватарки: ${error.response?.data?.message}`);
      }
    },

    async deleteAvatar() {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/auth/avatar/${this.user.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${this.user.access_token}`
            }
          }
        )

        this.user.avatar = response.data.avatar
        notyf.success(`Аватарка успешно удалена`)

        return response.data
      } catch(error: any) {
        console.error(`Ошибка при удалении аватарки: ${error.response?.data?.message}`)
        notyf.error(`Ошибка при удалении аватарки: ${error.response?.data?.message}`);
      }
    },

    async logout(): Promise<Object> {
      window.location.reload()

      return this.user = {
        id: null,
        email: null,
        access_token: null,
        name: null,
        avatar: null
      }
    }
  }
})