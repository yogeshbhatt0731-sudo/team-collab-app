import { Box, Button, Paper, Stack, Typography } from '@mui/material'

function WorkspaceDetailsPanel({ workspace, projects }) {
  if (!workspace) {
    return (
      <Paper
        component="aside"
        elevation={0}
        sx={{
          width: { xs: '100%', xl: 336 },
          p: 2.5,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 18px 44px rgba(15, 23, 42, 0.06)',
        }}
      >
        <Typography variant="h6">No active workspace</Typography>
        <Typography sx={{ color: 'text.secondary', mt: 1 }}>
          Create or join a workspace to see details here.
        </Typography>
      </Paper>
    )
  }

  return (
    <Paper
      component="aside"
      elevation={0}
      sx={{
        width: { xs: '100%', xl: 336 },
        p: 2.5,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 18px 44px rgba(15, 23, 42, 0.06)',
      }}
    >
      <Stack spacing={2.5}>
        <Box>
          <Typography sx={{ color: 'text.secondary', fontSize: 13, mb: 0.75 }}>
            Active Workspace
          </Typography>
          <Typography variant="h5">{workspace.name}</Typography>
          <Typography sx={{ color: 'text.secondary', mt: 1, lineHeight: 1.6 }}>
            Owner workspace with {workspace.members} members and {workspace.projects} active
            projects.
          </Typography>
        </Box>

        <Button variant="contained" size="large">
          + Create Project
        </Button>

        <Box>
          <Typography variant="h6" sx={{ fontSize: 18, mb: 1.5 }}>
            Current Projects
          </Typography>

          {projects.length === 0 ? (
            <Box
              sx={{
                p: 1.5,
                border: '1px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: '#fbfdff',
              }}
            >
              <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                No projects available from the workspace API yet.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={1.25}>
              {projects.map((project) => (
              <Box
                key={project.name}
                sx={{
                  p: 1.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: '#fbfdff',
                }}
              >
                <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 9,
                      height: 9,
                      borderRadius: '50%',
                      bgcolor: project.color,
                    }}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700 }}>{project.name}</Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>
                      {project.status}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
              ))}
            </Stack>
          )}
        </Box>
      </Stack>
    </Paper>
  )
}

export default WorkspaceDetailsPanel
