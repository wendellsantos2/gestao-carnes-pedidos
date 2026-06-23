import { describe, expect, it } from 'vitest'
import {
  convertPrecoParaBrl,
  convertToBrl,
  getCotacaoPorMoeda,
  parseCotacoesResponse,
  type CotacaoMoeda,
} from '../src/services/cotacaoService'

const cotacaoUsd: CotacaoMoeda = {
  code: 'USD',
  codein: 'BRL',
  name: 'Dólar Americano/Real Brasileiro',
  bid: 5.5,
  ask: 5.51,
  high: 5.6,
  low: 5.4,
  pctChange: 0.1,
  createDate: '2026-06-23 10:00:00',
}

const cotacaoEur: CotacaoMoeda = {
  code: 'EUR',
  codein: 'BRL',
  name: 'Euro/Real Brasileiro',
  bid: 6.2,
  ask: 6.21,
  high: 6.3,
  low: 6.1,
  pctChange: -0.2,
  createDate: '2026-06-23 10:00:00',
}

describe('parseCotacoesResponse', () => {
  it('converte a resposta da AwesomeAPI para o formato interno', () => {
    const result = parseCotacoesResponse({
      USDBRL: {
        code: 'USD',
        codein: 'BRL',
        name: 'Dólar Americano/Real Brasileiro',
        bid: '5.5',
        ask: '5.51',
        high: '5.6',
        low: '5.4',
        pctChange: '0.1',
        create_date: '2026-06-23 10:00:00',
      },
      EURBRL: {
        code: 'EUR',
        codein: 'BRL',
        name: 'Euro/Real Brasileiro',
        bid: '6.2',
        ask: '6.21',
        high: '6.3',
        low: '6.1',
        pctChange: '-0.2',
        create_date: '2026-06-23 10:00:00',
      },
    })

    expect(result.usd.bid).toBe(5.5)
    expect(result.eur.bid).toBe(6.2)
  })

  it('lança erro quando alguma moeda não é retornada', () => {
    expect(() => parseCotacoesResponse({ USDBRL: {} as never })).toThrow(
      'Cotações de USD e EUR não foram retornadas pela AwesomeAPI.',
    )
  })
})

describe('convertToBrl', () => {
  it('converte USD para BRL usando a cotação de compra', () => {
    expect(convertToBrl(10, cotacaoUsd)).toBe(55)
  })

  it('converte EUR para BRL usando a cotação de compra', () => {
    expect(convertToBrl(10, cotacaoEur)).toBe(62)
  })

  it('rejeita valores negativos', () => {
    expect(() => convertToBrl(-1, cotacaoUsd)).toThrow(
      'O valor para conversão deve ser maior ou igual a zero.',
    )
  })
})

describe('convertPrecoParaBrl', () => {
  it('converte preço do sistema (USD) para BRL', () => {
    const cotacoes = { usd: cotacaoUsd, eur: cotacaoEur }
    expect(convertPrecoParaBrl(10, cotacoes, 'USD')).toBe(55)
  })
})

describe('getCotacaoPorMoeda', () => {
  it('retorna a cotação correta por moeda', () => {
    const cotacoes = { usd: cotacaoUsd, eur: cotacaoEur }

    expect(getCotacaoPorMoeda(cotacoes, 'USD')).toBe(cotacaoUsd)
    expect(getCotacaoPorMoeda(cotacoes, 'EUR')).toBe(cotacaoEur)
  })
})
