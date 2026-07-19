import { useNavigate } from 'react-router-dom'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import { DropDownButtonComponent } from '@syncfusion/ej2-react-splitbuttons'

function Header({ userName, onEditProfile, onLogout }) {
  const navigate = useNavigate()

  const getInitials = () => {
    const names = userName?.split(' ') || []
    let initials = names[0]?.charAt(0) || ''
    if (names.length > 1) initials += names[names.length - 1]?.charAt(0) || ''
    return initials.toUpperCase()
  }

  const menuItems = [
    { text: 'Edit Profile' },
    { text: 'Settings' },
    { text: 'Help & Support' },
    { separator: true },
    { text: 'Logout' },
  ]

  const onMenuSelect = (args) => {
    switch (args.item.text) {
      case 'Edit Profile':
        onEditProfile?.()
        break
      case 'Settings':
        navigate('/settings')
        break
      case 'Logout':
        onLogout?.()
        break
      default:
        break
    }
  }

  const avatarTarget = () => (
    <span className="avatar" style={{ width: 24, height: 24, fontSize: 12 }}>
      {getInitials()}
    </span>
  )

  return (
    <header
      style={{
        minHeight: 74,
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <div style={{ maxWidth: 520, width: '100%' }} className="tc-full">
        <TextBoxComponent placeholder="Search workspaces, projects, tasks..." />
      </div>

      <div style={{ marginLeft: 'auto' }}>
        <DropDownButtonComponent items={menuItems} select={onMenuSelect} cssClass="e-outline">
          {avatarTarget()}
        </DropDownButtonComponent>
      </div>
    </header>
  )
}

export default Header
