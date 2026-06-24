export type OrigemCarne = 'Bovina' | 'Suína' | 'Aves' | 'Peixes'

export const ORIGENS_CARNE: OrigemCarne[] = ['Bovina', 'Suína', 'Aves', 'Peixes']

export interface Carne {
  id: string
  nome: string
  origem: OrigemCarne
  precoKg: number
  ativo: boolean
}

export interface CreateCarnePayload {
  nome: string
  origem: OrigemCarne
}

export type UpdateCarnePayload = CreateCarnePayload

export interface Comprador {
  id: string
  nome: string
  documento: string
  cidade: string
  estado: string
}

export interface CreateCompradorPayload {
  nome: string
  documento: string
  cidade: string
  estado: string
}

export type UpdateCompradorPayload = CreateCompradorPayload

export type MoedaPedido = 'BRL' | 'USD' | 'EUR'

export const MOEDAS_PEDIDO: { value: MoedaPedido; label: string }[] = [
  { value: 'BRL', label: 'Real (BRL)' },
  { value: 'USD', label: 'Dólar (USD)' },
  { value: 'EUR', label: 'Euro (EUR)' },
]

export interface PedidoItem {
  carneId: string
  nomeCarne: string
  quantidade: number
  precoUnitario: number
  moeda: MoedaPedido
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
  precoUnitario: number
  moeda: MoedaPedido
}

export interface CreatePedidoPayload {
  compradorId: string
  dataPedido: string
  items: CreatePedidoItemPayload[]
}

export interface UpdatePedidoPayload {
  status: string
  items: CreatePedidoItemPayload[]
}

export const PEDIDO_STATUS = ['Pendente', 'Confirmado', 'Cancelado'] as const
export type PedidoStatus = (typeof PEDIDO_STATUS)[number]
