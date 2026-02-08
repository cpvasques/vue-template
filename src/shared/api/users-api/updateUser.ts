import { axiosClient } from '../config/http-client'
import type { Payload } from './types/updateUser.types'

export async function updateUser(params: Payload) {
  const id = params.id
  const response = await axiosClient.request<Response>({
    endpoint: `users/${id}`,
    method: 'PUT',
    body: params,
  })

  return response.data
}
