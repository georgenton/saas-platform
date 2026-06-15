/* Mobile Platform Shell — one-hand bottom-tab navigation, a top bar with tenant
   context, and bottom sheets for product navigation, tenant switch and the mood
   selector. Not a shrunk desktop sidebar. */
(function () {
  const { useState } = React;
  const I = window.Icon;
  const { Btn, Pill, Banner, Avatar, Brand, MoodMenu, StateScreen } = window.UI;
  const tones = { info: 'var(--info)', warning: 'var(--warning)', neutral: 'var(--text-muted)' };

  const TABS = [
    { key: 'dashboard', name: 'Home', icon: 'home' },
    { key: 'invoicing', name: 'Invoicing', icon: 'invoicing' },
    { key: 'growth', name: 'Growth', icon: 'growth', badge: 3 },
    { key: 'ai-console', name: 'AI', icon: 'ai' },
    { key: 'more', name: 'More', icon: 'menu' }
  ];

  function Sheet({ title, children, onClose }) {
    return React.createElement('div', { onClick: onClose, style: { position: 'absolute', inset: 0, zIndex: 30, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' } },
      React.createElement('div', { style: { position: 'absolute', inset: 0, background: 'rgba(8,12,18,0.42)' } }),
      React.createElement('div', { onClick: e => e.stopPropagation(), style: { position: 'relative', background: 'var(--surface-raised)', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16, maxHeight: '80%', overflowY: 'auto', boxShadow: 'var(--shadow-lg)' } },
        React.createElement('div', { style: { width: 36, height: 4, borderRadius: 999, background: 'var(--border-strong)', margin: '0 auto 12px' } }),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 } },
          React.createElement('h3', { style: { margin: 0, fontSize: 'var(--text-h3)', fontWeight: 600, color: 'var(--text-strong)' } }, title),
          React.createElement('button', { className: 'ds-focusable', onClick: onClose, style: { background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'inline-flex', padding: 4 } }, I({ name: 'x', size: 18 }))),
        children));
  }

  function TopBar({ tenant, onTenant, onMood, onAssistant }) {
    return React.createElement('div', { style: { height: 54, flex: 'none', display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', background: 'var(--topbar-bg)', borderBottom: '1px solid var(--topbar-border)' } },
      React.createElement(Brand, { compact: true }),
      React.createElement('button', { className: 'ds-focusable', onClick: onTenant, style: { display: 'flex', alignItems: 'center', gap: 6, marginLeft: 2, background: 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: 'var(--radius-pill)', padding: '5px 10px', cursor: 'pointer', minWidth: 0 } },
        React.createElement('span', { style: { color: 'var(--primary)', display: 'inline-flex' } }, I({ name: 'building', size: 14 })),
        React.createElement('span', { style: { fontSize: 'var(--text-2xs)', fontWeight: 700, color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 78 } }, tenant.name),
        I({ name: 'chevronDown', size: 13, style: { color: 'var(--text-subtle)' } })),
      React.createElement('div', { style: { flex: 1 } }),
      React.createElement('button', { className: 'ds-focusable', 'aria-label': 'Asistente IA', onClick: onAssistant, style: { width: 34, height: 34, display: 'grid', placeItems: 'center', background: 'var(--primary-soft)', border: '1px solid transparent', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--on-primary-soft)' } }, I({ name: 'spark', size: 16 })),
      React.createElement('button', { className: 'ds-focusable', 'aria-label': 'Design mood', onClick: onMood, style: { width: 34, height: 34, display: 'grid', placeItems: 'center', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--text)' } }, I({ name: 'sliders', size: 16 })),
      React.createElement('button', { className: 'ds-focusable', 'aria-label': 'Notifications', style: { position: 'relative', width: 34, height: 34, display: 'grid', placeItems: 'center', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--text)' } },
        I({ name: 'bell', size: 16 }), React.createElement('span', { style: { position: 'absolute', top: 7, right: 8, width: 6, height: 6, borderRadius: 999, background: 'var(--danger)', border: '1.5px solid var(--surface)' } })));
  }

  function BottomTabs({ active, onTab }) {
    return React.createElement('nav', { style: { height: 58, flex: 'none', display: 'flex', background: 'var(--sidebar-bg)', borderTop: '1px solid var(--sidebar-border)', paddingBottom: 'env(safe-area-inset-bottom)',
        '--primary': 'var(--sidebar-accent)', '--text-muted': 'var(--sidebar-muted)' } },
      TABS.map(t => {
        const on = t.key === active;
        return React.createElement('button', { key: t.key, className: 'ds-focusable', onClick: () => onTab(t.key), 'aria-current': on ? 'page' : undefined,
          style: { flex: 1, display: 'grid', justifyItems: 'center', gap: 3, padding: '8px 0', background: 'transparent', border: 'none', cursor: 'pointer', color: on ? 'var(--sidebar-accent)' : 'var(--sidebar-muted)', position: 'relative' } },
          React.createElement('span', { style: { position: 'relative', display: 'inline-flex' } }, I({ name: t.icon, size: 21 }),
            t.badge && React.createElement('span', { style: { position: 'absolute', top: -4, right: -7, fontSize: 9, fontWeight: 700, color: '#fff', background: 'var(--danger)', borderRadius: 999, minWidth: 14, height: 14, display: 'grid', placeItems: 'center', padding: '0 3px' } }, t.badge)),
          React.createElement('span', { style: { fontSize: 10, fontWeight: on ? 600 : 500 } }, t.name));
      }));
  }

  function MobileDashboard({ d, devBanner, limited }) {
    return React.createElement('div', { style: { padding: 14, display: 'grid', gap: 14 } },
      devBanner && React.createElement(Banner, { tone: 'warning', icon: 'alert', title: 'Local / dev' }, d.env.apiBaseUrl),
      limited && React.createElement(Banner, { tone: 'info', icon: 'eye', title: 'View only' }, 'Tax Compliance EC: necesitas el permiso tax.manage para editar.'),
      React.createElement('div', null,
        React.createElement('div', { className: 'ds-eyebrow' }, 'Operations'),
        React.createElement('h1', { style: { margin: '2px 0 0', fontSize: 'var(--text-h1)', fontWeight: 700, letterSpacing: 'var(--track-snug)', color: 'var(--text-strong)' } }, 'Dashboard')),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 } },
        d.kpis.slice(0, 4).map((k, i) => React.createElement('div', { key: i, style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 14, display: 'grid', gap: 4 } },
          React.createElement('span', { className: 'ds-eyebrow' }, k.label),
          React.createElement('strong', { className: 'ds-tnum', style: { fontSize: 'var(--text-h2)', fontWeight: 600, color: 'var(--text-strong)' } }, k.value),
          React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' } }, k.hint)))),
      React.createElement('div', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' } },
        React.createElement('div', { style: { padding: '12px 14px', borderBottom: '1px solid var(--divider)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)' } }, 'Actividad'),
        d.activity.slice(0, 3).map((a, i) => React.createElement('div', { key: i, style: { display: 'flex', gap: 10, alignItems: 'flex-start', padding: '11px 14px', borderBottom: i < 2 ? '1px solid var(--divider)' : 'none' } },
          React.createElement('span', { style: { width: 28, height: 28, flex: 'none', borderRadius: 'var(--radius-xs)', display: 'grid', placeItems: 'center', background: 'var(--surface-sunken)', color: 'var(--text-muted)' } }, I({ name: a.icon, size: 15 })),
          React.createElement('div', { style: { flex: 1, minWidth: 0 } },
            React.createElement('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--text-strong)', lineHeight: 1.4 } }, a.what),
            React.createElement('div', { style: { fontSize: 10, color: 'var(--text-muted)', marginTop: 2 } }, a.when)),
          React.createElement('span', { style: { width: 7, height: 7, borderRadius: 999, marginTop: 5, flex: 'none', background: a.tone === 'success' ? 'var(--success)' : a.tone === 'warning' ? 'var(--warning)' : a.tone === 'info' ? 'var(--info)' : 'var(--text-subtle)' } })))));
  }

  function MobileMarketplace({ d }) {
    return React.createElement('div', { style: { padding: 14, display: 'grid', gap: 12 } },
      React.createElement('div', null,
        React.createElement('div', { className: 'ds-eyebrow' }, 'Marketplace'),
        React.createElement('h1', { style: { margin: '2px 0 0', fontSize: 'var(--text-h1)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Add products')),
      d.catalog.map(p => React.createElement('div', { key: p.key, style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 14, display: 'grid', gap: 10 } },
        React.createElement('div', { style: { display: 'flex', gap: 10, alignItems: 'center' } },
          React.createElement('span', { style: { width: 36, height: 36, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: 'var(--primary-soft)', color: 'var(--primary)' } }, I({ name: p.icon, size: 18 })),
          React.createElement('div', { style: { flex: 1 } },
            React.createElement('div', { style: { fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)' } }, p.name),
            React.createElement('div', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' } }, p.price)),
          p.cta === 'upgrade' && React.createElement(Pill, { tone: 'warning' }, 'Scale')),
        React.createElement('p', { style: { margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.5 } }, p.summary),
        React.createElement(Btn, { variant: p.cta === 'open' ? 'secondary' : 'primary', size: 'sm', full: true }, p.cta === 'add' ? 'Add product' : p.cta === 'upgrade' ? 'Upgrade plan' : 'Open'))));
  }

  function MobileShell({ d, state, mood, onMood }) {
    const [tab, setTab] = useState('dashboard');
    const [sheet, setSheet] = useState(null);

    let body;
    if (state === 'loading') {
      body = React.createElement('div', { style: { padding: 14, display: 'grid', gap: 12 } },
        [0, 1, 2, 3].map(i => React.createElement('div', { key: i, style: { height: i === 0 ? 70 : 54, borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)', border: '1px solid var(--border)', opacity: 1 - i * 0.15 } })));
    } else if (state === 'backend-unavailable') {
      body = React.createElement(StateScreen, { icon: 'server', tone: 'danger', title: d.backendError.title, meta: 'correlationId ' + d.backendError.correlationId, actions: React.createElement(Btn, { variant: 'primary', size: 'sm', leading: 'spark' }, 'Reintentar') }, d.backendError.message);
    } else if (state === 'tenant-missing') {
      body = React.createElement(StateScreen, { icon: 'building', tone: 'info', title: 'Sin tenant activo', actions: React.createElement(Btn, { variant: 'primary', size: 'sm' }, 'Elegir empresa') }, 'Tu usuario no tiene una empresa activa. Elige o crea una para continuar.');
    } else if (state === 'product-disabled') {
      body = React.createElement(StateScreen, { icon: 'psychology', tone: 'neutral', title: 'Psychology Clinics', actions: React.createElement(Btn, { variant: 'primary', size: 'sm' }, 'Ver en Marketplace') }, 'Este producto no está habilitado para Acme Logística. Está visible pero inactivo.');
    } else if (state === 'permission-denied') {
      body = React.createElement(StateScreen, { icon: 'shield', tone: 'warning', title: 'Sin permiso', actions: React.createElement(Btn, { variant: 'secondary', size: 'sm' }, 'Solicitar acceso') }, 'No tienes permiso para Accounting. Pídeselo al Owner del tenant.');
    } else if (state === 'blocked-by-plan') {
      body = React.createElement(StateScreen, { icon: 'lock', tone: 'info', title: 'Accounting en Scale', actions: React.createElement(Btn, { variant: 'primary', size: 'sm' }, 'Ver plan Scale') }, 'Accounting está incluido en el plan Scale. Actualiza para activarlo.');
    } else if (state === 'marketplace') {
      body = React.createElement(MobileMarketplace, { d });
    } else {
      body = React.createElement(MobileDashboard, { d, devBanner: state === 'dev-banner', limited: state === 'permission-limited' });
    }

    const showChrome = !['loading'].includes(state);

    return React.createElement('div', { style: { height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--app-bg)', position: 'relative', overflow: 'hidden' } },
      showChrome && React.createElement(TopBar, { tenant: d.tenant, onTenant: () => setSheet('tenant'), onMood: () => setSheet('mood'), onAssistant: () => setSheet('assistant') }),
      React.createElement('div', { style: { flex: 1, overflowY: 'auto' } }, body),
      showChrome && React.createElement(BottomTabs, { active: state === 'marketplace' ? 'more' : tab, onTab: (k) => { if (k === 'more') setSheet('nav'); else setTab(k); } }),

      sheet === 'nav' && React.createElement(Sheet, { title: 'Products', onClose: () => setSheet(null) },
        React.createElement('div', { style: { display: 'grid', gap: 4 } },
          d.products.map(p => {
            const muted = p.state === 'disabled' || p.state === 'locked';
            return React.createElement('div', { key: p.key, style: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8px', borderRadius: 'var(--radius-xs)', opacity: muted ? 0.55 : 1 } },
              React.createElement('span', { style: { color: muted ? 'var(--text-subtle)' : 'var(--text)', display: 'inline-flex' } }, I({ name: p.icon, size: 19 })),
              React.createElement('span', { style: { flex: 1, fontSize: 'var(--text-sm)', fontWeight: 500, color: muted ? 'var(--text-subtle)' : 'var(--text-strong)' } }, p.name),
              p.state === 'locked' && I({ name: 'lock', size: 14, style: { color: 'var(--text-subtle)' } }),
              p.state === 'limited' && React.createElement(Pill, { tone: 'warning' }, 'Limited'),
              p.state === 'disabled' && React.createElement(Pill, { tone: 'neutral' }, 'Off'),
              p.state === 'available' && React.createElement(Pill, { tone: 'primary' }, 'Add'),
              p.badge && React.createElement(Pill, { tone: 'neutral' }, p.badge));
          }))),

      sheet === 'tenant' && React.createElement(Sheet, { title: 'Switch tenant', onClose: () => setSheet(null) },
        React.createElement('div', { style: { display: 'grid', gap: 8 } },
          d.memberships.map(m => React.createElement('div', { key: m.slug, style: { display: 'flex', alignItems: 'center', gap: 12, padding: 10, borderRadius: 'var(--radius-sm)', border: `1px solid ${m.slug === d.tenant.slug ? 'var(--primary)' : 'var(--border)'}`, background: m.slug === d.tenant.slug ? 'var(--primary-soft)' : 'var(--surface)' } },
            React.createElement(Avatar, { name: m.name, size: 34 }),
            React.createElement('div', { style: { flex: 1 } },
              React.createElement('div', { style: { fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)' } }, m.name),
              React.createElement('div', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' } }, m.role)),
            m.slug === d.tenant.slug && I({ name: 'check', size: 16, style: { color: 'var(--primary)' } }))))),

      sheet === 'mood' && React.createElement(Sheet, { title: 'Design mood', onClose: () => setSheet(null) },
        React.createElement(MoodMenu, { value: mood, onChange: onMood, moods: d.moods })),

      sheet === 'assistant' && React.createElement(Sheet, { title: 'Asistente IA', onClose: () => setSheet(null) },
        React.createElement('div', { style: { display: 'grid', gap: 12 } },
          React.createElement('p', { style: { margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text)', lineHeight: 1.5 } }, d.assistant.greeting),
          d.assistant.suggestions.map((s, i) => React.createElement('div', { key: i, style: { background: 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 13, display: 'grid', gap: 8 } },
            React.createElement('div', { style: { display: 'flex', gap: 10, alignItems: 'flex-start' } },
              React.createElement('span', { style: { width: 28, height: 28, flex: 'none', borderRadius: 'var(--radius-xs)', display: 'grid', placeItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', color: tones[s.tone] } }, I({ name: s.icon, size: 15 })),
              React.createElement('div', { style: { flex: 1 } },
                React.createElement('div', { style: { fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)', lineHeight: 1.35 } }, s.title),
                React.createElement('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.45 } }, s.body))),
            React.createElement('div', { style: { display: 'flex', gap: 8 } },
              React.createElement(Btn, { variant: 'secondary', size: 'sm' }, s.action),
              React.createElement(Btn, { variant: 'ghost', size: 'sm' }, 'Descartar')))),
          React.createElement('div', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', lineHeight: 1.45, paddingTop: 2 } }, d.assistant.disclaimer))));
  }

  window.Mobile = { MobileShell };
})();
