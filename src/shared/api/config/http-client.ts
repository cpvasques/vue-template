import axios from 'axios'

import { AxiosHttpClientAdapter } from '@/app/api/axios-adapter'
import { FetchHttpClientAdapter } from '@/app/api/fetch-adapter'
import { addBearerTokenInterceptor } from '@/shared/api/config/interceptors/handleBearer'
import { unauthorizedTokenInterceptor } from '@/shared/api/config/interceptors/handleUnauthorized'

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
})

addBearerTokenInterceptor(axiosInstance)
unauthorizedTokenInterceptor(axiosInstance)

export const axiosClient = new AxiosHttpClientAdapter(axiosInstance)

//http client usando fetch nativo
export const fetchClient = new FetchHttpClientAdapter(
  import.meta.env.VITE_APP_BASE_URL,
)
