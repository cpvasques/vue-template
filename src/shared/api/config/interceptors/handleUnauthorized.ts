import type { AxiosInstance } from 'axios'
import { toast } from 'vue-sonner'

import { HttpClientError } from '@/app/api/fetch-adapter'

import router from '../../../../app/providers/router'

export function unauthorizedTokenInterceptor($http: AxiosInstance) {
  $http.interceptors.response.use(
    (response) => response,
    (error) => {
      const errMsg = error.response?.data?.message || 'Erro desconhecido.'
      const httpStatus = error?.response?.status || 401

      if (httpStatus === 401 || httpStatus === 403) {
        localStorage.removeItem('token')
        sessionStorage.removeItem('token')

        // router.push({ name: 'Login' })

        setTimeout(() => {
          toast.error(errMsg)
        }, 1000)
      }

      return Promise.reject(error)
    },
  )
}

// Interceptor para fetch
export async function unauthorizedTokenInterceptorFetch(response: Response) {
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')

    // router.push({ name: 'Login' })

    let errMsg = 'Erro desconhecido.'
    try {
      const data = await response.clone().json()
      errMsg = data?.message || errMsg
    } catch {
      console.warn('Falha ao ler o corpo da resposta como JSON.')
    }

    setTimeout(() => {
      toast.error(errMsg)
    }, 1000)

    throw new HttpClientError(response.status, null, errMsg)
  }

  return response
}
