import { axiosClient } from '../config/http-client'
import type { Payload, Response } from './types/postResendCode.types'

export const postResendCode = async (payload: Payload): Promise<Response> => {
  const response = await axiosClient.request<Response>({
    endpoint: 'login',
    method: 'POST',
    body: payload,
  })
  return response.data
}
