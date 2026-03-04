import { Api } from './backendApi'
import { axiosInstance } from './axiosInstance'

export const api = new Api({
  customAxiosInstance: axiosInstance,
})

api.instance = axiosInstance
