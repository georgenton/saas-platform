/* Slice 03 — Ecuador SRI control area, refined.
   The premium pass on workspace-electronic.tsx. A single calm column that lives
   inside an invoice's detail and answers, in strict order of decreasing
   urgency:
     1  immediate status   document / SRI / access-key readiness   (triad)
     2  recommended step    what to do now + why                   (one cue)
     3  compact operation   dense controls hidden by default       (disclosure)
     4  intervention        opens on blocker / reconciliation       (form)
     5  advanced fallback   external signed XML · clearly secondary (muted)
     6  technical evidence  history + traces · visually quieter     (trace)
   window.SRI. */
(function () {
  const { useState } = React;
  const Icon = window.Icon;
  const { Btn, Pill, Banner } = window.UI;

  function money(cents, currency) {
    const v = (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return (currency === 'USD' ? '$' : '') + v;
  }
  const toneColor = (t) => t === 'success' ? 'var(--success)' : t === 'warning' ? 'var(--warning)' : t === 'danger' ? 'var(--danger)' : t === 'info' ? 'var(--info)' : 'var(--text-subtle)';
  const toneSoft = (t) => t === 'success' ? 'var(--success-soft)' : t === 'warning' ? 'var(--warning-soft)' : t === 'danger' ? 'var(--danger-soft)' : t === 'info' ? 'var(--info-soft)' : 'var(--surface-sunken)';

  // electronicStatus → presentation. Distinguishes artifact stages, never
  // over-claims authorization.
  const ELEC = {
    none:               { label: 'Borrador',  tone: 'neutral', step: 0 },
    pending_submission: { label: 'Pendiente', tone: 'info',    step: 0 },
    submitted:          { label: 'En el SRI', tone: 'warning', step: 1 },
    authorized:         { label: 'Autorizada',tone: 'success', step: 2 },
    rejected:           { label: 'Rechazada', tone: 'danger',  step: 1 }
  };
  const STAGES = ['Preparado', 'Enviado al SRI', 'Autorizado'];

  function Card({ children, style, quiet }) {
    return <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: quiet ? 'none' : 'var(--shadow-sm)', ...style }}>{children}</div>;
  }
  function Dot({ tone, size = 8 }) { return <span style={{ width: size, height: size, borderRadius: 999, flex: 'none', background: toneColor(tone) }} />; }

  /* ---------------------------------------- copy-to-clipboard mono value */
  function CopyValue({ value, ariaLabel }) {
    const [copied, setCopied] = useState(false);
    function copy() {
      try { navigator.clipboard && navigator.clipboard.writeText(value); } catch (e) {}
      setCopied(true); setTimeout(() => setCopied(false), 1600);
    }
    return (
      <button className="ds-focusable" onClick={copy} aria-label={ariaLabel || 'Copiar'} title="Copiar"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, maxWidth: '100%', textAlign: 'right', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', fontWeight: 600, color: 'var(--text-strong)', wordBreak: 'break-all', lineHeight: 1.5 }}>{value}</span>
        <span style={{ flex: 'none', color: copied ? 'var(--success)' : 'var(--text-subtle)', display: 'inline-flex', marginTop: 1 }}><Icon name={copied ? 'check' : 'copy'} size={13} /></span>
      </button>
    );
  }

  /* ----------------------------------------------- invoice context header */
  function InvoiceContext({ s }) {
    const inv = s.invoice;
    const meta = ELEC[inv.electronicStatus];
    return (
      <Card style={{ padding: 'var(--card-pad)', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <span style={{ width: 40, height: 40, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: 'var(--surface-sunken)', color: 'var(--text-muted)' }}><Icon name="invoicing" size={20} /></span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>{inv.number}</div>
          <div style={{ fontSize: 'var(--text-body)', fontWeight: 600, color: 'var(--text-strong)', lineHeight: 1.25 }}>{inv.customer}</div>
          <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>RUC {inv.customerRuc}</div>
        </div>
        <div style={{ flex: 1 }} />
        <div className="ds-tnum" style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 'var(--text-h2)', fontWeight: 700, letterSpacing: 'var(--track-snug)', color: 'var(--text-strong)', lineHeight: 1 }}>{money(inv.totalInCents, inv.currency)}</div>
          <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', marginTop: 3 }}>{inv.items} ítems · IVA {money(inv.ivaInCents, inv.currency)}</div>
        </div>
      </Card>
    );
  }

  /* ------------------------------------------------------ stage stepper */
  function StageStepper({ status }) {
    const meta = ELEC[status];
    const rejected = status === 'rejected';
    return (
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        {STAGES.map((label, i) => {
          const done = i < meta.step;
          const current = i === meta.step;
          const rej = rejected && i === 1;
          const c = rej ? 'var(--danger)' : done ? 'var(--success)' : current ? 'var(--primary)' : 'var(--border-strong)';
          const filled = done || rej || (current && !rejected);
          return (
            <React.Fragment key={label}>
              <div style={{ display: 'grid', justifyItems: 'center', gap: 6, width: 96, flex: 'none' }}>
                <span style={{ width: 26, height: 26, borderRadius: 999, display: 'grid', placeItems: 'center', border: '2px solid ' + c, background: filled ? c : 'var(--surface)', color: filled ? '#fff' : c }}>
                  {done ? <Icon name="check" size={14} /> : rej ? <Icon name="x" size={14} /> : <span style={{ width: 7, height: 7, borderRadius: 999, background: current ? '#fff' : c }} />}
                </span>
                <span style={{ fontSize: 'var(--text-2xs)', fontWeight: 600, textAlign: 'center', color: current || rej ? 'var(--text-strong)' : 'var(--text-muted)' }}>{rej ? 'Rechazado' : label}</span>
              </div>
              {i < STAGES.length - 1 && <span style={{ flex: 1, height: 2, background: i < meta.step ? 'var(--success)' : 'var(--border)', marginTop: 12, borderRadius: 2 }} />}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  /* -------------------------------------------------------- status triad */
  function StatusTriad({ s }) {
    const inv = s.invoice;
    const meta = ELEC[inv.electronicStatus];
    const docLabel = inv.documentStatus === 'draft' ? 'Borrador' : inv.documentStatus === 'paid' ? 'Pagada' : 'Emitida';
    const keyTone = inv.accessKeyReady ? 'success' : 'neutral';
    const tiles = [
      { label: 'Documento', value: docLabel, sub: 'Condición interna del sistema', tone: 'neutral', icon: 'fileText' },
      { label: 'Estado SRI', value: meta.label, sub: 'Condición legal del comprobante', tone: meta.tone, icon: 'shield' },
      { label: 'Clave de acceso', value: inv.accessKeyReady ? 'Lista' : 'Derivable', sub: inv.accessKeyReady ? '49 dígitos · verificada' : 'El backend la compondrá', tone: keyTone, icon: 'key' }
    ];
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--divider)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
        {tiles.map((t) => (
          <div key={t.label} style={{ background: 'var(--surface)', padding: '14px 16px', display: 'grid', gap: 6 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 'var(--text-2xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <span style={{ color: 'var(--text-subtle)', display: 'inline-flex' }}><Icon name={t.icon} size={13} /></span>{t.label}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Dot tone={t.tone} />
              <strong style={{ fontSize: 'var(--text-body)', fontWeight: 700, color: 'var(--text-strong)', lineHeight: 1.1 }}>{t.value}</strong>
            </span>
            <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', lineHeight: 1.4 }}>{t.sub}</span>
          </div>
        ))}
      </div>
    );
  }

  /* ---------------------------------------------------------- next step */
  function NextStep({ s, onIntervene }) {
    const status = s.invoice.electronicStatus;
    const blocked = !s.readiness.ready;
    const unsupported = !s.support.submitSupported;
    let tone, title, body, primary, secondary, foot;

    if (unsupported) {
      tone = 'warning';
      title = 'Este tipo de comprobante aún no se envía automáticamente';
      body = s.support.detail;
      primary = { label: 'Ver RIDE', icon: 'eye', variant: 'secondary' };
      secondary = null;
    } else if (blocked) {
      tone = 'danger';
      title = 'Envío en pausa: ' + s.readiness.blocker.title.toLowerCase();
      body = s.readiness.blocker.body + ' Tu comprobante queda guardado mientras tanto.';
      primary = { label: s.readiness.blocker.fix, icon: 'key', variant: 'primary' };
      secondary = { label: 'Ver detalle SRI', icon: 'wrench', onClick: onIntervene };
    } else if (status === 'pending_submission' || status === 'none') {
      tone = 'info';
      title = 'Siguiente paso: firmar y enviar al SRI';
      body = 'La firma, el gateway y la numeración están en orden. Al enviarlo, el SRI lo recibe y comienza la autorización. Aún no se considera autorizado.';
      primary = { label: 'Enviar al SRI', icon: 'send', variant: 'primary' };
      secondary = { label: 'Ver XML preliminar', icon: 'eye' };
    } else if (status === 'submitted') {
      tone = 'info';
      title = 'El SRI está procesando este comprobante';
      body = 'Lo recibimos y enviamos correctamente. Aún no está autorizada — consulta el estado para confirmar la autorización.';
      primary = { label: 'Consultar autorización', icon: 'refresh', variant: 'primary' };
      secondary = { label: 'Ver RIDE', icon: 'eye' };
      foot = s.lastCheckedLabel ? 'Última consulta ' + s.lastCheckedLabel + ' · no implica autorización' : null;
    } else if (status === 'authorized') {
      tone = 'success';
      title = 'Autorizada por el SRI';
      body = 'El comprobante es legalmente válido. Puedes enviarlo al cliente y ya alimenta a Accounting y Tax Compliance.';
      primary = { label: 'Enviar al cliente', icon: 'mail', variant: 'primary' };
      secondary = { label: 'Descargar RIDE', icon: 'download' };
    } else if (status === 'rejected') {
      tone = 'danger';
      title = 'El SRI devolvió este comprobante';
      body = s.invoice.rejection.fix;
      primary = { label: 'Corregir y regenerar', icon: 'fileEdit', variant: 'primary' };
      secondary = { label: 'Revisar observación', icon: 'wrench', onClick: onIntervene };
    }
    const disabledPrimary = (blocked && primary.variant === 'primary' && (status === 'pending_submission' || status === 'none')) || (unsupported && false);

    return (
      <div style={{ background: toneSoft(tone), borderRadius: 'var(--radius-sm)', border: '1px solid color-mix(in oklab, ' + toneColor(tone) + ' 22%, transparent)', borderLeft: '3px solid ' + toneColor(tone), padding: 16, display: 'grid', gap: 12 }}>
        <div style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
          <span style={{ width: 30, height: 30, flex: 'none', borderRadius: 'var(--radius-xs)', display: 'grid', placeItems: 'center', background: 'var(--surface)', color: toneColor(tone) }}>
            <Icon name={tone === 'danger' ? 'alert' : tone === 'success' ? 'shieldCheck' : tone === 'warning' ? 'shieldAlert' : 'arrowRight'} size={17} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="ds-eyebrow" style={{ marginBottom: 2 }}>Siguiente paso recomendado</div>
            <div style={{ fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)', lineHeight: 1.25, letterSpacing: 'var(--track-snug)' }}>{title}</div>
            <p style={{ margin: '5px 0 0', fontSize: 'var(--text-sm)', color: 'var(--text)', lineHeight: 1.55, textWrap: 'pretty', maxWidth: 560 }}>{body}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 9, paddingLeft: 41, flexWrap: 'wrap', alignItems: 'center' }}>
          <Btn variant={primary.variant} size="sm" leading={primary.icon} disabled={disabledPrimary}>{primary.label}</Btn>
          {secondary && <Btn variant="ghost" size="sm" leading={secondary.icon} onClick={secondary.onClick}>{secondary.label}</Btn>}
          {foot && <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="clock" size={12} />{foot}</span>}
        </div>
      </div>
    );
  }

  /* ------------------------------------------ disclosure card (trigger) */
  function DisclosureCard({ icon, title, summary, pill, open, onToggle, advanced, openLabel, closeLabel }) {
    return (
      <button className="ds-focusable" onClick={onToggle} aria-expanded={open}
        style={{ textAlign: 'left', cursor: 'pointer', display: 'grid', gap: 10, padding: 16, borderRadius: 'var(--radius-sm)', alignContent: 'start',
          border: advanced ? '1px dashed var(--border-strong)' : '1px solid ' + (open ? 'var(--primary)' : 'var(--border)'),
          background: advanced ? 'var(--surface-sunken)' : open ? 'var(--primary-soft)' : 'var(--surface)', transition: 'var(--transition-base)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 30, height: 30, flex: 'none', borderRadius: 'var(--radius-xs)', display: 'grid', placeItems: 'center', background: advanced ? 'var(--surface)' : 'var(--surface)', border: '1px solid var(--border)', color: advanced ? 'var(--text-muted)' : 'var(--primary)' }}><Icon name={icon} size={16} /></span>
          <strong style={{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)' }}>{title}</strong>
          <Pill tone={pill.tone}>{pill.label}</Pill>
        </div>
        <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.5 }}>{summary}</p>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', fontWeight: 600, color: advanced ? 'var(--text-muted)' : 'var(--primary)' }}>
          {open ? (closeLabel || 'Ocultar') : (openLabel || 'Ver detalle')}
          <span style={{ display: 'inline-flex', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}><Icon name="chevronDown" size={14} /></span>
        </span>
      </button>
    );
  }

  function Field({ label, children, span }) {
    return (
      <label style={{ display: 'grid', gap: 5, gridColumn: span ? '1 / -1' : 'auto' }}>
        <span style={{ fontSize: 'var(--text-2xs)', fontWeight: 600, color: 'var(--text-muted)' }}>{label}</span>
        {children}
      </label>
    );
  }
  const inputStyle = { height: 'var(--control-h)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-strong)', background: 'var(--surface)', padding: '0 11px', fontSize: 'var(--text-sm)', color: 'var(--text-strong)', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' };

  /* ----------------------------------- intervention (manual SRI control) */
  function InterventionPanel({ s }) {
    const inv = s.invoice;
    const blocked = !s.readiness.ready;
    return (
      <div style={{ background: 'var(--surface)', border: '1px solid var(--primary)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', borderBottom: '1px solid var(--divider)', background: 'var(--primary-soft)' }}>
          <span style={{ color: 'var(--on-primary-soft)', display: 'inline-flex' }}><Icon name="wrench" size={16} /></span>
          <div style={{ flex: 1 }}>
            <div className="ds-eyebrow">Modo intervención</div>
            <strong style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)' }}>Registro y conciliación manual</strong>
          </div>
          <Pill tone={blocked ? 'warning' : 'primary'}>{blocked ? 'Con bloqueo' : 'Operación guiada'}</Pill>
        </div>
        <div style={{ padding: 16, display: 'grid', gap: 14 }}>
          <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.55 }}>
            Usa este bloque sólo cuando necesites registrar una respuesta validada, corregir trazabilidad o conciliar
            una factura ya emitida con el estado legal que devolvió el SRI. No es la operación diaria.
          </p>
          {inv.rejection && (
            <div style={{ background: 'var(--danger-soft)', border: '1px solid color-mix(in oklab, var(--danger) 24%, transparent)', borderRadius: 'var(--radius-xs)', padding: 12, display: 'grid', gap: 4 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', fontWeight: 700, color: 'var(--on-danger-soft)' }}>SRI · cód. {inv.rejection.code} · {inv.rejection.field}</span>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)' }}>{inv.rejection.message}</span>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Estado electrónico">
              <select style={inputStyle} defaultValue={inv.electronicStatus}>
                <option value="pending_submission">Pendiente de envío</option>
                <option value="submitted">Enviado al SRI</option>
                <option value="authorized">Autorizada</option>
                <option value="rejected">Rechazada</option>
              </select>
            </Field>
            <Field label="Fecha de autorización">
              <input style={inputStyle} type="text" placeholder="dd/mm/aaaa · hh:mm" defaultValue={inv.authorizedAt || ''} />
            </Field>
            <Field label="Clave de acceso (49 dígitos)" span>
              <input style={{ ...inputStyle, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)' }} type="text" placeholder="Puedes dejarla vacía para que el backend la genere" defaultValue={inv.accessKey || ''} />
            </Field>
            <Field label="N.º de autorización" span>
              <input style={{ ...inputStyle, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)' }} type="text" placeholder="Número de autorización del SRI" defaultValue={inv.authorizationNumber || ''} />
            </Field>
            <Field label="Mensaje del SRI" span>
              <textarea style={{ ...inputStyle, height: 64, padding: '9px 11px', resize: 'vertical' }} placeholder="Detalle técnico o comercial del estado electrónico" defaultValue={inv.rejection ? inv.rejection.message : ''} />
            </Field>
          </div>
          <div style={{ display: 'flex', gap: 9, alignItems: 'center', flexWrap: 'wrap' }}>
            <Btn variant="secondary" size="sm" leading="check" disabled={blocked}>Actualizar estado electrónico</Btn>
            <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', lineHeight: 1.45, flex: 1, minWidth: 200 }}>Deja la clave vacía para que el backend la componga desde el perfil fiscal y la numeración Ecuador.</span>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------------------------- advanced fallback XML bridge */
  function FallbackPanel({ s }) {
    const inv = s.invoice;
    const staged = s.fallbackXmlReady;
    return (
      <div style={{ background: 'var(--surface-sunken)', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', borderBottom: '1px solid var(--divider)' }}>
          <span style={{ color: 'var(--text-muted)', display: 'inline-flex' }}><Icon name="route" size={16} /></span>
          <div style={{ flex: 1 }}>
            <div className="ds-eyebrow">Ruta avanzada · secundaria</div>
            <strong style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)' }}>Puente para sandbox real (XML prefirmado)</strong>
          </div>
          <Pill tone={staged ? 'info' : 'neutral'}>{staged ? 'XML staged' : 'Opcional'}</Pill>
        </div>
        <div style={{ padding: 16, display: 'grid', gap: 14 }}>
          <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.55 }}>
            Este camino existe para validar escenarios reales de sandbox con una firma generada fuera del sistema,
            mientras la firma XAdES nativa sigue en evolución. <strong style={{ color: 'var(--text)' }}>No es la ruta principal del operador.</strong>
          </p>
          <Field label="Signer name">
            <input style={inputStyle} type="text" placeholder="sandbox-signer o nombre del firmador externo" defaultValue={s.presigned ? s.presigned.signerName : ''} />
          </Field>
          <Field label="Signed XML">
            <textarea style={{ ...inputStyle, height: 80, padding: '9px 11px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', resize: 'vertical', lineHeight: 1.5 }} placeholder="<factura ...><ds:Signature>...</ds:Signature></factura>" defaultValue={s.presigned ? s.presigned.xmlPreview : ''} />
          </Field>
          <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
            <Btn variant="secondary" size="sm" leading="send" disabled={!staged || inv.documentStatus === 'draft'}>Enviar XML prefirmado</Btn>
            <Btn variant="ghost" size="sm" leading="refresh" disabled={inv.electronicStatus !== 'submitted'}>Consultar autorización (stub)</Btn>
          </div>
        </div>
      </div>
    );
  }

  /* --------------------------------------------- technical trace (quiet) */
  function TraceEvent({ e }) {
    const tone = e.providerStatus === 'AUTORIZADO' ? 'success' : e.providerStatus === 'NO AUTORIZADO' ? 'danger' : e.type === 'submission' ? 'info' : 'warning';
    const [open, setOpen] = useState(false);
    const hasPayload = e.requestPayload || e.responsePayload;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '20px 1fr', gap: 12 }}>
        <div style={{ display: 'grid', justifyItems: 'center', gap: 0 }}>
          <span style={{ width: 14, height: 14, borderRadius: 999, border: '2px solid ' + toneColor(tone), background: 'var(--surface)', flex: 'none', marginTop: 2 }} />
          <span style={{ width: 2, flex: 1, background: 'var(--divider)' }} />
        </div>
        <div style={{ paddingBottom: 16, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'var(--text-2xs)', fontWeight: 600, color: 'var(--text-muted)' }}>{e.type === 'submission' ? 'Envío' : 'Consulta de autorización'}</span>
            <Pill tone={tone} dot>{e.providerStatus}</Pill>
            <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}>{e.occurredAt}</span>
          </div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-strong)', fontWeight: 500, marginTop: 4, lineHeight: 1.45 }}>{e.message}</div>
          {e.sriDiagnostics && e.sriDiagnostics.summary && (
            <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', marginTop: 3 }}>Diagnóstico SRI: {e.sriDiagnostics.summary}</div>
          )}
          {e.sriDiagnostics && e.sriDiagnostics.messages.map((m, i) => (
            <div key={i} style={{ marginTop: 6, background: 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', padding: '8px 10px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', fontWeight: 700, color: 'var(--on-danger-soft)' }}>{m.identifier ? 'Identificador ' + m.identifier : 'Mensaje SRI'}</span>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-strong)', fontWeight: 600 }}>{m.message}</div>
              {m.additionalInfo.map((d, j) => <div key={j} style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>{d}</div>)}
            </div>
          ))}
          <div style={{ display: 'flex', gap: 14, marginTop: 6, flexWrap: 'wrap', fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}>
            {e.soapAction && <span>SOAP {e.soapAction}</span>}
            {e.submissionReference && <span>Ref {e.submissionReference}</span>}
          </div>
          {hasPayload && (
            <div style={{ marginTop: 8 }}>
              <button className="ds-focusable" onClick={() => setOpen((o) => !o)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 'var(--text-2xs)', fontWeight: 600, padding: 0 }}>
                <Icon name="terminal" size={12} />{open ? 'Ocultar payloads' : 'Ver payloads SOAP'}
                <span style={{ display: 'inline-flex', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}><Icon name="chevronDown" size={12} /></span>
              </button>
              {open && (
                <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
                  {e.requestPayload && <pre style={preStyle}>{e.requestPayload}</pre>}
                  {e.responsePayload && <pre style={preStyle}>{e.responsePayload}</pre>}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
  const preStyle = { margin: 0, background: 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', padding: 10, fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: 1.5, color: 'var(--text)', whiteSpace: 'pre-wrap', wordBreak: 'break-all', overflowX: 'auto' };

  function TechnicalTrace({ s, defaultOpen }) {
    const [open, setOpen] = useState(!!defaultOpen);
    if (!s.events || s.events.length === 0) return null;
    return (
      <Card quiet style={{ overflow: 'hidden' }}>
        <button className="ds-focusable" onClick={() => setOpen((o) => !o)} aria-expanded={open}
          style={{ width: '100%', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: 'var(--surface-sunken)', border: 'none', borderBottom: open ? '1px solid var(--divider)' : 'none' }}>
          <span style={{ width: 30, height: 30, flex: 'none', borderRadius: 'var(--radius-xs)', display: 'grid', placeItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}><Icon name="history" size={16} /></span>
          <div style={{ flex: 1 }}>
            <div className="ds-eyebrow">Evidencia técnica</div>
            <strong style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)' }}>Historial técnico SRI</strong>
          </div>
          <Pill tone="neutral">{s.events.length} evento{s.events.length === 1 ? '' : 's'}</Pill>
          <span style={{ display: 'inline-flex', color: 'var(--text-muted)', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}><Icon name="chevronDown" size={16} /></span>
        </button>
        {open && (
          <div style={{ padding: '16px 18px 6px' }}>
            <p style={{ margin: '0 0 14px', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.55 }}>
              Trazas conservadas para soporte y diagnóstico. No es el flujo de trabajo principal — sólo evidencia de lo que ocurrió con el SRI.
            </p>
            <div>{s.events.map((e) => <TraceEvent key={e.id} e={e} />)}</div>
          </div>
        )}
      </Card>
    );
  }

  /* ------------------------------------------------- SRI control panel */
  function SRIControlPanel({ s, stateKey }) {
    const inv = s.invoice;
    const meta = ELEC[inv.electronicStatus];
    const blocked = !s.readiness.ready;
    const unsupported = !s.support.submitSupported;
    // intervention auto-opens on blocker / reconciliation / deliberate state
    const [intervene, setIntervene] = useState(blocked || inv.electronicStatus === 'submitted' || inv.electronicStatus === 'rejected');
    // fallback auto-opens only when staged or when the normal path is unsupported
    const [fallback, setFallback] = useState(s.fallbackXmlReady || unsupported);

    return (
      <Card style={{ overflow: 'hidden' }}>
        {/* panel header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 18px', borderBottom: '1px solid var(--divider)' }}>
          <span style={{ width: 36, height: 36, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: toneSoft(meta.tone), color: toneColor(meta.tone) }}><Icon name="shield" size={19} /></span>
          <div style={{ flex: 1 }}>
            <div className="ds-eyebrow">Comprobante electrónico · Ecuador</div>
            <h2 style={{ margin: 0, fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)', letterSpacing: 'var(--track-snug)' }}>Autorización SRI</h2>
          </div>
          <Pill tone={meta.tone} dot>{meta.label}</Pill>
        </div>

        <div style={{ padding: 'var(--card-pad)', display: 'grid', gap: 16 }}>
          {/* 1 — immediate status */}
          <StatusTriad s={s} />

          {/* lifecycle ladder — grounding, never over-claims */}
          <div style={{ background: 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '16px 18px 14px' }}>
            <StageStepper status={inv.electronicStatus} />
          </div>

          {/* unsupported document compatibility note */}
          {unsupported && (
            <Banner tone="warning" icon="shieldAlert" title={'Tipo de comprobante: ' + s.support.label}>
              {s.support.detail}
            </Banner>
          )}

          {/* authorized artifacts — clave + nº autorización with copy */}
          {inv.electronicStatus === 'authorized' && (
            <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              <ArtifactRow label="Clave de acceso" value={inv.accessKey} />
              <ArtifactRow label="N.º de autorización" value={inv.authorizationNumber} last />
            </div>
          )}

          {/* 2 — recommended next step (the loudest thing) */}
          <NextStep s={s} onIntervene={() => setIntervene(true)} />

          {/* quiet section divider into advanced controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 2 }}>
            <span className="ds-eyebrow">Controles avanzados</span>
            <span style={{ flex: 1, height: 1, background: 'var(--divider)' }} />
            <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)' }}>Ocultos por defecto · ábrelos sólo si vas a intervenir</span>
          </div>

          {/* 3 — compact disclosure cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <DisclosureCard
              icon="wrench" title="Configuración y conciliación"
              summary={blocked ? 'Necesita intervención antes de operar con el SRI.' : 'La base electrónica está usable; entra sólo si vas a conciliar, corregir o registrar una respuesta.'}
              pill={blocked ? { tone: 'warning', label: 'Atención' } : { tone: 'success', label: 'Compacto' }}
              open={intervene} onToggle={() => setIntervene((o) => !o)}
              openLabel="Ver detalle SRI" closeLabel="Ocultar detalle SRI" />
            <DisclosureCard
              icon="route" title="Sandbox real / fallback técnico"
              summary={s.fallbackXmlReady ? 'Hay un XML prefirmado listo para pruebas reales de sandbox.' : 'Ruta reservada para pruebas avanzadas con firma externa.'}
              pill={{ tone: s.fallbackXmlReady ? 'info' : 'neutral', label: 'Avanzado' }}
              open={fallback} onToggle={() => setFallback((o) => !o)} advanced
              openLabel="Ver fallback técnico" closeLabel="Ocultar fallback" />
          </div>

          {/* 4 — intervention mode */}
          {intervene && <InterventionPanel s={s} />}

          {/* 5 — advanced fallback */}
          {fallback && <FallbackPanel s={s} />}
        </div>
      </Card>
    );
  }

  function ArtifactRow({ label, value, last }) {
    return (
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, padding: '11px 14px', background: 'var(--surface)', borderBottom: last ? 'none' : '1px solid var(--divider)' }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', flex: 'none' }}>{label}</span>
        <CopyValue value={value} ariaLabel={'Copiar ' + label} />
      </div>
    );
  }

  /* --------------------------------------------------- desktop SRI page */
  function DesktopSRI({ d, stateKey }) {
    const s = d.scenarios[stateKey];
    return (
      <div style={{ padding: 24, display: 'grid', gap: 16, maxWidth: 860, margin: '0 auto' }}>
        {/* breadcrumb-ish context line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
          <span>Facturas</span><Icon name="chevronRight" size={13} />
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>{s.invoice.number}</span><Icon name="chevronRight" size={13} />
          <span style={{ fontWeight: 600, color: 'var(--text-strong)' }}>SRI</span>
        </div>
        <InvoiceContext s={s} />
        <SRIControlPanel s={s} stateKey={stateKey} />
        <TechnicalTrace s={s} defaultOpen={stateKey === 'trace'} />
      </div>
    );
  }

  window.SRI = { DesktopSRI, SRIControlPanel, TechnicalTrace, InvoiceContext, StageStepper, StatusTriad, NextStep, money, ELEC, toneColor, toneSoft, CopyValue };
})();
