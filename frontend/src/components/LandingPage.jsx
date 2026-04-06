import { useState } from 'react';
import {
  ArrowRight, Code2, Users, Zap, Terminal, Share2, Lock,
  ChevronDown, Globe, GitBranch, Play
} from 'lucide-react';

// ─── Design tokens ───────────────────────────────────────────────────────────
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
  greenGlow:   'rgba(74,222,128,0.12)',
  text:        '#ffffff',
  text2:       '#f5f5f5',
};

// ─── Nav ─────────────────────────────────────────────────────────────────────
function Nav({ onStart }) {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: '58px',
      padding: '0 clamp(16px, 4vw, 48px)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      backgroundColor: 'rgba(10,10,9,0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: `1px solid ${C.border}`,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', cursor: 'default' }}>
        <div style={{
          width: '28px', height: '28px',
          backgroundColor: C.green, borderRadius: '7px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Code2 size={15} color={C.bg} strokeWidth={2.5} />
        </div>
        <span style={{ fontWeight: 700, fontSize: '15px', letterSpacing: '-0.03em', color: C.text }}>
          CodeCollab
        </span>
      </div>

      {/* Links */}
      <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
        {[['#how-it-works', 'How it works'], ['#features', 'Features'], ['#faq', 'FAQ']].map(([href, label]) => (
          <a key={href} href={href} style={{
            color: C.muted, fontSize: '14px', fontWeight: 450,
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = C.text}
          onMouseLeave={e => e.currentTarget.style.color = C.muted}
          >{label}</a>
        ))}
      </div>

      {/* CTA */}
      <button onClick={onStart} style={{
        padding: '7px 15px',
        backgroundColor: C.green, color: C.bg,
        border: 'none', borderRadius: '8px',
        fontSize: '13.5px', fontWeight: 600,
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: '5px',
        letterSpacing: '-0.01em',
        transition: 'opacity 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        Start Coding
        <ArrowRight size={13} strokeWidth={2.5} />
      </button>
    </nav>
  );
}

// ─── Hero Visualization ───────────────────────────────────────────────────────
function HeroVisualization() {
  const users = [
    { id: 'A', name: 'Alice',  status: 'editing…',  color: C.green,    pos: { top: '9%',  left: '0%'  }, dir: 'right' },
    { id: 'B', name: 'Bob',    status: 'viewing',   color: '#60a5fa',  pos: { top: '9%',  right: '0%' }, dir: 'left'  },
    { id: 'C', name: 'Carol',  status: 'typing…',   color: '#a78bfa',  pos: { bottom: '9%', left: '0%'  }, dir: 'right' },
  ];

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '500px', height: '460px', flexShrink: 0 }}>
      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, #1a1a18 1.5px, transparent 1.5px)',
        backgroundSize: '26px 26px',
        opacity: 0.65,
        borderRadius: '20px',
      }} />
      {/* Radial fade */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 80% 75% at 50% 50%, transparent 35%, ${C.bg} 100%)`,
        zIndex: 1,
      }} />

      {/* SVG connection lines */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2 }}>
        {/* Lines to center */}
        <line x1="18%" y1="16%" x2="50%" y2="50%" stroke={C.green} strokeOpacity="0.18" strokeWidth="1" strokeDasharray="5 4"/>
        <line x1="82%" y1="16%" x2="50%" y2="50%" stroke={C.green} strokeOpacity="0.18" strokeWidth="1" strokeDasharray="5 4"/>
        <line x1="18%" y1="84%" x2="50%" y2="50%" stroke={C.green} strokeOpacity="0.12" strokeWidth="1" strokeDasharray="5 4"/>
        {/* Glow rings */}
        <circle cx="50%" cy="50%" r="72" fill="rgba(74,222,128,0.025)" />
        <circle cx="50%" cy="50%" r="44" fill="rgba(74,222,128,0.04)" />
      </svg>

      {/* ── Central editor card ── */}
      <div className="animate-float" style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '224px',
        backgroundColor: C.card,
        border: `1px solid ${C.borderStrong}`,
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: `0 0 48px ${C.greenGlow}, 0 8px 32px rgba(0,0,0,0.7)`,
        zIndex: 10,
      }}>
        {/* Title bar */}
        <div style={{
          padding: '8px 11px',
          borderBottom: `1px solid ${C.border}`,
          display: 'flex', alignItems: 'center', gap: '5px',
          backgroundColor: C.elevated,
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f87171' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#fbbf24' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: C.green }} />
          <span style={{ marginLeft: '8px', fontSize: '11px', color: C.muted, fontFamily: 'monospace' }}>main.py</span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: C.green }} />
            <span style={{ fontSize: '10px', color: C.green }}>live</span>
          </div>
        </div>
        {/* Code */}
        <div style={{
          padding: '11px 12px',
          fontFamily: '"Fira Code", "Cascadia Code", "Courier New", monospace',
          fontSize: '11.5px', lineHeight: '1.7', color: '#d4d4d4',
        }}>
          <div><span style={{ color: '#60a5fa' }}>def </span><span style={{ color: C.green }}>fibonacci</span><span>(n):</span></div>
          <div style={{ paddingLeft: '14px' }}><span style={{ color: '#60a5fa' }}>if </span>n &lt;= 1:</div>
          <div style={{ paddingLeft: '28px' }}><span style={{ color: '#60a5fa' }}>return </span><span style={{ color: '#fbbf24' }}>n</span></div>
          <div style={{ paddingLeft: '14px' }}><span style={{ color: '#60a5fa' }}>return </span><span style={{ color: C.green }}>fib</span>(n<span style={{ color: '#f87171' }}>-</span>1) <span style={{ color: '#f87171' }}>+</span></div>
          <div style={{ paddingLeft: '28px' }}><span style={{ color: C.green }}>fib</span>(n<span style={{ color: '#f87171' }}>-</span>2)</div>
          <div style={{ height: '7px' }} />
          <div><span style={{ color: C.green }}>print</span>(<span style={{ color: C.green }}>fibonacci</span>(<span style={{ color: '#fbbf24' }}>10</span>))</div>
          <div>
            <span className="animate-blink" style={{
              display: 'inline-block', width: '1.5px', height: '12px',
              backgroundColor: C.green, verticalAlign: 'text-bottom',
            }} />
          </div>
        </div>
      </div>

      {/* ── User nodes ── */}
      {users.map(u => (
        <div key={u.id} style={{
          position: 'absolute', ...u.pos,
          display: 'flex', alignItems: 'center', gap: '8px',
          flexDirection: u.dir === 'left' ? 'row-reverse' : 'row',
          zIndex: 10,
        }}>
          {/* Avatar */}
          <div style={{
            position: 'relative',
            width: '34px', height: '34px', borderRadius: '50%',
            backgroundColor: C.secondary,
            border: `2px solid ${u.color}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 600, color: u.color,
            boxShadow: `0 0 14px rgba(74,222,128,0.18)`,
            flexShrink: 0,
          }}>
            {u.id}
            <div style={{
              position: 'absolute', bottom: '-1px', right: '-1px',
              width: '9px', height: '9px', borderRadius: '50%',
              backgroundColor: C.green, border: `2px solid ${C.bg}`,
            }} />
          </div>
          {/* Label */}
          <div style={{
            padding: '5px 9px',
            backgroundColor: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: '7px',
          }}>
            <div style={{ fontSize: '12px', fontWeight: 500, color: C.text2 }}>{u.name}</div>
            <div style={{ fontSize: '11px', color: C.muted }}>{u.status}</div>
          </div>
        </div>
      ))}

      {/* ── Online badge (top center) ── */}
      <div style={{
        position: 'absolute', top: '3%', left: '50%', transform: 'translateX(-50%)',
        padding: '5px 11px',
        backgroundColor: C.greenDim,
        border: `1px solid ${C.greenBorder}`,
        borderRadius: '20px',
        display: 'flex', alignItems: 'center', gap: '6px',
        fontSize: '12px', color: C.green,
        whiteSpace: 'nowrap', zIndex: 10,
      }}>
        <div style={{ position: 'relative', width: '7px', height: '7px' }}>
          <div className="animate-ping" style={{
            position: 'absolute', inset: 0,
            borderRadius: '50%', backgroundColor: C.green,
          }} />
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', backgroundColor: C.green }} />
        </div>
        3 users collaborating
      </div>

      {/* ── Output card (bottom right, floating) ── */}
      <div className="animate-float2" style={{
        position: 'absolute', bottom: '6%', right: '2%',
        padding: '10px 13px',
        backgroundColor: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.55)',
        zIndex: 10, minWidth: '130px',
      }}>
        <div style={{ fontSize: '11px', color: C.muted, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Terminal size={11} />  Output
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: '18px', fontWeight: 700, color: C.green }}>55</div>
        <div style={{
          fontSize: '11px', color: C.muted, marginTop: '4px',
          display: 'flex', alignItems: 'center', gap: '4px',
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: C.green }} />
          exit 0 · 11ms
        </div>
      </div>
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function Hero({ onStart }) {
  return (
    <section style={{
      minHeight: '100vh',
      position: 'relative',
      display: 'flex', alignItems: 'center',
      padding: '80px clamp(16px, 6vw, 80px) 60px',
      maxWidth: '1200px', margin: '0 auto', width: '100%',
      gap: '48px',
      overflow: 'hidden',
    }}>
      {/* Full-width dot grid behind entire hero */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, #1a1a18 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        opacity: 0.4,
        pointerEvents: 'none',
        zIndex: 0,
      }} />
      {/* Gradient fade bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '160px',
        background: `linear-gradient(to bottom, transparent, ${C.bg})`,
        pointerEvents: 'none', zIndex: 1,
      }} />
      {/* Left content */}
      <div style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 2 }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '4px 10px',
          backgroundColor: C.greenDim,
          border: `1px solid ${C.greenBorder}`,
          borderRadius: '20px',
          fontSize: '12px', color: C.green, fontWeight: 500,
          marginBottom: '28px',
          letterSpacing: '0.01em',
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: C.green }} />
          Beta · Free to use
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: 'clamp(40px, 5.5vw, 68px)',
          fontWeight: 700,
          lineHeight: 1.06,
          letterSpacing: '-0.045em',
          marginBottom: '22px',
          color: C.text,
        }}>
          Code together.<br />
          Execute instantly.<br />
          <span style={{ color: C.green }}>Stay in sync.</span>
        </h1>

        {/* Description */}
        <p style={{
          fontSize: '16px', color: C.muted,
          lineHeight: 1.65, maxWidth: '440px',
          marginBottom: '36px', fontWeight: 400,
        }}>
          A real-time collaborative code editor powered by WebSockets. Share a link,
          invite your team, and write and run code together — no setup required.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button onClick={onStart} style={{
            padding: '11px 22px',
            backgroundColor: C.green, color: C.bg,
            border: 'none', borderRadius: '9px',
            fontSize: '15px', fontWeight: 600,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '7px',
            letterSpacing: '-0.02em',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <Play size={15} fill={C.bg} strokeWidth={0} />
            Start a Session
          </button>

          <a href="https://github.com/alchemistkay/codecollab" target="_blank" rel="noreferrer" style={{
            padding: '11px 20px',
            backgroundColor: 'transparent', color: C.text2,
            border: `1px solid ${C.border}`,
            borderRadius: '9px', fontSize: '15px', fontWeight: 500,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
            transition: 'border-color 0.15s',
            letterSpacing: '-0.02em',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = C.borderStrong}
          onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
          >
            <GitBranch size={14} />
            View on GitHub
          </a>
        </div>

        {/* Social proof */}
        <p style={{ marginTop: '28px', fontSize: '13px', color: C.muted }}>
          No account required · Open source · Runs in your browser
        </p>
      </div>

      {/* Right visualization */}
      <div style={{ flexShrink: 0, width: 'clamp(320px, 42%, 500px)', position: 'relative', zIndex: 2 }}>
        <HeroVisualization />
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      num: '01',
      icon: <Code2 size={22} color={C.green} />,
      title: 'Create a Session',
      desc: 'Click Start Coding to instantly spin up a new collaborative session. A unique shareable URL is generated for you.',
    },
    {
      num: '02',
      icon: <Share2 size={22} color={C.green} />,
      title: 'Share the Link',
      desc: 'Copy the session link and send it to teammates. They join instantly — no sign-up, no installs, no friction.',
    },
    {
      num: '03',
      icon: <Users size={22} color={C.green} />,
      title: 'Code Together',
      desc: 'Write, edit, and execute code in real time. See collaborators\' changes as they type, with live presence indicators.',
    },
  ];

  return (
    <section id="how-it-works" style={{
      padding: '100px clamp(16px, 6vw, 80px)',
      maxWidth: '1200px', margin: '0 auto',
    }}>
      {/* Section heading */}
      <div style={{ textAlign: 'center', marginBottom: '56px' }}>
        <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 700, letterSpacing: '-0.03em' }}>
          How it works
        </h2>
        <p style={{ marginTop: '12px', color: C.muted, fontSize: '15px', maxWidth: '480px', margin: '12px auto 0' }}>
          From zero to collaborating in under 30 seconds.
        </p>
      </div>

      {/* Cards row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {steps.map((s, i) => (
          <div key={i} className="card-hover" style={{
            padding: '28px 24px',
            backgroundColor: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: '12px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Step number watermark */}
            <div style={{
              position: 'absolute', top: '16px', right: '20px',
              fontSize: '40px', fontWeight: 800,
              color: C.greenDim,
              letterSpacing: '-0.05em',
              lineHeight: 1,
              userSelect: 'none',
            }}>
              {s.num}
            </div>
            {/* Icon */}
            <div style={{
              width: '44px', height: '44px',
              backgroundColor: C.greenDim,
              border: `1px solid ${C.greenBorder}`,
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '18px',
            }}>
              {s.icon}
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', letterSpacing: '-0.02em' }}>{s.title}</h3>
            <p style={{ fontSize: '14px', color: C.muted, lineHeight: 1.6 }}>{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Divider line */}
      <div style={{ marginTop: '64px', textAlign: 'center' }}>
        <a href="#features" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          fontSize: '14px', color: C.green, fontWeight: 500,
          transition: 'gap 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.gap = '10px'}
        onMouseLeave={e => e.currentTarget.style.gap = '6px'}
        >
          See all features
          <ArrowRight size={14} />
        </a>
      </div>
    </section>
  );
}

