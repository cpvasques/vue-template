import { vMaska } from 'maska/vue'
import type { App } from 'vue'

export default {
  install(app: App): void {
    app.directive('maska', vMaska)
  },
}
