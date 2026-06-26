import { Box, Button, Stack, Typography } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { cloveColors } from '../theme'

const navItems = [
  { label: 'Home', path: '/home' },
  { label: 'Workspaces', path: '/workspaces' },
  { label: 'Settings', path: '/settings' },
]

function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => {
    if (path === '/home') return location.pathname === '/home'
    return location.pathname.startsWith(path)
  }

  return (
    <Box
      component="aside"
      sx={{
        width: { xs: '100%', md: 244 },
        bgcolor: cloveColors.navy,
        color: '#cbd5e1',
        px: 2,
        py: 2.5,
        display: 'flex',
        flexDirection: { xs: 'row', md: 'column' },
        alignItems: { xs: 'center', md: 'stretch' },
        gap: 3,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: 'white',
          fontSize: 22,
          lineHeight: 1,
          letterSpacing: 0,
          minWidth: { xs: 84, md: 'auto' },
          cursor: 'pointer',
          '&:hover': {
            opacity: 0.8,
          },
        }}
        onClick={() => navigate('/home')}
      >
        Team Collab App
      </Typography>

      <Stack
        component="nav"
        direction={{ xs: 'row', md: 'column' }}
        spacing={1}
        sx={{ width: '100%', overflowX: { xs: 'auto', md: 'visible' } }}
      >
        {navItems.map((item) => {
          const active = isActive(item.path)

          return (
            <Button
              key={item.label}
              disableElevation
              onClick={() => navigate(item.path)}
              sx={{
                justifyContent: 'flex-start',
                minWidth: { xs: 'max-content', md: 'auto' },
                color: active ? '#ffffff' : '#94a3b8',
                bgcolor: active ? 'rgba(37, 99, 235, 0.28)' : 'transparent',
                border: '1px solid',
                borderColor: active ? 'rgba(147, 197, 253, 0.28)' : 'transparent',
                px: 1.5,
                py: 1.1,
                fontWeight: active ? 800 : 700,
                '&:hover': {
                  color: '#ffffff',
                  bgcolor: active ? 'rgba(37, 99, 235, 0.34)' : 'rgba(148, 163, 184, 0.12)',
                },
              }}
            >
              {item.label}
            </Button>
          )
        })}
      </Stack>
    </Box>
  )
}

export default Sidebar
