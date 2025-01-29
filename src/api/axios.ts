import axios from 'axios'

import { addBearerTokenInterceptor } from './interceptors/handleBearer'
import { unauthorizedTokenInterceptor } from './interceptors/handleUnauthorized'

export const $http = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
})

addBearerTokenInterceptor($http)
unauthorizedTokenInterceptor($http)
