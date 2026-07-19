import { useState, useEffect } from 'react'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import Modal from './Modal'

function Field({ label, error, children }) {
  return (
    <label style={{ display: 'block' }}>
      <span style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{label}</span>
      {children}
      {error && (
        <span style={{ display: 'block', color: 'var(--danger)', fontSize: 12, marginTop: 4 }}>{error}</span>
      )}
    </label>
  )
}

function ProfileEditModal({ open, onClose, user, onSave }) {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', bio: '', department: '', location: '',
  })
  const [errors, setErrors] = useState({})
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        department: user.department || '',
        location: user.location || '',
      })
      setSaveSuccess(false)
    }
  }, [user, open])

  const setField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address'
    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) newErrors.phone = 'Please enter a valid phone number'
    if (formData.bio && formData.bio.length > 500) newErrors.bio = 'Bio must not exceed 500 characters'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
    }
  }

  const getInitials = () => {
    const first = formData.firstName?.charAt(0) || '?'
    const last = formData.lastName?.charAt(0) || ''
    return (first + last).toUpperCase()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Profile"
      footer={
        <>
          <ButtonComponent cssClass="e-flat" onClick={onClose}>Cancel</ButtonComponent>
          <ButtonComponent cssClass="e-primary" onClick={handleSave}>Save Changes</ButtonComponent>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {saveSuccess && (
          <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(22,163,74,0.12)', color: 'var(--success)', fontWeight: 600 }}>
            Profile updated successfully!
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <span className="avatar" style={{ width: 80, height: 80, fontSize: 32 }}>{getInitials()}</span>
          <p className="muted" style={{ fontSize: 14, textAlign: 'center' }}>
            Your profile picture will be displayed across the platform
          </p>
        </div>

        <hr className="divider" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label="First Name" error={errors.firstName}>
            <TextBoxComponent value={formData.firstName} input={(e) => setField('firstName', e.value)} />
          </Field>
          <Field label="Last Name">
            <TextBoxComponent value={formData.lastName} input={(e) => setField('lastName', e.value)} />
          </Field>
        </div>

        <Field label="Email Address" error={errors.email}>
          <TextBoxComponent type="email" value={formData.email} input={(e) => setField('email', e.value)} />
        </Field>

        <Field label="Phone Number" error={errors.phone}>
          <TextBoxComponent value={formData.phone} input={(e) => setField('phone', e.value)} placeholder="+1 (555) 000-0000" />
        </Field>

        <Field label="Department / Role">
          <TextBoxComponent value={formData.department} input={(e) => setField('department', e.value)} placeholder="e.g., Software Engineer, Product Manager" />
        </Field>

        <Field label="Location">
          <TextBoxComponent value={formData.location} input={(e) => setField('location', e.value)} placeholder="e.g., San Francisco, USA" />
        </Field>

        <Field label="Bio" error={errors.bio}>
          <TextBoxComponent multiline={true} value={formData.bio} input={(e) => setField('bio', e.value)} placeholder="Tell us about yourself..." />
          <span className="muted" style={{ display: 'block', fontSize: 12, marginTop: 4 }}>{formData.bio.length}/500</span>
        </Field>
      </div>
    </Modal>
  )
}

export default ProfileEditModal
