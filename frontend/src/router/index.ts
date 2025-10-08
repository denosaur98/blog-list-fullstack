import { createWebHistory, createRouter } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import AuthPage from '../pages/AuthPage.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/auth', component: AuthPage }
]

export default createRouter({
  history: createWebHistory(),
  routes,
})