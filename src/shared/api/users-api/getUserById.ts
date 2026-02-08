import { axiosClient } from '../config/http-client'
import type { Response } from './types/getUserById.types'

export async function getUserById(id: string): Promise<Response> {
  const response = await axiosClient.request<Response>({
    endpoint: `users/${id}`,
    method: 'GET',
  })

  return response.data
}
