import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SwitchComponent, ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Modal from '../components/Modal'

const defaultUser = { id: '', name: 'User', firstName: 'User', email: '', role: '' }

function Toggle({ checked, onChange }) {
  return <SwitchComponent checked={checked} change={() => onChange()} />
}

function SettingCard({ title, accent, danger, children }) {
  return (
    <div
      className="card"
      style={{ boxShadow: 'none', marginBottom: 24, padding: 24, border: danger ? '2px solid var(--danger)' : undefined }}
    >
      <h6 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, color: danger ? 'var(--danger)' : 'var(--text)' }}>
        {accent && <span style={{ width: 4, height: 24, borderRadius: 2, background: 'var(--blue)' }} />}
        {title}
      </h6>
      <hr className="divider" style={{ margin: '16px 0' }} />
      {children}
    </div>
  )
}

function ToggleRow({ title, desc, checked, onChange }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: 16, background: 'rgba(148,163,184,0.1)', borderRadius: 8 }}>
      <div>
        <div style={{ fontWeight: 600 }}>{title}</div>
        <div className="muted" style={{ fontSize: 13 }}>{desc}</div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  )
}

const NOTIF_ROWS = [
  { key: 'emailNotifications', title: 'Email Notifications', desc: 'Receive email updates about your account' },
  { key: 'taskAssignments', title: 'Task Assignments', desc: 'Get notified when tasks are assigned to you' },
  { key: 'comments', title: 'Comments & Updates', desc: 'Receive notifications for new comments on your tasks' },
  { key: 'mentions', title: 'Mentions', desc: 'Notify me when someone mentions me' },
  { key: 'weeklyDigest', title: 'Weekly Digest', desc: 'Receive a weekly summary of your activities' },
]

const PRIVACY_ROWS = [
  { key: 'publicProfile', title: 'Public Profile', desc: 'Make your profile visible to other users' },
  { key: 'allowMessagesFromAnyone', title: 'Allow Direct Messages', desc: 'Allow anyone to message you' },
  { key: 'showOnlineStatus', title: 'Show Online Status', desc: 'Let others see when you are online' },
  { key: 'dataCollection', title: 'Analytics & Data Collection', desc: 'Help us improve by sharing usage analytics' },
]

const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }

