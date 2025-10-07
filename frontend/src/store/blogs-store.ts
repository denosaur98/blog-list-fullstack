import { defineStore } from 'pinia';
import axios from 'axios';
import type { BlogInterface } from '../interfaces/blog-interface';
import type { CommentInterface } from '../interfaces/comment-interface';

export const useBlogsStore = defineStore('blogs', {
  state: () => {
    return {
      blogsList: []
    }
  },

  actions: {
    async fetchAllBlogs() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/blogs`)

        this.blogsList = response.data.reverse()

        return response.data
      } catch(error) {
        console.error(`Ошибка при загрузке блогов: ${error}`)
      }
    },

    async createBlog(blog: BlogInterface) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/blogs`, blog)

        this.fetchAllBlogs()

        return response.data
      } catch(error) {
        console.error(`Ошибка при создании блога: ${error}`)
      }
    },

    async updateBlog(blogId: BlogInterface, blog: BlogInterface) {
      try {
        const response = await axios.patch(`${import.meta.env.VITE_API_URL}/blogs/${blogId}`, blog)

        this.fetchAllBlogs()

        return response.data
      } catch(error) {
        console.error(`Ошибка при создании блога: ${error}`)
      }
    },

    async addComment(blogId: BlogInterface, comment: CommentInterface) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/blogs/${blogId}/comments`, comment)

        this.fetchAllBlogs()

        return response.data
      } catch(error) {
        console.error(`Ошибка при добавлении комментария: ${error}`)
      }
    },

    async deleteBlog(id: BlogInterface) {
      try {
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}/blogs/${id}`)

        this.fetchAllBlogs()

        return response.data
      } catch(error) {
        console.error(`Ошибка при удалении блога: ${error}`)
      }
    }
  }
})