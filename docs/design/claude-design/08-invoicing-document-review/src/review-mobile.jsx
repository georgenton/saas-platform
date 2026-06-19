/* Mobile — Invoicing Document Review (slice 08). Purpose-built, not a shrunk
   desk: status at top, issuer/buyer cards stacked, line items readable, totals
   near the bottom, artifact actions grouped in a focused sheet, access-key
   chunks copy-friendly. Shares window.Review helpers + the real contracts.
   window.MobileReview. */
(function () {
  var useState = React.useState;
  var I = window.Icon;
  var UI = window.UI;
  var Btn = UI.Btn, Pill = UI.Pill, Banner = UI.Banner;
  var Chrome = window.Chrome;
  var MobileTopBar = Chrome.MobileTopBar, BottomTabs = Chrome.BottomTabs, Sheet = Chrome.Sheet;
  var D = window.REVIEW_DATA;
  var money = window.Review.money, pct = window.Review.pct, fmtDate = window.Review.fmtDate,
      STATUS_PILL = window.Review.STATUS_PILL, elecMeta = window.Review.elecMeta, computeReadiness = window.Review.computeReadiness;

  function MFact(props) {
    return React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--divider)' } },
      React.createElement('span', { style: { flex: 'none', fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', minWidth: 92 } }, props.label),
      React.createElement('span', { style: { flex: 1, textAlign: 'right', fontSize: 'var(--text-sm)', fontWeight: 500, color: props.missing ? 'var(--on-warning-soft)' : 'var(--text-strong)', fontFamily: props.mono ? 'var(--font-mono)' : 'inherit', wordBreak: props.mono ? 'break-all' : 'normal' } }, props.missing ? (props.empty || 'Falta') : props.value));
  }
  function Card(props) {
    return React.createElement('div', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 14 } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 } },
        React.createElement('span', { style: { color: 'var(--text-muted)', display: 'inline-flex' } }, I({ name: props.icon, size: 15 })),
        React.createElement('span', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--text-subtle)' } }, props.title),
        props.badge),
      props.children);
  }

  function ArtifactsSheetBody(props) {
    var s = props.s;
    var doc = s.document, ride = s.ride, art = s.artifacts, inv = doc.invoice, loading = s.actionLoading;
    var authorized = !!(ride && ride.ride.canBePrintedAsAuthorized && inv.electronicStatus === 'authorized');
    function Item(icon, title, sub, action) {
      return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 11, padding: '12px 0', borderBottom: '1px solid var(--divider)' } },
        React.createElement('span', { style: { width: 34, height: 34, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: 'var(--primary-soft)', color: 'var(--primary)' } }, I({ name: icon, size: 16 })),
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('div', { style: { fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)' } }, title),
          React.createElement('div', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', fontFamily: /\.(html|xml)$/.test(sub) ? 'var(--font-mono)' : 'inherit', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, sub)),
        action);
    }
    return React.createElement('div', { style: { display: 'grid', gap: 4, paddingBottom: 4 } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 9, padding: '10px 12px', borderRadius: 'var(--radius-sm)', marginBottom: 8, background: authorized ? 'var(--success-soft)' : 'var(--info-soft)', color: authorized ? 'var(--on-success-soft)' : 'var(--on-info-soft)' } },
        React.createElement('span', { style: { color: authorized ? 'var(--success)' : 'var(--info)', flex: 'none', display: 'inline-flex' } }, I({ name: authorized ? 'shieldCheck' : 'shield', size: 16 })),
        React.createElement('span', { style: { fontSize: 'var(--text-xs)', lineHeight: 1.4 } }, authorized ? 'Imprimible como comprobante autorizado.' : 'Referencial — revisar no es enviar al SRI.')),
      Item('printer', 'Versión imprimible', 'Vista del documento', React.createElement(Btn, { variant: 'secondary', size: 'sm', leading: 'externalLink', disabled: loading === 'open-invoice-document', onClick: function () {} }, 'Abrir')),
      ride
        ? Item('fileText', 'RIDE electrónico', (art && art.rideHtmlFileName) || 'RIDE', React.createElement('div', { style: { display: 'flex', gap: 6 } },
            React.createElement(Btn, { variant: 'ghost', size: 'sm', leading: 'externalLink', disabled: loading === 'open-invoice-ride', onClick: function () {} }, 'Abrir'),
            React.createElement(Btn, { variant: 'ghost', size: 'sm', leading: 'download', disabled: loading === 'download-invoice-ride' || !(art && art.canDownloadRide), onClick: function () {} }, 'RIDE')))
        : Item('fileText', 'RIDE electrónico', 'Aún no generado', React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)' } }, '—')),
      (art && art.canDownloadXml)
        ? Item('fileCode', 'XML preliminar', art.xmlFileName, React.createElement(Btn, { variant: 'ghost', size: 'sm', leading: 'download', disabled: loading === 'download-invoice-xml', onClick: function () {} }, 'XML'))
        : Item('fileCode', 'XML preliminar', 'No disponible', React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)' } }, 'No disp.')),
      ride && ride.ride.accessKeyChunks.length > 0 && React.createElement('div', { style: { marginTop: 10, display: 'grid', gap: 5 } },
        React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' } }, 'Clave de acceso'),
        React.createElement('code', { style: { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-strong)', lineHeight: 1.6, wordBreak: 'break-all', background: 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', padding: '8px 10px' } }, ride.ride.accessKeyChunks.join(' · '))));
  }

  function MobileReviewScreen(props) {
    var s = props.s, mood = props.mood, onMood = props.onMood;
    var canManage = s.permission.canManage;
    var sheetState = useState(null); var sheet = sheetState[0], setSheet = sheetState[1];
    var moodState = useState(false); var moodOpen = moodState[0], setMoodOpen = moodState[1];

    if (!s.document) {
      return React.createElement('div', { style: { height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--app-bg)' } },
        React.createElement(MobileTopBar, { tenant: D.tenant, onTenant: function () {}, onMood: function () { setMoodOpen(true); }, onAssistant: function () {} }),
        React.createElement('div', { style: { flex: 1, display: 'grid', placeItems: 'center', padding: 24, textAlign: 'center' } },
          React.createElement('div', { style: { display: 'grid', gap: 12, justifyItems: 'center' } },
            React.createElement('span', { style: { width: 52, height: 52, borderRadius: 'var(--radius-md)', display: 'grid', placeItems: 'center', background: 'var(--surface-sunken)', color: 'var(--text-subtle)' } }, I({ name: 'receipt', size: 25 })),
            React.createElement('h2', { style: { margin: 0, fontSize: 'var(--text-h2)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Selecciona una factura'),
            React.createElement('p', { style: { margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.5 } }, 'Elige una factura del listado para revisarla.'))),
        React.createElement(BottomTabs, { active: 'queue', onTab: function () {} }),
        moodOpen && React.createElement(Sheet, { title: 'Modo de diseño', onClose: function () { setMoodOpen(false); } }, React.createElement(UI.MoodMenu, { value: mood, onChange: function (m) { onMood(m); }, moods: D.moods })));
    }

    var doc = s.document, inv = doc.invoice, ride = s.ride, art = s.artifacts;
    var r = computeReadiness(s);
    var sp = STATUS_PILL[inv.status] || STATUS_PILL.draft;
    var em = elecMeta(inv.electronicStatus);
    var authorized = !!(ride && ride.ride.canBePrintedAsAuthorized && inv.electronicStatus === 'authorized');
    var cus = doc.customer, iss = doc.issuer;
    var idLabel = cus.identificationType ? ({ '04': 'RUC', '05': 'Cédula', '06': 'Pasaporte', '07': 'Consumidor final', '08': 'Exterior' }[cus.identificationType] || cus.identificationType) : null;

    return React.createElement('div', { style: { height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--app-bg)' } },
      React.createElement(MobileTopBar, { tenant: D.tenant, onTenant: function () {}, onMood: function () { setMoodOpen(true); }, onAssistant: function () {} }),
      /* status header */
      React.createElement('div', { style: { flex: 'none', padding: '12px 14px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' } },
        React.createElement('div', { className: 'ds-eyebrow' }, 'Invoicing · Revisión'),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 } },
          React.createElement('span', { style: { flex: 1, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-h2)', fontWeight: 700, color: 'var(--text-strong)' } }, inv.number),
          React.createElement(Pill, { tone: sp.tone, dot: true }, sp.label)),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 7, marginTop: 7 } },
          React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-2xs)', fontWeight: 700, color: 'var(--on-' + em.tone + '-soft)', background: 'var(--' + em.tone + '-soft)', borderRadius: 'var(--radius-pill)', padding: '4px 10px' } }, I({ name: 'shield', size: 12 }), em.label),
          React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-2xs)', fontWeight: 700, color: 'var(--text-strong)', background: 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: 'var(--radius-pill)', padding: '4px 10px' } },
            React.createElement('span', { style: { width: 6, height: 6, borderRadius: 999, background: iss.environment === 'production' ? 'var(--success)' : 'var(--warning)' } }), iss.environment === 'production' ? 'Producción' : (iss.environment ? 'Pruebas' : 'Sin ambiente')))),

      React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: 14, display: 'grid', gap: 10, alignContent: 'start' } },
        !canManage && React.createElement(Banner, { tone: 'info', icon: 'lock', title: 'Solo lectura' }, 'Algunas descargas pueden estar limitadas para tu rol.'),
        /* readiness chip */
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 13px', borderRadius: 'var(--radius-md)', background: r.ready ? 'var(--success-soft)' : 'var(--warning-soft)', color: r.ready ? 'var(--on-success-soft)' : 'var(--on-warning-soft)' } },
          React.createElement('span', { style: { color: r.ready ? 'var(--success)' : 'var(--warning)', flex: 'none', display: 'inline-flex' } }, I({ name: r.ready ? 'scan' : 'alert', size: 18 })),
          React.createElement('span', { style: { fontSize: 'var(--text-sm)', fontWeight: 600, lineHeight: 1.4 } }, r.ready ? 'Documento listo para previsualizar. Revisar no es enviar al SRI.' : 'Revisa lo pendiente antes de previsualizar.')),
        !r.ready && React.createElement('div', { style: { display: 'grid', gap: 6 } },
          r.blocking.map(function (c) {
            return React.createElement('div', { key: c.key, style: { display: 'flex', gap: 9, padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--warning-soft)', borderLeft: '3px solid var(--warning)' } },
              React.createElement('span', { style: { color: 'var(--warning)', flex: 'none', display: 'inline-flex', marginTop: 1 } }, I({ name: 'alert', size: 14 })),
              React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--on-warning-soft)', lineHeight: 1.4 } }, React.createElement('strong', { style: { fontWeight: 700 } }, c.label + ': '), c.detail));
          })),

        /* issuer / buyer stacked */
        React.createElement(Card, { icon: 'building', title: 'Emisor' },
          React.createElement('div', { style: { fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)', marginBottom: 4 } }, iss.legalName),
          React.createElement(MFact, { label: 'RUC', value: iss.taxId, mono: true, missing: !iss.taxId, empty: 'Falta RUC' }),
          React.createElement(MFact, { label: 'Matriz', value: iss.matrixAddress, missing: !iss.matrixAddress, empty: 'Falta dirección' })),
        React.createElement(Card, { icon: 'user', title: 'Comprador' },
          React.createElement('div', { style: { fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)', marginBottom: 4 } }, cus.name || 'Sin comprador'),
          React.createElement(MFact, { label: 'Tipo', value: idLabel, missing: !idLabel, empty: 'Sin tipo' }),
          React.createElement(MFact, { label: 'Ident.', value: cus.identification || cus.taxId, mono: true, missing: !(cus.identification || cus.taxId), empty: 'Falta identificación' }),
          React.createElement(MFact, { label: 'Dirección', value: cus.billingAddress, missing: !cus.billingAddress, empty: 'Sin dirección' })),
        /* numbering */
        React.createElement(Card, { icon: 'hash', title: 'Numeración' },
          React.createElement(MFact, { label: 'Documento', value: (inv.documentCode || '—') + ' · Factura' }),
          React.createElement(MFact, { label: 'Serie', value: (inv.establishmentCode || '---') + '-' + (inv.emissionPointCode || '---'), mono: true }),
          React.createElement(MFact, { label: 'Secuencial', value: inv.sequenceNumber != null ? String(inv.sequenceNumber).padStart(9, '0') : 'Manual', mono: true })),
        /* lines */
        React.createElement('div', null,
          React.createElement('span', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--text-subtle)' } }, doc.lines.length === 0 ? 'Sin líneas' : (doc.lines.length === 1 ? '1 línea' : doc.lines.length + ' líneas')),
          doc.lines.length === 0
            ? React.createElement('div', { style: { marginTop: 6, display: 'flex', gap: 9, padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--warning-soft)', color: 'var(--on-warning-soft)' } },
                React.createElement('span', { style: { color: 'var(--warning)', flex: 'none', display: 'inline-flex' } }, I({ name: 'alert', size: 16 })),
                React.createElement('span', { style: { fontSize: 'var(--text-xs)', lineHeight: 1.4 } }, 'La factura no tiene líneas. Agrégalas en la composición.'))
            : React.createElement('div', { style: { marginTop: 6, display: 'grid', gap: 8 } },
                doc.lines.map(function (l) {
                  return React.createElement('div', { key: l.id, style: { display: 'flex', alignItems: 'flex-start', gap: 10, padding: '11px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' } },
                    React.createElement('span', { style: { width: 22, height: 22, flex: 'none', borderRadius: 999, display: 'grid', placeItems: 'center', background: 'var(--surface-sunken)', border: '1px solid var(--border)', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginTop: 1 } }, l.position),
                    React.createElement('div', { style: { flex: 1, minWidth: 0 } },
                      React.createElement('div', { style: { fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)' } }, l.description),
                      React.createElement('div', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', marginTop: 2 } }, l.quantity + ' × ' + money(l.unitPriceInCents, inv.currency) + ' · ' + (l.taxRatePercentage !== null && l.taxRateName ? (l.taxRateName + ' ' + pct(l.taxRatePercentage) + '%') : 'Sin impuesto'))),
                    React.createElement('span', { style: { flex: 'none', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)' } }, money(l.lineTotalInCents, inv.currency)));
                }))) ),

      /* sticky totals + artifacts action */
      React.createElement('div', { style: { flex: 'none', background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '12px 14px', display: 'grid', gap: 10 } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 } },
          React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' } }, 'Subtotal ', React.createElement('span', { style: { fontFamily: 'var(--font-mono)', color: 'var(--text)', fontWeight: 600 } }, money(doc.totals.subtotalInCents, inv.currency))),
          React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' } }, 'IVA ', React.createElement('span', { style: { fontFamily: 'var(--font-mono)', color: 'var(--text)', fontWeight: 600 } }, money(doc.totals.taxInCents, inv.currency))),
          React.createElement('span', { style: { fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Total ', React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-h3)', fontWeight: 800 } }, money(doc.totals.totalInCents, inv.currency)))),
        React.createElement(Btn, { variant: 'primary', full: true, leading: 'fileText', onClick: function () { setSheet('artifacts'); } }, 'Ver artefactos' + (authorized ? ' · autorizado' : ''))),

      React.createElement(BottomTabs, { active: 'queue', onTab: function () {} }),

      sheet === 'artifacts' && React.createElement(Sheet, { title: 'Artefactos del documento', onClose: function () { setSheet(null); } }, React.createElement(ArtifactsSheetBody, { s: s })),
      moodOpen && React.createElement(Sheet, { title: 'Modo de diseño', onClose: function () { setMoodOpen(false); } }, React.createElement(UI.MoodMenu, { value: mood, onChange: function (m) { onMood(m); }, moods: D.moods })));
  }

  window.MobileReview = { MobileReviewScreen: MobileReviewScreen };
})();
