import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import WorkspaceGrid from '../components/WorkspaceGrid'
import ProfileEditModal from '../components/ProfileEditModal'
import Modal from '../components/Modal'
import { createWorkspace, getWorkspaces } from '../services/workspaceService'
import { getMyProjects } from '../services/projectService'

const defaultUser = {
  id: '', name: 'User', firstName: 'User', lastName: '', email: '',
  phone: '', bio: '', department: '', location: '', role: '',
}

const USER_ID = 1

function Home() {
  const navigate = useNavigate()
  const [workspaces, setWorkspaces] = useState([])
  const [projects, setProjects] = useState([])
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem('current_user')
    return storedUser ? { ...defaultUser, ...JSON.parse(storedUser) } : defaultUser
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [workspaceName, setWorkspaceName] = useState('')
  const [createError, setCreateError] = useState('')
  const [openProfileModal, setOpenProfileModal] = useState(false)
  // New UI state for interactivity
  const [searchTerm, setSearchTerm] = useState('')
  const [showOnlyMine, setShowOnlyMine] = useState(false)

  const token = localStorage.getItem('clove_access_token')

  const loadDashboard = async () => {
    setIsLoading(true)
    setError('')
    try {
      const [workspaceData, projectData] = await Promise.all([
        getWorkspaces(USER_ID),
        getMyProjects(USER_ID),
      ])

      const projectCountByWorkspace = projectData.reduce((counts, project) => {
        counts[project.workspaceId] = (counts[project.workspaceId] || 0) + 1
        return counts
      }, {})

      setWorkspaces(workspaceData.map((workspace) => ({
        id: workspace.workspace_id,
        name: workspace.name,
        role: workspace.role,
        projects: projectCountByWorkspace[workspace.workspace_id] || 0,
      })))
      setProjects(projectData.map((project) => ({
        id: project.projectId,
        name: project.projectName,
        workspaceId: project.workspaceId,
      })))
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load your dashboard data.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    async function initializeDashboard() {
      await loadDashboard()
    }
    initializeDashboard()
  }, [token, navigate])

  const handleCreateWorkspace = async () => {
    setCreateError('')
    if (!workspaceName.trim()) {
      setCreateError('Workspace name is required')
      return
    }
    if (workspaceName.length < 3) {
      setCreateError('Workspace name must be at least 3 characters')
      return
    }

    try {
      await createWorkspace(workspaceName.trim(), USER_ID)
      await loadDashboard()
      setWorkspaceName('')
      setOpenCreateDialog(false)
    } catch (requestError) {
      setCreateError(requestError.response?.data?.message || 'Could not create workspace')
    }
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

  const totalProjects = projects.length
  // Filtered list based on the search input and optional "only mine" toggle
  const filteredWorkspaces = workspaces.filter((w) => {
    if (!searchTerm) return true
    return w.name?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  }).filter((w) => (showOnlyMine ? w.role && w.role.toLowerCase().includes('owner') : true))

  // Recent projects preview
  const recentProjects = projects.slice(0, 5)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--app-bg)', color: 'var(--text)' }}>
      <Sidebar />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Header userName={currentUser.name} onEditProfile={() => setOpenProfileModal(true)} onLogout={handleLogout} />

        <main style={{ flex: 1, padding: '34px clamp(24px, 4vw, 52px)' }}>
          <section style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, marginBottom: 18, flexWrap: 'wrap' }}>
              <div style={{ minWidth: 0 }}>
                <h1 style={{ fontSize: '1.9rem', margin: 0, letterSpacing: '-0.5px' }}>Welcome back, {currentUser.firstName}!</h1>
                <p className="muted" style={{ fontSize: 16, margin: '8px 0 0' }}>Here is a quick view of the workspaces you can access.</p>

                <div style={{ marginTop: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
                  <TextBoxComponent placeholder="Search workspaces..." value={searchTerm} input={(e) => setSearchTerm(e.value)} />
                  <ButtonComponent cssClass={showOnlyMine ? 'e-primary' : 'e-flat'} onClick={() => setShowOnlyMine((s) => !s)}>{showOnlyMine ? 'Showing: Mine' : 'Show: All'}</ButtonComponent>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <ButtonComponent cssClass="e-flat" onClick={() => navigate('/members')}>Invite Member</ButtonComponent>
                <ButtonComponent cssClass="e-primary" onClick={() => setOpenCreateDialog(true)}>Create Workspace</ButtonComponent>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 16, marginBottom: 20, maxWidth: 760 }}>
              <div className="card" style={{ padding: '17px 20px' }}>
                <div className="muted" style={{ fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Workspaces</span>
                  <small className="muted">{workspaces.length}</small>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, marginTop: 5 }}>{workspaces.length}</div>
              </div>

              <div className="card" style={{ padding: '17px 20px' }}>
                <div className="muted" style={{ fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Projects</span>
                  <small className="muted">{totalProjects}</small>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, marginTop: 5 }}>{totalProjects}</div>
              </div>

              <div className="card" style={{ padding: '12px 16px' }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Recent Projects</div>
                {recentProjects.length === 0 ? (
                  <div className="muted">No recent projects</div>
                ) : (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
                    {recentProjects.map((p) => (
                      <li key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button style={{ background: 'transparent', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer', color: 'var(--text)' }} onClick={() => navigate(`/project/${p.id}`)}>
                          <div style={{ fontWeight: 700 }}>{p.name}</div>
                          <div className="muted" style={{ fontSize: 12 }}>{workspaces.find(w => w.id === p.workspaceId)?.name || '—'}</div>
                        </button>
                        <ButtonComponent cssClass="e-flat" onClick={() => navigate(`/project/${p.id}`)}>Open</ButtonComponent>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {error && (
              <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(220,38,38,0.1)', color: 'var(--danger)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{error}</span>
                <ButtonComponent cssClass="e-flat" onClick={loadDashboard}>Retry</ButtonComponent>
              </div>
            )}

            {isLoading ? (
              <div style={{ minHeight: 320, display: 'grid', placeItems: 'center' }}>
                <p className="muted">Loading workspaces...</p>
              </div>
            ) : (
              <WorkspaceGrid workspaces={filteredWorkspaces} />
            )}
          </section>
        </main>
      </div>

      <div style={{ position: 'fixed', right: 28, bottom: 28, zIndex: 60 }}>
        <ButtonComponent cssClass="e-primary" onClick={() => setOpenCreateDialog(true)} style={{ width: 56, height: 56, borderRadius: 28, fontSize: 24 }}>+</ButtonComponent>
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
