import { axiosClient } from '../config/http-client.ts'
import type { Payload, Response } from './types/postTwoFactor.types.ts'

export async function postTwoFactor(payload: Payload): Promise<Response> {
  const response = await axiosClient.request<Response>({
    endpoint: '2fa',
    method: 'POST',
    body: payload,
  })
  return response.data
}
