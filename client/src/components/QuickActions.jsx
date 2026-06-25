import { Box, Button, Grid, Paper, Stack, Typography } from '@mui/material'

const actions = [
  {
    title: 'Create New Workspace',
    symbol: '+',
    button: 'Create Workspace',
  },
  {
    title: 'Join Existing Workspace',
    symbol: 'Link',
    button: 'Join Workspace',
  },
]

function QuickActions() {
  return (
    <Grid container spacing={2.5}>
      {actions.map((action) => (
        <Grid key={action.title} size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              minHeight: 174,
              p: 3,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 18px 40px rgba(15, 23, 42, 0.06)',
            }}
          >
            <Stack
              spacing={2.25}
              sx={{
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2,
                  display: 'grid',
                  placeItems: 'center',
                  color: 'primary.main',
                  bgcolor: 'primary.light',
                  fontWeight: 800,
                  fontSize: action.symbol === '+' ? 26 : 13,
                }}
              >
                {action.symbol}
              </Box>
              <Typography variant="h6" sx={{ fontSize: 18 }}>
                {action.title}
              </Typography>
              <Button variant="contained">{action.button}</Button>
            </Stack>
          </Paper>
        </Grid>
      ))}
    </Grid>
  )
}

export default QuickActions
