import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import CommentList from '../components/CommentList'
import ActivityLog from '../components/ActivityLog'
import TaskForm from '../components/TaskForm'
import {
  taskById as tmTaskById, commentsByTask, activityByTask, memberById, MEMBERS,
  STATUSES, STATUS_LABEL, PRIORITY_COLOR, TYPE_COLOR, CAN_TRANSITION, SPRINTS, FEATURES,
} from '../data/taskMock'
import { getTaskById, getCommentsByTask, getTaskAssignees, getUserById, mockUsers } from '../data/mockData'

const initialsOf = (name = '') => name.split(' ').map((w) => w[0]).filter(Boolean).join('').slice(0, 2).toUpperCase() || '?'

// Resolve a task from either data source so both boards (taskMock /board and
// mockData ProjectDetail) route here. WIRE: replace the whole thing with getTask(id).
function resolveTask(taskId) {
  const tm = tmTaskById(taskId)
  if (tm) {
    const assignees = (tm.assignees || []).map(memberById).filter(Boolean)
    return {
      task: { ...tm, type: tm.taskType, priority: tm.taskPriority },
      statuses: STATUSES.map((s) => ({ value: s, text: STATUS_LABEL[s] })),
      canTransition: (from, to) => CAN_TRANSITION[from]?.includes(to),
      assignees: assignees.map((m) => ({ userId: m.userId, name: m.name, initials: m.initials, color: m.color })),
      candidates: MEMBERS.filter((m) => !(tm.assignees || []).includes(m.userId)).map((m) => ({ value: m.userId, text: m.name })),
      comments: commentsByTask(tm.id).map((c) => ({ id: c.commentId, userId: c.userId, content: c.content, createdAt: c.createdAt, updatedAt: c.updatedAt })),
      activity: activityByTask(tm.id),
      resolveUser: (id) => { const m = memberById(id); return m ? { name: m.name, initials: m.initials, color: m.color } : { name: 'Unknown', initials: '?', color: '#64748b' } },
      resolveActor: (id) => ({ name: memberById(id)?.name || 'Someone' }),
      currentUserId: 100,
      creatorName: memberById(tm.createdBy)?.name,
    }
  }

  const md = getTaskById(taskId)
  if (md) {
    const assigneeUsers = getTaskAssignees(md.id)
    const assignedIds = assigneeUsers.map((u) => u.id)
    const stored = JSON.parse(localStorage.getItem('current_user') || '{}')
    return {
      task: { ...md, type: md.type || 'TASK', priority: md.priority, status: md.status },
      statuses: ['TODO', 'IN_PROGRESS', 'COMPLETED'].map((s) => ({ value: s, text: s.replace('_', ' ') })),
      canTransition: () => true, // mockData has no FSM — allow; WIRE: server enforces 422
      assignees: assigneeUsers.map((u) => ({ userId: u.id, name: u.name, initials: initialsOf(u.name), color: '#2563eb' })),
      candidates: mockUsers.filter((u) => !assignedIds.includes(u.id)).map((u) => ({ value: u.id, text: u.name })),
      comments: getCommentsByTask(md.id).map((c) => ({ id: c.id, userId: c.userId, content: c.content, createdAt: c.createdAt, updatedAt: c.updatedAt })),
      activity: [{ id: 'act_created', actorId: md.createdBy, action: 'CREATED', detail: 'created this task', createdAt: md.createdAt }],
      resolveUser: (id) => { const u = getUserById(id); return u ? { name: u.name, initials: initialsOf(u.name), color: '#2563eb' } : { name: 'Unknown', initials: '?', color: '#64748b' } },
      resolveActor: (id) => ({ name: getUserById(id)?.name || 'Someone' }),
      currentUserId: stored.id || 'usr_001',
      creatorName: getUserById(md.createdBy)?.name,
    }
  }
  return null
}

