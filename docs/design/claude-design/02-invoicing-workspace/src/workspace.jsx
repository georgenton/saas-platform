/* Invoicing workspace — desktop. The operational <main> that mounts inside the
   Platform Shell chrome. Calm, guided, progressive-disclosure layout:
   status hero (start-here) → portfolio metrics → invoice queue + focused detail
   panel → optional Ecuador electronic-readiness configuration.
   window.INV  (exposes helpers + DesktopWorkspace). */
(function () {
  const { useState } = React;
  const Icon = window.Icon;
  const { Btn, Pill, Banner } = window.UI;

  /* ----------------------------------------------------------- helpers */
  function money(cents, currency) {
    const v = (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return (currency === 'USD' ? '$' : '') + v;
  }

  // Electronic condition → presentation. Carefully distinguishes artifact stages.
  const ELEC = {
    none:       { label: 'Borrador',   tone: 'neutral', icon: 'fileEdit',  step: 0, artifact: 'Artefacto de previsualización' },
    generated:  { label: 'Generado',   tone: 'info',    icon: 'fileText',  step: 1, artifact: 'Artefacto generado · XML firmado' },
    submitted:  { label: 'En el SRI',  tone: 'warning', icon: 'clock',     step: 2, artifact: 'Artefacto enviado · esperando autorización' },
    authorized: { label: 'Autorizada', tone: 'success', icon: 'fileCheck', step: 3, artifact: 'Artefacto autorizado por el SRI' },
    rejected:   { label: 'Rechazada',  tone: 'danger',  icon: 'fileX',     step: 2, artifact: 'Devuelta por el SRI con observaciones' }
  };
  const STEPS = [
    { key: 'draft', label: 'Borrador' },
    { key: 'generated', label: 'Generado' },
    { key: 'submitted', label: 'Enviado' },
    { key: 'authorized', label: 'Autorizado' }
  ];

  // Derived readiness. ready/blockers are computed — never assumed.
  function getReadiness(d, state) {
    const e = d.electronic;
    const sig = state === 'readiness-blocked'
      ? { status: 'expired', validUntil: '2026-05-30', daysToExpiry: -17, subject: e.signature.subject, issuer: e.signature.issuer }
      : e.signature;
    const hasIssuer = state !== 'no-issuer';
    const pillars = [
      {
        key: 'issuer', label: 'Emisor', icon: 'building',
        value: hasIssuer ? e.issuer.legalName : 'Sin configurar',
        sub: hasIssuer ? (e.issuer.environment === 'production' ? 'Producción · RUC ' + e.issuer.ruc : 'Pruebas · RUC ' + e.issuer.ruc) : 'Requerido para emitir',
        tone: hasIssuer ? 'success' : 'warning'
      },
      {
        key: 'signature', label: 'Firma electrónica', icon: 'key',
        value: !hasIssuer ? 'Pendiente' : sig.status === 'valid' ? 'Vigente' : sig.status === 'expiring' ? 'Por caducar' : 'Caducada',
        sub: !hasIssuer ? 'Sube tu certificado .p12' : sig.status === 'expired' ? 'Venció el ' + sig.validUntil : 'Vigente hasta ' + sig.validUntil,
        tone: !hasIssuer ? 'neutral' : sig.status === 'valid' ? 'success' : sig.status === 'expiring' ? 'warning' : 'danger'
      },
      {
        key: 'gateway', label: 'Gateway SRI', icon: 'server',
        value: !hasIssuer ? 'Pendiente' : e.submission.gatewayConfigured && e.submission.isActive ? 'Conectado' : e.submission.gatewayConfigured ? 'Inactivo' : 'Sin configurar',
        sub: !hasIssuer ? 'Conecta el envío al SRI' : 'Ambiente de ' + (e.submission.environment === 'production' ? 'producción' : 'pruebas') + ' · ' + e.submission.lastCheckedAt,
        tone: !hasIssuer ? 'neutral' : e.submission.gatewayConfigured && e.submission.isActive ? 'success' : 'warning'
      },
      {
        key: 'numbering', label: 'Numeración', icon: 'hash',
        value: !hasIssuer ? 'Pendiente' : e.numbering.nextNumber,
        sub: !hasIssuer ? 'Define establecimiento y punto de emisión' : 'Estab. ' + e.numbering.establishment + ' · Pto. ' + e.numbering.emissionPoint,
        tone: !hasIssuer ? 'neutral' : 'success'
      }
    ];
    const blockers = [];
    if (!hasIssuer) blockers.push({ title: 'Configura el perfil del emisor', body: 'Necesitamos tu RUC, razón social y ambiente del SRI antes de emitir cualquier documento.' });
    if (state === 'readiness-blocked') blockers.push({ title: 'Tu firma electrónica caducó', body: 'El certificado venció el 30 may 2026. No podemos firmar ni enviar documentos al SRI hasta que lo renueves.' });
    return { ready: blockers.length === 0, blockers, pillars, signature: sig };
  }

  const toneColor = (t) => t === 'success' ? 'var(--success)' : t === 'warning' ? 'var(--warning)' : t === 'danger' ? 'var(--danger)' : t === 'info' ? 'var(--info)' : 'var(--text-subtle)';

  /* ------------------------------------------------------- small atoms */
  function Dot({ tone }) {
    return <span style={{ width: 8, height: 8, borderRadius: 999, flex: 'none', background: toneColor(tone) }} />;
  }

  function Card({ children, style, pad = true }) {
    return <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: pad ? 'var(--card-pad)' : 0, ...style }}>{children}</div>;
  }

  /* --------------------------------------------------- status hero */
  function StatusHero({ d, state, readiness, onConfig, onReviewPending, onSelectRejected }) {
    const p = d.portfolio;
    let tone, icon, title, body, action;
    if (state === 'no-issuer') {
      tone = 'info'; icon = 'sparkles';
      title = 'Empecemos: configura tu emisor electrónico';
      body = 'Para emitir facturas electrónicas en Ecuador, primero registramos tu emisor ante el SRI. Son cuatro pasos y te guiamos en cada uno.';
      action = <Btn variant="primary" leading="arrowRight" onClick={onConfig}>Configurar emisor</Btn>;
    } else if (state === 'readiness-blocked') {
      tone = 'danger'; icon = 'alert';
      title = 'Emisión en pausa: tu firma electrónica caducó';
      body = 'Tus borradores siguen seguros. Renueva el certificado de firma para volver a generar y enviar documentos al SRI.';
      action = <Btn variant="primary" leading="key" onClick={onConfig}>Renovar firma</Btn>;
    } else if (state === 'no-invoices') {
      tone = 'success'; icon = 'check';
      title = 'Todo listo para emitir tu primera factura';
      body = 'Tu emisor, firma, gateway y numeración están en orden. Crea una factura y te acompañamos hasta la autorización del SRI.';
      action = <Btn variant="primary" leading="plus">Nueva factura</Btn>;
    } else if (state === 'permission-limited') {
      tone = 'info'; icon = 'eye';
      title = 'Estás viendo Invoicing en modo solo lectura';
      body = 'Puedes revisar facturas y el estado del SRI, pero necesitas el permiso invoicing.manage para generar o enviar documentos.';
      action = <Btn variant="secondary" leading="user">Solicitar permiso</Btn>;
    } else {
      tone = 'success'; icon = 'check';
      title = 'Tu facturación está al día';
      body = 'Tienes ' + p.pendingAuthorization + ' facturas esperando autorización del SRI y ' + p.draftCount + ' borradores. El resto del mes está autorizado.';
      action = <Btn variant="primary" leading="clock" onClick={onReviewPending}>Revisar {p.pendingAuthorization} por autorizar</Btn>;
    }
    return (
      <Card style={{ display: 'grid', gap: 0, padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: 'var(--card-pad)' }}>
          <span style={{ width: 46, height: 46, flex: 'none', borderRadius: 'var(--radius-md)', display: 'grid', placeItems: 'center', background: tone === 'success' ? 'var(--success-soft)' : tone === 'danger' ? 'var(--danger-soft)' : 'var(--info-soft)', color: toneColor(tone) }}>
            <Icon name={icon} size={23} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="ds-eyebrow" style={{ marginBottom: 3 }}>Operaciones · {d.portfolio.period}</div>
            <h2 style={{ margin: 0, fontSize: 'var(--text-h2)', fontWeight: 700, letterSpacing: 'var(--track-snug)', color: 'var(--text-strong)', lineHeight: 1.2 }}>{title}</h2>
            <p style={{ margin: '6px 0 0', fontSize: 'var(--text-body)', color: 'var(--text-muted)', lineHeight: 'var(--leading-body)', maxWidth: 620, textWrap: 'pretty' }}>{body}</p>
          </div>
          <div style={{ flex: 'none', alignSelf: 'center' }}>{action}</div>
        </div>
        {/* readiness pill row — the calm "what's ready / what's blocked" glance */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '12px var(--card-pad)', borderTop: '1px solid var(--divider)', background: 'var(--surface-sunken)', flexWrap: 'wrap' }}>
          {readiness.pillars.map((pl) => (
            <div key={pl.key} style={{ display: 'flex', alignItems: 'center', gap: 9, flex: 'none' }}>
              <Dot tone={pl.tone} />
              <span style={{ display: 'grid' }}>
                <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>{pl.label}</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-strong)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 168 }}>{pl.value}</span>
              </span>
            </div>
          ))}
          <button className="ds-focusable" onClick={onConfig} style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5, background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: 'var(--text-sm)', cursor: 'pointer', padding: '4px 2px' }}>
            Configuración SRI <Icon name="chevronRight" size={14} />
          </button>
        </div>
      </Card>
    );
  }

  /* --------------------------------------------------- metrics row */
  function Metrics({ d }) {
    const p = d.portfolio;
    const items = [
      { label: 'Por autorizar', value: String(p.pendingAuthorization), hint: 'en el SRI', tone: 'warning' },
      { label: 'Autorizadas', value: String(p.authorizedThisMonth), hint: p.period, tone: 'success' },
      { label: 'Cartera del mes', value: money(p.portfolioTotalInCents, p.currency), hint: 'facturado', tone: 'neutral' },
      { label: 'Por cobrar', value: money(p.outstandingInCents, p.currency), hint: 'pendiente de pago', tone: 'info' }
    ];
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {items.map((k) => (
          <Card key={k.label} style={{ display: 'grid', gap: 6 }}>
            <span className="ds-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><Dot tone={k.tone} />{k.label}</span>
            <strong className="ds-tnum" style={{ fontSize: 'var(--text-h1)', fontWeight: 700, letterSpacing: 'var(--track-snug)', color: 'var(--text-strong)', lineHeight: 1.05 }}>{k.value}</strong>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{k.hint}</span>
          </Card>
        ))}
      </div>
    );
  }

  /* --------------------------------------------------- invoice queue */
  const FILTERS = [
    { key: 'all', label: 'Todas' },
    { key: 'draft', label: 'Borradores' },
    { key: 'pending', label: 'Por autorizar' },
    { key: 'authorized', label: 'Autorizadas' },
    { key: 'rejected', label: 'Rechazadas' }
  ];
  function matchFilter(inv, f) {
    if (f === 'all') return true;
    if (f === 'draft') return inv.electronic === 'none';
    if (f === 'pending') return inv.electronic === 'generated' || inv.electronic === 'submitted';
    if (f === 'authorized') return inv.electronic === 'authorized';
    if (f === 'rejected') return inv.electronic === 'rejected';
    return true;
  }

  function Queue({ d, selectedId, onSelect, filter, onFilter, readOnly }) {
    const rows = d.invoices.filter((i) => matchFilter(i, filter));
    return (
      <Card pad={false} style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 18px 12px', borderBottom: '1px solid var(--divider)' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 'var(--text-h3)', fontWeight: 600, color: 'var(--text-strong)' }}>Facturas</h3>
            <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>Selecciona una para revisarla a la derecha</span>
          </div>
          {!readOnly && <Btn variant="primary" size="sm" leading="plus">Nueva</Btn>}
        </div>
        {/* segmented filter — light scanning, not a 12-column table */}
        <div style={{ display: 'flex', gap: 4, padding: '10px 14px', borderBottom: '1px solid var(--divider)', flexWrap: 'wrap' }}>
          {FILTERS.map((f) => {
            const on = f.key === filter;
            const count = d.invoices.filter((i) => matchFilter(i, f.key)).length;
            return (
              <button key={f.key} className="ds-focusable" onClick={() => onFilter(f.key)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 11px', borderRadius: 'var(--radius-pill)', border: '1px solid ' + (on ? 'transparent' : 'var(--border)'), background: on ? 'var(--primary-soft)' : 'transparent', color: on ? 'var(--on-primary-soft)' : 'var(--text-muted)', fontSize: 'var(--text-sm)', fontWeight: 600, cursor: 'pointer', transition: 'var(--transition-base)' }}>
                {f.label}<span style={{ fontSize: 'var(--text-2xs)', opacity: 0.8 }}>{count}</span>
              </button>
            );
          })}
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* column header */}
          <div style={{ display: 'grid', gridTemplateColumns: '148px 1fr 110px 132px', gap: 12, padding: '8px 18px', borderBottom: '1px solid var(--divider)' }}>
            {['Número', 'Cliente', 'Total', 'Estado'].map((h, i) => (
              <span key={h} className="ds-eyebrow" style={{ textAlign: i === 2 ? 'right' : 'left' }}>{h}</span>
            ))}
          </div>
          {rows.map((inv) => {
            const meta = ELEC[inv.electronic];
            const on = inv.id === selectedId;
            return (
              <button key={inv.id} className="ds-focusable" onClick={() => onSelect(inv.id)}
                style={{ width: '100%', display: 'grid', gridTemplateColumns: '148px 1fr 110px 132px', gap: 12, alignItems: 'center', padding: '13px 18px', textAlign: 'left', cursor: 'pointer', border: 'none', borderBottom: '1px solid var(--divider)', borderLeft: '3px solid ' + (on ? 'var(--primary)' : 'transparent'), background: on ? 'var(--primary-soft)' : 'transparent', transition: 'var(--transition-base)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-strong)', fontWeight: 500 }}>{inv.number}</span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inv.customer}</span>
                  <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>{inv.issuedAt} · {inv.items} ítems</span>
                </span>
                <span className="ds-tnum" style={{ textAlign: 'right', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)' }}>{money(inv.totalInCents, inv.currency)}</span>
                <span style={{ justifySelf: 'start' }}><Pill tone={meta.tone} dot>{meta.label}</Pill></span>
              </button>
            );
          })}
          {rows.length === 0 && (
            <div style={{ padding: '36px 18px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>No hay facturas en este filtro.</div>
          )}
        </div>
      </Card>
    );
  }

  /* ------------------------------------------------ lifecycle stepper */
  function Stepper({ electronic }) {
    const meta = ELEC[electronic];
    const rejected = electronic === 'rejected';
    return (
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        {STEPS.map((s, i) => {
          const done = i < meta.step;
          const current = i === meta.step;
          const isRejectNode = rejected && i === 2;
          const c = isRejectNode ? 'var(--danger)' : done ? 'var(--success)' : current ? 'var(--primary)' : 'var(--border-strong)';
          const fill = (done || (current && !rejected)) ? c : 'var(--surface)';
          return (
            <React.Fragment key={s.key}>
              <div style={{ display: 'grid', justifyItems: 'center', gap: 6, width: 62, flex: 'none' }}>
                <span style={{ width: 26, height: 26, borderRadius: 999, display: 'grid', placeItems: 'center', border: '2px solid ' + c, background: done || isRejectNode || (current && !rejected) ? c : 'var(--surface)', color: done || isRejectNode || (current && !rejected) ? '#fff' : c }}>
                  {done ? <Icon name="check" size={14} /> : isRejectNode ? <Icon name="x" size={14} /> : <span style={{ width: 7, height: 7, borderRadius: 999, background: current ? '#fff' : c }} />}
                </span>
                <span style={{ fontSize: 'var(--text-2xs)', fontWeight: 600, textAlign: 'center', color: current || isRejectNode ? 'var(--text-strong)' : 'var(--text-muted)' }}>{isRejectNode ? 'Rechazado' : s.label}</span>
              </div>
              {i < STEPS.length - 1 && <span style={{ flex: 1, height: 2, background: i < meta.step ? 'var(--success)' : 'var(--border)', marginTop: 12, borderRadius: 2 }} />}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  /* --------------------------------------------------- detail panel */
  function DetailField({ label, children, mono }) {
    return (
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, padding: '9px 0', borderBottom: '1px solid var(--divider)' }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', flex: 'none' }}>{label}</span>
        <span style={{ fontSize: mono ? 'var(--text-2xs)' : 'var(--text-sm)', fontFamily: mono ? 'var(--font-mono)' : 'inherit', fontWeight: 600, color: 'var(--text-strong)', textAlign: 'right', wordBreak: mono ? 'break-all' : 'normal' }}>{children}</span>
      </div>
    );
  }

  function NextStep({ tone, title, body, primary, secondary, disabled }) {
    return (
      <div style={{ background: tone === 'danger' ? 'var(--danger-soft)' : tone === 'success' ? 'var(--success-soft)' : 'var(--info-soft)', borderLeft: '3px solid ' + toneColor(tone === 'neutral' ? 'info' : tone), borderRadius: 'var(--radius-sm)', padding: 14, display: 'grid', gap: 10 }}>
        <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
          <span style={{ color: toneColor(tone === 'neutral' ? 'info' : tone), flex: 'none', marginTop: 1 }}><Icon name={tone === 'danger' ? 'alert' : tone === 'success' ? 'check' : 'arrowRight'} size={16} /></span>
          <div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)' }}>{title}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text)', marginTop: 3, lineHeight: 1.5, textWrap: 'pretty' }}>{body}</div>
          </div>
        </div>
        {(primary || secondary) && (
          <div style={{ display: 'flex', gap: 8, paddingLeft: 25, flexWrap: 'wrap' }}>
            {primary && <Btn variant="primary" size="sm" leading={primary.icon} disabled={disabled}>{primary.label}</Btn>}
            {secondary && <Btn variant="secondary" size="sm" leading={secondary.icon}>{secondary.label}</Btn>}
          </div>
        )}
      </div>
    );
  }

  function DetailPanel({ d, inv, readiness, readOnly }) {
    if (!inv) {
      return (
        <Card style={{ display: 'grid', placeItems: 'center', minHeight: 320, textAlign: 'center' }}>
          <div style={{ display: 'grid', gap: 10, justifyItems: 'center', maxWidth: 240 }}>
            <span style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', display: 'grid', placeItems: 'center', background: 'var(--surface-sunken)', color: 'var(--text-muted)' }}><Icon name="fileText" size={22} /></span>
            <strong style={{ fontSize: 'var(--text-body)', color: 'var(--text-strong)' }}>Ninguna factura seleccionada</strong>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.5 }}>Elige una factura de la lista para ver su estado y el siguiente paso.</span>
          </div>
        </Card>
      );
    }
    const meta = ELEC[inv.electronic];
    const blocked = !readiness.ready;
    // contextual next step
    let next;
    if (inv.electronic === 'none') {
      next = { tone: 'neutral', title: 'Siguiente paso: generar el documento', body: blocked ? 'Antes de generar, resuelve los bloqueos del SRI más arriba. Tu borrador queda guardado.' : 'Validaremos los datos y construiremos el XML firmado. Aún no se envía al SRI.', primary: { label: 'Generar documento', icon: 'fileText' }, secondary: { label: 'Editar', icon: 'fileEdit' } };
    } else if (inv.electronic === 'generated') {
      next = { tone: 'info', title: 'Siguiente paso: enviar al SRI', body: blocked ? 'El envío está en pausa hasta resolver los bloqueos del SRI.' : 'El XML está firmado y listo. Al enviarlo, el SRI lo recibe y comienza el proceso de autorización.', primary: { label: 'Enviar al SRI', icon: 'send' }, secondary: { label: 'Ver RIDE', icon: 'eye' } };
    } else if (inv.electronic === 'submitted') {
      next = { tone: 'info', title: 'El SRI está procesando este documento', body: 'Lo recibimos y enviamos correctamente. Aún no está autorizada — consulta el estado para confirmar la autorización.', primary: { label: 'Consultar autorización', icon: 'refresh' }, secondary: { label: 'Ver RIDE', icon: 'eye' } };
    } else if (inv.electronic === 'authorized') {
      next = { tone: 'success', title: 'Autorizada por el SRI', body: 'El comprobante es válido. Puedes descargarlo, enviárselo al cliente y este documento ya alimenta a Accounting y Tax Compliance.', primary: { label: 'Enviar al cliente', icon: 'mail' }, secondary: { label: 'Descargar RIDE', icon: 'download' } };
    } else if (inv.electronic === 'rejected') {
      next = { tone: 'danger', title: 'El SRI devolvió este documento', body: inv.rejection.detail, primary: { label: 'Corregir y regenerar', icon: 'fileEdit' }, secondary: { label: 'Ver XML', icon: 'eye' } };
    }
    if (readOnly) { next.primary = null; next.secondary = { label: 'Ver detalle', icon: 'eye' }; }

    return (
      <Card pad={false} style={{ overflow: 'hidden', position: 'sticky', top: 0 }}>
        <div style={{ padding: 'var(--card-pad)', display: 'grid', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 2 }}>{inv.number}</div>
              <h3 style={{ margin: 0, fontSize: 'var(--text-h3)', fontWeight: 600, color: 'var(--text-strong)', lineHeight: 1.25 }}>{inv.customer}</h3>
              <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>RUC {inv.customerRuc}</div>
            </div>
            <Pill tone={meta.tone} dot>{meta.label}</Pill>
          </div>

          <div className="ds-tnum" style={{ fontSize: 28, fontWeight: 700, letterSpacing: 'var(--track-snug)', color: 'var(--text-strong)', lineHeight: 1 }}>
            {money(inv.totalInCents, inv.currency)}
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--text-muted)', marginLeft: 8 }}>{inv.currency}</span>
          </div>

          {/* lifecycle stepper — where the document is, without over-claiming */}
          <div style={{ background: 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '14px 14px 12px' }}>
            <Stepper electronic={inv.electronic} />
          </div>
        </div>

        {/* document vs electronic condition — system status ≠ legal status */}
        <div style={{ padding: '0 var(--card-pad)' }}>
          <DetailField label="Condición del documento">{inv.electronic === 'none' ? 'Borrador (sistema)' : 'Emitido (sistema)'}</DetailField>
          <DetailField label="Condición electrónica (SRI)">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Dot tone={meta.tone} />{meta.artifact}</span>
          </DetailField>
          <DetailField label="Subtotal · IVA 12%">{money(inv.subtotalInCents, inv.currency)} · {money(inv.ivaInCents, inv.currency)}</DetailField>
          {inv.accessKey && <DetailField label="Clave de acceso" mono>{inv.accessKey}</DetailField>}
          {inv.electronic === 'authorized' && <DetailField label="N.º de autorización" mono>{inv.authorizationNumber}</DetailField>}
          {inv.electronic === 'authorized' && <DetailField label="Autorizada">{inv.authorizedAt}</DetailField>}
        </div>

        <div style={{ padding: 'var(--card-pad)', display: 'grid', gap: 12 }}>
          {inv.electronic === 'rejected' && (
            <div style={{ background: 'var(--danger-soft)', border: '1px solid color-mix(in oklab, var(--danger) 24%, transparent)', borderRadius: 'var(--radius-sm)', padding: 12, display: 'grid', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--on-danger-soft)' }}>
                <span style={{ fontFamily: 'var(--font-mono)' }}>SRI · cód. {inv.rejection.code}</span>
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-strong)', fontWeight: 600 }}>{inv.rejection.message}</div>
              <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>campo: {inv.rejection.field}</div>
            </div>
          )}
          <NextStep {...next} disabled={blocked && (inv.electronic === 'none' || inv.electronic === 'generated')} />

          {/* artifacts — clearly labeled by stage */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Btn variant="ghost" size="sm" leading="eye">{inv.electronic === 'none' ? 'Previsualizar RIDE' : 'Ver RIDE'}</Btn>
            <Btn variant="ghost" size="sm" leading="layers" disabled={inv.electronic === 'none'}>Ver XML</Btn>
          </div>

          {/* quiet cross-product awareness */}
          {inv.electronic === 'authorized' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 4, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)' }}>Alimenta a</span>
              {['Accounting', 'Tax Compliance'].map((x) => (
                <span key={x} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 'var(--text-2xs)', fontWeight: 600, color: 'var(--text-muted)', background: 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: 'var(--radius-pill)', padding: '3px 9px' }}>
                  <Icon name="arrowRight" size={11} />{x}
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>
    );
  }

  /* --------------------------------------- Ecuador readiness config */
  function ReadinessConfig({ d, readiness, onClose }) {
    const e = d.electronic;
    const sig = readiness.signature;
    const cards = [
      { key: 'issuer', icon: 'building', title: 'Perfil del emisor', pill: readiness.pillars[0],
        fields: [['Razón social', e.issuer.legalName], ['RUC', e.issuer.ruc, true], ['Ambiente SRI', e.issuer.environment === 'production' ? 'Producción' : 'Pruebas'], ['Obligado a contabilidad', e.issuer.obligadoContabilidad ? 'Sí' : 'No']],
        action: 'Editar perfil' },
      { key: 'signature', icon: 'key', title: 'Firma electrónica', pill: readiness.pillars[1],
        fields: [['Titular', sig.subject], ['Emisor del certificado', sig.issuer || 'Security Data C.A.'], ['Válido hasta', sig.validUntil, true], ['Inspección', sig.status === 'expired' ? 'Caducada' : 'Válida']],
        action: sig.status === 'valid' ? 'Reemplazar certificado' : 'Renovar firma', danger: sig.status === 'expired' },
      { key: 'gateway', icon: 'server', title: 'Envío / Gateway SRI', pill: readiness.pillars[2],
        fields: [['Estado', e.submission.gatewayConfigured ? (e.submission.isActive ? 'Conectado y activo' : 'Configurado, inactivo') : 'Sin configurar'], ['Ambiente', e.submission.environment === 'production' ? 'Producción' : 'Pruebas'], ['Última verificación', e.submission.lastCheckedAt]],
        action: 'Probar conexión' },
      { key: 'numbering', icon: 'hash', title: 'Numeración de factura (01)', pill: readiness.pillars[3],
        fields: [['Establecimiento', e.numbering.establishment, true], ['Punto de emisión', e.numbering.emissionPoint, true], ['Siguiente número', e.numbering.nextNumber, true], ['Secuenciales restantes', e.numbering.sequentialRemaining.toLocaleString('en-US')]],
        action: 'Ajustar numeración' }
    ];
    return (
      <Card pad={false} style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 18px', borderBottom: '1px solid var(--divider)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: 'var(--primary)', display: 'inline-flex' }}><Icon name="shield" size={18} /></span>
            <div>
              <h3 style={{ margin: 0, fontSize: 'var(--text-h3)', fontWeight: 600, color: 'var(--text-strong)' }}>Configuración electrónica SRI</h3>
              <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>Lo que debe estar en orden para emitir en Ecuador</span>
            </div>
          </div>
          <Btn variant="ghost" size="sm" trailing="chevronUp" onClick={onClose}>Ocultar</Btn>
        </div>
        {readiness.blockers.length > 0 && (
          <div style={{ padding: '14px 18px 0', display: 'grid', gap: 10 }}>
            {readiness.blockers.map((b, i) => (
              <Banner key={i} tone={b.title.includes('firma') ? 'danger' : 'warning'} icon="alert" title={b.title}>{b.body}</Banner>
            ))}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, background: 'var(--divider)', padding: 1, marginTop: readiness.blockers.length ? 14 : 0 }}>
          {cards.map((c) => (
            <div key={c.key} style={{ background: 'var(--surface)', padding: 18, display: 'grid', gap: 12, alignContent: 'start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 34, height: 34, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: c.danger ? 'var(--danger-soft)' : 'var(--primary-soft)', color: c.danger ? 'var(--danger)' : 'var(--primary)' }}><Icon name={c.icon} size={17} /></span>
                <strong style={{ flex: 1, fontSize: 'var(--text-body)', fontWeight: 600, color: 'var(--text-strong)' }}>{c.title}</strong>
                <Pill tone={c.pill.tone} dot>{c.pill.value.length > 16 ? (c.pill.tone === 'success' ? 'Listo' : c.pill.value) : c.pill.value}</Pill>
              </div>
              <div>
                {c.fields.map(([k, v, mono]) => (
                  <div key={k} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, padding: '7px 0', borderBottom: '1px solid var(--divider)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{k}</span>
                    <span style={{ fontSize: mono ? 'var(--text-xs)' : 'var(--text-sm)', fontFamily: mono ? 'var(--font-mono)' : 'inherit', fontWeight: 600, color: 'var(--text-strong)', textAlign: 'right' }}>{v}</span>
                  </div>
                ))}
              </div>
              <Btn variant={c.danger ? 'primary' : 'secondary'} size="sm" leading={c.danger ? 'key' : undefined}>{c.action}</Btn>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  /* ----------------------------------------------- desktop workspace */
  function DesktopWorkspace({ d, state }) {
    const readiness = getReadiness(d, state);
    const defaultSel = state === 'readiness-blocked' ? 'inv_0148' : 'inv_0145';
    const [selectedId, setSelectedId] = useState(defaultSel);
    const [filter, setFilter] = useState('all');
    const [configOpen, setConfigOpen] = useState(state === 'no-issuer' || state === 'readiness-blocked');
    const readOnly = state === 'permission-limited';
    const showQueue = state !== 'no-issuer';
    const inv = d.invoices.find((i) => i.id === selectedId);

    return (
      <div style={{ padding: 24, display: 'grid', gap: 18, maxWidth: 1280, margin: '0 auto' }}>
        {state === 'permission-limited' && (
          <Banner tone="info" icon="eye" title="Solo lectura">Necesitas el permiso invoicing.manage para generar o enviar documentos. Pídeselo al Owner del tenant.</Banner>
        )}
        <StatusHero d={d} state={state} readiness={readiness}
          onConfig={() => setConfigOpen((o) => !o)}
          onReviewPending={() => { setFilter('pending'); setSelectedId('inv_0145'); }} />

        {configOpen && <ReadinessConfig d={d} readiness={readiness} onClose={() => setConfigOpen(false)} />}

        {showQueue && <Metrics d={d} />}

        {showQueue && (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.65fr) minmax(340px, 1fr)', gap: 16, alignItems: 'start' }}>
            <Queue d={d} selectedId={selectedId} onSelect={setSelectedId} filter={filter} onFilter={setFilter} readOnly={readOnly} />
            <DetailPanel d={d} inv={inv} readiness={readiness} readOnly={readOnly} />
          </div>
        )}
      </div>
    );
  }

  window.INV = { DesktopWorkspace, getReadiness, money, ELEC, matchFilter, FILTERS };
})();
