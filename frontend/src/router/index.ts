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
    meta: { requiresGuest: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const store = useAuthStore()

  if(to.meta.requiresAuth && !store.user.access_token) {
    if(to.path !== '/auth') {
      next('/auth')
    } else {
      next()
    }
  } else if(to.meta.requiresGuest && store.user.access_token) {
    if(to.path !== '/') {
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router