const C = {
  bg:       '#0a0a09',
  card:     '#0f0f0e',
  border:   '#1f1f1d',
  muted:    '#9a9a98',
  green:    '#4ade80',
  red:      '#f87171',
  text:     '#ffffff',
  text2:    '#f5f5f5',
};

export default function OutputPanel({ output, error, exitCode, duration }) {
  const hasContent = output || error || exitCode !== null;
  const success = exitCode === 0;

  return (
    <div style={{
      height: '100%',
      backgroundColor: C.bg,
      color: C.text2,
      padding: '16px',
      fontFamily: '"Fira Code", "Cascadia Code", "Courier New", monospace',
      fontSize: '13px',
      overflow: 'auto',
      lineHeight: 1.6,
    }}>
      {!hasContent && (
        <div style={{
          height: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '10px',
          opacity: 0.45, userSelect: 'none',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
          </svg>
          <span style={{ fontSize: '13px', color: C.muted }}>No output yet — click Run to execute</span>
        </div>
      )}

      {output && (
        <div style={{ marginBottom: '14px' }}>
          <div style={{
            fontSize: '11px', color: C.muted, fontFamily: 'inherit',
            marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px',
          }}>
            <span style={{ color: C.green }}>▶</span> stdout
          </div>
          <pre style={{
            margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all',
            color: C.text2,
            padding: '10px 12px',
            backgroundColor: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: '7px',
          }}>{output}</pre>
        </div>
      )}

      {error && (
        <div style={{ marginBottom: '14px' }}>
          <div style={{
            fontSize: '11px', color: C.red, fontFamily: 'inherit',
            marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px',
          }}>
            <span>✕</span> stderr
          </div>
          <pre style={{
            margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all',
            color: C.red,
            padding: '10px 12px',
            backgroundColor: 'rgba(248,113,113,0.06)',
            border: '1px solid rgba(248,113,113,0.2)',
            borderRadius: '7px',
          }}>{error}</pre>
        </div>
      )}

      {exitCode !== null && (
        <div style={{
          marginTop: '10px',
          padding: '8px 12px',
          backgroundColor: C.card,
          border: `1px solid ${success ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'}`,
          borderRadius: '7px',
          display: 'flex', alignItems: 'center', gap: '10px',
          fontSize: '12px',
        }}>
          <div style={{
            width: '7px', height: '7px', borderRadius: '50%',
            backgroundColor: success ? C.green : C.red,
            flexShrink: 0,
          }} />
          <span style={{ color: success ? C.green : C.red }}>
            exit {exitCode}
          </span>
          {duration != null && (
            <span style={{ color: C.muted, marginLeft: 'auto' }}>
              {duration}ms
            </span>
          )}
        </div>
      )}
    </div>
  );
}
