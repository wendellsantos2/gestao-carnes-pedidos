import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

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
    const message =
      error.response?.data?.message ??
      error.message ??
      'Erro ao comunicar com a API.'

    return Promise.reject(new Error(message))
  },
)

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return 'Erro desconhecido.'
}

export default api
