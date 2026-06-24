import { describe, expect, it } from 'vitest'
import {
  hasFieldErrors,
  validateCarneForm,
  validateCompradorForm,
  validatePositivePrice,
  validateRequired,
} from '../src/utils/validation'

describe('validateRequired', () => {
  it('exige nome do comprador', () => {
    expect(validateRequired('', 'Nome do comprador')).toBe('Nome do comprador é obrigatório.')
    expect(validateRequired('João', 'Nome do comprador')).toBeUndefined()
  })
})

describe('validatePositivePrice', () => {
  it('rejeita preço zero ou negativo', () => {
    expect(validatePositivePrice(0)).toBe('O preço deve ser maior que zero.')
    expect(validatePositivePrice(-1)).toBe('O preço deve ser maior que zero.')
    expect(validatePositivePrice(10.5)).toBeUndefined()
  })
})

describe('validateCarneForm', () => {
  it('valida campos obrigatórios e preço positivo', () => {
    const errors = validateCarneForm({ nome: '', tipo: '', precoKg: 0 })
    expect(hasFieldErrors(errors)).toBe(true)
    expect(errors.nome).toBeTruthy()
    expect(errors.precoKg).toBeTruthy()
  })
})

describe('validateCompradorForm', () => {
  it('exige nome do comprador', () => {
    const errors = validateCompradorForm({ nome: '', email: 'a@b.com', telefone: '', endereco: '' })
    expect(errors.nome).toBe('Nome do comprador é obrigatório.')
  })
})
