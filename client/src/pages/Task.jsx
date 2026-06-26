import { Box, Container, Paper, Typography, Button, TextField, Stack, Chip, Avatar, Card, CardContent, Divider, CircularProgress, Grid, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { getTaskById, getCommentsByTask, getTaskAssignees, getUserById, mockComments, mockTasks } from '../data/mockData'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

function Task() {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const [comments, setComments] = useState(getCommentsByTask(taskId))
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editingContent, setEditingContent] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedCommentId, setSelectedCommentId] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const task = getTaskById(taskId)
  const assignees = getTaskAssignees(taskId)
  const creator = task ? getUserById(task.createdBy) : null

  if (!task) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4">Task not found</Typography>
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

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    setIsSubmitting(true)

    try {
      const comment = {
        id: `com_${Date.now()}`,
        taskId: taskId,
        userId: 'usr_001',
        content: newComment,
        createdAt: new Date().toISOString(),
      }

      mockComments.push(comment)
      setComments([...comments, comment])
      setNewComment('')
    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditComment = (commentId, content) => {
    setEditingCommentId(commentId)
    setEditingContent(content)
  }

  const handleSaveEdit = (commentId) => {
    const commentIndex = mockComments.findIndex((c) => c.id === commentId)
    if (commentIndex !== -1) {
      mockComments[commentIndex].content = editingContent
      setComments(comments.map((c) => (c.id === commentId ? { ...c, content: editingContent } : c)))
    }
    setEditingCommentId(null)
    setEditingContent('')
  }

  const handleDeleteComment = (commentId) => {
    const commentIndex = mockComments.findIndex((c) => c.id === commentId)
    if (commentIndex !== -1) {
      mockComments.splice(commentIndex, 1)
      setComments(comments.filter((c) => c.id !== commentId))
    }
    setAnchorEl(null)
    setSelectedCommentId(null)
    setDeleteDialogOpen(false)
  }

  const handleCommentMenuOpen = (e, commentId) => {
    e.stopPropagation()
    setAnchorEl(e.currentTarget)
    setSelectedCommentId(commentId)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedCommentId(null)
  }

  const daysLeft = Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
  const isOverdue = daysLeft < 0

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Button variant="text" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
            ← Back
          </Button>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
                  {task.title}
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 2 }}>
                  Created by {creator?.name} on {new Date(task.createdAt).toLocaleDateString()}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
                  <Chip
                    label={task.status}
                    sx={{
                      bgcolor: statusColors[task.status],
                      color: 'white',
                      fontWeight: 600,
                      height: 32,
                    }}
                  />
                  <Chip
                    label={`Priority: ${task.priority}`}
                    sx={{
                      bgcolor: priorityColors[task.priority],
                      color: 'white',
                      fontWeight: 600,
                      height: 32,
                    }}
                  />
                  <Chip
                    label={`Due: ${new Date(task.dueDate).toLocaleDateString()}`}
                    variant="outlined"
                    sx={{
                      borderColor: isOverdue ? 'error.main' : 'divider',
                      color: isOverdue ? 'error.main' : 'text.primary',
                      fontWeight: 600,
                      height: 32,
                    }}
                  />
                </Box>
              </Box>

              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Description
                </Typography>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                  {task.description}
                </Typography>
              </Paper>

              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Comments ({comments.length})
                </Typography>

                <Box sx={{ mb: 4 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={isSubmitting}
                    sx={{ mb: 2 }}
                    variant="outlined"
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || isSubmitting}
                  >
                    {isSubmitting ? <CircularProgress size={24} /> : 'Post Comment'}
                  </Button>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Stack spacing={2}>
                  {comments.length > 0 ? (
                    comments.map((comment) => {
                      const commentUser = getUserById(comment.userId)
                      const isEditing = editingCommentId === comment.id

                      return (
                        <Card key={comment.id} sx={{ bgcolor: 'background.default' }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-start' }}>
                              <Avatar
                                sx={{
                                  width: 40,
                                  height: 40,
                                  bgcolor: 'primary.main',
                                  flexShrink: 0,
                                }}
                              >
                                {commentUser?.name[0] || '?'}
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                      {commentUser?.name || 'Unknown User'}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                      {new Date(comment.createdAt).toLocaleString()}
                                    </Typography>
                                  </Box>
                                  <IconButton
                                    size="small"
                                    onClick={(e) => handleCommentMenuOpen(e, comment.id)}
                                  >
                                    <MoreVertIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Box>
                            </Box>

                            {isEditing ? (
                              <Box>
                                <TextField
                                  fullWidth
                                  multiline
                                  rows={3}
                                  value={editingContent}
                                  onChange={(e) => setEditingContent(e.target.value)}
                                  sx={{ mb: 2 }}
                                />
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() => handleSaveEdit(comment.id)}
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => setEditingCommentId(null)}
                                  >
                                    Cancel
                                  </Button>
                                </Box>
                              </Box>
                            ) : (
                              <Typography sx={{ color: 'text.primary', lineHeight: 1.6 }}>
                                {comment.content}
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })
                  ) : (
                    <Typography sx={{ color: 'text.secondary', textAlign: 'center', py: 3 }}>
                      No comments yet. Be the first to comment!
                    </Typography>
                  )}
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, mb: 3, sticky: 'top', top: 20 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Task Details
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    Status
                  </Typography>
                  <Chip label={task.status} sx={{ bgcolor: statusColors[task.status], color: 'white' }} />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    Priority
                  </Typography>
                  <Chip label={task.priority} sx={{ bgcolor: priorityColors[task.priority], color: 'white' }} />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    Due Date
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </Typography>
                  {isOverdue ? (
                    <Typography variant="caption" sx={{ color: 'error.main' }}>
                      {Math.abs(daysLeft)} days overdue
                    </Typography>
                  ) : (
                    <Typography variant="caption" sx={{ color: daysLeft <= 3 ? 'warning.main' : 'text.secondary' }}>
                      {daysLeft} days remaining
                    </Typography>
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Assignees
                </Typography>
                {assignees.length > 0 ? (
                  <Stack spacing={1.5}>
                    {assignees.map((assignee) => (
                      <Box
                        key={assignee.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          p: 1,
                          bgcolor: 'background.default',
                          borderRadius: 1,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: 'primary.main',
                            fontSize: '0.875rem',
                          }}
                        >
                          {assignee.name[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {assignee.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {assignee.role}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography sx={{ color: 'text.secondary' }}>
                    No assignees yet
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            handleEditComment(selectedCommentId, comments.find((c) => c.id === selectedCommentId)?.content)
            handleMenuClose()
          }}
        >
          <EditIcon sx={{ mr: 1, fontSize: 18 }} /> Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            setDeleteDialogOpen(true)
            handleMenuClose()
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1, fontSize: 18 }} /> Delete
        </MenuItem>
      </Menu>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Comment?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this comment? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" onClick={() => handleDeleteComment(selectedCommentId)}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Task