// ─── Features Grid ────────────────────────────────────────────────────────────
function Features() {
  const features = [
    {
      icon: <Zap size={18} />,
      tag: 'Real-time',
      title: 'Live Code Sync',
      desc: 'Every keystroke is broadcast instantly to all collaborators via persistent WebSocket connections. Zero lag.',
      highlight: true,
      extra: (
        <div style={{
          marginTop: '16px', padding: '10px 12px',
          backgroundColor: C.secondary, borderRadius: '8px',
          fontFamily: 'monospace', fontSize: '12px', color: C.green,
        }}>
          <span style={{ color: C.muted }}>→ </span>ws: code_update received<br />
          <span style={{ color: C.muted }}>→ </span>3 peers synced in <span style={{ color: C.green }}>2ms</span>
        </div>
      ),
    },
    {
      icon: <Terminal size={18} />,
      tag: 'Sandboxed',
      title: 'Code Execution',
      desc: 'Run Python and JavaScript directly in the browser with a secure, isolated execution environment.',
      extra: (
        <div style={{
          marginTop: '16px', display: 'flex', gap: '6px', flexWrap: 'wrap',
        }}>
          {['Python', 'JavaScript'].map(l => (
            <span key={l} style={{
              padding: '3px 9px',
              backgroundColor: C.greenDim,
              border: `1px solid ${C.greenBorder}`,
              borderRadius: '5px', fontSize: '12px', color: C.green,
            }}>{l}</span>
          ))}
          <span style={{
            padding: '3px 9px',
            backgroundColor: C.secondary,
            border: `1px solid ${C.border}`,
            borderRadius: '5px', fontSize: '12px', color: C.muted,
          }}>+ more soon</span>
        </div>
      ),
    },
    {
      icon: <Users size={18} />,
      tag: 'Collaborative',
      title: 'Live Presence',
      desc: "See who's in the session with live user counters and connection status indicators.",
      highlight: true,
    },
    {
      icon: <Share2 size={18} />,
      tag: 'Instant',
      title: 'One-click Sharing',
      desc: 'Copy a unique session URL to invite anyone. No accounts, no OAuth, no friction — just share the link.',
    },
    {
      icon: <Code2 size={18} />,
      tag: 'VS Code',
      title: 'Monaco Editor',
      desc: 'Powered by the same editor engine as VS Code. Full syntax highlighting, line numbers, and keyboard shortcuts.',
    },
    {
      icon: <Lock size={18} />,
      tag: 'Secure',
      title: 'Isolated Runs',
      desc: 'Every execution is sandboxed in its own container. Sessions are fully isolated from each other.',
    },
  ];

  return (
    <section id="features" style={{
      padding: '100px clamp(16px, 6vw, 80px)',
      backgroundColor: C.bg,
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 700, letterSpacing: '-0.03em' }}>
            Everything you need to collaborate
          </h2>
          <p style={{ marginTop: '12px', color: C.muted, fontSize: '15px', maxWidth: '480px', margin: '12px auto 0' }}>
            A complete toolkit for real-time pair programming, code reviews, and technical interviews.
          </p>
        </div>

        {/* Grid — 2 columns to match reference prominence */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '14px',
        }}>
          {features.map((f, i) => (
            <div key={i} className={f.highlight ? 'green-card-hover' : 'card-hover'} style={{
              padding: '24px',
              backgroundColor: C.card,
              border: `1px solid ${f.highlight ? C.greenBorder : C.border}`,
              borderRadius: '12px',
              display: 'flex', flexDirection: 'column',
            }}>
              {/* Icon + tag row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{
                  width: '36px', height: '36px',
                  backgroundColor: f.highlight ? C.greenDim : C.secondary,
                  border: `1px solid ${f.highlight ? C.greenBorder : C.border}`,
                  borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: f.highlight ? C.green : C.muted,
                }}>
                  {f.icon}
                </div>
                <span style={{
                  padding: '3px 8px',
                  backgroundColor: C.secondary, borderRadius: '5px',
                  fontSize: '11px', color: C.muted, fontWeight: 500,
                  letterSpacing: '0.01em',
                }}>{f.tag}</span>
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '7px', letterSpacing: '-0.02em' }}>{f.title}</h3>
              <p style={{ fontSize: '13.5px', color: C.muted, lineHeight: 1.6, flex: 1 }}>{f.desc}</p>
              {f.extra}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState(null);

  const items = [
    {
      q: 'How does real-time collaboration work?',
      a: 'CodeCollab uses WebSockets to sync code changes across all connected users instantly. Every keystroke is broadcast to collaborators in real-time, similar to Google Docs — but for code.',
    },
    {
      q: 'Which programming languages are supported?',
      a: 'Currently Python and JavaScript are supported, with more on the way. Our sandboxed execution environment ensures safe, isolated code runs for every language.',
    },
    {
      q: 'How do I share my session with others?',
      a: 'Click the Share Link button inside the editor to copy a unique session URL. Anyone with that link can join your session and start coding immediately — no account needed.',
    },
    {
      q: 'Is my code saved automatically?',
      a: 'Yes. Code is persisted in your session so you can rejoin at any time using the same session link and find everything exactly as you left it.',
    },
    {
      q: 'How many users can join a single session?',
      a: 'Multiple users can join and code simultaneously. All changes are synchronized in real-time across every participant in the session.',
    },
  ];

  return (
    <section id="faq" style={{
      padding: '100px clamp(16px, 6vw, 80px)',
      maxWidth: '760px', margin: '0 auto',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '52px' }}>
        <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 700, letterSpacing: '-0.03em' }}>
          Frequently asked questions
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={i} style={{
              borderRadius: '10px',
              backgroundColor: isOpen ? C.card : 'transparent',
              border: `1px solid ${isOpen ? C.border : 'transparent'}`,
              overflow: 'hidden',
              transition: 'background-color 0.2s ease, border-color 0.2s ease',
            }}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                style={{
                  width: '100%', padding: '18px 20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'none', border: 'none',
                  cursor: 'pointer', color: C.text,
                  textAlign: 'left', gap: '12px',
                }}
              >
                <span style={{
                  fontSize: '15px', fontWeight: 500,
                  letterSpacing: '-0.02em',
                  color: isOpen ? C.text : C.text2,
                }}>
                  {item.q}
                </span>
                <ChevronDown size={16} color={isOpen ? C.green : C.muted} style={{
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.25s ease',
                  flexShrink: 0,
                }} />
              </button>
              {isOpen && (
                <div style={{ padding: '0 20px 18px', fontSize: '14px', color: C.muted, lineHeight: 1.65 }}>
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── CTA Footer ───────────────────────────────────────────────────────────────
function CTASection({ onStart }) {
  return (
    <section style={{
      padding: '100px clamp(16px, 6vw, 80px) 80px',
      textAlign: 'center',
      borderTop: `1px solid ${C.border}`,
    }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <h2 style={{
          fontSize: 'clamp(28px, 4vw, 44px)',
          fontWeight: 700,
          letterSpacing: '-0.04em',
          lineHeight: 1.1,
          marginBottom: '16px',
          color: C.green,
        }}>
          Start coding together.
        </h2>
        <p style={{ fontSize: '15px', color: C.muted, marginBottom: '32px', lineHeight: 1.6 }}>
          No account needed. Just click, share a link, and start collaborating with your team in seconds.
        </p>
        <button onClick={onStart} style={{
          padding: '13px 28px',
          backgroundColor: C.green, color: C.bg,
          border: 'none', borderRadius: '10px',
          fontSize: '15px', fontWeight: 700,
          cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          letterSpacing: '-0.02em',
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <Play size={15} fill={C.bg} strokeWidth={0} />
          Launch the Editor
        </button>

        {/* Footer links */}
        <div style={{
          marginTop: '48px',
          paddingTop: '32px',
          borderTop: `1px solid ${C.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '22px', height: '22px',
              backgroundColor: C.green, borderRadius: '5px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Code2 size={12} color={C.bg} strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '-0.02em' }}>CodeCollab</span>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['GitHub', 'Docs', 'Status'].map(l => (
              <a key={l} href="#" style={{
                fontSize: '13px', color: C.muted,
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = C.text}
              onMouseLeave={e => e.currentTarget.style.color = C.muted}
              >{l}</a>
            ))}
          </div>
          <span style={{ fontSize: '12px', color: C.muted }}>© 2025 CodeCollab</span>
        </div>
      </div>
    </section>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function LandingPage({ onStart }) {
  return (
    <div style={{ backgroundColor: C.bg, color: C.text, minHeight: '100vh', overflowX: 'hidden' }}>
      <Nav onStart={onStart} />
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Hero onStart={onStart} />
      </div>
      <div style={{ borderTop: `1px solid ${C.border}` }}>
        <HowItWorks />
      </div>
      <div style={{ borderTop: `1px solid ${C.border}` }}>
        <Features />
      </div>
      <div style={{ borderTop: `1px solid ${C.border}` }}>
        <FAQ />
      </div>
      <CTASection onStart={onStart} />
    </div>
  );
}
