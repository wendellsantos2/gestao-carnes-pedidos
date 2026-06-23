import { Button, Stack, Typography } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'

interface PageHeaderProps {
  title: string
  onAdd: () => void
  addLabel?: string
}

export default function PageHeader({ title, onAdd, addLabel = 'Novo' }: PageHeaderProps) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      justifyContent="space-between"
      alignItems={{ xs: 'stretch', sm: 'center' }}
      spacing={2}
      sx={{ mb: 3 }}
    >
      <Typography variant="h4" component="h1">
        {title}
      </Typography>
      <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd}>
        {addLabel}
      </Button>
    </Stack>
  )
}
