import type {} from '@/app/api/fetch-adapter'
import { addBearerTokenInterceptorFetch } from '@/shared/api/config/interceptors/handleBearer'
import { unauthorizedTokenInterceptorFetch } from '@/shared/api/config/interceptors/handleUnauthorized'

import type {
  HttpClient,
  HttpRequest,
  HttpResponse,
} from './types/http-client.types'

export class HttpClientError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly data: unknown,
    message?: string,
  ) {
    super(message)
    this.name = 'HttpClientError'
  }
}

export class FetchHttpClientAdapter implements HttpClient {
  constructor(private readonly baseURL?: string) {}

  async request<T = unknown>(data: HttpRequest): Promise<HttpResponse<T>> {
    const queryParams = new URLSearchParams()

    if (data.params) {
      Object.entries(data.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value))
        }
      })
    }

    const queryString = queryParams.toString()
      ? `?${queryParams.toString()}`
      : ''

    const url =
      new URL(data.endpoint || '', this.baseURL).toString() + queryString

    // Adiciona o token Bearer usando o interceptor
    const headers = addBearerTokenInterceptorFetch({
      'Content-Type': 'application/json',
      ...data.headers,
    })

    let fetchResponse: Response

    try {
      fetchResponse = await fetch(url, {
        method: data.method,
        body: data.body ? JSON.stringify(data.body) : undefined,
        headers,
      })
    } catch (err) {
      throw new HttpClientError(0, null, (err as Error).message)
    }

    // Aplica o interceptor de tratamento de token não autorizado
    fetchResponse = await unauthorizedTokenInterceptorFetch(fetchResponse)

    const isJson = fetchResponse.headers
      .get('content-type')
      ?.includes('application/json')

    const responseData = isJson ? await fetchResponse.json() : null

    if (!fetchResponse.ok) {
      throw new HttpClientError(
        fetchResponse.status,
        responseData,
        (responseData as any)?.message || fetchResponse.statusText,
      )
    }

    return {
      data: responseData as T,
      statusCode: fetchResponse.status,
    }
  }
}
