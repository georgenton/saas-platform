/* Mobile — Invoicing Customer + Draft Invoice Flow (slice 06). Purpose-built,
   not a shrunk desktop: a compact step indicator, one step at a time, a
   thumb-friendly primary action, and fiscal details entered in a bottom sheet.
   Shares window.Flow helpers + the real contracts. window.MobileFlow. */
(function () {
  var useState = React.useState;
  var I = window.Icon;
  var UI = window.UI;
  var Btn = UI.Btn, Pill = UI.Pill, Banner = UI.Banner, Avatar = UI.Avatar;
  var Chrome = window.Chrome;
  var MobileTopBar = Chrome.MobileTopBar, BottomTabs = Chrome.BottomTabs, Sheet = Chrome.Sheet;
  var D = window.FLOW_DATA;
  var idType = window.Flow.idType, buyerIdLabel = window.Flow.buyerIdLabel;

  function findCustomer(s, id) { for (var i = 0; i < s.customers.length; i++) if (s.customers[i].id === id) return s.customers[i]; return null; }

  /* compact field primitives */
  function MField(props) {
    return React.createElement('label', { style: { display: 'grid', gap: 6 } },
      React.createElement('span', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--text-subtle)' } }, props.label),
      props.children,
      props.hint && React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' } }, props.hint));
  }
  function MInput(props) {
    return React.createElement(MField, { label: props.label, hint: props.hint },
      React.createElement('input', { type: props.type || 'text', value: props.value, placeholder: props.placeholder, disabled: props.disabled, maxLength: props.maxLength,
        onChange: function (e) { props.onChange && props.onChange(e.target.value); },
        style: { height: 46, padding: '0 13px', background: props.disabled ? 'var(--surface-sunken)' : 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', font: 'inherit', fontFamily: props.mono ? 'var(--font-mono)' : 'var(--font-sans)', fontSize: 'var(--text-body)', color: 'var(--text-strong)', outline: 'none' } }));
  }
  function MSelect(props) {
    return React.createElement(MField, { label: props.label, hint: props.hint },
      React.createElement('span', { style: { position: 'relative', display: 'flex' } },
        React.createElement('select', { value: props.value, disabled: props.disabled, onChange: function (e) { props.onChange && props.onChange(e.target.value); },
          style: { appearance: 'none', WebkitAppearance: 'none', width: '100%', height: 46, padding: '0 38px 0 13px', background: props.disabled ? 'var(--surface-sunken)' : 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', font: 'inherit', fontSize: 'var(--text-body)', fontWeight: 500, color: 'var(--text-strong)', outline: 'none' } },
          props.options.map(function (o) { return React.createElement('option', { key: o.value, value: o.value }, o.label); })),
        React.createElement('span', { style: { position: 'absolute', right: 12, top: 15, color: 'var(--text-subtle)', pointerEvents: 'none', display: 'inline-flex' } }, I({ name: 'chevronDown', size: 16 }))));
  }

  /* compact step pills */
  var STEPS = [{ key: 'buyer', label: 'Comprador' }, { key: 'identity', label: 'Identidad' }, { key: 'draft', label: 'Borrador' }];
  function StepPills(props) {
    return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 6 } },
      STEPS.map(function (st, i) {
        var done = props.done.indexOf(st.key) >= 0; var current = props.current === st.key;
        var col = done ? 'var(--success)' : current ? 'var(--primary)' : 'var(--text-subtle)';
        return React.createElement(React.Fragment, { key: st.key },
          React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: 6 } },
            React.createElement('span', { style: { width: 22, height: 22, flex: 'none', borderRadius: 999, display: 'grid', placeItems: 'center', background: done ? 'var(--success)' : current ? 'var(--primary)' : 'var(--surface-sunken)', color: done || current ? '#fff' : 'var(--text-subtle)', fontSize: 11, fontWeight: 700, border: done || current ? 'none' : '1px solid var(--border-strong)' } },
              done ? I({ name: 'check', size: 12 }) : (i + 1)),
            current && React.createElement('span', { style: { fontSize: 'var(--text-2xs)', fontWeight: 700, color: col } }, st.label)),
          i < STEPS.length - 1 && React.createElement('span', { style: { flex: 1, height: 2, borderRadius: 2, background: done ? 'var(--success)' : 'var(--divider)', minWidth: 12 } }));
      }));
  }

  /* buyer row */
  function MBuyerRow(props) {
    var c = props.customer, sel = props.selected;
    return React.createElement('button', { className: 'ds-focusable', onClick: function () { props.onSelect(c.id); },
      style: { display: 'flex', alignItems: 'center', gap: 11, width: '100%', textAlign: 'left', padding: '12px 13px', borderRadius: 'var(--radius-md)', cursor: 'pointer', background: sel ? 'var(--primary-soft)' : 'var(--surface)', border: '1px solid ' + (sel ? 'var(--primary)' : 'var(--border)'), boxShadow: 'var(--shadow-sm)' } },
      React.createElement(Avatar, { name: c.name, size: 38, shape: 'circle' }),
      React.createElement('span', { style: { flex: 1, minWidth: 0, display: 'grid', gap: 2 } },
        React.createElement('span', { style: { fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, c.name),
        React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' } }, buyerIdLabel(c))),
      React.createElement('span', { style: { flex: 'none', width: 22, height: 22, borderRadius: 999, display: 'grid', placeItems: 'center', border: '2px solid ' + (sel ? 'var(--primary)' : 'var(--border-strong)'), background: sel ? 'var(--primary)' : 'transparent', color: '#fff' } }, sel && I({ name: 'check', size: 13 })));
  }

  /* customer form (used inside a bottom sheet) */
  function MCustomerForm(props) {
    var form = props.form, set = props.set, s = props.s;
    var t = idType(form.identificationType);
    var disabled = s.actionLoading === 'create-customer';
    return React.createElement('div', { style: { display: 'grid', gap: 14, paddingBottom: 4 } },
      s.customerError && React.createElement(Banner, { tone: 'danger', icon: 'alert', title: 'No se pudo crear' }, s.customerError),
      React.createElement(MInput, { label: 'Nombre o razón social', value: form.name, onChange: function (v) { set('name', v); }, placeholder: 'Comercial Andina S.A.', disabled: disabled }),
      React.createElement(MSelect, { label: 'Tipo de identificación', value: form.identificationType, onChange: function (v) { set('identificationType', v); }, disabled: disabled, hint: t.hint,
        options: D.idTypes.map(function (x) { return { value: x.code, label: x.code + ' · ' + x.label }; }) }),
      React.createElement(MInput, { label: 'Identificación', value: form.taxId, onChange: function (v) { set('taxId', v); }, placeholder: t.placeholder, disabled: disabled || form.identificationType === '07', mono: true,
        hint: form.identificationType === '07' ? 'Consumidor final: 9999999999999' : (t.len ? t.len + ' dígitos' : null) }),
      React.createElement(MInput, { label: 'Email', type: 'email', value: form.email, onChange: function (v) { set('email', v); }, placeholder: 'pagos@andina.ec', disabled: disabled }),
      React.createElement(MInput, { label: 'Dirección', value: form.billingAddress, onChange: function (v) { set('billingAddress', v); }, placeholder: 'Dirección del comprador', disabled: disabled }),
      React.createElement(Btn, { variant: 'primary', full: true, leading: disabled ? null : 'userPlus', disabled: !form.name.trim() || disabled, onClick: props.onCreate },
        disabled ? 'Guardando comprador…' : 'Guardar comprador'),
      React.createElement('p', { style: { margin: 0, fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', textAlign: 'center', lineHeight: 1.5 } }, 'El comprador se reutiliza en futuras facturas.'));
  }

  function MFact(props) {
    return React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: 12, padding: '9px 0', borderBottom: '1px solid var(--divider)' } },
      React.createElement('span', { style: { flex: 'none', fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', minWidth: 96 } }, props.label),
      React.createElement('span', { style: { flex: 1, textAlign: 'right', fontSize: 'var(--text-sm)', fontWeight: 500, color: props.missing ? 'var(--text-subtle)' : 'var(--text-strong)', fontFamily: props.mono ? 'var(--font-mono)' : 'inherit', fontStyle: props.missing ? 'italic' : 'normal' } }, props.missing ? (props.empty || 'Sin dato') : props.value));
  }

  /* the screen */
  function MobileFlowScreen(props) {
    var s = props.s, mood = props.mood, onMood = props.onMood;
    var canManage = s.permission.canManage;
    var stepState = useState(s.step); var step = stepState[0], setStep = stepState[1];
    var cForm = useState(s.customerForm); var custForm = cForm[0], setCustRaw = cForm[1];
    var iForm = useState(s.invoiceForm); var invForm = iForm[0], setInvRaw = iForm[1];
    /* auto-open the buyer sheet so create progress/errors/typed content are visible */
    var wantSheet = (s.step === 'buyer' && (s.actionLoading === 'create-customer' || !!s.customerError || (!!s.customerForm.name && !s.selectedCustomerId))) ? 'customer' : null;
    var sheetState = useState(wantSheet); var sheet = sheetState[0], setSheet = sheetState[1];
    var moodState = useState(false); var moodOpen = moodState[0], setMoodOpen = moodState[1];

    function setCust(k, v) { var o = {}; o[k] = v; setCustRaw(Object.assign({}, custForm, o)); }
    function setInv(k, v) { var o = {}; o[k] = v; setInvRaw(Object.assign({}, invForm, o)); }

    var done = window.Flow.deriveFlow(s, step).done;
    var c = findCustomer(s, s.selectedCustomerId);
    var hasCustomers = s.customers.length > 0;

    function selectBuyer(id) { s.selectedCustomerId = id; setInv('customerId', id); setStep('identity'); }

    /* ---- body per step ---- */
    var body, footer;
    if (step === 'buyer') {
      body = React.createElement('div', { style: { display: 'grid', gap: 12 } },
        !hasCustomers
          ? React.createElement('div', { style: { display: 'grid', gap: 14, justifyItems: 'center', textAlign: 'center', padding: '18px 8px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' } },
              React.createElement('span', { style: { width: 52, height: 52, borderRadius: 'var(--radius-md)', display: 'grid', placeItems: 'center', background: 'var(--primary-soft)', color: 'var(--primary)' } }, I({ name: 'userPlus', size: 24 })),
              React.createElement('div', null,
                React.createElement('h3', { style: { margin: 0, fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Tu primer comprador'),
                React.createElement('p', { style: { margin: '6px 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.5 } }, 'Toda factura empieza por un comprador con datos fiscales de Ecuador.')))
          : React.createElement('div', { style: { display: 'grid', gap: 8 } },
              React.createElement('span', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--text-subtle)' } }, s.customers.length + ' compradores'),
              s.customers.map(function (cc) { return React.createElement(MBuyerRow, { key: cc.id, customer: cc, selected: s.selectedCustomerId === cc.id, onSelect: selectBuyer }); })));
      footer = canManage
        ? React.createElement(Btn, { variant: hasCustomers ? 'secondary' : 'primary', full: true, leading: 'userPlus', onClick: function () { setSheet('customer'); } }, hasCustomers ? 'Nuevo comprador' : 'Crear comprador')
        : React.createElement(Btn, { variant: 'secondary', full: true, leading: 'lock', disabled: true }, 'Solo lectura');
    } else if (step === 'identity') {
      if (!c) {
        body = React.createElement(Banner, { tone: 'info', icon: 'user', title: 'Elige un comprador' }, 'Vuelve al paso 1 para seleccionar el comprador.');
        footer = React.createElement(Btn, { variant: 'secondary', full: true, leading: 'arrowLeft', onClick: function () { setStep('buyer'); } }, 'Volver a comprador');
      } else {
        var t = c.identificationType ? idType(c.identificationType) : null;
        body = React.createElement('div', { style: { display: 'grid', gap: 12 } },
          React.createElement('div', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 15 } },
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 } },
              React.createElement(Avatar, { name: c.name, size: 44, shape: 'circle' }),
              React.createElement('div', { style: { flex: 1, minWidth: 0 } },
                React.createElement('div', { style: { fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' } }, c.name),
                React.createElement('div', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' } }, t ? (t.code + ' · ' + t.label) : 'Sin tipo')),
              React.createElement(Pill, { tone: 'success', dot: true }, 'Elegido')),
            React.createElement(MFact, { label: 'Identificación', value: c.identification || c.taxId, mono: true, missing: !(c.identification || c.taxId), empty: 'Sin identificación' }),
            React.createElement(MFact, { label: 'Email', value: c.email, missing: !c.email, empty: 'Sin email' }),
            React.createElement(MFact, { label: 'Dirección', value: c.billingAddress, missing: !c.billingAddress, empty: 'Sin dirección' })),
          React.createElement('div', { style: { display: 'flex', gap: 9, padding: '11px 13px', borderRadius: 'var(--radius-sm)', background: 'var(--info-soft)', color: 'var(--on-info-soft)' } },
            React.createElement('span', { style: { color: 'var(--info)', flex: 'none', display: 'inline-flex' } }, I({ name: 'help', size: 15 })),
            React.createElement('span', { style: { fontSize: 'var(--text-2xs)', lineHeight: 1.45 } }, 'Estos datos identifican al comprador en la factura.')),
          React.createElement('button', { className: 'ds-focusable', onClick: function () { setStep('buyer'); }, style: { background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: 'var(--text-sm)', cursor: 'pointer', padding: 4, justifySelf: 'start' } }, 'Elegir otro comprador'));
        footer = React.createElement(Btn, { variant: 'primary', full: true, trailing: 'arrowRight', onClick: function () { setStep('draft'); } }, 'Confirmar y continuar');
      }
    } else { /* draft */
      if (s.lastCreatedInvoice) {
        var inv = s.lastCreatedInvoice;
        body = React.createElement('div', { style: { display: 'grid', gap: 12 } },
          React.createElement('div', { style: { display: 'grid', gap: 12, justifyItems: 'center', textAlign: 'center', padding: '18px 12px', background: 'var(--success-soft)', color: 'var(--on-success-soft)', borderRadius: 'var(--radius-md)' } },
            React.createElement('span', { style: { width: 50, height: 50, borderRadius: 'var(--radius-md)', display: 'grid', placeItems: 'center', background: 'var(--surface)', color: 'var(--success)' } }, I({ name: 'fileCheck', size: 24 })),
            React.createElement('div', null,
              React.createElement('strong', { style: { fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)', fontFamily: 'var(--font-mono)' } }, inv.number),
              React.createElement('p', { style: { margin: '6px 0 0', fontSize: 'var(--text-sm)', lineHeight: 1.45 } }, 'Borrador creado para ' + inv.customerName + '. Todavía no se envía al SRI.'))),
          React.createElement('div', { style: { display: 'flex', gap: 8, justifyContent: 'center' } },
            React.createElement(Pill, { tone: 'neutral' }, inv.status), React.createElement(Pill, { tone: 'neutral' }, inv.currency), React.createElement(Pill, { tone: 'neutral' }, inv.itemCount + ' items')));
        footer = React.createElement('div', { style: { display: 'grid', gap: 8 } },
          React.createElement(Btn, { variant: 'primary', full: true, trailing: 'arrowRight' }, 'Agregar items'),
          React.createElement(Btn, { variant: 'ghost', full: true, leading: 'plus', onClick: function () { setStep('buyer'); } }, 'Crear otro borrador'));
      } else if (!hasCustomers) {
        body = React.createElement('div', { style: { display: 'flex', gap: 11, padding: 15, borderRadius: 'var(--radius-md)', background: 'var(--warning-soft)', color: 'var(--on-warning-soft)' } },
          React.createElement('span', { style: { color: 'var(--warning)', flex: 'none', display: 'inline-flex' } }, I({ name: 'lock', size: 19 })),
          React.createElement('div', null,
            React.createElement('strong', { style: { fontSize: 'var(--text-sm)' } }, 'Primero necesitas un comprador'),
            React.createElement('p', { style: { margin: '4px 0 0', fontSize: 'var(--text-xs)', lineHeight: 1.45 } }, 'No se puede crear un borrador sin comprador.')));
        footer = React.createElement(Btn, { variant: 'primary', full: true, leading: 'userPlus', onClick: function () { setStep('buyer'); } }, 'Ir a crear comprador');
      } else {
        var disabled = !canManage || s.actionLoading === 'create-invoice';
        var canCreate = canManage && invForm.customerId && invForm.currency.trim() && s.actionLoading !== 'create-invoice';
        body = React.createElement('div', { style: { display: 'grid', gap: 14 } },
          s.invoiceError && React.createElement(Banner, { tone: 'danger', icon: 'alert', title: 'No se pudo crear' }, s.invoiceError),
          React.createElement(MSelect, { label: 'Comprador', value: invForm.customerId, onChange: function (v) { setInv('customerId', v); }, disabled: disabled,
            options: [{ value: '', label: 'Selecciona un comprador' }].concat(s.customers.map(function (cc) { return { value: cc.id, label: cc.name }; })) }),
          React.createElement(MInput, { label: 'Número', value: invForm.number, onChange: function (v) { setInv('number', v); }, placeholder: D.numbering.previewNumber, disabled: disabled, mono: true, hint: 'Vacío = se autogenera' }),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 } },
            React.createElement(MInput, { label: 'Moneda', value: invForm.currency, onChange: function (v) { setInv('currency', v.toUpperCase()); }, disabled: disabled, maxLength: 3, mono: true }),
            React.createElement(MSelect, { label: 'Estado', value: invForm.status, onChange: function (v) { setInv('status', v); }, disabled: disabled,
              options: [{ value: 'draft', label: 'draft' }, { value: 'issued', label: 'issued' }, { value: 'paid', label: 'paid' }, { value: 'void', label: 'void' }] })),
          React.createElement(MInput, { label: 'Vence el', type: 'date', value: invForm.dueAt, onChange: function (v) { setInv('dueAt', v); }, disabled: disabled }),
          React.createElement('div', { style: { display: 'flex', gap: 9, padding: '11px 13px', borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)', border: '1px solid var(--border)' } },
            React.createElement('span', { style: { color: 'var(--text-muted)', flex: 'none', display: 'inline-flex' } }, I({ name: 'shield', size: 15 })),
            React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', lineHeight: 1.45 } }, 'Crear el borrador no lo envía al SRI.')));
        footer = canManage
          ? React.createElement(Btn, { variant: 'primary', full: true, leading: s.actionLoading === 'create-invoice' ? null : 'fileText', disabled: !canCreate, onClick: function () {} }, s.actionLoading === 'create-invoice' ? 'Creando factura…' : 'Crear borrador')
          : React.createElement(Btn, { variant: 'secondary', full: true, leading: 'lock', disabled: true }, 'Solo lectura');
      }
    }

    return React.createElement('div', { style: { height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--app-bg)' } },
      React.createElement(MobileTopBar, { tenant: D.tenant, onTenant: function () {}, onMood: function () { setMoodOpen(true); }, onAssistant: function () {} }),
      React.createElement('div', { style: { flex: 'none', padding: '12px 14px 12px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 } },
          React.createElement('div', { style: { flex: 1, minWidth: 0 } },
            React.createElement('div', { className: 'ds-eyebrow' }, 'Invoicing · Primera factura'),
            React.createElement('h1', { style: { margin: '2px 0 0', fontSize: 'var(--text-h1)', fontWeight: 800, letterSpacing: 'var(--track-snug)', color: 'var(--text-strong)' } }, 'Comprador y borrador'))),
        React.createElement(StepPills, { current: step, done: done })),

      React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: 14, display: 'grid', gap: 12, alignContent: 'start' } },
        !canManage && React.createElement(Banner, { tone: 'info', icon: 'lock', title: 'Solo lectura' }, 'Tu rol ' + s.permission.role + ' no puede crear compradores ni facturas.'),
        body),

      footer && React.createElement('div', { style: { flex: 'none', padding: 14, background: 'var(--surface)', borderTop: '1px solid var(--border)' } }, footer),

      React.createElement(BottomTabs, { active: 'queue', onTab: function () {} }),

      sheet === 'customer' && React.createElement(Sheet, { title: 'Nuevo comprador', onClose: function () { setSheet(null); } },
        React.createElement(MCustomerForm, { s: s, form: custForm, set: setCust, onCreate: function () {} })),
      moodOpen && React.createElement(Sheet, { title: 'Modo de diseño', onClose: function () { setMoodOpen(false); } },
        React.createElement(UI.MoodMenu, { value: mood, onChange: function (m) { onMood(m); }, moods: D.moods })));
  }

  window.MobileFlow = { MobileFlowScreen: MobileFlowScreen };
})();
