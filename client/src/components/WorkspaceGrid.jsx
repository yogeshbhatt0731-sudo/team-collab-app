import { Avatar, AvatarGroup, Box, Button, Grid, Paper, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function WorkspaceGrid({ workspaces }) {
  const navigate = useNavigate()
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2.25 }}>
        Workspaces
      </Typography>

      {workspaces.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            border: '1px dashed',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Typography sx={{ color: 'text.secondary' }}>
            No workspaces found. Create or join a workspace to get started.
          </Typography>
        </Paper>
      ) : (
      <Grid container spacing={2.5}>
        {workspaces.map((workspace) => (
          <Grid key={workspace.id} size={{ xs: 12, lg: 4 }}>
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                p: 2.5,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 16px 34px rgba(15, 23, 42, 0.05)',
              }}
            >
              <Stack spacing={2.2} sx={{ height: '100%' }}>
                <Box>
                  <Box
                    sx={{
                      width: 38,
                      height: 5,
                      borderRadius: 4,
                      bgcolor: workspace.accent,
                      mb: 2,
                    }}
                  />
                  <Typography variant="h6" sx={{ fontSize: 18, lineHeight: 1.25 }}>
                    {workspace.name} ({workspace.role})
                  </Typography>
                </Box>

                <AvatarGroup max={4} sx={{ justifyContent: 'flex-end', flexDirection: 'row' }}>
                  {workspace.avatars.map((avatar) => (
                    <Avatar
                      key={`${workspace.id}-${avatar}`}
                      sx={{
                        width: 32,
                        height: 32,
                        fontSize: 12,
                        bgcolor: workspace.accent,
                        borderColor: 'background.paper',
                      }}
                    >
                      {avatar}
                    </Avatar>
                  ))}
                </AvatarGroup>

                <Stack direction="row" spacing={1.5}>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>Projects</Typography>
                    <Typography sx={{ fontWeight: 800, fontSize: 22 }}>{workspace.projects}</Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>Members</Typography>
                    <Typography sx={{ fontWeight: 800, fontSize: 22 }}>{workspace.members}</Typography>
                  </Box>
                </Stack>

                <Button 
                  variant="outlined" 
                  sx={{ mt: 'auto' }}
                  onClick={() => navigate(`/workspace/${workspace.id}`)}
                >
                  Go to Workspace
                </Button>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
      )}
    </Box>
  )
}

export default WorkspaceGrid
