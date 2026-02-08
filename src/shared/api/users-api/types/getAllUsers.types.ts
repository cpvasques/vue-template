export type Params = {
  page?: number
  perPage?: number
}

export type Pagination = {
  page: number
  pages: number
  perPage: number
  total: number
}

export type User = {
  id: string
  name: string
  email: string
  phone: string
  status: boolean
  createdAt: string
  avatar?: string
}
export type Response = {
  users: User[]
  pagination: Pagination
}
