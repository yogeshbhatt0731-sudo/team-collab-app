import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { PRIORITY_COLOR, TYPE_COLOR, STATUS_LABEL, STATUS_DOT } from '../data/taskMock'
import { smartSearchTasks } from '../services/taskService'

function AiSearch() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [result, setResult] = useState(null)

  const onSearch = async () => {
    const trimmed = query.trim()
    if (!trimmed) return
    setSearching(true)
    const data = await smartSearchTasks(trimmed)
    setResult(data)
    setSearching(false)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') onSearch()
  }

  const badge = (text, color) => (
    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.4, padding: '2px 7px', borderRadius: 5, background: `${color}1a`, color }}>
      {text}
    </span>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--app-bg)', color: 'var(--text)' }}>
      <Sidebar />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Header userName={JSON.parse(localStorage.getItem('current_user') || '{}').name || 'User'} />
        <main style={{ flex: 1, padding: 24, maxWidth: 820, width: '100%' }}>
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ fontSize: '1.6rem', marginBottom: 4 }}>AI Task Search</h4>
            <p className="muted" style={{ fontSize: 13 }}>Search your tasks using natural language. Powered by AI.</p>
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }} onKeyDown={onKeyDown}>
            <div style={{ flex: 1 }} className="tc-full">
              <TextBoxComponent
                placeholder="e.g. What are the high priority tasks related to authentication?"
                value={query}
                input={(e) => setQuery(e.value)}
              />
            </div>
            <ButtonComponent cssClass="e-primary" disabled={searching || !query.trim()} onClick={onSearch}>
              {searching ? 'Searching...' : 'Search'}
            </ButtonComponent>
          </div>

          {result && (
            <div>
              {/* AI Summary */}
              <div className="card" style={{ padding: '16px 20px', marginBottom: 20, borderLeft: '4px solid #5b2ee8' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#5b2ee8', marginBottom: 6, letterSpacing: 0.3 }}>AI SUMMARY</div>
                <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text)' }}>{result.summary}</div>
              </div>

              {/* Matched Tasks */}
              {result.tasks && result.tasks.length > 0 && (
                <div>
                  <h6 style={{ fontSize: 14, marginBottom: 12, color: 'var(--muted)' }}>Matched Tasks ({result.tasks.length})</h6>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {result.tasks.map((t) => (
                      <div
                        key={t.id}
                        className="card"
                        style={{ padding: 14, boxShadow: 'none', cursor: 'pointer' }}
                        onClick={() => navigate(`/task/${t.id}`)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_DOT[t.taskStatus] || '#94a3b8', flexShrink: 0 }} />
                          <strong style={{ fontSize: 14, flex: 1 }}>{t.title}</strong>
                          <span className="muted" style={{ fontSize: 11 }}>#{t.id}</span>
                        </div>
                        {t.description && (
                          <p className="muted" style={{ fontSize: 12, marginBottom: 8, lineHeight: 1.4 }}>
                            {t.description.length > 120 ? t.description.slice(0, 120) + '...' : t.description}
                          </p>
                        )}
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {badge(t.taskType, TYPE_COLOR[t.taskType] || '#64748b')}
                          {badge(t.taskPriority, PRIORITY_COLOR[t.taskPriority] || '#64748b')}
                          {badge(STATUS_LABEL[t.taskStatus] || t.taskStatus, STATUS_DOT[t.taskStatus] || '#64748b')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.tasks && result.tasks.length === 0 && (
                <p className="muted" style={{ textAlign: 'center', padding: 24 }}>No matching tasks found.</p>
              )}
            </div>
          )}

          {!result && !searching && (
            <div className="card" style={{ padding: 40, textAlign: 'center', border: '2px dashed var(--border)', boxShadow: 'none' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>&#x1F50D;</div>
              <h6 style={{ fontSize: 16, marginBottom: 6 }}>Ask anything about your tasks</h6>
              <p className="muted" style={{ fontSize: 13 }}>
                Try "show me all high priority bugs" or "what tasks are related to authentication?"
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default AiSearch
