/* Mobile — Invoicing SRI Submission Lifecycle (slice 09). Purpose-built, not a
   shrunk desk: top legal-status verdict, lifecycle stepper without horizontal
   scroll, one thumb-friendly primary action pinned at the bottom, evidence as
   copy-friendly rows, and manual/fallback/trace behind bottom sheets. Shares
   window.Lifecycle helpers + the real contracts. window.MobileLifecycle. */
(function () {
  var useState = React.useState;
  var I = window.Icon;
  var UI = window.UI;
  var Btn = UI.Btn, Pill = UI.Pill, Banner = UI.Banner;
  var Chrome = window.Chrome;
  var MobileTopBar = Chrome.MobileTopBar, BottomTabs = Chrome.BottomTabs, Sheet = Chrome.Sheet;
  var D = window.LIFECYCLE_DATA;
  var deriveNextStep = window.Lifecycle.deriveNextStep, STATUS = window.Lifecycle.STATUS,
      fmtDateTime = window.Lifecycle.fmtDateTime, providerTone = window.Lifecycle.providerTone;

  function CopyRow(props) {
    var st = useState(false); var copied = st[0], setCopied = st[1];
    var disabled = !props.value || props.value === '—' || props.value === 'Disponible al autorizar';
    return React.createElement('div', { style: { display: 'grid', gap: 4, padding: '11px 0', borderBottom: '1px solid var(--divider)' } },
      React.createElement('span', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--text-subtle)' } }, props.label),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
        React.createElement('span', { style: { flex: 1, minWidth: 0, fontFamily: props.mono ? 'var(--font-mono)' : 'inherit', fontSize: 'var(--text-sm)', color: 'var(--text-strong)', fontWeight: 500, wordBreak: props.mono ? 'break-all' : 'normal', lineHeight: 1.4 } }, props.value),
        !disabled && React.createElement('button', { className: 'ds-focusable', title: 'Copiar', onClick: function () { setCopied(true); setTimeout(function () { setCopied(false); }, 1300); }, style: { flex: 'none', background: 'transparent', border: 'none', cursor: 'pointer', color: copied ? 'var(--success)' : 'var(--text-subtle)', display: 'inline-flex', padding: 4 } }, I({ name: copied ? 'check' : 'copy', size: 15 }))));
  }

  function MStepper(props) {
    var status = props.status;
    var current = status === 'authorized' ? 2 : (status === 'submitted' || status === 'rejected') ? 1 : 0;
    var rejected = status === 'rejected';
    var steps = ['Preparado', 'Enviado', 'Autorizado'];
    return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 0 } },
      steps.map(function (label, i) {
        var isRejected = rejected && i === 1; var done = i < current; var isCurrent = i === current;
        var tone = isRejected ? 'danger' : done ? 'success' : isCurrent ? 'warning' : 'neutral';
        var col = 'var(--' + (tone === 'neutral' ? 'text-subtle' : tone) + ')';
        return React.createElement(React.Fragment, { key: label },
          React.createElement('div', { style: { display: 'grid', gap: 5, justifyItems: 'center', flex: 'none' } },
            React.createElement('span', { style: { width: 30, height: 30, borderRadius: 999, display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700, background: (done || isCurrent || isRejected) ? col : 'var(--surface-sunken)', color: (done || isCurrent || isRejected) ? '#fff' : 'var(--text-subtle)', border: (done || isCurrent || isRejected) ? 'none' : '1px solid var(--border-strong)' } }, isRejected ? '!' : done ? I({ name: 'check', size: 14 }) : (i + 1)),
            React.createElement('span', { style: { fontSize: 9, fontWeight: 600, color: (done || isCurrent || isRejected) ? 'var(--text-strong)' : 'var(--text-subtle)', whiteSpace: 'nowrap' } }, isRejected ? 'Devuelto' : label)),
          i < steps.length - 1 && React.createElement('span', { style: { flex: 1, height: 2, margin: '0 6px', marginBottom: 14, borderRadius: 2, background: i < current ? 'var(--success)' : 'var(--divider)' } }));
      }));
  }

  /* sheet bodies (manual / fallback / trace) */
  function field(label, node) { return React.createElement('label', { style: { display: 'grid', gap: 6 } }, React.createElement('span', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--text-subtle)' } }, label), node); }
  function inStyle(d) { return { height: 44, padding: '0 12px', background: d ? 'var(--surface-sunken)' : 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', font: 'inherit', fontSize: 'var(--text-body)', color: 'var(--text-strong)', outline: 'none', width: '100%', boxSizing: 'border-box' }; }

  function ManualSheet(props) {
    var s = props.s, f = props.form, set = props.set;
    var disabled = !s.permission.canManage || s.invoice.status === 'draft' || !s.canSubmit;
    return React.createElement('div', { style: { display: 'grid', gap: 13, paddingBottom: 4 } },
      React.createElement('p', { style: { margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.5 } }, 'Registra una respuesta validada del SRI o concilia el estado legal. No es la operación diaria.'),
      s.invoice.electronicStatus === 'rejected' && s.invoice.electronicStatusMessage && React.createElement('div', { style: { padding: '11px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--danger-soft)', color: 'var(--on-danger-soft)' } },
        React.createElement('div', { style: { fontSize: 'var(--text-2xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' } }, 'Observación activa'),
        React.createElement('p', { style: { margin: '3px 0 0', fontSize: 'var(--text-xs)', lineHeight: 1.45 } }, s.invoice.electronicStatusMessage)),
      field('Estado', React.createElement('select', { value: f.electronicStatus, disabled: disabled, onChange: function (e) { set('electronicStatus', e.target.value); }, style: inStyle(disabled) },
        React.createElement('option', { value: 'pending_submission' }, 'Pendiente de envío'),
        React.createElement('option', { value: 'submitted' }, 'Enviado al SRI'),
        React.createElement('option', { value: 'authorized' }, 'Autorizada'),
        React.createElement('option', { value: 'rejected' }, 'Rechazada'))),
      field('Clave de acceso', React.createElement('input', { value: f.accessKey, disabled: disabled, placeholder: '49 dígitos', onChange: function (e) { set('accessKey', e.target.value); }, style: Object.assign(inStyle(disabled), { fontFamily: 'var(--font-mono)' }) })),
      field('No. autorización', React.createElement('input', { value: f.authorizationNumber, disabled: disabled, placeholder: 'Número SRI', onChange: function (e) { set('authorizationNumber', e.target.value); }, style: Object.assign(inStyle(disabled), { fontFamily: 'var(--font-mono)' }) })),
      field('Mensaje SRI', React.createElement('textarea', { value: f.electronicStatusMessage, disabled: disabled, rows: 2, onChange: function (e) { set('electronicStatusMessage', e.target.value); }, style: Object.assign(inStyle(disabled), { height: 'auto', padding: '10px 12px', lineHeight: 1.5, resize: 'vertical' }) })),
      React.createElement(Btn, { variant: 'secondary', full: true, leading: 'wrench', disabled: disabled }, 'Actualizar estado electrónico'));
  }
  function FallbackSheet(props) {
    var s = props.s, f = props.form, set = props.set;
    var disabled = !s.permission.canManage || s.invoice.status === 'draft' || !s.canSubmit;
    return React.createElement('div', { style: { display: 'grid', gap: 13, paddingBottom: 4 } },
      React.createElement('div', { style: { display: 'flex', gap: 9, padding: '11px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--warning-soft)', color: 'var(--on-warning-soft)' } },
        React.createElement('span', { style: { color: 'var(--warning)', flex: 'none', display: 'inline-flex' } }, I({ name: 'gitBranch', size: 16 })),
        React.createElement('span', { style: { fontSize: 'var(--text-xs)', lineHeight: 1.45 } }, 'Ruta secundaria para sandbox con firma externa real. No es la ruta principal.')),
      field('Signer name', React.createElement('input', { value: f.presignedSignerName, disabled: disabled, placeholder: 'sandbox-signer', onChange: function (e) { set('presignedSignerName', e.target.value); }, style: inStyle(disabled) })),
      field('Signed XML', React.createElement('textarea', { value: f.presignedXml, disabled: disabled, rows: 4, placeholder: '<factura …><ds:Signature>…</ds:Signature></factura>', onChange: function (e) { set('presignedXml', e.target.value); }, style: Object.assign(inStyle(disabled), { height: 'auto', padding: '10px 12px', lineHeight: 1.5, resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }) })),
      React.createElement(Btn, { variant: 'secondary', full: true, leading: 'send', disabled: disabled || !f.presignedXml.trim() }, 'Enviar XML prefirmado'));
  }
  function TraceSheet(props) {
    var inv = props.s.invoice;
    return React.createElement('div', { style: { display: 'grid', gap: 10, paddingBottom: 4 } },
      inv.electronicEvents.map(function (ev) {
        return React.createElement('div', { key: ev.id, style: { border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '11px 12px', background: 'var(--surface-sunken)' } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 } },
            React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', flex: 1 } }, ev.eventType === 'submission' ? 'Envío' : 'Consulta de autorización'),
            React.createElement(Pill, { tone: providerTone(ev.providerStatus), dot: true }, ev.providerStatus)),
          React.createElement('div', { style: { fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-strong)' } }, ev.provider),
          React.createElement('div', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', marginTop: 2 } }, fmtDateTime(ev.occurredAt)),
          React.createElement('p', { style: { margin: '6px 0 0', fontSize: 'var(--text-2xs)', color: 'var(--text)', lineHeight: 1.45 } }, ev.message),
          ev.sriDiagnostics && ev.sriDiagnostics.summary && React.createElement('div', { style: { marginTop: 5, fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' } }, 'Diagnóstico: ' + ev.sriDiagnostics.summary));
      }));
  }

  function MobileLifecycleScreen(props) {
    var s = props.s, mood = props.mood, onMood = props.onMood;
    var canManage = s.permission.canManage;
    var sheetState = useState(null); var sheet = sheetState[0], setSheet = sheetState[1];
    var moodState = useState(false); var moodOpen = moodState[0], setMoodOpen = moodState[1];
    var formState = useState(s.form); var form = formState[0], setFormRaw = formState[1];
    function setForm(k, v) { var o = {}; o[k] = v; setFormRaw(Object.assign({}, form, o)); }

    if (!s.invoice) {
      return React.createElement('div', { style: { height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--app-bg)' } },
        React.createElement(MobileTopBar, { tenant: D.tenant, onTenant: function () {}, onMood: function () { setMoodOpen(true); }, onAssistant: function () {} }),
        React.createElement('div', { style: { flex: 1, display: 'grid', placeItems: 'center', padding: 24, textAlign: 'center' } },
          React.createElement('div', { style: { display: 'grid', gap: 12, justifyItems: 'center' } },
            React.createElement('span', { style: { width: 52, height: 52, borderRadius: 'var(--radius-md)', display: 'grid', placeItems: 'center', background: 'var(--surface-sunken)', color: 'var(--text-subtle)' } }, I({ name: 'send', size: 25 })),
            React.createElement('h2', { style: { margin: 0, fontSize: 'var(--text-h2)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Selecciona una factura'),
            React.createElement('p', { style: { margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.5 } }, 'Elige una factura emitida para operar su ciclo SRI.'))),
        React.createElement(BottomTabs, { active: 'queue', onTab: function () {} }),
        moodOpen && React.createElement(Sheet, { title: 'Modo de diseño', onClose: function () { setMoodOpen(false); } }, React.createElement(UI.MoodMenu, { value: mood, onChange: function (m) { onMood(m); }, moods: D.moods })));
    }

    var inv = s.invoice; var meta = STATUS[inv.electronicStatus] || STATUS.pending_submission;
    var step = deriveNextStep(s);
    var authorized = inv.electronicStatus === 'authorized';
    var loadingMap = { onSubmitElectronicDocument: 'submit-invoice-electronic-document', onCheckAuthorization: 'check-invoice-electronic-authorization', onLoadXmlPreview: 'load-invoice-xml-preview' };
    var primaryLoading = step.primary.handler && s.actionLoading === loadingMap[step.primary.handler];
    var primaryLabel = primaryLoading ? '…' : step.primary.label;
    function runPrimary() { if (step.primary.kind === 'open-manual') setSheet('manual'); else if (step.primary.kind === 'open-fallback') setSheet('fallback'); }

    return React.createElement('div', { style: { height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--app-bg)' } },
      React.createElement(MobileTopBar, { tenant: D.tenant, onTenant: function () {}, onMood: function () { setMoodOpen(true); }, onAssistant: function () {} }),
      /* legal verdict header */
      React.createElement('div', { style: { flex: 'none', padding: '13px 14px', background: 'var(--' + meta.tone + '-soft)', borderBottom: '1px solid var(--border)', borderLeft: '4px solid var(--' + meta.tone + ')' } },
        React.createElement('div', { className: 'ds-eyebrow', style: { color: 'var(--on-' + meta.tone + '-soft)' } }, 'Estado legal ante el SRI'),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 2 } },
          React.createElement('span', { style: { width: 36, height: 36, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: 'var(--surface)', color: 'var(--' + meta.tone + ')', border: '1px solid var(--' + meta.tone + ')' } }, I({ name: authorized ? 'shieldCheck' : inv.electronicStatus === 'rejected' ? 'ban' : inv.electronicStatus === 'submitted' ? 'refreshCw' : 'send', size: 18 })),
          React.createElement('div', { style: { flex: 1, minWidth: 0 } },
            React.createElement('h1', { style: { margin: 0, fontSize: 'var(--text-h2)', fontWeight: 800, color: 'var(--text-strong)' } }, meta.label),
            React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--on-' + meta.tone + '-soft)' } }, inv.number))),
        React.createElement('p', { style: { margin: '8px 0 0', fontSize: 'var(--text-2xs)', color: 'var(--on-' + meta.tone + '-soft)', lineHeight: 1.45 } }, meta.legal)),

      React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: 14, display: 'grid', gap: 12, alignContent: 'start' } },
        !canManage && React.createElement(Banner, { tone: 'info', icon: 'lock', title: 'Solo lectura' }, 'Tu rol ' + s.permission.role + ' no puede enviar ni conciliar.'),
        /* stepper */
        React.createElement('div', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: '14px 16px' } },
          React.createElement(MStepper, { status: inv.electronicStatus })),
        /* next step */
        React.createElement('div', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: '4px solid var(--' + (step.tone === 'primary' ? 'primary' : step.tone) + ')', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 14 } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 } },
            React.createElement('span', { className: 'ds-eyebrow', style: { color: 'var(--text-subtle)', flex: 1 } }, 'Siguiente paso'),
            React.createElement(Pill, { tone: step.tone === 'primary' ? 'info' : step.tone, dot: true }, step.pill)),
          React.createElement('h3', { style: { margin: 0, fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' } }, step.title),
          React.createElement('p', { style: { margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.5 } }, step.desc)),
        /* SRI message */
        inv.electronicStatus === 'rejected' && inv.electronicStatusMessage && React.createElement('div', { style: { background: 'var(--danger-soft)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-md)', padding: 13 } },
          React.createElement('div', { className: 'ds-eyebrow', style: { color: 'var(--on-danger-soft)' } }, 'Observación del SRI'),
          React.createElement('p', { style: { margin: '3px 0 0', fontSize: 'var(--text-xs)', color: 'var(--on-danger-soft)', lineHeight: 1.5 } }, inv.electronicStatusMessage)),
        /* evidence */
        (inv.accessKey || inv.submittedAt) && React.createElement('div', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: '4px 14px 12px' } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, padding: '12px 0 4px' } },
            React.createElement('span', { style: { color: 'var(--text-muted)', display: 'inline-flex' } }, I({ name: 'scan', size: 15 })),
            React.createElement('span', { style: { flex: 1, fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Evidencia'),
            authorized ? React.createElement(Pill, { tone: 'success', dot: true }, 'Autorizado') : React.createElement(Pill, { tone: 'warning', dot: true }, 'En proceso')),
          React.createElement(CopyRow, { label: 'Clave de acceso', value: inv.accessKey || '—', mono: true }),
          React.createElement(CopyRow, { label: 'No. autorización', value: authorized ? (inv.authorizationNumber || 'Sin número') : 'Disponible al autorizar', mono: true }),
          React.createElement(CopyRow, { label: 'Enviado', value: fmtDateTime(inv.submittedAt) })),
        /* advanced entry points */
        React.createElement('div', { style: { display: 'grid', gap: 8 } },
          React.createElement('span', { className: 'ds-eyebrow', style: { color: 'var(--text-subtle)', marginTop: 4 } }, 'Controles avanzados'),
          [['manual', 'wrench', 'Intervención manual', 'Conciliar estado legal'], ['fallback', 'gitBranch', 'Fallback XML prefirmado', 'Sandbox con firma externa'], (inv.electronicEvents && inv.electronicEvents.length ? ['trace', 'clockHistory', 'Historial técnico', inv.electronicEvents.length + (inv.electronicEvents.length === 1 ? ' evento' : ' eventos')] : null)].filter(Boolean).map(function (row) {
            return React.createElement('button', { key: row[0], className: 'ds-focusable', onClick: function () { setSheet(row[0]); },
              style: { display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', padding: '12px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', cursor: 'pointer' } },
              React.createElement('span', { style: { width: 32, height: 32, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: 'var(--surface-sunken)', color: 'var(--text-muted)' } }, I({ name: row[1], size: 16 })),
              React.createElement('span', { style: { flex: 1, minWidth: 0, display: 'grid', gap: 2 } },
                React.createElement('span', { style: { fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)' } }, row[2]),
                React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' } }, row[3])),
              React.createElement('span', { style: { color: 'var(--text-subtle)', flex: 'none', display: 'inline-flex' } }, I({ name: 'chevronRight', size: 16 })));
          }))),

      /* sticky thumb-friendly primary action */
      React.createElement('div', { style: { flex: 'none', background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: 14 } },
        canManage
          ? React.createElement(Btn, { variant: 'primary', full: true, leading: primaryLoading ? null : step.primary.icon, disabled: !!primaryLoading, onClick: runPrimary }, primaryLabel)
          : React.createElement(Btn, { variant: 'secondary', full: true, leading: 'lock', disabled: true }, 'Solo lectura')),

      React.createElement(BottomTabs, { active: 'queue', onTab: function () {} }),

      sheet === 'manual' && React.createElement(Sheet, { title: 'Intervención manual', onClose: function () { setSheet(null); } }, React.createElement(ManualSheet, { s: s, form: form, set: setForm })),
      sheet === 'fallback' && React.createElement(Sheet, { title: 'Fallback XML prefirmado', onClose: function () { setSheet(null); } }, React.createElement(FallbackSheet, { s: s, form: form, set: setForm })),
      sheet === 'trace' && React.createElement(Sheet, { title: 'Historial técnico', onClose: function () { setSheet(null); } }, React.createElement(TraceSheet, { s: s })),
      moodOpen && React.createElement(Sheet, { title: 'Modo de diseño', onClose: function () { setMoodOpen(false); } }, React.createElement(UI.MoodMenu, { value: mood, onChange: function (m) { onMood(m); }, moods: D.moods })));
  }

  window.MobileLifecycle = { MobileLifecycleScreen: MobileLifecycleScreen };
})();
