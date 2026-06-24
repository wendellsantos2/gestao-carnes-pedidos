import type { Pedido } from '../types'

export interface PedidosFilters {
  compradorId: string
  dataInicio: string
  dataFim: string
}

export const emptyPedidosFilters: PedidosFilters = {
  compradorId: '',
  dataInicio: '',
  dataFim: '',
}

function toDateKey(value: string): string {
  return value.slice(0, 10)
}

export function filterPedidos(pedidos: Pedido[], filters: PedidosFilters): Pedido[] {
  return pedidos.filter((pedido) => {
    if (filters.compradorId && pedido.comprador.id !== filters.compradorId) {
      return false
    }

    const pedidoDate = toDateKey(pedido.dataPedido)

    if (filters.dataInicio && pedidoDate < filters.dataInicio) {
      return false
    }

    if (filters.dataFim && pedidoDate > filters.dataFim) {
      return false
    }

    return true
  })
}
