/* Desktop Platform Shell — sidebar, top bar (tenant context + in-shell mood
   switcher), dashboard content and the add-product marketplace. */
(function () {
  const { useState } = React;
  const Icon = window.Icon;
  const { Btn, Pill, Banner, Avatar, Brand, NavRow, MoodMenu } = window.UI;
  const GROUPS = ['Core', 'Finance', 'Commerce', 'Clinics', 'Platform'];

  /* --------------------------------------------------------------- Sidebar */
  function Sidebar({ products, activeKey, onNav, onMarketplace, user }) {
    return (
      <aside style={{
        width: 248, flex: 'none', display: 'flex', flexDirection: 'column', height: '100%',
        background: 'var(--sidebar-bg)', borderRight: '1px solid var(--sidebar-border)',
        '--text-strong': 'var(--sidebar-fg-strong)', '--text': 'var(--sidebar-fg)',
        '--text-muted': 'var(--sidebar-muted)', '--text-subtle': 'var(--sidebar-muted)',
        '--surface-hover': 'var(--sidebar-hover)', '--primary': 'var(--sidebar-accent)',
        '--primary-soft': 'var(--sidebar-active-bg)', '--on-primary-soft': 'var(--sidebar-active-fg)',
        '--border': 'var(--sidebar-border)', '--divider': 'var(--sidebar-border)',
        '--surface': 'var(--sidebar-surface)', '--border-strong': 'var(--sidebar-surface-border)'
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

  /* ---------------------------------------------------------------- TopBar */
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

  /* ------------------------------------------------------------- Dashboard */
  function Dashboard({ d }) {
    return (
      <div style={{ padding: 24, display: 'grid', gap: 20, maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div className="ds-eyebrow">Operations</div>
            <h1 style={{ margin: '4px 0 0', fontSize: 'var(--text-display)', fontWeight: 700, letterSpacing: 'var(--track-tight)', color: 'var(--text-strong)' }}>Dashboard</h1>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn variant="secondary" leading="clock">Junio 2026</Btn>
            <Btn variant="primary" leading="plus">Nueva factura</Btn>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {d.kpis.map((k, i) => (
            <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--card-pad)', display: 'grid', gap: 6 }}>
              <span className="ds-eyebrow">{k.label}</span>
              <strong className="ds-tnum" style={{ fontSize: 'var(--text-h1)', fontWeight: 600, letterSpacing: 'var(--track-snug)', color: 'var(--text-strong)', lineHeight: 1.1 }}>{k.value}</strong>
              <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                <span style={{ fontWeight: 600, color: k.tone === 'up' ? 'var(--success)' : 'var(--text-muted)' }}>{k.delta}</span>{k.hint}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16, alignItems: 'start' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--divider)' }}>
              <h3 style={{ margin: 0, fontSize: 'var(--text-h3)', fontWeight: 600, color: 'var(--text-strong)' }}>Actividad reciente</h3>
              <Btn variant="ghost" size="sm" trailing="chevronRight">Ver todo</Btn>
            </div>
            {d.activity.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '13px 18px', borderBottom: i < d.activity.length - 1 ? '1px solid var(--divider)' : 'none' }}>
                <span style={{ width: 30, height: 30, flex: 'none', borderRadius: 'var(--radius-xs)', display: 'grid', placeItems: 'center', background: 'var(--surface-sunken)', color: 'var(--text-muted)' }}><Icon name={a.icon} size={16} /></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-strong)', lineHeight: 1.4 }}>{a.what}</div>
                  <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', marginTop: 2 }}>{a.who + ' · ' + a.when}</div>
                </div>
                <Pill tone={a.tone} dot>{a.tone === 'success' ? 'Listo' : a.tone === 'warning' ? 'Atención' : a.tone === 'info' ? 'Revisión' : 'Info'}</Pill>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--card-pad)', display: 'grid', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'var(--primary)', display: 'inline-flex' }}><Icon name="ai" size={18} /></span>
                <h3 style={{ margin: 0, fontSize: 'var(--text-h3)', fontWeight: 600, color: 'var(--text-strong)' }}>AI Console</h3>
                <Pill tone="primary" style={{ marginLeft: 'auto' }}>Suggestion</Pill>
              </div>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.5 }}>invoice-document-assistant preparó un borrador de checklist. Requiere tu aprobación antes de cualquier ejecución.</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <Btn variant="primary" size="sm">Revisar</Btn>
                <Btn variant="ghost" size="sm">Descartar</Btn>
              </div>
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--card-pad)', display: 'grid', gap: 10 }}>
              <div className="ds-eyebrow">Plan</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 'var(--text-h3)', fontWeight: 600, color: 'var(--text-strong)' }}>{d.subscription.planName}</span>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{d.subscription.priceDisplay}</span>
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{'Renueva el ' + d.subscription.renewsAt + ' · ' + d.subscription.seats.used + '/' + d.subscription.seats.included + ' asientos'}</div>
              <Btn variant="secondary" size="sm" full>Manage subscription</Btn>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ----------------------------------------------------------- Marketplace */
  function Marketplace({ d, onClose }) {
    return (
      <div style={{ padding: 24, display: 'grid', gap: 18, maxWidth: 1180, margin: '0 auto' }}>
        <div>
          <button className="ds-focusable" onClick={onClose} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 'var(--text-sm)', padding: 0, marginBottom: 10 }}><Icon name="arrowLeft" size={15} />Back to dashboard</button>
          <div className="ds-eyebrow">Marketplace</div>
          <h1 style={{ margin: '4px 0 0', fontSize: 'var(--text-display)', fontWeight: 700, letterSpacing: 'var(--track-tight)', color: 'var(--text-strong)' }}>Add products</h1>
          <p style={{ margin: '6px 0 0', fontSize: 'var(--text-body)', color: 'var(--text-muted)', maxWidth: 560 }}>Activate independent products for this tenant. Each one installs as its own module inside the platform.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {d.catalog.map((p) => {
            const ctaLabel = p.cta === 'add' ? 'Add product' : p.cta === 'upgrade' ? 'Upgrade plan' : 'Open';
            const ctaVar = p.cta === 'open' ? 'secondary' : 'primary';
            return (
              <div key={p.key} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--card-pad)', display: 'grid', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ width: 40, height: 40, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: 'var(--primary-soft)', color: 'var(--primary)' }}><Icon name={p.icon} size={20} /></span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <h3 style={{ margin: 0, fontSize: 'var(--text-h3)', fontWeight: 600, color: 'var(--text-strong)', lineHeight: 1.25 }}>{p.name}</h3>
                      {p.cta === 'upgrade' && <Pill tone="warning">Scale plan</Pill>}
                    </div>
                    <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', marginTop: 2 }}>{p.group}</div>
                  </div>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)', whiteSpace: 'nowrap', flex: 'none' }}>{p.price}</span>
                </div>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.5 }}>{p.summary}</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Btn variant={ctaVar} size="sm">{ctaLabel}</Btn>
                  <Btn variant="ghost" size="sm">Learn more</Btn>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  window.Desktop = { Sidebar, TopBar, Dashboard, Marketplace };
})();
