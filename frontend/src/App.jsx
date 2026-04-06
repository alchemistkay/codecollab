import { useState, useEffect, useCallback, useRef } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import CodeEditor from './components/CodeEditor';
import OutputPanel from './components/OutputPanel';
import LandingPage from './components/LandingPage';
import { sessionAPI } from './services/api';
import { useCollaboration } from './hooks/useCollaboration';
import { Play, Users, Copy, Check, Code2, ChevronDown, X, Link, Share2, Download } from 'lucide-react';

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

const CURSOR_COLORS = ['#60a5fa', '#f472b6', '#fb923c', '#a78bfa', '#34d399'];

const generateUserId = () => 'user_' + Math.random().toString(36).substr(2, 9);

// ─── Share Modal helpers ──────────────────────────────────────────────────────
function LinkRow({ label, link, copied, onCopy, primary }) {
  return (
    <div style={{ marginBottom: primary ? '12px' : '0' }}>
      <div style={{ fontSize: '12px', fontWeight: 500, color: C.muted, marginBottom: '8px', letterSpacing: '0.01em' }}>
        {label}
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
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
        <button
          onClick={onCopy}
          style={{
            flexShrink: 0,
            padding: '10px 16px',
            backgroundColor: primary ? (copied ? C.greenDim : C.green) : C.secondary,
            color: primary ? (copied ? C.green : C.bg) : (copied ? C.green : C.muted),
            border: `1px solid ${copied ? C.greenBorder : (primary ? 'transparent' : C.border)}`,
            borderRadius: '8px',
            fontSize: '13px', fontWeight: 600,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
            transition: 'all 0.2s',
            letterSpacing: '-0.01em',
            whiteSpace: 'nowrap',
          }}
        >
          {copied ? <><Check size={13} />Copied!</> : <><Copy size={13} />Copy</>}
        </button>
      </div>
    </div>
  );
}

// ─── Share Modal ──────────────────────────────────────────────────────────────
function ShareModal({ sessionId, viewId, onClose }) {
  const [copiedEdit, setCopiedEdit] = useState(false);
  const [copiedView, setCopiedView] = useState(false);
  const editLink = `${window.location.origin}/s/${sessionId}`;
  const viewLink = `${window.location.origin}/s/${viewId}/view`;

  const copyLink = async (text, setFlag) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setFlag(true);
    setTimeout(() => setFlag(false), 2500);
  };

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
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
              Share an edit link or a view-only link.
            </p>
          </div>
        </div>

        <div style={{ height: '1px', backgroundColor: C.border, margin: '20px 0' }} />

        <LinkRow
          label="EDIT LINK — full collaboration"
          link={editLink}
          copied={copiedEdit}
          onCopy={() => copyLink(editLink, setCopiedEdit)}
          primary
        />

        <div style={{ height: '1px', backgroundColor: C.border, margin: '12px 0' }} />

        <LinkRow
          label="VIEW LINK — read only"
          link={viewLink}
          copied={copiedView}
          onCopy={() => copyLink(viewLink, setCopiedView)}
          primary={false}
        />

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

// ─── Landing route ────────────────────────────────────────────────────────────
function LandingRoute() {
  const navigate = useNavigate();

  const handleStartCoding = async () => {
    try {
      const session = await sessionAPI.create('Untitled Session', 'python');
      navigate(`/s/${session.id}`);
    } catch (e) {
      console.error('Failed to create session:', e);
    }
  };

  return <LandingPage onStart={handleStartCoding} />;
}

// ─── Expired view ─────────────────────────────────────────────────────────────
function ExpiredView() {
  const navigate = useNavigate();
  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      backgroundColor: C.bg, color: C.text,
      gap: '16px', padding: '24px', textAlign: 'center',
    }}>
      <div style={{
        width: '48px', height: '48px',
        backgroundColor: C.secondary,
        border: `1px solid ${C.border}`,
        borderRadius: '12px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '22px',
      }}>⏳</div>
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '6px' }}>
          Session expired
        </h2>
        <p style={{ fontSize: '14px', color: C.muted }}>
          This session hasn't been active for 7 days and has expired.
        </p>
      </div>
      <button
        onClick={() => navigate('/')}
        style={{
          padding: '8px 20px',
          backgroundColor: C.green, color: C.bg,
          border: 'none', borderRadius: '8px',
          fontSize: '13px', fontWeight: 600, cursor: 'pointer',
        }}
      >
        Start a new session
      </button>
    </div>
  );
}

