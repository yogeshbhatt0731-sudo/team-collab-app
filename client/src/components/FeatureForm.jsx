import { useState, useEffect } from 'react'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import Modal from './Modal'

const EMPTY = { name: '', dueDate: '' }
const dateStyle = { width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 6, font: 'inherit', color: 'var(--text)', background: 'var(--surface)' }

/**
 * Create a feature (an epic that groups tasks). New features start in PLANNED.
 * Presentational: collects fields and calls onSubmit(values).
 *   WIRE: createFeature({ ...values, projectId }) -> refetch.
 */
function FeatureForm({ open, onClose, onSubmit }) {
  const [values, setValues] = useState(EMPTY)
  const [error, setError] = useState('')

  useEffect(() => { if (open) { setValues(EMPTY); setError('') } }, [open])

  const set = (k, v) => setValues((prev) => ({ ...prev, [k]: v }))

  const submit = () => {
    if (!values.name.trim()) { setError('Feature name is required'); return }
    onSubmit({ name: values.name.trim(), dueDate: values.dueDate || null })
  }

  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Feature"
      footer={
        <>
          <ButtonComponent cssClass="e-flat" onClick={onClose}>Cancel</ButtonComponent>
          <ButtonComponent cssClass="e-primary" onClick={submit}>Create Feature</ButtonComponent>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {error && (
          <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(220,38,38,0.1)', color: 'var(--danger)', fontWeight: 600 }}>{error}</div>
        )}
        <label>
          <span style={labelStyle}>Name</span>
          <TextBoxComponent placeholder="e.g., Notifications" value={values.name} input={(e) => set('name', e.value)} />
        </label>
        <label>
          <span style={labelStyle}>Due date (optional)</span>
          <input type="date" value={values.dueDate} onChange={(e) => set('dueDate', e.target.value)} style={dateStyle} />
        </label>
      </div>
    </Modal>
  )
}

export default FeatureForm
