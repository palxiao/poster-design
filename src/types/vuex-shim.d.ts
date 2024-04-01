import { ComponentCustomProperties } from 'vue'

declare module '@vue/runtime-core' {
  // Declare your own store states.
  interface State {
    count: number
  }
}
