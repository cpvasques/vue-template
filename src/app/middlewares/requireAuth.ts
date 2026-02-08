import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export function requireAuth(
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
    //   next()
    // } else {
    //   next({ name: 'Login' })
    // }
  } catch (error) {
    console.error('Error in requireAuth middleware:', error)
    // next({ name: 'Login' })
    next()
  }
}
