import { useEffect, useState } from 'react'
import { Alert, CircularProgress, Stack, Typography } from '@mui/material'
import api, { API_BASE_URL } from '../services/api'
import { resolveErrorMessage } from '../utils/errorMessages'

type Status = 'loading' | 'connected' | 'error'

export default function ApiStatus() {
  const [status, setStatus] = useState<Status>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let active = true

    async function checkConnection() {
      try {
        await api.get('/carnes')
        if (!active) return
        setStatus('connected')
        setMessage('Conexão com a API estabelecida com sucesso.')
      } catch (error) {
        if (!active) return
        setStatus('error')
        setMessage(resolveErrorMessage(error))
      }
    }

    checkConnection()

    return () => {
      active = false
    }
  }, [])

  if (status === 'loading') {
    return (
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">
          Verificando conexão com a API ({API_BASE_URL})...
        </Typography>
      </Stack>
    )
  }

  return (
    <Alert severity={status === 'connected' ? 'success' : 'error'} sx={{ mb: 3 }}>
      {message}
    </Alert>
  )
}
