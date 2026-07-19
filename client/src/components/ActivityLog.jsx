import { TimelineComponent, ItemsDirective, ItemDirective } from '@syncfusion/ej2-react-layouts'

const fmt = (iso) => (iso ? new Date(iso).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : '')

/**
 * Presentational activity feed (Syncfusion Timeline), newest-first.
 * Props:
 *   items:        [{ id, actorId, action, detail, createdAt }]
 *   resolveActor: (actorId) => ({ name })
 * WIRE: pass GET /task/{id}/activity results as `items`.
 */
function ActivityLog({ items = [], resolveActor = () => ({}) }) {
  if (!items.length) {
    return <p className="muted" style={{ textAlign: 'center', padding: '20px 0' }}>No activity yet.</p>
  }

  return (
    <TimelineComponent align="Before">
      <ItemsDirective>
        {items.map((a) => {
          const actor = resolveActor(a.actorId) || {}
          const content = () => (
            <div style={{ paddingBottom: 6 }}>
              <div style={{ fontSize: 13 }}><strong>{actor.name || 'Someone'}</strong> {a.detail}</div>
              <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>{fmt(a.createdAt)}</div>
            </div>
          )
          return <ItemDirective key={a.id} content={content} dotCss="e-icons" />
        })}
      </ItemsDirective>
    </TimelineComponent>
  )
}

export default ActivityLog
