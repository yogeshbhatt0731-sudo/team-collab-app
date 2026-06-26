import { useState } from 'react'
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  AvatarGroup,
  Badge,
  Tooltip,
} from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { getWorkspaceById, getProjectsByWorkspace, getUserById, mockUsers } from '../data/mockData'
import Header from '../components/Header'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DeleteIcon from '@mui/icons-material/Delete'
import LogoutIcon from '@mui/icons-material/Logout'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'

function WorkspaceDetail() {
  const { workspaceId } = useParams()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [anchorEl, setAnchorEl] = useState(null)
  const [currentProjectId, setCurrentProjectId] = useState(null)
  const [favorites, setFavorites] = useState(new Set())
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState(null)
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false)
  const [projectToLeave, setProjectToLeave] = useState(null)

  const workspace = getWorkspaceById(workspaceId)
  const projects = getProjectsByWorkspace(workspaceId)
  const creator = workspace ? getUserById(workspace.createdBy) : null
  const currentUser = mockUsers[0]
  const isOwner = workspace?.role === 'OWNER'

  if (!workspace) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4">Workspace not found</Typography>
      </Container>
    )
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || filterStatus === project.status
    return matchesSearch && matchesFilter
  })

  const handleMenuOpen = (event, projectId) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    setCurrentProjectId(projectId)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setCurrentProjectId(null)
  }

  const handleDeleteProject = (project) => {
    setProjectToDelete(project)
    setDeleteDialogOpen(true)
    handleMenuClose()
  }

  const handleLeaveProject = (project) => {
    setProjectToLeave(project)
    setLeaveDialogOpen(true)
    handleMenuClose()
  }

  const confirmDelete = () => {
    setDeleteDialogOpen(false)
    setProjectToDelete(null)
  }

  const confirmLeave = () => {
    setLeaveDialogOpen(false)
    setProjectToLeave(null)
  }

  const toggleFavorite = (event, projectId) => {
    event.stopPropagation()
    const newFavorites = new Set(favorites)
    if (newFavorites.has(projectId)) {
      newFavorites.delete(projectId)
    } else {
      newFavorites.add(projectId)
    }
    setFavorites(newFavorites)
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header userName={currentUser?.name || 'User'} />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 2,
                bgcolor: workspace.accent || 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 32,
                fontWeight: 700,
              }}
            >
              {workspace.name.charAt(0)}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                {workspace.name}
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.95rem' }}>
                Created by {creator?.name} • {workspace.members} members • {workspace.projects}{' '}
                projects
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Tooltip title={`${workspace.members} members in this workspace`}>
                <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
                  {mockUsers.slice(0, workspace.members).map((user) => (
                    <Avatar
                      key={user.id}
                      sx={{
                        width: 32,
                        height: 32,
                        fontSize: '0.75rem',
                        bgcolor: 'primary.main',
                      }}
                    >
                      {user.name.split(' ').map((n) => n.charAt(0)).join('')}
                    </Avatar>
                  ))}
                </AvatarGroup>
              </Tooltip>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
              <Button variant="outlined" startIcon={<AddIcon />}>
                New Project
              </Button>
              <Tooltip title="Invite members">
                <Button variant="outlined">Invite</Button>
              </Tooltip>
              <Tooltip title="Settings">
                <Button variant="outlined">Settings</Button>
              </Tooltip>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}
          >
            <TextField
              placeholder="Search projects..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                width: { xs: '100%', sm: 300 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                icon={<FilterListIcon />}
                label="Filter"
                variant={filterStatus === 'all' ? 'filled' : 'outlined'}
                onClick={() => setFilterStatus('all')}
                sx={{ borderRadius: 2 }}
              />
              <Chip
                label={`Active (${filteredProjects.length})`}
                variant="outlined"
                sx={{ borderRadius: 2 }}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Projects
            <Chip
              label={filteredProjects.length}
              size="small"
              sx={{ ml: 1 }}
              variant="filled"
            />
          </Typography>

          {filteredProjects.length === 0 ? (
            <Paper
              sx={{
                p: 6,
                textAlign: 'center',
                border: '2px dashed',
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <Box sx={{ mb: 2 }}>
                <SearchIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
              </Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                No projects found
              </Typography>
              <Typography sx={{ color: 'text.secondary', mb: 2 }}>
                {searchTerm ? 'Try adjusting your search term' : 'Create a new project to get started'}
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />}>
                Create Project
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={2}>
              {filteredProjects.map((project) => (
                <Grid item xs={12} sm={6} md={4} key={project.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': {
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                        transform: 'translateY(-4px)',
                        borderColor: 'primary.main',
                      },
                    }}
                    onClick={() => navigate(`/workspace/${workspaceId}/project/${project.id}`)}
                  >
                    <Box
                      sx={{
                        height: 4,
                        bgcolor: workspace.accent || 'primary.main',
                      }}
                    />

                    <CardContent sx={{ flex: 1, pb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            flex: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {project.name}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => toggleFavorite(e, project.id)}
                          sx={{ ml: 1 }}
                        >
                          {favorites.has(project.id) ? (
                            <StarIcon sx={{ color: 'warning.main', fontSize: '1.2rem' }} />
                          ) : (
                            <StarBorderIcon sx={{ fontSize: '1.2rem' }} />
                          )}
                        </IconButton>
                      </Box>

                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          mb: 2,
                          fontSize: '0.875rem',
                        }}
                      >
                        Created on {new Date(project.createdAt).toLocaleDateString()}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        <Chip label="In Progress" size="small" color="primary" variant="outlined" />
                        <Chip label="5 Tasks" size="small" variant="outlined" />
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          p: 1,
                          bgcolor: '#f0f4f8',
                          borderRadius: 1,
                          fontSize: '0.85rem',
                        }}
                      >
                        <Badge badgeContent={3} color="primary">
                          <Avatar
                            sx={{
                              width: 24,
                              height: 24,
                              fontSize: '0.7rem',
                              bgcolor: 'primary.main',
                            }}
                          >
                            {getUserById(project.createdBy)?.name.charAt(0)}
                          </Avatar>
                        </Badge>
                        <span>Created by {getUserById(project.createdBy)?.name}</span>
                      </Box>
                    </CardContent>

                    <CardActions
                      sx={{
                        pt: 1,
                        pb: 1.5,
                        px: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Button
                        size="small"
                        variant="contained"
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                      >
                        Open
                      </Button>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, project.id)}
                        sx={{
                          color: 'text.secondary',
                          '&:hover': {
                            color: 'text.primary',
                          },
                        }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem
          onClick={() => {
            navigate(`/workspace/${workspaceId}/project/${currentProjectId}`)
            handleMenuClose()
          }}
        >
          Open Project
        </MenuItem>
        <MenuItem onClick={() => {}}>Edit Project</MenuItem>
        <MenuItem onClick={() => {}}>Duplicate</MenuItem>
        <MenuItem onClick={() => {}}>Members</MenuItem>

        {isOwner ? (
          <>
            <MenuItem
              onClick={() => {
                const project = projects.find((p) => p.id === currentProjectId)
                handleDeleteProject(project)
              }}
              sx={{ color: 'error.main' }}
            >
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
              Delete Project
            </MenuItem>
          </>
        ) : (
          <MenuItem
            onClick={() => {
              const project = projects.find((p) => p.id === currentProjectId)
              handleLeaveProject(project)
            }}
            sx={{ color: 'warning.main' }}
          >
            <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
            Leave Project
          </MenuItem>
        )}
      </Menu>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Project?</DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 2 }}>
            Are you sure you want to delete <strong>{projectToDelete?.name}</strong>? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={leaveDialogOpen} onClose={() => setLeaveDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Leave Project?</DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 2 }}>
            Are you sure you want to leave <strong>{projectToLeave?.name}</strong>? You can rejoin
            if you are invited again.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLeaveDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmLeave} variant="contained" color="warning">
            Leave
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default WorkspaceDetail
