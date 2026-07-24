import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { getMyProjects } from "../services/projectService";

const USER_ID = 1;
const projectColors = [
    "#5b2ee8",
    "#0f9f6e",
    "#2563eb",
    "#f59e0b",
    "#db2777",
    "#0891b2",
];

function MyProjects() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentUser] = useState(() => {
        const storedUser = localStorage.getItem("current_user");
        return storedUser ? JSON.parse(storedUser) : { name: "User" };
    });

    useEffect(() => {
        async function loadProjects() {
            try {
                setProjects(await getMyProjects(USER_ID));
            } catch (requestError) {
                setError(
                    requestError.response?.data?.message ||
                        "Could not load your projects.",
                );
            } finally {
                setIsLoading(false);
            }
        }
        loadProjects();
    }, []);

    const visibleProjects = projects.filter((project) =>
        `${project.projectName} ${project.workspaceName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
    );

    const openProject = (project) => {
        navigate(
            `/workspace/${project.workspaceId}/project/${project.projectId}`,
            {
                state: {
                    userId: USER_ID,
                    project: {
                        id: project.projectId,
                        name: project.projectName,
                        createdAt: project.createdAt,
                        myWorkspace: {
                            id: project.workspaceId,
                            name: project.workspaceName,
                        },
                    },
                },
            },
        );
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
                    style={{ flex: 1, padding: "36px clamp(24px, 4vw, 56px)" }}
                >
                    <section
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: 20,
                            marginBottom: 30,
                            flexWrap: "wrap",
                        }}
                    >
                        <div>
                            <span
                                style={{
                                    display: "inline-block",
                                    color: "#5b2ee8",
                                    fontSize: 13,
                                    fontWeight: 750,
                                    marginBottom: 8,
                                }}
                            >
                                PROJECT PORTFOLIO
                            </span>
                            <h1
                                style={{
                                    margin: 0,
                                    fontSize: 30,
                                    letterSpacing: "-.6px",
                                }}
                            >
                                My Projects
                            </h1>
                            <p
                                style={{
                                    margin: "8px 0 0",
                                    color: "#667085",
                                    fontSize: 16,
                                }}
                            >
                                All projects you can access across your
                                workspaces.
                            </p>
                        </div>
                        <div
                            className="e-card"
                            style={{
                                minWidth: 150,
                                padding: "12px 16px",
                                borderRadius: 11,
                                border: "1px solid #e4e7ec",
                                boxShadow: "0 2px 7px rgba(16,24,40,.025)",
                            }}
                        >
                            <div style={{ color: "#667085", fontSize: 12 }}>
                                AVAILABLE PROJECTS
                            </div>
                            <div
                                style={{
                                    fontSize: 25,
                                    fontWeight: 800,
                                    color: "#5b2ee8",
                                    marginTop: 2,
                                }}
                            >
                                {projects.length}
                            </div>
                        </div>
                    </section>

                    <section
                        className="e-card"
                        style={{
                            padding: 16,
                            borderRadius: 12,
                            border: "1px solid #e4e7ec",
                            marginBottom: 24,
                            boxShadow: "0 2px 7px rgba(16,24,40,.025)",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 16,
                                flexWrap: "wrap",
                            }}
                        >
                            <div style={{ width: 320 }}>
                                <TextBoxComponent
                                    placeholder="Search projects or workspaces..."
                                    value={searchTerm}
                                    input={(event) =>
                                        setSearchTerm(event.value)
                                    }
                                />
                            </div>
                            <span style={{ color: "#667085", fontSize: 14 }}>
                                Showing {visibleProjects.length} of{" "}
                                {projects.length} projects
                            </span>
                        </div>
                    </section>

                    {isLoading ? (
                        <div
                            style={{
                                display: "grid",
                                placeItems: "center",
                                minHeight: 340,
                            }}
                        >
                            <p style={{ color: "#667085" }}>
                                Loading your projects...
                            </p>
                        </div>
                    ) : error ? (
                        <div
                            style={{
                                padding: "12px 14px",
                                borderRadius: 9,
                                background: "#fee4e2",
                                color: "#b42318",
                            }}
                        >
                            {error}
                        </div>
                    ) : visibleProjects.length === 0 ? (
                        <section
                            className="e-card"
                            style={{
                                padding: 42,
                                borderRadius: 14,
                                textAlign: "center",
                                border: "1px dashed #c7b9ff",
                            }}
                        >
                            <h2 style={{ fontSize: 19, margin: "0 0 8px" }}>
                                {searchTerm
                                    ? "No matching projects"
                                    : "No projects available yet"}
                            </h2>
                            <p style={{ margin: 0, color: "#667085" }}>
                                {searchTerm
                                    ? "Try a different project or workspace name."
                                    : "Projects shared with you will appear here."}
                            </p>
                        </section>
                    ) : (
                        <section
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fill, minmax(285px, 1fr))",
                                gap: 20,
                            }}
                        >
                            {visibleProjects.map((project, index) => {
                                const color =
                                    projectColors[index % projectColors.length];
                                return (
                                    <article
                                        key={project.projectId}
                                        className="e-card"
                                        onClick={() => openProject(project)}
                                        style={{
                                            borderRadius: 13,
                                            overflow: "hidden",
                                            border: "1px solid #e4e7ec",
                                            cursor: "pointer",
                                            boxShadow:
                                                "0 3px 10px rgba(16,24,40,.03)",
                                        }}
                                    >
                                        <div
                                            style={{
                                                height: 5,
                                                background: color,
                                            }}
                                        />
                                        <div
                                            className="e-card-header"
                                            style={{
                                                padding: "18px 18px 10px",
                                                alignItems: "flex-start",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: 43,
                                                    height: 43,
                                                    display: "grid",
                                                    placeItems: "center",
                                                    borderRadius: 11,
                                                    background: `${color}18`,
                                                    color,
                                                    fontSize: 18,
                                                    fontWeight: 800,
                                                    marginRight: 12,
                                                }}
                                            >
                                                P
                                            </div>
                                            <div
                                                className="e-card-header-caption"
                                                style={{ minWidth: 0 }}
                                            >
                                                <div
                                                    className="e-card-header-title"
                                                    style={{
                                                        fontSize: 17,
                                                        fontWeight: 750,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                    }}
                                                >
                                                    {project.projectName}
                                                </div>
                                                <div
                                                    className="e-card-sub-title"
                                                    style={{
                                                        color: "#667085",
                                                        fontSize: 13,
                                                        marginTop: 3,
                                                    }}
                                                >
                                                    Workspace #
                                                    {project.workspaceId}
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="e-card-content"
                                            style={{ padding: "8px 18px 18px" }}
                                        >
                                            <div
                                                style={{
                                                    padding: "11px 12px",
                                                    borderRadius: 9,
                                                    background: "#f8f9fd",
                                                    marginBottom: 16,
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        color: "#667085",
                                                        fontSize: 12,
                                                        marginBottom: 3,
                                                    }}
                                                >
                                                    WORKSPACE
                                                </div>
                                                <div
                                                    style={{
                                                        fontWeight: 700,
                                                        fontSize: 14,
                                                        color: "#344054",
                                                    }}
                                                >
                                                    {project.workspaceName}
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    gap: 10,
                                                    alignItems: "center",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        color: "#667085",
                                                        fontSize: 13,
                                                    }}
                                                >
                                                    Created{" "}
                                                    {new Date(
                                                        project.createdAt,
                                                    ).toLocaleDateString()}
                                                </span>
                                                <ButtonComponent
                                                    cssClass="e-outline"
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        openProject(project);
                                                    }}
                                                    style={{
                                                        borderColor: `${color}66`,
                                                        color,
                                                        borderRadius: 8,
                                                    }}
                                                >
                                                    Open
                                                </ButtonComponent>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
}

export default MyProjects;
