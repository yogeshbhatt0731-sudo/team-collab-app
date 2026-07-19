import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { DropDownButtonComponent } from '@syncfusion/ej2-react-splitbuttons'
import { getWorkspaceById, getProjectsByWorkspace, getUserById, mockUsers } from '../data/mockData'
import Header from '../components/Header'
import Modal from '../components/Modal'

function WorkspaceDetail() {
  const { workspaceId } = useParams()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [favorites, setFavorites] = useState(new Set())
  const [selectedProject, setSelectedProject] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false)

  const workspace = getWorkspaceById(workspaceId)
  const projects = getProjectsByWorkspace(workspaceId)
  const creator = workspace ? getUserById(workspace.createdBy) : null
  const currentUser = mockUsers[0]
  const isOwner = workspace?.role === 'OWNER'

  if (!workspace) {
    return (
      <div style={{ padding: 32 }}>
        <h4 style={{ fontSize: '1.75rem' }}>Workspace not found</h4>
      </div>
    )
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || filterStatus === project.status
    return matchesSearch && matchesFilter
  })

  const toggleFavorite = (event, projectId) => {
    event.stopPropagation()
    const next = new Set(favorites)
    next.has(projectId) ? next.delete(projectId) : next.add(projectId)
    setFavorites(next)
  }

  const projectMenuItems = (project) => [
    { text: 'Open Project' },
    { text: 'Edit Project' },
    { text: 'Duplicate' },
    { text: 'Members' },
    { separator: true },
    isOwner ? { text: 'Delete Project' } : { text: 'Leave Project' },
  ]

  const onProjectMenuSelect = (project, text) => {
    setSelectedProject(project)
    if (text === 'Open Project') navigate(`/workspace/${workspaceId}/project/${project.id}`)
    else if (text === 'Delete Project') setDeleteDialogOpen(true)
    else if (text === 'Leave Project') setLeaveDialogOpen(true)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--app-bg)' }}>
      <Header userName={currentUser?.name || 'User'} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: 32 }}>
        {/* workspace header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 12,
                background: workspace.accent || 'var(--blue)',
                display: 'grid',
                placeItems: 'center',
                color: '#fff',
                fontSize: 32,
                fontWeight: 700,
              }}
            >
              {workspace.name.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '1.75rem', marginBottom: 4 }}>{workspace.name}</h4>
              <p className="muted" style={{ fontSize: '0.95rem' }}>
                Created by {creator?.name} • {workspace.members} members • {workspace.projects} projects
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex' }} title={`${workspace.members} members in this workspace`}>
              {mockUsers.slice(0, Math.min(workspace.members, 4)).map((user, i) => (
                <span
                  key={user.id}
                  className="avatar"
                  style={{ width: 32, height: 32, fontSize: '0.75rem', border: '2px solid var(--surface)', marginLeft: i === 0 ? 0 : -8 }}
                >
                  {user.name.split(' ').map((n) => n.charAt(0)).join('')}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
              <ButtonComponent cssClass="e-outline">+ New Project</ButtonComponent>
              <ButtonComponent cssClass="e-outline">Invite</ButtonComponent>
              <ButtonComponent cssClass="e-outline">Settings</ButtonComponent>
            </div>
          </div>
        </div>

        {/* search + filter */}
        <div style={{ marginBottom: 32, display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ maxWidth: 300, width: '100%' }} className="tc-full">
            <TextBoxComponent placeholder="Search projects..." value={searchTerm} input={(e) => setSearchTerm(e.value)} />
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <ButtonComponent cssClass={filterStatus === 'all' ? 'e-primary' : 'e-outline'} onClick={() => setFilterStatus('all')}>
              Filter
            </ButtonComponent>
            <span className="chip" style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)' }}>
              Active ({filteredProjects.length})
            </span>
          </div>
        </div>

        {/* projects */}
        <div style={{ marginBottom: 24 }}>
          <h6 style={{ fontSize: 18, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            Projects <span className="chip">{filteredProjects.length}</span>
          </h6>

          {filteredProjects.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', border: '2px dashed var(--border)', borderRadius: 12, background: 'var(--surface)' }}>
              <h6 style={{ fontSize: 18, marginBottom: 8 }}>No projects found</h6>
              <p className="muted" style={{ marginBottom: 16 }}>
                {searchTerm ? 'Try adjusting your search term' : 'Create a new project to get started'}
              </p>
              <ButtonComponent cssClass="e-primary">+ Create Project</ButtonComponent>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="card"
                  style={{ position: 'relative', display: 'flex', flexDirection: 'column', cursor: 'pointer', overflow: 'hidden' }}
                  onClick={() => navigate(`/workspace/${workspaceId}/project/${project.id}`)}
                >
                  <div style={{ height: 4, background: workspace.accent || 'var(--blue)' }} />

                  <div style={{ flex: 1, padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{ fontWeight: 700, fontSize: '1.1rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {project.name}
                      </div>
                      <ButtonComponent
                        cssClass="e-flat"
                        onClick={(e) => toggleFavorite(e, project.id)}
                        style={{ color: favorites.has(project.id) ? 'var(--warning)' : 'var(--muted)', minWidth: 0 }}
                      >
                        {favorites.has(project.id) ? '★' : '☆'}
                      </ButtonComponent>
                    </div>

                    <p className="muted" style={{ marginBottom: 16, fontSize: '0.875rem' }}>
                      Created on {new Date(project.createdAt).toLocaleDateString()}
                    </p>

                    <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                      <span className="chip" style={{ background: 'transparent', border: '1px solid var(--blue)', color: 'var(--blue)' }}>In Progress</span>
                      <span className="chip" style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)' }}>5 Tasks</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, background: 'var(--app-bg)', borderRadius: 8, fontSize: '0.85rem' }}>
                      <span className="avatar" style={{ width: 24, height: 24, fontSize: '0.7rem' }}>
                        {getUserById(project.createdBy)?.name.charAt(0)}
                      </span>
                      <span>Created by {getUserById(project.createdBy)?.name}</span>
                    </div>
                  </div>

                  <div style={{ padding: '8px 16px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <ButtonComponent cssClass="e-primary" onClick={(e) => e.stopPropagation()}>Open</ButtonComponent>
                    <span onClick={(e) => e.stopPropagation()}>
                      <DropDownButtonComponent
                        cssClass="tc-kebab"
                        items={projectMenuItems(project)}
                        select={(args) => onProjectMenuSelect(project, args.item.text)}
                      >
                        ⋮
                      </DropDownButtonComponent>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title="Delete Project?"
        width={440}
        footer={
          <>
            <ButtonComponent cssClass="e-flat" onClick={() => setDeleteDialogOpen(false)}>Cancel</ButtonComponent>
            <ButtonComponent cssClass="e-danger" onClick={() => { setDeleteDialogOpen(false); setSelectedProject(null) }}>Delete</ButtonComponent>
          </>
        }
      >
        <p>Are you sure you want to delete <strong>{selectedProject?.name}</strong>? This action cannot be undone.</p>
      </Modal>

      <Modal
        open={leaveDialogOpen}
        onClose={() => setLeaveDialogOpen(false)}
        title="Leave Project?"
        width={440}
        footer={
          <>
            <ButtonComponent cssClass="e-flat" onClick={() => setLeaveDialogOpen(false)}>Cancel</ButtonComponent>
            <ButtonComponent cssClass="e-warning" onClick={() => { setLeaveDialogOpen(false); setSelectedProject(null) }}>Leave</ButtonComponent>
          </>
        }
      >
        <p>Are you sure you want to leave <strong>{selectedProject?.name}</strong>? You can rejoin if you are invited again.</p>
      </Modal>
    </div>
  )
}

export default WorkspaceDetail
