import { Api } from './backendApi'
import { axiosInstance } from './axiosInstance'

export const api = new Api()

api.instance = axiosInstance
