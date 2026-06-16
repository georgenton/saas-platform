/* Shared inline primitives + shell building blocks for the Platform Shell kit.
   Mirrors the design-system components but self-contained so the prototype
   renders without the compiled bundle. All styling reads mood tokens. */
(function () {
  const { useState } = React;
  const I = window.Icon;

  /* ---------------------------------------------------------------- Button */
  function Btn({ variant = 'primary', size = 'md', children, leading, trailing, full, disabled, onClick, style }) {
    const [h, setH] = useState(false);
    const sizes = {
      sm: { height: 32, padding: '0 12px', fontSize: 'var(--text-sm)' },
      md: { height: 'var(--control-h)', padding: '0 16px', fontSize: 'var(--text-body)' },
      lg: { height: 46, padding: '0 22px', fontSize: 'var(--text-h3)' }
    };
    const variants = {
      primary: { base: { background: 'var(--primary)', color: 'var(--primary-contrast)', border: '1px solid transparent' }, hover: { background: 'var(--primary-hover)' } },
      secondary: { base: { background: 'var(--surface)', color: 'var(--text-strong)', border: '1px solid var(--border-strong)' }, hover: { background: 'var(--surface-hover)' } },
      ghost: { base: { background: 'transparent', color: 'var(--text)', border: '1px solid transparent' }, hover: { background: 'var(--surface-hover)' } }
    };
    const v = variants[variant] || variants.primary;
    return React.createElement('button', {
      className: 'ds-focusable', disabled, onClick,
      onMouseEnter: () => setH(true), onMouseLeave: () => setH(false),
      style: {
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        width: full ? '100%' : 'auto', fontFamily: 'var(--font-sans)', fontWeight: 600, lineHeight: 1,
        whiteSpace: 'nowrap', borderRadius: 'var(--radius-sm)', cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1, transition: 'var(--transition-base)', ...sizes[size], ...v.base,
        ...(h && !disabled ? v.hover : null), ...style
      }
    }, leading && I({ name: leading, size: 16 }), children, trailing && I({ name: trailing, size: 16 }));
  }

  /* ------------------------------------------------------------------ Pill */
  function Pill({ tone = 'neutral', dot, solid, children, style }) {
    const soft = {
      success: ['var(--success-soft)', 'var(--on-success-soft)', 'var(--success)'],
      warning: ['var(--warning-soft)', 'var(--on-warning-soft)', 'var(--warning)'],
      danger: ['var(--danger-soft)', 'var(--on-danger-soft)', 'var(--danger)'],
      info: ['var(--info-soft)', 'var(--on-info-soft)', 'var(--info)'],
      primary: ['var(--primary-soft)', 'var(--on-primary-soft)', 'var(--primary)'],
      neutral: ['var(--surface-sunken)', 'var(--text-muted)', 'var(--text-subtle)']
    };
    const [bg, fg, dc] = soft[tone] || soft.neutral;
    return React.createElement('span', {
      style: {
        display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 'var(--radius-pill)',
        fontSize: 'var(--text-2xs)', fontWeight: 600, lineHeight: 1, padding: '5px 10px',
        background: solid ? dc : bg, color: solid ? '#fff' : fg, ...style
      }
    }, dot && React.createElement('span', { style: { width: 6, height: 6, borderRadius: 999, background: solid ? '#fff' : dc } }), children);
  }

  /* ---------------------------------------------------------------- Banner */
  function Banner({ tone = 'info', icon, title, children, action, onDismiss, style }) {
    const tones = {
      info: ['var(--info-soft)', 'var(--on-info-soft)', 'var(--info)'],
      success: ['var(--success-soft)', 'var(--on-success-soft)', 'var(--success)'],
      warning: ['var(--warning-soft)', 'var(--on-warning-soft)', 'var(--warning)'],
      danger: ['var(--danger-soft)', 'var(--on-danger-soft)', 'var(--danger)'],
      neutral: ['var(--surface-sunken)', 'var(--text)', 'var(--text-muted)']
    };
    const [bg, fg, ac] = tones[tone] || tones.info;
    return React.createElement('div', {
      role: 'status',
      style: { display: 'flex', alignItems: 'flex-start', gap: 12, background: bg, color: fg, borderLeft: `3px solid ${ac}`, borderRadius: 'var(--radius-sm)', padding: '12px 14px', fontSize: 'var(--text-sm)', ...style }
    },
      icon && React.createElement('span', { style: { color: ac, flex: 'none', marginTop: 1, display: 'inline-flex' } }, I({ name: icon, size: 18 })),
      React.createElement('div', { style: { display: 'grid', gap: 2, flex: 1, minWidth: 0 } },
        title && React.createElement('strong', { style: { fontWeight: 600 } }, title),
        children && React.createElement('span', { style: { opacity: 0.92 } }, children)),
      action && React.createElement('div', { style: { flex: 'none' } }, action),
      onDismiss && React.createElement('button', { onClick: onDismiss, 'aria-label': 'Dismiss', className: 'ds-focusable', style: { flex: 'none', background: 'transparent', border: 'none', color: fg, cursor: 'pointer', display: 'inline-flex', padding: 2, borderRadius: 4 } }, I({ name: 'x', size: 16 })));
  }

  /* ---------------------------------------------------------------- Avatar */
  function Avatar({ name = '', size = 32, shape = 'rounded', style }) {
    const initials = name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
    return React.createElement('span', {
      style: { width: size, height: size, borderRadius: shape === 'circle' ? 999 : 'var(--radius-sm)', flex: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary-soft)', color: 'var(--on-primary-soft)', fontWeight: 600, fontSize: Math.round(size * 0.4), letterSpacing: '-0.02em', userSelect: 'none', ...style }
    }, initials);
  }

  /* ----------------------------------------------------------------- Brand */
  function Brand({ compact }) {
    return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 9 } },
      React.createElement('span', { style: { width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: 'var(--primary)', color: 'var(--primary-contrast)', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 15, letterSpacing: '-0.04em', flex: 'none' } }, 'S'),
      !compact && React.createElement('span', { style: { fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-strong)' } }, 'SaaS', React.createElement('span', { style: { fontWeight: 700 } }, 'Platform')));
  }

  /* -------------------------------------------------------------- NavRow */
  function NavRow({ p, active, onClick, compact }) {
    const [h, setH] = useState(false);
    const muted = p.state === 'disabled' || p.state === 'locked';
    const isActive = active;
    return React.createElement('a', {
      href: muted ? undefined : '#', onClick: (e) => { e.preventDefault(); if (!muted && onClick) onClick(p); },
      title: compact ? p.name : (p.note || undefined),
      'aria-current': isActive ? 'page' : undefined, 'aria-disabled': muted || undefined, className: 'ds-focusable',
      onMouseEnter: () => setH(true), onMouseLeave: () => setH(false),
      style: {
        position: 'relative', display: 'flex', alignItems: 'center', gap: 10, height: 38,
        padding: compact ? 0 : '0 10px', justifyContent: compact ? 'center' : 'flex-start',
        borderRadius: 'var(--radius-xs)', fontSize: 'var(--text-sm)', fontWeight: isActive ? 600 : 500,
        textDecoration: 'none', cursor: muted ? 'not-allowed' : 'pointer',
        color: isActive ? 'var(--on-primary-soft)' : muted ? 'var(--text-subtle)' : 'var(--text)',
        background: isActive ? 'var(--primary-soft)' : (h && !muted ? 'var(--surface-hover)' : 'transparent'),
        transition: 'var(--transition-base)'
      }
    },
      isActive && React.createElement('span', { style: { position: 'absolute', left: 0, top: 7, bottom: 7, width: 3, borderRadius: '0 3px 3px 0', background: 'var(--primary)' } }),
      React.createElement('span', { style: { display: 'inline-flex', flex: 'none', opacity: muted ? 0.7 : 1 } }, I({ name: p.icon, size: 17 })),
      !compact && React.createElement('span', { style: { flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, p.name),
      !compact && p.state === 'locked' && React.createElement('span', { style: { color: 'var(--text-subtle)', display: 'inline-flex' } }, I({ name: 'lock', size: 13 })),
      !compact && p.state === 'limited' && React.createElement('span', { title: 'Permission-limited', style: { width: 7, height: 7, borderRadius: 999, background: 'var(--warning)', flex: 'none' } }),
      !compact && p.badge != null && p.state !== 'locked' && React.createElement('span', { style: { flex: 'none', fontSize: 'var(--text-2xs)', fontWeight: 600, color: isActive ? 'var(--on-primary-soft)' : 'var(--text-muted)', background: isActive ? 'transparent' : 'var(--surface-sunken)', borderRadius: 999, padding: '1px 7px' } }, p.badge));
  }

  /* ------------------------------------------------------------- MoodMenu */
  function MoodSwatch({ mood, size = 20 }) {
    return React.createElement('span', { 'data-mood': mood, style: { width: size, height: size, borderRadius: 'var(--radius-xs)', flex: 'none', background: 'var(--app-bg)', border: '1px solid var(--border-strong)', position: 'relative', overflow: 'hidden' } },
      React.createElement('span', { style: { position: 'absolute', inset: 3, borderRadius: 2, background: 'var(--surface)' } }),
      React.createElement('span', { style: { position: 'absolute', right: 3, bottom: 3, width: 5, height: 5, borderRadius: 999, background: 'var(--primary)' } }));
  }
  function MoodMenu({ value, onChange, moods }) {
    return React.createElement('div', { role: 'radiogroup', 'aria-label': 'Design mood', style: { display: 'grid', gap: 4 } },
      moods.map(m => {
        const active = m.key === value;
        return React.createElement('button', {
          key: m.key, role: 'radio', 'aria-checked': active, className: 'ds-focusable', onClick: () => onChange(m.key),
          style: { display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 'var(--radius-xs)', cursor: 'pointer', border: `1px solid ${active ? 'var(--primary)' : 'var(--border)'}`, background: active ? 'var(--primary-soft)' : 'var(--surface)', transition: 'var(--transition-base)' }
        },
          React.createElement(MoodSwatch, { mood: m.key, size: 22 }),
          React.createElement('span', { style: { display: 'grid', gap: 1, flex: 1 } },
            React.createElement('span', { style: { fontSize: 'var(--text-sm)', fontWeight: 600, color: active ? 'var(--on-primary-soft)' : 'var(--text-strong)' } }, m.label),
            React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' } }, m.desc)),
          active && React.createElement('span', { style: { color: 'var(--primary)', display: 'inline-flex' } }, I({ name: 'check', size: 15 })));
      }));
  }

  /* ----------------------------------------------------------- StateScreen */
  function StateScreen({ icon, tone = 'neutral', title, children, actions, meta }) {
    const tones = { neutral: 'var(--text-muted)', info: 'var(--info)', warning: 'var(--warning)', danger: 'var(--danger)' };
    const soft = { neutral: 'var(--surface-sunken)', info: 'var(--info-soft)', warning: 'var(--warning-soft)', danger: 'var(--danger-soft)' };
    return React.createElement('div', { style: { display: 'grid', placeItems: 'center', minHeight: '100%', padding: 32 } },
      React.createElement('div', { style: { maxWidth: 420, textAlign: 'center', display: 'grid', gap: 16, justifyItems: 'center' } },
        React.createElement('span', { style: { width: 56, height: 56, borderRadius: 'var(--radius-md)', display: 'grid', placeItems: 'center', background: soft[tone], color: tones[tone] } }, I({ name: icon, size: 26 })),
        React.createElement('h2', { style: { margin: 0, fontSize: 'var(--text-h1)', fontWeight: 600, letterSpacing: 'var(--track-snug)', color: 'var(--text-strong)' } }, title),
        children && React.createElement('p', { style: { margin: 0, fontSize: 'var(--text-body)', lineHeight: 'var(--leading-body)', color: 'var(--text-muted)' } }, children),
        actions && React.createElement('div', { style: { display: 'flex', gap: 10, marginTop: 4 } }, actions),
        meta && React.createElement('div', { style: { marginTop: 4, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)' } }, meta)));
  }

  /* ------------------------------------------------------- AssistantPanel */
  function AssistantPanel({ assistant, onClose, embedded }) {
    const inner = (
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--surface)', borderLeft: embedded ? 'none' : '1px solid var(--border)' } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, padding: '16px 18px', borderBottom: '1px solid var(--divider)' } },
          React.createElement('span', { style: { width: 30, height: 30, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: 'var(--primary-soft)', color: 'var(--primary)' } }, I({ name: 'spark', size: 17 })),
          React.createElement('div', { style: { flex: 1 } },
            React.createElement('div', { style: { fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Asistente IA'),
            React.createElement('div', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' } }, 'Copiloto · suggestion mode')),
          onClose && React.createElement('button', { className: 'ds-focusable', onClick: onClose, 'aria-label': 'Cerrar', style: { background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'inline-flex', padding: 4, borderRadius: 4 } }, I({ name: 'x', size: 18 }))),
        React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: 16, display: 'grid', gap: 12, alignContent: 'start' } },
          React.createElement('p', { style: { margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text)', lineHeight: 1.5 } }, assistant.greeting),
          assistant.suggestions.map((s, i) => {
            const tones = { info: 'var(--info)', warning: 'var(--warning)', neutral: 'var(--text-muted)' };
            return React.createElement('div', { key: i, style: { background: 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 14, display: 'grid', gap: 8 } },
              React.createElement('div', { style: { display: 'flex', gap: 10, alignItems: 'flex-start' } },
                React.createElement('span', { style: { width: 28, height: 28, flex: 'none', borderRadius: 'var(--radius-xs)', display: 'grid', placeItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', color: tones[s.tone] } }, I({ name: s.icon, size: 15 })),
                React.createElement('div', { style: { flex: 1 } },
                  React.createElement('div', { style: { fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)', lineHeight: 1.35 } }, s.title),
                  React.createElement('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.45 } }, s.body))),
              React.createElement('div', { style: { display: 'flex', gap: 8 } },
                React.createElement(Btn, { variant: 'secondary', size: 'sm' }, s.action),
                React.createElement(Btn, { variant: 'ghost', size: 'sm' }, 'Descartar')));
          })),
        React.createElement('div', { style: { padding: 14, borderTop: '1px solid var(--divider)', display: 'grid', gap: 8 } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0 12px', height: 'var(--control-h)', color: 'var(--text-subtle)' } },
            I({ name: 'spark', size: 15 }),
            React.createElement('span', { style: { fontSize: 'var(--text-sm)' } }, 'Pregúntale al asistente…')),
          React.createElement('div', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', lineHeight: 1.45 } }, assistant.disclaimer)))
    );
    if (embedded) return inner;
    return React.createElement('div', { style: { position: 'absolute', top: 0, right: 0, bottom: 0, width: 360, maxWidth: '100%', boxShadow: 'var(--shadow-lg)', zIndex: 20 } }, inner);
  }

  window.UI = { Btn, Pill, Banner, Avatar, Brand, NavRow, MoodMenu, MoodSwatch, StateScreen, AssistantPanel };
})();
