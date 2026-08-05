import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import WorkspaceGrid from '../components/WorkspaceGrid'
import ProfileEditModal from '../components/ProfileEditModal'
import Modal from '../components/Modal'
import { createWorkspace, getWorkspaces, getWorkspaceMembers } from '../services/workspaceService'
import { getMyProjects, getTasksByProject } from '../services/projectService'

const defaultUser = {
  id: '', name: 'User', firstName: 'User', lastName: '', email: '',
  phone: '', bio: '', department: '', location: '', role: '',
}

const accent = '#5b2ee8'

function StatCard({ icon, label, value, color }) {
  return (
    <div className="card" style={{ padding: '20px 22px', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--muted)', fontSize: 13, fontWeight: 600 }}>{label}</span>
        <span style={{
          width: 36, height: 36, borderRadius: 10, display: 'grid', placeItems: 'center',
          background: `${color}14`, color,
        }}>
          {icon}
        </span>
      </div>
      <div style={{ fontWeight: 800, fontSize: 30, marginTop: 8, color: 'var(--text)' }}>{value}</div>
    </div>
  )
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
        getWorkspaces(),
        getMyProjects(),
      ])
      const projectCountByWorkspace = projectData.reduce((counts, project) => {
        counts[project.workspaceId] = (counts[project.workspaceId] || 0) + 1
        return counts
      }, {})
      const taskCounts = await Promise.all(projectData.map(async (project) => {
        try {
          const tasks = await getTasksByProject(project.projectId)
          return tasks.length
        } catch {
          return 0
        }
      }))

      const memberSets = await Promise.all(workspaceData.map(async (ws) => {
        try {
          const members = await getWorkspaceMembers(ws.workspace_id)
          return members.map((m) => m.userId)
        } catch {
          return []
        }
      }))
      const uniqueMembers = new Set(memberSets.flat())

      setWorkspaces(workspaceData.map((workspace) => ({
        id: workspace.workspace_id,
        name: workspace.name,
        role: workspace.role,
        projects: projectCountByWorkspace[workspace.workspace_id] || 0,
      })))
      setProjects(projectData)
      setTaskCount(taskCounts.reduce((total, count) => total + count, 0))
      setMemberCount(uniqueMembers.size)
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
      await createWorkspace(name)
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

  const iconWorkspace = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 3h-8l-2 4h12z" />
    </svg>
  )
  const iconProject = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
  const iconMembers = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
  const iconTask = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--app-bg)', color: 'var(--text)' }}>
      <Sidebar />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Header userName={currentUser.name} onEditProfile={() => setOpenProfileModal(true)} onLogout={handleLogout} />

        <main style={{ flex: 1, padding: '34px clamp(24px, 4vw, 52px)' }}>
          <section style={{ maxWidth: 1240, margin: '0 auto' }}>
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16,
              padding: '28px clamp(20px, 3vw, 32px)', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 24,
              boxShadow: '0 4px 16px rgba(91,46,232,.04)',
            }}>
              <div>
                <p style={{ margin: '0 0 7px', color: accent, fontSize: 12, fontWeight: 800, letterSpacing: '.55px', textTransform: 'uppercase' }}>Workspace overview</p>
                <h1 style={{ margin: 0, fontSize: 30, letterSpacing: '-.7px' }}>Welcome back, {currentUser.firstName}!</h1>
                <p style={{ margin: '8px 0 0', color: 'var(--muted)', fontSize: 15 }}>Your workspaces and projects at a glance.</p>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <ButtonComponent cssClass="e-outline" onClick={() => navigate('/members')} style={{ borderRadius: 8, borderColor: '#d9d6fe', color: accent }}>Invite Member</ButtonComponent>
                <ButtonComponent cssClass="e-primary" onClick={() => { setCreateError(''); setIsCreateDialogOpen(true) }} style={{ background: accent, borderColor: accent, borderRadius: 8 }}>+ Create Workspace</ButtonComponent>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
              <StatCard icon={iconWorkspace} label="Workspaces" value={workspaces.length} color={accent} />
              <StatCard icon={iconProject} label="Projects" value={projects.length} color="#2563eb" />
              <StatCard icon={iconMembers} label="Members" value={memberCount} color="#0891b2" />
              <StatCard icon={iconTask} label="Tasks" value={taskCount} color="#16a34a" />
            </div>

            {error && (
              <div style={{ marginBottom: 22, padding: '11px 14px', borderRadius: 8, background: '#fee4e2', color: '#b42318', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <span>{error}</span>
                <ButtonComponent cssClass="e-flat" onClick={loadDashboard}>Retry</ButtonComponent>
              </div>
            )}

            {isLoading ? (
              <div style={{ minHeight: 260, display: 'grid', placeItems: 'center', color: 'var(--muted)' }}>Loading dashboard...</div>
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
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: 14 }}>Create a dedicated space for your team and projects.</p>
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
