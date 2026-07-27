import {useState, useRef, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { KanbanComponent, ColumnsDirective, ColumnDirective } from '@syncfusion/ej2-react-kanban'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import TaskForm from '../components/TaskForm'
import SprintForm from '../components/SprintForm'
import SprintDetailsModal from '../components/SprintDetailsModal'
import FeatureForm from '../components/FeatureForm'
import FeatureDetailsModal from '../components/FeatureDetailsModal'
import { toast } from 'react-toastify'
import { memberById, PRIORITY_COLOR, TYPE_COLOR, STATUS_LABEL } from '../data/taskMock'
import { listTasks, listAssignedTasks, createTask, changeStatus, deleteTask, setTaskSprint, setTaskFeature } from "../services/taskService.js";
import { listSprints, createSprint, updateSprint, updateSprintStatus, deleteSprint, getSprintDetails } from "../services/sprintService.js";
import { listFeatures, createFeature, updateFeatureStatus, deleteFeature, getFeatureDetails } from "../services/featureService.js";

const SPRINT_STATUS_COLOR = { PLANNED: '#64748b', ACTIVE: '#16a34a', COMPLETED: '#4f46e5' }
const SPRINT_STATUS_ORDER = ['ACTIVE', 'PLANNED', 'COMPLETED'] // display order for the grouped Sprints tab
const FEATURE_STATUS_COLOR = { PLANNED: '#64748b', IN_PROGRESS: '#2563eb', DONE: '#16a34a' }
const FEATURE_STATUS_ORDER = ['IN_PROGRESS', 'PLANNED', 'DONE'] // display order for the grouped Features tab
const FEATURE_COLOR = '#7c3aed' // epic accent for feature badges

function badge(text, color) {
  return (
    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.4, padding: '2px 7px', borderRadius: 5, background: `${color}1a`, color }}>
      {text}
    </span>
  )
}

