import { Alert, Snackbar } from '@mui/material'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { resolveErrorMessage } from '../utils/errorMessages'

type NotificationSeverity = 'error' | 'success' | 'info'

interface NotificationState {
  open: boolean
  message: string
  severity: NotificationSeverity
}

interface ErrorHandlerContextValue {
  notifyError: (error: unknown) => void
  notifySuccess: (message: string) => void
  notifyInfo: (message: string) => void
}

const ErrorHandlerContext = createContext<ErrorHandlerContextValue | null>(null)

const initialState: NotificationState = {
  open: false,
  message: '',
  severity: 'error',
}

export function ErrorHandlerProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<NotificationState>(initialState)

  const showNotification = useCallback((message: string, severity: NotificationSeverity) => {
    setNotification({ open: true, message, severity })
  }, [])

  const notifyError = useCallback(
    (error: unknown) => showNotification(resolveErrorMessage(error), 'error'),
    [showNotification],
  )

  const notifySuccess = useCallback(
    (message: string) => showNotification(message, 'success'),
    [showNotification],
  )

  const notifyInfo = useCallback(
    (message: string) => showNotification(message, 'info'),
    [showNotification],
  )

  const value = useMemo(
    () => ({ notifyError, notifySuccess, notifyInfo }),
    [notifyError, notifySuccess, notifyInfo],
  )

  const handleClose = () => {
    setNotification((current) => ({ ...current, open: false }))
  }

  return (
    <ErrorHandlerContext.Provider value={value}>
      {children}
      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={notification.severity} variant="filled" sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </ErrorHandlerContext.Provider>
  )
}

export function useErrorHandler(): ErrorHandlerContextValue {
  const context = useContext(ErrorHandlerContext)

  if (!context) {
    throw new Error('useErrorHandler deve ser usado dentro de ErrorHandlerProvider.')
  }

  return context
}
