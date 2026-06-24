import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material'
import LoadingButton from '../../components/LoadingButton'
import type { Carne, CreateCarnePayload, OrigemCarne } from '../../types'
import { ORIGENS_CARNE } from '../../types'
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
  origem: '' as OrigemCarne,
}

type CarneFormErrors = FieldErrors<'nome' | 'origem'>

export default function CarneFormDialog({
  open,
  carne,
  loading = false,
  onClose,
  onSubmit,
}: CarneFormDialogProps) {
  const [form, setForm] = useState<CreateCarnePayload>(emptyForm)
  const [errors, setErrors] = useState<CarneFormErrors>({})

  useEffect(() => {
    if (!open) return

    setForm(
      carne
        ? { nome: carne.nome, origem: carne.origem }
        : emptyForm,
    )
    setErrors({})
  }, [open, carne])

  const handleChange = (field: keyof CreateCarnePayload, value: string) => {
    const nextForm = { ...form, [field]: value }
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
              label="Descrição da carne"
              value={form.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              error={Boolean(errors.nome)}
              helperText={errors.nome ?? 'Campo obrigatório.'}
              required
              fullWidth
            />
            <FormControl fullWidth required error={Boolean(errors.origem)}>
              <InputLabel>Origem</InputLabel>
              <Select
                label="Origem"
                value={form.origem}
                onChange={(e) => handleChange('origem', e.target.value)}
              >
                {ORIGENS_CARNE.map((origem) => (
                  <MenuItem key={origem} value={origem}>
                    {origem}
                  </MenuItem>
                ))}
              </Select>
              {errors.origem && <FormHelperText>{errors.origem}</FormHelperText>}
            </FormControl>
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
