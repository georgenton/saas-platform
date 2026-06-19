/* Slice 03 — Ecuador SRI control area, mobile. A one-hand focused detail, not a
   shrunk desktop: a scrollable SRI screen with a compact status triad, a slim
   lifecycle bar, one dominant next-step button, stacked compact disclosure
   cards that open the dense controls in bottom sheets, and an inline,
   quiet technical-trace reveal. window.MobileSRI. */
(function () {
  const { useState } = React;
  const Icon = window.Icon;
  const { Btn, Pill, Banner } = window.UI;
  const { MobileTopBar, BottomTabs, Sheet } = window.Chrome;
  const { money, ELEC, toneColor, toneSoft, CopyValue } = window.SRI;

  const STAGES = ['Preparado', 'Enviado', 'Autorizado'];
  function Dot({ tone, size = 8 }) { return <span style={{ width: size, height: size, borderRadius: 999, flex: 'none', background: toneColor(tone) }} />; }
  function MCard({ children, style, quiet }) { return <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: quiet ? 'none' : 'var(--shadow-sm)', ...style }}>{children}</div>; }
  const inputStyle = { height: 'var(--control-h)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-strong)', background: 'var(--surface)', padding: '0 11px', fontSize: 'var(--text-sm)', color: 'var(--text-strong)', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' };

  function StepsBar({ status }) {
    const meta = ELEC[status];
    const rejected = status === 'rejected';
    return (
      <div style={{ display: 'flex', gap: 6 }}>
        {STAGES.map((l, i) => {
          const done = i < meta.step, current = i === meta.step, rej = rejected && i === 1;
          const c = rej ? 'var(--danger)' : done ? 'var(--success)' : current ? 'var(--primary)' : 'var(--border)';
          return (
            <div key={l} style={{ flex: 1, display: 'grid', gap: 4, justifyItems: 'center' }}>
              <span style={{ width: '100%', height: 4, borderRadius: 2, background: c }} />
              <span style={{ fontSize: 9, fontWeight: 600, color: current || rej ? 'var(--text-strong)' : 'var(--text-muted)' }}>{rej ? 'Rechazado' : l}</span>
            </div>
          );
        })}
      </div>
    );
  }

  function Triad({ s }) {
    const inv = s.invoice, meta = ELEC[inv.electronicStatus];
    const docLabel = inv.documentStatus === 'draft' ? 'Borrador' : inv.documentStatus === 'paid' ? 'Pagada' : 'Emitida';
    const rows = [
      { label: 'Documento', value: docLabel, sub: 'Condición interna', tone: 'neutral', icon: 'fileText' },
      { label: 'Estado SRI', value: meta.label, sub: 'Condición legal', tone: meta.tone, icon: 'shield' },
      { label: 'Clave de acceso', value: inv.accessKeyReady ? 'Lista' : 'Derivable', sub: inv.accessKeyReady ? '49 dígitos' : 'Backend la compone', tone: inv.accessKeyReady ? 'success' : 'neutral', icon: 'key' }
    ];
    return (
      <MCard style={{ overflow: 'hidden' }}>
        {rows.map((r, i) => (
          <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 14px', borderBottom: i < 2 ? '1px solid var(--divider)' : 'none' }}>
            <span style={{ width: 30, height: 30, flex: 'none', borderRadius: 'var(--radius-xs)', display: 'grid', placeItems: 'center', background: 'var(--surface-sunken)', color: 'var(--text-muted)' }}><Icon name={r.icon} size={15} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', fontWeight: 600 }}>{r.label}</div>
              <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)' }}>{r.sub}</div>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
              <strong style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)' }}>{r.value}</strong>
              <Dot tone={r.tone} />
            </span>
          </div>
        ))}
      </MCard>
    );
  }

  function NextStep({ s, onIntervene }) {
    const status = s.invoice.electronicStatus, blocked = !s.readiness.ready, unsupported = !s.support.submitSupported;
    let tone, title, body, primary, picon, foot, disabled = false;
    if (unsupported) { tone = 'warning'; title = 'Envío automático no disponible'; body = s.support.detail; primary = 'Ver RIDE'; picon = 'eye'; }
    else if (blocked) { tone = 'danger'; title = 'Envío en pausa'; body = s.readiness.blocker.body; primary = s.readiness.blocker.fix; picon = 'key'; disabled = false; }
    else if (status === 'pending_submission' || status === 'none') { tone = 'info'; title = 'Firmar y enviar al SRI'; body = 'Firma, gateway y numeración en orden. Aún no se considera autorizado.'; primary = 'Enviar al SRI'; picon = 'send'; }
    else if (status === 'submitted') { tone = 'info'; title = 'El SRI está procesando'; body = 'Lo enviamos correctamente. Aún no está autorizada — consulta para confirmar.'; primary = 'Consultar autorización'; picon = 'refresh'; foot = s.lastCheckedLabel ? 'Última consulta ' + s.lastCheckedLabel : null; }
    else if (status === 'authorized') { tone = 'success'; title = 'Autorizada por el SRI'; body = 'Comprobante válido. Alimenta a Accounting y Tax Compliance.'; primary = 'Enviar al cliente'; picon = 'mail'; }
    else { tone = 'danger'; title = 'Devuelta por el SRI'; body = s.invoice.rejection.fix; primary = 'Corregir y regenerar'; picon = 'fileEdit'; }
    return (
      <div style={{ background: toneSoft(tone), border: '1px solid color-mix(in oklab, ' + toneColor(tone) + ' 22%, transparent)', borderLeft: '3px solid ' + toneColor(tone), borderRadius: 'var(--radius-sm)', padding: 14, display: 'grid', gap: 10 }}>
        <div className="ds-eyebrow">Siguiente paso recomendado</div>
        <strong style={{ fontSize: 'var(--text-body)', fontWeight: 700, color: 'var(--text-strong)', lineHeight: 1.25 }}>{title}</strong>
        <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text)', lineHeight: 1.5 }}>{body}</p>
        <Btn variant="primary" size="sm" full leading={picon} disabled={disabled}>{primary}</Btn>
        {foot && <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="clock" size={12} />{foot} · no implica autorización</span>}
      </div>
    );
  }

  function DiscloseCard({ icon, title, summary, pill, advanced, onOpen }) {
    return (
      <button className="ds-focusable" onClick={onOpen} style={{ width: '100%', textAlign: 'left', cursor: 'pointer', display: 'grid', gap: 8, padding: 14, borderRadius: 'var(--radius-sm)', border: advanced ? '1px dashed var(--border-strong)' : '1px solid var(--border)', background: advanced ? 'var(--surface-sunken)' : 'var(--surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 28, height: 28, flex: 'none', borderRadius: 'var(--radius-xs)', display: 'grid', placeItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', color: advanced ? 'var(--text-muted)' : 'var(--primary)' }}><Icon name={icon} size={15} /></span>
          <strong style={{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)' }}>{title}</strong>
          <Pill tone={pill.tone}>{pill.label}</Pill>
        </div>
        <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.5 }}>{summary}</p>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', fontWeight: 600, color: advanced ? 'var(--text-muted)' : 'var(--primary)' }}>
          Abrir <Icon name="chevronRight" size={13} />
        </span>
      </button>
    );
  }

  function Field({ label, children }) {
    return <label style={{ display: 'grid', gap: 5 }}><span style={{ fontSize: 'var(--text-2xs)', fontWeight: 600, color: 'var(--text-muted)' }}>{label}</span>{children}</label>;
  }

  function InterventionSheet({ s, onClose }) {
    const inv = s.invoice, blocked = !s.readiness.ready;
    return (
      <Sheet title="Configuración y conciliación" onClose={onClose}>
        <div style={{ display: 'grid', gap: 13 }}>
          <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.55 }}>Úsalo sólo para registrar una respuesta validada, corregir trazabilidad o conciliar con el estado legal del SRI.</p>
          {inv.rejection && (
            <div style={{ background: 'var(--danger-soft)', borderRadius: 'var(--radius-xs)', padding: 11, display: 'grid', gap: 3 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', fontWeight: 700, color: 'var(--on-danger-soft)' }}>SRI · cód. {inv.rejection.code} · {inv.rejection.field}</span>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)' }}>{inv.rejection.message}</span>
            </div>
          )}
          <Field label="Estado electrónico"><select style={inputStyle} defaultValue={inv.electronicStatus}><option value="pending_submission">Pendiente de envío</option><option value="submitted">Enviado al SRI</option><option value="authorized">Autorizada</option><option value="rejected">Rechazada</option></select></Field>
          <Field label="Clave de acceso (49 dígitos)"><input style={{ ...inputStyle, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)' }} placeholder="Vacía → la genera el backend" defaultValue={inv.accessKey || ''} /></Field>
          <Field label="N.º de autorización"><input style={{ ...inputStyle, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)' }} placeholder="Número de autorización SRI" defaultValue={inv.authorizationNumber || ''} /></Field>
          <Field label="Mensaje del SRI"><textarea style={{ ...inputStyle, height: 60, padding: '9px 11px', resize: 'vertical' }} defaultValue={inv.rejection ? inv.rejection.message : ''} /></Field>
          <Btn variant="secondary" size="sm" full leading="check" disabled={blocked}>Actualizar estado electrónico</Btn>
          <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', lineHeight: 1.45 }}>Deja la clave vacía para que el backend la componga desde el perfil fiscal y la numeración Ecuador.</span>
        </div>
      </Sheet>
    );
  }

  function FallbackSheet({ s, onClose }) {
    const inv = s.invoice, staged = s.fallbackXmlReady;
    return (
      <Sheet title="Sandbox real / fallback técnico" onClose={onClose}>
        <div style={{ display: 'grid', gap: 13 }}>
          <div style={{ display: 'inline-flex' }}><Pill tone={staged ? 'info' : 'neutral'} dot>Ruta avanzada · secundaria</Pill></div>
          <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.55 }}>Para validar sandbox con una firma generada fuera del sistema. <strong style={{ color: 'var(--text)' }}>No es la ruta principal del operador.</strong></p>
          <Field label="Signer name"><input style={inputStyle} placeholder="sandbox-signer externo" defaultValue={s.presigned ? s.presigned.signerName : ''} /></Field>
          <Field label="Signed XML"><textarea style={{ ...inputStyle, height: 80, padding: '9px 11px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', resize: 'vertical', lineHeight: 1.5 }} placeholder="<factura ...><ds:Signature>...</ds:Signature></factura>" defaultValue={s.presigned ? s.presigned.xmlPreview : ''} /></Field>
          <Btn variant="secondary" size="sm" full leading="send" disabled={!staged}>Enviar XML prefirmado</Btn>
        </div>
      </Sheet>
    );
  }

  function MTrace({ s }) {
    const [open, setOpen] = useState(false);
    if (!s.events || s.events.length === 0) return null;
    return (
      <MCard quiet style={{ overflow: 'hidden' }}>
        <button className="ds-focusable" onClick={() => setOpen((o) => !o)} aria-expanded={open} style={{ width: '100%', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 11, padding: '13px 14px', background: 'var(--surface-sunken)', border: 'none' }}>
          <span style={{ width: 28, height: 28, flex: 'none', borderRadius: 'var(--radius-xs)', display: 'grid', placeItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}><Icon name="history" size={15} /></span>
          <div style={{ flex: 1 }}>
            <div className="ds-eyebrow">Evidencia técnica</div>
            <strong style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)' }}>Historial técnico SRI</strong>
          </div>
          <Pill tone="neutral">{s.events.length}</Pill>
          <span style={{ display: 'inline-flex', color: 'var(--text-muted)', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}><Icon name="chevronDown" size={16} /></span>
        </button>
        {open && (
          <div style={{ padding: '12px 14px', display: 'grid', gap: 12 }}>
            {s.events.map((e) => {
              const tone = e.providerStatus === 'AUTORIZADO' ? 'success' : e.providerStatus === 'NO AUTORIZADO' ? 'danger' : e.type === 'submission' ? 'info' : 'warning';
              return (
                <div key={e.id} style={{ display: 'grid', gap: 4, paddingBottom: 12, borderBottom: '1px solid var(--divider)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                    <Pill tone={tone} dot>{e.providerStatus}</Pill>
                    <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}>{e.occurredAt}</span>
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-strong)', fontWeight: 500, lineHeight: 1.45 }}>{e.message}</div>
                  {e.sriDiagnostics && e.sriDiagnostics.summary && <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>Diagnóstico: {e.sriDiagnostics.summary}</div>}
                  {e.soapAction && <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}>SOAP {e.soapAction}{e.submissionReference ? ' · ' + e.submissionReference : ''}</div>}
                </div>
              );
            })}
            <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', lineHeight: 1.45 }}>Evidencia para soporte y diagnóstico. No es el flujo de trabajo principal.</span>
          </div>
        )}
      </MCard>
    );
  }

  function MobileSRIScreen({ d, stateKey, mood, onMood }) {
    const s = d.scenarios[stateKey];
    const inv = s.invoice, meta = ELEC[inv.electronicStatus];
    const unsupported = !s.support.submitSupported;
    const [sheet, setSheet] = useState(null);

    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--app-bg)', position: 'relative', overflow: 'hidden' }}>
        <MobileTopBar tenant={d.tenant} onTenant={() => setSheet('tenant')} onMood={() => setSheet('mood')} onAssistant={() => setSheet('assistant')} />
        {/* detail sub-header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', flex: 'none' }}>
          <span style={{ color: 'var(--text-muted)', display: 'inline-flex' }}><Icon name="arrowLeft" size={18} /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>{inv.number}</div>
            <strong style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)' }}>Autorización SRI</strong>
          </div>
          <Pill tone={meta.tone} dot>{meta.label}</Pill>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'grid', gap: 13, alignContent: 'start' }}>
          {/* invoice mini */}
          <MCard style={{ padding: 13, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inv.customer}</div>
              <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>RUC {inv.customerRuc}</div>
            </div>
            <div className="ds-tnum" style={{ fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' }}>{money(inv.totalInCents, inv.currency)}</div>
          </MCard>

          {/* immediate status */}
          <Triad s={s} />

          {/* lifecycle bar */}
          <MCard style={{ padding: 14 }}><StepsBar status={inv.electronicStatus} /></MCard>

          {unsupported && <Banner tone="warning" icon="shieldAlert" title={'Tipo: ' + s.support.label}>{s.support.detail}</Banner>}

          {inv.electronicStatus === 'authorized' && (
            <MCard style={{ overflow: 'hidden' }}>
              {[['Clave de acceso', inv.accessKey], ['N.º de autorización', inv.authorizationNumber]].map(([l, v], i) => (
                <div key={l} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, padding: '11px 13px', borderBottom: i === 0 ? '1px solid var(--divider)' : 'none' }}>
                  <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', flex: 'none' }}>{l}</span>
                  <CopyValue value={v} ariaLabel={'Copiar ' + l} />
                </div>
              ))}
            </MCard>
          )}

          {/* recommended next step */}
          <NextStep s={s} onIntervene={() => setSheet('intervene')} />

          {/* advanced controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 2 }}>
            <span className="ds-eyebrow">Controles avanzados</span>
            <span style={{ flex: 1, height: 1, background: 'var(--divider)' }} />
          </div>
          <DiscloseCard icon="wrench" title="Configuración y conciliación"
            summary={!s.readiness.ready ? 'Necesita intervención antes de operar.' : 'Entra sólo si vas a conciliar o corregir.'}
            pill={!s.readiness.ready ? { tone: 'warning', label: 'Atención' } : { tone: 'success', label: 'Compacto' }}
            onOpen={() => setSheet('intervene')} />
          <DiscloseCard icon="route" title="Sandbox real / fallback técnico"
            summary={s.fallbackXmlReady ? 'XML prefirmado listo para sandbox.' : 'Ruta reservada para pruebas avanzadas.'}
            pill={{ tone: s.fallbackXmlReady ? 'info' : 'neutral', label: 'Avanzado' }} advanced
            onOpen={() => setSheet('fallback')} />

          {/* quiet technical trace */}
          <MTrace s={s} />
        </div>

        {sheet === 'intervene' && <InterventionSheet s={s} onClose={() => setSheet(null)} />}
        {sheet === 'fallback' && <FallbackSheet s={s} onClose={() => setSheet(null)} />}
        {sheet === 'mood' && <Sheet title="Design mood" onClose={() => setSheet(null)}><window.UI.MoodMenu value={mood} onChange={onMood} moods={d.moods} /></Sheet>}
        {sheet === 'tenant' && <Sheet title="Cambiar empresa" onClose={() => setSheet(null)}>
          <div style={{ display: 'grid', gap: 8 }}>
            {d.memberships.map((m) => <div key={m.slug} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, borderRadius: 'var(--radius-sm)', border: '1px solid ' + (m.slug === d.tenant.slug ? 'var(--primary)' : 'var(--border)'), background: m.slug === d.tenant.slug ? 'var(--primary-soft)' : 'var(--surface)' }}>
              <div style={{ flex: 1 }}><div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)' }}>{m.name}</div><div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>{m.role}</div></div>
              {m.slug === d.tenant.slug && <Icon name="check" size={16} style={{ color: 'var(--primary)' }} />}
            </div>)}
          </div>
        </Sheet>}
        {sheet === 'assistant' && <Sheet title="Asistente IA" onClose={() => setSheet(null)}>
          <div style={{ display: 'grid', gap: 12 }}>
            <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text)', lineHeight: 1.5 }}>{d.assistant.greeting}</p>
            {d.assistant.suggestions.map((sg, i) => <div key={i} style={{ background: 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 13, display: 'grid', gap: 8 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ width: 28, height: 28, flex: 'none', borderRadius: 'var(--radius-xs)', display: 'grid', placeItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', color: toneColor(sg.tone) }}><Icon name={sg.icon} size={15} /></span>
                <div style={{ flex: 1 }}><div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)', lineHeight: 1.35 }}>{sg.title}</div><div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.45 }}>{sg.body}</div></div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}><Btn variant="secondary" size="sm">{sg.action}</Btn><Btn variant="ghost" size="sm">Descartar</Btn></div>
            </div>)}
            <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', lineHeight: 1.45 }}>{d.assistant.disclaimer}</div>
          </div>
        </Sheet>}
      </div>
    );
  }

  window.MobileSRI = { MobileSRIScreen };
})();
