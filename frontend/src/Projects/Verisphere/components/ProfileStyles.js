export const profileCardStyle = {
  background: 'var(--glass-bg)',
  border: '1px solid var(--glass-border)',
  borderRadius: '12px',
  padding: '20px 24px',
};

export const profileLabelStyle = {
  fontSize: '0.75rem',
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--v2-text-muted)',
  marginBottom: '12px',
};

export const profileInputStyle = {
  flex: 1,
  background: 'var(--glass-bg)',
  border: '1px solid var(--glass-border)',
  color: 'var(--v2-text-main)',
  borderRadius: '8px',
  padding: '8px 12px',
  fontFamily: 'inherit',
  fontSize: '0.95rem',
  outline: 'none',
};

export const profileBtnBase = {
  padding: '7px 16px',
  borderRadius: '8px',
  fontFamily: 'inherit',
  fontSize: '0.82rem',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'opacity 0.15s',
};

export const formatDate = (strIso) => {
  if (!strIso) return 'N/A';
  const d = new Date(strIso);
  return isNaN(d) ? 'N/A' : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};
