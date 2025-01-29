import { $http } from '@/api/axios'

import type { Output, Params } from './postLogin.types.ts'

export async function postLogin(params: Params): Promise<Output> {
  const response = await $http.post('login', params)
  return response.data
}
