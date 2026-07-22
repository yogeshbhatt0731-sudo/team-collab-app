import { useParams, useNavigate } from 'react-router-dom'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { getProjectById, getUserById, getTasksByProject } from '../data/mockData'

// Project OVERVIEW page. The task board is the Syncfusion Board at
//   /workspace/:workspaceId/project/:projectId/board
// Open it via the "Open Board" button below. (The old hand-built columns here were a
// placeholder and have been removed — one board, the real one.)
// WIRE: getProject(projectId) for the header; the counts can come from listTasks(projectId).

const statusColors = { TODO: '#FFA500', IN_PROGRESS: '#2196F3', COMPLETED: '#4CAF50' }

function ProjectDetail() {
  const { workspaceId, projectId } = useParams()
  const navigate = useNavigate()

  const project = getProjectById(projectId)
  const tasks = getTasksByProject(projectId) // WIRE: listTasks(projectId) — used here only for the counts
  const creator = project ? getUserById(project.createdBy) : null

  if (!project) {
    return (
      <div style={{ padding: 32 }}>
        <h4 style={{ fontSize: '1.75rem' }}>Project not found</h4>
      </div>
    )
  }

  const countByStatus = (status) => tasks.filter((t) => t.status === status).length
  const boardPath = `/workspace/${workspaceId}/project/${projectId}/board`

  return (
    <div style={{ minHeight: '100vh', background: 'var(--app-bg)', padding: 32 }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <ButtonComponent cssClass="e-flat" onClick={() => navigate(`/workspace/${workspaceId}`)}>
            ← Back to Workspace
          </ButtonComponent>
          <ButtonComponent cssClass="e-primary" onClick={() => navigate(boardPath)}>Open Board →</ButtonComponent>
        </div>

        <h3 style={{ fontSize: '2rem', marginBottom: 8 }}>{project.name}</h3>
        <p className="muted" style={{ marginBottom: 24 }}>
          Created by {creator?.name} on {new Date(project.createdAt).toLocaleDateString()}
        </p>

        {/* quick stats (derived from the task list) */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <span className="chip" style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)' }}>
            Total Tasks: {tasks.length}
          </span>
          <span className="chip" style={{ background: statusColors.IN_PROGRESS, color: '#fff' }}>
            In Progress: {countByStatus('IN_PROGRESS')}
          </span>
          <span className="chip" style={{ background: statusColors.COMPLETED, color: '#fff' }}>
            Completed: {countByStatus('COMPLETED')}
          </span>
        </div>

        {/* the real board lives on its own route (Syncfusion Kanban) */}
        <div
          className="card"
          onClick={() => navigate(boardPath)}
          style={{ padding: 40, textAlign: 'center', cursor: 'pointer', border: '2px dashed var(--border)', boxShadow: 'none' }}
        >
          <h5 style={{ fontSize: 20, marginBottom: 8 }}>Task Board</h5>
          <p className="muted" style={{ marginBottom: 16 }}>
            Manage this project's tasks on the drag-and-drop board.
          </p>
          <ButtonComponent cssClass="e-primary" onClick={(e) => { e.stopPropagation(); navigate(boardPath) }}>Open Board →</ButtonComponent>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetail
