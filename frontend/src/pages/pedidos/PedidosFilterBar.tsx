import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { FilterAlt as FilterAltIcon } from '@mui/icons-material'
import type { Comprador } from '../../types'
import type { PedidosFilters } from '../../utils/pedidosFilter'

export type { PedidosFilters }
export { emptyPedidosFilters } from '../../utils/pedidosFilter'

interface PedidosFilterBarProps {
  compradores: Comprador[]
  filters: PedidosFilters
  resultCount: number
  totalCount: number
  onChange: (filters: PedidosFilters) => void
  onClear: () => void
}

export default function PedidosFilterBar({
  compradores,
  filters,
  resultCount,
  totalCount,
  onChange,
  onClear,
}: PedidosFilterBarProps) {
  const hasActiveFilters = Boolean(filters.compradorId || filters.dataInicio || filters.dataFim)

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <FilterAltIcon color="action" fontSize="small" />
        <Typography variant="subtitle1">Filtros</Typography>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'flex-end' }}>
        <FormControl fullWidth sx={{ minWidth: 200 }}>
          <InputLabel>Comprador</InputLabel>
          <Select
            label="Comprador"
            value={filters.compradorId}
            onChange={(e) => onChange({ ...filters, compradorId: e.target.value })}
          >
            <MenuItem value="">Todos</MenuItem>
            {compradores.map((comprador) => (
              <MenuItem key={comprador.id} value={comprador.id}>
                {comprador.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Data inicial"
          type="date"
          value={filters.dataInicio}
          onChange={(e) => onChange({ ...filters, dataInicio: e.target.value })}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        <TextField
          label="Data final"
          type="date"
          value={filters.dataFim}
          onChange={(e) => onChange({ ...filters, dataFim: e.target.value })}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
          <Button variant="outlined" onClick={onClear} disabled={!hasActiveFilters}>
            Limpar
          </Button>
        </Box>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Exibindo {resultCount} de {totalCount} pedido(s)
      </Typography>
    </Paper>
  )
}
