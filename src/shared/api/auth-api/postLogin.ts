import { axiosClient } from '../config/http-client'
import type { Payload, Response } from './types/postLogin.types'

export async function postLogin(payload: Payload): Promise<Response> {
  const response = await axiosClient.request<Response>({
    endpoint: 'login',
    method: 'POST',
    body: payload,
  })
  return response.data
}

//Exemplo de uso do adaptador fetch
/* export async function postLoginWithFetch(payload: Payload): Promise<Response> {
  const response = await fetchClient.request<Response>({
    endpoint: 'login',
    method: 'POST',
    body: payload,
  })

  return response.data
} */
