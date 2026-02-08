import { axiosClient } from '../config/http-client.ts'
import type { Payload, Response } from './types/postNewUser.types.ts'

export async function postNewUser(payload: Payload): Promise<Response> {
  const response = await axiosClient.request<Response>({
    endpoint: 'user',
    method: 'POST',
    body: payload,
  })
  return response.data
}
