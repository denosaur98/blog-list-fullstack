import { createWebHistory, createRouter } from 'vue-router';
import { useAuthStore } from '../store/auth-store';
import AuthPage from '../pages/AuthPage.vue';
import HomePage from '../pages/HomePage.vue';
import UserPage from '../pages/UserPage.vue';

const routes = [
  {
    path: '/auth',
    component: AuthPage,
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    component: HomePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    component: UserPage,
    meta: { requiresAuth: true }
  },
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