function Settings({ themeMode, onThemeModeChange }) {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(defaultUser)
  const [editedUser, setEditedUser] = useState(defaultUser)
  const [isEditing, setIsEditing] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const [notificationSettings, setNotificationSettings] = useState(() => {
    const saved = localStorage.getItem('notification_settings')
    return saved ? JSON.parse(saved) : {
      emailNotifications: true, taskAssignments: true, comments: true, mentions: true, weeklyDigest: false,
    }
  })

  const [privacySettings, setPrivacySettings] = useState(() => {
    const saved = localStorage.getItem('privacy_settings')
    return saved ? JSON.parse(saved) : {
      publicProfile: false, allowMessagesFromAnyone: true, showOnlineStatus: true, dataCollection: false,
    }
  })

  const token = localStorage.getItem('clove_access_token')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    const storedUser = localStorage.getItem('current_user')
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setCurrentUser(user)
      setEditedUser(user)
    }
  }, [token, navigate])

  useEffect(() => {
    localStorage.setItem('notification_settings', JSON.stringify(notificationSettings))
  }, [notificationSettings])

  useEffect(() => {
    localStorage.setItem('privacy_settings', JSON.stringify(privacySettings))
  }, [privacySettings])

  const flash = (msg) => {
    setSuccessMessage(msg)
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const handleEditChange = (field, value) => setEditedUser({ ...editedUser, [field]: value })

  const handleSaveProfile = () => {
    localStorage.setItem('current_user', JSON.stringify(editedUser))
    setCurrentUser(editedUser)
    setIsEditing(false)
    flash('Profile updated successfully!')
  }

  const handleNotificationChange = (setting) => {
    setNotificationSettings({ ...notificationSettings, [setting]: !notificationSettings[setting] })
    flash('Notification preference updated!')
  }

  const handlePrivacyChange = (setting) => {
    setPrivacySettings({ ...privacySettings, [setting]: !privacySettings[setting] })
    flash('Privacy setting updated!')
  }

  const handleConfirmDelete = () => {
    localStorage.removeItem('current_user')
    localStorage.removeItem('clove_access_token')
    localStorage.removeItem('active_workspace_id')
    setOpenDeleteDialog(false)
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--app-bg)', color: 'var(--text)' }}>
      <Sidebar />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Header userName={currentUser.name} />

        <main style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          <div style={{ marginBottom: 32 }}>
            <h4 style={{ fontSize: '1.75rem', marginBottom: 8 }}>Settings</h4>
            <p className="muted" style={{ fontSize: 16 }}>Manage your profile, preferences, and account settings</p>
          </div>

          {successMessage && (
            <div style={{ marginBottom: 24, padding: '10px 14px', borderRadius: 8, background: 'rgba(22,163,74,0.12)', color: 'var(--success)', fontWeight: 600 }}>
              {successMessage}
            </div>
          )}

          <div style={{ maxWidth: 900 }}>
            {/* Profile */}
            <SettingCard title="Profile Settings" accent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                  <span className="avatar" style={{ width: 80, height: 80, fontSize: 32 }}>
                    {currentUser.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                  <div>
                    <h6 style={{ fontSize: 18, marginBottom: 6 }}>{currentUser.name}</h6>
                    <div className="muted" style={{ fontSize: 13 }}>{currentUser.email}</div>
                    <div style={{ marginTop: 8 }}>
                      <ButtonComponent cssClass="e-flat">Change Avatar</ButtonComponent>
                    </div>
                  </div>
                </div>

                <hr className="divider" />

                {isEditing ? (
                  <>
                    <label>
                      <span style={labelStyle}>Full Name</span>
                      <TextBoxComponent value={editedUser.name || ''} input={(e) => handleEditChange('name', e.value)} />
                    </label>
                    <label>
                      <span style={labelStyle}>Email</span>
                      <TextBoxComponent type="email" value={editedUser.email || ''} input={(e) => handleEditChange('email', e.value)} />
                    </label>
                    <label>
                      <span style={labelStyle}>Role</span>
                      <TextBoxComponent value={editedUser.role || ''} input={(e) => handleEditChange('role', e.value)} />
                    </label>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <ButtonComponent cssClass="e-primary" onClick={handleSaveProfile}>Save Changes</ButtonComponent>
                      <ButtonComponent cssClass="e-outline" onClick={() => { setEditedUser(currentUser); setIsEditing(false) }}>Cancel</ButtonComponent>
                    </div>
                  </>
                ) : (
                  <>
                    {[
                      ['Full Name', currentUser.name],
                      ['Email', currentUser.email],
                      ['Role', currentUser.role],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <div className="muted" style={{ fontSize: 12, marginBottom: 4 }}>{label}</div>
                        <div style={{ fontWeight: 600 }}>{value}</div>
                      </div>
                    ))}
                    <div style={{ alignSelf: 'flex-start' }}>
                      <ButtonComponent cssClass="e-outline" onClick={() => setIsEditing(true)}>Edit Profile</ButtonComponent>
                    </div>
                  </>
                )}
              </div>
            </SettingCard>

            {/* Theme */}
            <SettingCard title={`${themeMode === 'light' ? '☀️' : '🌙'} Theme & Appearance`}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <ToggleRow
                  title="Dark Mode"
                  desc="Switch between light and dark theme"
                  checked={themeMode === 'dark'}
                  onChange={() => onThemeModeChange(themeMode === 'light' ? 'dark' : 'light')}
                />
                <p className="muted" style={{ fontSize: 12 }}>
                  Current Theme: <strong>{themeMode === 'light' ? 'Light Mode' : 'Dark Mode'}</strong>
                </p>
              </div>
            </SettingCard>

            {/* Notifications */}
            <SettingCard title="🔔 Notification Preferences">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {NOTIF_ROWS.map((row) => (
                  <ToggleRow
                    key={row.key}
                    title={row.title}
                    desc={row.desc}
                    checked={notificationSettings[row.key]}
                    onChange={() => handleNotificationChange(row.key)}
                  />
                ))}
              </div>
            </SettingCard>

            {/* Privacy */}
            <SettingCard title="🔒 Privacy & Security">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {PRIVACY_ROWS.map((row) => (
                  <ToggleRow
                    key={row.key}
                    title={row.title}
                    desc={row.desc}
                    checked={privacySettings[row.key]}
                    onChange={() => handlePrivacyChange(row.key)}
                  />
                ))}
                <div style={{ alignSelf: 'flex-start' }}>
                  <ButtonComponent cssClass="e-outline">Change Password</ButtonComponent>
                </div>
              </div>
            </SettingCard>

            {/* Danger zone */}
            <SettingCard title="⚠️ Danger Zone" danger>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Delete Account</div>
                <p className="muted" style={{ fontSize: 13, marginBottom: 16 }}>
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <ButtonComponent cssClass="e-danger" onClick={() => setOpenDeleteDialog(true)}>
                  Delete My Account
                </ButtonComponent>
              </div>
            </SettingCard>
          </div>
        </main>
      </div>

      <Modal
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        title="Delete Account?"
        footer={
          <>
            <ButtonComponent cssClass="e-flat" onClick={() => setOpenDeleteDialog(false)}>Cancel</ButtonComponent>
            <ButtonComponent cssClass="e-danger" onClick={handleConfirmDelete}>Yes, Delete My Account</ButtonComponent>
          </>
        }
      >
        <div style={{ padding: '12px 14px', borderRadius: 8, background: 'rgba(220,38,38,0.1)', color: 'var(--danger)' }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>This action is permanent!</div>
          Deleting your account will:
          <ul style={{ marginTop: 8, marginBottom: 0 }}>
            <li>Remove all your personal data</li>
            <li>Delete all workspaces you own</li>
            <li>Remove you from all shared workspaces</li>
            <li>Cancel all active tasks and assignments</li>
          </ul>
        </div>
      </Modal>
    </div>
  )
}

export default Settings
