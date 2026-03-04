import axios from 'axios'
import axiosRetry from 'axios-retry'

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT,
})

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (!error.response) {
      error.message = 'Network error'
      return Promise.reject(error)
    }

    const status = error.response.status

    switch (status) {
      case 401:
        console.log('Unauthorized')
        break
      case 403:
        console.log('Forbidden')
        break
      default:
        console.log('Server error')
    }

    console.log(extractErrorMessage(error))
    return Promise.reject(error)
  },
)

axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    if (!axios.isAxiosError(error)) return false

    console.log(extractErrorMessage(error))

    const status = error.response?.status

    return !status || status >= 500
  },
})

export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? error.message ?? 'Unexpected error'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Unexpected error'
}
