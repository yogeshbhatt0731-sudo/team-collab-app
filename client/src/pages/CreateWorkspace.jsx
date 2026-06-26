import {
  Box,
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Stack,
  Alert,
} from '@mui/material'
import { useState } from 'react'
import { mockWorkspaces } from '../data/mockData'

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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: '1.3rem' }}>
        Create New Workspace
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.95rem' }}>
            Create a new workspace to organize your projects and collaborate with team members.
          </Typography>

          {error && (
            <Alert severity="error">{error}</Alert>
          )}

          <TextField
            fullWidth
            label="Workspace Name"
            placeholder="e.g., Q2 Development Sprint"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            autoFocus
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleCreate}>
          Create Workspace
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateWorkspaceDialog
