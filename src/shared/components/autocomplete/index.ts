import type { GenericObject } from 'vee-validate'

export { default as Autocomplete } from './Autocomplete.vue'

export interface Option {
  value: string | number | GenericObject
  label: string
}
