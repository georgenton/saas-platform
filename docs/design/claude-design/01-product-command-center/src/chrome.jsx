/* Shell chrome reused from the Platform Shell (slice 00): desktop Sidebar +
   TopBar, and the mobile TopBar / BottomTabs / Sheet. The Command Center mounts
   inside this frame — the chrome never disappears across states. All styling
   reads mood tokens; the sidebar + bottom tabs re-map content tokens onto their
   --sidebar-* chrome layer so primitives need no special-casing. */
(function () {
  const { useState } = React;
  const Icon = window.Icon;
  const { Btn, Avatar, Brand, NavRow, MoodMenu } = window.UI;
  const GROUPS = ['Core', 'Finance', 'Commerce', 'Clinics', 'Platform'];

  const SIDEBAR_VARS = {
    '--text-strong': 'var(--sidebar-fg-strong)', '--text': 'var(--sidebar-fg)',
    '--text-muted': 'var(--sidebar-muted)', '--text-subtle': 'var(--sidebar-muted)',
    '--surface-hover': 'var(--sidebar-hover)', '--primary': 'var(--sidebar-accent)',
    '--primary-soft': 'var(--sidebar-active-bg)', '--on-primary-soft': 'var(--sidebar-active-fg)',
    '--border': 'var(--sidebar-border)', '--divider': 'var(--sidebar-border)',
    '--surface': 'var(--sidebar-surface)', '--border-strong': 'var(--sidebar-surface-border)'
  };

  /* --------------------------------------------------------------- Sidebar */
  function Sidebar({ products, activeKey, onNav, onMarketplace, user }) {
    return (
      <aside style={{
        width: 248, flex: 'none', display: 'flex', flexDirection: 'column', height: '100%',
        background: 'var(--sidebar-bg)', borderRight: '1px solid var(--sidebar-border)', ...SIDEBAR_VARS
      }}>
        <div style={{ padding: '16px 16px 12px' }}><Brand /></div>
        <nav style={{ flex: 1, overflowY: 'auto', padding: '4px 12px' }}>
          {GROUPS.map((g) => {
            const items = products.filter((p) => p.group === g);
            if (!items.length) return null;
            return (
              <div key={g} style={{ marginBottom: 14 }}>
                <div className="ds-eyebrow" style={{ padding: '6px 10px 4px' }}>{g}</div>
                {items.map((p) => <NavRow key={p.key} p={p} active={p.key === activeKey} onClick={onNav} />)}
              </div>
            );
          })}
        </nav>
        <div style={{ padding: 12, borderTop: '1px solid var(--divider)', display: 'grid', gap: 10 }}>
          <Btn variant="secondary" full leading="marketplace" onClick={onMarketplace}>Add products</Btn>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 4px 0' }}>
            <Avatar name={user.name} size={32} shape="circle" />
            <div style={{ display: 'grid', flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</span>
              <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>Owner</span>
            </div>
            <span style={{ color: 'var(--text-subtle)', display: 'inline-flex' }}><Icon name="logout" size={16} /></span>
          </div>
        </div>
      </aside>
    );
  }

  /* ---------------------------------------------------------- Desktop TopBar */
  function TopBar({ tenant, memberships, section, mood, moods, onMood, onAssistant, showTenantMenu }) {
    const [tOpen, setTOpen] = useState(false);
    const [mOpen, setMOpen] = useState(false);
    return (
      <header style={{ height: 60, flex: 'none', background: 'var(--topbar-bg)', borderBottom: '1px solid var(--topbar-border)', display: 'flex', alignItems: 'center', gap: 14, padding: '0 18px', position: 'relative', zIndex: 5 }}>
        <div style={{ position: 'relative' }}>
          <button className="ds-focusable" onClick={() => setTOpen((o) => !o)} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '6px 10px', cursor: 'pointer' }}>
            <span style={{ color: 'var(--primary)', display: 'inline-flex' }}><Icon name="building" size={18} /></span>
            <span style={{ display: 'grid', textAlign: 'left' }}>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)', lineHeight: 1.2 }}>{tenant.name}</span>
              <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>{tenant.role + ' · RUC ' + tenant.ruc}</span>
            </span>
            <span style={{ color: 'var(--text-subtle)', display: 'inline-flex' }}><Icon name="chevronDown" size={15} /></span>
          </button>
          {tOpen && showTenantMenu && (
            <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, width: 260, background: 'var(--surface-raised)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', padding: 6, display: 'grid', gap: 2 }}>
              <div className="ds-eyebrow" style={{ padding: '6px 8px' }}>Switch tenant</div>
              {memberships.map((m) => (
                <button key={m.slug} className="ds-focusable" onClick={() => setTOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, borderRadius: 'var(--radius-xs)', border: 'none', background: m.slug === tenant.slug ? 'var(--primary-soft)' : 'transparent', cursor: 'pointer', textAlign: 'left' }}>
                  <Avatar name={m.name} size={28} />
                  <span style={{ display: 'grid', flex: 1 }}>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)' }}>{m.name}</span>
                    <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>{m.role}</span>
                  </span>
                  {m.slug === tenant.slug && <span style={{ color: 'var(--primary)', display: 'inline-flex' }}><Icon name="check" size={15} /></span>}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
          <Icon name="chevronRight" size={14} />
          <span style={{ fontWeight: 600, color: 'var(--text-strong)' }}>{section}</span>
        </div>

        <div style={{ flex: 1 }} />

        <button className="ds-focusable" onClick={onAssistant} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 36, padding: '0 12px', background: 'var(--primary-soft)', color: 'var(--on-primary-soft)', border: '1px solid transparent', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 700, fontSize: 'var(--text-sm)' }}>
          <Icon name="spark" size={16} />Asistente
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0 10px', height: 36, width: 180, color: 'var(--text-subtle)' }}>
          <Icon name="search" size={16} />
          <span style={{ fontSize: 'var(--text-sm)' }}>Search…</span>
          <span style={{ marginLeft: 'auto', fontSize: 'var(--text-2xs)', fontFamily: 'var(--font-mono)', border: '1px solid var(--border)', borderRadius: 4, padding: '0 5px' }}>⌘K</span>
        </div>

        <div style={{ position: 'relative' }}>
          <button className="ds-focusable" aria-label="Design mood" onClick={() => setMOpen((o) => !o)} style={{ width: 36, height: 36, display: 'grid', placeItems: 'center', background: mOpen ? 'var(--surface-hover)' : 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--text)' }}>
            <Icon name="sliders" size={17} />
          </button>
          {mOpen && (
            <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, width: 256, background: 'var(--surface-raised)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', padding: 10, display: 'grid', gap: 8 }}>
              <div className="ds-eyebrow">Design mood</div>
              <MoodMenu value={mood} onChange={onMood} moods={moods} />
              <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', lineHeight: 1.5 }}>Frontend-only preference. Backend persistence is future backlog.</div>
            </div>
          )}
        </div>

        <button className="ds-focusable" aria-label="Notifications" style={{ position: 'relative', width: 36, height: 36, display: 'grid', placeItems: 'center', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--text)' }}>
          <Icon name="bell" size={17} />
          <span style={{ position: 'absolute', top: 8, right: 9, width: 7, height: 7, borderRadius: 999, background: 'var(--danger)', border: '1.5px solid var(--surface)' }} />
        </button>
        <Avatar name={tenant.name} size={36} shape="circle" />
      </header>
    );
  }

  /* ----------------------------------------------------------- Mobile chrome */
  const MTABS = [
    { key: 'command-center', name: 'Inicio', icon: 'home' },
    { key: 'invoicing', name: 'Facturación', icon: 'invoicing' },
    { key: 'growth', name: 'Growth', icon: 'growth', badge: 3 },
    { key: 'ai-console', name: 'IA', icon: 'ai' },
    { key: 'more', name: 'Más', icon: 'menu' }
  ];

  function MobileTopBar({ tenant, onTenant, onMood, onAssistant }) {
    return (
      <div style={{ height: 54, flex: 'none', display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', background: 'var(--topbar-bg)', borderBottom: '1px solid var(--topbar-border)' }}>
        <Brand compact />
        <button className="ds-focusable" onClick={onTenant} style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 2, background: 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: 'var(--radius-pill)', padding: '5px 10px', cursor: 'pointer', minWidth: 0 }}>
          <span style={{ color: 'var(--primary)', display: 'inline-flex' }}><Icon name="building" size={14} /></span>
          <span style={{ fontSize: 'var(--text-2xs)', fontWeight: 700, color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 78 }}>{tenant.name}</span>
          <Icon name="chevronDown" size={13} style={{ color: 'var(--text-subtle)' }} />
        </button>
        <div style={{ flex: 1 }} />
        <button className="ds-focusable" aria-label="Asistente IA" onClick={onAssistant} style={{ width: 34, height: 34, display: 'grid', placeItems: 'center', background: 'var(--primary-soft)', border: '1px solid transparent', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--on-primary-soft)' }}><Icon name="spark" size={16} /></button>
        <button className="ds-focusable" aria-label="Design mood" onClick={onMood} style={{ width: 34, height: 34, display: 'grid', placeItems: 'center', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--text)' }}><Icon name="sliders" size={16} /></button>
        <button className="ds-focusable" aria-label="Notifications" style={{ position: 'relative', width: 34, height: 34, display: 'grid', placeItems: 'center', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--text)' }}>
          <Icon name="bell" size={16} /><span style={{ position: 'absolute', top: 7, right: 8, width: 6, height: 6, borderRadius: 999, background: 'var(--danger)', border: '1.5px solid var(--surface)' }} />
        </button>
      </div>
    );
  }

  function BottomTabs({ active, onTab }) {
    return (
      <nav style={{ height: 58, flex: 'none', display: 'flex', background: 'var(--sidebar-bg)', borderTop: '1px solid var(--sidebar-border)', paddingBottom: 'env(safe-area-inset-bottom)', '--primary': 'var(--sidebar-accent)', '--text-muted': 'var(--sidebar-muted)' }}>
        {MTABS.map((t) => {
          const on = t.key === active;
          return (
            <button key={t.key} className="ds-focusable" onClick={() => onTab(t.key)} aria-current={on ? 'page' : undefined}
              style={{ flex: 1, display: 'grid', justifyItems: 'center', gap: 3, padding: '8px 0', background: 'transparent', border: 'none', cursor: 'pointer', color: on ? 'var(--sidebar-accent)' : 'var(--sidebar-muted)', position: 'relative' }}>
              <span style={{ position: 'relative', display: 'inline-flex' }}>
                <Icon name={t.icon} size={21} />
                {t.badge && <span style={{ position: 'absolute', top: -4, right: -7, fontSize: 9, fontWeight: 700, color: '#fff', background: 'var(--danger)', borderRadius: 999, minWidth: 14, height: 14, display: 'grid', placeItems: 'center', padding: '0 3px' }}>{t.badge}</span>}
              </span>
              <span style={{ fontSize: 10, fontWeight: on ? 600 : 500 }}>{t.name}</span>
            </button>
          );
        })}
      </nav>
    );
  }

  function Sheet({ title, children, onClose }) {
    return (
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 30, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,12,18,0.42)' }} />
        <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative', background: 'var(--surface-raised)', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16, maxHeight: '80%', overflowY: 'auto', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: 'var(--border-strong)', margin: '0 auto 12px' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 'var(--text-h3)', fontWeight: 600, color: 'var(--text-strong)' }}>{title}</h3>
            <button className="ds-focusable" onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'inline-flex', padding: 4 }}><Icon name="x" size={18} /></button>
          </div>
          {children}
        </div>
      </div>
    );
  }

  window.Chrome = { Sidebar, TopBar, MobileTopBar, BottomTabs, Sheet, MTABS };
})();
