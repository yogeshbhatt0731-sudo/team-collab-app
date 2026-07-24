import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { getTasksByProject } from '../services/projectService'
import { getProjectsByWorkspace } from '../services/workspaceService'
const statusColors = { TODO: '#f59e0b', IN_PROGRESS: '#2563eb', COMPLETED: '#16a34a' }

function ProjectDetail() {
  const { workspaceId, projectId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const userId = location.state?.userId || 1
  const projectFromWorkspace = location.state?.project
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProjectDetails() {
      try {
        const projectRequest = projectFromWorkspace
          ? Promise.resolve(projectFromWorkspace)
          : getProjectsByWorkspace(workspaceId, 1).then((projects) => {
              const selectedProject = projects.find((item) => String(item.id) === String(projectId))
              if (!selectedProject) throw new Error('Project not found in this workspace.')
              return selectedProject
            })

        const [projectData, taskData] = await Promise.all([
          projectRequest,
          getTasksByProject(projectId, userId),
        ])
        setProject(projectData)
        setTasks(taskData)
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Could not load this project.')
      } finally {
        setIsLoading(false)
      }
    }

    loadProjectDetails()
  }, [projectId, projectFromWorkspace, userId, workspaceId])

  const countByStatus = (status) => tasks.filter((task) => task.taskStatus === status).length
  const showSearchPlaceholder = () => {}
  const showFilterPlaceholder = () => {}

  return (
    <main style={{ minHeight: '100vh', background: 'var(--app-bg)', padding: 32 }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <ButtonComponent cssClass="e-flat" onClick={() => navigate(`/workspace/${workspaceId}`)}>← Back to Workspace</ButtonComponent>

        {isLoading ? (
          <div style={{ display: 'grid', placeItems: 'center', minHeight: 320 }}><p className="muted">Loading project...</p></div>
        ) : error ? (
          <div style={{ marginTop: 24, padding: 16, borderRadius: 8, background: 'rgba(220,38,38,0.1)', color: 'var(--danger)' }}>{error}</div>
        ) : (
          <>
            <section style={{ margin: '28px 0' }}>
              <h3 style={{ fontSize: '2rem', marginBottom: 8 }}>{project.name}</h3>
              <p className="muted">A project in {project.myWorkspace?.name || 'this workspace'}.</p>
            </section>

            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12, marginBottom: 28 }}>
              <div className="card" style={{ padding: 16, boxShadow: 'none' }}>
                <div className="muted" style={{ fontSize: 13 }}>Workspace</div>
                <strong>{project.myWorkspace?.name || 'Not available'}</strong>
              </div>
              <div className="card" style={{ padding: 16, boxShadow: 'none' }}>
                <div className="muted" style={{ fontSize: 13 }}>Workspace ID</div>
                <strong>#{project.myWorkspace?.id || workspaceId}</strong>
              </div>
              <div className="card" style={{ padding: 16, boxShadow: 'none' }}>
                <div className="muted" style={{ fontSize: 13 }}>Created On</div>
                <strong>{new Date(project.createdAt).toLocaleDateString()}</strong>
              </div>
              <div className="card" style={{ padding: 16, boxShadow: 'none' }}>
                <div className="muted" style={{ fontSize: 13 }}>Created By</div>
                <strong>{project.createdBy ? `User #${project.createdBy}` : 'Not available'}</strong>
              </div>
            </section>

            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 28 }}>
              <div className="card" style={{ padding: 16, boxShadow: 'none' }}><div className="muted">Total Tasks</div><strong style={{ fontSize: 28 }}>{tasks.length}</strong></div>
              {Object.entries(statusColors).map(([status, color]) => (
                <div key={status} className="card" style={{ padding: 16, borderTop: `4px solid ${color}`, boxShadow: 'none' }}>
                  <div className="muted">{status.replace('_', ' ')}</div><strong style={{ fontSize: 28 }}>{countByStatus(status)}</strong>
                </div>
              ))}
            </section>

            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                <h5 style={{ fontSize: 22 }}>Tasks</h5>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ width: 220 }}><TextBoxComponent placeholder="Search tasks (coming soon)" input={showSearchPlaceholder} /></div>
                  <ButtonComponent cssClass="e-outline" onClick={showFilterPlaceholder}>Filter by Status</ButtonComponent>
                  <ButtonComponent cssClass="e-outline" onClick={showFilterPlaceholder}>Filter by Priority</ButtonComponent>
                </div>
              </div>
              {tasks.length === 0 ? (
                <div className="card" style={{ padding: 28, borderStyle: 'dashed', boxShadow: 'none', textAlign: 'center' }}><p className="muted">No tasks have been created for this project yet.</p></div>
              ) : (
                <div style={{ display: 'grid', gap: 12 }}>
                  {tasks.map((task) => (
                    <div key={task.id} className="card" style={{ padding: 16, boxShadow: 'none' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'start' }}>
                        <div><h6 style={{ fontSize: 17, marginBottom: 6 }}>{task.title}</h6><p className="muted" style={{ fontSize: 14 }}>{task.description}</p></div>
                        <span className="chip" style={{ background: statusColors[task.taskStatus], color: '#fff' }}>{task.taskStatus.replace('_', ' ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  )
}

export default ProjectDetail
