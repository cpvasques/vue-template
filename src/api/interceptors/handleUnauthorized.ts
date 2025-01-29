import type { AxiosInstance } from 'axios'
import { toast } from 'vue-sonner'

import router from '../../router'

export function unauthorizedTokenInterceptor($http: AxiosInstance) {
  $http.interceptors.response.use(
    (response) => response,
    (error) => {
      const errMsg = error.response?.data?.message || 'Erro desconhecido.'
      const httpStatus = error?.response?.status || 401

      if (httpStatus === 401 || httpStatus === 403) {
        localStorage.removeItem('token')
        sessionStorage.removeItem('token')

        router.push({ name: 'Login' })

        setTimeout(() => {
          toast.error(errMsg)
        }, 1000)
      }

      return Promise.reject(error)
    },
  )
}
