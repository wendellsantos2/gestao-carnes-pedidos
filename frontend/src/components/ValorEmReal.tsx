import { Typography } from '@mui/material'
import type { CotacoesUsdEur } from '../services/cotacaoService'
import { convertPrecoParaBrl, MOEDA_PRECOS_SISTEMA } from '../services/cotacaoService'
import { formatCurrency } from '../utils/format'

interface ValorEmRealProps {
  valorOriginal: number
  cotacoes: CotacoesUsdEur
  variant?: 'body2' | 'subtitle2' | 'inherit'
  showOriginal?: boolean
}

export default function ValorEmReal({
  valorOriginal,
  cotacoes,
  variant = 'body2',
  showOriginal = true,
}: ValorEmRealProps) {
  const valorBrl = convertPrecoParaBrl(valorOriginal, cotacoes, MOEDA_PRECOS_SISTEMA)
  const simbolo = MOEDA_PRECOS_SISTEMA === 'USD' ? 'US$' : '€'

  return (
    <>
      <Typography component="span" variant={variant} fontWeight={variant === 'subtitle2' ? 600 : 400}>
        {formatCurrency(valorBrl)}
      </Typography>
      {showOriginal && (
        <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
          ({simbolo} {valorOriginal.toFixed(2)})
        </Typography>
      )}
    </>
  )
}
