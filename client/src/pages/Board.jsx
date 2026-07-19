import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { KanbanComponent, ColumnsDirective, ColumnDirective } from '@syncfusion/ej2-react-kanban'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { TASKS, memberById, PRIORITY_COLOR, TYPE_COLOR, STATUS_LABEL } from '../data/taskMock'

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
  return (
    <div data-taskid={task.id} style={{ padding: 12, cursor: 'pointer' }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        {badge(task.taskType, TYPE_COLOR[task.taskType] || '#64748b')}
        {badge(task.taskPriority, PRIORITY_COLOR[task.taskPriority] || '#64748b')}
      </div>
      <div style={{ fontWeight: 600, fontSize: 13.5, lineHeight: 1.35, color: '#0f172a', marginBottom: 10 }}>
        {task.title}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex' }}>
          {assignees.slice(0, 3).map((m, i) => (
            <span
              key={m.userId}
              className="avatar"
              style={{ width: 24, height: 24, fontSize: 10, background: m.color, border: '2px solid #fff', marginLeft: i === 0 ? 0 : -8 }}
            >
              {m.initials}
            </span>
          ))}
        </div>
        <span style={{ fontSize: 11, color: '#64748b' }}>{task.commentCount} 💬</span>
      </div>
    </div>
  )
}

function Board() {
  const [tasks] = useState(TASKS) // WIRE: const { data: tasks } = useTasks()
  const navigate = useNavigate()
  const down = useRef({ x: 0, y: 0 })

  // Record where the pointer went down so we can tell a click from a drag.
  const onPointerDownCapture = (e) => { down.current = { x: e.clientX, y: e.clientY } }

  // Navigate only on a real click (little/no movement). If the pointer moved,
  // it was a drag — let Kanban's built-in drag-and-drop handle it, don't navigate.
  const onClickCapture = (e) => {
    const moved = Math.abs(e.clientX - down.current.x) > 6 || Math.abs(e.clientY - down.current.y) > 6
    if (moved) return
    const el = e.target.closest('[data-taskid]')
    if (el) navigate(`/task/${el.getAttribute('data-taskid')}`)
  }

  // Fired after a card is dropped in a (possibly new) column.
  const onDragStop = (args) => {
    const card = args.data && args.data[0]
    if (!card) return
    // card.status already reflects the target column (Kanban updated the local dataSource).
    // WIRE: await changeStatus(card.id, card.status)
    //   on HTTP 422 (illegal transition): args.cancel = true  // snap back
    //   + toast err.response.data.message
    // console.log('moved', card.id, '->', card.status)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--app-bg)', color: 'var(--text)' }}>
      <Sidebar />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Header userName="Yogesh Bhatt" />

        <main style={{ flex: 1, padding: 24, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <div className="muted" style={{ fontSize: 13 }}>
              Workspaces <span style={{ margin: '0 6px' }}>›</span> CDAC Team Collaboration <span style={{ margin: '0 6px' }}>›</span>
              <span style={{ color: 'var(--text)', fontWeight: 700 }}> Auth System</span>
            </div>
            <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#166534', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 6, padding: '2px 8px' }}>
              GET /task?project=proj_001
            </span>
          </div>

          <div style={{ marginBottom: 16 }}>
            <h4 style={{ fontSize: '1.6rem' }}>Auth System</h4>
            <p className="muted">Sprint 4 — Auth Hardening · active</p>
          </div>

          <div onPointerDownCapture={onPointerDownCapture} onClickCapture={onClickCapture}>
            <KanbanComponent
              id="task-board"
              keyField="status"
              dataSource={tasks}
              cardSettings={{ headerField: 'id', template: cardTemplate }}
              dragStop={onDragStop}
            >
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

export default Board
