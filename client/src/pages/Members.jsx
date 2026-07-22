import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns'
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

// The backend Role enum is OWNER / MEMBER; DEVELOPER / QA are legacy mock labels kept so
// existing rows prefill correctly. WIRE: use the real Role values your API returns.
const ROLES = ['OWNER', 'MEMBER', 'DEVELOPER', 'QA'].map((r) => ({ value: r, text: r }))

/**
 * Members page template. Mock list; WIRE to your workspace members endpoint.
 *   list:   GET workspace members
 *   invite: POST invite (email)
 *   role:   PATCH member role   ·   remove: DELETE member
 */
function Members() {
  // Members belong to a workspace. Reached via /workspace/:workspaceId/members (scoped) or the
  // bare /members sidebar link (workspaceId undefined -> mock/all).
  const { workspaceId } = useParams()
  const navigate = useNavigate()
  const [members, setMembers] = useState(MEMBERS) // WIRE: useMembers(workspaceId).data -> GET workspace members
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [roleOpen, setRoleOpen] = useState(false)
  const [removeOpen, setRemoveOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [newRole, setNewRole] = useState('')

  const onMemberMenu = (member, text) => {
    setSelectedMember(member)
    if (text === 'Change Role') { setNewRole(member.role); setRoleOpen(true) }
    else if (text === 'Remove from Workspace') setRemoveOpen(true)
  }

  // Mock: mutate local state. WIRE: call the API then refetch.
  const submitRole = () => {
    setMembers((prev) => prev.map((m) => (m.userId === selectedMember.userId ? { ...m, role: newRole } : m)))
    // WIRE: await changeRole(selectedMember.userId, newRole); await loadMembers()
    setRoleOpen(false)
    setSelectedMember(null)
  }

  const confirmRemove = () => {
    setMembers((prev) => prev.filter((m) => m.userId !== selectedMember.userId))
    // WIRE: await removeMember(selectedMember.userId); await loadMembers()
    setRemoveOpen(false)
    setSelectedMember(null)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--app-bg)', color: 'var(--text)' }}>
      <Sidebar />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Header userName="Yogesh Bhatt" />

        <main style={{ flex: 1, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
            <div>
              {workspaceId && (
                <ButtonComponent cssClass="e-flat" style={{ marginBottom: 8 }} onClick={() => navigate(`/workspace/${workspaceId}`)}>← Back to workspace</ButtonComponent>
              )}
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
                    select={(args) => onMemberMenu(m, args.item.text)}
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
            <ButtonComponent cssClass="e-primary" onClick={() => { /* WIRE: invite(workspaceId, inviteEmail) */ setInviteOpen(false); setInviteEmail('') }}>Send Invite</ButtonComponent>
          </>
        }
      >
        <label>
          <span style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Email address</span>
          <TextBoxComponent type="email" placeholder="teammate@example.com" value={inviteEmail} input={(e) => setInviteEmail(e.value)} />
        </label>
      </Modal>

      <Modal
        open={roleOpen}
        onClose={() => setRoleOpen(false)}
        title="Change Role"
        width={440}
        footer={
          <>
            <ButtonComponent cssClass="e-flat" onClick={() => setRoleOpen(false)}>Cancel</ButtonComponent>
            <ButtonComponent cssClass="e-primary" onClick={submitRole}>Save Role</ButtonComponent>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p className="muted" style={{ fontSize: 14 }}>Set the role for <strong>{selectedMember?.name}</strong>.</p>
          <label>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Role</span>
            <DropDownListComponent dataSource={ROLES} fields={{ text: 'text', value: 'value' }} value={newRole} change={(e) => setNewRole(e.value)} />
          </label>
        </div>
      </Modal>

      <Modal
        open={removeOpen}
        onClose={() => setRemoveOpen(false)}
        title="Remove Member?"
        width={440}
        footer={
          <>
            <ButtonComponent cssClass="e-flat" onClick={() => setRemoveOpen(false)}>Cancel</ButtonComponent>
            <ButtonComponent cssClass="e-danger" onClick={confirmRemove}>Remove</ButtonComponent>
          </>
        }
      >
        <p>Remove <strong>{selectedMember?.name}</strong> from this workspace? They will lose access to its projects.</p>
      </Modal>
    </div>
  )
}

export default Members
