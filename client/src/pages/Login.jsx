import {
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  Link as MuiLink,
  Paper,
  Stack,
  TextField,
  Typography,
  Alert,
} from '@mui/material'
import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { mockUsers } from '../data/mockData'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    const user = mockUsers.find((u) => u.email === email)

    if (!user) {
      setError('User not found. Please check your email.')
      return
    }

    if (password.length < 6) {
      setError('Invalid password')
      return
    }

    localStorage.setItem('clove_access_token', `token_${user.id}_${Date.now()}`)
    localStorage.setItem('current_user', JSON.stringify(user))
    
    navigate('/home')
  }

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          background:
            'linear-gradient(135deg, #f7f4ea 0%, #e7f0ff 45%, #d6efe3 100%)',
          py: 6,
        }}
      >
        <Container maxWidth="lg">
          <Paper
            elevation={0}
            sx={{
              overflow: 'hidden',
              borderRadius: 6,
              border: '1px solid rgba(15, 23, 42, 0.08)',
              boxShadow: '0 28px 80px rgba(15, 23, 42, 0.12)',
            }}
          >
            <Grid container>
              <Grid size={{ xs: 12, md: 5 }}>
                <Box
                  sx={{
                    height: '100%',
                    color: '#fffdf7',
                    p: { xs: 4, md: 5 },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    background:
                      'linear-gradient(160deg, #0f172a 0%, #17324d 52%, #146c94 100%)',
                  }}
                >
                  <Stack spacing={2.5}>
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: '16px',
                        display: 'grid',
                        placeItems: 'center',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        bgcolor: 'rgba(255,255,255,0.14)',
                        border: '1px solid rgba(255,255,255,0.2)',
                      }}
                    >
                      TC
                    </Box>
                    <Typography variant="overline" sx={{ letterSpacing: 2.4, opacity: 0.8 }}>
                      Team Collab App
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        lineHeight: 1.05,
                        fontSize: { xs: '2rem', md: '2.6rem' },
                      }}
                    >
                      Welcome back to your team workspace.
                    </Typography>
                    <Typography sx={{ maxWidth: 420, opacity: 0.86, lineHeight: 1.7 }}>
                      Sign in to review updates, manage tasks, and keep your collaboration flowing
                      without losing momentum.
                    </Typography>
                  </Stack>

                  <Stack spacing={1.5} sx={{ mt: 6 }}>
                    <Typography sx={{ fontWeight: 600 }}>Everything in one place</Typography>
                    <Typography sx={{ opacity: 0.82 }}>
                      Projects, conversations, and team coordination built for everyday work.
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7, mt: 2 }}>
                      Demo: Use yogesh@example.com / password
                    </Typography>
                  </Stack>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 7 }}>
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleLogin}
                  sx={{
                    p: { xs: 4, sm: 5 },
                    backgroundColor: '#fffdfa',
                  }}
                >
                  <Stack spacing={1} sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#162033' }}>
                      Sign in
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                      Use your email and password to access your account.
                    </Typography>
                  </Stack>

                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}

                  <Stack spacing={2.5}>
                    <TextField
                      fullWidth
                      required
                      type="email"
                      label="Email address"
                      name="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                      fullWidth
                      required
                      type="password"
                      label="Password"
                      name="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Stack>

                  <Box
                    sx={{
                      mt: 2,
                      display: 'flex',
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      justifyContent: 'space-between',
                      gap: 1.5,
                      flexDirection: { xs: 'column', sm: 'row' },
                    }}
                  >
                    <FormControlLabel control={<Checkbox defaultChecked />} label="Remember me" />
                    <MuiLink href="#" underline="hover" sx={{ fontWeight: 600, color: '#0f766e' }}>
                      Forgot password?
                    </MuiLink>
                  </Box>

                  <Stack spacing={2} sx={{ mt: 3 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      sx={{
                        py: 1.5,
                        fontWeight: 700,
                        textTransform: 'none',
                        borderRadius: 3,
                        bgcolor: '#0f766e',
                        '&:hover': { bgcolor: '#115e59' },
                      }}
                    >
                      Sign in
                    </Button>

                    <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
                      Don&apos;t have an account?{' '}
                      <MuiLink
                        component={RouterLink}
                        to="/register"
                        underline="hover"
                        sx={{ fontWeight: 600, color: '#0f766e' }}
                      >
                        Create one
                      </MuiLink>
                    </Typography>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </>
  )
}

export default Login
