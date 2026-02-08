import { axiosClient } from '../config/http-client'
import type { Params, Response } from './types/getAllUsers.types'

export async function getAllUsers(params: Params): Promise<Response> {
  const response = await axiosClient.request<Response>({
    endpoint: `users`,
    method: 'GET',
    params,
  })
  return response.data
}
