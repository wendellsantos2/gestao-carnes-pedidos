import axios from 'axios'
import { resolveErrorMessage } from '../utils/errorMessages'

const COTACAO_API_URL =
  import.meta.env.VITE_COTACAO_API_URL ?? '/cotacao/json/last/USD-BRL,EUR-BRL'

export type MoedaEstrangeira = 'USD' | 'EUR'

/** Moeda em que os preços de carnes e pedidos são armazenados no sistema. */
export const MOEDA_PRECOS_SISTEMA: MoedaEstrangeira = 'USD'

export interface CotacaoMoeda {
  code: MoedaEstrangeira
  codein: 'BRL'
  name: string
  bid: number
  ask: number
  high: number
  low: number
  pctChange: number
  createDate: string
}

export interface CotacoesUsdEur {
  usd: CotacaoMoeda
  eur: CotacaoMoeda
}

interface AwesomeApiQuote {
  code: string
  codein: string
  name: string
  bid: string
  ask: string
  high: string
  low: string
  pctChange: string
  create_date: string
}

type AwesomeApiResponse = Record<string, AwesomeApiQuote>

const cotacaoApi = axios.create({
  timeout: 10_000,
  headers: { Accept: 'application/json' },
})

function parseQuote(quote: AwesomeApiQuote, code: MoedaEstrangeira): CotacaoMoeda {
  return {
    code,
    codein: 'BRL',
    name: quote.name,
    bid: Number(quote.bid),
    ask: Number(quote.ask),
    high: Number(quote.high),
    low: Number(quote.low),
    pctChange: Number(quote.pctChange),
    createDate: quote.create_date,
  }
}

export function parseCotacoesResponse(data: AwesomeApiResponse): CotacoesUsdEur {
  const usd = data.USDBRL
  const eur = data.EURBRL

  if (!usd || !eur) {
    throw new Error('Cotações de USD e EUR não foram retornadas pela AwesomeAPI.')
  }

  return {
    usd: parseQuote(usd, 'USD'),
    eur: parseQuote(eur, 'EUR'),
  }
}

export async function fetchCotacoesUsdEur(): Promise<CotacoesUsdEur> {
  try {
    const { data } = await cotacaoApi.get<AwesomeApiResponse>(COTACAO_API_URL)
    return parseCotacoesResponse(data)
  } catch (error) {
    throw new Error(resolveErrorMessage(error))
  }
}

export function convertToBrl(value: number, cotacao: CotacaoMoeda): number {
  if (value < 0) {
    throw new Error('O valor para conversão deve ser maior ou igual a zero.')
  }

  if (!Number.isFinite(cotacao.bid) || cotacao.bid <= 0) {
    throw new Error('Cotação inválida para conversão.')
  }

  return Number((value * cotacao.bid).toFixed(2))
}

export function getCotacaoPorMoeda(
  cotacoes: CotacoesUsdEur,
  moeda: MoedaEstrangeira,
): CotacaoMoeda {
  return moeda === 'USD' ? cotacoes.usd : cotacoes.eur
}

/** Converte valor armazenado em moeda estrangeira para BRL (ex.: preços de pedidos em USD). */
export function convertPrecoParaBrl(
  valorNaMoedaOrigem: number,
  cotacoes: CotacoesUsdEur,
  moeda: MoedaEstrangeira = 'USD',
): number {
  return convertToBrl(valorNaMoedaOrigem, getCotacaoPorMoeda(cotacoes, moeda))
}
