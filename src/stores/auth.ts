import { defineStore } from 'pinia'

const defaultState = () => ({
  profile: {
    name: '',
  },
  token: '',
})

export const useUserStore = defineStore('user', {
  state: () => defaultState(),
  getters: {
    username: (state) => state.profile.name,
  },
  actions: {
    setToken(token: string) {
      this.token = token
    },
    setName(name: string) {
      this.profile.name = name
    },
  },
  persist: {
    storage: sessionStorage,
  },
})
