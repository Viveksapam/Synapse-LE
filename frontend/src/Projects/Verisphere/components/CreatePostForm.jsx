import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { postCreatePost } from '../api/verisphereApi';
import { useAuth } from '../../../hooks/useAuth';
import CreatePostChips from './CreatePostChips';

const fieldStyle = {
  width: '100%', background: 'transparent', border: 'none',
  borderBottom: '1px solid var(--glass-border)', color: 'var(--v2-text-main)',
  padding: '10px 0', outline: 'none',
  fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', boxSizing: 'border-box',
};

const CreatePostForm = ({ numCommunityId = null, onPostCreated }) => {
  const { boolIsLoggedInState, strTokenState } = useAuth();
  const [strTitleState, setStrTitleState] = useState('');
  const [strContentState, setStrContentState] = useState('');
  const [strReferencesState, setStrReferencesState] = useState('');
  const [strMediaUrlState, setStrMediaUrlState] = useState('');
  const [boolIsSubmittingState, setBoolIsSubmittingState] = useState(false);
  const [boolIsExpandedState, setBoolIsExpandedState] = useState(false);

  const boolCanSubmit = strTitleState.trim() && strContentState.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!boolIsLoggedInState || !boolCanSubmit) return;
    setBoolIsSubmittingState(true);
    try {
      await postCreatePost({
        strTitle: strTitleState, strContent: strContentState,
        strReferences: strReferencesState, strMediaUrl: strMediaUrlState,
        objCommunity: numCommunityId || 1,
      }, strTokenState);
      setStrTitleState(''); setStrContentState('');
      setStrReferencesState(''); setStrMediaUrlState('');
      setBoolIsExpandedState(false);
      if (onPostCreated) onPostCreated();
    } catch (objErr) {
      console.error('Failed to create post', objErr);
      alert('Failed to submit topic. Ensure you are logged in.');
    } finally {
      setBoolIsSubmittingState(false);
    }
  };

  if (!boolIsLoggedInState) return null;

  return (
    <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '16px 20px', marginBottom: '24px' }}>
      {!boolIsExpandedState ? (
        <CreatePostChips onPick={(strHint) => { setStrContentState(strHint); setBoolIsExpandedState(true); }} />
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="text" placeholder="Title" value={strTitleState}
            onChange={(e) => setStrTitleState(e.target.value)} required autoFocus
            style={{ ...fieldStyle, fontSize: '1.1rem', fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif" }}
          />
          <textarea
            placeholder="State your ideas…" value={strContentState}
            onChange={(e) => setStrContentState(e.target.value)} required
            style={{ ...fieldStyle, minHeight: '72px', resize: 'vertical', lineHeight: '1.6' }}
          />
          <input type="text" placeholder="Sources and links (optional)" value={strReferencesState} onChange={(e) => setStrReferencesState(e.target.value)} style={fieldStyle} />
          <input type="url" placeholder="Media URL (optional)" value={strMediaUrlState} onChange={(e) => setStrMediaUrlState(e.target.value)} style={fieldStyle} />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
            <button
              type="button" onClick={() => setBoolIsExpandedState(false)}
              style={{ background: 'transparent', border: 'none', color: 'var(--v2-text-muted)', cursor: 'pointer', padding: '7px 16px', borderRadius: '8px', fontFamily: 'inherit', fontSize: '0.85rem' }}
            >
              Cancel
            </button>
            <button
              type="submit" disabled={boolIsSubmittingState || !boolCanSubmit}
              style={{
                background: 'var(--v2-text-main)', color: 'var(--v2-bg, #fff)', border: 'none',
                padding: '7px 22px', borderRadius: '8px',
                cursor: boolCanSubmit ? 'pointer' : 'not-allowed', opacity: boolCanSubmit ? 1 : 0.4,
                fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.85rem', fontWeight: 600,
                transition: 'opacity 0.15s',
              }}
            >
              {boolIsSubmittingState ? 'Posting…' : 'Post'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

CreatePostForm.propTypes = {
  numCommunityId: PropTypes.number,
  onPostCreated: PropTypes.func,
};

export default CreatePostForm;
