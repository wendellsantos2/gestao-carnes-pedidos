import { describe, expect, it } from 'vitest'
import { formatCurrency, formatDate } from '../src/utils/format'

describe('formatCurrency', () => {
  it('formata valores em real brasileiro', () => {
    expect(formatCurrency(10)).toMatch(/R\$\s?10,00/)
  })
})

describe('formatDate', () => {
  it('formata datas em pt-BR', () => {
    const formatted = formatDate('2026-06-23T12:00:00.000Z')
    expect(formatted).toContain('2026')
  })
})
