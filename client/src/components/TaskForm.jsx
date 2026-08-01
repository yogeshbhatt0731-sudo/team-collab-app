import { useState, useEffect } from 'react'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import { DropDownListComponent, MultiSelectComponent } from '@syncfusion/ej2-react-dropdowns'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import Modal from './Modal'

// Enum values mirror the backend TaskPriority / TaskType.
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((v) => ({ value: v, text: v }))
const TYPES = ['STORY', 'TASK', 'BUG'].map((v) => ({ value: v, text: v }))

const EMPTY = { title: '', description: '', taskPriority: 'MEDIUM', taskType: 'TASK', dueDate: '', sprintId: null, featureId: null }

function TaskForm({ open, onClose, onSubmit, task, sprints = [], features = [], members = [], assigneeIds: initialAssigneeIds = [] }) {
  const isEdit = Boolean(task)
  const [values, setValues] = useState(EMPTY)
  const [error, setError] = useState('')
  const [assigneeIds, setAssigneeIds] = useState([])

  useEffect(() => {
    if (!open) return
    setError('')
    setAssigneeIds(initialAssigneeIds)
    setValues(
      task
        ? {
            title: task.title || '',
            description: task.description || '',
            taskPriority: task.taskPriority || 'MEDIUM',
            taskType: task.taskType || 'TASK',
            dueDate: task.dueDate ? String(task.dueDate).slice(0, 10) : '',
            sprintId: task.sprintId ?? null,
            featureId: task.featureId ?? null,
          }
        : EMPTY
    )
  }, [open, task]) // eslint-disable-line react-hooks/exhaustive-deps

  const set = (k, v) => setValues((prev) => ({ ...prev, [k]: v }))

  const submit = () => {
    if (!values.title.trim()) { setError('Title is required'); return }
    if (!values.description.trim()) { setError('Description is required'); return }
    onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      taskPriority: values.taskPriority,
      taskType: values.taskType,
      dueDate: values.dueDate || null,
      sprintId: values.sprintId || null,
      featureId: values.featureId || null,
      assigneeIds,
    })
  }

  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }

  // "— None —" first so a task can belong to no sprint / feature.
  const sprintOptions = [{ value: '', text: '— None —' }, ...sprints.map((s) => ({ value: s.id, text: s.name }))]
  const featureOptions = [{ value: '', text: '— None —' }, ...features.map((f) => ({ value: f.id, text: f.name }))]

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Task' : 'New Task'}
      footer={
        <>
          <ButtonComponent cssClass="e-flat" onClick={onClose}>Cancel</ButtonComponent>
          <ButtonComponent cssClass="e-primary" onClick={submit}>{isEdit ? 'Save Changes' : 'Create Task'}</ButtonComponent>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {error && (
          <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(220,38,38,0.1)', color: 'var(--danger)', fontWeight: 600 }}>
            {error}
          </div>
        )}

        <label>
          <span style={labelStyle}>Title</span>
          <TextBoxComponent placeholder="e.g., Implement password reset" value={values.title} input={(e) => set('title', e.value)} />
        </label>

        <label>
          <span style={labelStyle}>Description</span>
          <TextBoxComponent multiline={true} placeholder="What needs to be done?" value={values.description} input={(e) => set('description', e.value)} />
        </label>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <label style={{ flex: 1, minWidth: 140 }}>
            <span style={labelStyle}>Priority</span>
            <DropDownListComponent dataSource={PRIORITIES} fields={{ text: 'text', value: 'value' }} value={values.taskPriority} change={(e) => set('taskPriority', e.value)} />
          </label>
          <label style={{ flex: 1, minWidth: 140 }}>
            <span style={labelStyle}>Type</span>
            <DropDownListComponent dataSource={TYPES} fields={{ text: 'text', value: 'value' }} value={values.taskType} change={(e) => set('taskType', e.value)} />
          </label>
        </div>

        <label>
          <span style={labelStyle}>Due date (optional)</span>
          {/* native date input — the ej2 calendars package isn't installed */}
          <input
            type="date"
            value={values.dueDate}
            onChange={(e) => set('dueDate', e.target.value)}
            style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 6, font: 'inherit', color: 'var(--text)', background: 'var(--surface)' }}
          />
        </label>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <label style={{ flex: 1, minWidth: 140 }}>
            <span style={labelStyle}>Sprint (optional)</span>
            <DropDownListComponent dataSource={sprintOptions} fields={{ text: 'text', value: 'value' }} value={values.sprintId ?? ''} change={(e) => set('sprintId', e.value || null)} />
          </label>
          <label style={{ flex: 1, minWidth: 140 }}>
            <span style={labelStyle}>Feature (optional)</span>
            <DropDownListComponent dataSource={featureOptions} fields={{ text: 'text', value: 'value' }} value={values.featureId ?? ''} change={(e) => set('featureId', e.value || null)} />
          </label>
        </div>

        {members.length > 0 && (
          <label>
            <span style={labelStyle}>Assignees (optional)</span>
            <MultiSelectComponent
              dataSource={members}
              fields={{ text: 'text', value: 'value' }}
              value={assigneeIds}
              placeholder="Select assignees"
              mode="Box"
              change={(e) => setAssigneeIds(e.value || [])}
              width="100%"
            />
          </label>
        )}
      </div>
    </Modal>
  )
}

export default TaskForm
