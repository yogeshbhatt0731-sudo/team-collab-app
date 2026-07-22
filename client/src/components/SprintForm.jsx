import { useState, useEffect } from 'react'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import Modal from './Modal'

const EMPTY = { name: '', goal: '', startDate: '', endDate: '' }
const dateStyle = { width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 6, font: 'inherit', color: 'var(--text)', background: 'var(--surface)' }

/**
 * Create a sprint. New sprints start in PLANNED (the owner starts/completes them later).
 * Presentational: collects fields and calls onSubmit(values). The page decides what to do.
 *   WIRE: createSprint({ ...values, projectId }) -> refetch.
 */
function SprintForm({ open, onClose, onSubmit }) {
  const [values, setValues] = useState(EMPTY)
  const [error, setError] = useState('')

  useEffect(() => { if (open) { setValues(EMPTY); setError('') } }, [open])

  const set = (k, v) => setValues((prev) => ({ ...prev, [k]: v }))

  const submit = () => {
    if (!values.name.trim()) { setError('Sprint name is required'); return }
    onSubmit({
      name: values.name.trim(),
      goal: values.goal.trim(),
      startDate: values.startDate || null,
      endDate: values.endDate || null,
    })
  }

  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Sprint"
      footer={
        <>
          <ButtonComponent cssClass="e-flat" onClick={onClose}>Cancel</ButtonComponent>
          <ButtonComponent cssClass="e-primary" onClick={submit}>Create Sprint</ButtonComponent>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {error && (
          <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(220,38,38,0.1)', color: 'var(--danger)', fontWeight: 600 }}>{error}</div>
        )}
        <label>
          <span style={labelStyle}>Name</span>
          <TextBoxComponent placeholder="e.g., Sprint 6 — Polish" value={values.name} input={(e) => set('name', e.value)} />
        </label>
        <label>
          <span style={labelStyle}>Goal (optional)</span>
          <TextBoxComponent multiline={true} placeholder="What should this sprint achieve?" value={values.goal} input={(e) => set('goal', e.value)} />
        </label>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <label style={{ flex: 1, minWidth: 140 }}>
            <span style={labelStyle}>Start date</span>
            <input type="date" value={values.startDate} onChange={(e) => set('startDate', e.target.value)} style={dateStyle} />
          </label>
          <label style={{ flex: 1, minWidth: 140 }}>
            <span style={labelStyle}>End date</span>
            <input type="date" value={values.endDate} onChange={(e) => set('endDate', e.target.value)} style={dateStyle} />
          </label>
        </div>
      </div>
    </Modal>
  )
}

export default SprintForm
