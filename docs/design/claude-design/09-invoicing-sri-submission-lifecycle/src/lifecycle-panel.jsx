/* Desktop — Invoicing SRI Submission Lifecycle (slice 09). An SRI control tower
   with one safe recommendation at a time. Hierarchy (handoff):
     1 legal verdict header (what the status legally means)
     2 lifecycle stepper: Preparado → Enviado al SRI → Autorizado
     3 one recommended next step (single primary action)
     4 compact evidence: clave de acceso · No. autorización · enviado
     5 blocker / SRI message when relevant
     6 advanced disclosure: intervención manual / conciliación
     7 advanced disclosure: fallback XML prefirmado
     8 quiet technical trace (historial técnico)
   CRITICAL: "Enviado" ≠ "Autorizado". Authorized verdict/evidence only when
   invoice.electronicStatus === 'authorized' (backend-confirmed). window.Lifecycle. */
(function () {
  var useState = React.useState;
  var I = window.Icon;
  var UI = window.UI;
  var Btn = UI.Btn, Pill = UI.Pill, Banner = UI.Banner;
  var D = window.LIFECYCLE_DATA;

  var MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  function fmtDateTime(iso) { if (!iso) return '—'; var m = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/.exec(iso); if (!m) return iso; return parseInt(m[3], 10) + ' ' + MONTHS[parseInt(m[2], 10) - 1] + ' ' + m[1] + ' · ' + m[4] + ':' + m[5]; }

  /* legal status vocabulary */
  var STATUS = {
    pending_submission: { tone: 'neutral', label: 'Pendiente de envío', legal: 'El comprobante aún no se ha enviado al SRI. No tiene validez electrónica todavía.' },
    submitted: { tone: 'warning', label: 'Enviado al SRI', legal: 'El SRI recibió el comprobante y lo está procesando. Enviado NO significa autorizado — la validez legal llega solo con la autorización.' },
    authorized: { tone: 'success', label: 'Autorizado por el SRI', legal: 'El comprobante es legalmente válido. Conserva la clave de acceso y el número de autorización para soporte, contabilidad y tributación.' },
    rejected: { tone: 'danger', label: 'Devuelto por el SRI', legal: 'El SRI devolvió el comprobante con observaciones. No es válido hasta corregir la causa y autorizarlo.' }
  };

  /* ---------- recommended next step (mirrors buildNextStep in the repo) -- */
  function deriveNextStep(s) {
    var inv = s.invoice; var status = inv.electronicStatus;
    var unsupported = s.documentSupport && !s.documentSupport.submitSupported;
    var readinessBlocked = !s.canSubmit;
    var draft = inv.status === 'draft';

    if (draft) return { tone: 'warning', pill: 'Borrador', icon: 'fileText', title: 'Primero emite la factura', desc: 'La factura sigue en borrador. Emítela (sal del borrador) antes de operar el ciclo electrónico del SRI.', primary: { label: 'Ir a revisión del documento', icon: 'arrowRight', kind: 'nav' }, secondary: { label: 'Ver XML preliminar', handler: 'onLoadXmlPreview' } };
    if (unsupported) return { tone: 'warning', pill: 'Compatibilidad', icon: 'gitBranch', title: 'Este comprobante no sigue la ruta automática del SRI', desc: (s.documentSupportDetail || 'El tipo de documento aún necesita una ruta alternativa.') + ' El carril normal queda en pausa.', primary: { label: 'Ver fallback técnico', icon: 'gitBranch', kind: 'open-fallback' }, secondary: { label: 'Ver XML preliminar', handler: 'onLoadXmlPreview' } };
    if (readinessBlocked) return { tone: 'danger', pill: 'Bloqueado', icon: 'alert', title: 'Resuelve el bloqueo de preparación', desc: (s.documentSupportDetail || 'Hay un bloqueo activo en el carril electrónico (firma o gateway).') + ' Pausamos las acciones que darían una falsa sensación de autorización.', primary: { label: 'Revisar intervención', icon: 'wrench', kind: 'open-manual' }, secondary: { label: 'Ver XML preliminar', handler: 'onLoadXmlPreview' } };
    if (status === 'submitted') return { tone: 'warning', pill: 'En seguimiento', icon: 'refreshCw', title: 'El SRI está procesando el comprobante', desc: 'El SRI ya recibió el comprobante. El siguiente paso correcto es consultar la autorización. Todavía no debe tratarse como autorizado.', primary: { label: 'Consultar autorización', icon: 'refreshCw', handler: 'onCheckAuthorization' }, secondary: { label: 'Revisar intervención', kind: 'open-manual' } };
    if (status === 'authorized') return { tone: 'success', pill: 'Autorizado', icon: 'shieldCheck', title: 'El comprobante ya fue autorizado por el SRI', desc: 'Es legalmente válido. Mantén visibles la clave de acceso y el número de autorización para soporte, contabilidad y tributación.', primary: { label: 'Ver XML autorizado', icon: 'fileCode', handler: 'onLoadXmlPreview' }, secondary: { label: 'Ver detalle SRI', kind: 'open-manual' } };
    if (status === 'rejected') return { tone: 'danger', pill: 'Rechazado', icon: 'alert', title: 'El SRI devolvió este comprobante', desc: 'Revisa la observación del SRI, documenta la causa y recién después regenera el artefacto correcto.', primary: { label: 'Revisar observación', icon: 'wrench', kind: 'open-manual' }, secondary: { label: 'Ver XML preliminar', handler: 'onLoadXmlPreview' } };
    return { tone: 'primary', pill: 'Listo para enviar', icon: 'send', title: 'Tu siguiente paso es enviar al SRI', desc: 'La firma, el gateway y la numeración ya permiten avanzar. Firma y envía el comprobante al SRI.', primary: { label: 'Firmar y enviar al SRI', icon: 'send', handler: 'onSubmitElectronicDocument' }, secondary: { label: 'Ver XML preliminar', handler: 'onLoadXmlPreview' } };
  }

  function CopyCard(props) {
    var st = useState(false); var copied = st[0], setCopied = st[1];
    var disabled = !props.value || props.value === '—';
    return React.createElement('div', { style: { background: 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '11px 13px', display: 'grid', gap: 5, minWidth: 0 } },
      React.createElement('span', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--text-subtle)' } }, props.label),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
        React.createElement('span', { style: { flex: 1, minWidth: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-strong)', wordBreak: 'break-all', lineHeight: 1.4 } }, props.value),
        !disabled && React.createElement('button', { className: 'ds-focusable', title: 'Copiar', onClick: function () { setCopied(true); setTimeout(function () { setCopied(false); }, 1300); }, style: { flex: 'none', background: 'transparent', border: 'none', cursor: 'pointer', color: copied ? 'var(--success)' : 'var(--text-subtle)', display: 'inline-flex', padding: 2 } }, I({ name: copied ? 'check' : 'copy', size: 14 }))));
  }

  /* ===================================================== 1 · VERDICT HEADER */
  function VerdictHeader(props) {
    var s = props.s; var inv = s.invoice; var meta = STATUS[inv.electronicStatus] || STATUS.pending_submission;
    return React.createElement('div', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 16, padding: '18px var(--card-pad)', borderLeft: '4px solid var(--' + meta.tone + ')', background: 'var(--' + meta.tone + '-soft)' } },
        React.createElement('span', { style: { width: 48, height: 48, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: 'var(--surface)', color: 'var(--' + meta.tone + ')', border: '1px solid var(--' + meta.tone + ')' } }, I({ name: inv.electronicStatus === 'authorized' ? 'shieldCheck' : inv.electronicStatus === 'rejected' ? 'ban' : inv.electronicStatus === 'submitted' ? 'refreshCw' : 'send', size: 24 })),
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('div', { className: 'ds-eyebrow', style: { color: 'var(--on-' + meta.tone + '-soft)' } }, 'Estado legal ante el SRI'),
          React.createElement('h2', { style: { margin: '2px 0 0', fontSize: 'var(--text-h1)', fontWeight: 800, letterSpacing: 'var(--track-snug)', color: 'var(--text-strong)' } }, meta.label),
          React.createElement('p', { style: { margin: '3px 0 0', fontSize: 'var(--text-sm)', color: 'var(--on-' + meta.tone + '-soft)', maxWidth: 640, lineHeight: 'var(--leading-body)' } }, meta.legal)),
        React.createElement('div', { style: { flex: 'none', textAlign: 'right' } },
          React.createElement('div', { style: { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)', whiteSpace: 'nowrap' } }, inv.number),
          React.createElement('div', { style: { fontSize: 'var(--text-2xs)', color: 'var(--on-' + meta.tone + '-soft)', marginTop: 2 } }, (inv.documentCode || '01') + ' · Factura'))));
  }

  /* ===================================================== 2 · STEPPER */
  function Stepper(props) {
    var status = props.status;
    var current = status === 'authorized' ? 2 : (status === 'submitted' || status === 'rejected') ? 1 : 0;
    var rejected = status === 'rejected';
    var steps = ['Preparado', 'Enviado al SRI', 'Autorizado'];
    return React.createElement('div', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: '16px var(--card-pad)' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 } },
        React.createElement('span', { className: 'ds-eyebrow', style: { color: 'var(--text-subtle)' } }, 'Ciclo de vida'),
        React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' } }, 'No se marca autorizado hasta confirmación del SRI')),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 0 } },
        steps.map(function (label, i) {
          var isRejected = rejected && i === 1;
          var done = i < current; var isCurrent = i === current;
          var tone = isRejected ? 'danger' : done ? 'success' : isCurrent ? 'warning' : 'neutral';
          var col = 'var(--' + (tone === 'neutral' ? 'text-subtle' : tone) + ')';
          return React.createElement(React.Fragment, { key: label },
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 11, flex: 'none' } },
              React.createElement('span', { style: { width: 36, height: 36, flex: 'none', borderRadius: 999, display: 'grid', placeItems: 'center', fontSize: 'var(--text-sm)', fontWeight: 700, background: (done || isCurrent || isRejected) ? col : 'var(--surface-sunken)', color: (done || isCurrent || isRejected) ? '#fff' : 'var(--text-subtle)', border: (done || isCurrent || isRejected) ? 'none' : '1px solid var(--border-strong)' } },
                isRejected ? '!' : done ? I({ name: 'check', size: 17 }) : (i + 1)),
              React.createElement('span', { style: { display: 'grid', gap: 1 } },
                React.createElement('span', { style: { fontSize: 'var(--text-sm)', fontWeight: 700, color: (done || isCurrent || isRejected) ? 'var(--text-strong)' : 'var(--text-muted)' } }, isRejected ? 'Devuelto' : label),
                isCurrent && !isRejected && React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: col, fontWeight: 600 } }, 'En curso'))),
            i < steps.length - 1 && React.createElement('span', { style: { flex: 1, height: 2, margin: '0 14px', borderRadius: 2, background: i < current ? 'var(--success)' : 'var(--divider)' } }));
        })));
  }

  /* ===================================================== 3 · NEXT STEP */
  function NextStep(props) {
    var step = props.step, s = props.s, canManage = props.canManage, run = props.run;
    var loadingMap = { onSubmitElectronicDocument: 'submit-invoice-electronic-document', onCheckAuthorization: 'check-invoice-electronic-authorization', onLoadXmlPreview: 'load-invoice-xml-preview' };
    var primaryLoading = step.primary.handler && s.actionLoading === loadingMap[step.primary.handler];
    var primaryLabel = primaryLoading ? (step.primary.handler === 'onSubmitElectronicDocument' ? 'Firmando y enviando…' : step.primary.handler === 'onCheckAuthorization' ? 'Consultando…' : 'Cargando XML…') : step.primary.label;
    return React.createElement('div', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: '4px solid var(--' + step.tone + ')', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: '18px var(--card-pad)' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 } },
        React.createElement('span', { className: 'ds-eyebrow', style: { color: 'var(--text-subtle)', flex: 1 } }, 'Siguiente paso recomendado'),
        React.createElement(Pill, { tone: step.tone === 'primary' ? 'info' : step.tone, dot: true }, step.pill)),
      React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 14 } },
        React.createElement('span', { style: { width: 38, height: 38, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: 'var(--' + (step.tone === 'primary' ? 'primary' : step.tone) + '-soft)', color: 'var(--' + (step.tone === 'primary' ? 'primary' : step.tone) + ')' } }, I({ name: step.icon, size: 19 })),
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('h3', { style: { margin: 0, fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' } }, step.title),
          React.createElement('p', { style: { margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 'var(--leading-body)', maxWidth: 640 } }, step.desc),
          React.createElement('div', { style: { display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' } },
            canManage
              ? React.createElement(Btn, { variant: 'primary', leading: primaryLoading ? null : step.primary.icon, disabled: !!primaryLoading, onClick: function () { run(step.primary); } }, primaryLabel)
              : React.createElement(Btn, { variant: 'secondary', leading: 'lock', disabled: true }, 'Solo lectura'),
            step.secondary && React.createElement(Btn, { variant: 'ghost', onClick: function () { run(step.secondary); } }, step.secondary.label)))));
  }

  /* ===================================================== 4 · EVIDENCE */
  function Evidence(props) {
    var s = props.s; var inv = s.invoice;
    var authorized = inv.electronicStatus === 'authorized';
    var hasAny = inv.accessKey || inv.authorizationNumber || inv.submittedAt;
    if (!hasAny) return null;
    return React.createElement('div', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--card-pad)' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 } },
        React.createElement('span', { style: { color: 'var(--text-muted)', display: 'inline-flex' } }, I({ name: 'scan', size: 16 })),
        React.createElement('h3', { style: { margin: 0, flex: 1, fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Evidencia'),
        authorized ? React.createElement(Pill, { tone: 'success', dot: true }, 'Autorizado') : React.createElement(Pill, { tone: 'warning', dot: true }, 'En proceso')),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 } },
        React.createElement(CopyCard, { label: 'Clave de acceso', value: inv.accessKey || '—' }),
        React.createElement(CopyCard, { label: 'No. autorización', value: authorized ? (inv.authorizationNumber || 'Sin número registrado') : 'Disponible al autorizar' })),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 } },
        React.createElement('div', { style: { display: 'grid', gap: 3 } },
          React.createElement('span', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--text-subtle)' } }, 'Enviado'),
          React.createElement('span', { style: { fontSize: 'var(--text-sm)', color: 'var(--text-strong)', fontWeight: 500 } }, fmtDateTime(inv.submittedAt))),
        React.createElement('div', { style: { display: 'grid', gap: 3 } },
          React.createElement('span', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--text-subtle)' } }, authorized ? 'Autorizado' : 'Referencia de envío'),
          React.createElement('span', { style: { fontSize: 'var(--text-sm)', color: 'var(--text-strong)', fontWeight: 500, fontFamily: authorized ? 'inherit' : 'var(--font-mono)' } }, authorized ? fmtDateTime(inv.authorizedAt) : (inv.submissionReference || '—')))));
  }

  /* ===================================================== 5 · SRI MESSAGE */
  function SriMessage(props) {
    var inv = props.s.invoice;
    if (inv.electronicStatus !== 'rejected' || !inv.electronicStatusMessage) return null;
    return React.createElement('div', { style: { background: 'var(--danger-soft)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-md)', padding: 'var(--card-pad)' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 12 } },
        React.createElement('span', { style: { color: 'var(--danger)', flex: 'none', display: 'inline-flex', marginTop: 1 } }, I({ name: 'alert', size: 19 })),
        React.createElement('div', null,
          React.createElement('div', { className: 'ds-eyebrow', style: { color: 'var(--on-danger-soft)' } }, 'Observación del SRI'),
          React.createElement('p', { style: { margin: '3px 0 0', fontSize: 'var(--text-sm)', color: 'var(--on-danger-soft)', lineHeight: 1.5 } }, inv.electronicStatusMessage),
          React.createElement('p', { style: { margin: '8px 0 0', fontSize: 'var(--text-2xs)', color: 'var(--on-danger-soft)', opacity: 0.85 } }, 'Documenta la causa en intervención manual antes de regenerar el comprobante.'))));
  }

  /* ===================================================== 6/7 · ADVANCED disclosures */
  function Disclosure(props) {
    var open = props.open, setOpen = props.setOpen;
    return React.createElement('div', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' } },
      React.createElement('button', { className: 'ds-focusable', onClick: function () { setOpen(!open); }, 'aria-expanded': open,
        style: { display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', padding: '14px var(--card-pad)' } },
        React.createElement('span', { style: { width: 32, height: 32, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: 'var(--surface-sunken)', color: 'var(--text-muted)' } }, I({ name: props.icon, size: 16 })),
        React.createElement('span', { style: { flex: 1, minWidth: 0 } },
          React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
            React.createElement('span', { style: { fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' } }, props.title),
            React.createElement(Pill, { tone: props.badgeTone || 'neutral' }, props.badge || 'Avanzado')),
          React.createElement('span', { style: { display: 'block', fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', marginTop: 2 } }, props.sub)),
        React.createElement('span', { style: { color: 'var(--text-subtle)', display: 'inline-flex', transition: 'var(--transition-base)', transform: open ? 'rotate(180deg)' : 'none' } }, I({ name: 'chevronDown', size: 18 }))),
      open && React.createElement('div', { style: { padding: '0 var(--card-pad) var(--card-pad)', borderTop: '1px solid var(--divider)' } }, React.createElement('div', { style: { paddingTop: 16 } }, props.children)));
  }

  function FieldLabel(props) { return React.createElement('span', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--text-subtle)' } }, props.children); }
  function inputStyle(disabled) { return { height: 'var(--control-h)', padding: '0 12px', background: disabled ? 'var(--surface-sunken)' : 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', font: 'inherit', fontSize: 'var(--text-sm)', color: 'var(--text-strong)', outline: 'none', width: '100%', boxSizing: 'border-box' }; }

  function ManualPanel(props) {
    var s = props.s, f = props.form, set = props.set, canManage = props.canManage;
    var inv = s.invoice;
    var loading = s.actionLoading === 'invoice-electronic-status';
    var disabled = !canManage || inv.status === 'draft' || !s.canSubmit;
    return React.createElement('div', { style: { display: 'grid', gap: 14 } },
      React.createElement('p', { style: { margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.55 } }, 'Usa este bloque para registrar una respuesta validada del SRI, corregir trazabilidad o conciliar una factura ya emitida. No es la operación diaria.'),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 } },
        React.createElement('label', { style: { display: 'grid', gap: 6 } }, React.createElement(FieldLabel, null, 'Estado'),
          React.createElement('select', { value: f.electronicStatus, disabled: disabled, onChange: function (e) { set('electronicStatus', e.target.value); }, style: inputStyle(disabled) },
            React.createElement('option', { value: 'pending_submission' }, 'Pendiente de envío'),
            React.createElement('option', { value: 'submitted' }, 'Enviado al SRI'),
            React.createElement('option', { value: 'authorized' }, 'Autorizada'),
            React.createElement('option', { value: 'rejected' }, 'Rechazada'))),
        React.createElement('label', { style: { display: 'grid', gap: 6 } }, React.createElement(FieldLabel, null, 'Fecha autorización'),
          React.createElement('input', { type: 'datetime-local', value: f.authorizedAt, disabled: disabled, onChange: function (e) { set('authorizedAt', e.target.value); }, style: inputStyle(disabled) }))),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 } },
        React.createElement('label', { style: { display: 'grid', gap: 6 } }, React.createElement(FieldLabel, null, 'Clave de acceso'),
          React.createElement('input', { value: f.accessKey, disabled: disabled, placeholder: '49 dígitos', onChange: function (e) { set('accessKey', e.target.value); }, style: Object.assign(inputStyle(disabled), { fontFamily: 'var(--font-mono)' }) })),
        React.createElement('label', { style: { display: 'grid', gap: 6 } }, React.createElement(FieldLabel, null, 'No. autorización'),
          React.createElement('input', { value: f.authorizationNumber, disabled: disabled, placeholder: 'Número de autorización SRI', onChange: function (e) { set('authorizationNumber', e.target.value); }, style: Object.assign(inputStyle(disabled), { fontFamily: 'var(--font-mono)' }) }))),
      React.createElement('label', { style: { display: 'grid', gap: 6 } }, React.createElement(FieldLabel, null, 'Mensaje SRI'),
        React.createElement('textarea', { value: f.electronicStatusMessage, disabled: disabled, rows: 2, placeholder: 'Detalle técnico o comercial del estado electrónico', onChange: function (e) { set('electronicStatusMessage', e.target.value); }, style: Object.assign(inputStyle(disabled), { height: 'auto', padding: '10px 12px', lineHeight: 1.5, resize: 'vertical' }) })),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' } },
        canManage ? React.createElement(Btn, { variant: 'secondary', leading: loading ? null : 'wrench', disabled: disabled || loading }, loading ? 'Actualizando…' : 'Actualizar estado electrónico') : React.createElement(Btn, { variant: 'secondary', leading: 'lock', disabled: true }, 'Solo lectura'),
        React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', flex: 1, minWidth: 200, lineHeight: 1.5 } }, 'Deja vacía la clave para que el backend la genere desde el perfil fiscal y la numeración.')));
  }

  function FallbackPanel(props) {
    var s = props.s, f = props.form, set = props.set, canManage = props.canManage;
    var inv = s.invoice;
    var disabled = !canManage || inv.status === 'draft' || !s.canSubmit;
    var subLoading = s.actionLoading === 'submit-presigned-invoice-electronic-document';
    return React.createElement('div', { style: { display: 'grid', gap: 14 } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 10, padding: '11px 13px', borderRadius: 'var(--radius-sm)', background: 'var(--warning-soft)', color: 'var(--on-warning-soft)' } },
        React.createElement('span', { style: { color: 'var(--warning)', flex: 'none', display: 'inline-flex' } }, I({ name: 'gitBranch', size: 16 })),
        React.createElement('span', { style: { fontSize: 'var(--text-xs)', lineHeight: 1.45 } }, 'Ruta secundaria para validar sandbox con una firma externa real mientras la firma XAdES nativa evoluciona. No es la ruta principal del operador.')),
      React.createElement('label', { style: { display: 'grid', gap: 6 } }, React.createElement(FieldLabel, null, 'Signer name'),
        React.createElement('input', { value: f.presignedSignerName, disabled: disabled, placeholder: 'sandbox-signer o nombre del firmador externo', onChange: function (e) { set('presignedSignerName', e.target.value); }, style: inputStyle(disabled) })),
      React.createElement('label', { style: { display: 'grid', gap: 6 } }, React.createElement(FieldLabel, null, 'Signed XML'),
        React.createElement('textarea', { value: f.presignedXml, disabled: disabled, rows: 3, placeholder: '<factura …><ds:Signature>…</ds:Signature></factura>', onChange: function (e) { set('presignedXml', e.target.value); }, style: Object.assign(inputStyle(disabled), { height: 'auto', padding: '10px 12px', lineHeight: 1.5, resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }) })),
      React.createElement('div', { style: { display: 'flex', gap: 10, flexWrap: 'wrap' } },
        React.createElement(Btn, { variant: 'secondary', size: 'sm', disabled: disabled }, 'Firmar y enviar (stub)'),
        React.createElement(Btn, { variant: 'secondary', size: 'sm', disabled: disabled || inv.electronicStatus !== 'submitted' }, 'Consultar autorización (stub)'),
        React.createElement(Btn, { variant: 'ghost', size: 'sm', leading: subLoading ? null : 'send', disabled: disabled || !f.presignedXml.trim() || subLoading }, subLoading ? 'Enviando…' : 'Enviar XML prefirmado')));
  }

  /* ===================================================== 8 · TECHNICAL TRACE */
  function providerTone(status) {
    var l = (status || '').toLowerCase();
    if (l.indexOf('autoriz') >= 0 || l.indexOf('ok') >= 0) return 'success';
    if (l.indexOf('rechaz') >= 0 || l.indexOf('devuel') >= 0 || l.indexOf('error') >= 0) return 'danger';
    if (l.indexOf('pend') >= 0 || l.indexOf('proc') >= 0 || l.indexOf('recib') >= 0) return 'warning';
    return 'neutral';
  }
  function TracePanel(props) {
    var s = props.s; var inv = s.invoice;
    var st = useState(props.defaultOpen); var open = st[0], setOpen = st[1];
    if (!inv.electronicEvents || inv.electronicEvents.length === 0) return null;
    return React.createElement('div', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' } },
      React.createElement('button', { className: 'ds-focusable', onClick: function () { setOpen(!open); }, 'aria-expanded': open,
        style: { display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', padding: '14px var(--card-pad)' } },
        React.createElement('span', { style: { width: 32, height: 32, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: 'var(--surface-sunken)', color: 'var(--text-muted)' } }, I({ name: 'clockHistory', size: 16 })),
        React.createElement('span', { style: { flex: 1, minWidth: 0 } },
          React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
            React.createElement('span', { style: { fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Historial técnico'),
            React.createElement(Pill, { tone: 'neutral' }, inv.electronicEvents.length + (inv.electronicEvents.length === 1 ? ' evento' : ' eventos'))),
          React.createElement('span', { style: { display: 'block', fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', marginTop: 2 } }, 'Evidencia técnica para soporte y diagnóstico — no compite con la operación diaria.')),
        React.createElement('span', { style: { color: 'var(--text-subtle)', display: 'inline-flex', transform: open ? 'rotate(180deg)' : 'none', transition: 'var(--transition-base)' } }, I({ name: 'chevronDown', size: 18 }))),
      open && React.createElement('div', { style: { padding: '0 var(--card-pad) var(--card-pad)', borderTop: '1px solid var(--divider)' } },
        React.createElement('div', { style: { display: 'grid', gap: 10, paddingTop: 14 } }, inv.electronicEvents.map(function (ev) { return TraceEventCard(ev); }))));
  }

  function TraceEventCard(ev) {
    var children = [
      React.createElement('div', { key: 'h', style: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 } },
        React.createElement('span', { key: 't', style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', flex: 1 } }, ev.eventType === 'submission' ? 'Envío' : 'Consulta de autorización'),
        React.createElement(Pill, { key: 'p', tone: providerTone(ev.providerStatus), dot: true }, ev.providerStatus)),
      React.createElement('div', { key: 'pr', style: { fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)' } }, ev.provider),
      React.createElement('div', { key: 'dt', style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', marginTop: 2 } }, fmtDateTime(ev.occurredAt)),
      React.createElement('p', { key: 'm', style: { margin: '6px 0 0', fontSize: 'var(--text-xs)', color: 'var(--text)', lineHeight: 1.45 } }, ev.message)
    ];
    if (ev.sriDiagnostics && ev.sriDiagnostics.summary) children.push(React.createElement('div', { key: 'sm', style: { marginTop: 6, fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' } }, 'Diagnóstico SRI: ' + ev.sriDiagnostics.summary));
    if (ev.submissionReference) children.push(React.createElement('div', { key: 'rf', style: { marginTop: 4, fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' } }, 'Ref: ' + ev.submissionReference));
    if (ev.sriDiagnostics && ev.sriDiagnostics.messages && ev.sriDiagnostics.messages.length > 0) {
      var msgs = ev.sriDiagnostics.messages.map(function (m, mi) {
        var rows = [
          React.createElement('div', { key: 'id', style: { fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)' } }, m.identifier ? ('Identificador ' + m.identifier) : 'Mensaje SRI'),
          React.createElement('div', { key: 'msg', style: { fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-strong)', marginTop: 2 } }, m.message)
        ];
        m.additionalInfo.forEach(function (d, di) { rows.push(React.createElement('div', { key: 'd' + di, style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', marginTop: 2 } }, d)); });
        return React.createElement('div', { key: mi, style: { padding: '8px 10px', borderRadius: 'var(--radius-xs)', background: 'var(--surface)', border: '1px solid var(--border)' } }, rows);
      });
      children.push(React.createElement('div', { key: 'msgs', style: { marginTop: 8, display: 'grid', gap: 6 } }, msgs));
    }
    return React.createElement('div', { key: ev.id, style: { border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 13px', background: 'var(--surface-sunken)' } }, children);
  }

  /* ===================================================== EMPTY / PAGE */
  function NoInvoice() {
    return React.createElement('div', { style: { padding: 'var(--gutter)', maxWidth: 1040, margin: '0 auto' } },
      React.createElement('div', { style: { display: 'grid', gap: 16, justifyItems: 'center', textAlign: 'center', padding: '80px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' } },
        React.createElement('span', { style: { width: 60, height: 60, borderRadius: 'var(--radius-md)', display: 'grid', placeItems: 'center', background: 'var(--surface-sunken)', color: 'var(--text-subtle)' } }, I({ name: 'send', size: 26 })),
        React.createElement('div', { style: { maxWidth: 420 } },
          React.createElement('h2', { style: { margin: 0, fontSize: 'var(--text-h2)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Selecciona una factura'),
          React.createElement('p', { style: { margin: '8px 0 0', fontSize: 'var(--text-body)', color: 'var(--text-muted)', lineHeight: 1.55 } }, 'Elige una factura emitida para ver y operar su ciclo de autorización ante el SRI, un paso seguro a la vez.'))));
  }

  function DesktopLifecycle(props) {
    var s = props.s;
    var canManage = s.permission.canManage;
    if (!s.invoice) return React.createElement(NoInvoice, null);
    var formState = useState(s.form); var form = formState[0], setFormRaw = formState[1];
    function setForm(k, v) { var o = {}; o[k] = v; setFormRaw(Object.assign({}, form, o)); }
    var manualState = useState(s.openManual); var manualOpen = manualState[0], setManualOpen = manualState[1];
    var fallbackState = useState(s.openFallback); var fallbackOpen = fallbackState[0], setFallbackOpen = fallbackState[1];

    var step = deriveNextStep(s);
    function run(action) {
      if (!action) return;
      if (action.kind === 'open-manual') setManualOpen(true);
      else if (action.kind === 'open-fallback') setFallbackOpen(true);
      /* handlers (onSubmit…, onCheck…, onLoadXml…) are no-ops in the prototype */
    }

    return React.createElement('div', { style: { padding: 'var(--gutter)', maxWidth: 1040, margin: '0 auto' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 18, flexWrap: 'wrap' } },
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('div', { className: 'ds-eyebrow' }, 'Invoicing · Ciclo SRI'),
          React.createElement('h1', { style: { margin: '4px 0 0', fontSize: 'var(--text-display)', fontWeight: 800, letterSpacing: 'var(--track-tight)', color: 'var(--text-strong)' } }, 'Autorización electrónica'),
          React.createElement('p', { style: { margin: '6px 0 0', fontSize: 'var(--text-body)', color: 'var(--text-muted)', maxWidth: 600, lineHeight: 'var(--leading-body)' } }, 'Del documento preparado al comprobante autorizado, un paso seguro a la vez. Cada estado explica qué significa legalmente.')),
        React.createElement('div', { style: { display: 'flex', gap: 8 } }, React.createElement(Btn, { variant: 'ghost', leading: 'help' }, 'Guía SRI'))),

      !canManage && React.createElement('div', { style: { marginBottom: 16 } },
        React.createElement(Banner, { tone: 'info', icon: 'lock', title: 'Solo lectura' },
          'Tu rol ' + s.permission.role + ' puede ver el ciclo y la evidencia, pero no enviar, consultar ni conciliar. Falta el permiso ',
          React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontWeight: 600 } }, s.permission.missingPermission), '.')),

      React.createElement('div', { style: { display: 'grid', gap: 16 } },
        React.createElement(VerdictHeader, { s: s }),
        React.createElement(Stepper, { status: s.invoice.electronicStatus }),
        React.createElement(NextStep, { step: step, s: s, canManage: canManage, run: run }),
        React.createElement(SriMessage, { s: s }),
        React.createElement(Evidence, { s: s }),
        s.xmlPreviewLoaded && React.createElement('div', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--card-pad)' } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 } },
            React.createElement('span', { style: { color: 'var(--text-muted)', display: 'inline-flex' } }, I({ name: 'fileCode', size: 16 })),
            React.createElement('h3', { style: { margin: 0, flex: 1, fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' } }, 'XML preliminar'),
            React.createElement(Pill, { tone: 'info' }, 'Preliminar')),
          React.createElement('pre', { style: { margin: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text)', lineHeight: 1.6, background: 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', overflowX: 'auto' } }, '<factura id="comprobante" version="1.1.0">\n  <infoTributaria>\n    <ambiente>2</ambiente>\n    <razonSocial>Acme Logística S.A.</razonSocial>\n    <ruc>1790012345001</ruc>\n    <claveAcceso>' + (s.invoice.accessKey || '—') + '</claveAcceso>\n  </infoTributaria>\n  …\n</factura>'),
          React.createElement('p', { style: { margin: '8px 0 0', fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)' } }, 'Vista preliminar separada del envío y de la autorización.')),

        /* advanced */
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0 0' } },
          React.createElement('span', { className: 'ds-eyebrow', style: { color: 'var(--text-subtle)' } }, 'Controles avanzados'),
          React.createElement('span', { style: { flex: 1, height: 1, background: 'var(--divider)' } })),
        React.createElement(Disclosure, { open: manualOpen, setOpen: setManualOpen, icon: 'wrench', title: 'Intervención manual', sub: 'Registrar respuesta del SRI o conciliar el estado legal', badge: 'Avanzado', badgeTone: s.invoice.electronicStatus === 'rejected' ? 'danger' : 'neutral' },
          React.createElement(ManualPanel, { s: s, form: form, set: setForm, canManage: canManage })),
        React.createElement(Disclosure, { open: fallbackOpen, setOpen: setFallbackOpen, icon: 'gitBranch', title: 'Fallback XML prefirmado', sub: 'Solo para pruebas de sandbox con firma externa real', badge: 'Secundario', badgeTone: 'warning' },
          React.createElement(FallbackPanel, { s: s, form: form, set: setForm, canManage: canManage })),
        React.createElement(TracePanel, { s: s, defaultOpen: s.openTrace })));
  }

  window.Lifecycle = { DesktopLifecycle: DesktopLifecycle, deriveNextStep: deriveNextStep, STATUS: STATUS, fmtDateTime: fmtDateTime, providerTone: providerTone };
})();
