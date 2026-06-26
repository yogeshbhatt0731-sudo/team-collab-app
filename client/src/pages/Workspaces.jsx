import {
    Alert,
    Avatar,
    AvatarGroup,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { mockWorkspaces } from "../data/mockData";

const defaultUser = {
    id: "",
    name: "User",
    firstName: "User",
    email: "",
    role: "",
};

const ACCENT_COLORS = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA15E",
];

function Workspaces() {
    const navigate = useNavigate();
    const [workspaces, setWorkspaces] = useState([]);
    const [currentUser, setCurrentUser] = useState(defaultUser);
    const [isLoading, setIsLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedWorkspace, setSelectedWorkspace] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openLeaveDialog, setOpenLeaveDialog] = useState(false);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [workspaceName, setWorkspaceName] = useState("");
    const [createError, setCreateError] = useState("");

    const token = localStorage.getItem("clove_access_token");

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        const storedUser = localStorage.getItem("current_user");
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }

        setWorkspaces(mockWorkspaces);
        setIsLoading(false);
    }, [token, navigate]);

    const handleMenuOpen = (event, workspace) => {
        setAnchorEl(event.currentTarget);
        setSelectedWorkspace(workspace);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedWorkspace(null);
    };

    const handleDeleteClick = () => {
        setOpenDeleteDialog(true);
        handleMenuClose();
    };

    const handleLeaveClick = () => {
        setOpenLeaveDialog(true);
        handleMenuClose();
    };

    const handleConfirmDelete = () => {
        if (selectedWorkspace) {
            setWorkspaces(
                workspaces.filter((ws) => ws.id !== selectedWorkspace.id),
            );
            setOpenDeleteDialog(false);
            setSelectedWorkspace(null);
        }
    };

    const handleConfirmLeave = () => {
        if (selectedWorkspace) {
            setWorkspaces(
                workspaces.filter((ws) => ws.id !== selectedWorkspace.id),
            );
            setOpenLeaveDialog(false);
            setSelectedWorkspace(null);
        }
    };

    const handleCreateWorkspace = () => {
        setCreateError("");

        if (!workspaceName.trim()) {
            setCreateError("Workspace name is required");
            return;
        }

        if (workspaceName.length < 3) {
            setCreateError("Workspace name must be at least 3 characters");
            return;
        }

        const newWorkspace = {
            id: `ws_${Date.now()}`,
            name: workspaceName,
            createdBy: currentUser.id,
            createdAt: new Date().toISOString(),
            accent: ACCENT_COLORS[
                Math.floor(Math.random() * ACCENT_COLORS.length)
            ],
            role: "OWNER",
            avatars: [currentUser.name?.charAt(0) || "?"],
            projects: 0,
            members: 1,
        };

        mockWorkspaces.push(newWorkspace);
        setWorkspaces([...workspaces, newWorkspace]);

        setWorkspaceName("");
        setCreateError("");
        setOpenCreateDialog(false);
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                bgcolor: "background.default",
                color: "text.primary",
            }}
        >
            <Sidebar />

            <Box
                sx={{
                    flex: 1,
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Header userName={currentUser.name} />

                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        p: { xs: 2, sm: 3 },
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                    }}
                >
                    {/* Header Section */}
                    <Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                gap: 2,
                            }}
                        >
                            <Box>
                                <Typography variant="h4" sx={{ mb: 1 }}>
                                    Workspaces
                                </Typography>
                                <Typography
                                    sx={{
                                        color: "text.secondary",
                                        fontSize: 16,
                                    }}
                                >
                                    Manage all your workspaces, collaborate with
                                    teams, and organize your projects
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                onClick={() => setOpenCreateDialog(true)}
                                sx={{
                                    textTransform: "none",
                                    fontWeight: 600,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                + New Workspace
                            </Button>
                        </Box>
                    </Box>

                    {/* Stats Cards */}
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Card
                                sx={{
                                    bgcolor: "background.paper",
                                    border: "1px solid",
                                    borderColor: "divider",
                                    boxShadow: "none",
                                }}
                            >
                                <CardContent>
                                    <Typography
                                        sx={{
                                            color: "text.secondary",
                                            fontSize: 13,
                                        }}
                                    >
                                        Total Workspaces
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontWeight: 800,
                                            fontSize: 32,
                                            mt: 1,
                                        }}
                                    >
                                        {workspaces.length}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Card
                                sx={{
                                    bgcolor: "background.paper",
                                    border: "1px solid",
                                    borderColor: "divider",
                                    boxShadow: "none",
                                }}
                            >
                                <CardContent>
                                    <Typography
                                        sx={{
                                            color: "text.secondary",
                                            fontSize: 13,
                                        }}
                                    >
                                        You Own
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontWeight: 800,
                                            fontSize: 32,
                                            mt: 1,
                                        }}
                                    >
                                        {
                                            workspaces.filter(
                                                (ws) => ws.role === "OWNER",
                                            ).length
                                        }
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Card
                                sx={{
                                    bgcolor: "background.paper",
                                    border: "1px solid",
                                    borderColor: "divider",
                                    boxShadow: "none",
                                }}
                            >
                                <CardContent>
                                    <Typography
                                        sx={{
                                            color: "text.secondary",
                                            fontSize: 13,
                                        }}
                                    >
                                        You're Member Of
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontWeight: 800,
                                            fontSize: 32,
                                            mt: 1,
                                        }}
                                    >
                                        {
                                            workspaces.filter(
                                                (ws) => ws.role === "MEMBER",
                                            ).length
                                        }
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Card
                                sx={{
                                    bgcolor: "background.paper",
                                    border: "1px solid",
                                    borderColor: "divider",
                                    boxShadow: "none",
                                }}
                            >
                                <CardContent>
                                    <Typography
                                        sx={{
                                            color: "text.secondary",
                                            fontSize: 13,
                                        }}
                                    >
                                        Total Members
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontWeight: 800,
                                            fontSize: 32,
                                            mt: 1,
                                        }}
                                    >
                                        {workspaces.reduce(
                                            (acc, ws) => acc + ws.members,
                                            0,
                                        )}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Workspaces List */}
                    {isLoading ? (
                        <Box
                            sx={{
                                display: "grid",
                                placeItems: "center",
                                minHeight: 400,
                            }}
                        >
                            <Stack spacing={1.5} sx={{ alignItems: "center" }}>
                                <CircularProgress size={40} />
                                <Typography sx={{ color: "text.secondary" }}>
                                    Loading workspaces...
                                </Typography>
                            </Stack>
                        </Box>
                    ) : workspaces.length === 0 ? (
                        <Card
                            sx={{
                                bgcolor: "background.paper",
                                border: "1px dashed",
                                borderColor: "divider",
                                boxShadow: "none",
                                p: 4,
                            }}
                        >
                            <Box sx={{ textAlign: "center" }}>
                                <Typography
                                    sx={{ color: "text.secondary", mb: 2 }}
                                >
                                    No workspaces yet. Create your first
                                    workspace to get started!
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={() => setOpenCreateDialog(true)}
                                    sx={{ mt: 1 }}
                                >
                                    Create Workspace
                                </Button>
                            </Box>
                        </Card>
                    ) : (
                        <Stack spacing={2}>
                            {workspaces.map((workspace) => (
                                <Card
                                    key={workspace.id}
                                    sx={{
                                        bgcolor: "background.paper",
                                        border: "1px solid",
                                        borderColor: "divider",
                                        boxShadow: "none",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            borderColor: "primary.main",
                                            boxShadow:
                                                "0 4px 12px rgba(0, 0, 0, 0.08)",
                                        },
                                    }}
                                >
                                    <CardContent>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                gap: 2,
                                                alignItems: "flex-start",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <Box sx={{ flex: 1 }}>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 2,
                                                        mb: 1,
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: 6,
                                                            height: 24,
                                                            borderRadius: 1,
                                                            bgcolor:
                                                                workspace.accent,
                                                        }}
                                                    />
                                                    <Box sx={{ flex: 1 }}>
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                                gap: 1,
                                                                mb: 0.5,
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="h6"
                                                                sx={{
                                                                    fontSize: 18,
                                                                    lineHeight: 1.2,
                                                                }}
                                                            >
                                                                {workspace.name}
                                                            </Typography>
                                                            <Chip
                                                                label={
                                                                    workspace.role
                                                                }
                                                                size="small"
                                                                sx={{
                                                                    fontWeight: 600,
                                                                    fontSize: 11,
                                                                    bgcolor:
                                                                        workspace.role ===
                                                                        "OWNER"
                                                                            ? "#fef3c7"
                                                                            : "#dbeafe",
                                                                    color:
                                                                        workspace.role ===
                                                                        "OWNER"
                                                                            ? "#92400e"
                                                                            : "#0c4a6e",
                                                                }}
                                                            />
                                                        </Box>
                                                        <Typography
                                                            sx={{
                                                                color: "text.secondary",
                                                                fontSize: 13,
                                                            }}
                                                        >
                                                            {workspace.members}{" "}
                                                            member
                                                            {workspace.members !==
                                                            1
                                                                ? "s"
                                                                : ""}{" "}
                                                            •{" "}
                                                            {workspace.projects}{" "}
                                                            project
                                                            {workspace.projects !==
                                                            1
                                                                ? "s"
                                                                : ""}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 2,
                                                        mt: 2,
                                                    }}
                                                >
                                                    <Box sx={{ flex: 1 }}>
                                                        <AvatarGroup
                                                            max={5}
                                                            sx={{
                                                                justifyContent:
                                                                    "flex-start",
                                                            }}
                                                        >
                                                            {workspace.avatars.map(
                                                                (
                                                                    avatar,
                                                                    idx,
                                                                ) => (
                                                                    <Avatar
                                                                        key={`${workspace.id}-${idx}`}
                                                                        sx={{
                                                                            width: 32,
                                                                            height: 32,
                                                                            fontSize: 12,
                                                                            bgcolor:
                                                                                workspace.accent,
                                                                            borderColor:
                                                                                "background.default",
                                                                        }}
                                                                    >
                                                                        {avatar}
                                                                    </Avatar>
                                                                ),
                                                            )}
                                                        </AvatarGroup>
                                                    </Box>

                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={() =>
                                                            navigate(
                                                                `/workspace/${workspace.id}`,
                                                            )
                                                        }
                                                        sx={{
                                                            textTransform:
                                                                "none",
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        Open
                                                    </Button>
                                                </Box>
                                            </Box>

                                            <Box
                                                sx={{ display: "flex", gap: 1 }}
                                            >
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) =>
                                                        handleMenuOpen(
                                                            e,
                                                            workspace,
                                                        )
                                                    }
                                                    sx={{
                                                        color: "text.secondary",
                                                        "&:hover": {
                                                            color: "text.primary",
                                                            bgcolor:
                                                                "action.hover",
                                                        },
                                                    }}
                                                >
                                                    <MoreVertIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}
                        </Stack>
                    )}
                </Box>
            </Box>

            {/* Menu for workspace actions */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                {selectedWorkspace?.role === "OWNER" ? (
                    <MenuItem
                        onClick={handleDeleteClick}
                        sx={{ color: "error.main" }}
                    >
                        <DeleteOutlineIcon sx={{ mr: 1, fontSize: 18 }} />
                        Delete Workspace
                    </MenuItem>
                ) : (
                    <MenuItem
                        onClick={handleLeaveClick}
                        sx={{ color: "warning.main" }}
                    >
                        <ExitToAppIcon sx={{ mr: 1, fontSize: 18 }} />
                        Leave Workspace
                    </MenuItem>
                )}
            </Menu>

            {/* Delete Workspace Dialog */}
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 700, fontSize: "1.3rem" }}>
                    Delete Workspace?
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <Alert severity="warning">
                            Are you sure you want to delete{" "}
                            <strong>{selectedWorkspace?.name}</strong>? This
                            action cannot be undone. All projects, tasks, and
                            data associated with this workspace will be
                            permanently deleted.
                        </Alert>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenDeleteDialog(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleConfirmDelete}
                    >
                        Delete Workspace
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Leave Workspace Dialog */}
            <Dialog
                open={openLeaveDialog}
                onClose={() => setOpenLeaveDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 700, fontSize: "1.3rem" }}>
                    Leave Workspace?
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <Alert severity="info">
                            Are you sure you want to leave{" "}
                            <strong>{selectedWorkspace?.name}</strong>? You will
                            no longer have access to this workspace and its
                            projects.
                        </Alert>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenLeaveDialog(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={handleConfirmLeave}
                    >
                        Leave Workspace
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Create Workspace Dialog */}
            <Dialog
                open={openCreateDialog}
                onClose={() => setOpenCreateDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 700, fontSize: "1.3rem" }}>
                    Create New Workspace
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <Typography
                            sx={{
                                color: "text.secondary",
                                fontSize: "0.95rem",
                            }}
                        >
                            Create a new workspace to organize your projects and
                            collaborate with team members.
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
                    <Button onClick={() => setOpenCreateDialog(false)}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleCreateWorkspace}>
                        Create Workspace
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Workspaces;
