import { Button, CircularProgress, type ButtonProps } from '@mui/material'

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean
  loadingLabel?: string
}

export default function LoadingButton({
  loading = false,
  loadingLabel = 'Salvando...',
  disabled,
  children,
  startIcon,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      {...props}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : startIcon}
    >
      {loading ? loadingLabel : children}
    </Button>
  )
}
