import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import CommentList from '../components/CommentList'
import ActivityLog from '../components/ActivityLog'
import TaskForm from '../components/TaskForm'
import {
  getTask, updateTask, changeStatus as changeStatusApi,
  getAssignees, assignTask, unassignTask,
  getComments, addComment, updateComment, deleteComment,
} from '../services/taskService'
import { getUsersByIds } from '../services/userService'
import { getWorkspaceById, getWorkspaceMembers } from '../services/workspaceService'
import {
  STATUSES, STATUS_LABEL, PRIORITY_COLOR, TYPE_COLOR, CAN_TRANSITION, SPRINTS, FEATURES,
} from '../data/taskMock'

// tiny helper: "Rohit Kumar" -> "RK"  (used for the little round avatar badge)
const initialsOf = (name = '') => name.split(' ').map((w) => w[0]).filter(Boolean).join('').slice(0, 2).toUpperCase() || '?'

// status dropdown options, built once from the enum: { value we send, text we show }
const statusOptions = STATUSES.map((s) => ({ value: s, text: STATUS_LABEL[s] }))

function TaskDetail() {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const currentUser = JSON.parse(localStorage.getItem('current_user') || '{}')
  const currentUserId = currentUser.id

  const [task, setTask] = useState(null)         // the one task (TaskResponseDTO)
  const [status, setStatus] = useState('')       // current status, kept on its own so the dropdown feels snappy
  const [assignees, setAssignees] = useState([]) // RAW list from the API: [{ userId, assignedAt }] — ids only, no names
  const [comments, setComments] = useState([])   // comments mapped into the shape CommentList wants
  const [users, setUsers] = useState(() => {
    if (!currentUserId) return {}
    return { [currentUserId]: { id: currentUserId, name: currentUser.name || 'You' } }
  })
  const [role, setRole] = useState('MEMBER')
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  // ---------- loaders: the PAGE fetches, then drops the data into state ----------

  // GET /task/{id}
  const loadTask = async () => {
    const data = await getTask(taskId)
    if (data) {
      setTask(data)
      setStatus(data.taskStatus)   // note: the status field is called taskStatus, not status
      setNotFound(false)
    } else {
      setTask(null)
      setNotFound(true)
    }
  }

  // GET /task/{id}/assignees  ->  [{ userId, assignedAt }]   (again: just ids, no names!)
  const loadAssignees = async () => {
    const data = await getAssignees(taskId)
    setAssignees(data || [])
  }

  // GET /task/{id}/comments  ->  keep only what CommentList needs, oldest comment first
  const loadComments = async () => {
    const data = await getComments(taskId)
    setComments((data || [])
      .slice()   // copy first so we don't sort the original array in place
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map((c) => ({ id: c.commentId, userId: c.userId, content: c.content, createdAt: c.createdAt, updatedAt: c.updatedAt })))
  }

  // Turn a bunch of user ids into real names by asking the AUTH service.
  // We only fetch ids we DON'T already have, so we don't keep re-calling Auth for the same people.
  const ensureUsers = async (ids) => {
    const missing = ids.filter((id) => id != null && !users[id])
    if (missing.length === 0) return
    const fetched = await getUsersByIds(missing)   // [] if Auth isn't up yet -> we just fall back to the mock
    if (fetched.length) {
      setUsers((prev) => {
        const next = { ...prev }
        fetched.forEach((u) => { next[u.id] = u })   // merge new profiles into the map
        return next
      })
    }
  }

  // First load: task + assignees + comments together (they don't need each other, so fire in parallel).
  // Also resolve the user's workspace role and load ALL workspace members for the assignee dropdown.
  useEffect(() => {
    let active = true
    setLoading(true)
    const wsId = localStorage.getItem('active_workspace_id')
    if (wsId) {
      getWorkspaceById(wsId).then((ws) => {
        if (active && ws?.role) setRole(ws.role)
      }).catch(() => {})

      getWorkspaceMembers(wsId).then((members) => {
        if (!active || !members) return
        setUsers((prev) => {
          const next = { ...prev }
          members.forEach((m) => { next[m.userId] = { id: m.userId, name: m.name, email: m.email, avatarColor: m.avatarColor } })
          return next
        })
      }).catch(() => {})
    }
    Promise.all([loadTask(), loadAssignees(), loadComments()]).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [taskId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Whenever assignees or comments change, gather every userId they mention and make sure
  // we have that person's profile. Fallback in case workspace members didn't load
  // or a comment comes from a user who left the workspace.
  useEffect(() => {
    const ids = [...new Set([...assignees.map((a) => a.userId), ...comments.map((c) => c.userId)])]
    if (ids.length) ensureUsers(ids)
  }, [assignees, comments]) // eslint-disable-line react-hooks/exhaustive-deps

  const resolveUser = (userId) => {
    if (userId === currentUserId) {
      return { userId, name: currentUser.name || 'You', initials: initialsOf(currentUser.name), color: '#2563eb' }
    }
    const u = users[userId]
    if (u) return { userId, name: u.name, initials: initialsOf(u.name), color: u.avatarColor || '#2563eb' }
    return { userId, name: `User ${userId}`, initials: initialsOf(String(userId)), color: '#64748b' }
  }

  // ---------- render guards ----------

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--app-bg)' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: 32 }}>Loading task…</div>
      </div>
    )
  }

  if (notFound || !task) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--app-bg)' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: 32 }}>
          <ButtonComponent cssClass="e-flat" onClick={() => navigate(-1)}>← Back</ButtonComponent>
          <h4 style={{ fontSize: '1.75rem', marginTop: 16 }}>Task not found</h4>
        </div>
      </div>
    )
  }

  const isOwner = role === 'OWNER'

  // ---------- actions: call the API, then REFETCH (server is the source of truth) ----------

  const onSaveEdit = async (values) => {
    const { assigneeIds: newIds, ...taskValues } = values
    const result = await updateTask(taskId, taskValues)
    if (result) {
      if (newIds) {
        const currentIds = assignees.map((a) => a.userId)
        const toAdd = newIds.filter((id) => !currentIds.includes(id))
        const toRemove = currentIds.filter((id) => !newIds.includes(id))
        if (toAdd.length || toRemove.length) {
          await Promise.all([
            ...toAdd.map((userId) => assignTask(taskId, userId)),
            ...toRemove.map((userId) => unassignTask(taskId, userId)),
          ])
          await loadAssignees()
        }
      }
      toast.success('Task updated')
      await loadTask()
    }
    setEditOpen(false)
  }

  // PATCH /task/{id}/status. The client-side FSM check is only a quick fail-fast for nicer UX —
  // the backend (TaskStatus.canTransitionTo) is the REAL guard and 422s an illegal move anyway.
  const handleStatusChange = async (next) => {
    if (!next || next === status) return
    // block obviously-illegal moves right here with an error toast (saves a round trip)
    if (!CAN_TRANSITION[status]?.includes(next)) {
      toast.error(`Can't move ${STATUS_LABEL[status]} → ${STATUS_LABEL[next]}`)
      return
    }
    const ok = await changeStatusApi(taskId, next)
    if (ok) {
      setStatus(next)
      toast.success('Status updated')
    } else {
      // server said no (e.g. 422) -> reload so the dropdown snaps back to the real status
      await loadTask()
    }
  }

  const assignedIds = assignees.map((a) => a.userId)
  const candidates = Object.values(users)
    .filter((u) => !assignedIds.includes(u.id))
    .map((u) => ({ value: u.id, text: u.name }))

  const handleAddAssignee = async (userId) => {
    if (!userId) return
    const result = await assignTask(taskId, userId)   // POST /task/{id}/assignees { userId }
    if (result) {
      toast.success('Assigned')
      await loadAssignees()
    }
  }

  const handleRemoveAssignee = async (userId) => {
    const ok = await unassignTask(taskId, userId)     // DELETE /task/{id}/assignees { userId }
    if (ok) {
      toast.success('Unassigned')
      await loadAssignees()
    }
  }

  const handleAddComment = async (content) => {
    const result = await addComment(taskId, content)  // POST /task/{id}/comments { content }
    if (result) {
      toast.success('Comment added')
      await loadComments()
    }
  }

  const handleEditComment = async (commentId, content) => {
    const result = await updateComment(taskId, commentId, content)
    if (result) {
      toast.success('Comment updated')
      await loadComments()
    }
  }

  const handleDeleteComment = async (commentId) => {
    const ok = await deleteComment(taskId, commentId)
    if (ok) {
      toast.success('Comment deleted')
      await loadComments()
    }
  }

  const chip = (text, color) => (
    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 6, background: `${color}1a`, color }}>{text}</span>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--app-bg)', color: 'var(--text)' }}>
      <Sidebar />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Header userName={JSON.parse(localStorage.getItem('current_user') || '{}').name || 'User'} />

        <main style={{ flex: 1, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <ButtonComponent cssClass="e-flat" onClick={() => navigate(-1)}>← Back</ButtonComponent>
            {isOwner && <ButtonComponent cssClass="e-outline" onClick={() => setEditOpen(true)}>Edit Task</ButtonComponent>}
          </div>

          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* main column */}
            <div style={{ flex: 2, minWidth: 320 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 10 }}>
                {/* remember the keys: taskType / taskPriority (not type / priority) */}
                {chip(task.taskType, TYPE_COLOR[task.taskType] || '#64748b')}
                {task.taskPriority && chip(task.taskPriority, PRIORITY_COLOR[task.taskPriority] || '#64748b')}
                {task.dueDate && <span className="muted" style={{ fontSize: 12 }}>Due {new Date(task.dueDate).toLocaleDateString()}</span>}
              </div>

              <h3 style={{ fontSize: '1.6rem', marginBottom: 6 }}>{task.title}</h3>
              {/* TaskResponseDTO has no createdBy field, so we can only show the date */}
              <p className="muted" style={{ marginBottom: 20 }}>
                {task.createdAt ? `Created on ${new Date(task.createdAt).toLocaleDateString()}` : ''}
              </p>

              <div className="card" style={{ padding: 20, marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Description</div>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#374151', whiteSpace: 'pre-wrap' }}>{task.description}</p>
              </div>

              <div className="card" style={{ padding: 20 }}>
                <h6 style={{ fontSize: 16, marginBottom: 16 }}>Comments</h6>
                {/* CommentList just displays + fires callbacks; the page does the API work + refetch.
                    resolveUser turns each comment's userId into a name (Auth first, mock fallback). */}
                <CommentList
                  comments={comments}
                  currentUserId={currentUserId}
                  resolveUser={resolveUser}
                  onAdd={handleAddComment}
                  onEdit={handleEditComment}
                  onDelete={handleDeleteComment}
                />
              </div>
            </div>

            {/* side column */}
            <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="card" style={{ padding: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Status</div>
                <DropDownListComponent
                  dataSource={statusOptions}
                  fields={{ text: 'text', value: 'value' }}
                  value={status}
                  change={(e) => handleStatusChange(e.value)}
                  width="100%"
                />

                <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', margin: '18px 0 6px' }}>Assignees</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  {assignees.length === 0 && <span className="muted" style={{ fontSize: 13 }}>No assignees</span>}
                  {assignees.map((a) => {
                    // a = { userId, assignedAt } (id only) -> resolve to a name for display
                    const m = resolveUser(a.userId)
                    return (
                      <span key={a.userId} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f1f5f9', borderRadius: 999, padding: '3px 6px 3px 3px' }}>
                        <span className="avatar" style={{ width: 22, height: 22, fontSize: 10, background: m.color }}>{m.initials}</span>
                        <span style={{ fontSize: 12 }}>{m.name}</span>
                        {isOwner && <ButtonComponent cssClass="e-flat" style={{ minWidth: 0, padding: '0 6px', lineHeight: 1 }} onClick={() => handleRemoveAssignee(a.userId)}>×</ButtonComponent>}
                      </span>
                    )
                  })}
                </div>
                {isOwner && candidates.length > 0 && (
                  <div style={{ marginTop: 10 }}>
                    <DropDownListComponent
                      dataSource={candidates}
                      fields={{ text: 'text', value: 'value' }}
                      placeholder="+ Add assignee"
                      value={null}
                      change={(e) => handleAddAssignee(e.value)}
                      width="100%"
                    />
                  </div>
                )}
              </div>

              <div className="card" style={{ padding: 20 }}>
                <h6 style={{ fontSize: 16, marginBottom: 12 }}>Activity</h6>
                {/* No GET /task/{id}/activity endpoint on the backend yet -> nothing to wire, show empty. */}
                <ActivityLog items={[]} resolveActor={() => ({})} />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Edit dialog. sprintId/featureId aren't in TaskUpdateDTO yet, so the form collects them
          but updateTask() drops them until the backend adds those fields. */}
      <TaskForm
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={onSaveEdit}
        task={{
          title: task.title,
          description: task.description,
          taskPriority: task.taskPriority,
          taskType: task.taskType,
          dueDate: task.dueDate,
          sprintId: task.sprintId ?? null,
          featureId: null,
        }}
        sprints={SPRINTS}
        features={FEATURES}
        members={Object.values(users).filter((u) => u.id).map((u) => ({ value: u.id, text: u.name }))}
        assigneeIds={assignees.map((a) => a.userId)}
      />
    </div>
  )
}

export default TaskDetail