// data-taskid lets the board catch a click via delegation (see handlers below).
// Factory so the card can badge a task's feature from the CURRENT (API-backed) features list.
// canDelete gates the little trash control (owner on the project board; always on My Board).
function makeCardTemplate(features, canDelete) {
  const findFeature = (featureId) => features.find((f) => f.id === featureId)
  return function cardTemplate(task) {
    const assignees = (task.assignees || []).map(memberById).filter(Boolean)
    const feature = task.featureId ? findFeature(task.featureId) : null
    return (
      <div data-taskid={task.id} style={{ padding: 12, cursor: 'pointer', position: 'relative' }}>
        {/* data-deletetask is caught by the same click delegation (onClickCapture) that opens a
            task — that handler checks for the delete control FIRST and skips navigation. */}
        {canDelete && (
          <span
            data-deletetask={task.id}
            title="Delete task"
            style={{ position: 'absolute', top: 8, right: 8, fontSize: 13, lineHeight: 1, color: '#94a3b8', padding: 2, borderRadius: 4 }}
          >
            🗑
          </span>
        )}
        <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap', paddingRight: canDelete ? 20 : 0 }}>
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
          {/* commentCount + assignees aren't in the list DTO (TaskResponseDTO) — guard so cards don't show "undefined".
              WIRE: add them to the list response, or fetch per-task, if you want avatars/counts on the board. */}
          <span style={{ fontSize: 11, color: '#64748b' }}>{task.commentCount ?? 0} 💬</span>
        </div>
      </div>
    )
  }
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
  console.log("ProjectId: ",projectId)
  const navigate = useNavigate()

  const [tasks, setTasks] = useState([])

  const [sprints, setSprints] = useState([])
  const [features, setFeatures] = useState([])
  const [role, setRole] = useState('OWNER') // DEMO toggle. WIRE: workspace_user.role for CURRENT_USER_ID
  const [tab, setTab] = useState('sprint')  // 'sprint' | 'backlog' | 'sprints' | 'features'
  const [formOpen, setFormOpen] = useState(false)
  const [sprintFormOpen, setSprintFormOpen] = useState(false)
  const [editingSprint, setEditingSprint] = useState(null) // sprint being edited, or null when creating
  const [featureFormOpen, setFeatureFormOpen] = useState(false)
  const [creatingSprint, setCreatingSprint] = useState(false)
  const [creatingFeature, setCreatingFeature] = useState(false)
  const [sprintActionId, setSprintActionId] = useState(null) // sprint id currently mid start/complete
  const [featureActionId, setFeatureActionId] = useState(null) // feature id currently mid status change
  // Sprints tab: sprints grouped by status into expandable sections. All collapsed by default.
  const [openSprintGroups, setOpenSprintGroups] = useState({ ACTIVE: false, PLANNED: false, COMPLETED: false })
  const toggleSprintGroup = (status) => setOpenSprintGroups((prev) => ({ ...prev, [status]: !prev[status] }))
  const [sprintDetailsOpen, setSprintDetailsOpen] = useState(false)
  const [sprintDetails, setSprintDetails] = useState(null)
  const [viewingSprintId, setViewingSprintId] = useState(null) // sprint id currently being fetched for the Details modal
  // Features tab: features grouped by status into expandable sections. All collapsed by default.
  const [openFeatureGroups, setOpenFeatureGroups] = useState({ IN_PROGRESS: false, PLANNED: false, DONE: false })
  const toggleFeatureGroup = (status) => setOpenFeatureGroups((prev) => ({ ...prev, [status]: !prev[status] }))
  const [featureDetailsOpen, setFeatureDetailsOpen] = useState(false)
  const [featureDetails, setFeatureDetails] = useState(null)
  const [viewingFeatureId, setViewingFeatureId] = useState(null) // feature id currently being fetched for the Details modal
  const down = useRef({ x: 0, y: 0 })

  const loadTasks = async () => {
    // My Board (no project in the URL) -> tasks assigned to ME (GET /task/assigned).
    // Project Board -> that one project's tasks (GET /task?projectId=).
    // Note: we can't call listTasks(undefined) — the backend requires projectId and would 400.
    const data = projectId ? await listTasks(projectId) : await listAssignedTasks()
    if (data) setTasks(data)
  }

  // Sprints/features are project-scoped lists straight from the API — no client-side
  // projectId filtering needed (and the response DTOs don't even carry a projectId field).
  const loadSprints = async () => {
    const data = await listSprints(projectId)
    setSprints(data || [])
  }
  const loadFeatures = async () => {
    const data = await listFeatures(projectId)
    setFeatures(data || [])
  }

  // Tasks always load (My Board vs Project Board is handled inside loadTasks itself);
  // sprints/features only make sense once we're scoped to a project.
  useEffect(() => {
    loadTasks()
    if (projectId) {
      loadSprints()
      loadFeatures()
    }
  }, [projectId]); // eslint-disable-line react-hooks/exhaustive-deps


  const isOwner = role === 'OWNER'

  /* ---------- derived data ---------- */
  // listTasks(projectId) already returns only THIS project's tasks (server filters by ?projectId),
  // and TaskResponseDTO has no projectId field, so we use the list as-is (no client-side re-filter).
  // Same reasoning for sprints/features: their response DTOs don't carry a projectId field either,
  // and GET /projects/{projectId}/sprints|feature already scopes the list server-side.
  const projectTasks = tasks
  const projectSprints = sprints
  const projectFeatures = features
  const activeSprint = projectSprints.find((s) => s.sprintStatus === 'ACTIVE') || null
  const sprintTasks = activeSprint ? projectTasks.filter((t) => t.sprintId === activeSprint.id) : []
  const backlogTasks = projectTasks.filter((t) => !t.sprintId) // sprint_id null = backlog
  // My Board (no project): the list is ALREADY only my tasks (GET /task/assigned filters by me),
  // so no client-side assignee filter is needed — just show what came back.
  const myTasks = tasks
  // Delete control: owner-gated on a project board; on My Board (personal) you always manage your own.
  const cardTemplate = makeCardTemplate(features, projectId ? isOwner : true)

  /* ---------- click vs drag on the Kanban ---------- */
  const onPointerDownCapture = (e) => { down.current = { x: e.clientX, y: e.clientY } }
  const onClickCapture = (e) => {
    const moved = Math.abs(e.clientX - down.current.x) > 6 || Math.abs(e.clientY - down.current.y) > 6
    if (moved) return
    // Delete control sits INSIDE the card — check it first so we delete instead of navigating.
    const del = e.target.closest('[data-deletetask]')
    if (del) {
      e.stopPropagation()
      onDeleteTask(del.getAttribute('data-deletetask'))
      return
    }
    const el = e.target.closest('[data-taskid]')
    if (el) navigate(`/task/${el.getAttribute('data-taskid')}`)
  }
  const onDragStop = async (args) => {
    // Syncfusion moved the card in the UI already; we just persist the new column.
    // With keyField="taskStatus", the dropped card's taskStatus IS the new status.
    const card = args.data && args.data[0]
    if (!card) return
    const ok = await changeStatus(card.id, card.taskStatus)  // PATCH /task/{id}/status
    if (ok) toast.success('Status updated')
    else await loadTasks()   // server said no (e.g. 422) -> reload = card snaps back
  }

  /* ---------- task mutations (backend EXISTS -> real API + refetch) ---------- */
  const onCreate = async (values) => {
    // TaskRequestDTO wants: title, description, taskPriority, taskType, dueDate, projectID (capital ID).
    // New tasks land in the BACKLOG (no sprint) — the owner pulls them into a sprint later.
    const payload = {
      title: values.title,
      description: values.description,
      taskPriority: values.taskPriority,
      taskType: values.taskType,
      dueDate: values.dueDate || null,
      projectID: Number(projectId),   // route param is a string; backend field is a Long
    }
    const res = await createTask(payload)   // POST /task
    if (res) {
      toast.success('Task created')
      await loadTasks()   // refetch so the new task shows up (server is source of truth)
    }
    setFormOpen(false)
  }

  // Delete a task from a Kanban card (DELETE /task/{id}) — server cascades assignees + comments.
  // taskId arrives as a string from the card's data attribute; the URL is fine with that.
  const onDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task? This cannot be undone.')) return
    const ok = await deleteTask(taskId)
    if (ok) {
      toast.success('Task deleted')
      await loadTasks()   // refetch so the removed card disappears
    }
  }

  const openNewSprintForm = () => { setEditingSprint(null); setSprintFormOpen(true) }
  const openEditSprintForm = (sprint) => { setEditingSprint(sprint); setSprintFormOpen(true) }
  const closeSprintForm = () => { setSprintFormOpen(false); setEditingSprint(null) }

  // Same modal handles create + edit — dispatch based on whether we're editing.
  // Backend only allows the edit while the sprint is PLANNED (InvalidSprintUpdationException otherwise).
  const onSubmitSprintForm = async (values) => {
    setCreatingSprint(true)
    const ok = editingSprint
      ? await updateSprint(editingSprint.id, values)
      : await createSprint({ ...values, projectId: Number(projectId) })
    setCreatingSprint(false)
    if (ok) {
      closeSprintForm()
      await loadSprints()
    }
  }

  const startSprint = async (sprintId) => {
    setSprintActionId(sprintId)
    const ok = await updateSprintStatus(sprintId, 'ACTIVE')
    setSprintActionId(null)
    if (ok) await loadSprints()
  }
  const completeSprint = async (sprintId) => {
    setSprintActionId(sprintId)
    const ok = await updateSprintStatus(sprintId, 'COMPLETED')
    setSprintActionId(null)
    if (ok) {
      // Backend rolls the sprint's unfinished tasks back to the backlog on completion,
      // so refetch tasks too (not just sprints) to reflect that on the board.
      await Promise.all([loadSprints(), loadTasks()])
    }
  }
  // Fetch BEFORE opening the dialog — Syncfusion's Dialog portals to document.body on mount,
  // and swapping the dialog's content shape (loading -> loaded) after that already-happened
  // portal causes a React/Syncfusion DOM conflict (Uncaught NotFoundError: removeChild).
  const onViewSprintDetails = async (sprintId) => {
    setViewingSprintId(sprintId)
    const data = await getSprintDetails(sprintId)
    setViewingSprintId(null)
    if (data) {
      setSprintDetails(data)
      setSprintDetailsOpen(true)
    }
  }
  // Backend enforces the delete rule (PLANNED only); the button is disabled client-side to match.
  const onDeleteSprint = async (sprint) => {
    if (!window.confirm(`Delete sprint "${sprint.name}"? This cannot be undone.`)) return
    setSprintActionId(sprint.id)
    const ok = await deleteSprint(sprint.id)
    setSprintActionId(null)
    if (ok) await loadSprints()
  }
  // Pull a backlog task into a sprint (PATCH /task/{id}/sprint) then refetch so it leaves the backlog.
  const pullIntoSprint = async (taskId, sprintId) => {
    const ok = await setTaskSprint(taskId, sprintId)
    if (ok) {
      toast.success('Task added to sprint')
      await loadTasks()
    }
  }

  // Attach a backlog task to a feature (PATCH /task/{id}/feature) then refetch so the badge shows.
  const attachToFeature = async (taskId, featureId) => {
    const ok = await setTaskFeature(taskId, featureId)
    if (ok) {
      toast.success('Task added to feature')
      await loadTasks()
    }
  }

  const onCreateFeature = async (values) => {
    setCreatingFeature(true)
    const ok = await createFeature({ ...values, projectId: Number(projectId) })
    setCreatingFeature(false)
    if (ok) {
      setFeatureFormOpen(false)
      await loadFeatures()
    }
  }
  const advanceFeature = async (featureId, status) => {
    setFeatureActionId(featureId)
    const ok = await updateFeatureStatus(featureId, status)
    setFeatureActionId(null)
    if (ok) await loadFeatures()
  }
  // Same fetch-before-open pattern as onViewSprintDetails (see its comment for why).
  const onViewFeatureDetails = async (featureId) => {
    setViewingFeatureId(featureId)
    const data = await getFeatureDetails(featureId)
    setViewingFeatureId(null)
    if (data) {
      setFeatureDetails(data)
      setFeatureDetailsOpen(true)
    }
  }
  // Backend enforces the delete rule (PLANNED only); the button is disabled client-side to match.
  const onDeleteFeature = async (feature) => {
    if (!window.confirm(`Delete feature "${feature.name}"? This cannot be undone.`)) return
    setFeatureActionId(feature.id)
    const ok = await deleteFeature(feature.id)
    setFeatureActionId(null)
    if (ok) await loadFeatures()
  }

  const pullableSprints = projectSprints.filter((s) => s.sprintStatus !== 'COMPLETED').map((s) => ({ value: s.id, text: s.name }))
  // Features to attach a backlog task to (DONE features are closed — don't offer them).
  const attachableFeatures = projectFeatures.filter((f) => f.featureStatus !== 'DONE').map((f) => ({ value: f.id, text: f.name }))

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
              <KanbanComponent id="my-board" keyField="taskStatus" dataSource={myTasks} cardSettings={{ headerField: 'id', template: cardTemplate }} dragStop={onDragStop}>
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
              <p className="muted" style={{ fontSize: 13 }}>Sprint board, backlog, sprints and features. Owner grooms the backlog and runs sprints; members work the active sprint.</p>
            </div>
            {/* DEMO role toggle — WIRE: real role from workspace_user.role */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="muted" style={{ fontSize: 12 }}>View as (demo):</span>
              <ButtonComponent cssClass={isOwner ? 'e-primary' : 'e-outline'} onClick={() => setRole('OWNER')}>Owner</ButtonComponent>
              <ButtonComponent cssClass={!isOwner ? 'e-primary' : 'e-outline'} onClick={() => setRole('MEMBER')}>Member</ButtonComponent>
            </div>
          </div>

          {/* tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
            {tabBtn('sprint', 'Sprint Board')}
            {tabBtn('backlog', `Backlog (${backlogTasks.length})`)}
            {tabBtn('sprints', `Sprints (${projectSprints.length})`)}
            {tabBtn('features', `Features (${projectFeatures.length})`)}
          </div>

          {/* ---------------- SPRINT BOARD ---------------- */}
          {tab === 'sprint' && (
            <>
              {activeSprint ? (
                <div className="card" style={{ padding: '14px 18px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <strong style={{ fontSize: 16 }}>{activeSprint.name}</strong>
                      {sprintPill(activeSprint.sprintStatus)}
                    </div>
                    <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                      {activeSprint.startDate && activeSprint.endDate ? `${activeSprint.startDate} → ${activeSprint.endDate} · ` : ''}{activeSprint.goal}
                    </div>
                  </div>
                  {/* owner-only sprint control */}
                  {isOwner && (
                    <ButtonComponent cssClass="e-outline" disabled={sprintActionId === activeSprint.id} onClick={() => completeSprint(activeSprint.id)}>
                      {sprintActionId === activeSprint.id ? 'Completing…' : 'Complete Sprint'}
                    </ButtonComponent>
                  )}
                </div>
              ) : (
                <div className="card" style={{ padding: 32, textAlign: 'center', marginBottom: 16, border: '2px dashed var(--border)', boxShadow: 'none' }}>
                  <h6 style={{ fontSize: 16, marginBottom: 6 }}>No active sprint</h6>
                  <p className="muted" style={{ marginBottom: isOwner ? 12 : 0 }}>
                    {isOwner ? 'Create a sprint and start it from the Sprints tab.' : 'The owner hasn’t started a sprint yet.'}
                  </p>
                  {isOwner && <ButtonComponent cssClass="e-primary" onClick={() => setTab('sprints')}>Go to Sprints →</ButtonComponent>}
                </div>
              )}

              {activeSprint && (
                <div onPointerDownCapture={onPointerDownCapture} onClickCapture={onClickCapture}>
                  <KanbanComponent id="task-board" keyField="taskStatus" dataSource={sprintTasks} cardSettings={{ headerField: 'id', template: cardTemplate }} dragStop={onDragStop}>
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

          {/* ---------------- BACKLOG (unscheduled tasks only) ---------------- */}
          {tab === 'backlog' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h6 style={{ fontSize: 16 }}>Backlog <span className="muted" style={{ fontWeight: 400, fontSize: 13 }}>· unscheduled tasks</span></h6>
                {/* owner adds tasks to the backlog */}
                {isOwner && <ButtonComponent cssClass="e-primary" onClick={() => setFormOpen(true)}>+ New Task</ButtonComponent>}
              </div>

              {backlogTasks.length === 0 ? (
                <p className="muted" style={{ padding: '24px 0', textAlign: 'center' }}>Backlog is empty.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {backlogTasks.map((t) => (
                    <div key={t.id} className="card" style={{ padding: 12, boxShadow: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => navigate(`/task/${t.id}`)}>
                        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{t.title}</div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {badge(t.taskType, TYPE_COLOR[t.taskType] || '#64748b')}
                          {badge(t.taskPriority, PRIORITY_COLOR[t.taskPriority] || '#64748b')}
                          {t.featureId && badge(features.find((f) => f.id === t.featureId)?.name, FEATURE_COLOR)}
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
                      {/* owner attaches a backlog task to a feature */}
                      {isOwner && attachableFeatures.length > 0 && (
                        <div style={{ width: 180 }}>
                          <DropDownListComponent
                            dataSource={attachableFeatures}
                            fields={{ text: 'text', value: 'value' }}
                            placeholder={t.featureId ? 'Change feature…' : 'Add to feature…'}
                            value={t.featureId ?? null}
                            change={(e) => e.value && e.value !== t.featureId && attachToFeature(t.id, e.value)}
                          />
                        </div>
                      )}
                      {/* owner deletes a backlog task (these are plain cards, not Kanban -> real onClick) */}
                      {isOwner && (
                        <ButtonComponent
                          cssClass="e-flat tc-delete-btn"
                          title="Delete task"
                          onClick={() => onDeleteTask(t.id)}
                        >
                          🗑
                        </ButtonComponent>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ---------------- SPRINTS (grouped by status, each group expandable) ---------------- */}
          {tab === 'sprints' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h6 style={{ fontSize: 16 }}>Sprints</h6>
                {isOwner && <ButtonComponent cssClass="e-primary" onClick={openNewSprintForm}>+ New Sprint</ButtonComponent>}
              </div>

              {projectSprints.length === 0 ? (
                <p className="muted" style={{ fontSize: 13 }}>No sprints yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {SPRINT_STATUS_ORDER.map((status) => {
                    const group = projectSprints.filter((s) => s.sprintStatus === status)
                    const isOpen = openSprintGroups[status]
                    return (
                      <div key={status} className="card" style={{ boxShadow: 'none', overflow: 'hidden' }}>
                        <div
                          onClick={() => toggleSprintGroup(status)}
                          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', cursor: 'pointer' }}
                        >
                          {sprintPill(status)}
                          <strong style={{ fontSize: 13.5 }}>{group.length} sprint{group.length !== 1 ? 's' : ''}</strong>
                          <span style={{ flex: 1 }} />
                          <span className="muted" style={{ fontSize: 12 }}>{isOpen ? '▲ Collapse' : '▼ Expand'}</span>
                        </div>
                        {isOpen && (
                          <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--border)' }}>
                            {group.length === 0 ? (
                              <p className="muted" style={{ fontSize: 13, padding: '16px 0 0' }}>No {status.toLowerCase()} sprints.</p>
                            ) : (
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12, marginTop: 16 }}>
                                {group.map((s) => {
                                  const count = projectTasks.filter((t) => t.sprintId === s.id).length
                                  const busy = sprintActionId === s.id
                                  return (
                                    <div key={s.id} className="card" style={{ padding: 12, boxShadow: 'none' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                        <strong style={{ fontSize: 13.5, flex: 1 }}>{s.name}</strong>
                                        {sprintPill(s.sprintStatus)}
                                      </div>
                                      <div className="muted" style={{ fontSize: 12, marginBottom: 10 }}>{count} task{count !== 1 ? 's' : ''}{s.goal ? ` · ${s.goal}` : ''}</div>
                                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        {/* available to everyone — read-only, backed by GET /sprints/{sprintId} */}
                                        <ButtonComponent
                                          type="button"
                                          cssClass="e-outline"
                                          disabled={viewingSprintId === s.id}
                                          onClick={() => onViewSprintDetails(s.id)}
                                        >
                                          {viewingSprintId === s.id ? 'Loading…' : 'Details'}
                                        </ButtonComponent>
                                        {/* owner-only lifecycle controls, conditional on status */}
                                        {isOwner && s.sprintStatus === 'PLANNED' && (
                                          <>
                                            <ButtonComponent cssClass="e-primary" disabled={busy} onClick={() => startSprint(s.id)}>
                                              {busy ? 'Starting…' : 'Start Sprint'}
                                            </ButtonComponent>
                                            <ButtonComponent cssClass="e-outline" disabled={busy} onClick={() => openEditSprintForm(s)}>Edit</ButtonComponent>
                                          </>
                                        )}
                                        {isOwner && s.sprintStatus === 'ACTIVE' && (
                                          <ButtonComponent cssClass="e-outline" disabled={busy} onClick={() => completeSprint(s.id)}>
                                            {busy ? 'Completing…' : 'Complete Sprint'}
                                          </ButtonComponent>
                                        )}
                                        {isOwner && (
                                          <ButtonComponent
                                            cssClass="e-flat tc-delete-btn"
                                            disabled={busy || s.sprintStatus !== 'PLANNED'}
                                            title={s.sprintStatus !== 'PLANNED' ? `${s.sprintStatus === 'ACTIVE' ? 'Active' : 'Completed'} sprints cannot be deleted` : undefined}
                                            onClick={() => onDeleteSprint(s)}
                                          >
                                            {busy ? 'Working…' : 'Delete'}
                                          </ButtonComponent>
                                        )}
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* ---------------- FEATURES (grouped by status, each group expandable) ---------------- */}
          {tab === 'features' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h6 style={{ fontSize: 16 }}>Features</h6>
                {isOwner && <ButtonComponent cssClass="e-primary" onClick={() => setFeatureFormOpen(true)}>+ New Feature</ButtonComponent>}
              </div>
              {projectFeatures.length === 0 ? (
                <p className="muted" style={{ fontSize: 13 }}>No features yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {FEATURE_STATUS_ORDER.map((status) => {
                    const group = projectFeatures.filter((f) => f.featureStatus === status)
                    const isOpen = openFeatureGroups[status]
                    return (
                      <div key={status} className="card" style={{ boxShadow: 'none', overflow: 'hidden' }}>
                        <div
                          onClick={() => toggleFeatureGroup(status)}
                          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', cursor: 'pointer' }}
                        >
                          {featurePill(status)}
                          <strong style={{ fontSize: 13.5 }}>{group.length} feature{group.length !== 1 ? 's' : ''}</strong>
                          <span style={{ flex: 1 }} />
                          <span className="muted" style={{ fontSize: 12 }}>{isOpen ? '▲ Collapse' : '▼ Expand'}</span>
                        </div>
                        {isOpen && (
                          <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--border)' }}>
                            {group.length === 0 ? (
                              <p className="muted" style={{ fontSize: 13, padding: '16px 0 0' }}>No {status.toLowerCase().replace('_', ' ')} features.</p>
                            ) : (
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12, marginTop: 16 }}>
                                {group.map((f) => {
                                  const count = projectTasks.filter((t) => t.featureId === f.id).length
                                  const busy = featureActionId === f.id
                                  return (
                                    <div key={f.id} className="card" style={{ padding: 12, boxShadow: 'none' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                        <strong style={{ fontSize: 13.5, flex: 1 }}>{f.name}</strong>
                                        {featurePill(f.featureStatus)}
                                      </div>
                                      <div className="muted" style={{ fontSize: 12, marginBottom: 10 }}>{count} task{count !== 1 ? 's' : ''}{f.dueDate ? ` · due ${f.dueDate}` : ''}</div>
                                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        {/* available to everyone — read-only, backed by GET /feature/{featureId} */}
                                        <ButtonComponent
                                          type="button"
                                          cssClass="e-outline"
                                          disabled={viewingFeatureId === f.id}
                                          onClick={() => onViewFeatureDetails(f.id)}
                                        >
                                          {viewingFeatureId === f.id ? 'Loading…' : 'Details'}
                                        </ButtonComponent>
                                        {/* owner-only lifecycle controls, conditional on status */}
                                        {isOwner && f.featureStatus === 'PLANNED' && (
                                          <ButtonComponent cssClass="e-primary" disabled={busy} onClick={() => advanceFeature(f.id, 'IN_PROGRESS')}>
                                            {busy ? 'Starting…' : 'Start'}
                                          </ButtonComponent>
                                        )}
                                        {isOwner && f.featureStatus === 'IN_PROGRESS' && (
                                          <ButtonComponent cssClass="e-outline" disabled={busy} onClick={() => advanceFeature(f.id, 'DONE')}>
                                            {busy ? 'Updating…' : 'Mark Done'}
                                          </ButtonComponent>
                                        )}
                                        {isOwner && (
                                          <ButtonComponent
                                            cssClass="e-flat tc-delete-btn"
                                            disabled={busy || f.featureStatus !== 'PLANNED'}
                                            title={f.featureStatus !== 'PLANNED' ? `${f.featureStatus === 'IN_PROGRESS' ? 'In-progress' : 'Done'} features cannot be deleted` : undefined}
                                            onClick={() => onDeleteFeature(f)}
                                          >
                                            {busy ? 'Working…' : 'Delete'}
                                          </ButtonComponent>
                                        )}
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* dialogs */}
      <TaskForm open={formOpen} onClose={() => setFormOpen(false)} onSubmit={onCreate} sprints={sprints} features={features} />
      <SprintForm open={sprintFormOpen} onClose={closeSprintForm} onSubmit={onSubmitSprintForm} submitting={creatingSprint} sprint={editingSprint} />
      <SprintDetailsModal open={sprintDetailsOpen} onClose={() => setSprintDetailsOpen(false)} sprint={sprintDetails} />
      <FeatureForm open={featureFormOpen} onClose={() => setFeatureFormOpen(false)} onSubmit={onCreateFeature} submitting={creatingFeature} />
      <FeatureDetailsModal open={featureDetailsOpen} onClose={() => setFeatureDetailsOpen(false)} feature={featureDetails} />
    </div>
  )
}

export default Board
