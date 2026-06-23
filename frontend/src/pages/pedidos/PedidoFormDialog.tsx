import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { listCarnes } from '../../services/carnesService'
import { listCompradores } from '../../services/compradoresService'
import { convertPrecoParaBrl, MOEDA_PRECOS_SISTEMA } from '../../services/cotacaoService'
import { useCotacoes } from '../../hooks/useCotacoes'
import { resolveErrorMessage } from '../../utils/errorMessages'
import type {
  Carne,
  Comprador,
  CreatePedidoItemPayload,
  CreatePedidoPayload,
  Pedido,
  UpdatePedidoPayload,
} from '../../types'
import { PEDIDO_STATUS } from '../../types'
import { formatCurrency } from '../../utils/format'

interface PedidoFormDialogProps {
  open: boolean
  pedido?: Pedido | null
  loading?: boolean
  onClose: () => void
  onCreate: (payload: CreatePedidoPayload) => void
  onUpdate: (payload: UpdatePedidoPayload) => void
}

interface ItemFormRow {
  carneId: string
  quantidade: number
}

const emptyItem = (): ItemFormRow => ({ carneId: '', quantidade: 1 })

export default function PedidoFormDialog({
  open,
  pedido,
  loading = false,
  onClose,
  onCreate,
  onUpdate,
}: PedidoFormDialogProps) {
  const isEditing = Boolean(pedido)
  const canEditItems = !pedido || pedido.status === 'Pendente'
  const { cotacoes } = useCotacoes()

  const [compradores, setCompradores] = useState<Comprador[]>([])
  const [carnes, setCarnes] = useState<Carne[]>([])
  const [loadError, setLoadError] = useState('')
  const [compradorId, setCompradorId] = useState('')
  const [status, setStatus] = useState<string>('Pendente')
  const [items, setItems] = useState<ItemFormRow[]>([emptyItem()])

  useEffect(() => {
    if (!open) return

    async function loadOptions() {
      setLoadError('')

      try {
        const [compradoresData, carnesData] = await Promise.all([
          listCompradores(),
          listCarnes(),
        ])

        setCompradores(compradoresData)
        setCarnes(carnesData)
      } catch (err) {
        setLoadError(resolveErrorMessage(err))
      }
    }

    loadOptions()
  }, [open])

  useEffect(() => {
    if (!open) return

    if (pedido) {
      setCompradorId(pedido.comprador.id)
      setStatus(pedido.status)
      setItems(
        pedido.items.length > 0
          ? pedido.items.map((item) => ({
              carneId: item.carneId,
              quantidade: item.quantidade,
            }))
          : [emptyItem()],
      )
      return
    }

    setCompradorId('')
    setStatus('Pendente')
    setItems([emptyItem()])
  }, [open, pedido])

  const selectedCarneIds = useMemo(
    () => new Set(items.map((item) => item.carneId).filter(Boolean)),
    [items],
  )

  const estimatedTotal = useMemo(() => {
    return items.reduce((total, item) => {
      const carne = carnes.find((c) => c.id === item.carneId)
      if (!carne || item.quantidade <= 0) return total
      return total + carne.precoKg * item.quantidade
    }, 0)
  }, [items, carnes])

  const updateItem = (index: number, field: keyof ItemFormRow, value: string) => {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: field === 'quantidade' ? Number(value) : value,
            }
          : item,
      ),
    )
  }

  const addItem = () => setItems((current) => [...current, emptyItem()])

  const removeItem = (index: number) => {
    setItems((current) => (current.length === 1 ? current : current.filter((_, i) => i !== index)))
  }

  const buildItemsPayload = (): CreatePedidoItemPayload[] =>
    items
      .filter((item) => item.carneId && item.quantidade > 0)
      .map((item) => ({
        carneId: item.carneId,
        quantidade: item.quantidade,
      }))

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (isEditing && pedido) {
      const payload: UpdatePedidoPayload = { status, items: [] }

      if (canEditItems) {
        const nextItems = buildItemsPayload()
        const currentItems = pedido.items.map((item) => ({
          carneId: item.carneId,
          quantidade: item.quantidade,
        }))
        const itemsChanged =
          nextItems.length !== currentItems.length ||
          nextItems.some(
            (item, index) =>
              item.carneId !== currentItems[index]?.carneId ||
              item.quantidade !== currentItems[index]?.quantidade,
          )

        if (itemsChanged) {
          payload.items = nextItems
        }
      }

      onUpdate(payload)
      return
    }

    onCreate({
      compradorId,
      items: buildItemsPayload(),
    })
  }

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEditing ? 'Editar pedido' : 'Novo pedido'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {loadError && <Alert severity="error">{loadError}</Alert>}

            {isEditing ? (
              <TextField
                label="Comprador"
                value={pedido?.comprador.nome ?? ''}
                fullWidth
                disabled
              />
            ) : (
              <FormControl fullWidth required>
                <InputLabel>Comprador</InputLabel>
                <Select
                  label="Comprador"
                  value={compradorId}
                  onChange={(e) => setCompradorId(e.target.value)}
                >
                  {compradores.map((comprador) => (
                    <MenuItem key={comprador.id} value={comprador.id}>
                      {comprador.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {isEditing && (
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {PEDIDO_STATUS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {canEditItems && (
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="subtitle1">Itens</Typography>
                  <Button size="small" startIcon={<AddIcon />} onClick={addItem}>
                    Adicionar item
                  </Button>
                </Stack>

                <Stack spacing={2}>
                  {items.map((item, index) => (
                    <Stack key={index} direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                      <FormControl fullWidth required>
                        <InputLabel>Carne</InputLabel>
                        <Select
                          label="Carne"
                          value={item.carneId}
                          onChange={(e) => updateItem(index, 'carneId', e.target.value)}
                        >
                          {carnes.map((carne) => (
                            <MenuItem
                              key={carne.id}
                              value={carne.id}
                              disabled={
                                selectedCarneIds.has(carne.id) && item.carneId !== carne.id
                              }
                            >
                              {carne.nome} — {formatCurrency(carne.precoKg)}/kg
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextField
                        label="Quantidade (kg)"
                        type="number"
                        inputProps={{ min: 1, step: 1 }}
                        value={item.quantidade}
                        onChange={(e) => updateItem(index, 'quantidade', e.target.value)}
                        required
                        sx={{ minWidth: { sm: 160 } }}
                      />
                      <IconButton
                        color="error"
                        onClick={() => removeItem(index)}
                        disabled={items.length === 1}
                        sx={{ alignSelf: 'center' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  ))}
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Total estimado ({MOEDA_PRECOS_SISTEMA}): {formatCurrency(estimatedTotal)}
                  {cotacoes && (
                    <>
                      {' '}
                      → em Real:{' '}
                      {formatCurrency(convertPrecoParaBrl(estimatedTotal, cotacoes, MOEDA_PRECOS_SISTEMA))}
                      {' '}
                      (cotação {formatCurrency(cotacoes.usd.bid)}/{MOEDA_PRECOS_SISTEMA})
                    </>
                  )}
                </Typography>
              </Box>
            )}

            {isEditing && !canEditItems && (
              <Alert severity="info">
                Itens só podem ser alterados enquanto o pedido estiver pendente.
              </Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            Salvar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
