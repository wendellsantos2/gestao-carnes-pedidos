import { describe, expect, it } from 'vitest'
import {
  hasFieldErrors,
  validateCarneForm,
  validateCompradorForm,
  validateCompradorLocalidade,
  validatePositivePrice,
  validateRequired,
} from '../src/utils/validation'
import { OUTRO_CIDADE, OUTRO_ESTADO } from '../src/data/estadosCidades'

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
  it('valida descrição e origem obrigatórias', () => {
    const errors = validateCarneForm({ nome: '', origem: '' as never })
    expect(hasFieldErrors(errors)).toBe(true)
    expect(errors.nome).toBeTruthy()
    expect(errors.origem).toBeTruthy()
  })

  it('aceita descrição e origem válidas', () => {
    const errors = validateCarneForm({ nome: 'Picanha', origem: 'Bovina' })
    expect(hasFieldErrors(errors)).toBe(false)
  })
})

describe('validateCompradorForm', () => {
  it('exige nome e documento do comprador', () => {
    const errors = validateCompradorForm({
      nome: '',
      documento: '',
      cidade: '',
      estado: '',
    })
    expect(errors.nome).toBe('Nome do comprador é obrigatório.')
    expect(errors.documento).toBe('Documento é obrigatório.')
  })

  it('aceita CPF válido com cidade e estado da lista', () => {
    const errors = validateCompradorForm(
      {
        nome: 'João Silva',
        documento: '52998224725',
        cidade: 'São Paulo',
        estado: 'SP',
      },
      {
        estadoSelecionado: 'SP',
        estadoCustom: '',
        cidadeSelecionada: 'São Paulo',
        cidadeCustom: '',
      },
    )
    expect(hasFieldErrors(errors)).toBe(false)
  })
})

describe('validateCompradorLocalidade', () => {
  it('aceita estado e cidade informados manualmente', () => {
    const errors = validateCompradorLocalidade({
      estadoSelecionado: OUTRO_ESTADO,
      estadoCustom: 'SP',
      cidadeSelecionada: OUTRO_CIDADE,
      cidadeCustom: 'Guarulhos',
    })
    expect(hasFieldErrors(errors)).toBe(false)
  })

  it('exige UF válida ao escolher outro estado', () => {
    const errors = validateCompradorLocalidade({
      estadoSelecionado: OUTRO_ESTADO,
      estadoCustom: 'XX',
      cidadeSelecionada: OUTRO_CIDADE,
      cidadeCustom: 'Cidade Teste',
    })
    expect(errors.estado).toBeTruthy()
  })
})
