import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import Header from '../components/Header'
import QuickActions from '../components/QuickActions'
import Sidebar from '../components/Sidebar'
import WorkspaceDetailsPanel from '../components/WorkspaceDetailsPanel'
import WorkspaceGrid from '../components/WorkspaceGrid'
import ProfileEditModal from '../components/ProfileEditModal'
import Modal from '../components/Modal'
import { mockWorkspaces } from '../data/mockData'

const defaultUser = {
  id: '', name: 'User', firstName: 'User', lastName: '', email: '',
  phone: '', bio: '', department: '', location: '', role: '',
}

const ACCENT_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA15E']

function Home() {
  const navigate = useNavigate()
  const [workspaces, setWorkspaces] = useState([])
  const [currentUser, setCurrentUser] = useState(defaultUser)
  const [isLoading, setIsLoading] = useState(true)
  const [error] = useState('')
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [workspaceName, setWorkspaceName] = useState('')
  const [createError, setCreateError] = useState('')
  const [openProfileModal, setOpenProfileModal] = useState(false)

  const token = localStorage.getItem('clove_access_token')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    const storedUser = localStorage.getItem('current_user')
    if (storedUser) setCurrentUser(JSON.parse(storedUser))
    setWorkspaces(mockWorkspaces)
    setIsLoading(false)
  }, [token, navigate])

  const handleCreateWorkspace = () => {
    setCreateError('')
    if (!workspaceName.trim()) {
      setCreateError('Workspace name is required')
      return
    }
    if (workspaceName.length < 3) {
      setCreateError('Workspace name must be at least 3 characters')
      return
    }

    const newWorkspace = {
      id: `ws_${Date.now()}`,
      name: workspaceName,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      accent: ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)],
      role: 'OWNER',
      avatars: [currentUser.name?.charAt(0) || '?'],
      projects: 0,
      members: 1,
    }
    mockWorkspaces.push(newWorkspace)
    setWorkspaces([...workspaces, newWorkspace])
    setWorkspaceName('')
    setCreateError('')
    setOpenCreateDialog(false)
  }

  const handleSaveProfile = (profileData) => {
    const updatedUser = {
      ...currentUser,
      ...profileData,
      name: `${profileData.firstName} ${profileData.lastName}`.trim(),
    }
    setCurrentUser(updatedUser)
    localStorage.setItem('current_user', JSON.stringify(updatedUser))
    setOpenProfileModal(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('clove_access_token')
    localStorage.removeItem('current_user')
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--app-bg)', color: 'var(--text)' }}>
      <Sidebar />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Header userName={currentUser.name} onEditProfile={() => setOpenProfileModal(true)} onLogout={handleLogout} />

        <main style={{ flex: 1, padding: 24, display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <h4 style={{ fontSize: '1.75rem', marginBottom: 8 }}>Welcome back, {currentUser.firstName}!</h4>
              <p className="muted" style={{ fontSize: 17 }}>Manage your workspaces and projects effectively.</p>
            </div>

            {error && (
              <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(220,38,38,0.1)', color: 'var(--danger)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{error}</span>
                <ButtonComponent cssClass="e-flat" onClick={() => window.location.reload()}>Retry</ButtonComponent>
              </div>
            )}

            {isLoading ? (
              <div style={{ minHeight: 320, display: 'grid', placeItems: 'center' }}>
                <p className="muted">Loading workspaces...</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                  <h5 style={{ fontSize: 22 }}>Workspaces</h5>
                  <ButtonComponent cssClass="e-primary" onClick={() => setOpenCreateDialog(true)}>+ New Workspace</ButtonComponent>
                </div>
                <QuickActions />
                <WorkspaceGrid workspaces={workspaces} />
              </>
            )}
          </div>

          <WorkspaceDetailsPanel workspace={workspaces[0] || null} projects={[]} />
        </main>
      </div>

      <Modal
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        title="Create New Workspace"
        footer={
          <>
            <ButtonComponent cssClass="e-flat" onClick={() => setOpenCreateDialog(false)}>Cancel</ButtonComponent>
            <ButtonComponent cssClass="e-primary" onClick={handleCreateWorkspace}>Create Workspace</ButtonComponent>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p className="muted" style={{ fontSize: 15 }}>
            Create a new workspace to organize your projects and collaborate with team members.
          </p>
          {createError && (
            <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(220,38,38,0.1)', color: 'var(--danger)', fontWeight: 600 }}>
              {createError}
            </div>
          )}
          <label>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Workspace Name</span>
            <TextBoxComponent placeholder="e.g., Q2 Development Sprint" value={workspaceName} input={(e) => setWorkspaceName(e.value)} />
          </label>
        </div>
      </Modal>

      <ProfileEditModal
        open={openProfileModal}
        onClose={() => setOpenProfileModal(false)}
        user={currentUser}
        onSave={handleSaveProfile}
      />
    </div>
  )
}

export default Home
