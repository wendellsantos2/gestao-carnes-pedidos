import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material'
import { CurrencyExchange as CurrencyExchangeIcon } from '@mui/icons-material'
import {
  convertToBrl,
  fetchCotacoesUsdEur,
  type CotacoesUsdEur,
} from '../services/cotacaoService'
import { formatCurrency } from '../utils/format'

const EXEMPLO_VALOR = 10

export default function CotacaoCard() {
  const [cotacoes, setCotacoes] = useState<CotacoesUsdEur | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadCotacoes() {
      setLoading(true)
      setError('')

      try {
        const data = await fetchCotacoesUsdEur()
        if (!active) return
        setCotacoes(data)
      } catch (err) {
        if (!active) return
        setError(err instanceof Error ? err.message : 'Não foi possível carregar as cotações.')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadCotacoes()

    return () => {
      active = false
    }
  }, [])

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CurrencyExchangeIcon color="primary" />
          <Typography variant="h6">Cotações USD/EUR → BRL (AwesomeAPI)</Typography>
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CircularProgress size={20} />
            <Typography variant="body2" color="text.secondary">
              Carregando cotações da AwesomeAPI...
            </Typography>
          </Box>
        )}

        {error && <Alert severity="warning">{error}</Alert>}

        {cotacoes && !loading && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Dólar (USD)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Compra: {formatCurrency(cotacoes.usd.bid)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                US$ {EXEMPLO_VALOR} = {formatCurrency(convertToBrl(EXEMPLO_VALOR, cotacoes.usd))}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Euro (EUR)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Compra: {formatCurrency(cotacoes.eur.bid)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                € {EXEMPLO_VALOR} = {formatCurrency(convertToBrl(EXEMPLO_VALOR, cotacoes.eur))}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">
                Atualizado em {cotacoes.usd.createDate}
              </Typography>
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  )
}
