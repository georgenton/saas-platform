/* Slice 04 — Access / Login Gateway, mobile. One focused access card per state,
   short copy, one-thumb ergonomics. Advanced token bootstrap and mood live in
   bottom sheets — never the first thing seen. window.MobileAccess. */
(function () {
  const { useState, useRef, useEffect } = React;
  const Icon = window.Icon;
  const { Btn, Pill, Banner, MoodMenu, Avatar } = window.UI;
  const { Spinner, Lozenge } = window.ACCESS;

  function Sheet({ title, children, onClose }) {
    return (
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 40, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,12,18,0.46)' }} />
        <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative', background: 'var(--surface-raised)', borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: 16, maxHeight: '84%', overflowY: 'auto', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: 'var(--border-strong)', margin: '0 auto 12px' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' }}>{title}</h3>
            <button className="ds-focusable" onClick={onClose} aria-label="Cerrar" style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'inline-flex', padding: 4 }}><Icon name="x" size={18} /></button>
          </div>
          {children}
        </div>
      </div>
    );
  }

  function MCard({ children, style }) {
    return <div className="acc-rise" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg, 16px)', boxShadow: 'var(--shadow-md)', padding: 20, ...style }}>{children}</div>;
  }
  function Head({ icon, tone, eyebrow, title, body }) {
    return (
      <div style={{ display: 'grid', gap: 12, marginBottom: 18 }}>
        <Lozenge icon={icon} tone={tone} size={46} />
        <div style={{ display: 'grid', gap: 6 }}>
          {eyebrow && <span className="ds-eyebrow">{eyebrow}</span>}
          <h1 style={{ margin: 0, fontSize: 'var(--text-h2)', fontWeight: 700, letterSpacing: 'var(--track-snug)', color: 'var(--text-strong)', lineHeight: 1.22 }}>{title}</h1>
          {body && <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.5, textWrap: 'pretty' }}>{body}</p>}
        </div>
      </div>
    );
  }

  function MobileAccess({ d, state, onState, mood, moods, onMood }) {
    const [busy, setBusy] = useState(null);
    const [sheet, setSheet] = useState(null);
    const timer = useRef(null);
    useEffect(() => () => clearTimeout(timer.current), []);
    useEffect(() => { if (state === 'invalid-token') setSheet('token'); }, [state]);
    function go(key, target, ms = 1050) { setBusy(key); clearTimeout(timer.current); timer.current = setTimeout(() => { setBusy(null); setSheet(null); onState(target); }, ms); }

    let body;
    if (state === 'checking') {
      body = <MCard style={{ textAlign: 'center', display: 'grid', justifyItems: 'center', gap: 14, padding: '38px 20px' }}>
        <Spinner size={28} />
        <div style={{ display: 'grid', gap: 5 }}>
          <h1 style={{ margin: 0, fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' }}>Verificando tu sesión…</h1>
          <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.5 }}>Confirmamos tu acceso y preparamos tu espacio.</p>
        </div>
      </MCard>;
    } else if (state === 'backend-unavailable') {
      body = <MCard>
        <Head icon="server" tone="danger" eyebrow="Sin conexión" title={d.backendError.title} body={d.backendError.message} />
        <Btn variant="primary" full leading="refresh" onClick={() => go('retry', 'ready')} disabled={busy === 'retry'}>{busy === 'retry' ? 'Reintentando…' : 'Reintentar'}</Btn>
        <div style={{ marginTop: 12, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', textAlign: 'center' }}>correlationId {d.backendError.correlationId}</div>
      </MCard>;
    } else if (state === 'invitation') {
      const i = d.invitation;
      body = <MCard>
        <Head icon="mail" tone="info" eyebrow="Invitación pendiente" title={'Te invitaron a ' + i.tenantName} body={i.invitedByName + ' te invitó como ' + i.role + '.'} />
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: 16 }}>
          {[['Empresa', i.tenantName, false], ['RUC', i.tenantRuc, true], ['Tu rol', i.role, false], ['Vence', i.expiresInLabel, false]].map(([k, v, mono], idx, arr) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '9px 12px', borderBottom: idx < arr.length - 1 ? '1px solid var(--divider)' : 'none' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{k}</span>
              <span style={{ fontSize: mono ? 'var(--text-xs)' : 'var(--text-sm)', fontFamily: mono ? 'var(--font-mono)' : 'inherit', fontWeight: 600, color: 'var(--text-strong)' }}>{v}</span>
            </div>
          ))}
        </div>
        <Btn variant="primary" full leading={busy === 'accept' ? undefined : 'check'} disabled={busy === 'accept'} onClick={() => go('accept', 'ready')} style={{ marginBottom: 9 }}>{busy === 'accept' ? 'Aceptando…' : 'Aceptar invitación'}</Btn>
        <Btn variant="ghost" full onClick={() => onState('gateway')}>Ahora no</Btn>
      </MCard>;
    } else if (state === 'workspace-select') {
      body = <MCard>
        <Head icon="building" tone="primary" eyebrow="Elige tu espacio" title="¿Dónde trabajas hoy?" body="Tu cuenta tiene acceso a varias empresas." />
        <div style={{ display: 'grid', gap: 9 }}>
          {d.tenancies.map((t) => (
            <button key={t.slug} className="ds-focusable" onClick={() => go(t.slug, 'ready')} disabled={!!busy} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: 12, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
              <Avatar name={t.name} size={36} />
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</span>
                <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>RUC {t.ruc}</span>
              </span>
              {busy === t.slug ? <Spinner size={16} /> : <Pill tone="primary">{t.role}</Pill>}
            </button>
          ))}
        </div>
      </MCard>;
    } else if (state === 'no-tenant') {
      const n = d.noTenant;
      body = <MCard>
        <Head icon="building" tone="warning" eyebrow="Sin espacio" title="Aún no perteneces a un espacio de trabajo" body={n.body} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)', border: '1px solid var(--border)', marginBottom: 16 }}>
          <Icon name="mail" size={15} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)', color: 'var(--text-strong)' }}>{n.email}</span>
        </div>
        <Btn variant="primary" full leading="mail" onClick={() => onState('invitation')} style={{ marginBottom: 9 }}>Tengo una invitación</Btn>
        <Btn variant="ghost" full onClick={() => onState('gateway')}>Cerrar sesión</Btn>
      </MCard>;
    } else if (state === 'ready') {
      const t = d.session.currentTenancy;
      body = <MCard style={{ textAlign: 'center', display: 'grid', justifyItems: 'center', gap: 4 }}>
        <Lozenge icon="check" tone="success" size={50} />
        <h1 style={{ margin: '10px 0 0', fontSize: 'var(--text-h2)', fontWeight: 700, color: 'var(--text-strong)' }}>Todo listo, {d.session.user.name.split(' ')[0]}</h1>
        <p style={{ margin: '5px 0 14px', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.5 }}>Entrarás a <strong style={{ color: 'var(--text)' }}>{t.name}</strong> como {t.role}.</p>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)', border: '1px solid var(--border)', marginBottom: 14 }}>
          <span style={{ color: 'var(--primary)', display: 'inline-flex' }}><Icon name="building" size={16} /></span>
          <span style={{ flex: 1, textAlign: 'left' }}>
            <span style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)' }}>{t.name}</span>
            <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>RUC {t.ruc}</span>
          </span>
          <Pill tone="success" dot>Activa</Pill>
        </div>
        <Btn variant="primary" full trailing="arrowRight">Entrar al Command Center</Btn>
      </MCard>;
    } else {
      // gateway
      body = <MCard>
        <Head icon="logIn" tone="primary" eyebrow={'Acceso · ' + d.product.name} title="Entra a tu espacio de trabajo" body="Verificamos tu sesión y te llevamos al lugar correcto." />
        <Btn variant="primary" size="lg" full leading={busy === 'continue' ? undefined : 'arrowRight'} disabled={busy === 'continue'} onClick={() => go('continue', 'ready')} style={{ marginBottom: 14 }}>
          {busy === 'continue' ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}><Spinner size={16} />Verificando…</span> : 'Continuar'}
        </Btn>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0 12px' }}>
          <span style={{ flex: 1, height: 1, background: 'var(--divider)' }} />
          <span style={{ fontSize: 9, color: 'var(--text-subtle)', fontWeight: 700, letterSpacing: '0.06em' }}>PRÓXIMAMENTE</span>
          <span style={{ flex: 1, height: 1, background: 'var(--divider)' }} />
        </div>
        <div style={{ display: 'grid', gap: 7, marginBottom: 16 }}>
          {d.futureMethods.map((m) => (
            <div key={m.key} aria-disabled="true" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border)', background: 'var(--surface-sunken)', opacity: 0.72 }}>
              <span style={{ color: 'var(--text-subtle)', display: 'inline-flex' }}><Icon name={m.icon} size={16} /></span>
              <span style={{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-muted)' }}>{m.label}</span>
              <Pill tone="neutral">Pronto</Pill>
            </div>
          ))}
        </div>
        <button className="ds-focusable" onClick={() => setSheet('token')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', textAlign: 'left', marginBottom: 14 }}>
          <span style={{ width: 28, height: 28, flex: 'none', borderRadius: 'var(--radius-xs)', display: 'grid', placeItems: 'center', background: 'var(--surface-sunken)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}><Icon name="terminal" size={15} /></span>
          <span style={{ flex: 1 }}>
            <span style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)' }}>Acceso avanzado</span>
            <span style={{ display: 'block', fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>Ya tengo un token · modo técnico</span>
          </span>
          <Icon name="chevronRight" size={16} style={{ color: 'var(--text-subtle)' }} />
        </button>
        <button className="ds-focusable" onClick={() => onState('invitation')} style={{ display: 'block', margin: '0 auto', background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', fontSize: 'var(--text-sm)' }}>Revisar invitación</button>
      </MCard>;
    }

    return (
      <div data-mood={mood} className="ds-app" style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--app-bg)', position: 'relative', overflow: 'hidden' }}>
        {/* compact brand bar */}
        <div style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px' }}>
          <span style={{ width: 30, height: 30, borderRadius: 'var(--radius-sm)', background: 'var(--primary)', color: 'var(--primary-contrast)', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 16, letterSpacing: '-0.04em', flex: 'none' }}>S</span>
          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-strong)' }}>SaaS<span style={{ fontWeight: 700 }}>Platform</span></span>
          <div style={{ flex: 1 }} />
          <button className="ds-focusable" aria-label="Apariencia" onClick={() => setSheet('mood')} style={{ width: 34, height: 34, display: 'grid', placeItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--text)' }}><Icon name="sliders" size={16} /></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div key={state}>{body}</div>
        </div>

        <div style={{ flex: 'none', padding: '0 16px 12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, fontSize: 9, color: 'var(--text-subtle)' }}>
          <Icon name="server" size={11} />{d.env.label}
        </div>

        {sheet === 'token' && (
          <Sheet title="Acceso avanzado" onClose={() => setSheet(null)}>
            <div style={{ display: 'grid', gap: 10 }}>
              <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.5 }}>Modo técnico para QA y pilotos controlados. Pega un Bearer token vigente para iniciar sesión.</p>
              {state === 'invalid-token' && <Banner tone="danger" icon="alert" title={d.tokenError.title}>{d.tokenError.message}</Banner>}
              <textarea defaultValue={state === 'invalid-token' ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.caducado…' : ''} placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…" spellCheck={false} style={{ width: '100%', boxSizing: 'border-box', height: 84, padding: 10, borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-strong)', background: 'var(--surface)', color: 'var(--text-strong)', fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: 1.5, resize: 'vertical' }} />
              <Btn variant="primary" full leading={busy === 'token' ? undefined : 'logIn'} disabled={busy === 'token'} onClick={() => go('token', 'ready')}>{busy === 'token' ? 'Verificando…' : 'Usar token'}</Btn>
              <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', textAlign: 'center', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}><Icon name="shield" size={12} />El token se guarda sólo en este dispositivo</span>
            </div>
          </Sheet>
        )}
        {sheet === 'mood' && <Sheet title="Apariencia" onClose={() => setSheet(null)}><MoodMenu value={mood} onChange={onMood} moods={moods} /></Sheet>}
      </div>
    );
  }

  window.MobileAccess = { MobileAccess };
})();
