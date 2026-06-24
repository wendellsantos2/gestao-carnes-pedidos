import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material'
import LoadingButton from '../../components/LoadingButton'
import type { Carne, CreateCarnePayload } from '../../types'
import {
  hasFieldErrors,
  validateCarneForm,
  type FieldErrors,
} from '../../utils/validation'

interface CarneFormDialogProps {
  open: boolean
  carne?: Carne | null
  loading?: boolean
  onClose: () => void
  onSubmit: (payload: CreateCarnePayload) => void
}

const emptyForm: CreateCarnePayload = {
  nome: '',
  tipo: '',
  precoKg: 0,
}

export default function CarneFormDialog({
  open,
  carne,
  loading = false,
  onClose,
  onSubmit,
}: CarneFormDialogProps) {
  const [form, setForm] = useState<CreateCarnePayload>(emptyForm)
  const [errors, setErrors] = useState<FieldErrors<'nome' | 'tipo' | 'precoKg'>>({})

  useEffect(() => {
    if (!open) return

    setForm(
      carne
        ? { nome: carne.nome, tipo: carne.tipo, precoKg: carne.precoKg }
        : emptyForm,
    )
    setErrors({})
  }, [open, carne])

  const handleChange = (field: keyof CreateCarnePayload, value: string) => {
    const nextForm = {
      ...form,
      [field]: field === 'precoKg' ? Number(value) : value,
    }
    setForm(nextForm)

    if (errors[field]) {
      const nextErrors = validateCarneForm(nextForm)
      setErrors((current) => ({ ...current, [field]: nextErrors[field] }))
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    const nextErrors = validateCarneForm(form)
    setErrors(nextErrors)

    if (hasFieldErrors(nextErrors)) return

    onSubmit(form)
  }

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{carne ? 'Editar carne' : 'Nova carne'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nome"
              value={form.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              error={Boolean(errors.nome)}
              helperText={errors.nome}
              required
              fullWidth
            />
            <TextField
              label="Tipo"
              value={form.tipo}
              onChange={(e) => handleChange('tipo', e.target.value)}
              error={Boolean(errors.tipo)}
              helperText={errors.tipo}
              required
              fullWidth
            />
            <TextField
              label="Preço por kg (USD)"
              type="number"
              inputProps={{ min: 0.01, step: 0.01 }}
              value={form.precoKg || ''}
              onChange={(e) => handleChange('precoKg', e.target.value)}
              error={Boolean(errors.precoKg)}
              helperText={errors.precoKg ?? 'Informe um valor maior que zero.'}
              required
              fullWidth
            />
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
