import { defineStore } from 'pinia'

import { decodeJwtToken } from '@/app/utils/decodeJwt'

const defaultState = () => ({
  profile: {
    name: '',
    role: '',
    email: '',
  },
  token: '',
})

export const useAuthStore = defineStore('auth', {
  state: () => defaultState(),
  getters: {
    username: (state) => state.profile.name,
    userEmail: (state) => state.profile.email,
    userToken: (state) => state.token,
  },
  actions: {
    setToken(token: string) {
      this.token = token

      if (token) {
        this.setProfileFromToken(token)
        localStorage.setItem('accessToken', token)
      }
    },
    setName(name: string) {
      this.profile.name = name
    },
    setProfileFromToken(token: string) {
      const decoded = decodeJwtToken(token)

      if (decoded && decoded.name && decoded.email) {
        this.profile.name = decoded.name
        this.profile.email = decoded.email
      }
    },
    clearProfile() {
      this.profile.name = ''
      this.profile.email = ''
    },
    clearToken() {
      this.token = ''

      sessionStorage.clear()
      localStorage.clear()
    },
  },
  persist: {
    storage: sessionStorage,
  },
})
