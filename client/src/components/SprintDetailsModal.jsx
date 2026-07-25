import Modal from './Modal'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'

const STATUS_COLOR = { PLANNED: '#64748b', ACTIVE: '#16a34a', COMPLETED: '#4f46e5' }

const rowStyle = { display: 'flex', justifyContent: 'space-between', gap: 16, padding: '10px 0', borderBottom: '1px solid var(--border)' }
const labelStyle = { color: 'var(--muted)', fontSize: 13 }
const valueStyle = { fontSize: 13.5, fontWeight: 600, textAlign: 'right' }

/**
 * Read-only view of a single sprint, backed by GET /sprints/{sprintId}.
 * The page fetches `sprint` (SprintResponseDTO) BEFORE setting `open` true — the content
 * shape must not change after the dialog mounts, or Syncfusion's Dialog (which portals to
 * document.body) and React's reconciler fight over the DOM (Uncaught NotFoundError: removeChild).
 */
function SprintDetailsModal({ open, onClose, sprint }) {
  if (!sprint) return null
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Sprint Details"
      footer={<ButtonComponent type="button" cssClass="e-flat" onClick={onClose}>Close</ButtonComponent>}
    >
      <div>
        <div style={rowStyle}>
          <span style={labelStyle}>Name</span>
          <span style={valueStyle}>{sprint.name}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Status</span>
          <span
            className="chip"
            style={{ background: `${STATUS_COLOR[sprint.sprintStatus] || '#64748b'}1a`, color: STATUS_COLOR[sprint.sprintStatus] || '#64748b', fontWeight: 700, fontSize: 11 }}
          >
            {sprint.sprintStatus}
          </span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Goal</span>
          <span style={valueStyle}>{sprint.goal || '—'}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Start date</span>
          <span style={valueStyle}>{sprint.startDate || '—'}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>End date</span>
          <span style={valueStyle}>{sprint.endDate || '—'}</span>
        </div>
        <div style={{ ...rowStyle, borderBottom: 'none' }}>
          <span style={labelStyle}>Created by</span>
          <span style={valueStyle}>User #{sprint.createdBy}</span>
        </div>
      </div>
    </Modal>
  )
}

export default SprintDetailsModal
