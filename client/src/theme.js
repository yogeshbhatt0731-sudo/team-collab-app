import { createTheme } from '@mui/material/styles'

export const cloveColors = {
  navy: '#0f172a',
  navySoft: '#172033',
  slate: '#334155',
  blue: '#2563eb',
  blueSoft: '#dbeafe',
  surface: '#ffffff',
  appBg: '#f7f8fb',
  border: '#e2e8f0',
  text: '#111827',
  muted: '#64748b',
  success: '#16a34a',
  warning: '#f59e0b',
}

export const darkColors = {
  navy: '#0f172a',
  navySoft: '#1e293b',
  slate: '#475569',
  blue: '#3b82f6',
  blueSoft: '#1e3a8a',
  surface: '#1e293b',
  appBg: '#0f172a',
  border: '#334155',
  text: '#f1f5f9',
  muted: '#94a3b8',
  success: '#22c55e',
  warning: '#fbbf24',
}

export const createAppTheme = (mode = 'light') => {
  const colors = mode === 'light' ? cloveColors : darkColors

  return createTheme({
    palette: {
      mode,
      primary: {
        main: colors.blue,
        dark: mode === 'light' ? '#1d4ed8' : '#1e40af',
        light: mode === 'light' ? '#eff6ff' : '#1e3a8a',
      },
      background: {
        default: colors.appBg,
        paper: colors.surface,
      },
      text: {
        primary: colors.text,
        secondary: colors.muted,
      },
      divider: colors.border,
    },
    typography: {
      fontFamily:
        'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      h4: {
        fontWeight: 700,
        letterSpacing: 0,
      },
      h5: {
        fontWeight: 700,
        letterSpacing: 0,
      },
      h6: {
        fontWeight: 700,
        letterSpacing: 0,
      },
      button: {
        fontWeight: 700,
        letterSpacing: 0,
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: 'none',
            textTransform: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
        },
      },
    },
  })
}

const theme = createAppTheme('light')

export default theme
