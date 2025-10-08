import { createWebHistory, createRouter } from 'vue-router';
import { useAuthStore } from '../store/auth-store';
import HomePage from '../pages/HomePage.vue';
import AuthPage from '../pages/AuthPage.vue';

const routes = [
  {
    path: '/',
    component: HomePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/auth',
    component: AuthPage,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const store = useAuthStore()

  if(to.meta.requiresAuth && !store.user.access_token) {
    next('/auth')
  } else if(to.meta.requiresAuth && store.user.access_token) {
    next('/')
  } else {
    next()
  }
})

export default router