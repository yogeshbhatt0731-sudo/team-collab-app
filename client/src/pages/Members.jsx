import { useState } from 'react'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { DropDownButtonComponent } from '@syncfusion/ej2-react-splitbuttons'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Modal from '../components/Modal'
import { MEMBERS } from '../data/taskMock'

const ROLE_STYLE = {
  OWNER: { bg: '#fef3c7', fg: '#92400e' },
  DEVELOPER: { bg: '#dbeafe', fg: '#1e40af' },
  QA: { bg: '#ede9fe', fg: '#6d28d9' },
}

/**
 * Members page template. Mock list; WIRE to your workspace members endpoint.
 *   list:   GET workspace members
 *   invite: POST invite (email)
 *   role:   PATCH member role   ·   remove: DELETE member
 */
function Members() {
  const [members] = useState(MEMBERS) // WIRE: useMembers(workspaceId).data
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--app-bg)', color: 'var(--text)' }}>
      <Sidebar />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Header userName="Yogesh Bhatt" />

        <main style={{ flex: 1, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
            <div>
              <h4 style={{ fontSize: '1.75rem', marginBottom: 8 }}>Members</h4>
              <p className="muted" style={{ fontSize: 16 }}>People with access to this workspace</p>
            </div>
            <ButtonComponent cssClass="e-primary" onClick={() => setInviteOpen(true)}>+ Invite Member</ButtonComponent>
          </div>

          <div className="card" style={{ boxShadow: 'none', overflow: 'hidden' }}>
            {members.map((m, i) => {
              const rs = ROLE_STYLE[m.role] || { bg: '#e2e8f0', fg: '#334155' }
              return (
                <div
                  key={m.userId}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}
                >
                  <span className="avatar" style={{ width: 40, height: 40, fontSize: 14, background: m.color }}>{m.initials}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600 }}>{m.name}</div>
                    <div className="muted" style={{ fontSize: 13 }}>{m.email}</div>
                  </div>
                  <span className="chip" style={{ background: rs.bg, color: rs.fg }}>{m.role}</span>
                  <DropDownButtonComponent
                    cssClass="tc-kebab"
                    items={[{ text: 'Change Role' }, { text: 'Remove from Workspace' }]}
                    select={() => { /* WIRE: role change / remove */ }}
                  >⋮</DropDownButtonComponent>
                </div>
              )
            })}
          </div>
        </main>
      </div>

      <Modal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite Member"
        footer={
          <>
            <ButtonComponent cssClass="e-flat" onClick={() => setInviteOpen(false)}>Cancel</ButtonComponent>
            <ButtonComponent cssClass="e-primary" onClick={() => { /* WIRE: invite(inviteEmail) */ setInviteOpen(false); setInviteEmail('') }}>Send Invite</ButtonComponent>
          </>
        }
      >
        <label>
          <span style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Email address</span>
          <TextBoxComponent type="email" placeholder="teammate@example.com" value={inviteEmail} input={(e) => setInviteEmail(e.value)} />
        </label>
      </Modal>
    </div>
  )
}

export default Members
