import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { profileInputStyle, profileBtnBase, formatDate } from './ProfileStyles';

const ProfileBanner = ({ user, isEditing, editForm, setEditForm, isSaving, onSave, onCancel, onStartEdit }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const objFile = e.target.files[0];
    if (!objFile) return;
    if (objFile.size > 2 * 1024 * 1024) { alert('Image too large – max 2 MB'); return; }
    const reader = new FileReader();
    reader.onloadend = () => setEditForm((prev) => ({ ...prev, strProfilePicUrl: reader.result }));
    reader.readAsDataURL(objFile);
  };

  const strAvatarUrl = isEditing ? editForm.strProfilePicUrl : user.strProfilePicUrl;
  const strDisplayName = (user.first_name || user.last_name)
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
    : user.username;
  const strRole = user.is_superuser ? 'Admin' : (user.is_staff ? 'Staff' : 'User');

  return (
    <div className="vs-profile-banner" style={{
      borderBottom: '1px solid var(--glass-border)', padding: '24px 36px',
      display: 'flex', alignItems: 'center', gap: '20px', position: 'relative',
    }} aria-label="Profile banner">
      <div style={{ position: 'absolute', top: '20px', right: '28px', display: 'flex', gap: '8px' }}>
        {isEditing ? (
          <>
            <button onClick={onCancel} style={{ ...profileBtnBase, border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--v2-text-muted)' }}>Cancel</button>
            <button onClick={onSave} disabled={isSaving} style={{ ...profileBtnBase, border: 'none', background: 'var(--v2-text-main)', color: 'var(--v2-bg, #0f172a)' }}>
              {isSaving ? 'Saving…' : 'Save'}
            </button>
          </>
        ) : (
          <button onClick={onStartEdit} style={{ ...profileBtnBase, border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--v2-text-main)' }}>Edit Profile</button>
        )}
      </div>

      <div
        onClick={() => isEditing && fileInputRef.current?.click()}
        style={{
          width: '64px', height: '64px', borderRadius: '10px', flexShrink: 0,
          background: strAvatarUrl ? `url(${strAvatarUrl}) center/cover` : 'var(--glass-border)',
          border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '26px', fontWeight: 600, color: 'var(--v2-text-muted)',
          cursor: isEditing ? 'pointer' : 'default', position: 'relative', userSelect: 'none',
        }}
      >
        {!strAvatarUrl && user.username.charAt(0).toUpperCase()}
        {isEditing && (
          <div style={{ position: 'absolute', inset: 0, borderRadius: '10px', background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#fff', letterSpacing: '0.06em' }}>
            UPLOAD
          </div>
        )}
      </div>
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />

      <div style={{ flex: 1, minWidth: 0 }}>
        {isEditing ? (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
            <input type="text" value={editForm.first_name} placeholder="First name" onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })} style={profileInputStyle} />
            <input type="text" value={editForm.last_name} placeholder="Last name" onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })} style={profileInputStyle} />
          </div>
        ) : (
          <h2 style={{ margin: '0 0 3px', fontSize: '1.25rem', fontFamily: "'Space Grotesk', sans-serif", color: 'var(--v2-text-main)', fontWeight: 600, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {strDisplayName}
          </h2>
        )}

        <p style={{ margin: '0 0 8px', color: 'var(--v2-text-muted)', fontSize: '0.82rem' }}>@{user.username}</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'nowrap' }}>
          <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--v2-text-muted)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
            {strRole}
          </span>
          <span style={{ color: 'var(--v2-text-muted)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
            Joined {formatDate(user.date_joined)}
          </span>
        </div>
      </div>
    </div>
  );
};

ProfileBanner.propTypes = {
  user: PropTypes.object.isRequired,
  isEditing: PropTypes.bool.isRequired,
  editForm: PropTypes.object.isRequired,
  setEditForm: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onStartEdit: PropTypes.func.isRequired,
};

export default ProfileBanner;
