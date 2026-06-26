import { Alert, Box, Button, CircularProgress, Stack, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import QuickActions from '../components/QuickActions'
import Sidebar from '../components/Sidebar'
import WorkspaceDetailsPanel from '../components/WorkspaceDetailsPanel'
import WorkspaceGrid from '../components/WorkspaceGrid'
import ProfileEditModal from '../components/ProfileEditModal'
import { mockWorkspaces } from '../data/mockData'

const defaultUser = {
  id: '',
  name: 'User',
  firstName: 'User',
  lastName: '',
  email: '',
  phone: '',
  bio: '',
  department: '',
  location: '',
  role: '',
}

const ACCENT_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA15E']

function Home({ themeMode, onThemeModeChange }) {
  const navigate = useNavigate()
  const [workspaces, setWorkspaces] = useState([])
  const [currentUser, setCurrentUser] = useState(defaultUser)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [workspaceName, setWorkspaceName] = useState('')
  const [createError, setCreateError] = useState('')
  const [openProfileModal, setOpenProfileModal] = useState(false)

  const token = localStorage.getItem('clove_access_token')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    const storedUser = localStorage.getItem('current_user')
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setCurrentUser(user)
    }

    setWorkspaces(mockWorkspaces)
    setIsLoading(false)
  }, [token, navigate])

  const handleCreateWorkspace = () => {
    setCreateError('')

    if (!workspaceName.trim()) {
      setCreateError('Workspace name is required')
      return
    }

    if (workspaceName.length < 3) {
      setCreateError('Workspace name must be at least 3 characters')
      return
    }

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
    setWorkspaces([...workspaces, newWorkspace])
    
    setWorkspaceName('')
    setCreateError('')
    setOpenCreateDialog(false)
  }

  const handleEditProfile = () => {
    setOpenProfileModal(true)
  }

  const handleSaveProfile = (profileData) => {
    const updatedUser = {
      ...currentUser,
      ...profileData,
      name: `${profileData.firstName} ${profileData.lastName}`.trim(),
    }
    setCurrentUser(updatedUser)
    localStorage.setItem('current_user', JSON.stringify(updatedUser))
    setOpenProfileModal(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('clove_access_token')
    localStorage.removeItem('current_user')
    navigate('/login')
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      <Sidebar />

      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Header 
          userName={currentUser.name} 
          onEditProfile={handleEditProfile}
          onLogout={handleLogout}
        />

        <Box
          component="main"
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3 },
            display: 'flex',
            gap: 3,
            alignItems: 'flex-start',
            flexDirection: { xs: 'column', xl: 'row' },
          }}
        >
          <Stack spacing={3} sx={{ flex: 1, minWidth: 0, width: '100%' }}>
            <Box>
              <Typography variant="h4" sx={{ mb: 1 }}>
                Welcome back, {currentUser.firstName}!
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: 17 }}>
                Manage your workspaces and projects effectively.
              </Typography>
            </Box>

            {error ? (
              <Alert
                severity="error"
                action={
                  <Button color="inherit" size="small" onClick={() => window.location.reload()}>
                    Retry
                  </Button>
                }
              >
                {error}
              </Alert>
            ) : null}

            {isLoading ? (
              <Box
                sx={{
                  minHeight: 320,
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
                  <CircularProgress size={30} />
                  <Typography sx={{ color: 'text.secondary' }}>Loading workspaces...</Typography>
                </Stack>
              </Box>
            ) : (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h5" sx={{ mb: 1 }}>
                    Workspaces
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => setOpenCreateDialog(true)}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    + New Workspace
                  </Button>
                </Box>
                <QuickActions />
                <WorkspaceGrid workspaces={workspaces} />
              </>
            )}
          </Stack>

          <WorkspaceDetailsPanel
            workspace={workspaces[0] || null}
            projects={[]}
          />
        </Box>
      </Box>

      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.3rem' }}>
          Create New Workspace
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.95rem' }}>
              Create a new workspace to organize your projects and collaborate with team members.
            </Typography>

            {createError && (
              <Alert severity="error">{createError}</Alert>
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
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateWorkspace}>
            Create Workspace
          </Button>
        </DialogActions>
      </Dialog>

      <ProfileEditModal 
        open={openProfileModal}
        onClose={() => setOpenProfileModal(false)}
        user={currentUser}
        onSave={handleSaveProfile}
      />
    </Box>
  )
}

export default Home
