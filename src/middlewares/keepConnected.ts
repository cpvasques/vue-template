import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export function keepConnected(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
): void {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')

  if (token) {
    next({ name: 'Home' })
  } else {
    next()
  }
}
