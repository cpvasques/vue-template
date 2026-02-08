export interface HttpClient {
  request: (data: HttpRequest) => Promise<unknown>
}

export interface HttpRequest {
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  params?: Record<string, unknown>
  headers?: Record<string, string>
}

export interface HttpResponse<T = unknown> {
  data: T
  statusCode: number
}
