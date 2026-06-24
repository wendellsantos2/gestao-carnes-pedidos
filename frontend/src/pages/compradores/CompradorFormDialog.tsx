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
import type { Comprador, CreateCompradorPayload } from '../../types'
import {
  hasFieldErrors,
  validateCompradorForm,
  type FieldErrors,
} from '../../utils/validation'

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
  const [errors, setErrors] = useState<FieldErrors<'nome' | 'email'>>({})

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
    setErrors({})
  }, [open, comprador])

  const handleChange = (field: keyof CreateCompradorPayload, value: string) => {
    const nextForm = { ...form, [field]: value }
    setForm(nextForm)

    if (field === 'nome' || field === 'email') {
      const nextErrors = validateCompradorForm(nextForm)
      setErrors((current) => ({ ...current, [field]: nextErrors[field] }))
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    const nextErrors = validateCompradorForm(form)
    setErrors(nextErrors)

    if (hasFieldErrors(nextErrors)) return

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
              error={Boolean(errors.nome)}
              helperText={errors.nome ?? 'Campo obrigatório.'}
              required
              fullWidth
            />
            <TextField
              label="E-mail"
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={Boolean(errors.email)}
              helperText={errors.email}
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
