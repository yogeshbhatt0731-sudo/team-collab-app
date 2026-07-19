import { useState } from 'react'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { mockWorkspaces } from '../data/mockData'
import Modal from '../components/Modal'

const ACCENT_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA15E']

function CreateWorkspaceDialog({ open, onClose, onWorkspaceCreated }) {
  const [workspaceName, setWorkspaceName] = useState('')
  const [error, setError] = useState('')

  const handleCreate = () => {
    setError('')
    if (!workspaceName.trim()) {
      setError('Workspace name is required')
      return
    }
    if (workspaceName.length < 3) {
      setError('Workspace name must be at least 3 characters')
      return
    }

    const currentUser = JSON.parse(localStorage.getItem('current_user') || '{}')

    const newWorkspace = {
      id: `ws_${Date.now()}`,
      name: workspaceName,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      accent: ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)],
      role: 'OWNER',
      avatars: [currentUser.name?.charAt(0) || '?'],
      projects: 0,
      members: 1,
    }

    mockWorkspaces.push(newWorkspace)
    onWorkspaceCreated(newWorkspace)
    setWorkspaceName('')
    setError('')
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create New Workspace"
      footer={
        <>
          <ButtonComponent cssClass="e-flat" onClick={onClose}>Cancel</ButtonComponent>
          <ButtonComponent cssClass="e-primary" onClick={handleCreate}>Create Workspace</ButtonComponent>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p className="muted" style={{ fontSize: 15 }}>
          Create a new workspace to organize your projects and collaborate with team members.
        </p>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              background: 'rgba(220,38,38,0.1)',
              color: 'var(--danger)',
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}

        <label style={{ display: 'block' }}>
          <span style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Workspace Name</span>
          <TextBoxComponent
            placeholder="e.g., Q2 Development Sprint"
            value={workspaceName}
            input={(e) => setWorkspaceName(e.value)}
          />
        </label>
      </div>
    </Modal>
  )
}

export default CreateWorkspaceDialog
