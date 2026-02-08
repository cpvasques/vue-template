import { axiosClient } from '../config/http-client'
import type { Response } from './types/deleteUser.types'

export async function deleteUser(id: string): Promise<Response> {
  const response = await axiosClient.request<Response>({
    endpoint: `users/${id}`,
    method: 'DELETE',
  })

  return response.data
}
