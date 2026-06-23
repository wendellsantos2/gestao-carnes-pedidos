import { isAxiosError } from 'axios'

const STATUS_MESSAGES: Record<number, string> = {
  400: 'Os dados enviados são inválidos. Verifique os campos e tente novamente.',
  401: 'Sua sessão expirou. Faça login novamente.',
  403: 'Você não tem permissão para realizar esta ação.',
  404: 'O recurso solicitado não foi encontrado.',
  409: 'Não foi possível concluir a operação por conflito de dados.',
  422: 'Não foi possível processar os dados enviados.',
  500: 'Ocorreu um erro interno no servidor. Tente novamente em instantes.',
  503: 'O serviço está temporariamente indisponível. Tente novamente mais tarde.',
}

export function resolveErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const apiMessage = error.response?.data?.message
    if (typeof apiMessage === 'string' && apiMessage.trim()) {
      return apiMessage
    }

    if (error.code === 'ECONNABORTED') {
      return 'A requisição demorou demais. Verifique sua conexão e tente novamente.'
    }

    if (!error.response) {
      return 'Não foi possível conectar ao servidor. Verifique se a API está em execução.'
    }

    const statusMessage = STATUS_MESSAGES[error.response.status]
    if (statusMessage) return statusMessage
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return 'Ocorreu um erro inesperado. Tente novamente.'
}
