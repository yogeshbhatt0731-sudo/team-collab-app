import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { registerLicense } from '@syncfusion/ej2-base'
import App from './App.jsx'

// Syncfusion component styles (bootstrap5 theme) — base first, then each package used.
import '@syncfusion/ej2-base/styles/bootstrap5.css'
import '@syncfusion/ej2-buttons/styles/bootstrap5.css'
import '@syncfusion/ej2-inputs/styles/bootstrap5.css'
import '@syncfusion/ej2-popups/styles/bootstrap5.css'
import '@syncfusion/ej2-splitbuttons/styles/bootstrap5.css'
import '@syncfusion/ej2-dropdowns/styles/bootstrap5.css'
import '@syncfusion/ej2-navigations/styles/bootstrap5.css'
import '@syncfusion/ej2-layouts/styles/bootstrap5.css'
import '@syncfusion/ej2-kanban/styles/bootstrap5.css'

import './styles/theme.css'

// Register the Syncfusion community license once, before render, to kill the trial banner.
// Put your key in client/.env as VITE_SYNCFUSION_LICENSE=...
registerLicense(import.meta.env.VITE_SYNCFUSION_LICENSE || '')

function Root() {
  const [mode, setMode] = useState(() => localStorage.getItem('theme_mode') || 'light')

  useEffect(() => {
    localStorage.setItem('theme_mode', mode)
    document.documentElement.setAttribute('data-theme', mode)
  }, [mode])

  return (
    <BrowserRouter>
      <App themeMode={mode} onThemeModeChange={setMode} />
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<Root />)