function TaskDetail() {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const view = resolveTask(taskId)

  const [status, setStatus] = useState('')
  const [assignees, setAssignees] = useState([])
  const [editOpen, setEditOpen] = useState(false)
  const [taskEdits, setTaskEdits] = useState(null) // local edit overlay (mock); WIRE: refetch instead

  useEffect(() => {
    if (view) {
      setStatus(view.task.status)
      setAssignees(view.assignees)
      setTaskEdits(null) // drop any edit overlay when navigating to another task
    }
  }, [taskId]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!view) {
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

  // task with any local edits overlaid (mock). WIRE: after updateTask, refetch instead of overlaying.
  const task = taskEdits ? { ...view.task, ...taskEdits } : view.task

  // Save edits from the TaskForm. Mock: keep an overlay. WIRE: call the API then refetch.
  const onSaveEdit = (values) => {
    // keep both naming shapes so the chips (type/priority) and the form (taskType/taskPriority) stay in sync
    setTaskEdits({ ...values, type: values.taskType, priority: values.taskPriority })
    // WIRE: await updateTask(task.id, values); await loadTask()
    setEditOpen(false)
  }

  const changeStatus = (next) => {
    if (!next || next === status) return
    if (!view.canTransition(status, next)) {
      window.alert(`Illegal transition: ${status} → ${next} (server returns 422)`) // WIRE: toast
      return
    }
    setStatus(next) // WIRE: changeStatus(task.id, next)
  }

  const removeAssignee = (userId) => setAssignees((prev) => prev.filter((a) => a.userId !== userId)) // WIRE: unassign
  const addAssignee = (userId) => {
    if (!userId || assignees.some((a) => a.userId === userId)) return
    const found = view.candidates.find((c) => c.value === userId)
    setAssignees((prev) => [...prev, { userId, name: found?.text, initials: initialsOf(found?.text || ''), color: '#2563eb' }]) // WIRE: assign
  }

  const remaining = view.candidates.filter((c) => !assignees.some((a) => a.userId === c.value))
  const chip = (text, color) => (
    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 6, background: `${color}1a`, color }}>{text}</span>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--app-bg)', color: 'var(--text)' }}>
      <Sidebar />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Header userName="Yogesh Bhatt" />

        <main style={{ flex: 1, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <ButtonComponent cssClass="e-flat" onClick={() => navigate(-1)}>← Back</ButtonComponent>
            <ButtonComponent cssClass="e-outline" onClick={() => setEditOpen(true)}>Edit Task</ButtonComponent>
          </div>

          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* main column */}
            <div style={{ flex: 2, minWidth: 320 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 10 }}>
                {chip(task.type, TYPE_COLOR[task.type] || '#64748b')}
                {task.priority && chip(task.priority, PRIORITY_COLOR[task.priority] || '#64748b')}
                {task.dueDate && <span className="muted" style={{ fontSize: 12 }}>Due {new Date(task.dueDate).toLocaleDateString()}</span>}
              </div>

              <h3 style={{ fontSize: '1.6rem', marginBottom: 6 }}>{task.title}</h3>
              <p className="muted" style={{ marginBottom: 20 }}>
                Created by {view.creatorName || 'Unknown'}{task.createdAt ? ` on ${new Date(task.createdAt).toLocaleDateString()}` : ''}
              </p>

              <div className="card" style={{ padding: 20, marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Description</div>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#374151', whiteSpace: 'pre-wrap' }}>{task.description}</p>
              </div>

              <div className="card" style={{ padding: 20 }}>
                <h6 style={{ fontSize: 16, marginBottom: 16 }}>Comments</h6>
                <CommentList comments={view.comments} currentUserId={view.currentUserId} resolveUser={view.resolveUser} />
              </div>
            </div>

            {/* side column */}
            <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="card" style={{ padding: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Status</div>
                <DropDownListComponent
                  dataSource={view.statuses}
                  fields={{ text: 'text', value: 'value' }}
                  value={status}
                  change={(e) => changeStatus(e.value)}
                  width="100%"
                />

                <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', margin: '18px 0 6px' }}>Assignees</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  {assignees.length === 0 && <span className="muted" style={{ fontSize: 13 }}>No assignees</span>}
                  {assignees.map((m) => (
                    <span key={m.userId} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f1f5f9', borderRadius: 999, padding: '3px 6px 3px 3px' }}>
                      <span className="avatar" style={{ width: 22, height: 22, fontSize: 10, background: m.color }}>{m.initials}</span>
                      <span style={{ fontSize: 12 }}>{m.name}</span>
                      <ButtonComponent cssClass="e-flat" style={{ minWidth: 0, padding: '0 6px', lineHeight: 1 }} onClick={() => removeAssignee(m.userId)}>×</ButtonComponent>
                    </span>
                  ))}
                </div>
                {remaining.length > 0 && (
                  <div style={{ marginTop: 10 }}>
                    <DropDownListComponent
                      dataSource={remaining}
                      fields={{ text: 'text', value: 'value' }}
                      placeholder="+ Add assignee"
                      value={null}
                      change={(e) => addAssignee(e.value)}
                      width="100%"
                    />
                  </div>
                )}
              </div>

              <div className="card" style={{ padding: 20 }}>
                <h6 style={{ fontSize: 16, marginBottom: 12 }}>Activity</h6>
                <ActivityLog items={view.activity} resolveActor={view.resolveActor} />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Edit-task dialog (Edit Task button). WIRE: onSaveEdit -> updateTask */}
      <TaskForm
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={onSaveEdit}
        task={{
          title: task.title,
          description: task.description,
          taskPriority: task.taskPriority || task.priority,
          taskType: task.taskType || task.type,
          dueDate: task.dueDate,
          sprintId: task.sprintId ?? null,
          featureId: task.featureId ?? null,
        }}
        sprints={SPRINTS}
        features={FEATURES}
      />
    </div>
  )
}

export default TaskDetail
