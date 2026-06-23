import type { Comprador, CreateCompradorPayload, UpdateCompradorPayload } from '../types'
import api from './api'

const BASE = '/compradores'

export async function listCompradores(): Promise<Comprador[]> {
  const { data } = await api.get<Comprador[]>(BASE)
  return data
}

export async function getComprador(id: string): Promise<Comprador> {
  const { data } = await api.get<Comprador>(`${BASE}/${id}`)
  return data
}

export async function createComprador(payload: CreateCompradorPayload): Promise<Comprador> {
  const { data } = await api.post<Comprador>(BASE, payload)
  return data
}

export async function updateComprador(
  id: string,
  payload: UpdateCompradorPayload,
): Promise<Comprador> {
  const { data } = await api.put<Comprador>(`${BASE}/${id}`, payload)
  return data
}

export async function deleteComprador(id: string): Promise<void> {
  await api.delete(`${BASE}/${id}`)
}
