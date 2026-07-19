import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { DropDownButtonComponent } from '@syncfusion/ej2-react-splitbuttons'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Modal from '../components/Modal'
import { mockWorkspaces } from '../data/mockData'

const defaultUser = { id: '', name: 'User', firstName: 'User', email: '', role: '' }
const ACCENT_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA15E']

function StatCard({ label, value }) {
  return (
    <div className="card" style={{ padding: 16, boxShadow: 'none' }}>
      <div className="muted" style={{ fontSize: 13 }}>{label}</div>
      <div style={{ fontWeight: 800, fontSize: 32, marginTop: 8 }}>{value}</div>
    </div>
  )
}

function Workspaces() {
  const navigate = useNavigate()
  const [workspaces, setWorkspaces] = useState([])
  const [currentUser, setCurrentUser] = useState(defaultUser)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedWorkspace, setSelectedWorkspace] = useState(null)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openLeaveDialog, setOpenLeaveDialog] = useState(false)
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [workspaceName, setWorkspaceName] = useState('')
  const [createError, setCreateError] = useState('')

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

  const confirmDelete = () => {
    if (selectedWorkspace) {
      setWorkspaces(workspaces.filter((ws) => ws.id !== selectedWorkspace.id))
      setOpenDeleteDialog(false)
      setSelectedWorkspace(null)
    }
  }

  const confirmLeave = () => {
    if (selectedWorkspace) {
      setWorkspaces(workspaces.filter((ws) => ws.id !== selectedWorkspace.id))
      setOpenLeaveDialog(false)
      setSelectedWorkspace(null)
    }
  }

  const handleMenuSelect = (workspace, text) => {
    setSelectedWorkspace(workspace)
    if (text === 'Delete Workspace') setOpenDeleteDialog(true)
    if (text === 'Leave Workspace') setOpenLeaveDialog(true)
  }

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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--app-bg)', color: 'var(--text)' }}>
      <Sidebar />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Header userName={currentUser.name} />

        <main style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
            <div>
              <h4 style={{ fontSize: '1.75rem', marginBottom: 8 }}>Workspaces</h4>
              <p className="muted" style={{ fontSize: 16 }}>
                Manage all your workspaces, collaborate with teams, and organize your projects
              </p>
            </div>
            <ButtonComponent cssClass="e-primary" onClick={() => setOpenCreateDialog(true)}>+ New Workspace</ButtonComponent>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <StatCard label="Total Workspaces" value={workspaces.length} />
            <StatCard label="You Own" value={workspaces.filter((ws) => ws.role === 'OWNER').length} />
            <StatCard label="You're Member Of" value={workspaces.filter((ws) => ws.role === 'MEMBER').length} />
            <StatCard label="Total Members" value={workspaces.reduce((acc, ws) => acc + ws.members, 0)} />
          </div>

          {isLoading ? (
            <div style={{ display: 'grid', placeItems: 'center', minHeight: 400 }}>
              <p className="muted">Loading workspaces...</p>
            </div>
          ) : workspaces.length === 0 ? (
            <div className="card" style={{ borderStyle: 'dashed', boxShadow: 'none', padding: 32, textAlign: 'center' }}>
              <p className="muted" style={{ marginBottom: 16 }}>
                No workspaces yet. Create your first workspace to get started!
              </p>
              <ButtonComponent cssClass="e-primary" onClick={() => setOpenCreateDialog(true)}>Create Workspace</ButtonComponent>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {workspaces.map((workspace) => (
                <div key={workspace.id} className="card" style={{ position: 'relative', padding: 16, boxShadow: 'none' }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                        <div style={{ width: 6, height: 24, borderRadius: 3, background: workspace.accent }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <h6 style={{ fontSize: 18, lineHeight: 1.2 }}>{workspace.name}</h6>
                            <span
                              className="chip"
                              style={{
                                fontSize: 11,
                                height: 20,
                                background: workspace.role === 'OWNER' ? '#fef3c7' : '#dbeafe',
                                color: workspace.role === 'OWNER' ? '#92400e' : '#0c4a6e',
                              }}
                            >
                              {workspace.role}
                            </span>
                          </div>
                          <p className="muted" style={{ fontSize: 13 }}>
                            {workspace.members} member{workspace.members !== 1 ? 's' : ''} • {workspace.projects} project{workspace.projects !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 16 }}>
                        <div style={{ flex: 1, display: 'flex' }}>
                          {workspace.avatars.slice(0, 5).map((avatar, idx) => (
                            <span
                              key={`${workspace.id}-${idx}`}
                              className="avatar"
                              style={{ width: 32, height: 32, fontSize: 12, background: workspace.accent, border: '2px solid var(--app-bg)', marginLeft: idx === 0 ? 0 : -8 }}
                            >
                              {avatar}
                            </span>
                          ))}
                        </div>
                        <ButtonComponent cssClass="e-outline" onClick={() => navigate(`/workspace/${workspace.id}`)}>Open</ButtonComponent>
                      </div>
                    </div>

                    <DropDownButtonComponent
                      cssClass="tc-kebab"
                      items={workspace.role === 'OWNER' ? [{ text: 'Delete Workspace' }] : [{ text: 'Leave Workspace' }]}
                      select={(args) => handleMenuSelect(workspace, args.item.text)}
                    >
                      ⋮
                    </DropDownButtonComponent>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <Modal
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        title="Delete Workspace?"
        footer={
          <>
            <ButtonComponent cssClass="e-flat" onClick={() => setOpenDeleteDialog(false)}>Cancel</ButtonComponent>
            <ButtonComponent cssClass="e-danger" onClick={confirmDelete}>Delete Workspace</ButtonComponent>
          </>
        }
      >
        <div style={{ padding: '12px 14px', borderRadius: 8, background: 'rgba(245,158,11,0.12)', color: '#92400e' }}>
          Are you sure you want to delete <strong>{selectedWorkspace?.name}</strong>? This action cannot be undone. All projects, tasks, and data associated with this workspace will be permanently deleted.
        </div>
      </Modal>

      <Modal
        open={openLeaveDialog}
        onClose={() => setOpenLeaveDialog(false)}
        title="Leave Workspace?"
        footer={
          <>
            <ButtonComponent cssClass="e-flat" onClick={() => setOpenLeaveDialog(false)}>Cancel</ButtonComponent>
            <ButtonComponent cssClass="e-warning" onClick={confirmLeave}>Leave Workspace</ButtonComponent>
          </>
        }
      >
        <div style={{ padding: '12px 14px', borderRadius: 8, background: 'rgba(37,99,235,0.1)', color: 'var(--blue-dark)' }}>
          Are you sure you want to leave <strong>{selectedWorkspace?.name}</strong>? You will no longer have access to this workspace and its projects.
        </div>
      </Modal>

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
    </div>
  )
}

export default Workspaces
