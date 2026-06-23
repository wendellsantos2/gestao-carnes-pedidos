import { AxiosError, AxiosHeaders } from 'axios'
import { describe, expect, it } from 'vitest'
import { resolveErrorMessage } from '../src/utils/errorMessages'

describe('resolveErrorMessage', () => {
  it('retorna mensagem da API quando disponível', () => {
    const error = new AxiosError(
      'Request failed',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: { headers: new AxiosHeaders() },
        data: { message: 'Carne possui pedidos vinculados' },
      },
    )

    expect(resolveErrorMessage(error)).toBe('Carne possui pedidos vinculados')
  })

  it('retorna mensagem amigável para erro de rede', () => {
    const error = new AxiosError('Network Error', 'ERR_NETWORK')

    expect(resolveErrorMessage(error)).toBe(
      'Não foi possível conectar ao servidor. Verifique se a API está em execução.',
    )
  })

  it('retorna mensagem amigável para timeout', () => {
    const error = new AxiosError('timeout', 'ECONNABORTED')

    expect(resolveErrorMessage(error)).toBe(
      'A requisição demorou demais. Verifique sua conexão e tente novamente.',
    )
  })

  it('retorna mensagem amigável para status HTTP conhecido', () => {
    const error = new AxiosError(
      'Not Found',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config: { headers: new AxiosHeaders() },
        data: {},
      },
    )

    expect(resolveErrorMessage(error)).toBe('O recurso solicitado não foi encontrado.')
  })

  it('retorna mensagem de Error genérico', () => {
    expect(resolveErrorMessage(new Error('Falha customizada'))).toBe('Falha customizada')
  })
})
