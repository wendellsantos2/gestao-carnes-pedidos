import { useEffect, useState } from 'react'
import {
  fetchCotacoesUsdEur,
  type CotacoesUsdEur,
} from '../services/cotacaoService'
import { resolveErrorMessage } from '../utils/errorMessages'

export function useCotacoes() {
  const [cotacoes, setCotacoes] = useState<CotacoesUsdEur | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      setError('')

      try {
        const data = await fetchCotacoesUsdEur()
        if (!active) return
        setCotacoes(data)
      } catch (err) {
        if (!active) return
        setError(resolveErrorMessage(err))
      } finally {
        if (active) setLoading(false)
      }
    }

    load()

    return () => {
      active = false
    }
  }, [])

  return { cotacoes, loading, error }
}
