import { useNavigate } from 'react-router-dom'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'

function WorkspaceGrid({ workspaces }) {
  const navigate = useNavigate()
  return (
    <div>
      <h2 style={{ fontSize: 21, margin: '0 0 18px' }}>Your workspaces</h2>

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
                padding: 22,
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                minHeight: 196,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    display: 'grid',
                    placeItems: 'center',
                    background: '#f0edff',
                    color: '#5b2ee8',
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {workspace.name?.slice(0, 2).toUpperCase()}
                </div>
                <div style={{ minWidth: 0 }}>
                  <h6 style={{ fontSize: 18, lineHeight: 1.25, margin: 0 }}>{workspace.name}</h6>
                  <span className="muted" style={{ display: 'inline-block', marginTop: 6, fontSize: 13 }}>{workspace.role}</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 15 }}>
                <div className="muted" style={{ fontSize: 13 }}>Projects</div>
                <div style={{ fontWeight: 800, fontSize: 23, marginTop: 3 }}>{workspace.projects}</div>
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
