import { useState, useEffect, useRef } from 'react'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import Modal from './Modal'

const dateStyle = { width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 6, font: 'inherit', color: 'var(--text)', background: 'var(--surface)' }

/**
 * Create a feature (an epic that groups tasks). New features start in PLANNED.
 * Due date is required and must be in the future (backend: @NotNull @Future).
 * Presentational: collects fields and calls onSubmit(values).
 *
 * The due-date input is intentionally UNCONTROLLED (read via a ref at submit time) rather
 * than driven by React state — this rules out any stale-state/closure issue entirely; the
 * value read at submit is always exactly what's in the native input at that instant.
 */
function FeatureForm({ open, onClose, onSubmit, submitting = false }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const dueDateRef = useRef(null)

  useEffect(() => {
    if (!open) return
    setName('')
    setError('')
    if (dueDateRef.current) dueDateRef.current.value = ''
  }, [open])

  const submit = () => {
    if (!name.trim()) { setError('Feature name is required'); return }
    const dueDate = dueDateRef.current ? dueDateRef.current.value : ''
    if (!dueDate) { setError('Due date is required'); return }
    // Plain string compare (both are YYYY-MM-DD) — avoids new Date() parsing the value as UTC
    // and shifting it a day off from the browser's local "today" in negative-offset timezones.
    const now = new Date()
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    if (dueDate <= todayStr) { setError('Due date must be in the future'); return }
    onSubmit({ name: name.trim(), dueDate })
  }

  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Feature"
      footer={
        <>
          <ButtonComponent type="button" cssClass="e-flat" onClick={onClose} disabled={submitting}>Cancel</ButtonComponent>
          <ButtonComponent type="button" cssClass="e-primary" onClick={submit} disabled={submitting}>
            {submitting ? 'Creating…' : 'Create Feature'}
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
          <TextBoxComponent placeholder="e.g., Notifications" value={name} input={(e) => { setError(''); setName(e.value) }} enabled={!submitting} />
        </label>
        <label>
          <span style={labelStyle}>Due date</span>
          <input ref={dueDateRef} type="date" defaultValue="" onChange={() => setError('')} style={dateStyle} disabled={submitting} />
        </label>
      </div>
    </Modal>
  )
}

export default FeatureForm
