import { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  Box,
  CircularProgress,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@mui/icons-material'
import ConfirmDialog from '../../components/ConfirmDialog'
import { useErrorHandler } from '../../components/ErrorHandlerProvider'
import PageHeader from '../../components/PageHeader'
import StatusChip from '../../components/StatusChip'
import ValorEmReal from '../../components/ValorEmReal'
import { useCotacoes } from '../../hooks/useCotacoes'
import {
  createPedido,
  deletePedido,
  listPedidos,
  updatePedido,
} from '../../services/pedidosService'
import { MOEDA_PRECOS_SISTEMA, type CotacoesUsdEur } from '../../services/cotacaoService'
import type { CreatePedidoPayload, Pedido, UpdatePedidoPayload } from '../../types'
import { formatCurrency, formatDate } from '../../utils/format'
import { resolveErrorMessage } from '../../utils/errorMessages'
import PedidoFormDialog from './PedidoFormDialog'

interface PedidoRowProps {
  pedido: Pedido
  cotacoes: CotacoesUsdEur
  onEdit: (pedido: Pedido) => void
  onDelete: (pedido: Pedido) => void
}

function PedidoRow({ pedido, cotacoes, onEdit, onDelete }: PedidoRowProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <TableRow hover>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen((value) => !value)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{formatDate(pedido.dataPedido)}</TableCell>
        <TableCell>{pedido.comprador.nome}</TableCell>
        <TableCell>
          <StatusChip status={pedido.status} />
        </TableCell>
        <TableCell>{pedido.items.length}</TableCell>
        <TableCell>
          <ValorEmReal valorOriginal={pedido.total} cotacoes={cotacoes} variant="body2" />
        </TableCell>
        <TableCell align="right">
          <Tooltip title="Editar">
            <IconButton onClick={() => onEdit(pedido)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton color="error" onClick={() => onDelete(pedido)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={7} sx={{ py: 0, borderBottom: open ? undefined : 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ py: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Itens do pedido
              </Typography>
              {pedido.items.map((item) => (
                <Typography
                  key={`${item.carneId}-${item.quantidade}`}
                  variant="body2"
                  color="text.secondary"
                >
                  {item.nomeCarne} — {item.quantidade} kg ×{' '}
                  <ValorEmReal
                    valorOriginal={item.precoUnitario}
                    cotacoes={cotacoes}
                    showOriginal={false}
                  />
                  /kg ={' '}
                  <ValorEmReal valorOriginal={item.subtotal} cotacoes={cotacoes} showOriginal={false} />
                </Typography>
              ))}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default function PedidosPage() {
  const { notifyError, notifySuccess } = useErrorHandler()
  const { cotacoes, loading: loadingCotacoes, error: cotacaoError } = useCotacoes()
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Pedido | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Pedido | null>(null)

  const loadPedidos = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await listPedidos()
      setPedidos(data)
    } catch (err) {
      setError(resolveErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPedidos()
  }, [loadPedidos])

  const handleCreate = () => {
    setEditing(null)
    setDialogOpen(true)
  }

  const handleEdit = (pedido: Pedido) => {
    setEditing(pedido)
    setDialogOpen(true)
  }

  const handleCreateSubmit = async (payload: CreatePedidoPayload) => {
    setSaving(true)

    try {
      await createPedido(payload)
      notifySuccess('Pedido criado com sucesso.')
      setDialogOpen(false)
      await loadPedidos()
    } catch (err) {
      notifyError(err)
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateSubmit = async (payload: UpdatePedidoPayload) => {
    if (!editing) return

    setSaving(true)

    try {
      await updatePedido(editing.id, payload)
      notifySuccess('Pedido atualizado com sucesso.')
      setDialogOpen(false)
      await loadPedidos()
    } catch (err) {
      notifyError(err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    setSaving(true)

    try {
      await deletePedido(deleteTarget.id)
      notifySuccess('Pedido excluído com sucesso.')
      setDeleteTarget(null)
      await loadPedidos()
    } catch (err) {
      notifyError(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box>
      <PageHeader title="Pedidos" onAdd={handleCreate} addLabel="Novo pedido" />

      {cotacaoError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Não foi possível carregar a cotação para exibir valores em Real: {cotacaoError}
        </Alert>
      )}

      {cotacoes && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Valores convertidos para Real (BRL) via AwesomeAPI — cotação {MOEDA_PRECOS_SISTEMA}/BRL:{' '}
          {formatCurrency(cotacoes.usd.bid)} (atualizado em {cotacoes.usd.createDate})
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading || loadingCotacoes ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={56} />
                <TableCell>Data</TableCell>
                <TableCell>Comprador</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Itens</TableCell>
                <TableCell>Total (BRL)</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pedidos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Nenhum pedido cadastrado.
                  </TableCell>
                </TableRow>
              ) : (
                cotacoes &&
                pedidos.map((pedido) => (
                  <PedidoRow
                    key={pedido.id}
                    pedido={pedido}
                    cotacoes={cotacoes}
                    onEdit={handleEdit}
                    onDelete={setDeleteTarget}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <PedidoFormDialog
        open={dialogOpen}
        pedido={editing}
        loading={saving}
        onClose={() => setDialogOpen(false)}
        onCreate={handleCreateSubmit}
        onUpdate={handleUpdateSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Excluir pedido"
        message="Deseja excluir este pedido?"
        confirmLabel="Excluir"
        loading={saving}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  )
}
