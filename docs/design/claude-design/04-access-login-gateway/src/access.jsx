/* Slice 04 — Access / Login Gateway, desktop. The signed-out entry that
   precedes the Platform Shell. A two-pane gateway: a calm branded trust panel
   (left) and a single focused action card (right) that resolves the session
   into the correct post-auth state. NOT the full product shell — nothing dense
   appears before access resolves. window.ACCESS. */
(function () {
  const { useState, useRef, useEffect } = React;
  const Icon = window.Icon;
  const { Btn, Pill, Banner, MoodMenu, Avatar } = window.UI;

  /* ---------------------------------------------------------- atoms */
  function Card({ children, style }) {
    return <div className="acc-rise" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg, 16px)', boxShadow: 'var(--shadow-lg)', padding: 28, width: '100%', maxWidth: 440, ...style }}>{children}</div>;
  }
  function Spinner({ size = 22 }) {
    return <span className="acc-spin" style={{ width: size, height: size, borderRadius: 999, border: '2.5px solid var(--border-strong)', borderTopColor: 'var(--primary)', display: 'inline-block', flex: 'none' }} />;
  }
  function Lozenge({ icon, tone = 'primary', size = 52 }) {
    const bg = tone === 'success' ? 'var(--success-soft)' : tone === 'danger' ? 'var(--danger-soft)' : tone === 'warning' ? 'var(--warning-soft)' : tone === 'info' ? 'var(--info-soft)' : 'var(--primary-soft)';
    const fg = tone === 'success' ? 'var(--success)' : tone === 'danger' ? 'var(--danger)' : tone === 'warning' ? 'var(--warning)' : tone === 'info' ? 'var(--info)' : 'var(--primary)';
    return <span style={{ width: size, height: size, flex: 'none', borderRadius: 'var(--radius-md)', display: 'grid', placeItems: 'center', background: bg, color: fg }}><Icon name={icon} size={Math.round(size * 0.46)} /></span>;
  }
  function CardHead({ icon, tone, eyebrow, title, body }) {
    return (
      <div style={{ display: 'grid', gap: 14, marginBottom: 22 }}>
        <Lozenge icon={icon} tone={tone} />
        <div style={{ display: 'grid', gap: 7 }}>
          {eyebrow && <span className="ds-eyebrow">{eyebrow}</span>}
          <h1 style={{ margin: 0, fontSize: 'var(--text-h1)', fontWeight: 700, letterSpacing: 'var(--track-snug)', color: 'var(--text-strong)', lineHeight: 1.2 }}>{title}</h1>
          {body && <p style={{ margin: 0, fontSize: 'var(--text-body)', color: 'var(--text-muted)', lineHeight: 'var(--leading-body)', textWrap: 'pretty' }}>{body}</p>}
        </div>
      </div>
    );
  }

  /* ---------------------------------------------- brand / trust panel */
  function BrandPanel({ d }) {
    return (
      <aside style={{
        flex: '1 1 0', minWidth: 0, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '48px 52px', overflow: 'hidden', background: 'var(--sidebar-bg)', borderRight: '1px solid var(--sidebar-border)',
        '--text-strong': 'var(--sidebar-fg-strong)', '--text': 'var(--sidebar-fg)', '--text-muted': 'var(--sidebar-muted)', '--text-subtle': 'var(--sidebar-muted)',
        '--surface': 'var(--sidebar-surface)', '--border': 'var(--sidebar-surface-border)', '--primary': 'var(--sidebar-accent)'
      }}>
        {/* faint corner glow */}
        <span style={{ position: 'absolute', top: -120, right: -120, width: 360, height: 360, borderRadius: 999, background: 'radial-gradient(circle, color-mix(in oklab, var(--sidebar-accent) 22%, transparent), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 38, height: 38, borderRadius: 'var(--radius-sm)', background: 'var(--sidebar-accent)', color: 'var(--sidebar-bg)', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 20, letterSpacing: '-0.04em', flex: 'none' }}>S</span>
          <span style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--sidebar-fg-strong)' }}>SaaS<span style={{ fontWeight: 700 }}>Platform</span></span>
        </div>

        <div style={{ position: 'relative', display: 'grid', gap: 18, maxWidth: 460 }}>
          <h2 style={{ margin: 0, fontSize: 34, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.12, color: 'var(--sidebar-fg-strong)', textWrap: 'balance' }}>{d.product.tagline}</h2>
          <p style={{ margin: 0, fontSize: 'var(--text-h3)', color: 'var(--sidebar-fg)', lineHeight: 1.5, textWrap: 'pretty' }}>{d.product.lede}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
            {d.capabilities.map((c) => (
              <span key={c.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--sidebar-fg)', background: 'color-mix(in oklab, var(--sidebar-fg-strong) 7%, transparent)', border: '1px solid var(--sidebar-surface-border)', borderRadius: 'var(--radius-pill)', padding: '7px 13px' }}>
                <span style={{ color: 'var(--sidebar-accent)', display: 'inline-flex' }}><Icon name={c.icon} size={15} /></span>{c.label}
              </span>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--text-sm)', color: 'var(--sidebar-muted)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><Icon name="shieldCheck" size={15} />Listo para el SRI</span>
          <span style={{ width: 3, height: 3, borderRadius: 999, background: 'var(--sidebar-muted)' }} />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><Icon name="mapPin" size={15} />{d.product.region}</span>
        </div>
      </aside>
    );
  }

  /* ---------------------------------------------- advanced token panel */
  function AdvancedToken({ open, onToggle, onUse, busy, error }) {
    return (
      <div style={{ border: '1px solid ' + (open ? 'var(--border-strong)' : 'var(--border)'), borderRadius: 'var(--radius-sm)', background: open ? 'var(--surface-sunken)' : 'transparent', transition: 'var(--transition-base)' }}>
        <button className="ds-focusable" onClick={onToggle} aria-expanded={open} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
          <span style={{ width: 28, height: 28, flex: 'none', borderRadius: 'var(--radius-xs)', display: 'grid', placeItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}><Icon name="terminal" size={15} /></span>
          <span style={{ flex: 1 }}>
            <span style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)' }}>Acceso avanzado · ya tengo un token</span>
            <span style={{ display: 'block', fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>Modo técnico para QA y pilotos controlados</span>
          </span>
          <span style={{ display: 'inline-flex', color: 'var(--text-muted)', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}><Icon name="chevronDown" size={16} /></span>
        </button>
        {open && (
          <div style={{ padding: '4px 14px 14px', display: 'grid', gap: 10 }}>
            {error && <Banner tone="danger" icon="alert" title={error.title}>{error.message} <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)' }}>({error.code})</span></Banner>}
            <label style={{ display: 'grid', gap: 5 }}>
              <span style={{ fontSize: 'var(--text-2xs)', fontWeight: 600, color: 'var(--text-muted)' }}>Bearer token</span>
              <textarea defaultValue={error ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.caducado…' : ''} placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…" spellCheck={false}
                style={{ width: '100%', boxSizing: 'border-box', height: 78, padding: 10, borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-strong)', background: 'var(--surface)', color: 'var(--text-strong)', fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: 1.5, resize: 'vertical' }} />
            </label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Btn variant="secondary" size="sm" leading={busy ? undefined : 'logIn'} disabled={busy} onClick={onUse}>{busy ? 'Verificando…' : 'Usar token'}</Btn>
              <Btn variant="ghost" size="sm" leading="copy">Pegar</Btn>
              <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="shield" size={12} />Sólo en este dispositivo</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ----------------------------------------------------- gateway card */
  function GatewayCard({ d, onContinue, busy, advOpen, setAdvOpen, onUseToken, tokenBusy, tokenError, onInvite }) {
    return (
      <Card>
        <CardHead eyebrow={'Acceso · ' + d.product.name} title="Entra a tu espacio de trabajo"
          body="Verificamos tu sesión y te llevamos directo al lugar correcto — sin pasos de más." icon="logIn" tone="primary" />

        <Btn variant="primary" size="lg" full leading={busy ? undefined : 'arrowRight'} disabled={busy} onClick={onContinue} style={{ marginBottom: 14 }}>
          {busy ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}><Spinner size={17} />Verificando tu sesión…</span> : 'Continuar'}
        </Btn>

        {/* future auth methods — non-interactive structure only */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '6px 0 12px' }}>
          <span style={{ flex: 1, height: 1, background: 'var(--divider)' }} />
          <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', fontWeight: 600 }}>PRÓXIMAMENTE</span>
          <span style={{ flex: 1, height: 1, background: 'var(--divider)' }} />
        </div>
        <div style={{ display: 'grid', gap: 8, marginBottom: 18 }}>
          {d.futureMethods.map((m) => (
            <div key={m.key} aria-disabled="true" title="Próximamente" style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border)', background: 'var(--surface-sunken)', opacity: 0.72, cursor: 'not-allowed' }}>
              <span style={{ color: 'var(--text-subtle)', display: 'inline-flex' }}><Icon name={m.icon} size={17} /></span>
              <span style={{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-muted)' }}>{m.label}</span>
              <Pill tone="neutral">Próximamente</Pill>
            </div>
          ))}
        </div>

        <AdvancedToken open={advOpen} onToggle={() => setAdvOpen((o) => !o)} onUse={onUseToken} busy={tokenBusy} error={tokenError} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 18, fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
          <span>¿Te invitaron a una empresa?</span>
          <button className="ds-focusable" onClick={onInvite} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', padding: '2px 4px', fontSize: 'var(--text-sm)' }}>Revisar invitación</button>
        </div>
      </Card>
    );
  }

  /* --------------------------------------------------- checking state */
  function CheckingCard() {
    return (
      <Card style={{ textAlign: 'center', display: 'grid', justifyItems: 'center', gap: 16, padding: '44px 28px' }}>
        <Spinner size={30} />
        <div style={{ display: 'grid', gap: 6 }}>
          <h1 style={{ margin: 0, fontSize: 'var(--text-h2)', fontWeight: 700, color: 'var(--text-strong)' }}>Verificando tu sesión…</h1>
          <p style={{ margin: 0, fontSize: 'var(--text-body)', color: 'var(--text-muted)', lineHeight: 1.5 }}>Un momento mientras confirmamos tu acceso y preparamos tu espacio de trabajo.</p>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)' }}>GET /api/auth/me</div>
      </Card>
    );
  }

  /* --------------------------------------------- backend unavailable */
  function ErrorCard({ d, onRetry }) {
    return (
      <Card>
        <CardHead icon="server" tone="danger" eyebrow="Sin conexión" title={d.backendError.title} body={d.backendError.message} />
        <div style={{ display: 'flex', gap: 10 }}>
          <Btn variant="primary" leading="refresh" onClick={onRetry}>Reintentar</Btn>
          <Btn variant="ghost" leading="terminal">Acceso avanzado</Btn>
        </div>
        <div style={{ marginTop: 16, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)' }}>correlationId {d.backendError.correlationId}</div>
      </Card>
    );
  }

  /* --------------------------------------------- invitation review */
  function InvitationCard({ d, onAccept, busy, onBack }) {
    const i = d.invitation;
    return (
      <Card>
        <CardHead icon="mail" tone="info" eyebrow="Invitación pendiente" title={'Te invitaron a ' + i.tenantName}
          body={i.invitedByName + ' te invitó a unirte como ' + i.role + '. Revisa los datos antes de aceptar.'} />
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: 18 }}>
          {[
            ['Empresa', i.tenantName, false],
            ['RUC', i.tenantRuc, true],
            ['Tu rol', i.role, false],
            ['Invitado por', i.invitedByName, false],
            ['Correo', i.email, true],
            ['Vence', i.expiresAt + ' · ' + i.expiresInLabel, false]
          ].map(([k, v, mono], idx, arr) => (
            <div key={k} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 14, padding: '10px 14px', borderBottom: idx < arr.length - 1 ? '1px solid var(--divider)' : 'none' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', flex: 'none' }}>{k}</span>
              <span style={{ fontSize: mono ? 'var(--text-xs)' : 'var(--text-sm)', fontFamily: mono ? 'var(--font-mono)' : 'inherit', fontWeight: 600, color: 'var(--text-strong)', textAlign: 'right' }}>{v}</span>
            </div>
          ))}
        </div>
        <Btn variant="primary" size="lg" full leading={busy ? undefined : 'check'} disabled={busy} onClick={onAccept} style={{ marginBottom: 10 }}>
          {busy ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}><Spinner size={17} />Aceptando…</span> : 'Aceptar invitación'}
        </Btn>
        <Btn variant="ghost" full onClick={onBack}>Ahora no</Btn>
        <p style={{ margin: '14px 0 0', fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', textAlign: 'center', lineHeight: 1.5 }}>Al aceptar, te unes a {i.tenantName} con el rol {i.role}.</p>
      </Card>
    );
  }

  /* --------------------------------------------- workspace selection */
  function WorkspaceCard({ d, onChoose, busyKey, onBack }) {
    return (
      <Card style={{ maxWidth: 480 }}>
        <CardHead icon="building" tone="primary" eyebrow="Elige tu espacio" title="¿Dónde quieres trabajar hoy?"
          body="Tu cuenta tiene acceso a varias empresas. Elige una para continuar — puedes cambiarla luego." />
        <div style={{ display: 'grid', gap: 10 }}>
          {d.tenancies.map((t) => {
            const busy = busyKey === t.slug;
            return (
              <button key={t.slug} className="ds-focusable" onClick={() => onChoose(t.slug)} disabled={!!busyKey}
                style={{ display: 'flex', alignItems: 'center', gap: 13, padding: 14, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface)', cursor: busyKey ? 'default' : 'pointer', textAlign: 'left', transition: 'var(--transition-base)', width: '100%' }}>
                <Avatar name={t.name} size={40} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: 'var(--text-body)', fontWeight: 600, color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</span>
                  <span style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>RUC {t.ruc}</span>
                    {t.environment !== 'production' && <Pill tone="warning">{t.environment}</Pill>}
                  </span>
                </span>
                <span style={{ display: 'grid', justifyItems: 'end', gap: 3, flex: 'none' }}>
                  <Pill tone="primary">{t.role}</Pill>
                  <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)' }}>{t.members} miembros · {t.products} productos</span>
                </span>
                <span style={{ color: 'var(--text-subtle)', display: 'inline-flex', flex: 'none' }}>{busy ? <Spinner size={17} /> : <Icon name="chevronRight" size={18} />}</span>
              </button>
            );
          })}
        </div>
        <button className="ds-focusable" onClick={onBack} style={{ display: 'block', margin: '16px auto 0', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', fontSize: 'var(--text-sm)' }}>Cerrar sesión</button>
      </Card>
    );
  }

  /* ------------------------------------------------------- no tenant */
  function NoTenantCard({ d, onInvite, onBack }) {
    const n = d.noTenant;
    return (
      <Card>
        <CardHead icon="building" tone="warning" eyebrow="Sin espacio de trabajo" title={n.title} body={n.body} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)', border: '1px solid var(--border)', marginBottom: 18 }}>
          <Icon name="mail" size={16} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)', color: 'var(--text-strong)' }}>{n.email}</span>
        </div>
        <div style={{ display: 'grid', gap: 10 }}>
          <Btn variant="primary" full leading="mail" onClick={onInvite}>Tengo una invitación</Btn>
          <Btn variant="ghost" full onClick={onBack}>Cerrar sesión</Btn>
        </div>
      </Card>
    );
  }

  /* --------------------------------------------- ready handoff */
  function ReadyCard({ d }) {
    const t = d.session.currentTenancy;
    const [entered, setEntered] = useState(false);
    return (
      <Card style={{ textAlign: 'center', display: 'grid', justifyItems: 'center', gap: 4 }}>
        <Lozenge icon="check" tone="success" size={56} />
        <h1 style={{ margin: '12px 0 0', fontSize: 'var(--text-h1)', fontWeight: 700, letterSpacing: 'var(--track-snug)', color: 'var(--text-strong)' }}>Todo listo, {d.session.user.name.split(' ')[0]}</h1>
        <p style={{ margin: '6px 0 16px', fontSize: 'var(--text-body)', color: 'var(--text-muted)', lineHeight: 1.5, maxWidth: 340 }}>Tu sesión está activa. Entrarás a <strong style={{ color: 'var(--text)' }}>{t.name}</strong> como {t.role}.</p>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)', border: '1px solid var(--border)', marginBottom: 18 }}>
          <span style={{ color: 'var(--primary)', display: 'inline-flex' }}><Icon name="building" size={18} /></span>
          <span style={{ flex: 1, textAlign: 'left' }}>
            <span style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)' }}>{t.name}</span>
            <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>RUC {t.ruc} · {t.environment}</span>
          </span>
          <Pill tone="success" dot>Sesión activa</Pill>
        </div>
        <Btn variant="primary" size="lg" full trailing="arrowRight" onClick={() => setEntered(true)} disabled={entered}>
          {entered ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}><Spinner size={17} />Abriendo Command Center…</span> : 'Entrar al Command Center'}
        </Btn>
        <p style={{ margin: '14px 0 0', fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', lineHeight: 1.5 }}>Continúa al <strong style={{ color: 'var(--text-muted)' }}>Product Command Center</strong> (slice 01).</p>
      </Card>
    );
  }

  /* ------------------------------------------ corner mood control */
  function MoodControl({ mood, moods, onMood }) {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ position: 'absolute', top: 18, right: 22, zIndex: 10 }}>
        <button className="ds-focusable" aria-label="Apariencia" onClick={() => setOpen((o) => !o)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 34, padding: '0 12px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 600, boxShadow: 'var(--shadow-sm)' }}>
          <Icon name="sliders" size={15} />Apariencia
        </button>
        {open && (
          <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, width: 250, background: 'var(--surface-raised)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', padding: 10, display: 'grid', gap: 8 }}>
            <div className="ds-eyebrow">Mood</div>
            <MoodMenu value={mood} onChange={(m) => { onMood(m); }} moods={moods} />
          </div>
        )}
      </div>
    );
  }

  /* ------------------------------------------------- desktop shell */
  function AccessDesktop({ d, state, onState, mood, moods, onMood }) {
    const [busy, setBusy] = useState(null);          // inline button busy key
    const [advOpen, setAdvOpen] = useState(state === 'invalid-token');
    const timer = useRef(null);
    useEffect(() => () => clearTimeout(timer.current), []);
    useEffect(() => { if (state === 'invalid-token') setAdvOpen(true); }, [state]);

    function go(key, target, ms = 1050) {
      setBusy(key);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => { setBusy(null); onState(target); }, ms);
    }

    let right;
    if (state === 'checking') right = <CheckingCard />;
    else if (state === 'backend-unavailable') right = <ErrorCard d={d} onRetry={() => go('retry', 'ready')} />;
    else if (state === 'invitation') right = <InvitationCard d={d} busy={busy === 'accept'} onAccept={() => go('accept', 'ready')} onBack={() => onState('gateway')} />;
    else if (state === 'workspace-select') right = <WorkspaceCard d={d} busyKey={busy} onChoose={(slug) => go(slug, 'ready')} onBack={() => onState('gateway')} />;
    else if (state === 'no-tenant') right = <NoTenantCard d={d} onInvite={() => onState('invitation')} onBack={() => onState('gateway')} />;
    else if (state === 'ready') right = <ReadyCard d={d} />;
    else right = <GatewayCard d={d} busy={busy === 'continue'} onContinue={() => go('continue', 'ready')}
      advOpen={advOpen} setAdvOpen={setAdvOpen}
      tokenBusy={busy === 'token'} tokenError={state === 'invalid-token' ? d.tokenError : null}
      onUseToken={() => go('token', 'ready')} onInvite={() => onState('invitation')} />;

    return (
      <div data-mood={mood} className="ds-app" style={{ height: '100%', display: 'flex', background: 'var(--app-bg)', position: 'relative', overflow: 'hidden' }}>
        <MoodControl mood={mood} moods={moods} onMood={onMood} />
        <BrandPanel d={d} />
        <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 48px', overflowY: 'auto', position: 'relative' }}>
          <div key={state} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>{right}</div>
          <div style={{ position: 'absolute', bottom: 18, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)' }}>
            <Icon name="server" size={12} />{d.env.label} · <span style={{ fontFamily: 'var(--font-mono)' }}>{d.env.apiBaseUrl}</span>
          </div>
        </div>
      </div>
    );
  }

  window.ACCESS = { AccessDesktop, BrandPanel, GatewayCard, CheckingCard, ErrorCard, InvitationCard, WorkspaceCard, NoTenantCard, ReadyCard, AdvancedToken, Spinner, Lozenge };
})();
