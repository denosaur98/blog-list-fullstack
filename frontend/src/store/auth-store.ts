import { defineStore } from 'pinia';
import axios from 'axios';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      user: null
    }
  },

  actions: {
    async register() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/register`)

        return response.data
      } catch(error) {
        console.error(`Ошибка при регистрации: ${error}`)
        notyf.error(`Ошибка при регистрации: ${error}`);
      }
    },
  }
})