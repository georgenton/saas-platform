/* Product Command Center — desktop content area. Mounts inside the Platform
   Shell <main>. Composition:
     SummaryRail   tenant · subscription/plan · product-access overview
     DomainSection finance · commerce · ai · clinics (operational grouping)
       ProductStatusCard  state-driven: enabled / permission_limited /
                          blocked_by_plan / available / disabled
   Plus empty / loading / error variants. All styling reads mood tokens, so
   moods reskin cards, controls, density and feedback — not just background. */
(function () {
  const { useState } = React;
  const Icon = window.Icon;
  const { Btn, Pill, Banner } = window.UI;

  /* Access-state design system (single source of truth for the card system) */
  const STATE = {
    enabled:            { pill: 'success', label: 'Activo',            active: true },
    permission_limited: { pill: 'warning', label: 'Permiso limitado',  active: true },
    blocked_by_plan:    { pill: 'info',    label: 'Requiere Scale', lock: true, active: false },
    available:          { pill: 'primary', label: 'Disponible',        active: false },
    disabled:           { pill: 'neutral', label: 'No habilitado',     active: false }
  };
  const DOT = { success: 'var(--success)', warning: 'var(--warning)', neutral: 'var(--text-subtle)' };

  function Card({ children, sunken, style }) {
    return (
      <article style={{
        display: 'flex', flexDirection: 'column', background: sunken ? 'var(--surface-sunken)' : 'var(--surface)',
        border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: sunken ? 'none' : 'var(--shadow-sm)',
        padding: 'var(--card-pad)', gap: 14, ...style
      }}>{children}</article>
    );
  }

  function IconTile({ name, active, size = 40 }) {
    return (
      <span style={{
        width: size, height: size, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center',
        background: active ? 'var(--primary-soft)' : 'var(--surface)', border: active ? '1px solid transparent' : '1px solid var(--border)',
        color: active ? 'var(--primary)' : 'var(--text-muted)'
      }}><Icon name={name} size={Math.round(size * 0.5)} /></span>
    );
  }

  /* ------------------------------------------------------------- ReadinessRow */
  function ReadinessRow({ r }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, minHeight: 22 }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: '1 1 auto', minWidth: 0 }}>{r.label}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, flex: 'none' }}>
          <span style={{ width: 7, height: 7, borderRadius: 999, flex: 'none', background: DOT[r.tone] || DOT.neutral }} />
          <span className="ds-tnum" style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)', whiteSpace: 'nowrap' }}>{r.value}</span>
        </span>
      </div>
    );
  }

  function IncludesList({ items }) {
    return (
      <div style={{ display: 'grid', gap: 7 }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <span style={{ color: 'var(--text-subtle)', flex: 'none', marginTop: 1, display: 'inline-flex' }}><Icon name="check" size={14} /></span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text)', lineHeight: 1.4 }}>{it}</span>
          </div>
        ))}
      </div>
    );
  }

  function BlockerRow({ blocker }) {
    const tones = {
      warning: ['var(--warning-soft)', 'var(--on-warning-soft)', 'var(--warning)', 'eye'],
      info: ['var(--info-soft)', 'var(--on-info-soft)', 'var(--info)', 'lock'],
      primary: ['var(--primary-soft)', 'var(--on-primary-soft)', 'var(--primary)', 'sprout'],
      neutral: ['var(--surface-sunken)', 'var(--text-muted)', 'var(--text-subtle)', 'eye']
    };
    const [bg, fg, ac, icon] = tones[blocker.tone] || tones.neutral;
    return (
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, background: bg, borderRadius: 'var(--radius-sm)', padding: '9px 11px' }}>
        <span style={{ color: ac, flex: 'none', marginTop: 1, display: 'inline-flex' }}><Icon name={icon} size={15} /></span>
        <span style={{ fontSize: 'var(--text-xs)', color: fg, lineHeight: 1.45 }}>{blocker.text}</span>
      </div>
    );
  }

  /* --------------------------------------------------------- ProductStatusCard */
  function ProductStatusCard({ p }) {
    const s = STATE[p.accessState] || STATE.disabled;
    const primaryVariant = p.primary.action === 'marketplace' ? 'secondary' : 'primary';
    return (
      <Card sunken={!s.active}>
        <header style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <IconTile name={p.icon} active={s.active} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ margin: 0, fontSize: 'var(--text-h3)', fontWeight: 600, color: 'var(--text-strong)', lineHeight: 1.25 }}>{p.name}</h3>
            <p style={{ margin: '3px 0 0', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.45 }}>{p.purpose}</p>
          </div>
          <Pill tone={s.pill} dot solid={false} style={{ flex: 'none' }}>{s.lock && <Icon name="lock" size={11} />}{s.label}</Pill>
        </header>

        <div style={{ height: 1, background: 'var(--divider)' }} />

        <div style={{ flex: 1, display: 'grid', gap: 12, alignContent: 'start' }}>
          {s.active ? (
            <React.Fragment>
              <div style={{ display: 'grid', gap: 9 }}>{p.readiness.map((r, i) => <ReadinessRow key={i} r={r} />)}</div>
              {p.evidence && (
                <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-sm)', padding: '9px 11px' }}>
                  <span style={{ color: 'var(--text-subtle)', flex: 'none', marginTop: 1, display: 'inline-flex' }}><Icon name="clock" size={14} /></span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-strong)', fontWeight: 500, lineHeight: 1.35 }}>{p.evidence.label}</div>
                    <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', marginTop: 1 }}>
                      {p.evidence.mono ? <span style={{ fontFamily: 'var(--font-mono)' }}>{p.evidence.mono}</span> : p.evidence.source}{' · ' + p.evidence.when}
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          ) : (
            <React.Fragment>
              {p.includes && (
                <div style={{ display: 'grid', gap: 8 }}>
                  <span className="ds-eyebrow">Qué desbloquea</span>
                  <IncludesList items={p.includes} />
                </div>
              )}
            </React.Fragment>
          )}
          {p.blocker && <BlockerRow blocker={p.blocker} />}
        </div>

        <footer style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 2 }}>
          <Btn variant={primaryVariant} size="sm" trailing={p.primary.action === 'enter' ? 'arrowRight' : undefined} leading={p.primary.action === 'add' ? 'plus' : undefined}>{p.primary.label}</Btn>
          {p.secondary && <Btn variant="ghost" size="sm">{p.secondary.label}</Btn>}
          {(p.addonPrice && !s.active) && <span style={{ marginLeft: 'auto', fontSize: 'var(--text-2xs)', fontWeight: 600, color: 'var(--text-muted)' }}>{p.addonPrice}</span>}
        </footer>
      </Card>
    );
  }

  /* --------------------------------------------------------------- SummaryRail */
  function SummaryCardShell({ icon, eyebrow, children, action }) {
    return (
      <Card style={{ gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <IconTile name={icon} active size={34} />
          <span className="ds-eyebrow">{eyebrow}</span>
          {action}
        </div>
        {children}
      </Card>
    );
  }

  function TenantSummary({ t }) {
    const Row = ({ k, v, mono, pill }) => (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{k}</span>
        {pill ? pill : <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)', fontFamily: mono ? 'var(--font-mono)' : 'inherit' }}>{v}</span>}
      </div>
    );
    return (
      <SummaryCardShell icon="building" eyebrow="Empresa">
        <div style={{ fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)', letterSpacing: 'var(--track-snug)' }}>{t.name}</div>
        <div style={{ display: 'grid', gap: 8 }}>
          <Row k="RUC" v={t.ruc} mono />
          <Row k="Rol" v={t.role} />
          <Row k="Ambiente" pill={<Pill tone={t.environment === 'production' ? 'success' : 'warning'} dot>{t.environmentLabel}</Pill>} />
          <Row k="Miembros" v={t.members} />
        </div>
      </SummaryCardShell>
    );
  }

  function PlanSummary({ sub, onManage }) {
    const pct = Math.round((sub.seats.used / sub.seats.included) * 100);
    return (
      <SummaryCardShell icon="creditCard" eyebrow="Suscripción">
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' }}>Plan {sub.planName}</span>
          <span className="ds-tnum" style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-muted)' }}>{sub.priceDisplay}</span>
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Renueva</span>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)' }}>{sub.renewsAt}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Asientos</span>
            <span className="ds-tnum" style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)' }}>{sub.seats.used} / {sub.seats.included}</span>
          </div>
          <div style={{ height: 6, borderRadius: 999, background: 'var(--surface-sunken)', overflow: 'hidden' }}>
            <div style={{ width: pct + '%', height: '100%', borderRadius: 999, background: 'var(--primary)' }} />
          </div>
        </div>
        <Btn variant="secondary" size="sm" full onClick={onManage}>Gestionar plan</Btn>
      </SummaryCardShell>
    );
  }

  function AccessOverview({ ov, onMarketplace }) {
    return (
      <SummaryCardShell icon="layers" eyebrow="Productos">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span className="ds-tnum" style={{ fontSize: 'var(--text-display)', fontWeight: 700, color: 'var(--text-strong)', lineHeight: 1, letterSpacing: 'var(--track-tight)' }}>{ov.total}</span>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>productos en tu espacio</span>
        </div>
        <div style={{ display: 'grid', gap: 7 }}>
          {ov.counts.map((c) => (
            <div key={c.state} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, flex: 'none', background: c.tone === 'primary' ? 'var(--primary)' : c.tone === 'neutral' ? 'var(--text-subtle)' : `var(--${c.tone})` }} />
                {c.label}
              </span>
              <span className="ds-tnum" style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)' }}>{c.value}</span>
            </div>
          ))}
        </div>
        <Btn variant="ghost" size="sm" leading="marketplace" onClick={onMarketplace}>Add products</Btn>
      </SummaryCardShell>
    );
  }

  function SummaryRail({ d, onMarketplace }) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--gutter)' }}>
        <TenantSummary t={d.tenant} />
        <PlanSummary sub={d.subscription} onManage={() => {}} />
        <AccessOverview ov={d.accessOverview} onMarketplace={onMarketplace} />
      </div>
    );
  }

  /* -------------------------------------------------------------- DomainSection */
  function DomainSection({ domain, products }) {
    const activeCount = products.filter((p) => STATE[p.accessState] && STATE[p.accessState].active).length;
    return (
      <section style={{ display: 'grid', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: 'var(--text-muted)', display: 'inline-flex' }}><Icon name={domain.icon} size={17} /></span>
          <h2 style={{ margin: 0, fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)', letterSpacing: 'var(--track-snug)' }}>{domain.name}</h2>
          <span style={{ fontSize: 'var(--text-2xs)', fontWeight: 600, color: 'var(--text-muted)', background: 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: 999, padding: '2px 9px' }}>{activeCount} activos · {products.length}</span>
          <div style={{ flex: 1, height: 1, background: 'var(--divider)', marginLeft: 4 }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--gutter)' }}>
          {products.map((p) => <ProductStatusCard key={p.key} p={p} />)}
        </div>
      </section>
    );
  }

  /* ------------------------------------------------------------------- Header */
  function PageHeader({ user }) {
    const first = (user.name || '').split(' ')[0];
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div className="ds-eyebrow">Workspace</div>
          <h1 style={{ margin: '4px 0 0', fontSize: 'var(--text-display)', fontWeight: 700, letterSpacing: 'var(--track-tight)', color: 'var(--text-strong)' }}>Centro de operaciones</h1>
          <p style={{ margin: '6px 0 0', fontSize: 'var(--text-body)', color: 'var(--text-muted)', maxWidth: 560 }}>Hola {first} — esto es lo que tu espacio de trabajo pide atender hoy. Entra a un producto o agrega los que necesites.</p>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 'var(--text-xs)', color: 'var(--text-subtle)' }}>
          <Icon name="refresh" size={14} />Actualizado hace un momento
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------- CommandCenter */
  function CommandCenter({ d, banner, onMarketplace }) {
    return (
      <div style={{ padding: 24, display: 'grid', gap: 22, maxWidth: 1240, margin: '0 auto' }}>
        {banner}
        <PageHeader user={d.user} />
        <SummaryRail d={d} onMarketplace={onMarketplace} />
        <div style={{ display: 'grid', gap: 26 }}>
          {d.domains.map((dom) => {
            const products = d.products.filter((p) => p.domain === dom.key);
            if (!products.length) return null;
            return <DomainSection key={dom.key} domain={dom} products={products} />;
          })}
        </div>
      </div>
    );
  }

  /* --------------------------------------------------------------- EmptyState */
  function EmptyWorkspace({ d, onMarketplace }) {
    return (
      <div style={{ padding: 24, display: 'grid', gap: 22, maxWidth: 1240, margin: '0 auto' }}>
        <PageHeader user={d.user} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--gutter)' }}>
          <TenantSummary t={d.tenant} />
          <PlanSummary sub={d.subscription} />
          <AccessOverview ov={{ total: 0, counts: [{ state: 'available', label: 'Listos para activar', value: 8, tone: 'primary' }] }} onMarketplace={onMarketplace} />
        </div>
        <div style={{ display: 'grid', placeItems: 'center', padding: '40px 24px', background: 'var(--surface)', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ maxWidth: 460, textAlign: 'center', display: 'grid', gap: 14, justifyItems: 'center' }}>
            <span style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', display: 'grid', placeItems: 'center', background: 'var(--primary-soft)', color: 'var(--primary)' }}><Icon name="sprout" size={26} /></span>
            <h2 style={{ margin: 0, fontSize: 'var(--text-h1)', fontWeight: 600, color: 'var(--text-strong)' }}>{d.empty.title}</h2>
            <p style={{ margin: 0, fontSize: 'var(--text-body)', color: 'var(--text-muted)', lineHeight: 1.6 }}>{d.empty.message}</p>
            <Btn variant="primary" leading="marketplace" onClick={onMarketplace}>Explorar el marketplace</Btn>
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------- Loading/Error */
  function Sk({ h, w, r }) {
    return <div style={{ height: h, width: w || '100%', borderRadius: r || 'var(--radius-md)', background: 'var(--surface-sunken)', border: '1px solid var(--border)' }} />;
  }
  function CommandCenterLoading() {
    return (
      <div style={{ padding: 24, display: 'grid', gap: 22, maxWidth: 1240, margin: '0 auto' }}>
        <Sk h={56} w={340} r="var(--radius-sm)" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--gutter)' }}>{[0, 1, 2].map((i) => <Sk key={i} h={190} />)}</div>
        <Sk h={20} w={240} r={999} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px,1fr))', gap: 'var(--gutter)' }}>{[0, 1, 2].map((i) => <Sk key={i} h={250} />)}</div>
      </div>
    );
  }
  function CommandCenterError({ d }) {
    return (
      <div style={{ padding: 24, display: 'grid', gap: 18, maxWidth: 1240, margin: '0 auto' }}>
        <Banner tone="danger" icon="server" title={d.backendError.title}>{d.backendError.message}</Banner>
        <div style={{ display: 'grid', placeItems: 'center', padding: '48px 24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ maxWidth: 440, textAlign: 'center', display: 'grid', gap: 14, justifyItems: 'center' }}>
            <span style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', display: 'grid', placeItems: 'center', background: 'var(--danger-soft)', color: 'var(--danger)' }}><Icon name="server" size={26} /></span>
            <h2 style={{ margin: 0, fontSize: 'var(--text-h1)', fontWeight: 600, color: 'var(--text-strong)' }}>No pudimos cargar tus productos</h2>
            <p style={{ margin: 0, fontSize: 'var(--text-body)', color: 'var(--text-muted)', lineHeight: 1.6 }}>Tu sesión y tu empresa siguen activas. Reintenta en un momento; si continúa, comparte el identificador con soporte.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <Btn variant="primary" leading="refresh">Reintentar</Btn>
              <Btn variant="ghost">Estado del sistema</Btn>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)' }}>correlationId {d.backendError.correlationId}</div>
          </div>
        </div>
      </div>
    );
  }

  window.CC = { CommandCenter, EmptyWorkspace, CommandCenterLoading, CommandCenterError, ProductStatusCard, SummaryRail, STATE };
})();
