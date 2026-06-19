/* Desktop — Invoicing Settings · Ecuador SRI preparation (slice 05).
   RECONCILED to the frozen contract: every field, enum and derived status maps
   to workspace-settings.tsx + types.ts (IssuerProfileResponse,
   ElectronicSignatureMaterialInspectionResponse, ElectronicSubmissionSettings,
   ElectronicSandboxReadinessResponse). Hierarchy stays decreasing-urgency:
     1 readiness at a glance (verdict + sandbox tier + four pillars)
     2 recommended next action (recommendedNextStep, the one loud thing)
     3 most important area (the recommended section is outlined)
     4 deeper evidence on demand (progressive disclosure per section)
   window.Settings. */
(function () {
  const { useState } = React;
  const I = window.Icon;
  const { Btn, Pill, Banner } = window.UI;

  /* --------------------------------------------------------- derivations */
  function issuerStatus(x) {
    return (x.legalName && x.taxId && x.matrixAddress && x.establishmentAddress) ? 'complete' : 'incomplete';
  }
  function numberingStatus(x) {
    return (x.documentCode && x.establishmentCode && x.emissionPointCode && x.nextSequenceNumber != null) ? 'complete' : 'incomplete';
  }
  function signatureStatus(x) {
    if (!x.materialConfigured) return 'missing';
    const v = x.inspection ? x.inspection.certificateValidityStatus : 'unknown';
    if (v === 'expired') return 'expired';
    if (x.inspection && x.inspection.status === 'invalid') return 'invalid';
    if (v === 'expiring_soon') return 'expiring';
    if (v === 'not_yet_valid') return 'not_yet';
    if (!x.isActive) return 'inactive';
    return 'usable';
  }
  function gatewayStatus(x) {
    return (x.gatewayConfigured && x.isActive && x.authorizationUrl) ? 'complete' : 'incomplete';
  }
  function sandboxTier(r) {
    if (r.isReadyForRemoteSandboxSubmission) return 'remote_internal';
    if (r.isReadyForPresignedRemoteSandboxSubmission) return 'remote_presigned';
    if (r.isReadyForLocalStubSubmission) return 'local_stub';
    return 'none';
  }
  function deriveAll(s) {
    const st = { issuer: issuerStatus(s.issuer), numbering: numberingStatus(s.numbering), signature: signatureStatus(s.signature), gateway: gatewayStatus(s.submission) };
    const r = s.readiness;
    const tier = sandboxTier(r);
    const remoteReady = tier === 'remote_internal' || tier === 'remote_presigned';
    const hasBlock = r.blockers.length > 0;
    let verdict;
    if (remoteReady) verdict = r.warnings.length ? 'warning' : 'ready';
    else if (hasBlock) verdict = 'blocked';
    else verdict = 'incomplete';
    let rec = null;
    if (st.signature === 'missing' || st.signature === 'expired' || st.signature === 'invalid') rec = 'signature';
    else if (st.issuer === 'incomplete') rec = 'issuer';
    else if (st.numbering === 'incomplete') rec = 'numbering';
    else if (st.gateway === 'incomplete') rec = 'gateway';
    else if (!remoteReady) rec = 'gateway';
    else if (st.signature === 'expiring') rec = 'signature';
    return { st: st, tier: tier, verdict: verdict, rec: rec };
  }

  /* --------------------------------------------------------- shared maps */
  const SECTION_META = {
    issuer:    { icon: 'building', label: 'Perfil del emisor', tag: 'Identidad fiscal' },
    numbering: { icon: 'hash',     label: 'Numeración',        tag: 'Serie · secuencial' },
    signature: { icon: 'key',      label: 'Firma electrónica', tag: 'Certificado PKCS#12' },
    gateway:   { icon: 'server',   label: 'Gateway SRI',       tag: 'Recepción · autorización' }
  };
  const STATUS_PILL = {
    complete:   { tone: 'success', label: 'Configurado' },
    incomplete: { tone: 'warning', label: 'Por completar' },
    usable:     { tone: 'success', label: 'Vigente' },
    expiring:   { tone: 'warning', label: 'Por vencer' },
    expired:    { tone: 'danger',  label: 'Caducada' },
    not_yet:    { tone: 'warning', label: 'Aún no vigente' },
    inactive:   { tone: 'neutral', label: 'Deshabilitada' },
    invalid:    { tone: 'danger',  label: 'Con hallazgos' },
    missing:    { tone: 'neutral', label: 'No configurada' }
  };
  const TONE_COLOR = { success: 'var(--success)', warning: 'var(--warning)', danger: 'var(--danger)', info: 'var(--info)', neutral: 'var(--text-muted)' };
  const TONE_SOFT = { success: 'var(--success-soft)', warning: 'var(--warning-soft)', danger: 'var(--danger-soft)', info: 'var(--info-soft)', neutral: 'var(--surface-sunken)' };
  const TONE_ON = { success: 'var(--on-success-soft)', warning: 'var(--on-warning-soft)', danger: 'var(--on-danger-soft)', info: 'var(--on-info-soft)', neutral: 'var(--text-muted)' };
  const CHECK_TONE = { ready: 'success', warning: 'warning', blocked: 'danger' };

  /* copy affordance */
  function CopyValue({ value, children, mono = true }) {
    const [copied, setCopied] = useState(false);
    return React.createElement('button', {
      className: 'ds-focusable', onClick: function () { setCopied(true); setTimeout(function () { setCopied(false); }, 1300); }, title: 'Copiar',
      style: { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', font: 'inherit', maxWidth: '100%' }
    },
      React.createElement('span', { style: { fontFamily: mono ? 'var(--font-mono)' : 'inherit', fontSize: mono ? 'var(--text-sm)' : 'inherit', color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, children || value),
      React.createElement('span', { style: { flex: 'none', color: copied ? 'var(--success)' : 'var(--text-subtle)', display: 'inline-flex' } }, I({ name: copied ? 'check' : 'copy', size: 13 })));
  }
  function Field({ label, children, full, missing }) {
    return React.createElement('div', { style: { display: 'grid', gap: 3, gridColumn: full ? '1 / -1' : 'auto', minWidth: 0 } },
      React.createElement('span', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-subtle)' } }, label),
      missing
        ? React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--on-warning-soft)' } }, I({ name: 'alert', size: 13 }), 'Por completar')
        : React.createElement('span', { style: { fontSize: 'var(--text-sm)', color: 'var(--text-strong)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis' } }, children));
  }
  function FieldGrid({ children, cols = 2 }) {
    return React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(' + cols + ', minmax(0,1fr))', gap: '14px 22px' } }, children);
  }
  function Disclosure({ label, sub, defaultOpen, children, icon = 'eye' }) {
    const [open, setOpen] = useState(!!defaultOpen);
    return React.createElement('div', { style: { borderTop: '1px solid var(--divider)', marginTop: 4 } },
      React.createElement('button', { className: 'ds-focusable', onClick: function () { setOpen(function (o) { return !o; }); }, 'aria-expanded': open,
        style: { display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', padding: '12px 0', color: 'var(--text)' } },
        React.createElement('span', { style: { color: 'var(--text-muted)', display: 'inline-flex' } }, I({ name: icon, size: 15 })),
        React.createElement('span', { style: { flex: 1, display: 'grid', gap: 1 } },
          React.createElement('span', { style: { fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)' } }, label),
          sub && React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' } }, sub)),
        React.createElement('span', { style: { color: 'var(--text-subtle)', display: 'inline-flex', transition: 'var(--transition-base)', transform: open ? 'rotate(180deg)' : 'none' } }, I({ name: 'chevronDown', size: 16 }))),
      open && React.createElement('div', { style: { paddingBottom: 14 } }, children));
  }
  function SectionCard({ skey, status, statusLabel, highlight, action, children, headerExtra }) {
    const meta = SECTION_META[skey];
    const sp = STATUS_PILL[status] || STATUS_PILL.incomplete;
    return React.createElement('section', { id: 'sec-' + skey,
      style: { background: 'var(--surface)', border: '1px solid ' + (highlight ? 'var(--border-strong)' : 'var(--border)'), borderRadius: 'var(--radius-md)', boxShadow: highlight ? 'var(--shadow-md)' : 'var(--shadow-sm)', overflow: 'hidden', scrollMarginTop: 16, outline: highlight ? '2px solid ' + TONE_COLOR[sp.tone] : 'none', outlineOffset: highlight ? '-1px' : 0 } },
      React.createElement('header', { style: { display: 'flex', alignItems: 'center', gap: 13, padding: 'var(--card-pad)', paddingBottom: 14, borderBottom: '1px solid var(--divider)' } },
        React.createElement('span', { style: { width: 40, height: 40, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: 'var(--primary-soft)', color: 'var(--primary)' } }, I({ name: meta.icon, size: 20 })),
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' } },
            React.createElement('h3', { style: { margin: 0, fontSize: 'var(--text-h3)', fontWeight: 700, letterSpacing: 'var(--track-snug)', color: 'var(--text-strong)' } }, meta.label),
            React.createElement(Pill, { tone: sp.tone, dot: true }, statusLabel || sp.label)),
          React.createElement('div', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', marginTop: 2 } }, meta.tag)),
        headerExtra),
      React.createElement('div', { style: { padding: 'var(--card-pad)', display: 'grid', gap: 16 } }, children),
      action && React.createElement('footer', { style: { padding: '14px var(--card-pad)', borderTop: '1px solid var(--divider)', background: 'var(--surface-sunken)', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' } }, action));
  }
  function ManageBtn({ canManage, children, variant = 'secondary', leading, primary }) {
    if (!canManage) return React.createElement(Btn, { variant: 'ghost', size: 'sm', leading: 'lock', disabled: true }, 'Solo lectura');
    return React.createElement(Btn, { variant: primary ? 'primary' : variant, size: 'sm', leading: leading }, children);
  }
  function ActivePill({ active, onLabel, offLabel }) {
    return React.createElement(Pill, { tone: active ? 'success' : 'neutral', dot: true }, active ? (onLabel || 'Habilitada') : (offLabel || 'Deshabilitada'));
  }

  /* ===================================================== 1 · READINESS HEADER */
  const TIER_LABEL = {
    remote_internal: 'Sandbox remoto con firma interna',
    remote_presigned: 'Sandbox remoto con XML prefirmado',
    local_stub: 'Validación local con stub',
    none: 'Sin ruta de envío disponible'
  };
  function ReadinessHeader({ s, d, onJump }) {
    const verdictMap = {
      ready:      { tone: 'success', icon: 'shieldCheck', title: 'Listo para emitir', sub: 'Los cuatro bloques están configurados y la firma interna pasa el sandbox remoto.' },
      warning:    { tone: 'warning', icon: 'shieldAlert', title: 'Listo, con una advertencia', sub: 'Puedes emitir, pero hay algo que conviene atender pronto.' },
      incomplete: { tone: 'warning', icon: 'shieldAlert', title: 'Falta configurar', sub: 'Completa lo pendiente para habilitar la emisión electrónica.' },
      blocked:    { tone: 'danger',  icon: 'ban',         title: 'Emisión bloqueada', sub: 'Hay un bloqueo que impide la emisión al SRI ahora mismo.' }
    };
    const v = verdictMap[d.verdict] || verdictMap.incomplete;
    const tierTone = d.tier === 'remote_internal' || d.tier === 'remote_presigned' ? 'success' : d.tier === 'local_stub' ? 'warning' : 'danger';
    return React.createElement('div', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 16, padding: '18px var(--card-pad)', borderLeft: '4px solid ' + TONE_COLOR[v.tone], background: TONE_SOFT[v.tone] } },
        React.createElement('span', { style: { width: 48, height: 48, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: 'var(--surface)', color: TONE_COLOR[v.tone], border: '1px solid ' + TONE_COLOR[v.tone] } }, I({ name: v.icon, size: 24 })),
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('div', { className: 'ds-eyebrow', style: { color: TONE_ON[v.tone] } }, 'Preparación para el SRI'),
          React.createElement('h2', { style: { margin: '2px 0 0', fontSize: 'var(--text-h1)', fontWeight: 800, letterSpacing: 'var(--track-snug)', color: 'var(--text-strong)' } }, v.title),
          React.createElement('p', { style: { margin: '3px 0 0', fontSize: 'var(--text-sm)', color: TONE_ON[v.tone], maxWidth: 580, lineHeight: 'var(--leading-body)' } }, v.sub)),
        React.createElement('div', { style: { flex: 'none', display: 'grid', gap: 6, justifyItems: 'end' } },
          React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 'var(--text-2xs)', fontWeight: 700, color: 'var(--text-strong)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-pill)', padding: '6px 12px' } },
            React.createElement('span', { style: { width: 7, height: 7, borderRadius: 999, background: s.issuer.environment === 'production' ? 'var(--success)' : 'var(--warning)' } }),
            s.issuer.environment === 'production' ? 'Producción' : 'Pruebas'),
          React.createElement('span', { title: 'Nivel de envío alcanzado', style: { display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 'var(--text-2xs)', fontWeight: 700, color: TONE_ON[tierTone], background: TONE_SOFT[tierTone], borderRadius: 'var(--radius-pill)', padding: '6px 12px' } },
            I({ name: 'route', size: 13 }), TIER_LABEL[d.tier]))),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: '1px solid var(--divider)' } },
        ['issuer', 'numbering', 'signature', 'gateway'].map(function (key, i) {
          return React.createElement(PillarTile, { key: key, skey: key, status: d.st[key], onJump: onJump, last: i === 3 });
        })));
  }
  function PillarTile({ skey, status, onJump, last }) {
    const [h, setH] = useState(false);
    const sp = STATUS_PILL[status] || STATUS_PILL.incomplete;
    const meta = SECTION_META[skey];
    return React.createElement('button', { className: 'ds-focusable', onClick: function () { onJump(skey); }, onMouseEnter: function () { setH(true); }, onMouseLeave: function () { setH(false); },
      style: { display: 'flex', alignItems: 'center', gap: 11, padding: '14px 16px', textAlign: 'left', background: h ? 'var(--surface-hover)' : 'transparent', border: 'none', borderRight: last ? 'none' : '1px solid var(--divider)', cursor: 'pointer', transition: 'var(--transition-base)' } },
      React.createElement('span', { style: { width: 34, height: 34, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: TONE_SOFT[sp.tone], color: TONE_COLOR[sp.tone] } }, I({ name: meta.icon, size: 17 })),
      React.createElement('span', { style: { display: 'grid', gap: 2, minWidth: 0, flex: 1 } },
        React.createElement('span', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, meta.label),
        React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 'var(--text-sm)', fontWeight: 700, color: TONE_COLOR[sp.tone] } },
          React.createElement('span', { style: { width: 6, height: 6, borderRadius: 999, background: TONE_COLOR[sp.tone] } }), sp.label)));
  }

  /* ===================================================== 2 · NEXT STEP cue */
  const REC_ACTION = {
    issuer: ['Completar emisor', 'building'],
    numbering: ['Configurar numeración', 'hash'],
    gateway: ['Completar gateway', 'server'],
    sandbox: ['Reintentar sandbox', 'refresh']
  };
  function NextStep({ s, d, canManage }) {
    if (!d.rec && d.verdict === 'ready') {
      return React.createElement(StepShell, { tone: 'success', icon: 'shieldCheck', title: 'Todo listo para emitir', body: s.readiness.recommendedNextStep, action: 'Ir a facturas', actionVariant: 'secondary', canManage: true });
    }
    let icon, title, action;
    const sigStatus = d.st.signature;
    if (d.rec === 'signature') {
      if (sigStatus === 'missing') { icon = 'key'; title = 'Carga tu firma electrónica'; action = 'Cargar certificado'; }
      else if (sigStatus === 'expired') { icon = 'shieldAlert'; title = 'Tu firma electrónica caducó'; action = 'Renovar firma'; }
      else if (sigStatus === 'expiring') { icon = 'clock'; title = 'Renueva tu firma antes de que caduque'; action = 'Programar renovación'; }
      else { icon = 'shieldAlert'; title = 'Revisa el material de firma'; action = 'Abrir firma'; }
    } else if (d.rec === 'gateway' && d.tier !== 'remote_internal' && d.tier !== 'remote_presigned' && gatewayStatus(s.submission) === 'complete') {
      icon = 'route'; title = 'Sandbox remoto bloqueado'; action = 'Reintentar sandbox';
    } else {
      const m = REC_ACTION[d.rec] || REC_ACTION.gateway;
      title = d.rec === 'issuer' ? 'Completa la identidad fiscal del emisor' : d.rec === 'numbering' ? 'Configura la numeración de facturas' : 'Completa el gateway del SRI';
      action = m[0]; icon = m[1];
    }
    const tone = d.verdict === 'blocked' ? 'danger' : 'warning';
    return React.createElement(StepShell, { tone: tone, icon: icon, title: title, body: s.readiness.recommendedNextStep, action: action, actionVariant: 'primary', canManage: canManage });
  }
  function StepShell({ tone, icon, title, body, action, actionVariant, canManage }) {
    return React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: '4px solid ' + TONE_COLOR[tone], borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: '18px var(--card-pad)' } },
      React.createElement('span', { style: { width: 38, height: 38, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: TONE_SOFT[tone], color: TONE_COLOR[tone] } }, I({ name: icon, size: 19 })),
      React.createElement('div', { style: { flex: 1, minWidth: 0 } },
        React.createElement('div', { className: 'ds-eyebrow', style: { color: 'var(--text-subtle)' } }, 'Recomendación'),
        React.createElement('h3', { style: { margin: '1px 0 0', fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' } }, title),
        React.createElement('p', { style: { margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', maxWidth: 660, lineHeight: 'var(--leading-body)' } }, body)),
      React.createElement('div', { style: { flex: 'none', alignSelf: 'center' } },
        canManage ? React.createElement(Btn, { variant: actionVariant, trailing: 'arrowRight' }, action)
                  : React.createElement(Btn, { variant: 'secondary', leading: 'lock', disabled: true }, action)));
  }

  /* ===================================================== 3a · ISSUER */
  function IssuerSection({ s, canManage, highlight }) {
    const x = s.issuer; const st = issuerStatus(x);
    const align = (function () {
      if (!x.extractedCertificateTaxId) return { tone: 'neutral', icon: 'key', text: 'Carga la firma electrónica para contrastar el RUC contra el certificado.' };
      if (x.taxIdMatchesCertificate === true) return { tone: 'success', icon: 'shieldCheck', text: 'El RUC del perfil coincide con el certificado de firma (' + x.extractedCertificateTaxId + ').' };
      return { tone: 'warning', icon: 'alert', text: 'El RUC del perfil no coincide con el del certificado (' + x.extractedCertificateTaxId + '). Alinéalos antes de probar CELCER.' };
    })();
    return React.createElement(SectionCard, { skey: 'issuer', status: st, highlight: highlight,
      action: React.createElement(ManageBtn, { canManage: canManage, leading: 'fileEdit', primary: st === 'incomplete' }, 'Guardar perfil fiscal') },
      React.createElement(FieldGrid, null,
        React.createElement(Field, { label: 'Razón social' }, x.legalName),
        React.createElement(Field, { label: 'Nombre comercial' }, x.commercialName || '—'),
        React.createElement(Field, { label: 'RUC' }, React.createElement(CopyValue, { value: x.taxId })),
        React.createElement(Field, { label: 'Ambiente' }, x.environment === 'production' ? 'Producción' : 'Pruebas'),
        React.createElement(Field, { label: 'Contribuyente especial' }, x.specialTaxpayerCode ? x.specialTaxpayerCode : 'No'),
        React.createElement(Field, { label: 'RIMPE' }, x.rimpeTaxpayerType ? x.rimpeTaxpayerType : 'No aplica'),
        React.createElement(Field, { label: 'Obligado a contabilidad' }, x.accountingObligated ? 'Sí' : 'No'),
        React.createElement(Field, { label: 'Tipo de emisión' }, x.emissionType === 'normal' ? 'Normal' : x.emissionType),
        React.createElement(Field, { label: 'Dirección de la matriz', full: true, missing: !x.matrixAddress }, x.matrixAddress),
        React.createElement(Field, { label: 'Dirección del establecimiento', full: true, missing: !x.establishmentAddress }, x.establishmentAddress)),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 11, padding: '11px 13px', borderRadius: 'var(--radius-sm)', background: TONE_SOFT[align.tone], color: TONE_ON[align.tone] } },
        React.createElement('span', { style: { color: TONE_COLOR[align.tone], flex: 'none', display: 'inline-flex' } }, I({ name: align.icon, size: 17 })),
        React.createElement('span', { style: { flex: 1, fontSize: 'var(--text-sm)', lineHeight: 1.4 } }, align.text),
        x.taxIdMatchesCertificate === false && canManage && React.createElement('div', { style: { display: 'flex', gap: 8, flex: 'none' } },
          React.createElement(Btn, { variant: 'ghost', size: 'sm' }, 'Usar RUC del certificado'),
          React.createElement(Btn, { variant: 'secondary', size: 'sm', leading: 'refresh' }, 'Alinear y guardar'))));
  }

  /* ===================================================== 3b · NUMBERING */
  function NumberSegment({ value, label, placeholder }) {
    return React.createElement('div', { style: { display: 'grid', gap: 6, justifyItems: 'center', minWidth: 64 } },
      React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 600, letterSpacing: '0.04em', color: value ? 'var(--text-strong)' : 'var(--text-subtle)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', background: value ? 'var(--surface-sunken)' : 'transparent', border: value ? '1px solid var(--border)' : '1px dashed var(--border-strong)' } }, value || placeholder),
      React.createElement('span', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--text-subtle)' } }, label));
  }
  function NumberingSection({ s, canManage, highlight }) {
    const x = s.numbering; const st = numberingStatus(x);
    const incomplete = st === 'incomplete';
    const seq = x.nextSequenceNumber != null ? String(x.nextSequenceNumber).padStart(9, '0') : null;
    return React.createElement(SectionCard, { skey: 'numbering', status: st, highlight: highlight,
      action: React.createElement(ManageBtn, { canManage: canManage, leading: 'fileEdit', primary: incomplete }, incomplete ? 'Configurar numeración' : 'Guardar numeración') },
      React.createElement('div', { style: { display: 'grid', gap: 12 } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' } },
          React.createElement(Pill, { tone: 'primary' }, x.documentCode + ' · ' + x.documentLabel),
          React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' } }, 'Así se arma el número de cada comprobante')),
        React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 8, padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)', border: '1px solid var(--border)', flexWrap: 'wrap' } },
          React.createElement(NumberSegment, { value: x.establishmentCode, label: 'Estab.', placeholder: '—' }),
          React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 26, color: 'var(--text-subtle)', marginTop: 6 } }, '–'),
          React.createElement(NumberSegment, { value: x.emissionPointCode, label: 'Pto. emisión (PtoEmi)', placeholder: '0 0 0' }),
          React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 26, color: 'var(--text-subtle)', marginTop: 6 } }, '–'),
          React.createElement(NumberSegment, { value: seq, label: 'Próx. secuencial', placeholder: '0 0 0 0 0 0 0 0 0' }))),
      incomplete
        ? React.createElement(Banner, { tone: 'warning', icon: 'alert', title: 'Numeración sin terminar' }, 'Define el punto de emisión y el secuencial inicial. Si dejas el número vacío al crear una factura, se usará esta configuración automáticamente.')
        : React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 9, fontSize: 'var(--text-sm)', color: 'var(--text-muted)' } },
            React.createElement('span', { style: { color: 'var(--text-subtle)', display: 'inline-flex' } }, I({ name: 'fileText', size: 15 })),
            'Próxima factura sugerida: ', React.createElement('span', { style: { fontFamily: 'var(--font-mono)', color: 'var(--text-strong)', fontWeight: 600 } }, x.previewNumber)),
      x.otherPoints && x.otherPoints.length > 0 && React.createElement(Disclosure, { label: 'Otros tipos de comprobante', sub: x.otherPoints.length + ' con numeración propia', icon: 'layers' },
        React.createElement('div', { style: { display: 'grid', gap: 8 } },
          x.otherPoints.map(function (p, i) {
            return React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)', border: '1px solid var(--border)' } },
              React.createElement(Pill, { tone: 'neutral' }, p.documentCode),
              React.createElement('span', { style: { flex: 1, fontSize: 'var(--text-sm)', color: 'var(--text)' } }, p.documentLabel),
              React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-strong)' } }, p.previewNumber));
          }))));
  }

  /* ===================================================== 3c · SIGNATURE */
  function ValidityMeter({ status, days }) {
    const tone = status === 'expired' ? 'danger' : status === 'expiring' ? 'warning' : status === 'usable' ? 'success' : 'neutral';
    const pct = status === 'expired' ? 1 : days == null ? 0.5 : Math.max(0.06, Math.min(1, 1 - days / 730));
    return React.createElement('div', { style: { height: 8, borderRadius: 999, background: 'var(--surface-sunken)', border: '1px solid var(--border)', overflow: 'hidden' } },
      React.createElement('div', { style: { height: '100%', width: (pct * 100) + '%', background: TONE_COLOR[tone], transition: 'var(--transition-base)' } }));
  }
  const VALIDITY_LABEL = { valid: 'Vigente', expiring_soon: 'Por vencer', expired: 'Vencido', not_yet_valid: 'Aún no vigente', not_applicable: 'No aplica', unknown: 'Desconocida' };
  const PROOF_LABEL = { verified: 'Verificada', failed: 'Fallida', unknown: 'Pendiente', not_applicable: 'No aplica' };
  const INSPECT_STATUS = { likely_usable: 'Keystore abrible', not_applicable: 'No aplica', not_configured: 'Sin configuración', invalid: 'Inspección con hallazgos' };
  function SignatureSection({ s, canManage, highlight }) {
    const x = s.signature; const st = signatureStatus(x); const insp = x.inspection;
    if (st === 'missing') {
      return React.createElement(SectionCard, { skey: 'signature', status: 'missing', highlight: highlight,
        action: React.createElement(ManageBtn, { canManage: canManage, leading: 'download', primary: true }, 'Cargar certificado') },
        React.createElement('div', { style: { display: 'grid', gap: 14, justifyItems: 'start' } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 13, padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--danger-soft)', color: 'var(--on-danger-soft)', width: '100%', boxSizing: 'border-box' } },
            React.createElement('span', { style: { color: 'var(--danger)', flex: 'none', display: 'inline-flex' } }, I({ name: 'shieldAlert', size: 20 })),
            React.createElement('div', null,
              React.createElement('strong', { style: { fontWeight: 700, fontSize: 'var(--text-body)' } }, 'No hay material de firma cargado'),
              React.createElement('p', { style: { margin: '4px 0 0', fontSize: 'var(--text-sm)', lineHeight: 1.45 } }, insp.detail + ' Sin firma no se puede emitir al SRI — es el bloqueo más alto de esta lista.'))),
          React.createElement(FieldGrid, null,
            React.createElement(Field, { label: 'Provider' }, x.provider),
            React.createElement(Field, { label: 'Storage mode' }, x.storageMode)),
          React.createElement('div', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' } }, 'Entidades autorizadas: Security Data · Banco Central (BCE) · ANF AC · Uanataca · Datil')));
    }
    const sp = STATUS_PILL[st];
    const days = insp.daysUntilExpiry;
    const attn = st === 'expired'
      ? { tone: 'danger', text: 'El certificado venció' + (insp.validUntil ? ' el ' + fmt(insp.validUntil) : '') + '. Renueva el material para reanudar la emisión.' }
      : st === 'expiring'
        ? { tone: 'warning', text: 'Caduca en ' + days + ' días' + (insp.validUntil ? ' (' + fmt(insp.validUntil) + ')' : '') + '. Renuévalo pronto.' }
        : st === 'inactive'
          ? { tone: 'neutral', text: 'El material está configurado pero la firma está deshabilitada para el tenant.' }
          : { tone: 'success', text: 'Vigente y verificada. Válida hasta el ' + fmt(insp.validUntil) + '.' };
    return React.createElement(SectionCard, { skey: 'signature', status: st, highlight: highlight,
      headerExtra: React.createElement(ActivePill, { active: x.isActive, onLabel: 'Habilitada', offLabel: 'Deshabilitada' }),
      action: React.createElement(React.Fragment, null,
        React.createElement(ManageBtn, { canManage: canManage, leading: st === 'usable' ? 'refresh' : 'download', primary: st !== 'usable' }, st === 'usable' ? 'Reemplazar certificado' : 'Renovar firma'),
        canManage && React.createElement(Btn, { variant: 'ghost', size: 'sm', leading: 'refresh' }, 'Hidratar desde PKCS#12')) },
      React.createElement('div', { style: { display: 'grid', gap: 13 } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 13 } },
          React.createElement('span', { style: { width: 40, height: 40, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: TONE_SOFT[sp.tone], color: TONE_COLOR[sp.tone] } }, I({ name: st === 'expired' ? 'shieldAlert' : 'shieldCheck', size: 20 })),
          React.createElement('div', { style: { flex: 1, minWidth: 0 } },
            React.createElement('div', { style: { fontSize: 'var(--text-sm)', color: 'var(--text-strong)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, x.certificateLabel),
            React.createElement('div', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', marginTop: 2 } }, x.provider + ' · ' + INSPECT_STATUS[insp.status])),
          React.createElement('div', { style: { flex: 'none', textAlign: 'right' } },
            React.createElement('div', { style: { fontSize: 'var(--text-h3)', fontWeight: 800, color: TONE_COLOR[sp.tone] } }, st === 'expired' ? 'Caducada' : (days != null ? days + ' días' : sp.label)),
            React.createElement('div', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' } }, insp.validUntil ? ((st === 'expired' ? 'Venció ' : 'Vence ') + fmt(insp.validUntil)) : 'Sin fecha'))),
        React.createElement(ValidityMeter, { status: st, days: days }),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 9, fontSize: 'var(--text-sm)', color: TONE_ON[attn.tone] } },
          React.createElement('span', { style: { color: TONE_COLOR[attn.tone], display: 'inline-flex' } }, I({ name: attn.tone === 'success' ? 'check' : 'alert', size: 15 })), attn.text)),
      React.createElement(Disclosure, { label: 'Inspección del certificado', sub: 'Identidad · emisión · validez · prueba criptográfica', defaultOpen: st === 'expired' || insp.status === 'invalid', icon: 'fileText' },
        React.createElement('div', { style: { display: 'grid', gap: 16 } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 9, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' } },
            React.createElement('span', { style: { color: 'var(--text-subtle)', display: 'inline-flex' } }, I({ name: 'help', size: 14 })), insp.detail),
          React.createElement(InspectGroup, { title: 'Identidad', rows: [['Subject (CN)', insp.extractedSubjectName, true], ['RUC extraído', insp.extractedTaxId, true], ['Nombre del certificado', x.certificateLabel, false]] }),
          React.createElement(InspectGroup, { title: 'Emisión', rows: [['Entidad emisora', insp.extractedIssuerName, false], ['Provider', x.provider, false], ['Storage mode', x.storageMode, false], ['Probe method', insp.probeMethod, false], ['Encoding', insp.encoding, false]] }),
          React.createElement(InspectGroup, { title: 'Validez', rows: [['Estado', VALIDITY_LABEL[insp.certificateValidityStatus], false], ['Desde', fmt(insp.validFrom), false], ['Hasta', fmt(insp.validUntil), false], ['Días para vencer', insp.daysUntilExpiry != null ? String(insp.daysUntilExpiry) : 'No calculado', false]] }),
          React.createElement(InspectGroup, { title: 'Prueba criptográfica', rows: [['Estado', PROOF_LABEL[insp.cryptographicProofStatus], false], ['Detalle', insp.cryptographicProofDetail, false], ['Fingerprint', insp.extractedFingerprint, true]] }),
          x.provider === 'xades_pkcs12' && React.createElement(InspectGroup, { title: 'Material sensible (referencias)', rows: [['PKCS#12 secret ref', x.pkcs12SecretRef, true], ['Password secret ref', x.passwordSecretRef, true]] }))));
  }
  function InspectGroup({ title, rows }) {
    return React.createElement('div', { style: { display: 'grid', gap: 7 } },
      React.createElement('div', { className: 'ds-eyebrow', style: { color: 'var(--text-subtle)' } }, title),
      React.createElement('div', { style: { display: 'grid', gap: 6 } },
        rows.filter(function (r) { return r[1] != null && r[1] !== ''; }).map(function (r, i) {
          return React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'baseline', gap: 12 } },
            React.createElement('span', { style: { flex: 'none', width: 170, fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' } }, r[0]),
            r[2] ? React.createElement('span', { style: { flex: 1, minWidth: 0 } }, React.createElement(CopyValue, { value: r[1] }))
                 : React.createElement('span', { style: { flex: 1, fontSize: 'var(--text-sm)', color: 'var(--text-strong)' } }, r[1]));
        })));
  }

  /* ===================================================== 3d · GATEWAY */
  function SupportMatrix({ support }) {
    const COLS = [['numberingConfigured', 'Num.'], ['previewAvailable', 'XML'], ['rideAvailable', 'RIDE'], ['schemaValidationAvailable', 'XSD'], ['submitSupported', 'Envío']];
    return React.createElement('div', { style: { display: 'grid', gap: 8 } },
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1.6fr repeat(5, 1fr)', gap: 6, padding: '0 4px' } },
        React.createElement('span', null),
        COLS.map(function (c) { return React.createElement('span', { key: c[0], style: { fontSize: 'var(--text-2xs)', fontWeight: 600, color: 'var(--text-subtle)', textAlign: 'center' } }, c[1]); })),
      support.map(function (d, i) {
        return React.createElement('div', { key: i, style: { display: 'grid', gridTemplateColumns: '1.6fr repeat(5, 1fr)', gap: 6, alignItems: 'center', padding: '9px 4px', borderTop: '1px solid var(--divider)' } },
          React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 } },
            React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', flex: 'none' } }, d.documentCode),
            React.createElement('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, d.label)),
          COLS.map(function (c) {
            const ok = d[c[0]]; const tone = ok ? 'success' : 'neutral';
            return React.createElement('span', { key: c[0], style: { display: 'grid', placeItems: 'center' } },
              React.createElement('span', { style: { width: 20, height: 20, borderRadius: 999, display: 'grid', placeItems: 'center', background: TONE_SOFT[tone], color: TONE_COLOR[tone] } }, I({ name: ok ? 'check' : 'x', size: 12 })));
          }));
      }));
  }
  function GatewaySection({ s, canManage, highlight, derived }) {
    const x = s.submission; const st = gatewayStatus(x); const r = s.readiness;
    const conn = (x.gatewayConfigured && x.isActive) ? { tone: 'success', icon: 'check', text: 'Gateway configurado y habilitado' }
      : x.gatewayConfigured ? { tone: 'warning', icon: 'alert', text: 'Configurado pero deshabilitado para el tenant' }
      : { tone: 'warning', icon: 'alert', text: 'Configuración incompleta' };
    const incomplete = st === 'incomplete';
    const tierTone = derived.tier === 'remote_internal' || derived.tier === 'remote_presigned' ? 'success' : derived.tier === 'local_stub' ? 'warning' : 'danger';
    return React.createElement(SectionCard, { skey: 'gateway', status: st, highlight: highlight,
      headerExtra: React.createElement(ActivePill, { active: x.isActive, onLabel: 'Envío habilitado', offLabel: 'Envío deshabilitado' }),
      action: React.createElement(ManageBtn, { canManage: canManage, leading: incomplete ? 'zap' : 'refresh', primary: incomplete }, incomplete ? 'Guardar gateway SRI' : 'Probar conexión') },
      React.createElement(FieldGrid, null,
        React.createElement(Field, { label: 'Provider' }, x.provider),
        React.createElement(Field, { label: 'Ambiente' }, x.environment === 'production' ? 'Producción' : 'Pruebas'),
        React.createElement(Field, { label: 'Modo de transmisión' }, x.transmissionMode),
        React.createElement(Field, { label: 'Timeout' }, (x.timeoutMs / 1000) + ' s')),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 9, padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: TONE_SOFT[conn.tone], color: TONE_ON[conn.tone] } },
        React.createElement('span', { style: { color: TONE_COLOR[conn.tone], display: 'inline-flex' } }, I({ name: conn.icon, size: 16 })),
        React.createElement('span', { style: { fontSize: 'var(--text-sm)', fontWeight: 600 } }, conn.text)),
      React.createElement('div', { style: { display: 'grid', gap: 8 } },
        React.createElement(EndpointRow, { label: 'Recepción', value: x.receptionUrl }),
        React.createElement(EndpointRow, { label: 'Autorización', value: x.authorizationUrl }),
        React.createElement(EndpointRow, { label: 'Credenciales', value: x.credentialsSecretRef })),
      /* sandbox readiness ladder + last remote feedback */
      React.createElement(Disclosure, { label: 'Preparación de sandbox', sub: TIER_LABEL[derived.tier], defaultOpen: derived.verdict === 'blocked' && st === 'complete', icon: 'route' },
        React.createElement('div', { style: { display: 'grid', gap: 12 } },
          React.createElement('div', { style: { display: 'grid', gap: 6 } },
            React.createElement(TierRung, { on: r.isReadyForLocalStubSubmission, label: 'Validación local con stub' }),
            React.createElement(TierRung, { on: r.isReadyForPresignedRemoteSandboxSubmission, label: 'Sandbox remoto con XML prefirmado' }),
            React.createElement(TierRung, { on: r.isReadyForRemoteSandboxSubmission, label: 'Sandbox remoto con firma interna' })),
          r.latestRemoteSriSubmissionSummary && React.createElement('div', { style: { padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)', border: '1px solid var(--border)' } },
            React.createElement('div', { className: 'ds-eyebrow', style: { color: 'var(--text-subtle)' } }, 'Último feedback del SRI'),
            React.createElement('p', { style: { margin: '4px 0 0', fontSize: 'var(--text-xs)', color: 'var(--text)', lineHeight: 1.45 } }, r.latestRemoteSriSubmissionSummary)))),
      /* document support matrix — the controlled readiness lane */
      React.createElement(Disclosure, { label: 'Matriz de comprobantes soportados', sub: 'Numeración · XML · RIDE · XSD · envío', defaultOpen: !incomplete && derived.verdict === 'ready', icon: 'layers' },
        React.createElement(SupportMatrix, { support: r.documentSupport })));
  }
  function TierRung({ on, label }) {
    const tone = on ? 'success' : 'neutral';
    return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
      React.createElement('span', { style: { width: 20, height: 20, flex: 'none', borderRadius: 999, display: 'grid', placeItems: 'center', background: TONE_SOFT[tone], color: TONE_COLOR[tone] } }, I({ name: on ? 'check' : 'circleDot', size: 12 })),
      React.createElement('span', { style: { fontSize: 'var(--text-sm)', fontWeight: on ? 600 : 500, color: on ? 'var(--text-strong)' : 'var(--text-muted)' } }, label));
  }
  function EndpointRow({ label, value }) {
    return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 } },
      React.createElement('span', { style: { flex: 'none', width: 100, fontSize: 'var(--text-2xs)', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--text-subtle)' } }, label),
      value ? React.createElement('span', { style: { flex: 1, minWidth: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, value)
            : React.createElement('span', { style: { flex: 1, fontSize: 'var(--text-xs)', color: 'var(--on-warning-soft)', display: 'inline-flex', alignItems: 'center', gap: 6 } }, I({ name: 'alert', size: 13 }), 'Sin configurar'));
  }

  /* ===================================================== READINESS RAIL */
  function ReadinessRail({ s, derived, onJump }) {
    const r = s.readiness;
    const items = r.blockers.map(function (t) { return { kind: 'blocker', text: t }; }).concat(r.warnings.map(function (t) { return { kind: 'warning', text: t }; }));
    return React.createElement('aside', { style: { display: 'grid', gap: 16, alignContent: 'start', position: 'sticky', top: 16 } },
      /* checklist from readiness.checks */
      React.createElement('div', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' } },
        React.createElement('div', { style: { padding: '14px var(--card-pad)', borderBottom: '1px solid var(--divider)', display: 'flex', alignItems: 'center', gap: 9 } },
          React.createElement('span', { style: { color: 'var(--text-muted)', display: 'inline-flex' } }, I({ name: 'shieldCheck', size: 16 })),
          React.createElement('h3', { style: { margin: 0, fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Checklist de preparación')),
        React.createElement('div', { style: { padding: '10px var(--card-pad)', display: 'grid', gap: 2 } },
          r.checks.map(function (c, i) {
            const tone = CHECK_TONE[c.status] || 'neutral';
            return React.createElement('div', { key: i, title: c.detail, style: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: i ? '1px solid var(--divider)' : 'none' } },
              React.createElement('span', { style: { width: 18, height: 18, flex: 'none', borderRadius: 999, display: 'grid', placeItems: 'center', background: TONE_SOFT[tone], color: TONE_COLOR[tone] } }, I({ name: c.status === 'ready' ? 'check' : c.status === 'warning' ? 'alert' : 'x', size: 11 })),
              React.createElement('span', { style: { flex: 1, fontSize: 'var(--text-sm)', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, c.label));
          }))),
      /* qué falta — real blockers/warnings strings */
      React.createElement('div', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' } },
        React.createElement('div', { style: { padding: '14px var(--card-pad)', borderBottom: '1px solid var(--divider)', display: 'flex', alignItems: 'center', gap: 9 } },
          React.createElement('span', { style: { color: 'var(--text-muted)', display: 'inline-flex' } }, I({ name: 'shield', size: 16 })),
          React.createElement('h3', { style: { margin: 0, fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Qué falta'),
          React.createElement('span', { style: { flex: 1 } }),
          items.length > 0 && React.createElement(Pill, { tone: r.blockers.length ? 'danger' : 'warning' }, items.length)),
        React.createElement('div', { style: { padding: items.length ? '12px' : 'var(--card-pad)', display: 'grid', gap: 8 } },
          items.length === 0
            ? React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, color: 'var(--on-success-soft)' } },
                React.createElement('span', { style: { color: 'var(--success)', display: 'inline-flex' } }, I({ name: 'shieldCheck', size: 18 })),
                React.createElement('span', { style: { fontSize: 'var(--text-sm)', fontWeight: 600 } }, 'Sin bloqueos ni advertencias.'))
            : items.map(function (it, i) {
                const tone = it.kind === 'blocker' ? 'danger' : 'warning';
                return React.createElement('button', { key: i, className: 'ds-focusable', onClick: function () { onJump(derived.rec || 'gateway'); },
                  style: { display: 'flex', gap: 10, textAlign: 'left', width: '100%', padding: '11px 12px', borderRadius: 'var(--radius-sm)', background: TONE_SOFT[tone], border: '1px solid transparent', borderLeft: '3px solid ' + TONE_COLOR[tone], cursor: 'pointer' } },
                  React.createElement('span', { style: { color: TONE_COLOR[tone], flex: 'none', display: 'inline-flex', marginTop: 1 } }, I({ name: it.kind === 'blocker' ? 'ban' : 'alert', size: 15 })),
                  React.createElement('span', { style: { fontSize: 'var(--text-xs)', color: TONE_ON[tone], lineHeight: 1.4 } }, it.text));
              }))),
      React.createElement('div', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', lineHeight: 1.55, padding: '0 4px' } },
        'La preparación se calcula con la configuración guardada. El envío de comprobantes y la autorización ante el SRI ocurren en cada factura, no aquí.'));
  }

  /* date helper — ISO (yyyy-mm-dd) → es-EC short */
  const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  function fmt(iso) {
    if (!iso) return '—';
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
    if (!m) return iso;
    return parseInt(m[3], 10) + ' ' + MONTHS[parseInt(m[2], 10) - 1] + ' ' + m[1];
  }

  /* ===================================================== PAGE */
  function DesktopSettings({ d, stateKey }) {
    const s = d.scenarios[stateKey];
    const canManage = s.permission.canManage;
    const derived = deriveAll(s);
    function jump(key) { const el = document.getElementById('sec-' + key); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

    return React.createElement('div', { style: { padding: 'var(--gutter)', maxWidth: 1180, margin: '0 auto' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 18, flexWrap: 'wrap' } },
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('div', { className: 'ds-eyebrow' }, 'Invoicing · Configuración'),
          React.createElement('h1', { style: { margin: '4px 0 0', fontSize: 'var(--text-display)', fontWeight: 800, letterSpacing: 'var(--track-tight)', color: 'var(--text-strong)' } }, 'Configuración electrónica'),
          React.createElement('p', { style: { margin: '6px 0 0', fontSize: 'var(--text-body)', color: 'var(--text-muted)', maxWidth: 640, lineHeight: 'var(--leading-body)' } }, 'Emisor, numeración, firma y gateway del SRI para la facturación electrónica de Ecuador.')),
        React.createElement('div', { style: { display: 'flex', gap: 8 } }, React.createElement(Btn, { variant: 'ghost', leading: 'help' }, 'Guía SRI'))),

      !canManage && React.createElement('div', { style: { marginBottom: 16 } },
        React.createElement(Banner, { tone: 'info', icon: 'lock', title: 'Solo lectura' },
          'Tu rol ' + s.permission.role + ' puede revisar la configuración pero no editarla. Falta el permiso ',
          React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontWeight: 600 } }, s.permission.missingPermission), '. Pídeselo a un Owner.')),

      React.createElement('div', { style: { display: 'grid', gap: 16 } },
        React.createElement(ReadinessHeader, { s: s, d: derived, onJump: jump }),
        React.createElement(NextStep, { s: s, d: derived, canManage: canManage }),
        React.createElement('div', { className: 'set-grid', style: { display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 320px', gap: 16, alignItems: 'start' } },
          React.createElement('div', { style: { display: 'grid', gap: 16 } },
            React.createElement(IssuerSection, { s: s, canManage: canManage, highlight: derived.rec === 'issuer' }),
            React.createElement(NumberingSection, { s: s, canManage: canManage, highlight: derived.rec === 'numbering' }),
            React.createElement(SignatureSection, { s: s, canManage: canManage, highlight: derived.rec === 'signature' }),
            React.createElement(GatewaySection, { s: s, canManage: canManage, highlight: derived.rec === 'gateway', derived: derived })),
          React.createElement(ReadinessRail, { s: s, derived: derived, onJump: jump }))));
  }

  window.Settings = { DesktopSettings, deriveAll: deriveAll, signatureStatus: signatureStatus, issuerStatus: issuerStatus, numberingStatus: numberingStatus, gatewayStatus: gatewayStatus, fmt: fmt };
})();
