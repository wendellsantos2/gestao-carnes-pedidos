import { Chip } from '@mui/material'
import type { PedidoStatus } from '../types'

const STATUS_COLOR: Record<PedidoStatus, 'default' | 'warning' | 'success' | 'error'> = {
  Pendente: 'warning',
  Confirmado: 'success',
  Cancelado: 'error',
}

interface StatusChipProps {
  status: string
}

export default function StatusChip({ status }: StatusChipProps) {
  const color = STATUS_COLOR[status as PedidoStatus] ?? 'default'

  return <Chip label={status} color={color} size="small" />
}
