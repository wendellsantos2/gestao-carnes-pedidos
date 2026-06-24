import type { CreateCarnePayload, CreateCompradorPayload, CreatePedidoItemPayload } from '../types'

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

export function validateCarneForm(form: CreateCarnePayload): FieldErrors<'nome' | 'tipo' | 'precoKg'> {
  return {
    nome: validateRequired(form.nome, 'Nome'),
    tipo: validateRequired(form.tipo, 'Tipo'),
    precoKg: validatePositivePrice(form.precoKg),
  }
}

export function validateCompradorForm(
  form: CreateCompradorPayload,
): FieldErrors<'nome' | 'email'> {
  return {
    nome: validateRequired(form.nome, 'Nome do comprador'),
    email: validateEmail(form.email),
  }
}

export function validatePedidoCreate(
  compradorId: string,
  items: CreatePedidoItemPayload[],
): FieldErrors<'compradorId' | 'items'> {
  const errors: FieldErrors<'compradorId' | 'items'> = {}

  if (!compradorId) {
    errors.compradorId = 'Selecione um comprador.'
  }

  if (items.length === 0) {
    errors.items = 'Adicione pelo menos um item ao pedido.'
    return errors
  }

  const invalidItem = items.some(
    (item) => !item.carneId || validatePositiveQuantity(item.quantidade),
  )

  if (invalidItem) {
    errors.items = 'Todos os itens devem ter carne selecionada e quantidade maior que zero.'
  }

  return errors
}

export function hasFieldErrors<T extends string>(errors: FieldErrors<T>): boolean {
  return Object.values(errors).some(Boolean)
}

export function getFirstFieldError<T extends string>(errors: FieldErrors<T>): string | undefined {
  return Object.values(errors).find((value): value is string => Boolean(value))
}
