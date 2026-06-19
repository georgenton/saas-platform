/* Desktop — Invoicing Document Review (slice 08). A review desk, not a submission
   screen:
     1 readiness at a glance (is this document complete & ready to preview?)
     2 issuer / buyer identity side-by-side
     3 numbering · environment · electronic status (quiet context)
     4 line items + totals, easy to scan
     5 artifacts: printable / RIDE / XML — availability separated from authorization
   Truth rules: "Autorizado" only when ride.canBePrintedAsAuthorized && status
   authorized; downloads gated by artifacts.canDownload*. Reviewing ≠ submitting.
   window.Review. */
(function () {
  var useState = React.useState;
  var I = window.Icon;
  var UI = window.UI;
  var Btn = UI.Btn, Pill = UI.Pill, Banner = UI.Banner;
  var D = window.REVIEW_DATA;

  function money(cents, currency) {
    var v = (cents || 0) / 100;
    return '$' + v.toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + (currency && currency !== 'USD' ? ' ' + currency : '');
  }
  function pct(v) { return (Math.round(v * 100) / 100).toString(); }
  var MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  function fmtDate(iso) { if (!iso) return '—'; var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso); if (!m) return iso; return parseInt(m[3], 10) + ' ' + MONTHS[parseInt(m[2], 10) - 1] + ' ' + m[1]; }

  var STATUS_PILL = {
    draft: { tone: 'neutral', label: 'Borrador' }, issued: { tone: 'info', label: 'Emitida' },
    paid: { tone: 'success', label: 'Pagada' }, void: { tone: 'danger', label: 'Anulada' }
  };
  /* electronic status → tone + label (quiet context) */
  function elecMeta(status) {
    switch (status) {
      case 'authorized': return { tone: 'success', label: 'Autorizado' };
      case 'signed': return { tone: 'info', label: 'Firmado · referencial' };
      case 'submitted': return { tone: 'info', label: 'Enviado' };
      case 'returned': case 'rejected': return { tone: 'danger', label: 'Devuelto' };
      case 'draft': return { tone: 'neutral', label: 'Borrador' };
      default: return { tone: 'neutral', label: 'Aún no emitido' };
    }
  }

  function CopyValue(props) {
    var st = useState(false); var copied = st[0], setCopied = st[1];
    return React.createElement('button', { className: 'ds-focusable', title: 'Copiar', onClick: function () { setCopied(true); setTimeout(function () { setCopied(false); }, 1300); },
      style: { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', font: 'inherit', maxWidth: '100%' } },
      React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, props.children || props.value),
      React.createElement('span', { style: { flex: 'none', color: copied ? 'var(--success)' : 'var(--text-subtle)', display: 'inline-flex' } }, I({ name: copied ? 'check' : 'copy', size: 13 })));
  }

  /* fact line in identity cards */
  function Fact(props) {
    return React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: 10, padding: '7px 0' } },
      React.createElement('span', { style: { flex: 'none', width: 96, fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' } }, props.label),
      props.missing
        ? React.createElement('span', { style: { flex: 1, fontSize: 'var(--text-sm)', color: 'var(--on-warning-soft)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 } }, I({ name: 'alert', size: 13 }), props.empty || 'Falta')
        : React.createElement('span', { style: { flex: 1, fontSize: 'var(--text-sm)', color: 'var(--text-strong)', fontWeight: 500, fontFamily: props.mono ? 'var(--font-mono)' : 'inherit', overflow: 'hidden', textOverflow: 'ellipsis' } }, props.value));
  }

  function CardShell(props) {
    return React.createElement('section', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' } },
      React.createElement('header', { style: { display: 'flex', alignItems: 'center', gap: 11, padding: '13px var(--card-pad)', borderBottom: '1px solid var(--divider)' } },
        React.createElement('span', { style: { color: 'var(--text-muted)', display: 'inline-flex' } }, I({ name: props.icon, size: 17 })),
        React.createElement('h3', { style: { margin: 0, flex: 1, fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' } }, props.title),
        props.headerExtra),
      React.createElement('div', { style: { padding: 'var(--card-pad)' } }, props.children));
  }

  /* ===================================================== 1 · READINESS */
  function computeReadiness(s) {
    var doc = s.document;
    var checks = [];
    var iss = doc.issuer, cus = doc.customer, inv = doc.invoice;
    checks.push({ key: 'issuer', label: 'Identidad del emisor', ok: !!(iss.legalName && iss.taxId && iss.environment), detail: iss.taxId ? 'RUC y ambiente configurados.' : 'Falta RUC o ambiente del emisor.' });
    checks.push({ key: 'buyer', label: 'Identidad del comprador', ok: !!(cus.name && (cus.identification || cus.taxId)), detail: (cus.identification || cus.taxId) ? 'Comprador identificado.' : 'Falta la identificación fiscal del comprador.' });
    checks.push({ key: 'numbering', label: 'Numeración', ok: !!(inv.documentCode && inv.establishmentCode && inv.emissionPointCode && inv.sequenceNumber != null), detail: 'Serie y secuencial asignados.' });
    checks.push({ key: 'items', label: 'Líneas y totales', ok: doc.lines.length > 0, detail: doc.lines.length > 0 ? doc.lines.length + ' líneas · total ' + money(doc.totals.totalInCents, inv.currency) : 'La factura no tiene líneas.' });
    var blocking = checks.filter(function (c) { return !c.ok; });
    var ready = blocking.length === 0;
    return { checks: checks, ready: ready, blocking: blocking };
  }

  function ReadinessHeader(props) {
    var s = props.s, r = props.r;
    var inv = s.document.invoice;
    var em = elecMeta(inv.electronicStatus);
    var v = r.ready
      ? { tone: 'success', icon: 'scan', title: 'Documento listo para previsualizar', sub: 'Emisor, comprador, numeración y líneas están completos. Revisar el documento no lo envía al SRI.' }
      : { tone: 'warning', icon: 'alert', title: 'Revisa lo que falta antes de previsualizar', sub: 'Hay datos pendientes en el documento. Complétalos para una previsualización fiel.' };
    return React.createElement('div', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 16, padding: '18px var(--card-pad)', borderLeft: '4px solid var(--' + v.tone + ')', background: 'var(--' + v.tone + '-soft)' } },
        React.createElement('span', { style: { width: 46, height: 46, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: 'var(--surface)', color: 'var(--' + v.tone + ')', border: '1px solid var(--' + v.tone + ')' } }, I({ name: v.icon, size: 23 })),
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('div', { className: 'ds-eyebrow', style: { color: 'var(--on-' + v.tone + '-soft)' } }, 'Revisión del documento'),
          React.createElement('h2', { style: { margin: '2px 0 0', fontSize: 'var(--text-h1)', fontWeight: 800, letterSpacing: 'var(--track-snug)', color: 'var(--text-strong)' } }, v.title),
          React.createElement('p', { style: { margin: '3px 0 0', fontSize: 'var(--text-sm)', color: 'var(--on-' + v.tone + '-soft)', maxWidth: 600, lineHeight: 'var(--leading-body)' } }, v.sub)),
        React.createElement('div', { style: { flex: 'none', display: 'grid', gap: 6, justifyItems: 'end' } },
          React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 'var(--text-2xs)', fontWeight: 700, color: 'var(--text-strong)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-pill)', padding: '6px 12px' } },
            React.createElement('span', { style: { width: 7, height: 7, borderRadius: 999, background: (s.document.issuer.environment === 'production' ? 'var(--success)' : 'var(--warning)') } }), s.document.issuer.environment === 'production' ? 'Producción' : (s.document.issuer.environment ? 'Pruebas' : 'Ambiente no config.')),
          React.createElement('span', { title: 'Estado electrónico (contexto)', style: { display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 'var(--text-2xs)', fontWeight: 700, color: 'var(--on-' + em.tone + '-soft)', background: 'var(--' + em.tone + '-soft)', borderRadius: 'var(--radius-pill)', padding: '6px 12px' } }, I({ name: 'shield', size: 13 }), em.label))),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: '1px solid var(--divider)' } },
        r.checks.map(function (c, i) {
          return React.createElement('div', { key: c.key, title: c.detail, style: { display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', borderRight: i < 3 ? '1px solid var(--divider)' : 'none' } },
            React.createElement('span', { style: { width: 26, height: 26, flex: 'none', borderRadius: 999, display: 'grid', placeItems: 'center', background: c.ok ? 'var(--success-soft)' : 'var(--warning-soft)', color: c.ok ? 'var(--success)' : 'var(--warning)' } }, I({ name: c.ok ? 'check' : 'alert', size: 14 })),
            React.createElement('span', { style: { display: 'grid', gap: 1, minWidth: 0 } },
              React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, c.label),
              React.createElement('span', { style: { fontSize: 'var(--text-sm)', fontWeight: 700, color: c.ok ? 'var(--success)' : 'var(--on-warning-soft)' } }, c.ok ? 'Completo' : 'Por revisar')));
        })));
  }

  /* ===================================================== 2 · IDENTITY */
  function IssuerCard(props) {
    var iss = props.iss;
    return React.createElement(CardShell, { icon: 'building', title: 'Emisor' },
      React.createElement('div', { style: { display: 'grid', gap: 1 } },
        React.createElement('div', { style: { fontSize: 'var(--text-body)', fontWeight: 700, color: 'var(--text-strong)', marginBottom: 6 } }, iss.legalName + (iss.commercialName && iss.commercialName !== iss.legalName ? ' · ' + iss.commercialName : '')),
        React.createElement(Fact, { label: 'RUC', value: iss.taxId ? React.createElement(CopyValue, { value: iss.taxId }) : null, mono: true, missing: !iss.taxId, empty: 'Falta RUC del emisor' }),
        React.createElement(Fact, { label: 'Ambiente', value: iss.environment === 'production' ? 'Producción' : (iss.environment ? 'Pruebas' : null), missing: !iss.environment, empty: 'No configurado' }),
        React.createElement(Fact, { label: 'Emisión', value: iss.emissionType === 'normal' ? 'Normal' : iss.emissionType, missing: !iss.emissionType, empty: 'No configurada' }),
        iss.specialTaxpayerCode && React.createElement(Fact, { label: 'Contrib. esp.', value: iss.specialTaxpayerCode }),
        React.createElement(Fact, { label: 'Obligado', value: iss.accountingObligated == null ? null : (iss.accountingObligated ? 'Lleva contabilidad' : 'No obligado'), missing: iss.accountingObligated == null, empty: 'Sin dato' }),
        React.createElement(Fact, { label: 'Matriz', value: iss.matrixAddress, missing: !iss.matrixAddress, empty: 'Falta dirección matriz' })));
  }
  function BuyerCard(props) {
    var cus = props.cus;
    var idLabel = cus.identificationType ? ({ '04': 'RUC', '05': 'Cédula', '06': 'Pasaporte', '07': 'Consumidor final', '08': 'Exterior' }[cus.identificationType] || cus.identificationType) : null;
    return React.createElement(CardShell, { icon: 'user', title: 'Comprador' },
      React.createElement('div', { style: { display: 'grid', gap: 1 } },
        React.createElement('div', { style: { fontSize: 'var(--text-body)', fontWeight: 700, color: 'var(--text-strong)', marginBottom: 6 } }, cus.name || 'Sin comprador'),
        React.createElement(Fact, { label: 'Tipo', value: idLabel, missing: !idLabel, empty: 'Sin tipo de identificación' }),
        React.createElement(Fact, { label: 'Identificación', value: (cus.identification || cus.taxId) ? React.createElement(CopyValue, { value: cus.identification || cus.taxId }) : null, mono: true, missing: !(cus.identification || cus.taxId), empty: 'Falta identificación fiscal' }),
        React.createElement(Fact, { label: 'Email', value: cus.email, missing: !cus.email, empty: 'Sin email' }),
        React.createElement(Fact, { label: 'Dirección', value: cus.billingAddress, missing: !cus.billingAddress, empty: 'Sin dirección del comprador' })));
  }

  /* ===================================================== 3 · NUMBERING / CONTEXT */
  function NumberingStrip(props) {
    var inv = props.inv;
    var seq = inv.sequenceNumber != null ? String(inv.sequenceNumber).padStart(9, '0') : 'Manual';
    var cells = [
      ['Tipo de documento', (inv.documentCode || '—') + ' · Factura'],
      ['Serie', (inv.establishmentCode || '---') + '-' + (inv.emissionPointCode || '---')],
      ['Secuencial', seq],
      ['Emitida', fmtDate(inv.issuedAt)],
      ['Vence', fmtDate(inv.dueAt)]
    ];
    return React.createElement(CardShell, { icon: 'hash', title: 'Numeración y contexto' },
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 } },
        cells.map(function (c, i) {
          return React.createElement('div', { key: i, style: { display: 'grid', gap: 3, minWidth: 0 } },
            React.createElement('span', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--text-subtle)' } }, c[0]),
            React.createElement('span', { style: { fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)', fontFamily: (i === 1 || i === 2) ? 'var(--font-mono)' : 'inherit', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, c[1]));
        })));
  }

  /* ===================================================== 4 · LINES + TOTALS */
  function LinesCard(props) {
    var doc = props.doc; var inv = doc.invoice;
    return React.createElement(CardShell, { icon: 'package', title: 'Líneas del documento',
      headerExtra: React.createElement(Pill, { tone: doc.lines.length ? 'neutral' : 'warning' }, doc.lines.length === 1 ? '1 línea' : doc.lines.length + ' líneas') },
      doc.lines.length === 0
        ? React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px', borderRadius: 'var(--radius-sm)', background: 'var(--warning-soft)', color: 'var(--on-warning-soft)' } },
            React.createElement('span', { style: { color: 'var(--warning)', flex: 'none', display: 'inline-flex' } }, I({ name: 'alert', size: 18 })),
            React.createElement('div', null,
              React.createElement('strong', { style: { fontWeight: 700, fontSize: 'var(--text-sm)' } }, 'La factura no tiene líneas'),
              React.createElement('p', { style: { margin: '3px 0 0', fontSize: 'var(--text-xs)', lineHeight: 1.45 } }, 'Vuelve a la composición para agregar lo que estás cobrando antes de previsualizar el documento.')))
        : React.createElement('div', { style: { display: 'grid', gap: 0 } },
            doc.lines.map(function (l, i) {
              return React.createElement('div', { key: l.id, style: { display: 'flex', alignItems: 'flex-start', gap: 14, padding: '12px 0', borderTop: i ? '1px solid var(--divider)' : 'none' } },
                React.createElement('span', { style: { width: 24, height: 24, flex: 'none', borderRadius: 999, display: 'grid', placeItems: 'center', background: 'var(--surface-sunken)', border: '1px solid var(--border)', fontSize: 'var(--text-2xs)', fontWeight: 700, color: 'var(--text-muted)', marginTop: 2 } }, l.position),
                React.createElement('div', { style: { flex: 1, minWidth: 0 } },
                  React.createElement('div', { style: { fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)' } }, l.description),
                  React.createElement('div', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', marginTop: 2 } }, l.quantity + ' × ' + money(l.unitPriceInCents, inv.currency) + ' · ' + (l.taxRateName && l.taxRatePercentage !== null ? (l.taxRateName + ' ' + pct(l.taxRatePercentage) + '%') : 'Sin impuesto') + (l.lineTaxInCents ? (' · IVA ' + money(l.lineTaxInCents, inv.currency)) : ''))),
                React.createElement('span', { style: { flex: 'none', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)' } }, money(l.lineTotalInCents, inv.currency)));
            })),
      inv.notes && React.createElement('div', { style: { marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--divider)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' } },
        React.createElement('span', { style: { fontWeight: 600, color: 'var(--text)' } }, 'Notas: '), inv.notes));
  }

  /* ===================================================== ARTIFACTS RAIL */
  function ArtifactRow(props) {
    return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: props.first ? 'none' : '1px solid var(--divider)' } },
      React.createElement('span', { style: { width: 34, height: 34, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: props.available ? 'var(--primary-soft)' : 'var(--surface-sunken)', color: props.available ? 'var(--primary)' : 'var(--text-subtle)' } }, I({ name: props.icon, size: 17 })),
      React.createElement('div', { style: { flex: 1, minWidth: 0 } },
        React.createElement('div', { style: { fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)' } }, props.title),
        React.createElement('div', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', fontFamily: props.fileName ? 'var(--font-mono)' : 'inherit', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, props.fileName || props.subtitle)),
      props.action);
  }

  function ArtifactsRail(props) {
    var s = props.s, canManage = props.canManage;
    var doc = s.document, ride = s.ride, art = s.artifacts;
    var inv = doc.invoice;
    var loading = s.actionLoading;
    var authorized = !!(ride && ride.ride.canBePrintedAsAuthorized && inv.electronicStatus === 'authorized');

    return React.createElement('aside', { style: { display: 'grid', gap: 16, alignContent: 'start', position: 'sticky', top: 16 } },
      /* totals */
      React.createElement('div', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' } },
        React.createElement('div', { style: { padding: '14px var(--card-pad)', borderBottom: '1px solid var(--divider)', display: 'flex', alignItems: 'center', gap: 9 } },
          React.createElement('span', { style: { color: 'var(--text-muted)', display: 'inline-flex' } }, I({ name: 'calculator', size: 16 })),
          React.createElement('h3', { style: { margin: 0, fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Totales')),
        React.createElement('div', { style: { padding: 'var(--card-pad)' } },
          [['Subtotal', doc.totals.subtotalInCents, false], ['IVA / impuesto', doc.totals.taxInCents, false], ['Total', doc.totals.totalInCents, true]].map(function (r, i) {
            return React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, padding: r[2] ? '12px 0 0' : '7px 0', borderTop: r[2] ? '1px solid var(--divider)' : 'none', marginTop: r[2] ? 4 : 0 } },
              React.createElement('span', { style: { fontSize: r[2] ? 'var(--text-body)' : 'var(--text-sm)', fontWeight: r[2] ? 700 : 500, color: r[2] ? 'var(--text-strong)' : 'var(--text-muted)' } }, r[0]),
              React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: r[2] ? 'var(--text-h2)' : 'var(--text-sm)', fontWeight: r[2] ? 800 : 600, color: 'var(--text-strong)' } }, money(r[1], inv.currency)));
          }))),

      /* artifacts */
      React.createElement('div', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' } },
        React.createElement('div', { style: { padding: '14px var(--card-pad)', borderBottom: '1px solid var(--divider)', display: 'flex', alignItems: 'center', gap: 9 } },
          React.createElement('span', { style: { color: 'var(--text-muted)', display: 'inline-flex' } }, I({ name: 'fileText', size: 16 })),
          React.createElement('h3', { style: { margin: 0, flex: 1, fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Artefactos'),
          authorized
            ? React.createElement(Pill, { tone: 'success', dot: true }, 'Autorizado')
            : React.createElement(Pill, { tone: ride ? 'info' : 'neutral', dot: true }, ride ? 'Referencial' : 'No generados')),
        React.createElement('div', { style: { padding: '4px var(--card-pad) var(--card-pad)' } },
          /* printable — always available from the document endpoint */
          React.createElement(ArtifactRow, { first: true, icon: 'printer', available: true, title: 'Versión imprimible', subtitle: 'Vista del documento (HTML)',
            action: React.createElement(Btn, { variant: 'secondary', size: 'sm', leading: 'externalLink', disabled: loading === 'open-invoice-document', onClick: function () {} }, loading === 'open-invoice-document' ? 'Abriendo…' : 'Abrir') }),
          /* RIDE */
          React.createElement(ArtifactRow, { icon: 'fileText', available: !!ride, title: 'RIDE electrónico',
            fileName: art && art.rideHtmlFileName, subtitle: ride ? null : 'Aún no generado',
            action: ride
              ? React.createElement('div', { style: { display: 'flex', gap: 6 } },
                  React.createElement(Btn, { variant: 'ghost', size: 'sm', leading: 'externalLink', disabled: loading === 'open-invoice-ride', onClick: function () {} }, 'Abrir'),
                  React.createElement(Btn, { variant: 'ghost', size: 'sm', leading: 'download', disabled: loading === 'download-invoice-ride' || !(art && art.canDownloadRide), onClick: function () {} }, loading === 'download-invoice-ride' ? '…' : 'RIDE'))
              : React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)' } }, '—') }),
          /* XML */
          React.createElement(ArtifactRow, { icon: 'fileCode', available: !!(art && art.canDownloadXml), title: 'XML preliminar',
            fileName: art && art.xmlFileName, subtitle: art ? null : 'Aún no generado',
            action: (art && art.canDownloadXml)
              ? React.createElement(Btn, { variant: 'ghost', size: 'sm', leading: 'download', disabled: loading === 'download-invoice-xml', onClick: function () {} }, loading === 'download-invoice-xml' ? '…' : 'XML')
              : React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)' } }, 'No disp.') }),
          /* authorization evidence — only when backend confirms */
          ride && React.createElement('div', { style: { marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--divider)', display: 'grid', gap: 8 } },
            React.createElement('div', { className: 'ds-eyebrow', style: { color: 'var(--text-subtle)' } }, 'Estado del RIDE'),
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 9, padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: authorized ? 'var(--success-soft)' : 'var(--info-soft)', color: authorized ? 'var(--on-success-soft)' : 'var(--on-info-soft)' } },
              React.createElement('span', { style: { color: authorized ? 'var(--success)' : 'var(--info)', flex: 'none', display: 'inline-flex' } }, I({ name: authorized ? 'shieldCheck' : 'shield', size: 16 })),
              React.createElement('span', { style: { fontSize: 'var(--text-xs)', lineHeight: 1.4 } }, authorized ? 'Imprimible como comprobante autorizado.' : 'Aún referencial o pendiente — no autorizado por el SRI.')),
            ride.ride.accessKeyChunks.length > 0 && React.createElement('div', { style: { display: 'grid', gap: 5 } },
              React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' } }, 'Clave de acceso'),
              React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 6 } },
                React.createElement('code', { style: { flex: 1, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-strong)', lineHeight: 1.6, wordBreak: 'break-all', background: 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', padding: '8px 10px' } }, ride.ride.accessKeyChunks.join(' · ')),
                React.createElement('span', { style: { flex: 'none', marginTop: 6 } }, React.createElement(CopyValue, { value: ride.ride.accessKey }, '')))),
            authorized && ride.ride.authorizedAt && React.createElement('div', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' } }, 'Autorización: ', React.createElement('span', { style: { fontFamily: 'var(--font-mono)', color: 'var(--text-strong)' } }, ride.ride.authorizationNumber), ' · ', fmtDate(ride.ride.authorizedAt))))),

      /* reassurance — reviewing ≠ submitting */
      React.createElement('div', { style: { display: 'flex', gap: 11, padding: '13px 14px', borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)', border: '1px solid var(--border)' } },
        React.createElement('span', { style: { color: 'var(--text-muted)', flex: 'none', display: 'inline-flex', marginTop: 1 } }, I({ name: 'shield', size: 16 })),
        React.createElement('p', { style: { margin: 0, fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', lineHeight: 1.55 } },
          React.createElement('strong', { style: { color: 'var(--text)', fontWeight: 600 } }, 'Revisar no es enviar al SRI. '),
          'El RIDE y el XML aquí son para previsualizar y descargar. La firma, el envío y la autorización ocurren en su propia pantalla.')));
  }

  /* ===================================================== EMPTY / PAGE */
  function NoDocument() {
    return React.createElement('div', { style: { padding: 'var(--gutter)', maxWidth: 1180, margin: '0 auto' } },
      React.createElement('div', { style: { display: 'grid', gap: 16, justifyItems: 'center', textAlign: 'center', padding: '80px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' } },
        React.createElement('span', { style: { width: 60, height: 60, borderRadius: 'var(--radius-md)', display: 'grid', placeItems: 'center', background: 'var(--surface-sunken)', color: 'var(--text-subtle)' } }, I({ name: 'receipt', size: 28 })),
        React.createElement('div', { style: { maxWidth: 420 } },
          React.createElement('h2', { style: { margin: 0, fontSize: 'var(--text-h2)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Selecciona una factura para revisar'),
          React.createElement('p', { style: { margin: '8px 0 0', fontSize: 'var(--text-body)', color: 'var(--text-muted)', lineHeight: 1.55 } }, 'Elige una factura del listado para ver su revisión: emisor, comprador, numeración, líneas, totales y los artefactos disponibles.'))));
  }

  function DesktopReview(props) {
    var s = props.s;
    var canManage = s.permission.canManage;
    if (!s.document) return React.createElement(NoDocument, null);
    var r = computeReadiness(s);
    var inv = s.document.invoice;
    var sp = STATUS_PILL[inv.status] || STATUS_PILL.draft;

    return React.createElement('div', { style: { padding: 'var(--gutter)', maxWidth: 1180, margin: '0 auto' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 18, flexWrap: 'wrap' } },
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('div', { className: 'ds-eyebrow' }, 'Invoicing · Revisión'),
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, flexWrap: 'wrap' } },
            React.createElement('h1', { style: { margin: 0, fontSize: 'var(--text-h1)', fontWeight: 800, letterSpacing: 'var(--track-snug)', color: 'var(--text-strong)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' } }, inv.number),
            React.createElement(Pill, { tone: sp.tone, dot: true }, sp.label)),
          React.createElement('p', { style: { margin: '6px 0 0', fontSize: 'var(--text-body)', color: 'var(--text-muted)', maxWidth: 640, lineHeight: 'var(--leading-body)' } }, 'Revisa que el documento esté completo y entendible antes de previsualizarlo como RIDE o XML.')),
        React.createElement('div', { style: { display: 'flex', gap: 8 } }, React.createElement(Btn, { variant: 'ghost', leading: 'help' }, 'Guía rápida'))),

      !canManage && React.createElement('div', { style: { marginBottom: 16 } },
        React.createElement(Banner, { tone: 'info', icon: 'lock', title: 'Solo lectura' },
          'Tu rol ' + s.permission.role + ' puede revisar y abrir artefactos, pero algunas descargas pueden estar limitadas. Falta el permiso ',
          React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontWeight: 600 } }, s.permission.missingPermission), '.')),

      React.createElement('div', { style: { display: 'grid', gap: 16 } },
        React.createElement(ReadinessHeader, { s: s, r: r }),
        React.createElement('div', { className: 'review-grid', style: { display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 340px', gap: 16, alignItems: 'start' } },
          React.createElement('div', { style: { display: 'grid', gap: 16 } },
            React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 } },
              React.createElement(IssuerCard, { iss: s.document.issuer }),
              React.createElement(BuyerCard, { cus: s.document.customer })),
            React.createElement(NumberingStrip, { inv: inv }),
            React.createElement(LinesCard, { doc: s.document })),
          React.createElement(ArtifactsRail, { s: s, canManage: canManage }))));
  }

  window.Review = { DesktopReview: DesktopReview, money: money, pct: pct, fmtDate: fmtDate, elecMeta: elecMeta, STATUS_PILL: STATUS_PILL, computeReadiness: computeReadiness };
})();
