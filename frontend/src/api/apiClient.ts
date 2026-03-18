import { Api } from './backendApi'
import { axiosInstance } from './axiosInstance'

// Single shared API client — all gateways use this instance.
// The axiosInstance carries auth headers, retry logic, and error interceptors.
export const api = new Api({ baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5062' })
api.instance = axiosInstance
