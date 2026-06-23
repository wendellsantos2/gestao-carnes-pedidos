export interface Carne {
  id: string
  nome: string
  tipo: string
  precoKg: number
  ativo: boolean
}

export interface CreateCarnePayload {
  nome: string
  tipo: string
  precoKg: number
}

export type UpdateCarnePayload = CreateCarnePayload

export interface Comprador {
  id: string
  nome: string
  email: string
  telefone: string
  endereco: string
}

export interface CreateCompradorPayload {
  nome: string
  email: string
  telefone: string
  endereco: string
}

export type UpdateCompradorPayload = CreateCompradorPayload

export interface PedidoItem {
  carneId: string
  nomeCarne: string
  quantidade: number
  precoUnitario: number
  subtotal: number
}

export interface Pedido {
  id: string
  dataPedido: string
  status: string
  comprador: Comprador
  items: PedidoItem[]
  total: number
}

export interface CreatePedidoItemPayload {
  carneId: string
  quantidade: number
}

export interface CreatePedidoPayload {
  compradorId: string
  items: CreatePedidoItemPayload[]
}

export interface UpdatePedidoPayload {
  status: string
  items: CreatePedidoItemPayload[]
}

export const PEDIDO_STATUS = ['Pendente', 'Confirmado', 'Cancelado'] as const
export type PedidoStatus = (typeof PEDIDO_STATUS)[number]
