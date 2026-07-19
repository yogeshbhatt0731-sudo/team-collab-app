import { useParams, useNavigate } from 'react-router-dom'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { DropDownButtonComponent } from '@syncfusion/ej2-react-splitbuttons'
import { getProjectById, getUserById, getTasksByProject, getTaskAssignees } from '../data/mockData'

// NOTE: this mock Kanban is a placeholder — it will be replaced by the
// Syncfusion Board wired to the real /task API (see SYNCFUSION_MIGRATION.md).

const statusColors = { TODO: '#FFA500', IN_PROGRESS: '#2196F3', COMPLETED: '#4CAF50' }
const priorityColors = { LOW: '#4CAF50', MEDIUM: '#FFA500', HIGH: '#F44336', CRITICAL: '#8B0000' }

function ProjectDetail() {
  const { workspaceId, projectId } = useParams()
  const navigate = useNavigate()

  const cardMenuItems = [
    { text: 'View Details' },
    { text: 'Edit Task' },
    { text: 'Assign to Me' },
    { text: 'Move to...' },
    { separator: true },
    { text: 'Delete' },
  ]

  const project = getProjectById(projectId)
  const tasks = getTasksByProject(projectId)
  const creator = project ? getUserById(project.createdBy) : null

  if (!project) {
    return (
      <div style={{ padding: 32 }}>
        <h4 style={{ fontSize: '1.75rem' }}>Project not found</h4>
      </div>
    )
  }

  const countByStatus = (status) => tasks.filter((t) => t.status === status).length

  return (
    <div style={{ minHeight: '100vh', background: 'var(--app-bg)', padding: 32 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginBottom: 16 }}>
          <ButtonComponent cssClass="e-flat" onClick={() => navigate(`/workspace/${workspaceId}`)}>
            ← Back to Workspace
          </ButtonComponent>
        </div>
        <h3 style={{ fontSize: '2rem', marginBottom: 8 }}>{project.name}</h3>
        <p className="muted" style={{ marginBottom: 16 }}>
          Created by {creator?.name} on {new Date(project.createdAt).toLocaleDateString()}
        </p>

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

        <h5 style={{ fontSize: 22, marginBottom: 24 }}>Kanban Board</h5>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {['TODO', 'IN_PROGRESS', 'COMPLETED'].map((status) => (
            <div
              key={status}
              style={{
                padding: 16,
                background: 'var(--surface)',
                border: `3px solid ${statusColors[status]}`,
                borderRadius: 12,
                minHeight: 600,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <h6 style={{ flex: 1, color: statusColors[status] }}>{status.replace(/_/g, ' ')}</h6>
                <span className="chip" style={{ background: statusColors[status], color: '#fff' }}>
                  {countByStatus(status)}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {tasks.filter((t) => t.status === status).map((task) => {
                  const assignees = getTaskAssignees(task.id)
                  const daysLeft = Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
                  const isOverdue = daysLeft < 0
                  const isDueSoon = daysLeft >= 0 && daysLeft <= 3

                  return (
                    <div
                      key={task.id}
                      className="card"
                      onClick={() => navigate(`/task/${task.id}`)}
                      style={{
                        position: 'relative',
                        padding: 12,
                        cursor: 'pointer',
                        borderLeft: `4px solid ${priorityColors[task.priority]}`,
                        background: isOverdue ? '#ffe6e6' : isDueSoon ? '#fff3e0' : 'var(--surface)',
                        boxShadow: 'none',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <div style={{ fontWeight: 600, flex: 1, paddingRight: 8, lineHeight: 1.3, fontSize: 14 }}>
                          {task.title}
                        </div>
                        <span onClick={(e) => e.stopPropagation()}>
                          <DropDownButtonComponent
                            cssClass="tc-kebab"
                            items={cardMenuItems}
                            select={(a) => { if (a.item.text === 'View Details') navigate(`/task/${task.id}`) }}
                          >⋮</DropDownButtonComponent>
                        </span>
                      </div>

                      <div className="muted" style={{ fontSize: 12, marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {task.description.substring(0, 50)}...
                      </div>

                      <div style={{ display: 'flex', gap: 4, marginBottom: 8, flexWrap: 'wrap' }}>
                        <span className="chip" style={{ height: 20, background: priorityColors[task.priority], color: '#fff', fontSize: '0.7rem' }}>
                          {task.priority}
                        </span>
                        {isOverdue && (
                          <span className="chip" style={{ height: 20, background: '#F44336', color: '#fff', fontSize: '0.7rem' }}>Overdue</span>
                        )}
                        {isDueSoon && !isOverdue && (
                          <span className="chip" style={{ height: 20, background: '#FFA500', color: '#fff', fontSize: '0.7rem' }}>{daysLeft}d</span>
                        )}
                      </div>

                      {assignees.length > 0 && (
                        <div style={{ display: 'flex' }}>
                          {assignees.slice(0, 3).map((assignee, i) => (
                            <span
                              key={assignee.id}
                              className="avatar"
                              style={{ width: 24, height: 24, fontSize: '0.7rem', border: '2px solid #fff', marginLeft: i === 0 ? 0 : -8 }}
                            >
                              {assignee.name[0]}
                            </span>
                          ))}
                          {assignees.length > 3 && (
                            <span className="avatar" style={{ width: 24, height: 24, fontSize: '0.7rem', background: '#94a3b8', border: '2px solid #fff', marginLeft: -8 }}>
                              +{assignees.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}

                {!tasks.some((t) => t.status === status) && (
                  <p className="muted" style={{ textAlign: 'center', padding: '32px 0' }}>No tasks</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProjectDetail
