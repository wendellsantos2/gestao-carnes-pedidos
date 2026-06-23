import { useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material'
import type { Carne, CreateCarnePayload } from '../../types'

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

  useEffect(() => {
    if (!open) return

    setForm(
      carne
        ? { nome: carne.nome, tipo: carne.tipo, precoKg: carne.precoKg }
        : emptyForm,
    )
  }, [open, carne])

  const handleChange = (field: keyof CreateCarnePayload, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: field === 'precoKg' ? Number(value) : value,
    }))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
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
              required
              fullWidth
            />
            <TextField
              label="Tipo"
              value={form.tipo}
              onChange={(e) => handleChange('tipo', e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Preço por kg"
              type="number"
              inputProps={{ min: 0.01, step: 0.01 }}
              value={form.precoKg || ''}
              onChange={(e) => handleChange('precoKg', e.target.value)}
              required
              fullWidth
            />
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
