import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import { ButtonComponent, CheckBoxComponent } from '@syncfusion/ej2-react-buttons'
import { loginUser } from '../services/authService'

function Login() {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    if (!userName || !password) {
      setError('Please enter both username and password')
      return
    }

    setSubmitting(true)
    const result = await loginUser(userName, password)
    setSubmitting(false)

    if (!result.status) {
      setError(result.error?.message || 'Invalid username or password')
      return
    }

    const { userId, name, userName: loggedInUserName, token } = result.data
    localStorage.setItem('clove_access_token', token)
    localStorage.setItem('current_user', JSON.stringify({
      id: userId,
      name,
      firstName: name?.split(' ')[0] || '',
      lastName: name?.split(' ').slice(1).join(' ') || '',
      userName: loggedInUserName,
    }))
    navigate('/home')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f7f4ea 0%, #e7f0ff 45%, #d6efe3 100%)',
        padding: 48,
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: 1000,
          overflow: 'hidden',
          borderRadius: 24,
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 5fr) minmax(0, 7fr)',
          boxShadow: '0 28px 80px rgba(15, 23, 42, 0.12)',
        }}
      >
        {/* left panel */}
        <div
          style={{
            color: '#fffdf7',
            padding: 40,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 40,
            background: 'linear-gradient(160deg, #0f172a 0%, #17324d 52%, #146c94 100%)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                display: 'grid',
                placeItems: 'center',
                fontWeight: 700,
                fontSize: '1.1rem',
                background: 'rgba(255,255,255,0.14)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              TC
            </div>
            <div style={{ letterSpacing: 2.4, opacity: 0.8, fontSize: 12, textTransform: 'uppercase' }}>
              Team Collab App
            </div>
            <h3 style={{ fontSize: '2.4rem', lineHeight: 1.05 }}>Welcome back to your team workspace.</h3>
            <p style={{ maxWidth: 420, opacity: 0.86, lineHeight: 1.7 }}>
              Sign in to review updates, manage tasks, and keep your collaboration flowing without losing momentum.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontWeight: 600 }}>Everything in one place</div>
            <div style={{ opacity: 0.82 }}>Projects, conversations, and team coordination built for everyday work.</div>
            <div style={{ opacity: 0.7, fontSize: 12, marginTop: 8 }}>Sign in with the username you registered with.</div>
          </div>
        </div>

        {/* form */}
        <form noValidate onSubmit={handleLogin} style={{ padding: 40, background: '#fffdfa' }}>
          <div style={{ marginBottom: 32 }}>
            <h4 style={{ fontSize: '1.75rem', color: '#162033' }}>Sign in</h4>
            <p className="muted" style={{ marginTop: 6 }}>Use your username and password to access your account.</p>
          </div>

          {error && (
            <div
              style={{
                marginBottom: 16,
                padding: '10px 14px',
                borderRadius: 8,
                background: 'rgba(220,38,38,0.1)',
                color: 'var(--danger)',
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <label>
              <span style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Username</span>
              <TextBoxComponent value={userName} input={(e) => setUserName(e.value)} />
            </label>
            <label>
              <span style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Password</span>
              <TextBoxComponent type="password" value={password} input={(e) => setPassword(e.value)} />
            </label>
          </div>

          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <CheckBoxComponent label="Remember me" checked={true} />
            <a href="#" style={{ fontWeight: 600, color: '#0f766e' }}>Forgot password?</a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24 }}>
            <ButtonComponent cssClass="tc-teal tc-block" disabled={submitting} onClick={handleLogin}>{submitting ? 'Signing in…' : 'Sign in'}</ButtonComponent>
            <p className="muted" style={{ textAlign: 'center' }}>
              Don&apos;t have an account?{' '}
              <RouterLink to="/register" style={{ fontWeight: 600, color: '#0f766e' }}>Create one</RouterLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
