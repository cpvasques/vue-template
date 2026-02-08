import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export function keepConnected(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
): void {
  try {
    const token =
      localStorage.getItem('accessToken') ||
      sessionStorage.getItem('accessToken')

      next()

    // if (token) {
    //   // Se já está logado, redireciona para a rota principal
    //   next({ name: 'Users' })
    // } else {
    //   // Se não está logado, permite acesso à página de login
    //   next()
    // }
  } catch (error) {
    console.error('Error in keepConnected middleware:', error)
    next()
  }
}
