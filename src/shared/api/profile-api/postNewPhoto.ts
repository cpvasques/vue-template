import { axiosClient } from '../config/http-client.ts'
import type { Payload } from './types/postNewPhoto.types.ts'

export async function postNewPhoto(payload: Payload): Promise<Response> {
  const response = await axiosClient.request<Response>({
    endpoint: '/users/change-photo',
    method: 'POST',
    body: payload,
  })

  return response.data
}
