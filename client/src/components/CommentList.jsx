import { useState, useEffect } from 'react'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { DropDownButtonComponent } from '@syncfusion/ej2-react-splitbuttons'

const fmt = (iso) => (iso ? new Date(iso).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : '')

/**
 * Presentational comment thread — data comes in via props (wire it to the API in the page).
 * Props:
 *   comments:    [{ id, userId, content, createdAt, updatedAt }]
 *   currentUserId: number|string  (author menu only shows for own comments)
 *   resolveUser: (userId) => ({ name, initials, color })
 *   onAdd/onEdit/onDelete: optional async handlers; if omitted, edits stay local (mock).
 */
function CommentList({ comments = [], currentUserId = 100, resolveUser = () => ({}), onAdd, onEdit, onDelete }) {
  const [list, setList] = useState(comments)
  const [draft, setDraft] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  useEffect(() => { setList(comments) }, [comments])

  const addComment = () => {
    if (!draft.trim()) return
    if (onAdd) { onAdd(draft); setDraft(''); return } // WIRE: addComment(taskId, draft) -> refetch
    const now = new Date().toISOString()
    setList((prev) => [...prev, { id: Date.now(), userId: currentUserId, content: draft, createdAt: now, updatedAt: now }])
    setDraft('')
  }

  const saveEdit = (id) => {
    if (onEdit) { onEdit(id, editText); setEditingId(null); return } // WIRE: editComment(taskId, id, text)
    setList((prev) => prev.map((c) => (c.id === id ? { ...c, content: editText, updatedAt: new Date().toISOString() } : c)))
    setEditingId(null)
    setEditText('')
  }

  const removeComment = (id) => {
    if (onDelete) { onDelete(id); return } // WIRE: deleteComment(taskId, id) -> refetch
    setList((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
        <TextBoxComponent multiline={true} placeholder="Add a comment…" value={draft} input={(e) => setDraft(e.value)} />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <ButtonComponent cssClass="e-primary" onClick={addComment} disabled={!draft.trim()}>Post Comment</ButtonComponent>
        </div>
      </div>

      {list.length === 0 ? (
        <p className="muted" style={{ textAlign: 'center', padding: '20px 0' }}>No comments yet. Be the first to comment.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {list.map((c) => {
            const author = resolveUser(c.userId) || {}
            const isMine = c.userId === currentUserId
            const isEditing = editingId === c.id
            return (
              <div key={c.id} style={{ display: 'flex', gap: 10 }}>
                <span className="avatar" style={{ width: 34, height: 34, fontSize: 12, background: author.color || '#64748b', flexShrink: 0 }}>
                  {author.initials || '?'}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{author.name || 'Unknown'}</span>
                    <span className="muted" style={{ fontSize: 11 }}>{fmt(c.createdAt)}{c.updatedAt && c.updatedAt !== c.createdAt ? ' · edited' : ''}</span>
                    {isMine && !isEditing && (
                      <span style={{ marginLeft: 'auto' }}>
                        <DropDownButtonComponent
                          cssClass="tc-kebab"
                          items={[{ text: 'Edit' }, { text: 'Delete' }]}
                          select={(a) => {
                            if (a.item.text === 'Edit') { setEditingId(c.id); setEditText(c.content) }
                            else removeComment(c.id)
                          }}
                        >⋮</DropDownButtonComponent>
                      </span>
                    )}
                  </div>

                  {isEditing ? (
                    <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <TextBoxComponent multiline={true} value={editText} input={(e) => setEditText(e.value)} />
                      <div style={{ display: 'flex', gap: 8 }}>
                        <ButtonComponent cssClass="e-primary" onClick={() => saveEdit(c.id)}>Save</ButtonComponent>
                        <ButtonComponent cssClass="e-flat" onClick={() => setEditingId(null)}>Cancel</ButtonComponent>
                      </div>
                    </div>
                  ) : (
                    <p style={{ margin: '4px 0 0', fontSize: 13.5, lineHeight: 1.55, color: '#374151' }}>{c.content}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CommentList
