import type { CreateCarnePayload, CreateCompradorPayload, CreatePedidoItemPayload, MoedaPedido, OrigemCarne } from '../types'
import { MOEDAS_PEDIDO, ORIGENS_CARNE } from '../types'
import {
  isCidadeValidaParaEstado,
  isEstadoValido,
  isOutroCidade,
  isOutroEstado,
  resolveCompradorLocalidade,
  type CompradorLocalidadeInput,
} from '../data/estadosCidades'
import { apenasDigitos } from './documento'

export type FieldErrors<T extends string> = Partial<Record<T, string>>

export function validateRequired(value: string, fieldLabel: string): string | undefined {
  if (!value.trim()) {
    return `${fieldLabel} é obrigatório.`
  }
  return undefined
}

export function validatePositivePrice(value: number): string | undefined {
  if (!Number.isFinite(value) || value <= 0) {
    return 'O preço deve ser maior que zero.'
  }
  return undefined
}

export function validateEmail(value: string): string | undefined {
  if (!value.trim()) {
    return 'E-mail é obrigatório.'
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(value.trim())) {
    return 'Informe um e-mail válido.'
  }

  return undefined
}

export function validatePositiveQuantity(value: number): string | undefined {
  if (!Number.isInteger(value) || value <= 0) {
    return 'A quantidade deve ser um número inteiro maior que zero.'
  }
  return undefined
}

export function validateOrigemCarne(value: string): string | undefined {
  if (!ORIGENS_CARNE.includes(value as OrigemCarne)) {
    return 'Selecione uma origem válida (Bovina, Suína, Aves ou Peixes).'
  }
  return undefined
}

export function validateCarneForm(form: CreateCarnePayload): FieldErrors<'nome' | 'origem'> {
  return {
    nome: validateRequired(form.nome, 'Descrição da carne'),
    origem: !form.origem ? 'Selecione a origem da carne.' : validateOrigemCarne(form.origem),
  }
}

export function validateDocumento(value: string): string | undefined {
  const digits = apenasDigitos(value)

  if (!digits) {
    return 'Documento é obrigatório.'
  }

  if (digits.length !== 11 && digits.length !== 14) {
    return 'Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.'
  }

  return undefined
}

export function validateUf(value: string): string | undefined {
  const uf = value.trim().toUpperCase()

  if (!uf) {
    return 'Informe a UF do estado.'
  }

  if (uf.length !== 2) {
    return 'A UF deve ter 2 letras (ex.: SP, RJ).'
  }

  if (!isEstadoValido(uf)) {
    return 'UF inválida. Use a sigla de um estado brasileiro.'
  }

  return undefined
}

export function validateCompradorLocalidade(
  localidade: CompradorLocalidadeInput,
): FieldErrors<'estado' | 'cidade'> {
  const { estado, cidade } = resolveCompradorLocalidade(localidade)

  const errors: FieldErrors<'estado' | 'cidade'> = {}

  if (!localidade.estadoSelecionado) {
    errors.estado = 'Selecione o estado.'
  } else if (isOutroEstado(localidade.estadoSelecionado)) {
    errors.estado = validateUf(localidade.estadoCustom)
  } else if (!isEstadoValido(localidade.estadoSelecionado)) {
    errors.estado = 'Estado inválido.'
  }

  if (!localidade.cidadeSelecionada) {
    errors.cidade = 'Selecione a cidade.'
  } else if (isOutroCidade(localidade.cidadeSelecionada)) {
    errors.cidade = validateRequired(localidade.cidadeCustom, 'Cidade')
  } else if (estado && !isCidadeValidaParaEstado(cidade, estado)) {
    errors.cidade = 'Cidade inválida para o estado selecionado.'
  }

  return errors
}

export function validateCompradorForm(
  form: CreateCompradorPayload,
  localidade?: CompradorLocalidadeInput,
): FieldErrors<'nome' | 'documento' | 'cidade' | 'estado'> {
  const localidadeErrors = localidade ? validateCompradorLocalidade(localidade) : {}

  return {
    nome: validateRequired(form.nome, 'Nome do comprador'),
    documento: validateDocumento(form.documento),
    estado: localidadeErrors.estado,
    cidade: localidadeErrors.cidade,
  }
}

export function validateMoeda(value: string): string | undefined {
  const moedasValidas = MOEDAS_PEDIDO.map((option) => option.value)
  if (!moedasValidas.includes(value as MoedaPedido)) {
    return 'Selecione uma moeda válida (Real, Dólar ou Euro).'
  }
  return undefined
}

export function validatePedidoCreate(
  compradorId: string,
  items: CreatePedidoItemPayload[],
  dataPedido?: string,
): FieldErrors<'compradorId' | 'items' | 'dataPedido'> {
  const errors: FieldErrors<'compradorId' | 'items' | 'dataPedido'> = {}

  if (!compradorId) {
    errors.compradorId = 'Selecione um comprador.'
  }

  if (dataPedido !== undefined && !dataPedido.trim()) {
    errors.dataPedido = 'Informe a data do pedido.'
  }

  if (items.length === 0) {
    errors.items = 'Adicione pelo menos um item ao pedido.'
    return errors
  }

  const invalidItem = items.some(
    (item) =>
      !item.carneId ||
      validatePositiveQuantity(item.quantidade) ||
      validatePositivePrice(item.precoUnitario) ||
      validateMoeda(item.moeda),
  )

  if (invalidItem) {
    errors.items =
      'Todos os itens devem ter carne, quantidade, preço e moeda válidos.'
  }

  return errors
}

export function hasFieldErrors<T extends string>(errors: FieldErrors<T>): boolean {
  return Object.values(errors).some(Boolean)
}

export function getFirstFieldError<T extends string>(errors: FieldErrors<T>): string | undefined {
  return Object.values(errors).find((value): value is string => Boolean(value))
}
