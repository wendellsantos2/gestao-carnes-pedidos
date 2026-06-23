import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'
import App from './App'
import { ErrorHandlerProvider } from './components/ErrorHandlerProvider'
import theme from './theme/theme'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorHandlerProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ErrorHandlerProvider>
    </ThemeProvider>
  </StrictMode>,
)
