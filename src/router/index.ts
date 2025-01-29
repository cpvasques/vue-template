import { createRouter, createWebHistory } from 'vue-router'

import DefaultTemplate from '@/layouts/Default.vue'
//Middlewares
import { keepConnected } from '@/middlewares/keepConnected.ts'

export const routes = [
  {
    path: '/',
    name: 'DefaultTemplate',
    component: DefaultTemplate,
    children: [
      {
        path: '/',
        name: 'Home',
        menuLabel: 'Home',
        component: () => import('../views/HomeView.vue'),
      },

      {
        path: '/about',
        name: 'About',
        menuLabel: 'Sobre',
        component: () => import('../views/AboutView.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    beforeEnter: keepConnected,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
