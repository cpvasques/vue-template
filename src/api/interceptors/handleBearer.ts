import type { AxiosInstance } from 'axios'

export function addBearerTokenInterceptor($http: AxiosInstance) {
  $http.interceptors.request.use((config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  })
}
