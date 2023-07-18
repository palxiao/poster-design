import { AxiosInstance } from 'axios'

interface myAxios {
  [propName: string]: any
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $ajax: myAxios
    $utils: Type.Object
  }
}
