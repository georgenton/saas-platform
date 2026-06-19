/* Desktop — Invoicing Customer + Draft Invoice Flow (slice 06).
   A guided lane, not two disconnected cards. Three steps:
     1 Comprador      choose from directory OR create a fiscal buyer
     2 Identidad      confirm the buyer's fiscal identity
     3 Borrador       create the draft invoice (NOT an SRI submission)
   Left column = the active step; right rail = persistent flow summary + the
   one reassurance that this never touches the SRI. One dominant action at a
   time. Every field/enum maps to the real contracts. window.Flow. */
(function () {
  var useState = React.useState;
  var I = window.Icon;
  var UI = window.UI;
  var Btn = UI.Btn, Pill = UI.Pill, Banner = UI.Banner;
  var D = window.FLOW_DATA;

  function idType(code) { for (var i = 0; i < D.idTypes.length; i++) if (D.idTypes[i].code === code) return D.idTypes[i]; return D.idTypes[0]; }
  function findCustomer(s, id) { for (var i = 0; i < s.customers.length; i++) if (s.customers[i].id === id) return s.customers[i]; return null; }
  function buyerIdLabel(c) {
    if (!c) return '';
    var t = c.identificationType ? idType(c.identificationType) : null;
    var ident = c.identification || c.taxId || 'Sin identificación';
    return (t ? t.short : 'ID') + ' · ' + ident;
  }

  /* ----------------------------------------------------------- form inputs */
  function Input(props) {
    var label = props.label, value = props.value, onChange = props.onChange, placeholder = props.placeholder,
        type = props.type || 'text', hint = props.hint, disabled = props.disabled, mono = props.mono,
        prefixIcon = props.prefixIcon, maxLength = props.maxLength, required = props.required;
    var id = 'in-' + label.replace(/\s+/g, '-').toLowerCase();
    return React.createElement('label', { htmlFor: id, style: { display: 'grid', gap: 6, minWidth: 0 } },
      React.createElement('span', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--text-subtle)' } },
        label, required && React.createElement('span', { style: { color: 'var(--danger)', marginLeft: 4 } }, '*')),
      React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: 8, height: 'var(--control-h)', padding: '0 12px', background: disabled ? 'var(--surface-sunken)' : 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', opacity: disabled ? 0.6 : 1 } },
        prefixIcon && React.createElement('span', { style: { color: 'var(--text-subtle)', flex: 'none', display: 'inline-flex' } }, I({ name: prefixIcon, size: 15 })),
        React.createElement('input', { id: id, type: type, value: value, disabled: disabled, placeholder: placeholder, maxLength: maxLength,
          onChange: function (e) { onChange && onChange(e.target.value); },
          style: { flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', font: 'inherit', fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)', fontSize: 'var(--text-sm)', color: 'var(--text-strong)' } })),
      hint && React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' } }, hint));
  }
  function Select(props) {
    var label = props.label, value = props.value, onChange = props.onChange, options = props.options, disabled = props.disabled, hint = props.hint;
    var id = 'sel-' + label.replace(/\s+/g, '-').toLowerCase();
    return React.createElement('label', { htmlFor: id, style: { display: 'grid', gap: 6, minWidth: 0 } },
      React.createElement('span', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--text-subtle)' } }, label),
      React.createElement('span', { style: { position: 'relative', display: 'flex', alignItems: 'center', height: 'var(--control-h)', background: disabled ? 'var(--surface-sunken)' : 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', opacity: disabled ? 0.6 : 1 } },
        React.createElement('select', { id: id, value: value, disabled: disabled, onChange: function (e) { onChange && onChange(e.target.value); },
          style: { appearance: 'none', WebkitAppearance: 'none', flex: 1, height: '100%', border: 'none', outline: 'none', background: 'transparent', font: 'inherit', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-strong)', padding: '0 34px 0 12px', cursor: disabled ? 'not-allowed' : 'pointer' } },
          options.map(function (o) { return React.createElement('option', { key: o.value, value: o.value }, o.label); })),
        React.createElement('span', { style: { position: 'absolute', right: 10, color: 'var(--text-subtle)', pointerEvents: 'none', display: 'inline-flex' } }, I({ name: 'chevronDown', size: 16 }))),
      hint && React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' } }, hint));
  }
  function Textarea(props) {
    var id = 'ta-' + props.label.replace(/\s+/g, '-').toLowerCase();
    return React.createElement('label', { htmlFor: id, style: { display: 'grid', gap: 6 } },
      React.createElement('span', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--text-subtle)' } }, props.label),
      React.createElement('textarea', { id: id, value: props.value, placeholder: props.placeholder, rows: props.rows || 3, disabled: props.disabled,
        onChange: function (e) { props.onChange && props.onChange(e.target.value); },
        style: { resize: 'vertical', padding: '10px 12px', background: props.disabled ? 'var(--surface-sunken)' : 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', font: 'inherit', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', color: 'var(--text-strong)', outline: 'none', lineHeight: 1.5 } }));
  }

  /* ----------------------------------------------------------- card shell */
  function StepCard(props) {
    return React.createElement('section', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' } },
      React.createElement('header', { style: { display: 'flex', alignItems: 'center', gap: 13, padding: 'var(--card-pad)', paddingBottom: 14, borderBottom: '1px solid var(--divider)' } },
        React.createElement('span', { style: { width: 38, height: 38, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: 'var(--primary-soft)', color: 'var(--primary)' } }, I({ name: props.icon, size: 19 })),
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('div', { className: 'ds-eyebrow', style: { color: 'var(--text-subtle)' } }, props.eyebrow),
          React.createElement('h2', { style: { margin: '1px 0 0', fontSize: 'var(--text-h2)', fontWeight: 700, letterSpacing: 'var(--track-snug)', color: 'var(--text-strong)' } }, props.title)),
        props.headerExtra),
      React.createElement('div', { style: { padding: 'var(--card-pad)', display: 'grid', gap: 16 } }, props.children));
  }

  /* ===================================================== STEPPER */
  var STEPS = [
    { key: 'buyer', n: 1, label: 'Comprador', icon: 'users' },
    { key: 'identity', n: 2, label: 'Identidad fiscal', icon: 'idCard' },
    { key: 'draft', n: 3, label: 'Borrador', icon: 'fileText' }
  ];
  function Stepper(props) {
    var current = props.current, done = props.done, onGo = props.onGo;
    return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: '6px', overflow: 'hidden' } },
      STEPS.map(function (st, i) {
        var isCurrent = st.key === current;
        var isDone = done.indexOf(st.key) >= 0;
        var reachable = isDone || isCurrent || props.reachable.indexOf(st.key) >= 0;
        var tone = isCurrent ? 'primary' : isDone ? 'success' : 'neutral';
        var col = isCurrent ? 'var(--primary)' : isDone ? 'var(--success)' : 'var(--text-subtle)';
        var bg = isCurrent ? 'var(--primary-soft)' : 'transparent';
        return React.createElement(React.Fragment, { key: st.key },
          React.createElement('button', { className: 'ds-focusable', disabled: !reachable, onClick: function () { reachable && onGo(st.key); },
            style: { flex: 1, display: 'flex', alignItems: 'center', gap: 11, padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: 'none', background: bg, cursor: reachable ? 'pointer' : 'default', textAlign: 'left', minWidth: 0, transition: 'var(--transition-base)' } },
            React.createElement('span', { style: { width: 30, height: 30, flex: 'none', borderRadius: 999, display: 'grid', placeItems: 'center', background: isDone ? 'var(--success)' : isCurrent ? 'var(--primary)' : 'var(--surface-sunken)', color: isDone || isCurrent ? '#fff' : 'var(--text-subtle)', fontSize: 'var(--text-sm)', fontWeight: 700, border: isCurrent || isDone ? 'none' : '1px solid var(--border-strong)' } },
              isDone ? I({ name: 'check', size: 16 }) : st.n),
            React.createElement('span', { style: { display: 'grid', gap: 1, minWidth: 0 } },
              React.createElement('span', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, color: 'var(--text-muted)' } }, 'Paso ' + st.n),
              React.createElement('span', { style: { fontSize: 'var(--text-sm)', fontWeight: 700, color: col, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, st.label))),
          i < STEPS.length - 1 && React.createElement('span', { style: { flex: 'none', color: 'var(--text-subtle)', display: 'inline-flex', padding: '0 2px' } }, I({ name: 'chevronRight', size: 16 })));
      }));
  }

  /* ===================================================== STEP 1 · BUYER */
  function BuyerCardRow(props) {
    var c = props.customer, selected = props.selected, onSelect = props.onSelect;
    var hov = useState(false); var h = hov[0], setH = hov[1];
    return React.createElement('button', { className: 'ds-focusable', onClick: function () { onSelect(c.id); }, onMouseEnter: function () { setH(true); }, onMouseLeave: function () { setH(false); },
      style: { display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', padding: '12px 14px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
        background: selected ? 'var(--primary-soft)' : (h ? 'var(--surface-hover)' : 'var(--surface)'),
        border: '1px solid ' + (selected ? 'var(--primary)' : 'var(--border)'), transition: 'var(--transition-base)' } },
      React.createElement(UI.Avatar, { name: c.name, size: 38, shape: 'circle' }),
      React.createElement('span', { style: { flex: 1, minWidth: 0, display: 'grid', gap: 2 } },
        React.createElement('span', { style: { fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, c.name),
        React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' } }, buyerIdLabel(c))),
      React.createElement('span', { style: { flex: 'none' } }, React.createElement(Pill, { tone: 'neutral' }, c.identificationType ? idType(c.identificationType).short : 'ID')),
      React.createElement('span', { style: { flex: 'none', width: 22, height: 22, borderRadius: 999, display: 'grid', placeItems: 'center', border: '2px solid ' + (selected ? 'var(--primary)' : 'var(--border-strong)'), background: selected ? 'var(--primary)' : 'transparent', color: '#fff' } },
        selected && I({ name: 'check', size: 13 })));
  }

  function CustomerForm(props) {
    var s = props.s, form = props.form, set = props.set, canManage = props.canManage;
    var t = idType(form.identificationType);
    var disabled = !canManage || s.actionLoading === 'create-customer';
    return React.createElement('div', { style: { display: 'grid', gap: 14 } },
      s.customerError && React.createElement(Banner, { tone: 'danger', icon: 'alert', title: 'No se pudo crear el comprador' }, s.customerError),
      React.createElement(Input, { label: 'Nombre o razón social', value: form.name, onChange: function (v) { set('name', v); }, placeholder: 'Comercial Andina S.A.', disabled: disabled, required: true, prefixIcon: 'user' }),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 } },
        React.createElement(Input, { label: 'Email', type: 'email', value: form.email, onChange: function (v) { set('email', v); }, placeholder: 'pagos@andina.ec', disabled: disabled, prefixIcon: 'mail' }),
        React.createElement(Select, { label: 'Tipo de identificación', value: form.identificationType, onChange: function (v) { set('identificationType', v); }, disabled: disabled,
          options: D.idTypes.map(function (x) { return { value: x.code, label: x.code + ' · ' + x.label }; }), hint: t.hint })),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 } },
        React.createElement(Input, { label: 'Identificación', value: form.taxId, onChange: function (v) { set('taxId', v); }, placeholder: t.placeholder, disabled: disabled || form.identificationType === '07', mono: true, prefixIcon: 'idCard',
          hint: form.identificationType === '07' ? 'Consumidor final usa 9999999999999' : (t.len ? t.len + ' dígitos' : 'Documento del comprador') }),
        React.createElement(Input, { label: 'Dirección', value: form.billingAddress, onChange: function (v) { set('billingAddress', v); }, placeholder: 'Dirección del comprador', disabled: disabled, prefixIcon: 'mapPin' })),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' } },
        canManage
          ? React.createElement(Btn, { variant: 'primary', leading: s.actionLoading === 'create-customer' ? null : 'userPlus', disabled: !form.name.trim() || s.actionLoading === 'create-customer', onClick: props.onCreate },
              s.actionLoading === 'create-customer' ? 'Guardando comprador…' : 'Guardar comprador')
          : React.createElement(Btn, { variant: 'secondary', leading: 'lock', disabled: true }, 'Solo lectura'),
        React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', flex: 1, minWidth: 160, lineHeight: 1.5 } }, 'El comprador queda aislado por tenant y se reutiliza en futuras facturas.')));
  }

  function BuyerStep(props) {
    var s = props.s, canManage = props.canManage;
    var hasCustomers = s.customers.length > 0;
    /* open the form when there's nothing to pick yet, or when the form is mid-flight,
       has an error, or already has typed content (so failures/progress are visible) */
    var wantOpen = !hasCustomers || !!s.customerError || s.actionLoading === 'create-customer' || (!!(props.form && props.form.name) && !s.selectedCustomerId);
    var creatingMode = useState(wantOpen); var showForm = creatingMode[0], setShowForm = creatingMode[1];

    return React.createElement(StepCard, { icon: 'users', eyebrow: 'Paso 1 de 3', title: hasCustomers ? 'Elige o crea el comprador' : 'Crea tu primer comprador',
      headerExtra: React.createElement(Pill, { tone: hasCustomers ? 'neutral' : 'info', dot: true }, hasCustomers ? s.customers.length + ' registrados' : 'Primer comprador') },

      !hasCustomers
        ? /* strong empty state */
          React.createElement('div', { style: { display: 'grid', gap: 16, justifyItems: 'center', textAlign: 'center', padding: '8px 0 4px' } },
            React.createElement('span', { style: { width: 56, height: 56, borderRadius: 'var(--radius-md)', display: 'grid', placeItems: 'center', background: 'var(--primary-soft)', color: 'var(--primary)' } }, I({ name: 'userPlus', size: 26 })),
            React.createElement('div', { style: { maxWidth: 420 } },
              React.createElement('h3', { style: { margin: 0, fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Aún no tienes compradores'),
              React.createElement('p', { style: { margin: '6px 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.55 } }, 'Toda factura empieza por un comprador. Registra el primero con sus datos fiscales de Ecuador y seguimos con el borrador.')))
        : /* directory + new buyer toggle */
          React.createElement('div', { style: { display: 'grid', gap: 12 } },
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
              React.createElement('span', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--text-subtle)', flex: 1 } }, 'Directorio fiscal'),
              canManage && React.createElement(Btn, { variant: showForm ? 'ghost' : 'secondary', size: 'sm', leading: showForm ? 'chevronUp' : 'userPlus', onClick: function () { setShowForm(!showForm); } }, showForm ? 'Ocultar formulario' : 'Nuevo comprador')),
            React.createElement('div', { style: { display: 'grid', gap: 8 } },
              s.customers.map(function (c) { return React.createElement(BuyerCardRow, { key: c.id, customer: c, selected: s.selectedCustomerId === c.id, onSelect: props.onSelect }); }))),

      (showForm || !hasCustomers) && React.createElement('div', { style: { display: 'grid', gap: 14, paddingTop: hasCustomers ? 14 : 0, borderTop: hasCustomers ? '1px solid var(--divider)' : 'none' } },
        hasCustomers && React.createElement('span', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--text-subtle)' } }, 'Nuevo comprador'),
        React.createElement(CustomerForm, { s: s, form: props.form, set: props.setForm, canManage: canManage, onCreate: props.onCreate })));
  }

  /* ===================================================== STEP 2 · IDENTITY */
  function FactRow(props) {
    return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: props.first ? 'none' : '1px solid var(--divider)' } },
      React.createElement('span', { style: { width: 30, height: 30, flex: 'none', borderRadius: 'var(--radius-xs)', display: 'grid', placeItems: 'center', background: 'var(--surface-sunken)', color: 'var(--text-muted)' } }, I({ name: props.icon, size: 15 })),
      React.createElement('span', { style: { flex: 'none', width: 130, fontSize: 'var(--text-2xs)', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--text-subtle)' } }, props.label),
      props.missing
        ? React.createElement('span', { style: { flex: 1, fontSize: 'var(--text-sm)', color: 'var(--text-subtle)', fontStyle: 'italic' } }, props.empty || 'Sin dato')
        : React.createElement('span', { style: { flex: 1, fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-strong)', fontFamily: props.mono ? 'var(--font-mono)' : 'inherit', overflow: 'hidden', textOverflow: 'ellipsis' } }, props.value));
  }
  function IdentityStep(props) {
    var s = props.s, canManage = props.canManage;
    var c = findCustomer(s, s.selectedCustomerId);
    if (!c) {
      return React.createElement(StepCard, { icon: 'idCard', eyebrow: 'Paso 2 de 3', title: 'Confirma la identidad fiscal' },
        React.createElement(Banner, { tone: 'info', icon: 'user', title: 'Elige un comprador primero' }, 'Vuelve al paso 1 para seleccionar o crear el comprador cuya identidad fiscal vas a confirmar.'),
        React.createElement(Btn, { variant: 'secondary', leading: 'arrowLeft', onClick: function () { props.onGo('buyer'); } }, 'Volver a comprador'));
    }
    var t = c.identificationType ? idType(c.identificationType) : null;
    return React.createElement(StepCard, { icon: 'idCard', eyebrow: 'Paso 2 de 3', title: 'Confirma la identidad fiscal',
      headerExtra: React.createElement(Pill, { tone: 'success', dot: true }, 'Comprador elegido') },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 14, padding: '4px 0 2px' } },
        React.createElement(UI.Avatar, { name: c.name, size: 48, shape: 'circle' }),
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('div', { style: { fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' } }, c.name),
          React.createElement('div', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' } }, t ? (t.code + ' · ' + t.label) : 'Sin tipo de identificación'))),
      React.createElement('div', { style: { background: 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '4px 16px' } },
        React.createElement(FactRow, { first: true, icon: 'idCard', label: 'Tipo', value: t ? (t.code + ' · ' + t.label) : '—', missing: !t }),
        React.createElement(FactRow, { icon: 'hash', label: 'Identificación', value: c.identification || c.taxId, mono: true, missing: !(c.identification || c.taxId), empty: 'Sin identificación' }),
        React.createElement(FactRow, { icon: 'mail', label: 'Email', value: c.email, missing: !c.email, empty: 'Sin email' }),
        React.createElement(FactRow, { icon: 'mapPin', label: 'Dirección', value: c.billingAddress, missing: !c.billingAddress, empty: 'Sin dirección' })),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 9, padding: '11px 13px', borderRadius: 'var(--radius-sm)', background: 'var(--info-soft)', color: 'var(--on-info-soft)' } },
        React.createElement('span', { style: { color: 'var(--info)', flex: 'none', display: 'inline-flex' } }, I({ name: 'help', size: 16 })),
        React.createElement('span', { style: { fontSize: 'var(--text-xs)', lineHeight: 1.45 } }, 'Estos datos identifican al comprador en la factura. Para Consumidor final (07) la identificación va como 9999999999999.')),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' } },
        React.createElement(Btn, { variant: 'primary', trailing: 'arrowRight', onClick: function () { props.onGo('draft'); } }, 'Confirmar y crear borrador'),
        React.createElement(Btn, { variant: 'ghost', leading: 'arrowLeft', onClick: function () { props.onGo('buyer'); } }, 'Elegir otro comprador')));
  }

  /* ===================================================== STEP 3 · DRAFT */
  var STATUS_OPTS = [
    { value: 'draft', label: 'draft · borrador' },
    { value: 'issued', label: 'issued · emitida' },
    { value: 'paid', label: 'paid · pagada' },
    { value: 'void', label: 'void · anulada' }
  ];
  function DraftStep(props) {
    var s = props.s, canManage = props.canManage, form = props.invForm, set = props.setInv;
    var hasCustomers = s.customers.length > 0;
    var c = findCustomer(s, form.customerId);

    if (s.lastCreatedInvoice) {
      var inv = s.lastCreatedInvoice;
      return React.createElement(StepCard, { icon: 'checkCircle', eyebrow: 'Paso 3 de 3', title: 'Borrador creado',
        headerExtra: React.createElement(Pill, { tone: 'success', dot: true }, 'Listo') },
        React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--success-soft)', color: 'var(--on-success-soft)' } },
          React.createElement('span', { style: { width: 40, height: 40, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: 'var(--surface)', color: 'var(--success)' } }, I({ name: 'fileCheck', size: 21 })),
          React.createElement('div', { style: { flex: 1 } },
            React.createElement('strong', { style: { fontWeight: 700, fontSize: 'var(--text-body)', color: 'var(--text-strong)' } }, 'Factura ' + inv.number + ' creada como borrador'),
            React.createElement('p', { style: { margin: '4px 0 0', fontSize: 'var(--text-sm)', lineHeight: 1.45 } }, 'Comprador: ' + inv.customerName + '. Todavía no se envía al SRI — el siguiente paso es agregar items.'))),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 } },
          [['Número', inv.number, true], ['Estado', inv.status, false], ['Items', inv.itemCount + ' agregados', false]].map(function (r, i) {
            return React.createElement('div', { key: i, style: { background: 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', display: 'grid', gap: 3 } },
              React.createElement('span', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--text-subtle)' } }, r[0]),
              React.createElement('span', { style: { fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)', fontFamily: r[2] ? 'var(--font-mono)' : 'inherit' } }, r[1]));
          })),
        React.createElement('div', { style: { display: 'flex', gap: 10, flexWrap: 'wrap' } },
          React.createElement(Btn, { variant: 'primary', trailing: 'arrowRight' }, 'Agregar items'),
          React.createElement(Btn, { variant: 'ghost', leading: 'plus', onClick: props.onAnother }, 'Crear otro borrador')));
    }

    if (!hasCustomers) {
      return React.createElement(StepCard, { icon: 'fileText', eyebrow: 'Paso 3 de 3', title: 'Crear borrador de factura',
        headerExtra: React.createElement(Pill, { tone: 'warning', dot: true }, 'Bloqueado') },
        React.createElement('div', { style: { display: 'grid', gap: 14, justifyItems: 'start' } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 13, padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--warning-soft)', color: 'var(--on-warning-soft)', width: '100%', boxSizing: 'border-box' } },
            React.createElement('span', { style: { color: 'var(--warning)', flex: 'none', display: 'inline-flex' } }, I({ name: 'lock', size: 20 })),
            React.createElement('div', null,
              React.createElement('strong', { style: { fontWeight: 700, fontSize: 'var(--text-body)' } }, 'Primero necesitas un comprador'),
              React.createElement('p', { style: { margin: '4px 0 0', fontSize: 'var(--text-sm)', lineHeight: 1.45 } }, 'No se puede crear un borrador sin un comprador con datos fiscales. Crea el primero en el paso 1.'))),
          React.createElement(Btn, { variant: 'primary', leading: 'userPlus', onClick: function () { props.onGo('buyer'); } }, 'Ir a crear comprador')));
    }

    var disabled = !canManage || s.actionLoading === 'create-invoice';
    var canCreate = canManage && form.customerId && form.currency.trim() && s.actionLoading !== 'create-invoice';
    return React.createElement(StepCard, { icon: 'fileText', eyebrow: 'Paso 3 de 3', title: 'Crear borrador de factura',
      headerExtra: React.createElement(Pill, { tone: 'neutral', dot: true }, 'Borrador primero') },
      s.invoiceError && React.createElement(Banner, { tone: 'danger', icon: 'alert', title: 'No se pudo crear la factura' }, s.invoiceError),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 } },
        React.createElement(Select, { label: 'Comprador', value: form.customerId, onChange: function (v) { set('customerId', v); }, disabled: disabled,
          options: [{ value: '', label: 'Selecciona un comprador' }].concat(s.customers.map(function (c) { return { value: c.id, label: c.name }; })) }),
        React.createElement(Input, { label: 'Número', value: form.number, onChange: function (v) { set('number', v); }, placeholder: D.numbering.previewNumber, disabled: disabled, mono: true, prefixIcon: 'hash',
          hint: 'Vacío = se autogenera (' + D.numbering.previewNumber + ')' })),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 } },
        React.createElement(Input, { label: 'Moneda', value: form.currency, onChange: function (v) { set('currency', v.toUpperCase()); }, placeholder: 'USD', disabled: disabled, maxLength: 3, mono: true, prefixIcon: 'coins', required: true }),
        React.createElement(Select, { label: 'Estado', value: form.status, onChange: function (v) { set('status', v); }, disabled: disabled, options: STATUS_OPTS, hint: 'Usa draft para ir agregando items' })),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 } },
        React.createElement(Input, { label: 'Vence el', type: 'date', value: form.dueAt, onChange: function (v) { set('dueAt', v); }, disabled: disabled, prefixIcon: 'calendar' }),
        React.createElement('div')),
      React.createElement(Textarea, { label: 'Notas', value: form.notes, onChange: function (v) { set('notes', v); }, placeholder: 'Notas opcionales para la factura', disabled: disabled }),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' } },
        canManage
          ? React.createElement(Btn, { variant: 'primary', leading: s.actionLoading === 'create-invoice' ? null : 'fileText', disabled: !canCreate, onClick: props.onCreateInvoice },
              s.actionLoading === 'create-invoice' ? 'Creando factura…' : 'Crear borrador')
          : React.createElement(Btn, { variant: 'secondary', leading: 'lock', disabled: true }, 'Solo lectura'),
        React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', flex: 1, minWidth: 180, lineHeight: 1.5 } }, 'Crear el borrador no lo envía al SRI. Después agregas items y preparas la emisión.')));
  }

  /* ===================================================== RIGHT RAIL */
  function FlowRail(props) {
    var s = props.s, derived = props.derived;
    var c = findCustomer(s, s.selectedCustomerId);
    var steps = [
      { key: 'buyer', label: 'Comprador', value: c ? c.name : (s.customers.length ? 'Ninguno elegido' : 'Sin compradores') },
      { key: 'identity', label: 'Identidad fiscal', value: c ? buyerIdLabel(c) : '—' },
      { key: 'draft', label: 'Borrador', value: s.lastCreatedInvoice ? ('Creado · ' + s.lastCreatedInvoice.number) : 'Pendiente' }
    ];
    return React.createElement('aside', { style: { display: 'grid', gap: 16, alignContent: 'start', position: 'sticky', top: 16 } },
      React.createElement('div', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' } },
        React.createElement('div', { style: { padding: '14px var(--card-pad)', borderBottom: '1px solid var(--divider)', display: 'flex', alignItems: 'center', gap: 9 } },
          React.createElement('span', { style: { color: 'var(--text-muted)', display: 'inline-flex' } }, I({ name: 'route', size: 16 })),
          React.createElement('h3', { style: { margin: 0, fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Resumen del flujo')),
        React.createElement('div', { style: { padding: '6px var(--card-pad) 12px' } },
          steps.map(function (it, i) {
            var done = derived.done.indexOf(it.key) >= 0;
            var current = derived.current === it.key;
            var tone = done ? 'success' : current ? 'primary' : 'neutral';
            var col = done ? 'var(--success)' : current ? 'var(--primary)' : 'var(--text-subtle)';
            return React.createElement('div', { key: it.key, style: { display: 'flex', gap: 11, alignItems: 'flex-start', padding: '10px 0', borderTop: i ? '1px solid var(--divider)' : 'none' } },
              React.createElement('span', { style: { width: 24, height: 24, flex: 'none', borderRadius: 999, display: 'grid', placeItems: 'center', background: done ? 'var(--success)' : current ? 'var(--primary)' : 'var(--surface-sunken)', color: done || current ? '#fff' : 'var(--text-subtle)', fontSize: 'var(--text-2xs)', fontWeight: 700, border: done || current ? 'none' : '1px solid var(--border-strong)' } },
                done ? I({ name: 'check', size: 13 }) : (i + 1)),
              React.createElement('span', { style: { display: 'grid', gap: 2, minWidth: 0, flex: 1 } },
                React.createElement('span', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, color: 'var(--text-muted)' } }, it.label),
                React.createElement('span', { style: { fontSize: 'var(--text-sm)', fontWeight: 600, color: col, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, it.value)));
          }))),
      /* draft target preview */
      s.selectedCustomerId && !s.lastCreatedInvoice && React.createElement('div', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--card-pad)', display: 'grid', gap: 10 } },
        React.createElement('div', { className: 'ds-eyebrow', style: { color: 'var(--text-subtle)' } }, 'Borrador a crear'),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
          React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-h3)', fontWeight: 600, color: 'var(--text-strong)' } }, props.invForm.number || D.numbering.previewNumber),
          !props.invForm.number && React.createElement(Pill, { tone: 'info' }, 'sugerido')),
        React.createElement('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } },
          React.createElement(Pill, { tone: 'neutral' }, props.invForm.currency || 'USD'),
          React.createElement(Pill, { tone: 'neutral' }, props.invForm.status))),
      /* SRI reassurance — operational, never scary */
      React.createElement('div', { style: { display: 'flex', gap: 11, padding: '13px 14px', borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)', border: '1px solid var(--border)' } },
        React.createElement('span', { style: { color: 'var(--text-muted)', flex: 'none', display: 'inline-flex', marginTop: 1 } }, I({ name: 'shield', size: 16 })),
        React.createElement('p', { style: { margin: 0, fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', lineHeight: 1.55 } },
          React.createElement('strong', { style: { color: 'var(--text)', fontWeight: 600 } }, 'Esto no es una emisión al SRI. '),
          'Aquí solo creas el comprador y el borrador. Los items, la firma y el envío electrónico vienen después, en sus propias pantallas.')));
  }

  /* ===================================================== PAGE */
  function deriveFlow(s, step) {
    var done = [];
    if (s.selectedCustomerId) { done.push('buyer'); }
    if (step === 'draft' || s.lastCreatedInvoice) { if (done.indexOf('buyer') < 0) done.push('buyer'); done.push('identity'); }
    if (s.lastCreatedInvoice) done.push('draft');
    var reachable = ['buyer'];
    if (s.selectedCustomerId) { reachable.push('identity'); reachable.push('draft'); }
    return { done: done, current: step, reachable: reachable };
  }

  function DesktopFlow(props) {
    var s = props.s;
    var canManage = s.permission.canManage;
    /* local interactive state seeded from the scenario */
    var stepState = useState(s.step); var step = stepState[0], setStep = stepState[1];
    var selState = useState(s.selectedCustomerId);
    var cForm = useState(s.customerForm); var custForm = cForm[0], setCustFormRaw = cForm[1];
    var iForm = useState(s.invoiceForm); var invForm = iForm[0], setInvFormRaw = iForm[1];

    /* re-seed when the scenario changes (viewer remounts via key, so this is the initial mount) */
    function setCustForm(k, v) { setCustFormRaw(Object.assign({}, custForm, (function () { var o = {}; o[k] = v; return o; })())); }
    function setInvForm(k, v) { setInvFormRaw(Object.assign({}, invForm, (function () { var o = {}; o[k] = v; return o; })())); }

    var effectiveSelected = s.selectedCustomerId;
    var sForView = Object.assign({}, s, { selectedCustomerId: effectiveSelected });
    var derived = deriveFlow(sForView, step);

    function go(k) { setStep(k); }
    function selectBuyer(id) { setInvForm('customerId', id); s.selectedCustomerId = id; setStep('identity'); }

    var body;
    if (step === 'buyer') body = React.createElement(BuyerStep, { s: s, canManage: canManage, form: custForm, setForm: setCustForm, onCreate: function () {}, onSelect: selectBuyer, onGo: go });
    else if (step === 'identity') body = React.createElement(IdentityStep, { s: s, canManage: canManage, onGo: go });
    else body = React.createElement(DraftStep, { s: s, canManage: canManage, invForm: invForm, setInv: setInvForm, onCreateInvoice: function () {}, onAnother: function () { setStep('buyer'); }, onGo: go });

    return React.createElement('div', { style: { padding: 'var(--gutter)', maxWidth: 1180, margin: '0 auto' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 18, flexWrap: 'wrap' } },
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('div', { className: 'ds-eyebrow' }, 'Invoicing · Primera factura'),
          React.createElement('h1', { style: { margin: '4px 0 0', fontSize: 'var(--text-display)', fontWeight: 800, letterSpacing: 'var(--track-tight)', color: 'var(--text-strong)' } }, 'Comprador y borrador'),
          React.createElement('p', { style: { margin: '6px 0 0', fontSize: 'var(--text-body)', color: 'var(--text-muted)', maxWidth: 640, lineHeight: 'var(--leading-body)' } }, 'Crea o elige al comprador, confirma su identidad fiscal y genera el borrador de la factura. Sin complicaciones de contabilidad.')),
        React.createElement('div', { style: { display: 'flex', gap: 8 } }, React.createElement(Btn, { variant: 'ghost', leading: 'help' }, 'Guía rápida'))),

      !canManage && React.createElement('div', { style: { marginBottom: 16 } },
        React.createElement(Banner, { tone: 'info', icon: 'lock', title: 'Solo lectura' },
          'Tu rol ' + s.permission.role + ' puede ver el flujo pero no crear compradores ni facturas. Falta el permiso ',
          React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontWeight: 600 } }, s.permission.missingPermission), '. Pídeselo a un Owner.')),

      React.createElement('div', { style: { display: 'grid', gap: 16 } },
        React.createElement(Stepper, { current: step, done: derived.done, reachable: derived.reachable, onGo: go }),
        React.createElement('div', { className: 'flow-grid', style: { display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 320px', gap: 16, alignItems: 'start' } },
          body,
          React.createElement(FlowRail, { s: sForView, derived: derived, invForm: invForm }))));
  }

  window.Flow = { DesktopFlow: DesktopFlow, deriveFlow: deriveFlow, idType: idType, buyerIdLabel: buyerIdLabel };
})();
