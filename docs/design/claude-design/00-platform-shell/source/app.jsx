/* Viewer chrome + desktop frame orchestration. Switch device, shell state and
   design mood. The mood applies to the device preview only; the viewer chrome
   stays neutral. Selection persists in localStorage. */
(function () {
  const { useState, useEffect } = React;
  const Icon = window.Icon;
  const D = window.SHELL_DATA;
  const { Btn, Banner, MoodSwatch, StateScreen, AssistantPanel } = window.UI;
  const { Sidebar, TopBar, Dashboard, Marketplace } = window.Desktop;
  const { MobileShell } = window.Mobile;

  const STATES = [
    { key: 'ready', label: 'Authenticated shell', section: 'Dashboard', active: 'dashboard' },
    { key: 'dev-banner', label: 'Local / dev banner', section: 'Dashboard', active: 'dashboard' },
    { key: 'permission-limited', label: 'Permission-limited product', section: 'Tax Compliance EC', active: 'tax-compliance-ec' },
    { key: 'marketplace', label: 'Add products / marketplace', section: 'Add products', active: null },
    { key: 'blocked-by-plan', label: 'Product blocked by plan', section: 'Accounting', active: 'accounting' },
    { key: 'product-disabled', label: 'Product disabled', section: 'Psychology Clinics', active: 'psychology' },
    { key: 'permission-denied', label: 'Permission denied', section: 'Accounting', active: 'accounting' },
    { key: 'tenant-missing', label: 'Tenant missing', section: '—', active: null },
    { key: 'loading', label: 'Loading current user', section: '', active: null },
    { key: 'backend-unavailable', label: 'Backend unavailable', section: '—', active: null }
  ];

  function Skeleton({ h, w }) {
    return <div style={{ height: h, width: w || '100%', borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)', border: '1px solid var(--border)' }} />;
  }

  function PlanRow() {
    return (
      <div style={{ display: 'flex', gap: 10 }}>
        {D.plans.map((p) => (
          <div key={p.key} style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', border: `1px solid ${p.key === 'scale' ? 'var(--primary)' : 'var(--border)'}`, background: p.key === 'scale' ? 'var(--primary-soft)' : 'var(--surface)', minWidth: 96 }}>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)' }}>{p.name}</div>
            <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>{p.price}</div>
            {p.current && <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>Actual</div>}
          </div>
        ))}
      </div>
    );
  }

  function DesktopContent({ state }) {
    if (state === 'loading') {
      return (
        <div style={{ padding: 24, display: 'grid', gap: 16, maxWidth: 1180, margin: '0 auto' }}>
          <Skeleton h={44} w={260} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>{[0, 1, 2, 3].map((i) => <Skeleton key={i} h={96} />)}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16 }}><Skeleton h={260} /><Skeleton h={260} /></div>
        </div>
      );
    }
    if (state === 'marketplace') return <Marketplace d={D} onClose={() => {}} />;
    if (state === 'tenant-missing') {
      return <StateScreen icon="building" tone="info" title="No hay un tenant activo" actions={[<Btn key={1} variant="primary">Elegir empresa</Btn>, <Btn key={2} variant="secondary">Crear empresa</Btn>]}>Tu usuario está autenticado pero no tiene una empresa activa. Elige una de tus membresías o crea una nueva para continuar.</StateScreen>;
    }
    if (state === 'permission-denied') {
      return <StateScreen icon="shield" tone="warning" title="No tienes permiso para Accounting" meta="requiere: accounting.view" actions={[<Btn key={1} variant="primary">Solicitar acceso</Btn>, <Btn key={2} variant="ghost">Volver al Dashboard</Btn>]}>Accounting está habilitado para Acme Logística, pero tu rol no incluye este permiso. Pídeselo al Owner del tenant — te avisaremos cuando lo concedan.</StateScreen>;
    }
    if (state === 'product-disabled') {
      return <StateScreen icon="psychology" tone="neutral" title="Psychology Clinics no está habilitado" actions={[<Btn key={1} variant="primary">Ver en Marketplace</Btn>, <Btn key={2} variant="ghost">Volver</Btn>]}>Este producto existe en la plataforma pero no está activado para este tenant. Lo mantenemos visible para que sepas que está disponible.</StateScreen>;
    }
    if (state === 'blocked-by-plan') {
      return (
        <div style={{ display: 'grid', placeItems: 'center', minHeight: '100%', padding: 32 }}>
          <div style={{ maxWidth: 460, textAlign: 'center', display: 'grid', gap: 16, justifyItems: 'center' }}>
            <span style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', display: 'grid', placeItems: 'center', background: 'var(--info-soft)', color: 'var(--info)' }}><Icon name="lock" size={26} /></span>
            <h2 style={{ margin: 0, fontSize: 'var(--text-h1)', fontWeight: 600, color: 'var(--text-strong)' }}>Accounting está en el plan Scale</h2>
            <p style={{ margin: 0, fontSize: 'var(--text-body)', color: 'var(--text-muted)', lineHeight: 1.6 }}>Tu plan actual es Growth. Actualiza a Scale para activar Accounting con libros formales, conciliación y cierre.</p>
            <PlanRow />
            <Btn variant="primary">Actualizar a Scale</Btn>
          </div>
        </div>
      );
    }
    return (
      <div>
        {state === 'dev-banner' && <div style={{ padding: '14px 24px 0' }}><Banner tone="warning" icon="alert" title="Local / dev environment" onDismiss={() => {}}>{'Conectado a ' + D.env.apiBaseUrl + ' · los datos son de prueba.'}</Banner></div>}
        {state === 'permission-limited' && <div style={{ padding: '14px 24px 0' }}><Banner tone="info" icon="eye" title="Acceso de solo lectura" action={<Btn size="sm" variant="secondary">Solicitar tax.manage</Btn>}>Puedes ver Tax Compliance EC pero no editar declaraciones — falta el permiso tax.manage.</Banner></div>}
        <Dashboard d={D} />
      </div>
    );
  }

  function DesktopView({ state, mood, onMood }) {
    const [assistantOpen, setAssistantOpen] = useState(false);
    const meta = STATES.find((s) => s.key === state) || STATES[0];
    const isError = state === 'backend-unavailable';
    const tenant = state === 'tenant-missing' ? Object.assign({}, D.tenant, { name: 'Seleccionar empresa', role: '—', ruc: '—' }) : D.tenant;
    return (
      <div data-mood={mood} style={{ position: 'relative', height: '100%', display: 'flex', background: 'var(--app-bg)', color: 'var(--text)', overflow: 'hidden' }}>
        {!isError && <Sidebar products={D.products} activeKey={meta.active} onNav={() => {}} onMarketplace={() => {}} user={D.user} />}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {!isError && <TopBar tenant={tenant} memberships={D.memberships} section={meta.section} mood={mood} moods={D.moods} onMood={onMood} onAssistant={() => setAssistantOpen(true)} showTenantMenu={state !== 'tenant-missing'} />}
          <main style={{ flex: 1, overflowY: 'auto', background: 'var(--app-bg)' }}>
            {isError ? (
              <div style={{ height: '100%', display: 'grid', gridTemplateRows: 'auto 1fr' }}>
                <div style={{ padding: 16 }}><Banner tone="danger" icon="server" title={D.backendError.title}>{D.backendError.message}</Banner></div>
                <StateScreen icon="server" tone="danger" title={D.backendError.title} meta={'correlationId ' + D.backendError.correlationId + ' · GET /api/auth/me'} actions={[<Btn key={1} variant="primary" leading="spark">Reintentar</Btn>, <Btn key={2} variant="ghost">Estado del sistema</Btn>]}>{D.backendError.message}</StateScreen>
              </div>
            ) : (
              <DesktopContent state={state} />
            )}
          </main>
        </div>
        {assistantOpen && !isError && <AssistantPanel assistant={D.assistant} onClose={() => setAssistantOpen(false)} />}
      </div>
    );
  }

  function App() {
    const [device, setDevice] = useState(() => localStorage.getItem('ps.device') || 'desktop');
    const [state, setState] = useState(() => localStorage.getItem('ps.state') || 'ready');
    const [mood, setMood] = useState(() => localStorage.getItem('ps.mood') || 'comfort');
    useEffect(() => { localStorage.setItem('ps.device', device); }, [device]);
    useEffect(() => { localStorage.setItem('ps.state', state); }, [state]);
    useEffect(() => { localStorage.setItem('ps.mood', mood); }, [mood]);

    const seg = (val, cur, set, label) => (
      <button key={val} onClick={() => set(val)} className="ds-focusable" style={{ padding: '6px 12px', border: 'none', cursor: 'pointer', borderRadius: 6, fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-sans)', color: cur === val ? '#0c1014' : '#6b7686', background: cur === val ? '#fff' : 'transparent', boxShadow: cur === val ? '0 1px 2px rgba(0,0,0,0.10)' : 'none' }}>{label}</button>
    );

    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#eef1f4', fontFamily: 'var(--font-sans)' }}>
        <div style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 16, padding: '10px 16px', background: '#fff', borderBottom: '1px solid #e4e8ed', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ width: 24, height: 24, borderRadius: 6, background: '#2a63d6', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 13 }}>S</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#161b21' }}>Platform Shell</span>
            <span style={{ fontSize: 12, color: '#6b7686' }}>· Design kit</span>
          </div>
          <div style={{ display: 'inline-flex', gap: 2, padding: 3, background: '#f6f8fa', borderRadius: 8, border: '1px solid #e4e8ed' }}>
            {seg('desktop', device, setDevice, 'Desktop')}{seg('mobile', device, setDevice, 'Mobile')}
          </div>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#6b7686' }}>State
            <select value={state} onChange={(e) => setState(e.target.value)} className="ds-focusable" style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, color: '#161b21', background: '#fff', border: '1px solid #d6dbe2', borderRadius: 6, padding: '6px 10px', cursor: 'pointer' }}>
              {STATES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </label>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#6b7686' }}>Mood</span>
            <div style={{ display: 'inline-flex', gap: 4 }}>
              {D.moods.map((m) => (
                <button key={m.key} title={m.label} onClick={() => setMood(m.key)} className="ds-focusable" style={{ padding: 3, borderRadius: 7, cursor: 'pointer', border: `1px solid ${mood === m.key ? '#2a63d6' : '#e4e8ed'}`, background: mood === m.key ? '#eef3fd' : '#fff', display: 'inline-flex' }}>
                  <MoodSwatch mood={m.key} size={20} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'hidden', display: 'grid', placeItems: device === 'mobile' ? 'center' : 'stretch', padding: device === 'mobile' ? 20 : 0 }}>
          {device === 'desktop' ? (
            <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}><DesktopView state={state} mood={mood} onMood={setMood} /></div>
          ) : (
            <div data-mood={mood} style={{ width: 390, height: 780, maxHeight: '100%', borderRadius: 30, border: '10px solid #11161b', background: 'var(--app-bg)', overflow: 'hidden', boxShadow: '0 24px 60px rgba(8,12,18,0.32)', position: 'relative' }}>
              <MobileShell d={D} state={state} mood={mood} onMood={setMood} />
            </div>
          )}
        </div>
      </div>
    );
  }

  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
})();
