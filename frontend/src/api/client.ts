import { Api } from './backendApi'

export const api = new Api({
  baseUrl: import.meta.env.VITE_API_URL,
})
