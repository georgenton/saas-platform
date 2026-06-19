/* Mobile — Invoicing Items Flow (slice 07). Purpose-built, not a shrunk panel:
   compact invoice context, item list as readable rows, a sticky totals bar
   always visible, add-item as a focused bottom sheet, and a large thumb-friendly
   add action. Shares window.Items helpers + the real contracts.
   window.MobileItems. */
(function () {
  var useState = React.useState;
  var I = window.Icon;
  var UI = window.UI;
  var Btn = UI.Btn, Pill = UI.Pill, Banner = UI.Banner;
  var Chrome = window.Chrome;
  var MobileTopBar = Chrome.MobileTopBar, BottomTabs = Chrome.BottomTabs, Sheet = Chrome.Sheet;
  var D = window.ITEMS_DATA;
  var money = window.Items.money, pct = window.Items.pct, priceToCents = window.Items.priceToCents,
      activeTaxRates = window.Items.activeTaxRates, taxById = window.Items.taxById, STATUS_PILL = window.Items.STATUS_PILL;

  function MField(props) {
    return React.createElement('label', { style: { display: 'grid', gap: 6 } },
      React.createElement('span', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--text-subtle)' } }, props.label),
      props.children,
      props.hint && React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' } }, props.hint));
  }
  function MInput(props) {
    return React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: 8, height: 46, padding: '0 13px', background: props.disabled ? 'var(--surface-sunken)' : 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)' } },
      props.prefix && React.createElement('span', { style: { color: 'var(--text-subtle)', flex: 'none', fontWeight: 600 } }, props.prefix),
      React.createElement('input', { type: props.type || 'text', inputMode: props.inputMode, value: props.value, placeholder: props.placeholder, disabled: props.disabled, min: props.min,
        onChange: function (e) { props.onChange && props.onChange(e.target.value); },
        style: { flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', font: 'inherit', fontFamily: props.mono ? 'var(--font-mono)' : 'var(--font-sans)', fontSize: 'var(--text-body)', color: 'var(--text-strong)' } }));
  }
  function MSelectInput(props) {
    return React.createElement('span', { style: { position: 'relative', display: 'flex' } },
      React.createElement('select', { value: props.value, disabled: props.disabled, onChange: function (e) { props.onChange && props.onChange(e.target.value); },
        style: { appearance: 'none', WebkitAppearance: 'none', width: '100%', height: 46, padding: '0 38px 0 13px', background: props.disabled ? 'var(--surface-sunken)' : 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', font: 'inherit', fontSize: 'var(--text-body)', fontWeight: 500, color: 'var(--text-strong)', outline: 'none' } },
        props.options.map(function (o) { return React.createElement('option', { key: o.value, value: o.value }, o.label); })),
      React.createElement('span', { style: { position: 'absolute', right: 12, top: 15, color: 'var(--text-subtle)', pointerEvents: 'none', display: 'inline-flex' } }, I({ name: 'chevronDown', size: 16 })));
  }

  function ItemRow(props) {
    var it = props.item, currency = props.currency;
    return React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 11, padding: '12px 13px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' } },
      React.createElement('span', { style: { width: 24, height: 24, flex: 'none', borderRadius: 999, display: 'grid', placeItems: 'center', background: 'var(--surface-sunken)', border: '1px solid var(--border)', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginTop: 1 } }, it.position),
      React.createElement('div', { style: { flex: 1, minWidth: 0 } },
        React.createElement('div', { style: { fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)' } }, it.description),
        React.createElement('div', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', marginTop: 3 } },
          it.quantity + ' × ' + money(it.unitPriceInCents, currency) + ' · ' + (it.taxRatePercentage !== null && it.taxRateName ? (it.taxRateName + ' ' + pct(it.taxRatePercentage) + '%') : 'Sin impuesto'))),
      React.createElement('div', { style: { flex: 'none', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)' } }, money(it.lineTotalInCents, currency)));
  }

  function AddItemSheetBody(props) {
    var s = props.s, form = props.form, set = props.set;
    var inv = s.invoice;
    var actives = activeTaxRates(s.taxRates);
    var creating = s.actionLoading === 'create-invoice-item';
    var qty = parseInt(form.quantity, 10); if (isNaN(qty) || qty < 1) qty = 0;
    var unitCents = priceToCents(form.unitPrice);
    var selTax = form.taxRateId ? taxById(s.taxRates, form.taxRateId) : null;
    var hasPreview = qty > 0 && unitCents != null && unitCents >= 0;
    var lineSub = hasPreview ? qty * unitCents : 0;
    var lineTax = hasPreview && selTax ? Math.round(lineSub * selTax.percentage / 100) : 0;
    var canCreate = !creating && form.description.trim() && form.unitPrice.toString().trim() && unitCents != null && unitCents >= 0;
    return React.createElement('div', { style: { display: 'grid', gap: 14, paddingBottom: 4 } },
      s.itemError && React.createElement(Banner, { tone: 'danger', icon: 'alert', title: 'No se pudo agregar' }, s.itemError),
      actives.length === 0 && React.createElement(Banner, { tone: 'warning', icon: 'alert', title: 'Sin impuestos activos' }, 'Agrega la línea como "Sin impuesto" o activa una tasa en Configuración.'),
      React.createElement(MField, { label: 'Descripción' }, React.createElement(MInput, { value: form.description, onChange: function (v) { set('description', v); }, placeholder: 'Servicio de logística', disabled: creating })),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: 12 } },
        React.createElement(MField, { label: 'Cantidad' }, React.createElement(MInput, { type: 'number', inputMode: 'numeric', min: '1', value: form.quantity, onChange: function (v) { set('quantity', v); }, disabled: creating, mono: true })),
        React.createElement(MField, { label: 'Precio unitario', hint: 'En ' + inv.currency }, React.createElement(MInput, { type: 'text', inputMode: 'decimal', value: form.unitPrice, onChange: function (v) { set('unitPrice', v); }, placeholder: '120.00', disabled: creating, mono: true, prefix: '$' }))),
      React.createElement(MField, { label: 'Impuesto' },
        React.createElement(MSelectInput, { value: form.taxRateId, disabled: creating, onChange: function (v) { set('taxRateId', v); },
          options: [{ value: '', label: 'Sin impuesto' }].concat(actives.map(function (t) { return { value: t.id, label: t.name + ' (' + pct(t.percentage) + '%)' }; })) })),
      React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, padding: '12px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)', border: '1px dashed var(--border-strong)' } },
        React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-2xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em', color: 'var(--text-subtle)' } }, I({ name: 'calculator', size: 13 }), 'Estimado'),
        React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-h3)', fontWeight: 800, color: 'var(--text-strong)' } }, hasPreview ? money(lineSub + lineTax, inv.currency) : '—')),
      React.createElement(Btn, { variant: 'primary', full: true, leading: creating ? null : 'plus', disabled: !canCreate, onClick: props.onCreate }, creating ? 'Agregando línea…' : 'Agregar línea'),
      React.createElement('p', { style: { margin: 0, fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', textAlign: 'center', lineHeight: 1.5 } }, 'El total oficial lo calcula el backend al guardar.'));
  }

  function MobileItemsScreen(props) {
    var s = props.s, mood = props.mood, onMood = props.onMood;
    var canManage = s.permission.canManage;
    var inv = s.invoice;
    var isDraft = inv.status === 'draft';
    var sp = STATUS_PILL[inv.status] || STATUS_PILL.draft;
    var formState = useState(s.itemForm); var form = formState[0], setFormRaw = formState[1];
    /* open the sheet automatically when there's an in-progress/error/typed add */
    var wantSheet = (isDraft && (s.actionLoading === 'create-invoice-item' || !!s.itemError || (!!s.itemForm.description && s.invoice.items.length > 0))) ? 'add' : null;
    var sheetState = useState(wantSheet); var sheet = sheetState[0], setSheet = sheetState[1];
    var moodState = useState(false); var moodOpen = moodState[0], setMoodOpen = moodState[1];
    function set(k, v) { var o = {}; o[k] = v; setFormRaw(Object.assign({}, form, o)); }

    var t = inv.totals;

    return React.createElement('div', { style: { height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--app-bg)' } },
      React.createElement(MobileTopBar, { tenant: D.tenant, onTenant: function () {}, onMood: function () { setMoodOpen(true); }, onAssistant: function () {} }),
      /* compact invoice context */
      React.createElement('div', { style: { flex: 'none', padding: '12px 14px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' } },
        React.createElement('div', { className: 'ds-eyebrow' }, 'Invoicing · Composición'),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 } },
          React.createElement('span', { style: { flex: 1, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-h2)', fontWeight: 700, color: 'var(--text-strong)' } }, inv.number),
          React.createElement(Pill, { tone: sp.tone, dot: true }, sp.label)),
        React.createElement('div', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 6 } }, I({ name: 'user', size: 12 }), inv.buyerName || 'Sin comprador', React.createElement('span', { style: { color: 'var(--text-subtle)' } }, '· ' + inv.currency))),

      React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: 14, display: 'grid', gap: 10, alignContent: 'start' } },
        !canManage && React.createElement(Banner, { tone: 'info', icon: 'lock', title: 'Solo lectura' }, 'Tu rol ' + s.permission.role + ' no puede agregar líneas.'),
        !isDraft && React.createElement(Banner, { tone: 'info', icon: 'shield', title: 'Factura ' + sp.label.toLowerCase() }, 'Sus líneas quedaron fijas. Para cambiar lo facturado se usa una nota de crédito o débito.'),
        React.createElement('span', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--text-subtle)' } }, inv.items.length === 0 ? 'Líneas' : (inv.items.length === 1 ? '1 línea' : inv.items.length + ' líneas')),
        inv.items.length === 0
          ? React.createElement('div', { style: { display: 'grid', gap: 12, justifyItems: 'center', textAlign: 'center', padding: '22px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' } },
              React.createElement('span', { style: { width: 50, height: 50, borderRadius: 'var(--radius-md)', display: 'grid', placeItems: 'center', background: 'var(--primary-soft)', color: 'var(--primary)' } }, I({ name: 'listPlus', size: 24 })),
              React.createElement('div', null,
                React.createElement('h3', { style: { margin: 0, fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Empieza a componer'),
                React.createElement('p', { style: { margin: '6px 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.5 } }, 'Agrega la primera línea con lo que estás cobrando.')))
          : React.createElement('div', { style: { display: 'grid', gap: 8 } }, inv.items.map(function (it) { return React.createElement(ItemRow, { key: it.id, item: it, currency: inv.currency }); }))),

      /* sticky totals + thumb action */
      React.createElement('div', { style: { flex: 'none', background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '12px 14px', display: 'grid', gap: 10 } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 } },
          React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' } }, 'Subtotal ', React.createElement('span', { style: { fontFamily: 'var(--font-mono)', color: 'var(--text)', fontWeight: 600 } }, money(t.subtotalInCents, inv.currency))),
          React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' } }, 'IVA ', React.createElement('span', { style: { fontFamily: 'var(--font-mono)', color: 'var(--text)', fontWeight: 600 } }, money(t.taxInCents, inv.currency))),
          React.createElement('span', { style: { fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Total ', React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-h3)', fontWeight: 800 } }, money(t.totalInCents, inv.currency)))),
        canManage && isDraft
          ? React.createElement(Btn, { variant: 'primary', full: true, leading: 'plus', onClick: function () { setSheet('add'); } }, 'Agregar línea')
          : React.createElement(Btn, { variant: 'secondary', full: true, leading: 'lock', disabled: true }, canManage ? 'Factura ' + sp.label.toLowerCase() : 'Solo lectura')),

      React.createElement(BottomTabs, { active: 'queue', onTab: function () {} }),

      sheet === 'add' && React.createElement(Sheet, { title: 'Agregar línea', onClose: function () { setSheet(null); } },
        React.createElement(AddItemSheetBody, { s: s, form: form, set: set, onCreate: function () {} })),
      moodOpen && React.createElement(Sheet, { title: 'Modo de diseño', onClose: function () { setMoodOpen(false); } },
        React.createElement(UI.MoodMenu, { value: mood, onChange: function (m) { onMood(m); }, moods: D.moods })));
  }

  window.MobileItems = { MobileItemsScreen: MobileItemsScreen };
})();
