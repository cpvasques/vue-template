import { AxiosError, type AxiosInstance, type AxiosResponse } from 'axios'

import type {
  HttpClient,
  HttpRequest,
  HttpResponse,
} from './types/http-client.types'

export class AxiosHttpClientAdapter implements HttpClient {
  constructor(private readonly axiosInstance: AxiosInstance) {}
  async request<T = unknown>(data: HttpRequest): Promise<HttpResponse<T>> {
    let axiosResponse: AxiosResponse
    try {
      axiosResponse = await this.axiosInstance.request({
        url: data.endpoint,
        method: data.method,
        data: data.body,
        params: data.params,
        headers: data.headers,
      })
    } catch (err) {
      const _error = err as AxiosError<{ message: string }>
      throw new Error(_error.response?.data?.message)
    }

    return {
      data: axiosResponse.data,
      statusCode: axiosResponse.status,
    }
  }
}
