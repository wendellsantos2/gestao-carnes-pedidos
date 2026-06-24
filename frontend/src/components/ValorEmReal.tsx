import { Typography } from '@mui/material'
import type { MoedaPedido } from '../types'
import type { CotacoesUsdEur } from '../services/cotacaoService'
import { convertValorParaBrl, simboloMoeda } from '../services/cotacaoService'
import { formatCurrency } from '../utils/format'

interface ValorEmRealProps {
  valorOriginal: number
  cotacoes: CotacoesUsdEur
  moeda?: MoedaPedido
  variant?: 'body2' | 'subtitle2' | 'inherit'
  showOriginal?: boolean
}

export default function ValorEmReal({
  valorOriginal,
  cotacoes,
  moeda = 'BRL',
  variant = 'body2',
  showOriginal = true,
}: ValorEmRealProps) {
  const valorBrl = convertValorParaBrl(valorOriginal, cotacoes, moeda)
  const simbolo = simboloMoeda(moeda)

  return (
    <>
      <Typography component="span" variant={variant} fontWeight={variant === 'subtitle2' ? 600 : 400}>
        {formatCurrency(valorBrl)}
      </Typography>
      {showOriginal && moeda !== 'BRL' && (
        <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
          ({simbolo} {valorOriginal.toFixed(2)})
        </Typography>
      )}
    </>
  )
}
