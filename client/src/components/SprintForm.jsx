import { useState, useEffect } from 'react'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import Modal from './Modal'

const EMPTY = { name: '', goal: '' }

/**
 * One modal for BOTH create and edit.
 *   - Omit `sprint` -> "New Sprint"  (create; starts in PLANNED)
 *   - Pass `sprint`  -> "Edit Sprint" (prefilled; backend only allows this while PLANNED)
 * Start/end dates are NOT collected here — the backend stamps them automatically when the
 * sprint transitions PLANNED -> ACTIVE -> COMPLETED (see sprintService.updateSprintStatus).
 * Presentational: collects fields and calls onSubmit(values). The page decides what to do.
 */
function SprintForm({ open, onClose, onSubmit, submitting = false, sprint = null }) {
  const isEdit = Boolean(sprint)
  const [values, setValues] = useState(EMPTY)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setError('')
    setValues(sprint ? { name: sprint.name || '', goal: sprint.goal || '' } : EMPTY)
  }, [open, sprint])

  const set = (k, v) => { setError(''); setValues((prev) => ({ ...prev, [k]: v })) }

  const submit = () => {
    if (!values.name.trim()) { setError('Sprint name is required'); return }
    if (!values.goal.trim()) { setError('Sprint goal is required'); return }
    onSubmit({
      name: values.name.trim(),
      goal: values.goal.trim(),
    })
  }

  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Sprint' : 'New Sprint'}
      footer={
        <>
          <ButtonComponent cssClass="e-flat" onClick={onClose} disabled={submitting}>Cancel</ButtonComponent>
          <ButtonComponent cssClass="e-primary" onClick={submit} disabled={submitting}>
            {submitting ? (isEdit ? 'Saving…' : 'Creating…') : (isEdit ? 'Save Changes' : 'Create Sprint')}
          </ButtonComponent>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {error && (
          <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(220,38,38,0.1)', color: 'var(--danger)', fontWeight: 600 }}>{error}</div>
        )}
        <label>
          <span style={labelStyle}>Name</span>
          <TextBoxComponent placeholder="e.g., Sprint 6 — Polish" value={values.name} input={(e) => set('name', e.value)} enabled={!submitting} />
        </label>
        <label>
          <span style={labelStyle}>Goal</span>
          <TextBoxComponent multiline={true} placeholder="What should this sprint achieve?" value={values.goal} input={(e) => set('goal', e.value)} enabled={!submitting} />
        </label>
        <p className="muted" style={{ fontSize: 12, margin: 0 }}>
          Start/end dates are set automatically once you start and complete the sprint.
        </p>
      </div>
    </Modal>
  )
}

export default SprintForm
