import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'
import { useState, useEffect } from 'react'
import App from './App.jsx'
import { createAppTheme } from './theme.js'
import './index.css'

function Root() {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('theme_mode')
    return saved || 'light'
  })

  useEffect(() => {
    localStorage.setItem('theme_mode', mode)
  }, [mode])

  const theme = createAppTheme(mode)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App themeMode={mode} onThemeModeChange={setMode} />
      </BrowserRouter>
    </ThemeProvider>
  )
}

createRoot(document.getElementById('root')).render(<Root />)
