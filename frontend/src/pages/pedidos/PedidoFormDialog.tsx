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
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material'
import LoadingButton from '../../components/LoadingButton'
import { useErrorHandler } from '../../components/ErrorHandlerProvider'
import { listCarnes } from '../../services/carnesService'
import { listCompradores } from '../../services/compradoresService'
import { calcPedidoTotalBrl } from '../../services/cotacaoService'
import { useCotacoes } from '../../hooks/useCotacoes'
import { resolveErrorMessage } from '../../utils/errorMessages'
import type {
  Carne,
  Comprador,
  CreatePedidoItemPayload,
  CreatePedidoPayload,
  MoedaPedido,
  Pedido,
  UpdatePedidoPayload,
} from '../../types'
import { MOEDAS_PEDIDO, PEDIDO_STATUS } from '../../types'
import { formatCurrency, formatDate } from '../../utils/format'
import {
  getFirstFieldError,
  hasFieldErrors,
  validatePedidoCreate,
  type FieldErrors,
} from '../../utils/validation'

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
  precoUnitario: number
  moeda: MoedaPedido
}

const todayIsoDate = () => new Date().toISOString().slice(0, 10)

const emptyItem = (): ItemFormRow => ({
  carneId: '',
  quantidade: 1,
  precoUnitario: 0,
  moeda: 'BRL',
})

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
  const { notifyError } = useErrorHandler()

  const [compradores, setCompradores] = useState<Comprador[]>([])
  const [carnes, setCarnes] = useState<Carne[]>([])
  const [loadError, setLoadError] = useState('')
  const [compradorId, setCompradorId] = useState('')
  const [dataPedido, setDataPedido] = useState(todayIsoDate())
  const [status, setStatus] = useState<string>('Pendente')
  const [items, setItems] = useState<ItemFormRow[]>([emptyItem()])
  const [errors, setErrors] = useState<FieldErrors<'compradorId' | 'items' | 'dataPedido'>>({})

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
      setDataPedido(pedido.dataPedido.slice(0, 10))
      setStatus(pedido.status)
      setItems(
        pedido.items.length > 0
          ? pedido.items.map((item) => ({
              carneId: item.carneId,
              quantidade: item.quantidade,
              precoUnitario: item.precoUnitario,
              moeda: item.moeda,
            }))
          : [emptyItem()],
      )
      return
    }

    setCompradorId('')
    setDataPedido(todayIsoDate())
    setStatus('Pendente')
    setItems([emptyItem()])
    setErrors({})
  }, [open, pedido])

  const selectedCarneIds = useMemo(
    () => new Set(items.map((item) => item.carneId).filter(Boolean)),
    [items],
  )

  const estimatedTotalBrl = useMemo(() => {
    if (!cotacoes) return 0

    const payloadItems = items
      .filter((item) => item.carneId && item.quantidade > 0 && item.precoUnitario > 0)
      .map((item) => ({
        subtotal: item.precoUnitario * item.quantidade,
        moeda: item.moeda,
      }))

    return calcPedidoTotalBrl(payloadItems, cotacoes)
  }, [items, cotacoes])

  const updateItem = (index: number, field: keyof ItemFormRow, value: string) => {
    setItems((current) =>
      current.map((item, itemIndex) => {
        if (itemIndex !== index) return item

        if (field === 'carneId') {
          const carne = carnes.find((c) => c.id === value)
          return {
            ...item,
            carneId: value,
            precoUnitario: carne?.precoKg ?? item.precoUnitario,
          }
        }

        if (field === 'quantidade' || field === 'precoUnitario') {
          return { ...item, [field]: Number(value) }
        }

        return { ...item, [field]: value as MoedaPedido }
      }),
    )
  }

  const addItem = () => setItems((current) => [...current, emptyItem()])

  const removeItem = (index: number) => {
    setItems((current) => (current.length === 1 ? current : current.filter((_, i) => i !== index)))
  }

  const buildItemsPayload = (): CreatePedidoItemPayload[] =>
    items
      .filter((item) => item.carneId && item.quantidade > 0 && item.precoUnitario > 0)
      .map((item) => ({
        carneId: item.carneId,
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario,
        moeda: item.moeda,
      }))

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (isEditing && pedido) {
      const payload: UpdatePedidoPayload = { status, items: [] }

      if (canEditItems) {
        const nextItems = buildItemsPayload()
        const itemErrors = validatePedidoCreate(pedido.comprador.id, nextItems)
        if (itemErrors.items) {
          setErrors({ items: itemErrors.items })
          notifyError(new Error(itemErrors.items))
          return
        }

        const currentItems = pedido.items.map((item) => ({
          carneId: item.carneId,
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario,
          moeda: item.moeda,
        }))
        const itemsChanged =
          nextItems.length !== currentItems.length ||
          nextItems.some(
            (item, index) =>
              item.carneId !== currentItems[index]?.carneId ||
              item.quantidade !== currentItems[index]?.quantidade ||
              item.precoUnitario !== currentItems[index]?.precoUnitario ||
              item.moeda !== currentItems[index]?.moeda,
          )

        if (itemsChanged) {
          payload.items = nextItems
        }
      }

      onUpdate(payload)
      return
    }

    const nextItems = buildItemsPayload()
    const formErrors = validatePedidoCreate(compradorId, nextItems, dataPedido)
    setErrors(formErrors)

    if (hasFieldErrors(formErrors)) {
      notifyError(new Error(getFirstFieldError(formErrors) ?? 'Verifique os campos do pedido.'))
      return
    }

    onCreate({
      compradorId,
      dataPedido,
      items: nextItems,
    })
  }

  const handleCompradorChange = (value: string) => {
    setCompradorId(value)
    if (errors.compradorId) {
      setErrors((current) => ({
        ...current,
        compradorId: validatePedidoCreate(value, buildItemsPayload(), dataPedido).compradorId,
      }))
    }
  }

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEditing ? 'Editar pedido' : 'Novo pedido'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {loadError && <Alert severity="error">{loadError}</Alert>}

            {isEditing ? (
              <>
                <TextField
                  label="Comprador"
                  value={pedido?.comprador.nome ?? ''}
                  fullWidth
                  disabled
                />
                <TextField
                  label="Data do pedido"
                  value={formatDate(pedido?.dataPedido ?? '')}
                  fullWidth
                  disabled
                />
              </>
            ) : (
              <>
                <FormControl fullWidth required error={Boolean(errors.compradorId)}>
                  <InputLabel>Comprador</InputLabel>
                  <Select
                    label="Comprador"
                    value={compradorId}
                    onChange={(e) => handleCompradorChange(e.target.value)}
                  >
                    {compradores.map((comprador) => (
                      <MenuItem key={comprador.id} value={comprador.id}>
                        {comprador.nome}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.compradorId && <FormHelperText>{errors.compradorId}</FormHelperText>}
                </FormControl>

                <TextField
                  label="Data do pedido"
                  type="date"
                  value={dataPedido}
                  onChange={(e) => setDataPedido(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                  error={Boolean(errors.dataPedido)}
                  helperText={errors.dataPedido}
                />
              </>
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
                  <Button type="button" size="small" startIcon={<AddIcon />} onClick={addItem}>
                    Adicionar item
                  </Button>
                </Stack>

                {errors.items && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {errors.items}
                  </Alert>
                )}

                <Stack spacing={2}>
                  {items.map((item, index) => (
                    <Stack key={index} direction={{ xs: 'column', md: 'row' }} spacing={1}>
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
                              {carne.nome} — {formatCurrency(carne.precoKg)}/kg (cadastro)
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextField
                        label="Preço (kg)"
                        type="number"
                        inputProps={{ min: 0.01, step: 0.01 }}
                        value={item.precoUnitario || ''}
                        onChange={(e) => updateItem(index, 'precoUnitario', e.target.value)}
                        required
                        sx={{ minWidth: { md: 120 } }}
                      />
                      <FormControl required sx={{ minWidth: { md: 140 } }}>
                        <InputLabel>Moeda</InputLabel>
                        <Select
                          label="Moeda"
                          value={item.moeda}
                          onChange={(e) => updateItem(index, 'moeda', e.target.value)}
                        >
                          {MOEDAS_PEDIDO.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
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
                        sx={{ minWidth: { md: 140 } }}
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

                {cotacoes && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Total estimado em Real: {formatCurrency(estimatedTotalBrl)}
                    {items.some((item) => item.moeda !== 'BRL') && (
                      <>
                        {' '}
                        (USD/BRL: {formatCurrency(cotacoes.usd.bid)} · EUR/BRL:{' '}
                        {formatCurrency(cotacoes.eur.bid)})
                      </>
                    )}
                  </Typography>
                )}
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
          <LoadingButton onClick={onClose} disabled={loading}>
            Cancelar
          </LoadingButton>
          <LoadingButton type="submit" variant="contained" loading={loading}>
            Salvar
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}
