import { useLocation, useNavigate } from 'react-router-dom'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'

const navItems = [
  { label: 'Home', path: '/home' },
  { label: 'Workspaces', path: '/workspaces' },
  { label: 'My Board', path: '/board' },
  { label: 'Members', path: '/members' },
  { label: 'Settings', path: '/settings' },
]

function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) =>
    path === '/home' ? location.pathname === '/home' : location.pathname.startsWith(path)

  return (
    <aside
      style={{
        width: 244,
        background: 'var(--navy)',
        color: '#cbd5e1',
        padding: '20px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      <h6
        onClick={() => navigate('/home')}
        style={{ color: '#fff', fontSize: 22, lineHeight: 1, cursor: 'pointer' }}
      >
        Team Collab App
      </h6>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {navItems.map((item) => (
          <ButtonComponent
            key={item.label}
            cssClass={`e-flat tc-nav ${isActive(item.path) ? 'tc-nav-active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </ButtonComponent>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
