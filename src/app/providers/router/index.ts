import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

//Middlewares
import { keepConnected } from '@/app/middlewares/keepConnected'
import { requireAuth } from '@/app/middlewares/requireAuth'
import AuthTemplate from '@/shared/ui/layouts/Auth.vue'
import DefaultTemplate from '@/shared/ui/layouts/Default.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'DefaultTemplate',
    component: DefaultTemplate,
    beforeEnter: requireAuth,
    children: [
      {
        path: '',
        name: 'RedirectLogin',
        redirect: '/auth/login',
        meta: { render: false },
      },
      {
        path: '/users',
        name: 'Users',
        meta: { render: true, menuLabel: 'Users' },
        component: () => import('@/pages/users/UsersView.vue'),
      },
      {
        path: '/profile',
        name: 'Profile',
        meta: { render: false, menuLabel: 'Profile' },
        component: () => import('@/pages/profile/ProfileView.vue'),
      },
    ],
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthTemplate,
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/pages/login/LoginView.vue'),
        beforeEnter: keepConnected,
      },
      {
        path: 'recover-password',
        name: 'RecoverPassword',
        component: () => import('@/pages/login/RecoverPasswordView.vue'),
      },
      {
        path: 'two-factor-auth',
        name: 'TwoFactorAuth',
        component: () => import('@/pages/login/2FAView.vue'),
      },
      {
        path: 'new-password',
        name: 'NewPassword',
        component: () => import('@/pages/login/NewPasswordView.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/auth/login',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Add global navigation guard to handle any navigation errors
router.onError((error) => {
  console.error('Router error:', error)
})

export default router
