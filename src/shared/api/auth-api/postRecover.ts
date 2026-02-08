import { axiosClient } from '../config/http-client.ts'
import type { Payload, Response } from './types/postRecover.types.ts'

export async function postRecover(payload: Payload): Promise<Response> {
  const response = await axiosClient.request<Response>({
    endpoint: 'recover',
    method: 'POST',
    body: payload,
  })
  return response.data
}
