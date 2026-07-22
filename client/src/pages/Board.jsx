import { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { KanbanComponent, ColumnsDirective, ColumnDirective } from '@syncfusion/ej2-react-kanban'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import TaskForm from '../components/TaskForm'
import SprintForm from '../components/SprintForm'
import FeatureForm from '../components/FeatureForm'
import { TASKS, SPRINTS, FEATURES, CURRENT_USER_ID, featureById, memberById, PRIORITY_COLOR, TYPE_COLOR, STATUS_LABEL } from '../data/taskMock'

const SPRINT_STATUS_COLOR = { PLANNED: '#64748b', ACTIVE: '#16a34a', COMPLETED: '#4f46e5' }
const FEATURE_STATUS_COLOR = { PLANNED: '#64748b', IN_PROGRESS: '#2563eb', DONE: '#16a34a' }
const FEATURE_COLOR = '#7c3aed' // epic accent for feature badges

function badge(text, color) {
  return (
    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.4, padding: '2px 7px', borderRadius: 5, background: `${color}1a`, color }}>
      {text}
    </span>
  )
}

// data-taskid lets the board catch a click via delegation (see handlers below).
function cardTemplate(task) {
  const assignees = (task.assignees || []).map(memberById).filter(Boolean)
  const feature = task.featureId ? featureById(task.featureId) : null
  return (
    <div data-taskid={task.id} style={{ padding: 12, cursor: 'pointer' }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
        {badge(task.taskType, TYPE_COLOR[task.taskType] || '#64748b')}
        {badge(task.taskPriority, PRIORITY_COLOR[task.taskPriority] || '#64748b')}
        {feature && badge(feature.name, FEATURE_COLOR)}
      </div>
      <div style={{ fontWeight: 600, fontSize: 13.5, lineHeight: 1.35, color: '#0f172a', marginBottom: 10 }}>
        {task.title}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex' }}>
          {assignees.slice(0, 3).map((m, i) => (
            <span key={m.userId} className="avatar" style={{ width: 24, height: 24, fontSize: 10, background: m.color, border: '2px solid #fff', marginLeft: i === 0 ? 0 : -8 }}>
              {m.initials}
            </span>
          ))}
        </div>
        <span style={{ fontSize: 11, color: '#64748b' }}>{task.commentCount} 💬</span>
      </div>
    </div>
  )
}

// A small status pill for a sprint.
function sprintPill(status) {
  const c = SPRINT_STATUS_COLOR[status] || '#64748b'
  return <span className="chip" style={{ background: `${c}1a`, color: c, fontWeight: 700, fontSize: 11 }}>{status}</span>
}

// A small status pill for a feature.
function featurePill(status) {
  const c = FEATURE_STATUS_COLOR[status] || '#64748b'
  return <span className="chip" style={{ background: `${c}1a`, color: c, fontWeight: 700, fontSize: 11 }}>{status}</span>
}


function Board() {
  const { projectId } = useParams()
  const navigate = useNavigate()

  const [tasks, setTasks] = useState([])

  const [sprints, setSprints] = useState(SPRINTS)
  const [features, setFeatures] = useState(FEATURES)
  const [role, setRole] = useState('OWNER') // DEMO toggle. WIRE: workspace_user.role for CURRENT_USER_ID
  const [tab, setTab] = useState('sprint')  // 'sprint' | 'backlog'
  const [formOpen, setFormOpen] = useState(false)
  const [sprintFormOpen, setSprintFormOpen] = useState(false)
  const [featureFormOpen, setFeatureFormOpen] = useState(false)
  const down = useRef({ x: 0, y: 0 })

//Loading all tasks related to a particular project



  const isOwner = role === 'OWNER'

  /* ---------- derived data ---------- */
  const projectTasks = projectId ? tasks.filter((t) => t.projectId === projectId) : tasks
  const projectSprints = projectId ? sprints.filter((s) => s.projectId === projectId) : []
  const projectFeatures = projectId ? features.filter((f) => f.projectId === projectId) : []
  const activeSprint = projectSprints.find((s) => s.status === 'ACTIVE') || null
  const sprintTasks = activeSprint ? projectTasks.filter((t) => t.sprintId === activeSprint.id) : []
  const backlogTasks = projectTasks.filter((t) => !t.sprintId) // sprint_id null = backlog
  // My Board (no project): only tasks assigned to me. WIRE: a "tasks assigned to me" endpoint.
  const myTasks = tasks.filter((t) => (t.assignees || []).includes(CURRENT_USER_ID))

  /* ---------- click vs drag on the Kanban ---------- */
  const onPointerDownCapture = (e) => { down.current = { x: e.clientX, y: e.clientY } }
  const onClickCapture = (e) => {
    const moved = Math.abs(e.clientX - down.current.x) > 6 || Math.abs(e.clientY - down.current.y) > 6
    if (moved) return
    const el = e.target.closest('[data-taskid]')
    if (el) navigate(`/task/${el.getAttribute('data-taskid')}`)
  }
  const onDragStop = (args) => {
    const card = args.data && args.data[0]
    if (!card) return
    // WIRE: await changeStatus(card.id, card.status); on 422 args.cancel = true + toast
  }

  /* ---------- mutations (mock; WIRE: call API then refetch) ---------- */
  const onCreate = (values) => {
    const newTask = {
      id: Date.now(),
      projectId: projectId || undefined,
      sprintId: null, // new tasks land in the BACKLOG; the owner pulls them into a sprint
      status: 'TODO', assignees: [], commentCount: 0,
      createdBy: CURRENT_USER_ID, createdAt: new Date().toISOString(),
      ...values,
    }
    setTasks((prev) => [...prev, newTask])
    // WIRE: await addTask({ ...values, projectID: projectId, sprintId: null }); await loadTasks()
    setFormOpen(false)
  }

  const onCreateSprint = (values) => {
    const newSprint = { id: Date.now(), projectId, status: 'PLANNED', ...values }
    setSprints((prev) => [...prev, newSprint])
    // WIRE: await createSprint({ ...values, projectId }); await loadSprints()
    setSprintFormOpen(false)
  }

  const startSprint = (sprintId) => {
    // one ACTIVE sprint per project: starting this one completes any other active sprint here.
    setSprints((prev) => prev.map((s) => {
      if (s.id === sprintId) return { ...s, status: 'ACTIVE' }
      if (s.projectId === projectId && s.status === 'ACTIVE') return { ...s, status: 'COMPLETED' }
      return s
    }))
    // WIRE: PATCH sprint status PLANNED->ACTIVE (backend enforces one ACTIVE per project) -> refetch
  }
  const completeSprint = (sprintId) => {
    setSprints((prev) => prev.map((s) => (s.id === sprintId ? { ...s, status: 'COMPLETED' } : s)))
    // WIRE: PATCH sprint status ACTIVE->COMPLETED -> refetch
  }
  const pullIntoSprint = (taskId, sprintId) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, sprintId } : t)))
    // WIRE: PATCH /task/{id} set sprint_id (pull from backlog into the sprint) -> refetch
  }

  const createFeature = (values) => {
    setFeatures((prev) => [...prev, { id: Date.now(), projectId, status: 'PLANNED', ...values }])
    // WIRE: await createFeature({ ...values, projectId }); await loadFeatures()
    setFeatureFormOpen(false)
  }
  const advanceFeature = (featureId, status) => {
    setFeatures((prev) => prev.map((f) => (f.id === featureId ? { ...f, status } : f)))
    // WIRE: PATCH feature status (PLANNED->IN_PROGRESS->DONE) -> refetch
  }

  const pullableSprints = projectSprints.filter((s) => s.status !== 'COMPLETED').map((s) => ({ value: s.id, text: s.name }))

  /* =====================================================================
     MY BOARD (no project in the route) — personal, cross-project, no sprints
     ===================================================================== */
  if (!projectId) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--app-bg)', color: 'var(--text)' }}>
        <Sidebar />
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <Header userName="Yogesh Bhatt" />
          <main style={{ flex: 1, padding: 24, minWidth: 0 }}>
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ fontSize: '1.6rem' }}>My Board</h4>
              <p className="muted">All tasks assigned to you, across every project. <span style={{ fontSize: 12 }}>(WIRE: GET tasks assigned to me)</span></p>
            </div>
            <div onPointerDownCapture={onPointerDownCapture} onClickCapture={onClickCapture}>
              <KanbanComponent id="my-board" keyField="status" dataSource={myTasks} cardSettings={{ headerField: 'id', template: cardTemplate }} dragStop={onDragStop}>
                <ColumnsDirective>
                  <ColumnDirective headerText={STATUS_LABEL.TODO} keyField="TODO" showItemCount={true} />
                  <ColumnDirective headerText={STATUS_LABEL.IN_PROGRESS} keyField="IN_PROGRESS" showItemCount={true} />
                  <ColumnDirective headerText={STATUS_LABEL.IN_REVIEW} keyField="IN_REVIEW" showItemCount={true} />
                  <ColumnDirective headerText={STATUS_LABEL.DONE} keyField="DONE" showItemCount={true} />
                </ColumnsDirective>
              </KanbanComponent>
            </div>
          </main>
        </div>
      </div>
    )
  }

  /* =====================================================================
     PROJECT BOARD — Sprint Board + Backlog tabs, owner controls
     ===================================================================== */
  const tabBtn = (id, label) => (
    <ButtonComponent cssClass={tab === id ? 'e-primary' : 'e-outline'} onClick={() => setTab(id)}>{label}</ButtonComponent>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--app-bg)', color: 'var(--text)' }}>
      <Sidebar />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Header userName="Yogesh Bhatt" />

        <main style={{ flex: 1, padding: 24, minWidth: 0 }}>
          {/* title + role toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
            <div>
              <h4 style={{ fontSize: '1.6rem' }}>Project Board <span className="muted" style={{ fontSize: 12, fontWeight: 400 }}>project #{projectId}</span></h4>
              <p className="muted" style={{ fontSize: 13 }}>Sprint board + backlog. Owner grooms the backlog and runs sprints; members work the active sprint.</p>
            </div>
            {/* DEMO role toggle — WIRE: real role from workspace_user.role */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="muted" style={{ fontSize: 12 }}>View as (demo):</span>
              <ButtonComponent cssClass={isOwner ? 'e-primary' : 'e-outline'} onClick={() => setRole('OWNER')}>Owner</ButtonComponent>
              <ButtonComponent cssClass={!isOwner ? 'e-primary' : 'e-outline'} onClick={() => setRole('MEMBER')}>Member</ButtonComponent>
            </div>
          </div>

          {/* tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
            {tabBtn('sprint', 'Sprint Board')}
            {tabBtn('backlog', `Backlog (${backlogTasks.length})`)}
          </div>

          {/* ---------------- SPRINT BOARD ---------------- */}
          {tab === 'sprint' && (
            <>
              {activeSprint ? (
                <div className="card" style={{ padding: '14px 18px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <strong style={{ fontSize: 16 }}>{activeSprint.name}</strong>
                      {sprintPill(activeSprint.status)}
                    </div>
                    <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                      {activeSprint.startDate && activeSprint.endDate ? `${activeSprint.startDate} → ${activeSprint.endDate} · ` : ''}{activeSprint.goal}
                    </div>
                  </div>
                  {/* owner-only sprint control */}
                  {isOwner && (
                    <ButtonComponent cssClass="e-outline" onClick={() => completeSprint(activeSprint.id)}>Complete Sprint</ButtonComponent>
                  )}
                </div>
              ) : (
                <div className="card" style={{ padding: 32, textAlign: 'center', marginBottom: 16, border: '2px dashed var(--border)', boxShadow: 'none' }}>
                  <h6 style={{ fontSize: 16, marginBottom: 6 }}>No active sprint</h6>
                  <p className="muted" style={{ marginBottom: isOwner ? 12 : 0 }}>
                    {isOwner ? 'Create a sprint and start it from the Backlog tab.' : 'The owner hasn’t started a sprint yet.'}
                  </p>
                  {isOwner && <ButtonComponent cssClass="e-primary" onClick={() => setTab('backlog')}>Go to Backlog →</ButtonComponent>}
                </div>
              )}

              {activeSprint && (
                <div onPointerDownCapture={onPointerDownCapture} onClickCapture={onClickCapture}>
                  <KanbanComponent id="task-board" keyField="status" dataSource={sprintTasks} cardSettings={{ headerField: 'id', template: cardTemplate }} dragStop={onDragStop}>
                    <ColumnsDirective>
                      <ColumnDirective headerText={STATUS_LABEL.TODO} keyField="TODO" showItemCount={true} />
                      <ColumnDirective headerText={STATUS_LABEL.IN_PROGRESS} keyField="IN_PROGRESS" showItemCount={true} />
                      <ColumnDirective headerText={STATUS_LABEL.IN_REVIEW} keyField="IN_REVIEW" showItemCount={true} />
                      <ColumnDirective headerText={STATUS_LABEL.DONE} keyField="DONE" showItemCount={true} />
                    </ColumnsDirective>
                  </KanbanComponent>
                </div>
              )}
            </>
          )}

          {/* ---------------- BACKLOG ---------------- */}
          {tab === 'backlog' && (
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              {/* backlog list */}
              <div style={{ flex: 2, minWidth: 320 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h6 style={{ fontSize: 16 }}>Backlog <span className="muted" style={{ fontWeight: 400, fontSize: 13 }}>· unscheduled tasks</span></h6>
                  {/* owner adds tasks to the backlog */}
                  {isOwner && <ButtonComponent cssClass="e-primary" onClick={() => setFormOpen(true)}>+ New Task</ButtonComponent>}
                </div>

                {tasks.length === 0 ? (
                  <p className="muted" style={{ padding: '24px 0', textAlign: 'center' }}>Backlog is empty.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {tasks.map((t) => (
                      <div key={t.id} className="card" style={{ padding: 12, boxShadow: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => navigate(`/task/${t.id}`)}>
                          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{t.title}</div>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {badge(t.taskType, TYPE_COLOR[t.taskType] || '#64748b')}
                            {badge(t.taskPriority, PRIORITY_COLOR[t.taskPriority] || '#64748b')}
                            {t.featureId && badge(featureById(t.featureId)?.name, FEATURE_COLOR)}
                          </div>
                        </div>
                        {/* owner pulls a backlog task into a sprint */}
                        {isOwner && pullableSprints.length > 0 && (
                          <div style={{ width: 180 }}>
                            <DropDownListComponent
                              dataSource={pullableSprints}
                              fields={{ text: 'text', value: 'value' }}
                              placeholder="Add to sprint…"
                              value={null}
                              change={(e) => e.value && pullIntoSprint(t.id, e.value)}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* sprints panel */}
              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h6 style={{ fontSize: 16 }}>Sprints</h6>
                  {isOwner && <ButtonComponent cssClass="e-outline" onClick={() => setSprintFormOpen(true)}>+ New Sprint</ButtonComponent>}
                </div>

                {projectSprints.length === 0 ? (
                  <p className="muted" style={{ fontSize: 13 }}>No sprints yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {projectSprints.map((s) => {
                      const count = projectTasks.filter((t) => t.sprintId === s.id).length
                      return (
                        <div key={s.id} className="card" style={{ padding: 12, boxShadow: 'none' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <strong style={{ fontSize: 13.5, flex: 1 }}>{s.name}</strong>
                            {sprintPill(s.status)}
                          </div>
                          <div className="muted" style={{ fontSize: 12, marginBottom: isOwner ? 10 : 0 }}>{count} task{count !== 1 ? 's' : ''}{s.goal ? ` · ${s.goal}` : ''}</div>
                          {/* owner-only lifecycle controls, conditional on status */}
                          {isOwner && s.status === 'PLANNED' && (
                            <ButtonComponent cssClass="e-primary" onClick={() => startSprint(s.id)}>Start Sprint</ButtonComponent>
                          )}
                          {isOwner && s.status === 'ACTIVE' && (
                            <ButtonComponent cssClass="e-outline" onClick={() => completeSprint(s.id)}>Complete Sprint</ButtonComponent>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* features panel (epics) — owner-managed, orthogonal to sprints */}
              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h6 style={{ fontSize: 16 }}>Features</h6>
                  {isOwner && <ButtonComponent cssClass="e-outline" onClick={() => setFeatureFormOpen(true)}>+ New Feature</ButtonComponent>}
                </div>
                {projectFeatures.length === 0 ? (
                  <p className="muted" style={{ fontSize: 13 }}>No features yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {projectFeatures.map((f) => {
                      const count = projectTasks.filter((t) => t.featureId === f.id).length
                      return (
                        <div key={f.id} className="card" style={{ padding: 12, boxShadow: 'none' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <strong style={{ fontSize: 13.5, flex: 1 }}>{f.name}</strong>
                            {featurePill(f.status)}
                          </div>
                          <div className="muted" style={{ fontSize: 12, marginBottom: isOwner && f.status !== 'DONE' ? 10 : 0 }}>{count} task{count !== 1 ? 's' : ''}</div>
                          {isOwner && f.status === 'PLANNED' && (
                            <ButtonComponent cssClass="e-primary" onClick={() => advanceFeature(f.id, 'IN_PROGRESS')}>Start</ButtonComponent>
                          )}
                          {isOwner && f.status === 'IN_PROGRESS' && (
                            <ButtonComponent cssClass="e-outline" onClick={() => advanceFeature(f.id, 'DONE')}>Mark Done</ButtonComponent>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* dialogs */}
      <TaskForm open={formOpen} onClose={() => setFormOpen(false)} onSubmit={onCreate} sprints={SPRINTS} features={FEATURES} />
      <SprintForm open={sprintFormOpen} onClose={() => setSprintFormOpen(false)} onSubmit={onCreateSprint} />
      <FeatureForm open={featureFormOpen} onClose={() => setFeatureFormOpen(false)} onSubmit={createFeature} />
    </div>
  )
}

export default Board
