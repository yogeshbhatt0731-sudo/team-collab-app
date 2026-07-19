import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import { ButtonComponent, CheckBoxComponent } from '@syncfusion/ej2-react-buttons'
import { mockUsers } from '../data/mockData'

const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }

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
    if (mockUsers.some((u) => u.email === email)) {
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
    setTimeout(() => navigate('/login'), 2000)
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
            <h3 style={{ fontSize: '2.4rem', lineHeight: 1.05 }}>Build together with a clean, focused workspace.</h3>
            <p style={{ maxWidth: 420, opacity: 0.86, lineHeight: 1.7 }}>
              Create your account to organize projects, coordinate teammates, and keep every update in one place.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontWeight: 600 }}>Why teams like it</div>
            <div style={{ opacity: 0.82 }}>Shared project spaces, quick updates, and a simple way to keep work moving.</div>
          </div>
        </div>

        <form noValidate onSubmit={handleSignUpClick} style={{ padding: 40, background: '#fffdfa' }}>
          <div style={{ marginBottom: 32 }}>
            <h4 style={{ fontSize: '1.75rem', color: '#162033' }}>Create an account</h4>
            <p className="muted" style={{ marginTop: 6 }}>Enter your details to get started with your team workspace.</p>
          </div>

          {error && (
            <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 8, background: 'rgba(220,38,38,0.1)', color: 'var(--danger)', fontWeight: 600 }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 8, background: 'rgba(22,163,74,0.12)', color: 'var(--success)', fontWeight: 600 }}>
              {success}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <label>
              <span style={labelStyle}>First name</span>
              <TextBoxComponent value={firstName} input={(e) => setFirstName(e.value)} />
            </label>
            <label>
              <span style={labelStyle}>Last name</span>
              <TextBoxComponent value={lastName} input={(e) => setLastName(e.value)} />
            </label>
            <label style={{ gridColumn: '1 / -1' }}>
              <span style={labelStyle}>Email address</span>
              <TextBoxComponent type="email" value={email} input={(e) => setEmail(e.value)} />
            </label>
            <label style={{ gridColumn: '1 / -1' }}>
              <span style={labelStyle}>Password</span>
              <TextBoxComponent type="password" value={password} input={(e) => setPassword(e.value)} />
            </label>
            <label style={{ gridColumn: '1 / -1' }}>
              <span style={labelStyle}>Confirm password</span>
              <TextBoxComponent type="password" value={confirmPassword} input={(e) => setConfirmPassword(e.value)} />
            </label>
          </div>

          <div style={{ marginTop: 16 }}>
            <CheckBoxComponent
              checked={true}
              label="I agree to the terms and would like to receive occasional product updates."
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24 }}>
            <ButtonComponent cssClass="tc-teal tc-block" onClick={handleSignUpClick}>Create account</ButtonComponent>
            <p className="muted" style={{ textAlign: 'center' }}>
              Already have an account?{' '}
              <RouterLink to="/login" style={{ fontWeight: 600, color: '#0f766e' }}>Sign in</RouterLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
