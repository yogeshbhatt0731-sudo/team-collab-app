import { useNavigate } from 'react-router-dom'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'

const accent = '#5b2ee8'

const ROLE_STYLE = {
  OWNER: { bg: '#ede9fe', fg: accent },
  MEMBER: { bg: '#f0fdf4', fg: '#15803d' },
}

function WorkspaceGrid({ workspaces }) {
  const navigate = useNavigate()
  return (
    <div>
      <h2 style={{ fontSize: 21, margin: '0 0 18px', color: 'var(--text)' }}>Your workspaces</h2>

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
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 20,
          }}
        >
          {workspaces.map((workspace) => {
            const rs = ROLE_STYLE[workspace.role] || ROLE_STYLE.MEMBER
            return (
              <div
                key={workspace.id}
                className="card"
                style={{
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  transition: 'transform .15s ease, box-shadow .15s ease',
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`/workspace/${workspace.id}`)}
              >
                <div style={{
                  height: 6, background: `linear-gradient(90deg, ${accent}, #8b5cf6)`,
                }} />

                <div style={{ padding: '22px 22px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 12,
                        display: 'grid',
                        placeItems: 'center',
                        background: 'linear-gradient(135deg, #8b5cf6, #5b2ee8)',
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: 16,
                        flexShrink: 0,
                      }}
                    >
                      {workspace.name?.slice(0, 2).toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h6 style={{ fontSize: 18, lineHeight: 1.25, margin: 0, color: 'var(--text)' }}>{workspace.name}</h6>
                      <span className="chip" style={{
                        marginTop: 8, background: rs.bg, color: rs.fg, fontSize: 11, fontWeight: 750,
                      }}>{workspace.role}</span>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '16px 22px 22px', marginTop: 'auto' }}>
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--muted)', fontSize: 13 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                      </svg>
                      <span><strong style={{ color: 'var(--text)', fontWeight: 700 }}>{workspace.projects}</strong> {workspace.projects === 1 ? 'project' : 'projects'}</span>
                    </div>
                    <ButtonComponent
                      cssClass="e-flat"
                      style={{ fontSize: 13, color: accent, fontWeight: 700, padding: '4px 8px' }}
                      onClick={(e) => { e.stopPropagation(); navigate(`/workspace/${workspace.id}`) }}
                    >
                      Open →
                    </ButtonComponent>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default WorkspaceGrid
