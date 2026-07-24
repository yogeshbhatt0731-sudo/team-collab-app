import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Modal from "../components/Modal";
import {
    getProjectsByWorkspace,
    getWorkspaceById,
} from "../services/workspaceService";
import {
    createProject,
    deleteProject,
    updateProject,
} from "../services/projectService";

const accent = "#5b2ee8";

function InfoCard({ label, value, detail, color }) {
    return (
        <div
            style={{
                background: "#fff",
                border: "1px solid #eaecf0",
                borderRadius: 12,
                padding: 18,
                display: "flex",
                gap: 14,
                alignItems: "center",
                boxShadow: "0 2px 7px rgba(16,24,40,0.025)",
            }}
        >
            <div
                style={{
                    width: 44,
                    height: 44,
                    borderRadius: 11,
                    background: `${color}16`,
                    color,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 20,
                    fontWeight: 800,
                }}
            >
                ◈
            </div>
            <div>
                <div style={{ color: "#667085", fontSize: 13 }}>{label}</div>
                <div
                    style={{
                        fontWeight: 800,
                        fontSize: 25,
                        color: "#101828",
                        marginTop: 2,
                    }}
                >
                    {value}
                </div>
                {detail && (
                    <div
                        style={{ color: "#667085", fontSize: 12, marginTop: 2 }}
                    >
                        {detail}
                    </div>
                )}
            </div>
        </div>
    );
}

