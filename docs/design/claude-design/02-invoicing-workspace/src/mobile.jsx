/* Invoicing workspace — mobile. A one-hand operator experience, not a shrunk
   desktop: compact status hero, readiness pills, metric pairs, a single-column
   invoice queue and a focused detail sheet, behind bottom tabs (Resumen ·
   Facturas · SRI · Más). window.MobileInv. */
(function () {
  const { useState } = React;
  const Icon = window.Icon;
  const { Btn, Pill, Banner, StateScreen } = window.UI;
  const { MobileTopBar, BottomTabs, Sheet } = window.Chrome;
  const { money, ELEC, getReadiness, matchFilter, FILTERS } = window.INV;
  const toneColor = (t) => t === 'success' ? 'var(--success)' : t === 'warning' ? 'var(--warning)' : t === 'danger' ? 'var(--danger)' : t === 'info' ? 'var(--info)' : 'var(--text-subtle)';

  function MCard({ children, style }) {
    return <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', ...style }}>{children}</div>;
  }
  function Dot({ tone }) { return <span style={{ width: 8, height: 8, borderRadius: 999, flex: 'none', background: toneColor(tone) }} />; }

  function HeroMobile({ d, state, readiness }) {
    const p = d.portfolio;
    let tone, icon, title, body, action;
    if (state === 'no-issuer') { tone = 'info'; icon = 'sparkles'; title = 'Configura tu emisor'; body = 'Cuatro pasos para emitir facturas electrónicas en Ecuador. Te guiamos.'; action = 'Configurar emisor'; }
    else if (state === 'readiness-blocked') { tone = 'danger'; icon = 'alert'; title = 'Emisión en pausa'; body = 'Tu firma electrónica caducó. Renuévala para volver a emitir.'; action = 'Renovar firma'; }
    else if (state === 'no-invoices') { tone = 'success'; icon = 'check'; title = 'Listo para tu primera factura'; body = 'Emisor, firma, gateway y numeración en orden.'; action = 'Nueva factura'; }
    else { tone = 'success'; icon = 'check'; title = 'Tu facturación está al día'; body = p.pendingAuthorization + ' por autorizar · ' + p.draftCount + ' borradores.'; action = 'Revisar ' + p.pendingAuthorization + ' por autorizar'; }
    return (
      <MCard style={{ padding: 16, display: 'grid', gap: 12 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ width: 38, height: 38, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: tone === 'success' ? 'var(--success-soft)' : tone === 'danger' ? 'var(--danger-soft)' : 'var(--info-soft)', color: toneColor(tone) }}><Icon name={icon} size={19} /></span>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)', lineHeight: 1.25 }}>{title}</h2>
            <p style={{ margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.5 }}>{body}</p>
          </div>
        </div>
        <Btn variant={tone === 'danger' ? 'primary' : 'primary'} size="sm" full leading={state === 'readiness-blocked' ? 'key' : state === 'no-issuer' ? 'arrowRight' : 'clock'}>{action}</Btn>
      </MCard>
    );
  }

  function ReadinessPills({ readiness }) {
    return (
      <MCard style={{ padding: 6 }}>
        {readiness.pillars.map((pl, i) => (
          <div key={pl.key} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px', borderBottom: i < 3 ? '1px solid var(--divider)' : 'none' }}>
            <span style={{ width: 30, height: 30, flex: 'none', borderRadius: 'var(--radius-xs)', display: 'grid', placeItems: 'center', background: 'var(--surface-sunken)', color: 'var(--text-muted)' }}><Icon name={pl.icon} size={15} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', fontWeight: 600 }}>{pl.label}</div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pl.value}</div>
            </div>
            <Dot tone={pl.tone} />
          </div>
        ))}
      </MCard>
    );
  }

  function MetricsMobile({ d }) {
    const p = d.portfolio;
    const items = [
      { label: 'Por autorizar', value: String(p.pendingAuthorization), tone: 'warning' },
      { label: 'Autorizadas', value: String(p.authorizedThisMonth), tone: 'success' },
      { label: 'Cartera', value: money(p.portfolioTotalInCents, p.currency), tone: 'neutral' },
      { label: 'Por cobrar', value: money(p.outstandingInCents, p.currency), tone: 'info' }
    ];
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {items.map((k) => (
          <MCard key={k.label} style={{ padding: 13, display: 'grid', gap: 4 }}>
            <span className="ds-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Dot tone={k.tone} />{k.label}</span>
            <strong className="ds-tnum" style={{ fontSize: 'var(--text-h2)', fontWeight: 700, color: 'var(--text-strong)', lineHeight: 1.05 }}>{k.value}</strong>
          </MCard>
        ))}
      </div>
    );
  }

  function InvoiceCard({ inv, onOpen }) {
    const meta = ELEC[inv.electronic];
    return (
      <button className="ds-focusable" onClick={() => onOpen(inv.id)} style={{ width: '100%', textAlign: 'left', cursor: 'pointer', display: 'grid', gap: 8, padding: 14, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>{inv.number}</span>
          <Pill tone={meta.tone} dot>{meta.label}</Pill>
        </div>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inv.customer}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>{inv.issuedAt} · {inv.items} ítems</span>
          <span className="ds-tnum" style={{ fontSize: 'var(--text-body)', fontWeight: 700, color: 'var(--text-strong)' }}>{money(inv.totalInCents, inv.currency)}</span>
        </div>
      </button>
    );
  }

  function Steps({ electronic }) {
    const meta = ELEC[electronic];
    const labels = ['Borrador', 'Generado', 'Enviado', 'Autorizado'];
    const rejected = electronic === 'rejected';
    return (
      <div style={{ display: 'flex', gap: 6 }}>
        {labels.map((l, i) => {
          const done = i < meta.step, current = i === meta.step, rej = rejected && i === 2;
          const c = rej ? 'var(--danger)' : done ? 'var(--success)' : current ? 'var(--primary)' : 'var(--border)';
          return <div key={l} style={{ flex: 1, display: 'grid', gap: 4, justifyItems: 'center' }}>
            <span style={{ width: '100%', height: 4, borderRadius: 2, background: c }} />
            <span style={{ fontSize: 9, fontWeight: 600, color: current || rej ? 'var(--text-strong)' : 'var(--text-muted)' }}>{rej ? 'Rechazado' : l}</span>
          </div>;
        })}
      </div>
    );
  }

  function DetailSheet({ d, inv, readiness, onClose }) {
    const meta = ELEC[inv.electronic];
    const blocked = !readiness.ready;
    let nextTitle, nextBody, primary, picon;
    if (inv.electronic === 'none') { nextTitle = 'Generar el documento'; nextBody = 'Construiremos el XML firmado. Aún no se envía al SRI.'; primary = 'Generar documento'; picon = 'fileText'; }
    else if (inv.electronic === 'generated') { nextTitle = 'Enviar al SRI'; nextBody = 'El XML está firmado y listo para enviarse.'; primary = 'Enviar al SRI'; picon = 'send'; }
    else if (inv.electronic === 'submitted') { nextTitle = 'El SRI está procesando'; nextBody = 'Aún no está autorizada. Consulta el estado para confirmar.'; primary = 'Consultar autorización'; picon = 'refresh'; }
    else if (inv.electronic === 'authorized') { nextTitle = 'Autorizada por el SRI'; nextBody = 'Comprobante válido. Alimenta a Accounting y Tax Compliance.'; primary = 'Enviar al cliente'; picon = 'mail'; }
    else { nextTitle = 'Devuelta por el SRI'; nextBody = inv.rejection.detail; primary = 'Corregir y regenerar'; picon = 'fileEdit'; }
    const tone = inv.electronic === 'rejected' ? 'danger' : inv.electronic === 'authorized' ? 'success' : 'info';
    return (
      <Sheet title={inv.number} onClose={onClose}>
        <div style={{ display: 'grid', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
            <div>
              <div style={{ fontSize: 'var(--text-body)', fontWeight: 600, color: 'var(--text-strong)' }}>{inv.customer}</div>
              <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>RUC {inv.customerRuc}</div>
            </div>
            <Pill tone={meta.tone} dot>{meta.label}</Pill>
          </div>
          <div className="ds-tnum" style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-strong)' }}>{money(inv.totalInCents, inv.currency)}</div>
          <div style={{ background: 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 12 }}><Steps electronic={inv.electronic} /></div>
          <div style={{ display: 'grid', gap: 2 }}>
            <Row k="Condición del documento" v={inv.electronic === 'none' ? 'Borrador (sistema)' : 'Emitido (sistema)'} />
            <Row k="Condición electrónica" v={meta.artifact} />
            {inv.accessKey && <Row k="Clave de acceso" v={inv.accessKey} mono />}
            {inv.electronic === 'authorized' && <Row k="Autorización" v={inv.authorizedAt} />}
          </div>
          {inv.electronic === 'rejected' && (
            <div style={{ background: 'var(--danger-soft)', borderRadius: 'var(--radius-sm)', padding: 12, display: 'grid', gap: 3 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', fontWeight: 700, color: 'var(--on-danger-soft)' }}>SRI · cód. {inv.rejection.code}</span>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)' }}>{inv.rejection.message}</span>
            </div>
          )}
          <div style={{ background: tone === 'danger' ? 'var(--danger-soft)' : tone === 'success' ? 'var(--success-soft)' : 'var(--info-soft)', borderLeft: '3px solid ' + toneColor(tone), borderRadius: 'var(--radius-sm)', padding: 12, display: 'grid', gap: 8 }}>
            <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--text-strong)' }}>{nextTitle}</strong>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text)', lineHeight: 1.5 }}>{nextBody}</span>
            <Btn variant="primary" size="sm" full leading={picon} disabled={blocked && (inv.electronic === 'none' || inv.electronic === 'generated')}>{primary}</Btn>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn variant="secondary" size="sm" full leading="eye">{inv.electronic === 'none' ? 'Previsualizar RIDE' : 'Ver RIDE'}</Btn>
            <Btn variant="secondary" size="sm" full leading="layers" disabled={inv.electronic === 'none'}>Ver XML</Btn>
          </div>
        </div>
      </Sheet>
    );
  }
  function Row({ k, v, mono }) {
    return <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--divider)' }}>
      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', flex: 'none' }}>{k}</span>
      <span style={{ fontSize: mono ? 'var(--text-2xs)' : 'var(--text-sm)', fontFamily: mono ? 'var(--font-mono)' : 'inherit', fontWeight: 600, color: 'var(--text-strong)', textAlign: 'right', wordBreak: mono ? 'break-all' : 'normal' }}>{v}</span>
    </div>;
  }

  function ReadinessTab({ d, readiness }) {
    const e = d.electronic, sig = readiness.signature;
    const cards = [
      { p: readiness.pillars[0], fields: [['Razón social', e.issuer.legalName], ['RUC', e.issuer.ruc, true], ['Ambiente', e.issuer.environment === 'production' ? 'Producción' : 'Pruebas']], action: 'Editar perfil' },
      { p: readiness.pillars[1], fields: [['Titular', sig.subject], ['Válido hasta', sig.validUntil, true], ['Inspección', sig.status === 'expired' ? 'Caducada' : 'Válida']], action: sig.status === 'valid' ? 'Reemplazar' : 'Renovar firma', danger: sig.status === 'expired' },
      { p: readiness.pillars[2], fields: [['Estado', e.submission.isActive ? 'Conectado' : 'Inactivo'], ['Ambiente', e.submission.environment === 'production' ? 'Producción' : 'Pruebas']], action: 'Probar conexión' },
      { p: readiness.pillars[3], fields: [['Estab. / Pto.', e.numbering.establishment + ' / ' + e.numbering.emissionPoint, true], ['Siguiente', e.numbering.nextNumber, true]], action: 'Ajustar numeración' }
    ];
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <div>
          <div className="ds-eyebrow">Ecuador · SRI</div>
          <h1 style={{ margin: '2px 0 0', fontSize: 'var(--text-h1)', fontWeight: 700, color: 'var(--text-strong)' }}>Configuración electrónica</h1>
        </div>
        {readiness.blockers.map((b, i) => <Banner key={i} tone={b.title.includes('firma') ? 'danger' : 'warning'} icon="alert" title={b.title}>{b.body}</Banner>)}
        {cards.map((c, i) => (
          <MCard key={i} style={{ padding: 14, display: 'grid', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 30, height: 30, flex: 'none', borderRadius: 'var(--radius-xs)', display: 'grid', placeItems: 'center', background: c.danger ? 'var(--danger-soft)' : 'var(--primary-soft)', color: c.danger ? 'var(--danger)' : 'var(--primary)' }}><Icon name={c.p.icon} size={15} /></span>
              <strong style={{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)' }}>{c.p.label}</strong>
              <Dot tone={c.p.tone} />
            </div>
            {c.fields.map(([k, v, mono]) => <Row key={k} k={k} v={v} mono={mono} />)}
            <Btn variant={c.danger ? 'primary' : 'secondary'} size="sm" full leading={c.danger ? 'key' : undefined}>{c.action}</Btn>
          </MCard>
        ))}
      </div>
    );
  }

  function MobileWorkspace({ d, state, mood, onMood }) {
    const [tab, setTab] = useState(state === 'readiness-blocked' || state === 'no-issuer' ? 'readiness' : 'overview');
    const [sheet, setSheet] = useState(null);
    const [openInv, setOpenInv] = useState(null);
    const [filter, setFilter] = useState('all');
    const readiness = getReadiness(d, state);

    if (state === 'loading') {
      return <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--app-bg)' }}>
        <div style={{ padding: 14, display: 'grid', gap: 12 }}>{[0, 1, 2, 3].map((i) => <div key={i} style={{ height: i === 0 ? 96 : 60, borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)', border: '1px solid var(--border)', opacity: 1 - i * 0.14 }} />)}</div>
      </div>;
    }

    let body;
    if (state === 'backend-unavailable') {
      body = <StateScreen icon="server" tone="danger" title={d.backendError.title} meta={'correlationId ' + d.backendError.correlationId} actions={<Btn variant="primary" size="sm" leading="refresh">Reintentar</Btn>}>{d.backendError.message}</StateScreen>;
    } else if (tab === 'readiness') {
      body = <div style={{ padding: 14 }}><ReadinessTab d={d} readiness={readiness} /></div>;
    } else if (tab === 'queue') {
      const rows = d.invoices.filter((i) => matchFilter(i, filter));
      body = <div style={{ padding: 14, display: 'grid', gap: 12 }}>
        <div>
          <div className="ds-eyebrow">Operaciones</div>
          <h1 style={{ margin: '2px 0 0', fontSize: 'var(--text-h1)', fontWeight: 700, color: 'var(--text-strong)' }}>Facturas</h1>
        </div>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
          {FILTERS.map((f) => {
            const on = f.key === filter;
            return <button key={f.key} className="ds-focusable" onClick={() => setFilter(f.key)} style={{ flex: 'none', padding: '7px 13px', borderRadius: 'var(--radius-pill)', border: '1px solid ' + (on ? 'transparent' : 'var(--border)'), background: on ? 'var(--primary-soft)' : 'var(--surface)', color: on ? 'var(--on-primary-soft)' : 'var(--text-muted)', fontSize: 'var(--text-sm)', fontWeight: 600, cursor: 'pointer' }}>{f.label}</button>;
          })}
        </div>
        {rows.map((inv) => <InvoiceCard key={inv.id} inv={inv} onOpen={setOpenInv} />)}
        {rows.length === 0 && <div style={{ padding: 30, textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>No hay facturas en este filtro.</div>}
      </div>;
    } else {
      // overview
      body = <div style={{ padding: 14, display: 'grid', gap: 14 }}>
        {state === 'permission-limited' && <Banner tone="info" icon="eye" title="Solo lectura">Necesitas invoicing.manage para emitir.</Banner>}
        <HeroMobile d={d} state={state} readiness={readiness} />
        {state !== 'no-issuer' && <MetricsMobile d={d} />}
        <div>
          <div className="ds-eyebrow" style={{ marginBottom: 8 }}>Estado del SRI</div>
          <ReadinessPills readiness={readiness} />
        </div>
        {state !== 'no-issuer' && state !== 'no-invoices' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div className="ds-eyebrow">Por autorizar</div>
              <button className="ds-focusable" onClick={() => setTab('queue')} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: 'var(--text-sm)', cursor: 'pointer' }}>Ver todas</button>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              {d.invoices.filter((i) => i.electronic === 'submitted' || i.electronic === 'generated').slice(0, 3).map((inv) => <InvoiceCard key={inv.id} inv={inv} onOpen={setOpenInv} />)}
            </div>
          </div>
        )}
      </div>;
    }

    const inv = openInv && d.invoices.find((i) => i.id === openInv);
    const showChrome = state !== 'loading';
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--app-bg)', position: 'relative', overflow: 'hidden' }}>
        {showChrome && <MobileTopBar tenant={d.tenant} onTenant={() => setSheet('tenant')} onMood={() => setSheet('mood')} onAssistant={() => setSheet('assistant')} />}
        <div style={{ flex: 1, overflowY: 'auto' }}>{body}</div>
        {showChrome && <BottomTabs active={tab} onTab={(k) => { if (k === 'more') setSheet('nav'); else setTab(k); }} />}

        {inv && <DetailSheet d={d} inv={inv} readiness={readiness} onClose={() => setOpenInv(null)} />}

        {sheet === 'nav' && <Sheet title="Productos" onClose={() => setSheet(null)}>
          <div style={{ display: 'grid', gap: 4 }}>
            {d.products.map((p) => {
              const muted = p.state === 'disabled' || p.state === 'locked';
              return <div key={p.key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8px', borderRadius: 'var(--radius-xs)', opacity: muted ? 0.55 : 1, background: p.key === 'invoicing' ? 'var(--primary-soft)' : 'transparent' }}>
                <span style={{ color: muted ? 'var(--text-subtle)' : p.key === 'invoicing' ? 'var(--primary)' : 'var(--text)', display: 'inline-flex' }}><Icon name={p.icon} size={19} /></span>
                <span style={{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: 500, color: muted ? 'var(--text-subtle)' : 'var(--text-strong)' }}>{p.name}</span>
                {p.state === 'locked' && <Icon name="lock" size={14} style={{ color: 'var(--text-subtle)' }} />}
                {p.state === 'limited' && <Pill tone="warning">Limited</Pill>}
                {p.badge && <Pill tone="neutral">{p.badge}</Pill>}
              </div>;
            })}
          </div>
        </Sheet>}

        {sheet === 'tenant' && <Sheet title="Cambiar empresa" onClose={() => setSheet(null)}>
          <div style={{ display: 'grid', gap: 8 }}>
            {d.memberships.map((m) => <div key={m.slug} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, borderRadius: 'var(--radius-sm)', border: '1px solid ' + (m.slug === d.tenant.slug ? 'var(--primary)' : 'var(--border)'), background: m.slug === d.tenant.slug ? 'var(--primary-soft)' : 'var(--surface)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)' }}>{m.name}</div>
                <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>{m.role}</div>
              </div>
              {m.slug === d.tenant.slug && <Icon name="check" size={16} style={{ color: 'var(--primary)' }} />}
            </div>)}
          </div>
        </Sheet>}

        {sheet === 'mood' && <Sheet title="Design mood" onClose={() => setSheet(null)}>
          <window.UI.MoodMenu value={mood} onChange={onMood} moods={d.moods} />
        </Sheet>}

        {sheet === 'assistant' && <Sheet title="Asistente IA" onClose={() => setSheet(null)}>
          <div style={{ display: 'grid', gap: 12 }}>
            <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text)', lineHeight: 1.5 }}>{d.assistant.greeting}</p>
            {d.assistant.suggestions.map((s, i) => <div key={i} style={{ background: 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 13, display: 'grid', gap: 8 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ width: 28, height: 28, flex: 'none', borderRadius: 'var(--radius-xs)', display: 'grid', placeItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', color: toneColor(s.tone) }}><Icon name={s.icon} size={15} /></span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)', lineHeight: 1.35 }}>{s.title}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.45 }}>{s.body}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}><Btn variant="secondary" size="sm">{s.action}</Btn><Btn variant="ghost" size="sm">Descartar</Btn></div>
            </div>)}
            <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', lineHeight: 1.45 }}>{d.assistant.disclaimer}</div>
          </div>
        </Sheet>}
      </div>
    );
  }

  window.MobileInv = { MobileWorkspace };
})();
