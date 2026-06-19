/* Mobile — Invoicing Settings · SRI (slice 05). RECONCILED to the frozen
   contract (shares window.Settings derivations). Not a shrunk desktop: a stacked
   readiness narrative, compact section entry points, and controlled expansion of
   technical evidence in bottom sheets. window.MobileSettings. */
(function () {
  const { useState } = React;
  const I = window.Icon;
  const { Btn, Pill } = window.UI;
  const { MobileTopBar, BottomTabs, Sheet } = window.Chrome;
  const ST = window.Settings; // deriveAll, signatureStatus, issuerStatus, numberingStatus, gatewayStatus, fmt

  const SECTION_META = {
    issuer:    { icon: 'building', label: 'Perfil del emisor', tag: 'Identidad fiscal' },
    numbering: { icon: 'hash',     label: 'Numeración',        tag: 'Serie · secuencial' },
    signature: { icon: 'key',      label: 'Firma electrónica', tag: 'Certificado' },
    gateway:   { icon: 'server',   label: 'Gateway SRI',       tag: 'Conexión' }
  };
  const STATUS_PILL = {
    complete: { tone: 'success', label: 'Configurado' }, incomplete: { tone: 'warning', label: 'Por completar' },
    usable: { tone: 'success', label: 'Vigente' }, expiring: { tone: 'warning', label: 'Por vencer' },
    expired: { tone: 'danger', label: 'Caducada' }, not_yet: { tone: 'warning', label: 'Aún no vigente' },
    inactive: { tone: 'neutral', label: 'Deshabilitada' }, invalid: { tone: 'danger', label: 'Con hallazgos' },
    missing: { tone: 'neutral', label: 'No configurada' }
  };
  const TONE_COLOR = { success: 'var(--success)', warning: 'var(--warning)', danger: 'var(--danger)', info: 'var(--info)', neutral: 'var(--text-muted)' };
  const TONE_SOFT = { success: 'var(--success-soft)', warning: 'var(--warning-soft)', danger: 'var(--danger-soft)', info: 'var(--info-soft)', neutral: 'var(--surface-sunken)' };
  const TONE_ON = { success: 'var(--on-success-soft)', warning: 'var(--on-warning-soft)', danger: 'var(--on-danger-soft)', info: 'var(--on-info-soft)', neutral: 'var(--text-muted)' };
  const VALIDITY_LABEL = { valid: 'Vigente', expiring_soon: 'Por vencer', expired: 'Vencido', not_yet_valid: 'Aún no vigente', not_applicable: 'No aplica', unknown: 'Desconocida' };
  const PROOF_LABEL = { verified: 'Verificada', failed: 'Fallida', unknown: 'Pendiente', not_applicable: 'No aplica' };

  function statusOf(s, key) {
    if (key === 'issuer') return ST.issuerStatus(s.issuer);
    if (key === 'numbering') return ST.numberingStatus(s.numbering);
    if (key === 'signature') return ST.signatureStatus(s.signature);
    return ST.gatewayStatus(s.submission);
  }

  function MRow({ label, value, mono, missing }) {
    return React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: 12, padding: '9px 0', borderBottom: '1px solid var(--divider)' } },
      React.createElement('span', { style: { flex: 'none', fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', minWidth: 120 } }, label),
      missing
        ? React.createElement('span', { style: { flex: 1, textAlign: 'right', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--on-warning-soft)' } }, 'Por completar')
        : React.createElement('span', { style: { flex: 1, textAlign: 'right', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-strong)', fontFamily: mono ? 'var(--font-mono)' : 'inherit', wordBreak: mono ? 'break-all' : 'normal' } }, value));
  }
  function SheetAction({ s, primary, leading, label }) {
    if (!s.permission.canManage) return React.createElement(Btn, { variant: 'secondary', full: true, leading: 'lock', disabled: true }, 'Solo lectura');
    return React.createElement(Btn, { variant: primary ? 'primary' : 'secondary', full: true, leading: leading }, label);
  }

  function IssuerSheet({ s }) {
    const x = s.issuer; const st = ST.issuerStatus(x);
    const align = !x.extractedCertificateTaxId ? ['neutral', 'key', 'Carga la firma para contrastar el RUC.']
      : x.taxIdMatchesCertificate === true ? ['success', 'shieldCheck', 'El RUC coincide con el certificado (' + x.extractedCertificateTaxId + ').']
      : ['warning', 'alert', 'El RUC no coincide con el certificado (' + x.extractedCertificateTaxId + ').'];
    return React.createElement('div', null,
      React.createElement('div', { style: { marginBottom: 12 } },
        React.createElement(MRow, { label: 'Razón social', value: x.legalName }),
        React.createElement(MRow, { label: 'Nombre comercial', value: x.commercialName || '—' }),
        React.createElement(MRow, { label: 'RUC', value: x.taxId, mono: true }),
        React.createElement(MRow, { label: 'Ambiente', value: x.environment === 'production' ? 'Producción' : 'Pruebas' }),
        React.createElement(MRow, { label: 'Contrib. especial', value: x.specialTaxpayerCode || 'No' }),
        React.createElement(MRow, { label: 'RIMPE', value: x.rimpeTaxpayerType || 'No aplica' }),
        React.createElement(MRow, { label: 'Obligado contab.', value: x.accountingObligated ? 'Sí' : 'No' }),
        React.createElement(MRow, { label: 'Dir. matriz', value: x.matrixAddress, missing: !x.matrixAddress }),
        React.createElement(MRow, { label: 'Dir. establec.', value: x.establishmentAddress, missing: !x.establishmentAddress })),
      React.createElement('div', { style: { display: 'flex', gap: 9, padding: '11px', borderRadius: 'var(--radius-sm)', background: TONE_SOFT[align[0]], color: TONE_ON[align[0]], marginBottom: 14 } },
        React.createElement('span', { style: { color: TONE_COLOR[align[0]], flex: 'none', display: 'inline-flex' } }, I({ name: align[1], size: 16 })),
        React.createElement('span', { style: { fontSize: 'var(--text-xs)', lineHeight: 1.4 } }, align[2])),
      React.createElement(SheetAction, { s: s, primary: st === 'incomplete', leading: 'fileEdit', label: 'Guardar perfil fiscal' }));
  }
  function NumberingSheet({ s }) {
    const x = s.numbering; const seq = x.nextSequenceNumber != null ? String(x.nextSequenceNumber).padStart(9, '0') : null;
    return React.createElement('div', null,
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 } }, React.createElement(Pill, { tone: 'primary' }, x.documentCode + ' · ' + x.documentLabel)),
      React.createElement('div', { style: { display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 6, padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)', border: '1px solid var(--border)', marginBottom: 8, flexWrap: 'wrap' } },
        [['Estab.', x.establishmentCode, '—'], ['PtoEmi', x.emissionPointCode, '000'], ['Secuencial', seq, '000000000']].map(function (seg, i) {
          return React.createElement('div', { key: i, style: { display: 'contents' } },
            i > 0 && React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 20, color: 'var(--text-subtle)', marginTop: 4 } }, '–'),
            React.createElement('div', { style: { display: 'grid', gap: 5, justifyItems: 'center' } },
              React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 600, color: seg[1] ? 'var(--text-strong)' : 'var(--text-subtle)', padding: '5px 8px', borderRadius: 6, background: seg[1] ? 'var(--surface)' : 'transparent', border: seg[1] ? '1px solid var(--border)' : '1px dashed var(--border-strong)' } }, seg[1] || seg[2]),
              React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)' } }, seg[0])));
        })),
      React.createElement('p', { style: { margin: '0 0 14px', fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', textAlign: 'center' } }, x.previewNumber ? 'Próxima factura sugerida: ' + x.previewNumber : 'Configura el punto de emisión y el secuencial.'),
      x.otherPoints && x.otherPoints.length > 0 && React.createElement('div', { style: { display: 'grid', gap: 6, marginBottom: 14 } },
        x.otherPoints.map(function (p, i) {
          return React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px', borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)', border: '1px solid var(--border)' } },
            React.createElement(Pill, { tone: 'neutral' }, p.documentCode),
            React.createElement('span', { style: { flex: 1, fontSize: 'var(--text-xs)', color: 'var(--text)' } }, p.documentLabel),
            React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-strong)' } }, p.previewNumber));
        })),
      React.createElement(SheetAction, { s: s, primary: ST.numberingStatus(x) === 'incomplete', leading: 'fileEdit', label: ST.numberingStatus(x) === 'incomplete' ? 'Configurar numeración' : 'Guardar numeración' }));
  }
  function SignatureSheet({ s }) {
    const x = s.signature; const st = ST.signatureStatus(x); const insp = x.inspection;
    if (st === 'missing') {
      return React.createElement('div', null,
        React.createElement('div', { style: { display: 'flex', gap: 11, padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--danger-soft)', color: 'var(--on-danger-soft)', marginBottom: 14 } },
          React.createElement('span', { style: { color: 'var(--danger)', flex: 'none', display: 'inline-flex' } }, I({ name: 'shieldAlert', size: 18 })),
          React.createElement('div', null,
            React.createElement('strong', { style: { fontSize: 'var(--text-sm)' } }, 'No hay material de firma'),
            React.createElement('p', { style: { margin: '3px 0 0', fontSize: 'var(--text-xs)', lineHeight: 1.4 } }, 'Sin certificado vigente no se puede emitir al SRI.'))),
        React.createElement(MRow, { label: 'Provider', value: x.provider }),
        React.createElement(MRow, { label: 'Storage mode', value: x.storageMode }),
        React.createElement('div', { style: { height: 12 } }),
        React.createElement(SheetAction, { s: s, primary: true, leading: 'download', label: 'Cargar certificado' }));
    }
    const sp = STATUS_PILL[st]; const days = insp.daysUntilExpiry;
    const [open, setOpen] = useState(st === 'expired' || insp.status === 'invalid');
    return React.createElement('div', null,
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, padding: '13px', borderRadius: 'var(--radius-md)', background: TONE_SOFT[sp.tone], marginBottom: 12 } },
        React.createElement('span', { style: { width: 38, height: 38, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: 'var(--surface)', color: TONE_COLOR[sp.tone] } }, I({ name: st === 'expired' ? 'shieldAlert' : 'shieldCheck', size: 19 })),
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('div', { style: { fontSize: 'var(--text-h3)', fontWeight: 800, color: TONE_COLOR[sp.tone] } }, st === 'expired' ? 'Caducada' : (days != null ? days + ' días' : sp.label)),
          React.createElement('div', { style: { fontSize: 'var(--text-2xs)', color: TONE_ON[sp.tone] } }, insp.validUntil ? ((st === 'expired' ? 'Venció ' : 'Vence ') + ST.fmt(insp.validUntil)) : 'Sin fecha')),
        React.createElement(Pill, { tone: sp.tone, dot: true }, sp.label)),
      React.createElement(MRow, { label: 'Nombre cert.', value: x.certificateLabel }),
      React.createElement(MRow, { label: 'Provider', value: x.provider }),
      React.createElement(MRow, { label: 'Habilitada', value: x.isActive ? 'Sí' : 'No' }),
      React.createElement('button', { className: 'ds-focusable', onClick: function () { setOpen(function (o) { return !o; }); }, 'aria-expanded': open,
        style: { display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '11px 0', background: 'transparent', border: 'none', borderBottom: '1px solid var(--divider)', cursor: 'pointer', color: 'var(--text)' } },
        React.createElement('span', { style: { color: 'var(--text-muted)', display: 'inline-flex' } }, I({ name: 'fileText', size: 15 })),
        React.createElement('span', { style: { flex: 1, textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)' } }, 'Inspección del certificado'),
        React.createElement('span', { style: { color: 'var(--text-subtle)', display: 'inline-flex', transform: open ? 'rotate(180deg)' : 'none', transition: 'var(--transition-base)' } }, I({ name: 'chevronDown', size: 16 }))),
      open && React.createElement('div', { style: { padding: '4px 0 10px' } },
        React.createElement(MRow, { label: 'Subject (CN)', value: insp.extractedSubjectName, mono: true }),
        React.createElement(MRow, { label: 'RUC extraído', value: insp.extractedTaxId, mono: true }),
        React.createElement(MRow, { label: 'Emisora', value: insp.extractedIssuerName }),
        React.createElement(MRow, { label: 'Validez', value: VALIDITY_LABEL[insp.certificateValidityStatus] }),
        React.createElement(MRow, { label: 'Desde', value: ST.fmt(insp.validFrom) }),
        React.createElement(MRow, { label: 'Hasta', value: ST.fmt(insp.validUntil) }),
        React.createElement(MRow, { label: 'Prueba cripto.', value: PROOF_LABEL[insp.cryptographicProofStatus] }),
        React.createElement(MRow, { label: 'Fingerprint', value: insp.extractedFingerprint, mono: true })),
      React.createElement('div', { style: { marginTop: 12 } },
        React.createElement(SheetAction, { s: s, primary: st !== 'usable', leading: st === 'usable' ? 'refresh' : 'download', label: st === 'usable' ? 'Reemplazar certificado' : 'Renovar firma' })));
  }
  function GatewaySheet({ s }) {
    const x = s.submission; const r = s.readiness; const st = ST.gatewayStatus(x);
    const conn = (x.gatewayConfigured && x.isActive) ? ['success', 'check', 'Gateway configurado y habilitado']
      : x.gatewayConfigured ? ['warning', 'alert', 'Configurado pero deshabilitado'] : ['warning', 'alert', 'Configuración incompleta'];
    const COLS = [['numberingConfigured', 'Num.'], ['previewAvailable', 'XML'], ['rideAvailable', 'RIDE'], ['schemaValidationAvailable', 'XSD'], ['submitSupported', 'Envío']];
    return React.createElement('div', null,
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 9, padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: TONE_SOFT[conn[0]], color: TONE_ON[conn[0]], marginBottom: 12 } },
        React.createElement('span', { style: { color: TONE_COLOR[conn[0]], display: 'inline-flex' } }, I({ name: conn[1], size: 16 })),
        React.createElement('span', { style: { fontSize: 'var(--text-sm)', fontWeight: 600 } }, conn[2])),
      React.createElement(MRow, { label: 'Provider', value: x.provider }),
      React.createElement(MRow, { label: 'Ambiente', value: x.environment === 'production' ? 'Producción' : 'Pruebas' }),
      React.createElement(MRow, { label: 'Transmisión', value: x.transmissionMode }),
      React.createElement(MRow, { label: 'Timeout', value: (x.timeoutMs / 1000) + ' s' }),
      React.createElement(MRow, { label: 'Recepción', value: x.receptionUrl, mono: true }),
      React.createElement(MRow, { label: 'Autorización', value: x.authorizationUrl, mono: true, missing: !x.authorizationUrl }),
      React.createElement('div', { className: 'ds-eyebrow', style: { margin: '14px 0 6px', color: 'var(--text-subtle)' } }, 'Preparación de sandbox'),
      React.createElement('div', { style: { display: 'grid', gap: 5, marginBottom: 12 } },
        [['Validación local', r.isReadyForLocalStubSubmission], ['Remoto · XML prefirmado', r.isReadyForPresignedRemoteSandboxSubmission], ['Remoto · firma interna', r.isReadyForRemoteSandboxSubmission]].map(function (t, i) {
          const tone = t[1] ? 'success' : 'neutral';
          return React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 9 } },
            React.createElement('span', { style: { width: 18, height: 18, flex: 'none', borderRadius: 999, display: 'grid', placeItems: 'center', background: TONE_SOFT[tone], color: TONE_COLOR[tone] } }, I({ name: t[1] ? 'check' : 'circleDot', size: 11 })),
            React.createElement('span', { style: { fontSize: 'var(--text-xs)', color: t[1] ? 'var(--text-strong)' : 'var(--text-muted)', fontWeight: t[1] ? 600 : 500 } }, t[0]));
        })),
      React.createElement('div', { className: 'ds-eyebrow', style: { margin: '4px 0 8px', color: 'var(--text-subtle)' } }, 'Comprobantes soportados'),
      React.createElement('div', { style: { display: 'grid', gap: 6, marginBottom: 14 } },
        r.documentSupport.map(function (dd, i) {
          return React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 9px', borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)', border: '1px solid var(--border)' } },
            React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', flex: 'none', width: 18 } }, dd.documentCode),
            React.createElement('span', { style: { flex: 1, fontSize: 'var(--text-2xs)', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, dd.label),
            React.createElement('span', { style: { display: 'flex', gap: 5, flex: 'none' } },
              COLS.map(function (c) { const ok = dd[c[0]]; return React.createElement('span', { key: c[0], title: c[1], style: { color: ok ? 'var(--success)' : 'var(--text-subtle)', display: 'inline-flex' } }, I({ name: ok ? 'check' : 'x', size: 12 })); })));
        })),
      React.createElement(SheetAction, { s: s, primary: st === 'incomplete', leading: st === 'incomplete' ? 'zap' : 'refresh', label: st === 'incomplete' ? 'Guardar gateway SRI' : 'Probar conexión' }));
  }
  const SHEETS = { issuer: IssuerSheet, numbering: NumberingSheet, signature: SignatureSheet, gateway: GatewaySheet };

  function MobileSettingsScreen({ d, stateKey, mood, onMood }) {
    const s = d.scenarios[stateKey];
    const canManage = s.permission.canManage;
    const r = s.readiness;
    const derived = ST.deriveAll(s);
    const [sheet, setSheet] = useState(null);
    const [moodOpen, setMoodOpen] = useState(false);

    const verdictMap = {
      ready: ['success', 'shieldCheck', 'Listo para emitir'],
      warning: ['warning', 'shieldAlert', 'Listo, con un aviso'],
      incomplete: ['warning', 'shieldAlert', 'Falta configurar'],
      blocked: ['danger', 'ban', 'Emisión bloqueada']
    };
    const v = verdictMap[derived.verdict] || verdictMap.incomplete;
    const items = r.blockers.map(function (t) { return { kind: 'blocker', text: t }; }).concat(r.warnings.map(function (t) { return { kind: 'warning', text: t }; }));
    const SheetBody = sheet ? SHEETS[sheet] : null;
    const recTitle = derived.verdict === 'ready' ? 'Todo listo para emitir' : 'Siguiente paso';

    return React.createElement('div', { style: { height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--app-bg)' } },
      React.createElement(MobileTopBar, { tenant: d.tenant, onTenant: function () {}, onMood: function () { setMoodOpen(true); }, onAssistant: function () {} }),
      React.createElement('div', { style: { flex: 'none', padding: '12px 14px 10px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' } },
        React.createElement('div', { className: 'ds-eyebrow' }, 'Invoicing · Config'),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 } },
          React.createElement('h1', { style: { margin: 0, flex: 1, fontSize: 'var(--text-h1)', fontWeight: 800, letterSpacing: 'var(--track-snug)', color: 'var(--text-strong)' } }, 'Configuración SRI'),
          React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-2xs)', fontWeight: 700, color: 'var(--text-strong)', background: 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: 'var(--radius-pill)', padding: '4px 10px' } },
            React.createElement('span', { style: { width: 6, height: 6, borderRadius: 999, background: s.issuer.environment === 'production' ? 'var(--success)' : 'var(--warning)' } }),
            s.issuer.environment === 'production' ? 'Producción' : 'Pruebas'))),

      React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: 14, display: 'grid', gap: 12, alignContent: 'start' } },
        React.createElement('div', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: '4px solid ' + TONE_COLOR[v[0]], borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: '15px 16px' } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12 } },
            React.createElement('span', { style: { width: 44, height: 44, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: TONE_SOFT[v[0]], color: TONE_COLOR[v[0]] } }, I({ name: v[1], size: 22 })),
            React.createElement('div', { style: { flex: 1, minWidth: 0 } },
              React.createElement('div', { className: 'ds-eyebrow', style: { color: 'var(--text-subtle)' } }, 'Preparación SRI'),
              React.createElement('h2', { style: { margin: '1px 0 0', fontSize: 'var(--text-h2)', fontWeight: 800, color: 'var(--text-strong)' } }, v[2]))),
          React.createElement('div', { style: { display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 10, fontSize: 'var(--text-2xs)', fontWeight: 700, color: TONE_ON[derived.tier === 'remote_internal' || derived.tier === 'remote_presigned' ? 'success' : derived.tier === 'local_stub' ? 'warning' : 'danger'], background: TONE_SOFT[derived.tier === 'remote_internal' || derived.tier === 'remote_presigned' ? 'success' : derived.tier === 'local_stub' ? 'warning' : 'danger'], borderRadius: 'var(--radius-pill)', padding: '5px 11px' } },
            I({ name: 'route', size: 13 }),
            derived.tier === 'remote_internal' ? 'Sandbox remoto listo' : derived.tier === 'remote_presigned' ? 'Sandbox · XML prefirmado' : derived.tier === 'local_stub' ? 'Solo validación local' : 'Sin ruta de envío')),

        React.createElement('div', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 15, display: 'grid', gap: 12 } },
          React.createElement('div', { style: { display: 'flex', gap: 11 } },
            React.createElement('span', { style: { width: 34, height: 34, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: TONE_SOFT[v[0]], color: TONE_COLOR[v[0]] } }, I({ name: derived.rec ? 'arrowRight' : 'shieldCheck', size: 17 })),
            React.createElement('div', null,
              React.createElement('div', { className: 'ds-eyebrow', style: { color: 'var(--text-subtle)' } }, 'Recomendación'),
              React.createElement('h3', { style: { margin: '1px 0 0', fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' } }, recTitle))),
          React.createElement('p', { style: { margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.5 } }, r.recommendedNextStep),
          canManage
            ? React.createElement(Btn, { variant: derived.verdict === 'ready' ? 'secondary' : 'primary', full: true, trailing: 'arrowRight', onClick: function () { if (derived.rec) setSheet(derived.rec); } }, derived.rec ? 'Abrir ' + SECTION_META[derived.rec].label.toLowerCase() : 'Ir a facturas')
            : React.createElement(Btn, { variant: 'secondary', full: true, leading: 'lock', disabled: true }, 'Solo lectura')),

        items.length > 0 && React.createElement('div', { style: { display: 'grid', gap: 8 } },
          items.map(function (it, i) {
            const tone = it.kind === 'blocker' ? 'danger' : 'warning';
            return React.createElement('button', { key: i, className: 'ds-focusable', onClick: function () { setSheet(derived.rec || 'gateway'); },
              style: { display: 'flex', gap: 10, textAlign: 'left', width: '100%', padding: '11px 12px', borderRadius: 'var(--radius-sm)', background: TONE_SOFT[tone], border: 'none', borderLeft: '3px solid ' + TONE_COLOR[tone], cursor: 'pointer' } },
              React.createElement('span', { style: { color: TONE_COLOR[tone], flex: 'none', display: 'inline-flex', marginTop: 1 } }, I({ name: it.kind === 'blocker' ? 'ban' : 'alert', size: 15 })),
              React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: TONE_ON[tone], lineHeight: 1.4 } }, it.text));
          })),

        React.createElement('div', { className: 'ds-eyebrow', style: { marginTop: 4, color: 'var(--text-subtle)' } }, 'Bloques de configuración'),
        React.createElement('div', { style: { display: 'grid', gap: 8 } },
          ['issuer', 'numbering', 'signature', 'gateway'].map(function (key) {
            const meta = SECTION_META[key]; const sp = STATUS_PILL[statusOf(s, key)] || STATUS_PILL.incomplete;
            return React.createElement('button', { key: key, className: 'ds-focusable', onClick: function () { setSheet(key); },
              style: { display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', padding: '13px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', cursor: 'pointer' } },
              React.createElement('span', { style: { width: 38, height: 38, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: TONE_SOFT[sp.tone], color: TONE_COLOR[sp.tone] } }, I({ name: meta.icon, size: 19 })),
              React.createElement('span', { style: { flex: 1, minWidth: 0, display: 'grid', gap: 2 } },
                React.createElement('span', { style: { fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)' } }, meta.label),
                React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' } }, meta.tag)),
              React.createElement(Pill, { tone: sp.tone, dot: true }, sp.label),
              React.createElement('span', { style: { color: 'var(--text-subtle)', flex: 'none', display: 'inline-flex' } }, I({ name: 'chevronRight', size: 16 })));
          })),
        React.createElement('p', { style: { margin: '4px 2px 0', fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', lineHeight: 1.5 } }, 'El envío y la autorización ante el SRI ocurren en cada factura, no aquí.')),

      React.createElement(BottomTabs, { active: 'readiness', onTab: function () {} }),

      sheet && SheetBody && React.createElement(Sheet, { title: SECTION_META[sheet].label, onClose: function () { setSheet(null); } }, React.createElement(SheetBody, { s: s })),
      moodOpen && React.createElement(Sheet, { title: 'Modo de diseño', onClose: function () { setMoodOpen(false); } },
        React.createElement(window.UI.MoodMenu, { value: mood, onChange: function (m) { onMood(m); }, moods: d.moods })));
  }

  window.MobileSettings = { MobileSettingsScreen };
})();
