/* Desktop — Invoicing Items Flow (slice 07). A guided composition lane, not a
   technical row editor:
     1 invoice context (number · status · buyer · currency; electronic only as quiet context)
     2 the lines you're charging (item list, money in normal currency terms)
     3 add a line (description · cantidad · precio unitario · impuesto) with a
       clearly-labeled client PREVIEW of the line total
     4 totals always understandable (subtotal · IVA · total) — backend-owned
   Every field/enum maps to the real contracts; money is rendered in currency
   terms and mapped back to unitPriceInCents in integration-plan.md.
   window.Items. */
(function () {
  var useState = React.useState;
  var I = window.Icon;
  var UI = window.UI;
  var Btn = UI.Btn, Pill = UI.Pill, Banner = UI.Banner;
  var D = window.ITEMS_DATA;

  /* money: cents → currency string (formatMoney equivalent) */
  function money(cents, currency) {
    var v = (cents || 0) / 100;
    var s = v.toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return '$' + s + (currency && currency !== 'USD' ? ' ' + currency : '');
  }
  function pct(value) { return (Math.round(value * 100) / 100).toString(); }
  function activeTaxRates(rates) { return rates.filter(function (r) { return r.isActive; }); }
  function taxById(rates, id) { for (var i = 0; i < rates.length; i++) if (rates[i].id === id) return rates[i]; return null; }
  /* human currency string ("85.00") → cents */
  function priceToCents(str) { var n = parseFloat(String(str).replace(',', '.')); return isNaN(n) ? null : Math.round(n * 100); }

  var STATUS_PILL = {
    draft: { tone: 'neutral', label: 'Borrador' },
    issued: { tone: 'info', label: 'Emitida' },
    paid: { tone: 'success', label: 'Pagada' },
    void: { tone: 'danger', label: 'Anulada' }
  };

  /* ---------------------------------------------------------- form inputs */
  function Field(props) {
    var id = 'in-' + props.label.replace(/\s+/g, '-').toLowerCase();
    return React.createElement('label', { htmlFor: id, style: { display: 'grid', gap: 6, minWidth: 0 } },
      React.createElement('span', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--text-subtle)' } },
        props.label, props.required && React.createElement('span', { style: { color: 'var(--danger)', marginLeft: 4 } }, '*')),
      props.children,
      props.hint && React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' } }, props.hint));
  }
  function TextInput(props) {
    return React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: 8, height: 'var(--control-h)', padding: '0 12px', background: props.disabled ? 'var(--surface-sunken)' : 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', opacity: props.disabled ? 0.6 : 1 } },
      props.prefix && React.createElement('span', { style: { color: 'var(--text-subtle)', flex: 'none', fontWeight: 600, fontSize: 'var(--text-sm)' } }, props.prefix),
      props.icon && React.createElement('span', { style: { color: 'var(--text-subtle)', flex: 'none', display: 'inline-flex' } }, I({ name: props.icon, size: 15 })),
      React.createElement('input', { type: props.type || 'text', value: props.value, disabled: props.disabled, placeholder: props.placeholder, min: props.min, step: props.step, inputMode: props.inputMode,
        onChange: function (e) { props.onChange && props.onChange(e.target.value); },
        style: { flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', font: 'inherit', fontFamily: props.mono ? 'var(--font-mono)' : 'var(--font-sans)', fontSize: 'var(--text-sm)', color: 'var(--text-strong)', textAlign: props.alignRight ? 'right' : 'left' } }));
  }
  function SelectInput(props) {
    return React.createElement('span', { style: { position: 'relative', display: 'flex', alignItems: 'center', height: 'var(--control-h)', background: props.disabled ? 'var(--surface-sunken)' : 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', opacity: props.disabled ? 0.6 : 1 } },
      React.createElement('select', { value: props.value, disabled: props.disabled, onChange: function (e) { props.onChange && props.onChange(e.target.value); },
        style: { appearance: 'none', WebkitAppearance: 'none', flex: 1, height: '100%', border: 'none', outline: 'none', background: 'transparent', font: 'inherit', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-strong)', padding: '0 34px 0 12px', cursor: props.disabled ? 'not-allowed' : 'pointer' } },
        props.options.map(function (o) { return React.createElement('option', { key: o.value, value: o.value }, o.label); })),
      React.createElement('span', { style: { position: 'absolute', right: 10, color: 'var(--text-subtle)', pointerEvents: 'none', display: 'inline-flex' } }, I({ name: 'chevronDown', size: 16 })));
  }

  /* ===================================================== INVOICE CONTEXT */
  function InvoiceContext(props) {
    var inv = props.inv;
    var sp = STATUS_PILL[inv.status] || STATUS_PILL.draft;
    return React.createElement('div', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 16, padding: '16px var(--card-pad)' } },
        React.createElement('span', { style: { width: 44, height: 44, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: 'var(--primary-soft)', color: 'var(--primary)' } }, I({ name: 'receipt', size: 22 })),
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' } },
            React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-h2)', fontWeight: 700, color: 'var(--text-strong)' } }, inv.number),
            React.createElement(Pill, { tone: sp.tone, dot: true }, sp.label)),
          React.createElement('div', { style: { fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' } },
            React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 6 } }, I({ name: 'user', size: 14 }), inv.buyerName || 'Sin comprador'),
            inv.buyerIdentification && React.createElement('span', { style: { fontFamily: 'var(--font-mono)', color: 'var(--text-subtle)' } }, '· ' + inv.buyerIdentification))),
        React.createElement('div', { style: { flex: 'none', textAlign: 'right' } },
          React.createElement('div', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--text-subtle)' } }, 'Moneda'),
          React.createElement('div', { style: { fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)', fontFamily: 'var(--font-mono)' } }, inv.currency))),
      /* electronic status as QUIET context only — never an action here */
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, padding: '9px var(--card-pad)', borderTop: '1px solid var(--divider)', background: 'var(--surface-sunken)', fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' } },
        I({ name: 'shield', size: 13 }),
        inv.electronicStatus
          ? React.createElement('span', null, 'Estado electrónico: ', React.createElement('strong', { style: { color: 'var(--text)', fontWeight: 600 } }, inv.electronicStatus), ' · la emisión y autorización se gestionan en otra pantalla.')
          : React.createElement('span', null, 'Documento aún no emitido al SRI. Aquí solo compones la factura; la firma y el envío vienen después.')));
  }

  /* ===================================================== ITEM LIST */
  function ItemRow(props) {
    var it = props.item, currency = props.currency;
    return React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px var(--card-pad)', borderTop: props.first ? 'none' : '1px solid var(--divider)' } },
      React.createElement('span', { style: { width: 26, height: 26, flex: 'none', borderRadius: 999, display: 'grid', placeItems: 'center', background: 'var(--surface-sunken)', border: '1px solid var(--border)', fontSize: 'var(--text-2xs)', fontWeight: 700, color: 'var(--text-muted)', marginTop: 2 } }, it.position),
      React.createElement('div', { style: { flex: 1, minWidth: 0 } },
        React.createElement('div', { style: { fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)' } }, it.description),
        React.createElement('div', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' } },
          React.createElement('span', null, it.quantity + ' × ' + money(it.unitPriceInCents, currency)),
          React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 5 } }, I({ name: 'tag', size: 12 }),
            it.taxRateName && it.taxRatePercentage !== null ? (it.taxRateName + ' ' + pct(it.taxRatePercentage) + '%') : 'Sin impuesto'),
          it.lineTaxInCents > 0 && React.createElement('span', null, 'IVA ' + money(it.lineTaxInCents, currency)))),
      React.createElement('div', { style: { flex: 'none', textAlign: 'right' } },
        React.createElement('div', { style: { fontSize: 'var(--text-body)', fontWeight: 700, color: 'var(--text-strong)', fontFamily: 'var(--font-mono)' } }, money(it.lineTotalInCents, currency))));
  }

  function ItemList(props) {
    var inv = props.inv;
    if (inv.items.length === 0) {
      return React.createElement('div', { style: { display: 'grid', gap: 14, justifyItems: 'center', textAlign: 'center', padding: '24px 16px' } },
        React.createElement('span', { style: { width: 54, height: 54, borderRadius: 'var(--radius-md)', display: 'grid', placeItems: 'center', background: 'var(--primary-soft)', color: 'var(--primary)' } }, I({ name: 'listPlus', size: 25 })),
        React.createElement('div', { style: { maxWidth: 380 } },
          React.createElement('h3', { style: { margin: 0, fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Empieza a componer la factura'),
          React.createElement('p', { style: { margin: '6px 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.55 } }, 'Agrega la primera línea con lo que estás cobrando. Verás el subtotal y el impuesto formarse a medida que agregas líneas.')));
    }
    return React.createElement('div', null, inv.items.map(function (it, i) { return React.createElement(ItemRow, { key: it.id, item: it, currency: inv.currency, first: i === 0 }); }));
  }

  function ItemsCard(props) {
    var inv = props.inv;
    return React.createElement('section', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' } },
      React.createElement('header', { style: { display: 'flex', alignItems: 'center', gap: 12, padding: '14px var(--card-pad)', borderBottom: '1px solid var(--divider)' } },
        React.createElement('span', { style: { color: 'var(--text-muted)', display: 'inline-flex' } }, I({ name: 'package', size: 18 })),
        React.createElement('h2', { style: { margin: 0, flex: 1, fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Líneas de la factura'),
        React.createElement(Pill, { tone: inv.items.length ? 'neutral' : 'info' }, inv.items.length === 1 ? '1 línea' : inv.items.length + ' líneas')),
      React.createElement(ItemList, { inv: inv }));
  }

  /* ===================================================== ADD ITEM FORM */
  function AddItemForm(props) {
    var s = props.s, form = props.form, set = props.set, canManage = props.canManage;
    var inv = s.invoice;
    var actives = activeTaxRates(s.taxRates);
    var isDraft = inv.status === 'draft';
    var creating = s.actionLoading === 'create-invoice-item';
    var noTaxes = actives.length === 0;
    var disabled = !canManage || !isDraft || creating;

    /* client PREVIEW (clearly labeled, never implies committed totals) */
    var qty = parseInt(form.quantity, 10); if (isNaN(qty) || qty < 1) qty = 0;
    var unitCents = priceToCents(form.unitPrice);
    var selTax = form.taxRateId ? taxById(s.taxRates, form.taxRateId) : null;
    var hasPreview = qty > 0 && unitCents != null && unitCents >= 0;
    var lineSub = hasPreview ? qty * unitCents : 0;
    var lineTax = hasPreview && selTax ? Math.round(lineSub * selTax.percentage / 100) : 0;
    var lineTotal = lineSub + lineTax;
    var canCreate = canManage && isDraft && !creating && form.description.trim() && form.unitPrice.toString().trim() && unitCents != null && unitCents >= 0;

    if (!isDraft) {
      return React.createElement('section', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' } },
        React.createElement('header', { style: { display: 'flex', alignItems: 'center', gap: 12, padding: '14px var(--card-pad)', borderBottom: '1px solid var(--divider)' } },
          React.createElement('span', { style: { color: 'var(--text-muted)', display: 'inline-flex' } }, I({ name: 'lock', size: 18 })),
          React.createElement('h2', { style: { margin: 0, flex: 1, fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Agregar línea')),
        React.createElement('div', { style: { padding: 'var(--card-pad)' } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 13, padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--info-soft)', color: 'var(--on-info-soft)' } },
            React.createElement('span', { style: { color: 'var(--info)', flex: 'none', display: 'inline-flex' } }, I({ name: 'shield', size: 19 })),
            React.createElement('div', null,
              React.createElement('strong', { style: { fontWeight: 700, fontSize: 'var(--text-body)' } }, 'Esta factura ya no es un borrador'),
              React.createElement('p', { style: { margin: '4px 0 0', fontSize: 'var(--text-sm)', lineHeight: 1.45 } }, 'La factura está ' + (STATUS_PILL[inv.status] ? STATUS_PILL[inv.status].label.toLowerCase() : inv.status) + ', así que sus líneas quedaron fijas. Para cambiar lo facturado se usa una nota de crédito o débito, en su propia pantalla.')))));
    }

    return React.createElement('section', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' } },
      React.createElement('header', { style: { display: 'flex', alignItems: 'center', gap: 12, padding: '14px var(--card-pad)', borderBottom: '1px solid var(--divider)' } },
        React.createElement('span', { style: { width: 34, height: 34, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: 'var(--primary-soft)', color: 'var(--primary)' } }, I({ name: 'plus', size: 18 })),
        React.createElement('h2', { style: { margin: 0, flex: 1, fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Agregar línea')),
      React.createElement('div', { style: { padding: 'var(--card-pad)', display: 'grid', gap: 16 } },
        s.itemError && React.createElement(Banner, { tone: 'danger', icon: 'alert', title: 'No se pudo agregar la línea' }, s.itemError),
        noTaxes && React.createElement(Banner, { tone: 'warning', icon: 'alert', title: 'No hay impuestos activos' }, 'No tienes tasas de impuesto activas. Puedes agregar la línea como "Sin impuesto" o activar una tasa en Configuración de impuestos.'),
        React.createElement(Field, { label: 'Descripción', required: true },
          React.createElement(TextInput, { value: form.description, onChange: function (v) { set('description', v); }, placeholder: 'Servicio de logística — ruta Quito/Guayaquil', disabled: disabled, icon: 'fileText' })),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '0.8fr 1.2fr 1.4fr', gap: 14 } },
          React.createElement(Field, { label: 'Cantidad', required: true },
            React.createElement(TextInput, { type: 'number', min: '1', value: form.quantity, onChange: function (v) { set('quantity', v); }, disabled: disabled, mono: true, inputMode: 'numeric' })),
          React.createElement(Field, { label: 'Precio unitario', required: true, hint: 'En ' + inv.currency + ', impuestos aparte' },
            React.createElement(TextInput, { type: 'text', inputMode: 'decimal', value: form.unitPrice, onChange: function (v) { set('unitPrice', v); }, placeholder: '120.00', disabled: disabled, mono: true, prefix: '$', alignRight: false })),
          React.createElement(Field, { label: 'Impuesto', hint: noTaxes ? 'Sin tasas activas' : 'IVA u otra tasa por línea' },
            React.createElement(SelectInput, { value: form.taxRateId, disabled: disabled, onChange: function (v) { set('taxRateId', v); },
              options: [{ value: '', label: 'Sin impuesto' }].concat(actives.map(function (t) { return { value: t.id, label: t.name + ' (' + pct(t.percentage) + '%)' }; })) }))),
        /* live PREVIEW — explicitly an estimate, backend commits on save */
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)', border: '1px dashed var(--border-strong)' } },
          React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 'var(--text-2xs)', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--text-subtle)', flex: 'none' } }, I({ name: 'calculator', size: 14 }), 'Estimado de la línea'),
          React.createElement('div', { style: { flex: 1, display: 'flex', gap: 16, justifyContent: 'flex-end', alignItems: 'baseline', flexWrap: 'wrap' } },
            React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' } }, 'Subtotal ', React.createElement('span', { style: { fontFamily: 'var(--font-mono)', color: 'var(--text)', fontWeight: 600 } }, hasPreview ? money(lineSub, inv.currency) : '—')),
            React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' } }, 'IVA ', React.createElement('span', { style: { fontFamily: 'var(--font-mono)', color: 'var(--text)', fontWeight: 600 } }, hasPreview ? money(lineTax, inv.currency) : '—')),
            React.createElement('span', { style: { fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Total ', React.createElement('span', { style: { fontFamily: 'var(--font-mono)' } }, hasPreview ? money(lineTotal, inv.currency) : '—')))),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' } },
          canManage
            ? React.createElement(Btn, { variant: 'primary', leading: creating ? null : 'plus', disabled: !canCreate, onClick: props.onCreate }, creating ? 'Agregando línea…' : 'Agregar línea')
            : React.createElement(Btn, { variant: 'secondary', leading: 'lock', disabled: true }, 'Solo lectura'),
          React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', flex: 1, minWidth: 200, lineHeight: 1.5 } }, 'El total oficial lo calcula el backend al guardar la línea. El estimado es solo una guía.'))));
  }

  /* ===================================================== TOTALS SUMMARY */
  function TotalsSummary(props) {
    var inv = props.inv;
    var t = inv.totals;
    function Row(label, value, strong, big) {
      return React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, padding: strong ? '12px 0 0' : '7px 0' } },
        React.createElement('span', { style: { fontSize: strong ? 'var(--text-body)' : 'var(--text-sm)', fontWeight: strong ? 700 : 500, color: strong ? 'var(--text-strong)' : 'var(--text-muted)' } }, label),
        React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: big ? 'var(--text-h2)' : 'var(--text-sm)', fontWeight: strong ? 800 : 600, color: 'var(--text-strong)' } }, value));
    }
    return React.createElement('aside', { style: { display: 'grid', gap: 16, alignContent: 'start', position: 'sticky', top: 16 } },
      React.createElement('div', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' } },
        React.createElement('div', { style: { padding: '14px var(--card-pad)', borderBottom: '1px solid var(--divider)', display: 'flex', alignItems: 'center', gap: 9 } },
          React.createElement('span', { style: { color: 'var(--text-muted)', display: 'inline-flex' } }, I({ name: 'calculator', size: 16 })),
          React.createElement('h3', { style: { margin: 0, fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Totales')),
        React.createElement('div', { style: { padding: 'var(--card-pad)' } },
          Row('Subtotal', money(t.subtotalInCents, inv.currency)),
          Row('IVA / impuesto', money(t.taxInCents, inv.currency)),
          React.createElement('div', { style: { borderTop: '1px solid var(--divider)', marginTop: 4 } }, Row('Total', money(t.totalInCents, inv.currency), true, true))),
        React.createElement('div', { style: { padding: '10px var(--card-pad)', borderTop: '1px solid var(--divider)', background: 'var(--surface-sunken)', fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 7 } },
          I({ name: 'shield', size: 13 }), 'Totales calculados por el backend al guardar cada línea.')),
      /* what comes next — calm handoff, never an SRI action here */
      React.createElement('div', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--card-pad)', display: 'grid', gap: 8 } },
        React.createElement('div', { className: 'ds-eyebrow', style: { color: 'var(--text-subtle)' } }, 'Después de componer'),
        React.createElement('p', { style: { margin: 0, fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', lineHeight: 1.55 } }, 'Cuando las líneas estén listas, sigue la revisión del documento y el XML/RIDE en sus propias pantallas. Aquí solo defines qué se cobra.')));
  }

  /* ===================================================== PAGE */
  function DesktopItems(props) {
    var s = props.s;
    var canManage = s.permission.canManage;
    var formState = useState(s.itemForm); var form = formState[0], setFormRaw = formState[1];
    function set(k, v) { var o = {}; o[k] = v; setFormRaw(Object.assign({}, form, o)); }

    return React.createElement('div', { style: { padding: 'var(--gutter)', maxWidth: 1180, margin: '0 auto' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 18, flexWrap: 'wrap' } },
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('div', { className: 'ds-eyebrow' }, 'Invoicing · Composición'),
          React.createElement('h1', { style: { margin: '4px 0 0', fontSize: 'var(--text-display)', fontWeight: 800, letterSpacing: 'var(--track-tight)', color: 'var(--text-strong)' } }, 'Líneas y totales'),
          React.createElement('p', { style: { margin: '6px 0 0', fontSize: 'var(--text-body)', color: 'var(--text-muted)', maxWidth: 640, lineHeight: 'var(--leading-body)' } }, 'Agrega lo que estás cobrando y mira cómo se forman el subtotal, el IVA y el total. Sin lenguaje contable complicado.')),
        React.createElement('div', { style: { display: 'flex', gap: 8 } }, React.createElement(Btn, { variant: 'ghost', leading: 'help' }, 'Guía rápida'))),

      !canManage && React.createElement('div', { style: { marginBottom: 16 } },
        React.createElement(Banner, { tone: 'info', icon: 'lock', title: 'Solo lectura' },
          'Tu rol ' + s.permission.role + ' puede ver la factura pero no agregar líneas. Falta el permiso ',
          React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontWeight: 600 } }, s.permission.missingPermission), '. Pídeselo a un Owner.')),

      React.createElement('div', { style: { display: 'grid', gap: 16 } },
        React.createElement(InvoiceContext, { inv: s.invoice }),
        React.createElement('div', { className: 'items-grid', style: { display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 320px', gap: 16, alignItems: 'start' } },
          React.createElement('div', { style: { display: 'grid', gap: 16 } },
            React.createElement(ItemsCard, { inv: s.invoice }),
            React.createElement(AddItemForm, { s: s, form: form, set: set, canManage: canManage, onCreate: function () {} })),
          React.createElement(TotalsSummary, { inv: s.invoice }))));
  }

  window.Items = { DesktopItems: DesktopItems, money: money, pct: pct, priceToCents: priceToCents, activeTaxRates: activeTaxRates, taxById: taxById, STATUS_PILL: STATUS_PILL };
})();
