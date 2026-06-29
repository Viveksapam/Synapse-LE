import React from 'react';
import PropTypes from 'prop-types';

const CHIPS = [
  { icon: '💡', label: 'Share an idea', hint: 'I have an idea about…' },
  { icon: '⚔️', label: 'Start a debate', hint: 'I argue that…' },
  { icon: '📌', label: 'Post a fact', hint: 'Did you know that…' },
  { icon: '❓', label: 'Ask a question', hint: "I'm curious about…" },
];

const CreatePostChips = ({ onPick }) => (
  <div>
    <p style={{ margin: '0 0 12px', fontSize: '0.78rem', color: 'var(--v2-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
      Start a discussion
    </p>
    <div className="vs-create-chips" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      {CHIPS.map(({ icon, label, hint }) => (
        <button
          key={label}
          onClick={() => onPick(hint)}
          style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            padding: '8px 14px', borderRadius: '8px',
            border: '1px solid var(--glass-border)', background: 'transparent',
            color: 'var(--v2-text-main)', fontSize: '0.85rem',
            cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--glass-bg)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <span style={{ fontSize: '1rem' }}>{icon}</span>
          {label}
        </button>
      ))}
    </div>
  </div>
);

CreatePostChips.propTypes = {
  onPick: PropTypes.func.isRequired,
};

export default CreatePostChips;
