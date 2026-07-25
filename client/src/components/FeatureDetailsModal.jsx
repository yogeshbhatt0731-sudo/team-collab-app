import Modal from './Modal'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'

const STATUS_COLOR = { PLANNED: '#64748b', IN_PROGRESS: '#2563eb', DONE: '#16a34a' }

const rowStyle = { display: 'flex', justifyContent: 'space-between', gap: 16, padding: '10px 0', borderBottom: '1px solid var(--border)' }
const labelStyle = { color: 'var(--muted)', fontSize: 13 }
const valueStyle = { fontSize: 13.5, fontWeight: 600, textAlign: 'right' }

/**
 * Read-only view of a single feature, backed by GET /feature/{featureId}.
 * The page fetches `feature` (FeatureResponseDTO) BEFORE setting `open` true — see
 * SprintDetailsModal for why the content shape must not change after the dialog mounts.
 */
function FeatureDetailsModal({ open, onClose, feature }) {
  if (!feature) return null
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Feature Details"
      footer={<ButtonComponent type="button" cssClass="e-flat" onClick={onClose}>Close</ButtonComponent>}
    >
      <div>
        <div style={rowStyle}>
          <span style={labelStyle}>Name</span>
          <span style={valueStyle}>{feature.name}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Status</span>
          <span
            className="chip"
            style={{ background: `${STATUS_COLOR[feature.featureStatus] || '#64748b'}1a`, color: STATUS_COLOR[feature.featureStatus] || '#64748b', fontWeight: 700, fontSize: 11 }}
          >
            {feature.featureStatus}
          </span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Due date</span>
          <span style={valueStyle}>{feature.dueDate || '—'}</span>
        </div>
        <div style={{ ...rowStyle, borderBottom: 'none' }}>
          <span style={labelStyle}>Created by</span>
          <span style={valueStyle}>User #{feature.createdBy}</span>
        </div>
      </div>
    </Modal>
  )
}

export default FeatureDetailsModal
