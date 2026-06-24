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
import {
  ESTADOS_BRASIL,
  inicializarLocalidadeComprador,
  isOutroCidade,
  isOutroEstado,
  LABEL_OUTRO_CIDADE,
  LABEL_OUTRO_ESTADO,
  listarCidadesPorEstado,
  OUTRO_CIDADE,
  OUTRO_ESTADO,
  resolveCompradorLocalidade,
  type CompradorLocalidadeInput,
} from '../../data/estadosCidades'
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

const emptyLocalidade: CompradorLocalidadeInput = {
  estadoSelecionado: '',
  estadoCustom: '',
  cidadeSelecionada: '',
  cidadeCustom: '',
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
  const [localidade, setLocalidade] = useState<CompradorLocalidadeInput>(emptyLocalidade)
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
    setLocalidade(inicializarLocalidadeComprador(comprador))
    setErrors({})
  }, [open, comprador])

  const ufParaCidades = useMemo(() => {
    if (isOutroEstado(localidade.estadoSelecionado)) {
      return localidade.estadoCustom.trim().toUpperCase()
    }
    return localidade.estadoSelecionado
  }, [localidade.estadoSelecionado, localidade.estadoCustom])

  const cidades = useMemo(() => listarCidadesPorEstado(ufParaCidades), [ufParaCidades])

  const podeSelecionarCidade = Boolean(
    localidade.estadoSelecionado &&
      (!isOutroEstado(localidade.estadoSelecionado) || localidade.estadoCustom.trim().length === 2),
  )

  const validar = (nextForm: CreateCompradorPayload, nextLocalidade: CompradorLocalidadeInput) =>
    validateCompradorForm(nextForm, nextLocalidade)

  const handleChange = (field: keyof CreateCompradorPayload, value: string) => {
    const nextForm =
      field === 'documento'
        ? { ...form, documento: apenasDigitos(value).slice(0, 14) }
        : { ...form, [field]: value }

    setForm(nextForm)

    if (errors[field]) {
      const nextErrors = validar(nextForm, localidade)
      setErrors((current) => ({ ...current, [field]: nextErrors[field] }))
    }
  }

  const handleLocalidadeChange = (patch: Partial<CompradorLocalidadeInput>) => {
    const nextLocalidade = { ...localidade, ...patch }

    if (patch.estadoSelecionado !== undefined && patch.estadoSelecionado !== localidade.estadoSelecionado) {
      nextLocalidade.cidadeSelecionada = ''
      nextLocalidade.cidadeCustom = ''
      if (!isOutroEstado(patch.estadoSelecionado)) {
        nextLocalidade.estadoCustom = ''
      }
    }

    if (patch.cidadeSelecionada !== undefined && !isOutroCidade(patch.cidadeSelecionada)) {
      nextLocalidade.cidadeCustom = ''
    }

    setLocalidade(nextLocalidade)

    if (errors.estado || errors.cidade) {
      const nextErrors = validar(form, nextLocalidade)
      setErrors((current) => ({
        ...current,
        estado: nextErrors.estado,
        cidade: nextErrors.cidade,
      }))
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    const nextErrors = validar(form, localidade)
    setErrors(nextErrors)

    if (hasFieldErrors(nextErrors)) return

    const { estado, cidade } = resolveCompradorLocalidade(localidade)

    onSubmit({
      nome: form.nome,
      documento: apenasDigitos(form.documento),
      estado,
      cidade,
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
                value={localidade.estadoSelecionado}
                onChange={(e) => handleLocalidadeChange({ estadoSelecionado: e.target.value })}
              >
                {ESTADOS_BRASIL.map((estado) => (
                  <MenuItem key={estado.uf} value={estado.uf}>
                    {estado.nome} ({estado.uf})
                  </MenuItem>
                ))}
                <MenuItem value={OUTRO_ESTADO}>{LABEL_OUTRO_ESTADO}</MenuItem>
              </Select>
              {errors.estado && !isOutroEstado(localidade.estadoSelecionado) && (
                <FormHelperText>{errors.estado}</FormHelperText>
              )}
            </FormControl>
            {isOutroEstado(localidade.estadoSelecionado) && (
              <TextField
                label="UF do estado"
                value={localidade.estadoCustom}
                onChange={(e) =>
                  handleLocalidadeChange({ estadoCustom: e.target.value.toUpperCase().slice(0, 2) })
                }
                error={Boolean(errors.estado)}
                helperText={errors.estado ?? 'Informe a sigla com 2 letras (ex.: SP, MG).'}
                required
                fullWidth
                inputProps={{ maxLength: 2 }}
              />
            )}
            <FormControl
              fullWidth
              required
              error={Boolean(errors.cidade)}
              disabled={!podeSelecionarCidade}
            >
              <InputLabel>Cidade</InputLabel>
              <Select
                label="Cidade"
                value={localidade.cidadeSelecionada}
                onChange={(e) => handleLocalidadeChange({ cidadeSelecionada: e.target.value })}
              >
                {cidades.map((cidade) => (
                  <MenuItem key={cidade} value={cidade}>
                    {cidade}
                  </MenuItem>
                ))}
                <MenuItem value={OUTRO_CIDADE}>{LABEL_OUTRO_CIDADE}</MenuItem>
              </Select>
              {errors.cidade && !isOutroCidade(localidade.cidadeSelecionada) && (
                <FormHelperText>{errors.cidade}</FormHelperText>
              )}
            </FormControl>
            {isOutroCidade(localidade.cidadeSelecionada) && (
              <TextField
                label="Nome da cidade"
                value={localidade.cidadeCustom}
                onChange={(e) => handleLocalidadeChange({ cidadeCustom: e.target.value })}
                error={Boolean(errors.cidade)}
                helperText={errors.cidade ?? 'Informe o nome da cidade.'}
                required
                fullWidth
              />
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
