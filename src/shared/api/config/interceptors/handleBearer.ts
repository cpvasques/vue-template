import type { AxiosInstance } from 'axios'

export function addBearerTokenInterceptor($http: AxiosInstance) {
  $http.interceptors.request.use((config) => {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  })
}

//Interceptor para fetch
export function addBearerTokenInterceptorFetch(headers: HeadersInit = {}) {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')

  if (token) {
    return {
      ...headers,
      Authorization: `Bearer ${token}`,
    }
  }

  return headers
}
