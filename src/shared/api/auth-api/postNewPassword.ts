import { axiosClient } from '../config/http-client'
import type { Payload } from './types/postNewPassword.types'

export async function postNewPassword(payload: Payload): Promise<Response> {
  const response = await axiosClient.request<Response>({
    endpoint: 'new-password',
    method: 'POST',
    body: payload,
  })
  return response.data
}
