import { Box, Container, Grid, Paper, Typography, Button, Card, CardContent, Chip, Stack, Avatar, IconButton, Menu, MenuItem } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { getProjectById, getUserById, getTasksByProject, getTaskAssignees } from '../data/mockData'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useState } from 'react'

function ProjectDetail() {
  const { workspaceId, projectId } = useParams()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedTaskId, setSelectedTaskId] = useState(null)

  const project = getProjectById(projectId)
  const tasks = getTasksByProject(projectId)
  const creator = project ? getUserById(project.createdBy) : null

  if (!project) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4">Project not found</Typography>
      </Container>
    )
  }

  const statusColors = {
    TODO: '#FFA500',
    IN_PROGRESS: '#2196F3',
    COMPLETED: '#4CAF50',
  }

  const priorityColors = {
    LOW: '#4CAF50',
    MEDIUM: '#FFA500',
    HIGH: '#F44336',
    CRITICAL: '#8B0000',
  }

  const handleMenuOpen = (e, taskId) => {
    e.stopPropagation()
    setAnchorEl(e.currentTarget)
    setSelectedTaskId(taskId)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedTaskId(null)
  }

  const getTaskCountByStatus = (status) => tasks.filter((t) => t.status === status).length

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Button
            variant="text"
            onClick={() => navigate(`/workspace/${workspaceId}`)}
            sx={{ mb: 2 }}
          >
            ← Back to Workspace
          </Button>
          <Typography variant="h3" sx={{ mb: 1, fontWeight: 700 }}>
            {project.name}
          </Typography>
          <Typography sx={{ color: 'text.secondary', mb: 2 }}>
            Created by {creator?.name} on{' '}
            {new Date(project.createdAt).toLocaleDateString()}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Chip
              label={`Total Tasks: ${tasks.length}`}
              variant="outlined"
            />
            <Chip
              label={`In Progress: ${getTaskCountByStatus('IN_PROGRESS')}`}
              sx={{ bgcolor: statusColors['IN_PROGRESS'], color: 'white' }}
            />
            <Chip
              label={`Completed: ${getTaskCountByStatus('COMPLETED')}`}
              sx={{ bgcolor: statusColors['COMPLETED'], color: 'white' }}
            />
          </Box>
        </Box>

        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Kanban Board
        </Typography>

        <Grid container spacing={2}>
          {['TODO', 'IN_PROGRESS', 'COMPLETED'].map((status) => (
            <Grid item xs={12} sm={6} md={4} key={status}>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  border: `3px solid ${statusColors[status]}`,
                  minHeight: 600,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: statusColors[status],
                      flex: 1,
                    }}
                  >
                    {status.replace(/_/g, ' ')}
                  </Typography>
                  <Chip
                    label={tasks.filter((t) => t.status === status).length}
                    size="small"
                    sx={{
                      bgcolor: statusColors[status],
                      color: 'white',
                      fontWeight: 700,
                    }}
                  />
                </Box>

                <Stack spacing={1.5} sx={{ height: 'calc(100% - 60px)', overflowY: 'auto' }}>
                  {tasks
                    .filter((t) => t.status === status)
                    .map((task) => {
                      const assignees = getTaskAssignees(task.id)
                      const daysLeft = Math.ceil(
                        (new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24)
                      )
                      const isOverdue = daysLeft < 0
                      const isDueSoon = daysLeft >= 0 && daysLeft <= 3

                      return (
                        <Card
                          key={task.id}
                          sx={{
                            cursor: 'pointer',
                            '&:hover': {
                              boxShadow: 4,
                              transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.2s',
                            borderLeft: `4px solid ${priorityColors[task.priority]}`,
                            backgroundColor: isOverdue ? '#ffe6e6' : isDueSoon ? '#fff3e0' : 'background.paper',
                          }}
                          onClick={() => navigate(`/task/${task.id}`)}
                        >
                          <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 }, position: 'relative' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  mb: 0.5,
                                  flex: 1,
                                  pr: 1,
                                  lineHeight: 1.3,
                                }}
                              >
                                {task.title}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={(e) => handleMenuOpen(e, task.id)}
                                sx={{ mt: -1, mr: -1 }}
                              >
                                <MoreVertIcon fontSize="small" />
                              </IconButton>
                            </Box>

                            <Typography
                              variant="caption"
                              sx={{
                                color: 'text.secondary',
                                display: 'block',
                                mb: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {task.description.substring(0, 50)}...
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
                              <Chip
                                label={task.priority}
                                size="small"
                                sx={{
                                  height: 20,
                                  bgcolor: priorityColors[task.priority],
                                  color: 'white',
                                  fontSize: '0.7rem',
                                  fontWeight: 600,
                                }}
                              />
                              {isOverdue && (
                                <Chip
                                  label="Overdue"
                                  size="small"
                                  sx={{
                                    height: 20,
                                    bgcolor: '#F44336',
                                    color: 'white',
                                    fontSize: '0.7rem',
                                  }}
                                />
                              )}
                              {isDueSoon && !isOverdue && (
                                <Chip
                                  label={`${daysLeft}d`}
                                  size="small"
                                  sx={{
                                    height: 20,
                                    bgcolor: '#FFA500',
                                    color: 'white',
                                    fontSize: '0.7rem',
                                  }}
                                />
                              )}
                            </Box>

                            {assignees.length > 0 && (
                              <Box sx={{ display: 'flex', gap: -0.5 }}>
                                {assignees.slice(0, 3).map((assignee) => (
                                  <Avatar
                                    key={assignee.id}
                                    sx={{
                                      width: 24,
                                      height: 24,
                                      bgcolor: 'primary.main',
                                      fontSize: '0.7rem',
                                      border: '2px solid white',
                                      marginLeft: '-8px',
                                      '&:first-of-type': { marginLeft: 0 },
                                    }}
                                  >
                                    {assignee.name[0]}
                                  </Avatar>
                                ))}
                                {assignees.length > 3 && (
                                  <Avatar
                                    sx={{
                                      width: 24,
                                      height: 24,
                                      bgcolor: 'grey.400',
                                      fontSize: '0.7rem',
                                      border: '2px solid white',
                                      marginLeft: '-8px',
                                    }}
                                  >
                                    +{assignees.length - 3}
                                  </Avatar>
                                )}
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}

                  {!tasks.some((t) => t.status === status) && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        textAlign: 'center',
                        py: 4,
                      }}
                    >
                      No tasks
                    </Typography>
                  )}
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
        <MenuItem onClick={handleMenuClose}>Edit Task</MenuItem>
        <MenuItem onClick={handleMenuClose}>Assign to Me</MenuItem>
        <MenuItem onClick={handleMenuClose}>Move to...</MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          Delete
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default ProjectDetail
