import { useState, useEffect, useCallback, useRef } from 'react';
import CodeEditor from './components/CodeEditor';
import OutputPanel from './components/OutputPanel';
import LandingPage from './components/LandingPage';
import { sessionAPI } from './services/api';
import { useCollaboration } from './hooks/useCollaboration';
import { Play, Users, Copy, Check, Code2, ChevronDown, X, Link, Share2 } from 'lucide-react';

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg:          '#0a0a09',
  card:        '#0f0f0e',
  elevated:    '#131312',
  secondary:   '#171716',
  border:      '#1f1f1d',
  borderStrong:'#2a2a27',
  muted:       '#9a9a98',
  green:       '#4ade80',
  greenDim:    'rgba(74,222,128,0.08)',
  greenBorder: 'rgba(74,222,128,0.2)',
  text:        '#ffffff',
  text2:       '#f5f5f5',
};

const generateUserId = () => 'user_' + Math.random().toString(36).substr(2, 9);

// ─── Share Modal ──────────────────────────────────────────────────────────────
function ShareModal({ sessionId, onClose }) {
  const [copied, setCopied] = useState(false);
  const link = `${window.location.origin}?session=${sessionId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      // fallback for environments where clipboard API is restricted
      const el = document.createElement('textarea');
      el.value = link;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    // Backdrop
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        backgroundColor: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
    >
      {/* Card — stop click propagation so backdrop click doesn't close via card */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '480px',
          backgroundColor: C.card,
          border: `1px solid ${C.borderStrong}`,
          borderRadius: '14px',
          padding: '28px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)',
          position: 'relative',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            width: '28px', height: '28px',
            backgroundColor: C.secondary,
            border: `1px solid ${C.border}`,
            borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: C.muted,
            transition: 'color 0.15s, border-color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = C.text; e.currentTarget.style.borderColor = C.borderStrong; }}
          onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.border; }}
        >
          <X size={14} />
        </button>

        {/* Icon + heading */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '38px', height: '38px',
            backgroundColor: C.greenDim,
            border: `1px solid ${C.greenBorder}`,
            borderRadius: '9px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Share2 size={17} color={C.green} />
          </div>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-0.03em', color: C.text }}>
              Share this session
            </h2>
            <p style={{ fontSize: '13px', color: C.muted, marginTop: '2px' }}>
              Anyone with this link can join and collaborate in real time.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: C.border, margin: '20px 0' }} />

        {/* Link label */}
        <div style={{ fontSize: '12px', fontWeight: 500, color: C.muted, marginBottom: '8px', letterSpacing: '0.01em' }}>
          SESSION LINK
        </div>

        {/* Link input + copy button */}
        <div style={{
          display: 'flex', gap: '8px', alignItems: 'stretch',
        }}>
          {/* Link display */}
          <div style={{
            flex: 1,
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 12px',
            backgroundColor: C.elevated,
            border: `1px solid ${C.border}`,
            borderRadius: '8px',
            overflow: 'hidden',
          }}>
            <Link size={13} color={C.muted} style={{ flexShrink: 0 }} />
            <span style={{
              fontSize: '12.5px',
              fontFamily: '"JetBrains Mono", monospace',
              color: C.text2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              letterSpacing: '0',
            }}>
              {link}
            </span>
          </div>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            style={{
              flexShrink: 0,
              padding: '10px 16px',
              backgroundColor: copied ? C.greenDim : C.green,
              color: copied ? C.green : C.bg,
              border: `1px solid ${copied ? C.greenBorder : 'transparent'}`,
              borderRadius: '8px',
              fontSize: '13px', fontWeight: 600,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
              transition: 'all 0.2s',
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
            }}
          >
            {copied
              ? <><Check size={13} />Copied!</>
              : <><Copy size={13} />Copy Link</>
            }
          </button>
        </div>

        {/* Footer hint */}
        <p style={{
          marginTop: '16px', fontSize: '12px', color: C.muted,
          display: 'flex', alignItems: 'center', gap: '5px',
        }}>
          <span style={{ color: C.green }}>●</span>
          No sign-up required — they join instantly.
        </p>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  const [view, setView] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('session') ? 'editor' : 'landing';
  });
  const [sessionId, setSessionId] = useState(null);
  const userIdRef = useRef(generateUserId());
  const userId = userIdRef.current;
  const [code, setCode] = useState('print("Hello, CodeCollab!")');
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [exitCode, setExitCode] = useState(null);
  const [duration, setDuration] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const handleCodeUpdate = useCallback((newCode) => setCode(newCode), []);

  const handleExecutionResult = useCallback((result) => {
    setOutput(result.output || '');
    setError(result.error || '');
    setExitCode(result.exit_code);
    setDuration(result.duration_ms);
    setExecuting(false);
    setExecutingUser(null);
  }, []);

  const handleExecutionStarted = useCallback(() => {
    setExecuting(true);
    setOutput('');
    setError('');
    setExitCode(null);
    setDuration(null);
  }, []);

  const { connected, users, sendCodeChange, executeCode } = useCollaboration(
    sessionId, userId, handleCodeUpdate, handleExecutionResult, handleExecutionStarted
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlSessionId = urlParams.get('session');
    if (urlSessionId) {
      loadSession(urlSessionId);
      setView('editor');
    }
  }, []);

  const loadSession = async (sid) => {
    try {
      const session = await sessionAPI.get(sid);
      setSessionId(session.id);
      setCode(session.code || 'print("Hello, CodeCollab!")');
      setLanguage(session.language);
    } catch {
      createNewSession();
    }
  };

  const createNewSession = async () => {
    try {
      const session = await sessionAPI.create('Untitled Session', language);
      setSessionId(session.id);
      window.history.pushState({}, '', `?session=${session.id}`);
    } catch (e) {
      console.error('Failed to create session:', e);
    }
  };

  const handleStartCoding = () => {
    setView('editor');
    createNewSession();
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (connected) sendCodeChange(newCode);
  };

  const handleRunCode = () => {
    if (connected) {
      setExecuting(true);
      executeCode(language, code);
    }
  };

  // ── Landing page ─────────────────────────────────────────────────────────────
  if (view === 'landing') {
    return <LandingPage onStart={handleStartCoding} />;
  }

  // ── Editor view ──────────────────────────────────────────────────────────────
  return (
    <div style={{
      height: '100vh',
      display: 'flex', flexDirection: 'column',
      backgroundColor: C.bg, color: C.text,
      overflow: 'hidden',
    }}>
      {/* Share modal */}
      {shareOpen && sessionId && (
        <ShareModal sessionId={sessionId} onClose={() => setShareOpen(false)} />
      )}

      {/* ── Header ── */}
      <header style={{
        height: '52px', flexShrink: 0,
        padding: '0 20px',
        backgroundColor: C.card,
        borderBottom: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '16px',
      }}>
        {/* Left: logo only */}
        <button
          onClick={() => setView('landing')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: C.text, padding: 0,
          }}
        >
          <div style={{
            width: '26px', height: '26px',
            backgroundColor: C.green, borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Code2 size={14} color={C.bg} strokeWidth={2.5} />
          </div>
          <span style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '-0.03em' }}>CodeCollab</span>
        </button>

        {/* Right: controls */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Share */}
          {sessionId && (
            <button
              onClick={() => setShareOpen(true)}
              style={{
                padding: '5px 12px',
                backgroundColor: 'transparent',
                color: C.text2,
                border: `1px solid ${C.border}`,
                borderRadius: '7px',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '5px',
                fontSize: '13px', fontWeight: 500,
                transition: 'border-color 0.15s, color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderStrong; e.currentTarget.style.color = C.text; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text2; }}
            >
              <Share2 size={13} />
              Share
            </button>
          )}

          {/* Language selector */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                padding: '5px 28px 5px 10px',
                backgroundColor: C.secondary, color: C.text2,
                border: `1px solid ${C.border}`,
                borderRadius: '7px', cursor: 'pointer',
                fontSize: '13px', fontWeight: 500,
                appearance: 'none', outline: 'none',
              }}
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
            </select>
            <ChevronDown size={12} color={C.muted} style={{ position: 'absolute', right: '8px', pointerEvents: 'none' }} />
          </div>

          {/* Run */}
          <button
            onClick={handleRunCode}
            disabled={executing || !connected}
            style={{
              padding: '6px 14px',
              backgroundColor: C.secondary,
              color: executing || !connected ? C.muted : C.green,
              border: `1px solid ${executing || !connected ? C.border : C.greenBorder}`,
              borderRadius: '7px',
              cursor: executing || !connected ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '13px', fontWeight: 600,
              transition: 'all 0.2s',
            }}
          >
            <Play size={13} fill={executing || !connected ? C.muted : C.green} strokeWidth={0} />
            {executing ? 'Running…' : 'Run'}
          </button>

          {/* Users count */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '5px 10px',
            backgroundColor: C.secondary,
            border: `1px solid ${C.border}`,
            borderRadius: '7px', fontSize: '13px',
          }}>
            <Users size={13} color={C.muted} />
            <span style={{ color: C.text2 }}>{users.length}</span>
          </div>
        </div>
      </header>

      {/* ── Main panels ── */}
      <div style={{
        flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '1px', backgroundColor: C.border,
        overflow: 'hidden', minHeight: 0,
      }}>
        {/* Editor panel */}
        <div style={{ backgroundColor: C.bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{
            padding: '8px 16px',
            borderBottom: `1px solid ${C.border}`,
            display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: C.card, flexShrink: 0,
          }}>
            <div style={{ width: '3px', height: '14px', backgroundColor: C.green, borderRadius: '2px' }} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: C.text2, letterSpacing: '-0.01em' }}>Editor</span>
            <span style={{ fontSize: '12px', color: C.muted, marginLeft: '4px', fontFamily: 'monospace' }}>
              {language === 'python' ? 'main.py' : 'main.js'}
            </span>
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <CodeEditor value={code} onChange={handleCodeChange} language={language} />
          </div>
        </div>

        {/* Output panel */}
        <div style={{ backgroundColor: C.bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{
            padding: '8px 16px',
            borderBottom: `1px solid ${C.border}`,
            display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: C.card, flexShrink: 0,
          }}>
            <div style={{ width: '3px', height: '14px', backgroundColor: C.border, borderRadius: '2px' }} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: C.text2, letterSpacing: '-0.01em' }}>Output</span>
            {executing && (
              <span style={{
                marginLeft: 'auto', fontSize: '11px', color: C.green,
                display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                <span className="animate-blink" style={{
                  display: 'inline-block', width: '6px', height: '6px',
                  borderRadius: '50%', backgroundColor: C.green,
                }} />
                Running…
              </span>
            )}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <OutputPanel output={output} error={error} exitCode={exitCode} duration={duration} />
          </div>
        </div>
      </div>

      {/* ── Status bar ── */}
      <div style={{
        height: '26px', flexShrink: 0,
        padding: '0 16px',
        backgroundColor: C.elevated,
        borderTop: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '12px',
      }}>
        {/* Left: connection status + session ID */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Dot with ping animation when connected */}
          <div style={{ position: 'relative', width: '8px', height: '8px', flexShrink: 0 }}>
            {connected && (
              <div className="animate-ping" style={{
                position: 'absolute', inset: 0,
                borderRadius: '50%', backgroundColor: C.green, opacity: 0.4,
              }} />
            )}
            <div style={{
              position: 'absolute', inset: 0,
              borderRadius: '50%',
              backgroundColor: connected ? C.green : C.muted,
              boxShadow: connected ? `0 0 5px ${C.green}` : 'none',
              transition: 'background-color 0.3s',
            }} />
          </div>
          <span style={{ fontSize: '11px', color: connected ? C.green : C.muted, fontWeight: 500 }}>
            {connected ? 'connected' : 'disconnected'}
          </span>
          {sessionId && (
            <>
              <div style={{ width: '1px', height: '12px', backgroundColor: C.border }} />
              <span style={{ fontSize: '11px', color: C.muted, fontFamily: '"JetBrains Mono", monospace' }}>
                {sessionId}
              </span>
            </>
          )}
        </div>

        {/* Right: user ID */}
        <span style={{ fontSize: '11px', color: C.muted, fontFamily: '"JetBrains Mono", monospace' }}>
          uid: {userId}
        </span>
      </div>
    </div>
  );
}

export default App;
