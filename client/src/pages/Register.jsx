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

function Register() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const navigate = useNavigate()

  const handleSignUpClick = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('All fields are required')
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    const userExists = mockUsers.some((u) => u.email === email)
    if (userExists) {
      setError('User with this email already exists')
      return
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      email,
      username: email.split('@')[0],
      role: 'DEVELOPER',
      createdAt: new Date().toISOString(),
    }

    mockUsers.push(newUser)
    
    setSuccess('Registration successful! Redirecting to login...')
    setTimeout(() => {
      navigate('/login')
    }, 2000)
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
                      Build together with a clean, focused workspace.
                    </Typography>
                    <Typography sx={{ maxWidth: 420, opacity: 0.86, lineHeight: 1.7 }}>
                      Create your account to organize projects, coordinate teammates, and keep
                      every update in one place.
                    </Typography>
                  </Stack>

                  <Stack spacing={1.5} sx={{ mt: 6 }}>
                    <Typography sx={{ fontWeight: 600 }}>Why teams like it</Typography>
                    <Typography sx={{ opacity: 0.82 }}>
                      Shared project spaces, quick updates, and a simple way to keep work moving.
                    </Typography>
                  </Stack>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 7 }}>
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSignUpClick}
                  sx={{
                    p: { xs: 4, sm: 5 },
                    backgroundColor: '#fffdfa',
                  }}
                >
                  <Stack spacing={1} sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#162033' }}>
                      Create an account
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                      Enter your details to get started with your team workspace.
                    </Typography>
                  </Stack>

                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}

                  {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      {success}
                    </Alert>
                  )}

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        required
                        label="First name"
                        name="firstName"
                        autoComplete="given-name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        required
                        label="Last name"
                        name="lastName"
                        autoComplete="family-name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
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
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        required
                        type="password"
                        label="Password"
                        name="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        required
                        type="password"
                        label="Confirm password"
                        name="confirmPassword"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </Grid>
                  </Grid>

                  <FormControlLabel
                    sx={{ mt: 2, alignItems: 'flex-start' }}
                    control={<Checkbox defaultChecked />}
                    label="I agree to the terms and would like to receive occasional product updates."
                  />

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
                      Create account
                    </Button>

                    <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
                      Already have an account?{' '}
                      <MuiLink
                        component={RouterLink}
                        to="/login"
                        underline="hover"
                        sx={{ fontWeight: 600, color: '#0f766e' }}
                      >
                        Sign in
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

export default Register
