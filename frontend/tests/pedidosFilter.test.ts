import { describe, expect, it } from 'vitest'
import type { Pedido } from '../src/types'
import { filterPedidos } from '../src/utils/pedidosFilter'
import { emptyPedidosFilters } from '../src/utils/pedidosFilter'

const pedidos: Pedido[] = [
  {
    id: '1',
    dataPedido: '2026-06-20T10:30:00.000Z',
    status: 'Pendente',
    comprador: {
      id: 'c1',
      nome: 'João',
      email: 'joao@email.com',
      telefone: '',
      endereco: '',
    },
    items: [],
    total: 100,
  },
  {
    id: '2',
    dataPedido: '2026-06-22T14:00:00.000Z',
    status: 'Confirmado',
    comprador: {
      id: 'c2',
      nome: 'Maria',
      email: 'maria@email.com',
      telefone: '',
      endereco: '',
    },
    items: [],
    total: 200,
  },
]

describe('filterPedidos', () => {
  it('filtra por comprador', () => {
    const result = filterPedidos(pedidos, { ...emptyPedidosFilters, compradorId: 'c1' })
    expect(result).toHaveLength(1)
    expect(result[0].comprador.nome).toBe('João')
  })

  it('filtra por intervalo de datas', () => {
    const result = filterPedidos(pedidos, {
      ...emptyPedidosFilters,
      dataInicio: '2026-06-21',
      dataFim: '2026-06-23',
    })

    expect(result).toHaveLength(1)
    expect(result[0].comprador.nome).toBe('Maria')
  })

  it('retorna todos quando não há filtros', () => {
    expect(filterPedidos(pedidos, emptyPedidosFilters)).toHaveLength(2)
  })
})