function WorkspaceDetail() {
    const { workspaceId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const userId = location.state?.userId || 1;
    const role = location.state?.role || "MEMBER";
    const [workspace, setWorkspace] = useState(null);
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectName, setProjectName] = useState("");
    const [projectError, setProjectError] = useState("");
    const [currentUser] = useState(() => {
        const storedUser = localStorage.getItem("current_user");
        return storedUser ? JSON.parse(storedUser) : { name: "User" };
    });

    const refreshProjects = async () => {
        setProjects(await getProjectsByWorkspace(workspaceId, userId));
    };

    useEffect(() => {
        async function loadWorkspace() {
            try {
                const [workspaceData, projectData] = await Promise.all([
                    getWorkspaceById(workspaceId, userId),
                    getProjectsByWorkspace(workspaceId, userId),
                ]);
                setWorkspace(workspaceData);
                setProjects(projectData);
            } catch (requestError) {
                setError(
                    requestError.response?.data?.message ||
                        "Could not load this workspace.",
                );
            } finally {
                setIsLoading(false);
            }
        }
        loadWorkspace();
    }, [workspaceId, userId]);

    const visibleProjects = projects.filter((project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    const canManageProject = (project) => project.createdBy === userId;

    const openCreateDialog = () => {
        setSelectedProject(null);
        setProjectName("");
        setProjectError("");
        setIsProjectDialogOpen(true);
    };

    const openEditDialog = (project) => {
        setSelectedProject(project);
        setProjectName(project.name);
        setProjectError("");
        setIsProjectDialogOpen(true);
    };

    const saveProject = async () => {
        const name = projectName.trim();
        if (!name) {
            setProjectError("Project name is required.");
            return;
        }
        try {
            if (selectedProject)
                await updateProject(selectedProject.id, name, userId);
            else await createProject(workspaceId, name, userId);
            await refreshProjects();
            setIsProjectDialogOpen(false);
        } catch (requestError) {
            setProjectError(
                requestError.response?.data?.message ||
                    "Could not save project.",
            );
        }
    };

    const removeProject = async () => {
        if (!selectedProject) return;
        try {
            await deleteProject(selectedProject.id, userId);
            await refreshProjects();
            setIsDeleteDialogOpen(false);
            setSelectedProject(null);
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                    "Could not delete project.",
            );
            setIsDeleteDialogOpen(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                background: "#f8f9fd",
                color: "#101828",
            }}
        >
            <Sidebar />
            <div
                style={{
                    flex: 1,
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Header userName={currentUser.name} />
                <main
                    style={{ flex: 1, padding: "30px clamp(24px, 4vw, 52px)" }}
                >
                    <button
                        type="button"
                        onClick={() => navigate("/workspaces")}
                        style={{
                            border: 0,
                            background: "transparent",
                            padding: 0,
                            color: "#667085",
                            cursor: "pointer",
                            fontSize: 14,
                            marginBottom: 24,
                        }}
                    >
                        ← Workspaces
                    </button>

                    {isLoading ? (
                        <div
                            style={{
                                display: "grid",
                                placeItems: "center",
                                minHeight: 360,
                            }}
                        >
                            <p style={{ color: "#667085" }}>
                                Loading workspace...
                            </p>
                        </div>
                    ) : error ? (
                        <div
                            style={{
                                padding: 16,
                                borderRadius: 9,
                                background: "#fee4e2",
                                color: "#b42318",
                            }}
                        >
                            {error}
                        </div>
                    ) : (
                        <>
                            <section
                                style={{
                                    background: "#fff",
                                    border: "1px solid #eaecf0",
                                    borderRadius: 15,
                                    padding: "24px clamp(20px, 3vw, 32px)",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: 28,
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                    boxShadow:
                                        "0 3px 12px rgba(16,24,40,0.025)",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        gap: 18,
                                        alignItems: "center",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 76,
                                            height: 76,
                                            borderRadius: 18,
                                            display: "grid",
                                            placeItems: "center",
                                            background:
                                                "linear-gradient(135deg, #8b5cf6, #5b2ee8)",
                                            color: "#fff",
                                            fontWeight: 800,
                                            fontSize: 27,
                                            boxShadow:
                                                "0 10px 20px rgba(91,46,232,.18)",
                                        }}
                                    >
                                        {workspace.name
                                            .slice(0, 2)
                                            .toUpperCase()}
                                    </div>
                                    <div>
                                        <span
                                            style={{
                                                display: "inline-block",
                                                padding: "4px 9px",
                                                borderRadius: 999,
                                                background:
                                                    role === "OWNER"
                                                        ? "#ede9fe"
                                                        : "#f2f4f7",
                                                color:
                                                    role === "OWNER"
                                                        ? accent
                                                        : "#475467",
                                                fontWeight: 750,
                                                fontSize: 11,
                                                letterSpacing: ".25px",
                                            }}
                                        >
                                            {role}
                                        </span>
                                        <h1
                                            style={{
                                                margin: "8px 0 5px",
                                                fontSize: 28,
                                                letterSpacing: "-.5px",
                                            }}
                                        >
                                            {workspace.name}
                                        </h1>
                                        <p
                                            style={{
                                                margin: 0,
                                                color: "#667085",
                                                fontSize: 14,
                                            }}
                                        >
                                            A dedicated space for your
                                            team&apos;s projects and
                                            collaboration.
                                        </p>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        gap: 10,
                                        flexWrap: "wrap",
                                    }}
                                >
                                    {role === "OWNER" && (
                                        <ButtonComponent
                                            cssClass="e-primary"
                                            onClick={openCreateDialog}
                                            style={{
                                                height: 42,
                                                background: accent,
                                                borderColor: accent,
                                                borderRadius: 9,
                                            }}
                                        >
                                            + New Project
                                        </ButtonComponent>
                                    )}
                                </div>
                            </section>

                            <nav
                                style={{
                                    display: "flex",
                                    gap: 28,
                                    borderBottom: "1px solid #eaecf0",
                                    marginTop: 26,
                                    overflowX: "auto",
                                }}
                            >
                                {[
                                    "Overview",
                                    "Projects",
                                    "Members",
                                    "Activity",
                                ].map((item, index) => (
                                    <span
                                        key={item}
                                        style={{
                                            padding: "0 0 13px",
                                            borderBottom:
                                                index === 0
                                                    ? `2px solid ${accent}`
                                                    : "2px solid transparent",
                                            color:
                                                index === 0
                                                    ? accent
                                                    : "#667085",
                                            fontWeight: index === 0 ? 750 : 550,
                                            whiteSpace: "nowrap",
                                            fontSize: 14,
                                        }}
                                    >
                                        {item}
                                    </span>
                                ))}
                            </nav>

                            <section
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit, minmax(200px, 1fr))",
                                    gap: 16,
                                    margin: "24px 0",
                                }}
                            >
                                <InfoCard
                                    label="Projects"
                                    value={projects.length}
                                    detail="Available in this workspace"
                                    color={accent}
                                />
                                <InfoCard
                                    label="Your Role"
                                    value={
                                        role === "OWNER" ? "Owner" : "Member"
                                    }
                                    detail={
                                        role === "OWNER"
                                            ? "You can create projects"
                                            : "Project access is view-only"
                                    }
                                    color={
                                        role === "OWNER" ? "#16a34a" : "#2563eb"
                                    }
                                />
                                <InfoCard
                                    label="Workspace ID"
                                    value={`#${workspace.id || workspaceId}`}
                                    detail="Use this to identify the workspace"
                                    color="#f59e0b"
                                />
                            </section>

                            <section
                                style={{
                                    background: "#fff",
                                    border: "1px solid #eaecf0",
                                    borderRadius: 14,
                                    overflow: "hidden",
                                    boxShadow:
                                        "0 3px 10px rgba(16,24,40,0.025)",
                                }}
                            >
                                <div
                                    style={{
                                        padding: "20px 22px",
                                        borderBottom: "1px solid #eaecf0",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        gap: 16,
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <div>
                                        <h2 style={{ fontSize: 19, margin: 0 }}>
                                            Projects
                                        </h2>
                                        <p
                                            style={{
                                                margin: "4px 0 0",
                                                color: "#667085",
                                                fontSize: 13,
                                            }}
                                        >
                                            Projects currently associated with
                                            this workspace.
                                        </p>
                                    </div>
                                    <div style={{ width: 245 }}>
                                        <TextBoxComponent
                                            placeholder="Search projects..."
                                            value={searchTerm}
                                            input={(event) =>
                                                setSearchTerm(event.value)
                                            }
                                        />
                                    </div>
                                </div>

                                {visibleProjects.length === 0 ? (
                                    <div
                                        style={{
                                            padding: 42,
                                            textAlign: "center",
                                        }}
                                    >
                                        <h3
                                            style={{
                                                margin: "0 0 7px",
                                                fontSize: 17,
                                            }}
                                        >
                                            No projects found
                                        </h3>
                                        <p
                                            style={{
                                                margin: 0,
                                                color: "#667085",
                                            }}
                                        >
                                            {searchTerm
                                                ? "Try another search phrase."
                                                : "Create a project to start organizing work."}
                                        </p>
                                    </div>
                                ) : (
                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns:
                                                "repeat(auto-fill, minmax(250px, 1fr))",
                                            gap: 16,
                                            padding: 20,
                                        }}
                                    >
                                        {visibleProjects.map(
                                            (project, index) => (
                                                <article
                                                    key={project.id}
                                                    onClick={() =>
                                                        navigate(
                                                            `/workspace/${workspaceId}/project/${project.id}`,
                                                            {
                                                                state: {
                                                                    userId,
                                                                    role,
                                                                    project,
                                                                },
                                                            },
                                                        )
                                                    }
                                                    style={{
                                                        border: "1px solid #e4e7ec",
                                                        borderRadius: 11,
                                                        padding: 17,
                                                        cursor: "pointer",
                                                        transition:
                                                            "transform .15s ease, box-shadow .15s ease",
                                                        background: "#fff",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "space-between",
                                                            alignItems:
                                                                "flex-start",
                                                            gap: 10,
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                width: 34,
                                                                height: 34,
                                                                borderRadius: 9,
                                                                background: [
                                                                    "#ede9fe",
                                                                    "#e0f2fe",
                                                                    "#dcfce7",
                                                                    "#fff7ed",
                                                                ][index % 4],
                                                                color: [
                                                                    accent,
                                                                    "#0369a1",
                                                                    "#15803d",
                                                                    "#c2410c",
                                                                ][index % 4],
                                                                display: "grid",
                                                                placeItems:
                                                                    "center",
                                                                fontWeight: 800,
                                                            }}
                                                        >
                                                            P
                                                        </span>
                                                        {canManageProject(
                                                            project,
                                                        ) && (
                                                            <div
                                                                onClick={(
                                                                    event,
                                                                ) =>
                                                                    event.stopPropagation()
                                                                }
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    gap: 5,
                                                                }}
                                                            >
                                                                <ButtonComponent
                                                                    cssClass="e-flat"
                                                                    onClick={() =>
                                                                        openEditDialog(
                                                                            project,
                                                                        )
                                                                    }
                                                                >
                                                                    Edit
                                                                </ButtonComponent>
                                                                <ButtonComponent
                                                                    cssClass="e-flat"
                                                                    onClick={() => {
                                                                        setSelectedProject(
                                                                            project,
                                                                        );
                                                                        setIsDeleteDialogOpen(
                                                                            true,
                                                                        );
                                                                    }}
                                                                    style={{
                                                                        color: "#d92d20",
                                                                    }}
                                                                >
                                                                    Delete
                                                                </ButtonComponent>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <h3
                                                        style={{
                                                            fontSize: 16,
                                                            margin: "15px 0 6px",
                                                        }}
                                                    >
                                                        {project.name}
                                                    </h3>
                                                    <p
                                                        style={{
                                                            margin: 0,
                                                            color: "#667085",
                                                            fontSize: 13,
                                                        }}
                                                    >
                                                        Created{" "}
                                                        {new Date(
                                                            project.createdAt,
                                                        ).toLocaleDateString()}
                                                    </p>
                                                </article>
                                            ),
                                        )}
                                    </div>
                                )}
                            </section>
                        </>
                    )}
                </main>
            </div>

            <Modal
                open={isProjectDialogOpen}
                onClose={() => setIsProjectDialogOpen(false)}
                title={selectedProject ? "Edit Project" : "Create Project"}
                footer={
                    <>
                        <ButtonComponent
                            cssClass="e-flat"
                            onClick={() => setIsProjectDialogOpen(false)}
                        >
                            Cancel
                        </ButtonComponent>
                        <ButtonComponent
                            cssClass="e-primary"
                            onClick={saveProject}
                        >
                            {selectedProject
                                ? "Save Changes"
                                : "Create Project"}
                        </ButtonComponent>
                    </>
                }
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                    }}
                >
                    {projectError && (
                        <div style={{ color: "#d92d20" }}>{projectError}</div>
                    )}
                    <label>
                        <span
                            style={{
                                display: "block",
                                fontSize: 13,
                                fontWeight: 650,
                                marginBottom: 6,
                            }}
                        >
                            Project Name
                        </span>
                        <TextBoxComponent
                            value={projectName}
                            input={(event) => setProjectName(event.value)}
                        />
                    </label>
                </div>
            </Modal>
            <Modal
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                title="Delete Project?"
                footer={
                    <>
                        <ButtonComponent
                            cssClass="e-flat"
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            Cancel
                        </ButtonComponent>
                        <ButtonComponent
                            cssClass="e-danger"
                            onClick={removeProject}
                        >
                            Delete Project
                        </ButtonComponent>
                    </>
                }
            >
                <p>
                    Delete <strong>{selectedProject?.name}</strong>? This cannot
                    be undone.
                </p>
            </Modal>
        </div>
    );
}

export default WorkspaceDetail;
