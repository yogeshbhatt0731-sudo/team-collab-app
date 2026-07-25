function WorkspaceDetailsPanel({ workspace, projects }) {
  if (!workspace) {
    return (
      <aside className="card" style={{ width: 336, padding: 20 }}>
        <h6 style={{ fontSize: 18 }}>No active workspace</h6>
        <p className="muted" style={{ marginTop: 8 }}>
          Create or join a workspace to see details here.
        </p>
      </aside>
    )
  }

  return (
    <aside className="card" style={{ width: 336, padding: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Active Workspace</div>
          <h5 style={{ fontSize: 22 }}>{workspace.name}</h5>
          <p className="muted" style={{ marginTop: 8, lineHeight: 1.6 }}>
            Your role is {workspace.role}. This workspace has {workspace.projects} project{workspace.projects === 1 ? '' : 's'}.
          </p>
        </div>

        <div>
          <h6 style={{ fontSize: 18, marginBottom: 12 }}>Current Projects</h6>

          {projects.length === 0 ? (
            <div
              style={{
                padding: 12,
                border: '1px dashed var(--border)',
                borderRadius: 10,
                background: 'var(--app-bg)',
              }}
            >
              <p className="muted" style={{ fontSize: 14 }}>
                No projects available from the workspace API yet.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {projects.map((project) => (
                <div
                  key={project.id}
                  style={{
                    padding: 12,
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    background: 'var(--app-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700 }}>{project.name}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

export default WorkspaceDetailsPanel
