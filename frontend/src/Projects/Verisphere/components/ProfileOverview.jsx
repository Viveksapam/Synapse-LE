import React from 'react';
import PropTypes from 'prop-types';
import { profileCardStyle, profileLabelStyle, profileInputStyle } from './ProfileStyles';

const ProfileOverview = ({ user, isEditing, editForm, setEditForm, postCount, isLoadingPosts }) => (
  <div className="vs-profile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: '20px' }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={profileCardStyle}>
        <p style={{ ...profileLabelStyle, margin: '0 0 12px' }}>About Me</p>
        {isEditing ? (
          <textarea
            value={editForm.strBio}
            onChange={(e) => setEditForm({ ...editForm, strBio: e.target.value })}
            placeholder="Tell the community about your expertise…"
            style={{ ...profileInputStyle, width: '100%', minHeight: '90px', resize: 'vertical', boxSizing: 'border-box', flex: 'none' }}
          />
        ) : (
          <p style={{ color: 'var(--v2-text-muted)', lineHeight: '1.6', margin: 0, fontSize: '0.9rem' }}>
            {user.strBio || 'No biography provided yet.'}
          </p>
        )}
      </div>

      <div style={profileCardStyle}>
        <p style={{ ...profileLabelStyle, margin: '0 0 12px' }}>Account Details</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--glass-border)' }}>
          <span style={{ color: 'var(--v2-text-muted)', fontSize: '0.88rem' }}>Email</span>
          <span style={{ color: 'var(--v2-text-main)', fontSize: '0.88rem' }}>{user.email}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
          <span style={{ color: 'var(--v2-text-muted)', fontSize: '0.88rem' }}>Status</span>
          <span style={{ color: 'var(--v2-text-main)', fontSize: '0.88rem', fontWeight: 600 }}>
            {user.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </div>

    <div>
      <div style={profileCardStyle}>
        <p style={{ ...profileLabelStyle, margin: '0 0 12px' }}>Statistics</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--v2-text-muted)', fontSize: '0.88rem' }}>Posts</span>
          <span style={{ color: 'var(--v2-text-main)', fontSize: '1.1rem', fontWeight: 700 }}>
            {isLoadingPosts ? '—' : postCount}
          </span>
        </div>
      </div>
    </div>
  </div>
);

ProfileOverview.propTypes = {
  user: PropTypes.object.isRequired,
  isEditing: PropTypes.bool.isRequired,
  editForm: PropTypes.object.isRequired,
  setEditForm: PropTypes.func.isRequired,
  postCount: PropTypes.number.isRequired,
  isLoadingPosts: PropTypes.bool.isRequired,
};

export default ProfileOverview;
