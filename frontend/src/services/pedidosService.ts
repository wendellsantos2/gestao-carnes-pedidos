import type { CreatePedidoPayload, Pedido, UpdatePedidoPayload } from '../types'
import api from './api'

const BASE = '/pedidos'

export async function listPedidos(): Promise<Pedido[]> {
  const { data } = await api.get<Pedido[]>(BASE)
  return data
}

export async function getPedido(id: string): Promise<Pedido> {
  const { data } = await api.get<Pedido>(`${BASE}/${id}`)
  return data
}

export async function createPedido(payload: CreatePedidoPayload): Promise<Pedido> {
  const { data } = await api.post<Pedido>(BASE, payload)
  return data
}

export async function updatePedido(id: string, payload: UpdatePedidoPayload): Promise<Pedido> {
  const { data } = await api.put<Pedido>(`${BASE}/${id}`, payload)
  return data
}

export async function deletePedido(id: string): Promise<void> {
  await api.delete(`${BASE}/${id}`)
}
