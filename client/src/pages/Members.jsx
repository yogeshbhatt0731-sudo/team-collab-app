import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns'
import { DropDownButtonComponent } from '@syncfusion/ej2-react-splitbuttons'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Modal from '../components/Modal'
import { getWorkspaces, getWorkspaceMembers } from '../services/workspaceService'

const ROLE_STYLE = {
  OWNER: { bg: '#fef3c7', fg: '#92400e' },
  DEVELOPER: { bg: '#dbeafe', fg: '#1e40af' },
  QA: { bg: '#ede9fe', fg: '#6d28d9' },
}

const ROLES = ['OWNER', 'MEMBER'].map((r) => ({ value: r, text: r }))

/**
 * Members page template. Mock list; WIRE to your workspace members endpoint.
 *   list:   GET workspace members
 *   invite: POST invite (email)
 *   role:   PATCH member role   ·   remove: DELETE member
 */
const initialsOf = (name = '') => name.split(' ').map((w) => w[0]).filter(Boolean).join('').slice(0, 2).toUpperCase() || '?'

function Members() {
  const { workspaceId } = useParams()
  const navigate = useNavigate()
  const [members, setMembers] = useState([])
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteError, setInviteError] = useState('')
  const [roleOpen, setRoleOpen] = useState(false)
  const [removeOpen, setRemoveOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [newRole, setNewRole] = useState('')
  const [workspaces, setWorkspaces] = useState([])
  const [addToWorkspaceOpen, setAddToWorkspaceOpen] = useState(false)
  const [memberToAdd, setMemberToAdd] = useState(null)
  const [targetWorkspaceId, setTargetWorkspaceId] = useState('')

  const loadMembers = async () => {
    const wsId = workspaceId || localStorage.getItem('active_workspace_id')
    if (!wsId) return
    try {
      const data = await getWorkspaceMembers(wsId)
      setMembers((data || []).map((m) => ({
        userId: m.userId,
        name: m.name,
        email: m.email,
        initials: initialsOf(m.name),
        color: m.avatarColor || '#475467',
        role: m.role,
      })))
    } catch {
      setMembers([])
    }
  }

  useEffect(() => {
    loadMembers()
    if (!workspaceId) {
      getWorkspaces().then(setWorkspaces).catch(() => setWorkspaces([]))
    }
  }, [workspaceId]) // eslint-disable-line react-hooks/exhaustive-deps

  const onMemberMenu = (member, text) => {
    setSelectedMember(member)
    if (text === 'Change Role') { setNewRole(member.role); setRoleOpen(true) }
    else if (text === 'Remove from Workspace') setRemoveOpen(true)
  }

  // WIRE: invite flow via email — backend endpoint not built yet.
  // For now: modal collects email, shows a placeholder message.
  const submitInvite = () => {
    const email = inviteEmail.trim().toLowerCase()
    if (!email || !email.includes('@')) {
      setInviteError('Enter a valid email address.')
      return
    }
    if (members.some((member) => member.email.toLowerCase() === email)) {
      setInviteError('This user is already a workspace member.')
      return
    }
    // TODO: POST /workspaces/{workspaceId}/invite { email } → then loadMembers()
    setInviteError('Invite flow not wired yet — add users directly in workspace_user table for testing.')
    return
  }

  const addExistingMember = () => {
    if (!memberToAdd || !targetWorkspaceId) return
    // TODO: POST /workspaces/{targetWorkspaceId}/members { userId } → then loadMembers()
    setTargetWorkspaceId('')
    setMemberToAdd(null)
    setAddToWorkspaceOpen(false)
  }

  // TODO: PATCH /workspaces/{workspaceId}/members/{userId}/role { role } → then loadMembers()
  const submitRole = () => {
    setRoleOpen(false)
    setSelectedMember(null)
  }

  // TODO: DELETE /workspaces/{workspaceId}/members/{userId} → then loadMembers()
  const confirmRemove = () => {
    setRemoveOpen(false)
    setSelectedMember(null)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--app-bg)', color: 'var(--text)' }}>
      <Sidebar />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Header userName={JSON.parse(localStorage.getItem('current_user') || '{}').name || 'User'} />

        <main style={{ flex: 1, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
            <div>
              {workspaceId && (
                <ButtonComponent cssClass="e-flat" style={{ marginBottom: 8 }} onClick={() => navigate(`/workspace/${workspaceId}`)}>← Back to workspace</ButtonComponent>
              )}
              <h4 style={{ fontSize: '1.75rem', marginBottom: 8 }}>Members</h4>
              <p className="muted" style={{ fontSize: 16 }}>People with access to this workspace{workspaceId ? ` (Workspace #${workspaceId})` : ''}</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {!workspaceId && <ButtonComponent cssClass="e-outline" onClick={() => setAddToWorkspaceOpen(true)}>Add to Workspace</ButtonComponent>}
              <ButtonComponent cssClass="e-primary" onClick={() => setInviteOpen(true)}>+ Invite Member</ButtonComponent>
            </div>
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
            <ButtonComponent cssClass="e-primary" onClick={submitInvite}>Add Member</ButtonComponent>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Email address</span>
            <TextBoxComponent type="email" placeholder="teammate@example.com" value={inviteEmail} input={(e) => { setInviteEmail(e.value); setInviteError('') }} />
          </label>
          {inviteError && <p style={{ margin: 0, color: 'var(--danger)', fontSize: 13 }}>{inviteError}</p>}
        </div>
      </Modal>

      <Modal open={addToWorkspaceOpen} onClose={() => setAddToWorkspaceOpen(false)} title="Add Member to Workspace" footer={<><ButtonComponent cssClass="e-flat" onClick={() => setAddToWorkspaceOpen(false)}>Cancel</ButtonComponent><ButtonComponent cssClass="e-primary" disabled={!memberToAdd || !targetWorkspaceId} onClick={addExistingMember}>Add Member</ButtonComponent></>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label><span style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Member</span><DropDownListComponent dataSource={members} fields={{ text: 'name', value: 'email' }} placeholder="Select member" change={(event) => setMemberToAdd(members.find((member) => member.email === event.value) || null)} /></label>
          <label><span style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Workspace</span><DropDownListComponent dataSource={workspaces} fields={{ text: 'name', value: 'workspace_id' }} placeholder="Select workspace" change={(event) => setTargetWorkspaceId(event.value)} /></label>
        </div>
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
