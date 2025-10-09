import { defineStore } from 'pinia';
import { useAuthStore } from './auth-store';
import axios from 'axios';
import type { BlogInterface } from '../interfaces/blog-interface';
import type { CommentInterface } from '../interfaces/comment-interface';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf()

export const useBlogsStore = defineStore('blogs', {
  state: () => {
    return {
      token: useAuthStore().user.access_token,
      blogsList: [] as BlogInterface[]
    }
  },

  actions: {
    async fetchAllBlogs(): Promise<void> {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/blogs`)

        this.blogsList = response.data.reverse()

        return response.data
      } catch(error: any) {
        console.error(`Ошибка при загрузке блогов: ${error.response?.data?.message}`)
        notyf.error(`Ошибка при загрузке блогов: ${error.response?.data?.message}`);
      }
    },

    async createBlog(blog: BlogInterface): Promise<void> {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/blogs`,
          blog,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${this.token}`
            }
          }
        )

        this.fetchAllBlogs()

        notyf.success('Блог успешно создан');

        return response.data
      } catch(error: any) {
        console.error(`Ошибка при создании блога: ${error.response?.data?.message}`)
        notyf.error(`Ошибка при создании блога: ${error.response?.data?.message}`);
      }
    },

    async updateBlog(blogId: BlogInterface, blog: BlogInterface): Promise<void> {
      try {
        const response = await axios.patch(
          `${import.meta.env.VITE_API_URL}/blogs/${blogId}`,
          blog,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${this.token}`
            }
          }
        )

        this.fetchAllBlogs()

        notyf.success('Блог успешно обновлен!');

        return response.data
      } catch(error: any) {
        console.error(`Ошибка при обновлении блога: ${error.response?.data?.message}`)
        notyf.error(`Ошибка при обновлении блога: ${error.response?.data?.message}`);
      }
    },

    async addComment(blogId: BlogInterface, comment: CommentInterface): Promise<void> {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/blogs/${blogId}/comments`,
          comment,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${this.token}`
            }
          }
        )

        this.fetchAllBlogs()

        notyf.success('Комментарий успешно добавлен!');

        return response.data
      } catch(error: any) {
        console.error(`Ошибка при добавлении комментария: ${error.response?.data?.message}`)
        notyf.error(`Ошибка при добавлении комментария: ${error.response?.data?.message}`);
      }
    },

    async deleteBlog(id: BlogInterface): Promise<void> {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/blogs/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${this.token}`
            }
          }
        )

        this.fetchAllBlogs()

        notyf.success('Блог успешно удален!');

        return response.data
      } catch(error: any) {
        console.error(`Ошибка при удалении блога: ${error.response?.data?.message}`)
        notyf.error(`Ошибка при удалении блога: ${error.response?.data?.message}`);
      }
    }
  }
})