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
import type { Comprador, CreateCompradorPayload } from '../../types'

interface CompradorFormDialogProps {
  open: boolean
  comprador?: Comprador | null
  loading?: boolean
  onClose: () => void
  onSubmit: (payload: CreateCompradorPayload) => void
}

const emptyForm: CreateCompradorPayload = {
  nome: '',
  email: '',
  telefone: '',
  endereco: '',
}

export default function CompradorFormDialog({
  open,
  comprador,
  loading = false,
  onClose,
  onSubmit,
}: CompradorFormDialogProps) {
  const [form, setForm] = useState<CreateCompradorPayload>(emptyForm)

  useEffect(() => {
    if (!open) return

    setForm(
      comprador
        ? {
            nome: comprador.nome,
            email: comprador.email,
            telefone: comprador.telefone,
            endereco: comprador.endereco,
          }
        : emptyForm,
    )
  }, [open, comprador])

  const handleChange = (field: keyof CreateCompradorPayload, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onSubmit(form)
  }

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{comprador ? 'Editar comprador' : 'Novo comprador'}</DialogTitle>
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
              label="E-mail"
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Telefone"
              value={form.telefone}
              onChange={(e) => handleChange('telefone', e.target.value)}
              fullWidth
            />
            <TextField
              label="Endereço"
              value={form.endereco}
              onChange={(e) => handleChange('endereco', e.target.value)}
              fullWidth
              multiline
              minRows={2}
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
