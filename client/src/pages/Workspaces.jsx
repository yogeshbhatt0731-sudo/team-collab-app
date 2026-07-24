import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { DropDownButtonComponent } from '@syncfusion/ej2-react-splitbuttons'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Modal from '../components/Modal'
import { createWorkspace, deleteWorkspace, getWorkspaces, updateWorkspace } from '../services/workspaceService'

const defaultUser = { name: 'User' }
const USER_ID = 1
const cardColors = ['#7c3aed', '#0fbe82', '#f59e0b', '#2563eb', '#db2777', '#9333ea']

function Workspaces() {
  const navigate = useNavigate()
  const [workspaces, setWorkspaces] = useState([])
  const [currentUser] = useState(() => {
    const storedUser = localStorage.getItem('current_user')
    return storedUser ? JSON.parse(storedUser) : defaultUser
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedWorkspace, setSelectedWorkspace] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [workspaceName, setWorkspaceName] = useState('')
  const [createError, setCreateError] = useState('')
  const [editWorkspaceName, setEditWorkspaceName] = useState('')
  const [editError, setEditError] = useState('')

  const token = localStorage.getItem('clove_access_token')

  const loadWorkspaces = async () => {
    try {
      setWorkspaces(await getWorkspaces(USER_ID))
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load workspaces.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    loadWorkspaces()
  }, [token, navigate])

  const handleCreateWorkspace = async () => {
    const name = workspaceName.trim()
    setCreateError('')
    if (name.length < 3) {
      setCreateError('Workspace name must be at least 3 characters.')
      return
    }

    try {
      await createWorkspace(name, USER_ID)
      await loadWorkspaces()
      setWorkspaceName('')
      setIsCreateDialogOpen(false)
    } catch (requestError) {
      setCreateError(requestError.response?.data?.message || 'Could not create workspace.')
    }
  }

  const handleDeleteWorkspace = async () => {
    if (!selectedWorkspace) return
    try {
      await deleteWorkspace(selectedWorkspace.workspace_id, USER_ID)
      setWorkspaces((items) => items.filter((workspace) => workspace.workspace_id !== selectedWorkspace.workspace_id))
      setSelectedWorkspace(null)
      setIsDeleteDialogOpen(false)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not delete workspace.')
    }
  }

  const openEditWorkspace = (workspace) => {
    setSelectedWorkspace(workspace)
    setEditWorkspaceName(workspace.name)
    setEditError('')
    setIsEditDialogOpen(true)
  }

  const handleUpdateWorkspace = async () => {
    const name = editWorkspaceName.trim()
    if (name.length < 3) {
      setEditError('Workspace name must be at least 3 characters.')
      return
    }

    try {
      await updateWorkspace(selectedWorkspace.workspace_id, name, USER_ID)
      await loadWorkspaces()
      setIsEditDialogOpen(false)
      setSelectedWorkspace(null)
    } catch (requestError) {
      setEditError(requestError.response?.data?.message || 'Could not update workspace.')
    }
  }

  const visibleWorkspaces = workspaces.filter((workspace) => (
    workspace.name.toLowerCase().includes(searchTerm.toLowerCase())
  ))

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f8f9fd', color: '#121a3a' }}>
      <Sidebar />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Header userName={currentUser.name} />

        <main style={{ flex: 1, padding: '36px clamp(24px, 4vw, 56px)' }}>
          <section style={{ display: 'flex', justifyContent: 'space-between', gap: 24, alignItems: 'flex-start', marginBottom: 34, flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 30, letterSpacing: '-0.6px', fontWeight: 800 }}>My Workspaces</h1>
              <p style={{ margin: '8px 0 0', color: '#667085', fontSize: 16 }}>All the workspaces you&apos;re a part of. Create or join a workspace to start collaborating.</p>
            </div>
            <ButtonComponent cssClass="e-primary" onClick={() => setIsCreateDialogOpen(true)} style={{ borderRadius: 9, background: '#5b2ee8', borderColor: '#5b2ee8', padding: '0 18px', height: 44 }}>
              +&nbsp; New Workspace
            </ButtonComponent>
          </section>

          <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
            <div style={{ width: 310 }}>
              <TextBoxComponent placeholder="⌕  Search workspaces..." value={searchTerm} input={(event) => setSearchTerm(event.value)} />
            </div>
            <div style={{ padding: '11px 14px', border: '1px solid #e4e7ec', borderRadius: 9, background: '#fff', color: '#475467', fontSize: 14 }}>
              {visibleWorkspaces.length} workspace{visibleWorkspaces.length === 1 ? '' : 's'}
            </div>
          </section>

          {error && <div style={{ marginBottom: 20, padding: '12px 14px', borderRadius: 9, background: '#fee4e2', color: '#b42318' }}>{error}</div>}

          {isLoading ? (
            <div style={{ display: 'grid', placeItems: 'center', minHeight: 360 }}><p style={{ color: '#667085' }}>Loading workspaces...</p></div>
          ) : visibleWorkspaces.length === 0 ? (
            <div style={{ background: '#fff', border: '1px dashed #c7b9ff', borderRadius: 14, padding: 42, textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 8px' }}>{searchTerm ? 'No matching workspace' : 'Create your first workspace'}</h3>
              <p style={{ margin: '0 0 20px', color: '#667085' }}>{searchTerm ? 'Try another workspace name.' : 'Organize projects and collaborate with your team in one place.'}</p>
              {!searchTerm && <ButtonComponent cssClass="e-primary" onClick={() => setIsCreateDialogOpen(true)} style={{ background: '#5b2ee8', borderColor: '#5b2ee8' }}>+ Create Workspace</ButtonComponent>}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 22 }}>
              {visibleWorkspaces.map((workspace, index) => {
                const color = cardColors[index % cardColors.length]
                return (
                  <article key={workspace.workspace_id} style={{ background: '#fff', border: '1px solid #e6e8ee', borderRadius: 13, padding: 18, minHeight: 222, boxShadow: '0 3px 10px rgba(16,24,40,0.03)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 10, background: color, color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 17, boxShadow: `0 5px 12px ${color}44` }}>
                        {workspace.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span style={{ color: '#98a2b3', fontSize: 23, lineHeight: 1 }}>☆</span>
                    </div>

                    <h2 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 750 }}>{workspace.name}</h2>
                    <p style={{ margin: 0, color: '#667085', fontSize: 14, lineHeight: 1.45 }}>Created {new Date(workspace.createdAt).toLocaleDateString()} · <strong style={{ color: workspace.role === 'OWNER' ? '#5b2ee8' : '#667085' }}>{workspace.role}</strong></p>

                    <div style={{ marginTop: 'auto', paddingTop: 18, display: 'flex', gap: 10, alignItems: 'center' }}>
                      <ButtonComponent cssClass="e-outline" onClick={() => navigate(`/workspace/${workspace.workspace_id}`, { state: { userId: workspace.user_id, role: workspace.role } })} style={{ flex: 1, height: 38, borderRadius: 8, borderColor: '#d9d6fe', color: '#5b2ee8' }}>
                        View Workspace
                      </ButtonComponent>
                      {workspace.role === 'OWNER' && (
                        <DropDownButtonComponent cssClass="tc-kebab" items={[{ text: 'Edit Workspace' }, { text: 'Delete Workspace' }]} select={(event) => {
                          if (event.item.text === 'Edit Workspace') openEditWorkspace(workspace)
                          else { setSelectedWorkspace(workspace); setIsDeleteDialogOpen(true) }
                        }}>⋮</DropDownButtonComponent>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          )}

          {!isLoading && visibleWorkspaces.length > 0 && (
            <section style={{ marginTop: 30, border: '1px dashed #c7b9ff', borderRadius: 13, padding: '22px 26px', background: 'linear-gradient(90deg, #fbfaff, #fff)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
              <div><h3 style={{ margin: '0 0 5px', fontSize: 18 }}>Need another workspace?</h3><p style={{ margin: 0, color: '#667085' }}>Create a dedicated space for a new team or project.</p></div>
              <ButtonComponent cssClass="e-primary" onClick={() => setIsCreateDialogOpen(true)} style={{ background: '#5b2ee8', borderColor: '#5b2ee8' }}>+ Create Workspace</ButtonComponent>
            </section>
          )}
        </main>
      </div>

      <Modal open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} title="Delete Workspace?" footer={<><ButtonComponent cssClass="e-flat" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</ButtonComponent><ButtonComponent cssClass="e-danger" onClick={handleDeleteWorkspace}>Delete Workspace</ButtonComponent></>}>
        <p>Are you sure you want to delete <strong>{selectedWorkspace?.name}</strong>? This cannot be undone.</p>
      </Modal>

      <Modal open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} title="Create New Workspace" footer={<><ButtonComponent cssClass="e-flat" onClick={() => setIsCreateDialogOpen(false)}>Cancel</ButtonComponent><ButtonComponent cssClass="e-primary" onClick={handleCreateWorkspace}>Create Workspace</ButtonComponent></>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {createError && <div style={{ color: 'var(--danger)' }}>{createError}</div>}
          <label><span style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Workspace Name</span><TextBoxComponent placeholder="e.g., Q2 Development Sprint" value={workspaceName} input={(event) => setWorkspaceName(event.value)} /></label>
        </div>
      </Modal>

      <Modal open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} title="Edit Workspace" footer={<><ButtonComponent cssClass="e-flat" onClick={() => setIsEditDialogOpen(false)}>Cancel</ButtonComponent><ButtonComponent cssClass="e-primary" onClick={handleUpdateWorkspace}>Save Changes</ButtonComponent></>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {editError && <div style={{ color: 'var(--danger)' }}>{editError}</div>}
          <label><span style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Workspace Name</span><TextBoxComponent value={editWorkspaceName} input={(event) => setEditWorkspaceName(event.value)} /></label>
        </div>
      </Modal>
    </div>
  )
}

export default Workspaces
