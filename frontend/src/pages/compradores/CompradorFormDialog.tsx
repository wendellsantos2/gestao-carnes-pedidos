import { useEffect, useMemo, useState } from 'react'
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
import { ESTADOS_BRASIL, listarCidadesPorEstado } from '../../data/estadosCidades'
import type { Comprador, CreateCompradorPayload } from '../../types'
import { apenasDigitos, formatDocumento } from '../../utils/documento'
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
  documento: '',
  cidade: '',
  estado: '',
}

type CompradorFormErrors = FieldErrors<'nome' | 'documento' | 'cidade' | 'estado'>

export default function CompradorFormDialog({
  open,
  comprador,
  loading = false,
  onClose,
  onSubmit,
}: CompradorFormDialogProps) {
  const [form, setForm] = useState<CreateCompradorPayload>(emptyForm)
  const [errors, setErrors] = useState<CompradorFormErrors>({})

  useEffect(() => {
    if (!open) return

    setForm(
      comprador
        ? {
            nome: comprador.nome,
            documento: comprador.documento,
            cidade: comprador.cidade,
            estado: comprador.estado,
          }
        : emptyForm,
    )
    setErrors({})
  }, [open, comprador])

  const cidades = useMemo(() => listarCidadesPorEstado(form.estado), [form.estado])

  const handleChange = (field: keyof CreateCompradorPayload, value: string) => {
    const nextForm =
      field === 'documento'
        ? { ...form, documento: apenasDigitos(value).slice(0, 14) }
        : field === 'estado'
          ? { ...form, estado: value, cidade: '' }
          : { ...form, [field]: value }

    setForm(nextForm)

    const nextErrors = validateCompradorForm(nextForm)
    setErrors((current) => ({ ...current, [field]: nextErrors[field] }))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    const nextErrors = validateCompradorForm(form)
    setErrors(nextErrors)

    if (hasFieldErrors(nextErrors)) return

    onSubmit({
      ...form,
      documento: apenasDigitos(form.documento),
    })
  }

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{comprador ? 'Editar comprador' : 'Novo comprador'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nome do comprador"
              value={form.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              error={Boolean(errors.nome)}
              helperText={errors.nome ?? 'Campo obrigatório.'}
              required
              fullWidth
            />
            <TextField
              label="Documento (CPF/CNPJ)"
              value={formatDocumento(form.documento)}
              onChange={(e) => handleChange('documento', e.target.value)}
              error={Boolean(errors.documento)}
              helperText={errors.documento ?? 'Informe CPF ou CNPJ.'}
              required
              fullWidth
              inputProps={{ inputMode: 'numeric' }}
            />
            <FormControl fullWidth required error={Boolean(errors.estado)}>
              <InputLabel>Estado</InputLabel>
              <Select
                label="Estado"
                value={form.estado}
                onChange={(e) => handleChange('estado', e.target.value)}
              >
                {ESTADOS_BRASIL.map((estado) => (
                  <MenuItem key={estado.uf} value={estado.uf}>
                    {estado.nome} ({estado.uf})
                  </MenuItem>
                ))}
              </Select>
              {errors.estado && <FormHelperText>{errors.estado}</FormHelperText>}
            </FormControl>
            <FormControl
              fullWidth
              required
              error={Boolean(errors.cidade)}
              disabled={!form.estado}
            >
              <InputLabel>Cidade</InputLabel>
              <Select
                label="Cidade"
                value={form.cidade}
                onChange={(e) => handleChange('cidade', e.target.value)}
              >
                {cidades.map((cidade) => (
                  <MenuItem key={cidade} value={cidade}>
                    {cidade}
                  </MenuItem>
                ))}
              </Select>
              {errors.cidade && <FormHelperText>{errors.cidade}</FormHelperText>}
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
