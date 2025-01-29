import { defineStore } from 'pinia'
import type { Ref } from 'vue'
import { ref } from 'vue'

interface LoaderState {
  loading: Ref<boolean>
}

export const useLoaderStore = defineStore('loader', {
  state: (): LoaderState => ({
    loading: ref(false),
  }),
  actions: {
    show() {
      this.loading = true
    },
    hide() {
      this.loading = false
    },
  },
})
