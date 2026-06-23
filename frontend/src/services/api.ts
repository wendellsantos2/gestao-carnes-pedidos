import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { resolveErrorMessage } from '../utils/errorMessages'

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    return Promise.reject(new Error(resolveErrorMessage(error)))
  },
)

export function getApiErrorMessage(error: unknown): string {
  return resolveErrorMessage(error)
}

export default api
