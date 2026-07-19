import { useNavigate } from 'react-router-dom'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'

function WorkspaceGrid({ workspaces }) {
  const navigate = useNavigate()
  return (
    <div>
      <h5 style={{ fontSize: 22, marginBottom: 18 }}>Workspaces</h5>

      {workspaces.length === 0 ? (
        <div
          className="card"
          style={{ padding: 24, borderStyle: 'dashed', boxShadow: 'none' }}
        >
          <p className="muted">
            No workspaces found. Create or join a workspace to get started.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 20,
          }}
        >
          {workspaces.map((workspace) => (
            <div
              key={workspace.id}
              className="card"
              style={{
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
              }}
            >
              <div>
                <div
                  style={{
                    width: 38,
                    height: 5,
                    borderRadius: 4,
                    background: workspace.accent,
                    marginBottom: 16,
                  }}
                />
                <h6 style={{ fontSize: 18, lineHeight: 1.25 }}>
                  {workspace.name} ({workspace.role})
                </h6>
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                {workspace.avatars.slice(0, 4).map((avatar) => (
                  <span
                    key={`${workspace.id}-${avatar}`}
                    className="avatar"
                    style={{
                      width: 32,
                      height: 32,
                      fontSize: 12,
                      background: workspace.accent,
                      border: '2px solid var(--surface)',
                    }}
                  >
                    {avatar}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div className="muted" style={{ fontSize: 13 }}>Projects</div>
                  <div style={{ fontWeight: 800, fontSize: 22 }}>{workspace.projects}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="muted" style={{ fontSize: 13 }}>Members</div>
                  <div style={{ fontWeight: 800, fontSize: 22 }}>{workspace.members}</div>
                </div>
              </div>

              <div style={{ marginTop: 'auto' }}>
                <ButtonComponent
                  cssClass="e-outline tc-block"
                  onClick={() => navigate(`/workspace/${workspace.id}`)}
                >
                  Go to Workspace
                </ButtonComponent>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default WorkspaceGrid
