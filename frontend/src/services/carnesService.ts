import type { Carne, CreateCarnePayload, UpdateCarnePayload } from '../types'
import api from './api'

const BASE = '/carnes'

export async function listCarnes(): Promise<Carne[]> {
  const { data } = await api.get<Carne[]>(BASE)
  return data
}

export async function getCarne(id: string): Promise<Carne> {
  const { data } = await api.get<Carne>(`${BASE}/${id}`)
  return data
}

export async function createCarne(payload: CreateCarnePayload): Promise<Carne> {
  const { data } = await api.post<Carne>(BASE, payload)
  return data
}

export async function updateCarne(id: string, payload: UpdateCarnePayload): Promise<Carne> {
  const { data } = await api.put<Carne>(`${BASE}/${id}`, payload)
  return data
}

export async function deleteCarne(id: string): Promise<void> {
  await api.delete(`${BASE}/${id}`)
}
