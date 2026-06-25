import {
    Avatar,
    Box,
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    TextField,
    Typography,
    Divider,
} from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Header({ userName, onEditProfile, onLogout }) {
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleEditProfile = () => {
        handleClose()
        onEditProfile?.()
    }

    const handleSettings = () => {
        handleClose()
        navigate('/settings')
    }

    const handleLogout = () => {
        handleClose()
        onLogout?.()
    }

    const getInitials = () => {
        const names = userName?.split(' ') || []
        let initials = names[0]?.charAt(0) || ''
        if (names.length > 1) {
            initials += names[names.length - 1]?.charAt(0) || ''
        }
        return initials.toUpperCase()
    }

    return (
        <Box
            component="header"
            sx={{
                height: { xs: 'auto', md: 74 },
                bgcolor: 'background.paper',
                borderBottom: '1px solid',
                borderColor: 'divider',
                px: { xs: 2, sm: 3 },
                py: { xs: 2, md: 0 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                flexWrap: { xs: 'wrap', md: 'nowrap' },
            }}
        >
            <TextField
                placeholder="Search workspaces, projects, tasks..."
                size="small"
                sx={{
                    width: { xs: '100%', md: 520 },
                    '& .MuiOutlinedInput-root': {
                        bgcolor: '#f8fafc',
                        borderRadius: 8,
                    },
                }}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                Search
                            </InputAdornment>
                        ),
                    },
                }}
            />

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                    ml: { md: 'auto' },
                }}
            >
                <IconButton
                    onClick={handleClick}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 1.5,
                        borderRadius: 8,
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                    }}
                >
                    <Box
                        component="span"
                        sx={{
                            width: 16,
                            height: 18,
                            border: '2px solid #475569',
                            borderRadius: '10px 10px 6px 6px',
                            position: 'relative',
                            '&:after': {
                                content: '""',
                                position: 'absolute',
                                left: '50%',
                                bottom: -6,
                                width: 6,
                                height: 3,
                                borderRadius: 4,
                                bgcolor: '#475569',
                                transform: 'translateX(-50%)',
                            },
                        }}
                    />
                </IconButton>

                <IconButton
                    onClick={handleClick}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 1.5,
                        borderRadius: 8,
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        '&:hover': {
                            bgcolor: 'action.hover',
                        },
                    }}
                    aria-controls={open ? 'profile-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <Avatar
                        sx={{
                            width: 24,
                            height: 24,
                            fontSize: 12,
                            bgcolor: 'primary.main',
                        }}
                    >
                        {getInitials()}
                    </Avatar>
                </IconButton>

                <Menu
                    id="profile-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.5,
                            px: 2,
                            py: 1,
                        }}
                    >
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {userName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Manage your profile
                        </Typography>
                    </Box>

                    <Divider />

                    <MenuItem onClick={handleEditProfile}>Edit Profile</MenuItem>
                    <MenuItem onClick={handleSettings}>Settings</MenuItem>
                    <MenuItem>Help &amp; Support</MenuItem>

                    <Divider />

                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                        Logout
                    </MenuItem>
                </Menu>
            </Box>
        </Box>
    )
}

export default Header
