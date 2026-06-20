export const fade_delay = 0;
export const fade_duration = 600;


/* ── Shared MUI sx styles ────────────────────────────────────── */

/** Base style for pill-shaped action buttons (landing, gallery, exhibits). */
export const actionButtonSx = {
  fontSize: '1.05em',
  fontWeight: 600,
  letterSpacing: '2px',
  py: 1.5,
  px: 4,
  color: '#495057',
  border: 2,
  borderColor: '#dee2e6',
  backgroundColor: 'rgba(248, 249, 250, 0.8)',
  backdropFilter: 'blur(4px)',
  borderRadius: '12px',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '#495057',
    borderColor: '#495057',
    color: '#ffffff',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)',
  }
};

/** Smaller variant used for the BACK button and similar. */
export const smallButtonSx = {
  fontSize: '0.85em',
  fontWeight: 600,
  letterSpacing: '1.5px',
  py: 1,
  px: 3,
  color: '#6c757d',
  border: 2,
  borderColor: '#dee2e6',
  backgroundColor: 'rgba(248, 249, 250, 0.8)',
  backdropFilter: 'blur(4px)',
  borderRadius: '10px',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '#6c757d',
    borderColor: '#6c757d',
    color: '#ffffff',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.10)',
  }
};

/**
 * @param isActive  Whether this exhibit tab is currently selected.
 * @returns An sx object for an exhibit-tab button.
 */
export const exhibitTabSx = (isActive: boolean) => ({
  fontSize: '0.95em',
  fontWeight: 600,
  letterSpacing: '1.5px',
  py: 1.2,
  px: 3.5,
  color: isActive ? '#ffffff' : '#495057',
  border: 2,
  borderColor: isActive ? '#495057' : '#dee2e6',
  backgroundColor: isActive ? '#495057' : 'rgba(248, 249, 250, 0.8)',
  backdropFilter: 'blur(4px)',
  borderRadius: '12px',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: isActive ? '#343a40' : '#495057',
    borderColor: '#495057',
    color: '#ffffff',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)',
  }
});

/** Deprecated — prefer actionButtonSx for new code. */
export const selectionButtonSx = {color: 'gray', border: 2, borderRadius: 3, padding: 2, margin: 1}