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
import { getMyProjects, getTasksByProject } from '../services/projectService'
import { MEMBERS } from '../data/taskMock'

const USER_ID = 1
const defaultUser = {
  id: '', name: 'User', firstName: 'User', lastName: '', email: '',
  phone: '', bio: '', department: '', location: '', role: '',
}

function Home() {
  const navigate = useNavigate()
  const [workspaces, setWorkspaces] = useState([])
  const [projects, setProjects] = useState([])
  const [taskCount, setTaskCount] = useState(0)
  const [memberCount, setMemberCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [openProfileModal, setOpenProfileModal] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [workspaceName, setWorkspaceName] = useState('')
  const [createError, setCreateError] = useState('')
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem('current_user')
    return storedUser ? { ...defaultUser, ...JSON.parse(storedUser) } : defaultUser
  })

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
      const taskCounts = await Promise.all(projectData.map(async (project) => {
        try {
          const tasks = await getTasksByProject(project.projectId, USER_ID)
          return tasks.length
        } catch {
          return 0
        }
      }))
      const workspaceMembers = workspaceData.flatMap((workspace) => {
        try {
          return JSON.parse(localStorage.getItem(`workspace-members-${workspace.workspace_id}`)) || MEMBERS
        } catch {
          return MEMBERS
        }
      })

      setWorkspaces(workspaceData.map((workspace) => ({
        id: workspace.workspace_id,
        name: workspace.name,
        role: workspace.role,
        projects: projectCountByWorkspace[workspace.workspace_id] || 0,
      })))
      setProjects(projectData)
      setTaskCount(taskCounts.reduce((total, count) => total + count, 0))
      setMemberCount(new Set(workspaceMembers.map((member) => member.email || member.userId)).size)
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

  const handleCreateWorkspace = async () => {
    const name = workspaceName.trim()
    if (name.length < 3) {
      setCreateError('Workspace name must be at least 3 characters.')
      return
    }
    try {
      setCreateError('')
      await createWorkspace(name, USER_ID)
      await loadDashboard()
      setWorkspaceName('')
      setIsCreateDialogOpen(false)
    } catch (requestError) {
      setCreateError(requestError.response?.data?.message || 'Could not create workspace.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('clove_access_token')
    localStorage.removeItem('current_user')
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f8f9fd', color: '#101828' }}>
      <Sidebar />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Header userName={currentUser.name} onEditProfile={() => setOpenProfileModal(true)} onLogout={handleLogout} />

        <main style={{ flex: 1, padding: '34px clamp(24px, 4vw, 52px)' }}>
          <section style={{ maxWidth: 1240, margin: '0 auto' }}>
            <div style={{ background: 'linear-gradient(120deg, #ffffff 0%, #f7f5ff 100%)', border: '1px solid #e9e7fe', borderRadius: 16, padding: '25px clamp(20px, 3vw, 32px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 22 }}>
              <div>
                <p style={{ margin: '0 0 7px', color: '#5b2ee8', fontSize: 12, fontWeight: 800, letterSpacing: '.55px', textTransform: 'uppercase' }}>Workspace overview</p>
                <h1 style={{ margin: 0, fontSize: 30, letterSpacing: '-.7px' }}>Welcome back, {currentUser.firstName}!</h1>
                <p style={{ margin: '8px 0 0', color: '#667085', fontSize: 15 }}>Your workspaces and projects at a glance.</p>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <ButtonComponent cssClass="e-outline" onClick={() => navigate('/members')} style={{ borderRadius: 8, borderColor: '#d9d6fe', color: '#5b2ee8' }}>Invite Member</ButtonComponent>
                <ButtonComponent cssClass="e-primary" onClick={() => { setCreateError(''); setIsCreateDialogOpen(true) }} style={{ background: '#5b2ee8', borderColor: '#5b2ee8', borderRadius: 8 }}>+ Create Workspace</ButtonComponent>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 14, marginBottom: 30 }}>
              <div className="card" style={{ padding: '17px 19px', border: '1px solid #e7e4fd', boxShadow: '0 3px 10px rgba(91,46,232,.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#667085', fontSize: 13 }}>Workspaces</span>
                  <span style={{ color: '#5b2ee8', fontSize: 16 }}>◈</span>
                </div>
                <div style={{ color: '#101828', fontWeight: 800, fontSize: 28, marginTop: 7 }}>{workspaces.length}</div>
              </div>
              <div className="card" style={{ padding: '17px 19px', border: '1px solid #eaecf0', boxShadow: '0 3px 10px rgba(16,24,40,.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#667085', fontSize: 13 }}>Projects</span>
                  <span style={{ color: '#667085', fontSize: 16 }}>□</span>
                </div>
                <div style={{ color: '#101828', fontWeight: 800, fontSize: 28, marginTop: 7 }}>{projects.length}</div>
              </div>
              <div className="card" style={{ padding: '17px 19px', border: '1px solid #eaecf0', boxShadow: '0 3px 10px rgba(16,24,40,.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#667085', fontSize: 13 }}>Members</span>
                  <span style={{ color: '#667085', fontSize: 16 }}>◌</span>
                </div>
                <div style={{ color: '#101828', fontWeight: 800, fontSize: 28, marginTop: 7 }}>{memberCount}</div>
              </div>
              <div className="card" style={{ padding: '17px 19px', border: '1px solid #eaecf0', boxShadow: '0 3px 10px rgba(16,24,40,.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#667085', fontSize: 13 }}>Tasks</span>
                  <span style={{ color: '#667085', fontSize: 16 }}>✓</span>
                </div>
                <div style={{ color: '#101828', fontWeight: 800, fontSize: 28, marginTop: 7 }}>{taskCount}</div>
              </div>
            </div>

            {error && (
              <div style={{ marginBottom: 22, padding: '11px 14px', borderRadius: 8, background: '#fee4e2', color: '#b42318', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <span>{error}</span>
                <ButtonComponent cssClass="e-flat" onClick={loadDashboard}>Retry</ButtonComponent>
              </div>
            )}

            {isLoading ? (
              <div style={{ minHeight: 260, display: 'grid', placeItems: 'center', color: '#667085' }}>Loading dashboard...</div>
            ) : (
              <WorkspaceGrid workspaces={workspaces} />
            )}
          </section>
        </main>
      </div>

      <Modal
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        title="Create Workspace"
        footer={<><ButtonComponent cssClass="e-flat" onClick={() => setIsCreateDialogOpen(false)}>Cancel</ButtonComponent><ButtonComponent cssClass="e-primary" onClick={handleCreateWorkspace}>Create Workspace</ButtonComponent></>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ margin: 0, color: '#667085', fontSize: 14 }}>Create a dedicated space for your team and projects.</p>
          {createError && <div style={{ color: '#b42318', fontSize: 13 }}>{createError}</div>}
          <label>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Workspace name</span>
            <TextBoxComponent placeholder="e.g., Product Development" value={workspaceName} input={(event) => setWorkspaceName(event.value)} />
          </label>
        </div>
      </Modal>

      <ProfileEditModal open={openProfileModal} onClose={() => setOpenProfileModal(false)} user={currentUser} onSave={handleSaveProfile} />
    </div>
  )
}

export default Home