// ─── Editor route ─────────────────────────────────────────────────────────────
function EditorRoute({ readOnly = false }) {
  const { sessionId: urlSessionId } = useParams();
  const navigate = useNavigate();
  const userId = useRef(generateUserId()).current;

  const [sessionId, setSessionId] = useState(null);
  const [viewId, setViewId] = useState(null);
  const [loadState, setLoadState] = useState('loading'); // 'loading' | 'ready' | 'expired' | 'error'
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [exitCode, setExitCode] = useState(null);
  const [duration, setDuration] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [remoteCursors, setRemoteCursors] = useState({});
  const userColorMap = useRef({});

  const handleCodeUpdate = useCallback((newCode) => setCode(newCode), []);

  const handleExecutionResult = useCallback((result) => {
    setOutput(result.output || '');
    setError(result.error || '');
    setExitCode(result.exit_code);
    setDuration(result.duration_ms);
    setExecuting(false);
  }, []);

  const handleExecutionStarted = useCallback(() => {
    setExecuting(true);
    setOutput('');
    setError('');
    setExitCode(null);
    setDuration(null);
  }, []);

  const handleLanguageUpdate = useCallback((lang) => {
    setLanguage(lang);
  }, []);

  const handleCursorUpdate = useCallback((uid, position) => {
    if (!position) {
      setRemoteCursors(prev => { const next = { ...prev }; delete next[uid]; return next; });
      return;
    }
    const color = (userColorMap.current[uid] ??=
      CURSOR_COLORS[Object.keys(userColorMap.current).length % CURSOR_COLORS.length]);
    setRemoteCursors(prev => ({ ...prev, [uid]: { ...position, color } }));
  }, []);

  const { connected, users, sendCodeChange, executeCode, sendLanguageChange, sendCursorPosition } =
    useCollaboration(
      sessionId, userId,
      handleCodeUpdate, handleExecutionResult, handleExecutionStarted,
      handleLanguageUpdate, handleCursorUpdate
    );

  useEffect(() => {
    if (urlSessionId) {
      loadSession(urlSessionId);
    }
  }, [urlSessionId]);

  const loadSession = async (sid) => {
    try {
      const session = readOnly
        ? await sessionAPI.getByViewId(sid)
        : await sessionAPI.get(sid);
      setSessionId(session.id);
      setViewId(session.view_id);
      setCode(session.code || 'print("Hello, CodeCollab!")');
      setLanguage(session.language);
      setLoadState('ready');
    } catch (e) {
      if (e.response?.status === 410) {
        setLoadState('expired');
      } else {
        setLoadState('error');
      }
    }
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (connected) sendCodeChange(newCode);
  };

  const handleRunCode = () => {
    if (connected && !readOnly) {
      setExecuting(true);
      executeCode(language, code);
    }
  };

  const handleLanguageChange = (val) => {
    setLanguage(val);
    if (connected) sendLanguageChange(val);
  };

  const handleDownload = () => {
    const ext = language === 'python' ? 'py' : 'js';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codecollab.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loadState === 'loading') {
    return (
      <div style={{
        height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: C.bg, color: C.muted, fontSize: '13px',
      }}>
        Loading session…
      </div>
    );
  }

  if (loadState === 'expired') return <ExpiredView />;

  if (loadState === 'error') {
    return (
      <div style={{
        height: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: C.bg, color: C.muted, fontSize: '13px', gap: '12px',
      }}>
        <span>Session not found.</span>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '6px 16px', backgroundColor: C.secondary, color: C.text2,
            border: `1px solid ${C.border}`, borderRadius: '7px',
            fontSize: '13px', cursor: 'pointer',
          }}
        >
          Go home
        </button>
      </div>
    );
  }

  const runDisabled = executing || !connected || readOnly;

  return (
    <div style={{
      height: '100vh',
      display: 'flex', flexDirection: 'column',
      backgroundColor: C.bg, color: C.text,
      overflow: 'hidden',
    }}>
      {shareOpen && sessionId && viewId && (
        <ShareModal sessionId={sessionId} viewId={viewId} onClose={() => setShareOpen(false)} />
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
        <button
          onClick={() => navigate('/')}
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

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Share — hidden in read-only mode */}
          {sessionId && !readOnly && (
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
              onChange={(e) => handleLanguageChange(e.target.value)}
              disabled={readOnly}
              style={{
                padding: '5px 28px 5px 10px',
                backgroundColor: C.secondary, color: readOnly ? C.muted : C.text2,
                border: `1px solid ${C.border}`,
                borderRadius: '7px', cursor: readOnly ? 'not-allowed' : 'pointer',
                fontSize: '13px', fontWeight: 500,
                appearance: 'none', outline: 'none',
              }}
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
            </select>
            <ChevronDown size={12} color={C.muted} style={{ position: 'absolute', right: '8px', pointerEvents: 'none' }} />
          </div>

          {/* Download */}
          <button
            onClick={handleDownload}
            title="Download code"
            style={{
              padding: '5px 10px',
              backgroundColor: 'transparent',
              color: C.muted,
              border: `1px solid ${C.border}`,
              borderRadius: '7px',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center',
              transition: 'color 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = C.text2; e.currentTarget.style.borderColor = C.borderStrong; }}
            onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.border; }}
          >
            <Download size={13} />
          </button>

          {/* Run */}
          <button
            onClick={handleRunCode}
            disabled={runDisabled}
            style={{
              padding: '6px 14px',
              backgroundColor: C.secondary,
              color: runDisabled ? C.muted : C.green,
              border: `1px solid ${runDisabled ? C.border : C.greenBorder}`,
              borderRadius: '7px',
              cursor: runDisabled ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '13px', fontWeight: 600,
              transition: 'all 0.2s',
            }}
          >
            <Play size={13} fill={runDisabled ? C.muted : C.green} strokeWidth={0} />
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
            <CodeEditor
              value={code}
              onChange={handleCodeChange}
              language={language}
              readOnly={readOnly}
              remoteCursors={remoteCursors}
              onCursorPositionChange={sendCursorPosition}
            />
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
          {readOnly && (
            <>
              <div style={{ width: '1px', height: '12px', backgroundColor: C.border }} />
              <span style={{
                fontSize: '11px', color: C.muted,
                padding: '1px 6px',
                border: `1px solid ${C.border}`,
                borderRadius: '4px',
                letterSpacing: '0.02em',
              }}>
                Viewing — read only
              </span>
            </>
          )}
        </div>

        <span style={{ fontSize: '11px', color: C.muted, fontFamily: '"JetBrains Mono", monospace' }}>
          uid: {userId}
        </span>
      </div>
    </div>
  );
}

// ─── App (router) ─────────────────────────────────────────────────────────────
function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingRoute />} />
      <Route path="/s/:sessionId" element={<EditorRoute />} />
      <Route path="/s/:sessionId/view" element={<EditorRoute readOnly />} />
    </Routes>
  );
}

export default App;
