/* Product Command Center — mobile. A compact product LAUNCHER (not a shrunk
   desktop grid): stacked summary cards, a segmented domain filter, and a
   single-column product list. Mounts inside the Platform Shell mobile frame
   (top bar + bottom tabs + sheets, reused from chrome.jsx). */
(function () {
  const { useState } = React;
  const Icon = window.Icon;
  const { Btn, Pill, Banner, Avatar, MoodMenu } = window.UI;
  const { MobileTopBar, BottomTabs, Sheet } = window.Chrome;
  const { STATE } = window.CC;
  const DOT = { success: 'var(--success)', warning: 'var(--warning)', neutral: 'var(--text-subtle)' };
  const aTones = { info: 'var(--info)', warning: 'var(--warning)', neutral: 'var(--text-muted)' };

  /* Stacked summary cards (tenant · plan · access overview) */
  function SummaryStack({ d }) {
    const sub = d.subscription;
    const pct = Math.round((sub.seats.used / sub.seats.included) * 100);
    return (
      <div style={{ display: 'grid', gap: 10 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 14, display: 'grid', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 32, height: 32, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: 'var(--primary-soft)', color: 'var(--primary)' }}><Icon name="building" size={17} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.tenant.name}</div>
              <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>RUC {d.tenant.ruc}</div>
            </div>
            <Pill tone="success" dot>{d.tenant.environmentLabel}</Pill>
          </div>
          <div style={{ height: 1, background: 'var(--divider)' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
              <span style={{ color: 'var(--text-muted)', display: 'inline-flex', flex: 'none' }}><Icon name="creditCard" size={15} /></span>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)', whiteSpace: 'nowrap' }}>Plan {sub.planName}</span>
              <span className="ds-tnum" style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{sub.priceDisplay}</span>
            </div>
            <span className="ds-tnum" style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', whiteSpace: 'nowrap', flex: 'none' }}>{sub.seats.used}/{sub.seats.included} asientos</span>
          </div>
          <div style={{ height: 5, borderRadius: 999, background: 'var(--surface-sunken)', overflow: 'hidden' }}>
            <div style={{ width: pct + '%', height: '100%', borderRadius: 999, background: 'var(--primary)' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {d.accessOverview.counts.map((c) => (
            <span key={c.state} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-2xs)', fontWeight: 600, color: 'var(--text-muted)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 999, padding: '4px 9px' }}>
              <span style={{ width: 7, height: 7, borderRadius: 999, background: c.tone === 'primary' ? 'var(--primary)' : c.tone === 'neutral' ? 'var(--text-subtle)' : `var(--${c.tone})` }} />
              {c.label} {c.value}
            </span>
          ))}
        </div>
      </div>
    );
  }

  /* Horizontal segmented domain filter */
  function DomainFilter({ domains, value, onChange }) {
    const segs = [{ key: 'all', short: 'Todos' }].concat(domains);
    return (
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2, margin: '0 -2px' }}>
        {segs.map((s) => {
          const on = s.key === value;
          return (
            <button key={s.key} className="ds-focusable" onClick={() => onChange(s.key)}
              style={{ flex: 'none', padding: '7px 13px', borderRadius: 999, cursor: 'pointer', fontSize: 'var(--text-xs)', fontWeight: 600, whiteSpace: 'nowrap',
                border: `1px solid ${on ? 'var(--primary)' : 'var(--border)'}`, background: on ? 'var(--primary-soft)' : 'var(--surface)', color: on ? 'var(--on-primary-soft)' : 'var(--text-muted)' }}>{s.short}</button>
          );
        })}
      </div>
    );
  }

  /* Compact launcher card */
  function LauncherCard({ p }) {
    const s = STATE[p.accessState] || STATE.disabled;
    const primaryVariant = p.primary.action === 'marketplace' ? 'secondary' : 'primary';
    return (
      <div style={{ background: s.active ? 'var(--surface)' : 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: s.active ? 'var(--shadow-sm)' : 'none', padding: 14, display: 'grid', gap: 11 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11 }}>
          <span style={{ width: 38, height: 38, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: s.active ? 'var(--primary-soft)' : 'var(--surface)', border: s.active ? '1px solid transparent' : '1px solid var(--border)', color: s.active ? 'var(--primary)' : 'var(--text-muted)' }}><Icon name={p.icon} size={19} /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)', lineHeight: 1.25 }}>{p.name}</div>
            <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.4 }}>{p.purpose}</div>
          </div>
          <Pill tone={s.pill} dot style={{ flex: 'none' }}>{s.lock && <Icon name="lock" size={10} />}{s.label}</Pill>
        </div>

        {s.active && p.readiness && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {p.readiness.slice(0, 3).map((r, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-2xs)', color: 'var(--text)', background: 'var(--surface-sunken)', borderRadius: 999, padding: '4px 9px', whiteSpace: 'nowrap' }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: DOT[r.tone] || DOT.neutral }} />
                <span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
                <span className="ds-tnum" style={{ fontWeight: 600, color: 'var(--text-strong)' }}>{r.value}</span>
              </span>
            ))}
          </div>
        )}

        {s.active && p.evidence && (
          <div style={{ display: 'flex', gap: 7, alignItems: 'center', fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>
            <Icon name="clock" size={13} style={{ color: 'var(--text-subtle)', flex: 'none' }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.evidence.label} · {p.evidence.when}</span>
          </div>
        )}

        {!s.active && p.blocker && (
          <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', lineHeight: 1.45, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '8px 10px' }}>{p.blocker.text}</div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Btn variant={primaryVariant} size="sm" full trailing={p.primary.action === 'enter' ? 'arrowRight' : undefined} leading={p.primary.action === 'add' ? 'plus' : undefined}>{p.primary.label}</Btn>
          {(p.addonPrice && !s.active) && <span style={{ flex: 'none', fontSize: 'var(--text-2xs)', fontWeight: 600, color: 'var(--text-muted)' }}>{p.addonPrice}</span>}
        </div>
      </div>
    );
  }

  function MobileCommandCenter({ d, banner }) {
    const [filter, setFilter] = useState('all');
    const first = (d.user.name || '').split(' ')[0];
    const list = filter === 'all' ? d.products : d.products.filter((p) => p.domain === filter);
    return (
      <div style={{ padding: 14, display: 'grid', gap: 14 }}>
        {banner}
        <div>
          <div className="ds-eyebrow">Workspace</div>
          <h1 style={{ margin: '2px 0 0', fontSize: 'var(--text-h1)', fontWeight: 700, letterSpacing: 'var(--track-snug)', color: 'var(--text-strong)' }}>Centro de operaciones</h1>
          <p style={{ margin: '4px 0 0', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.45 }}>Hola {first} — entra a un producto o agrega los que necesites.</p>
        </div>
        <SummaryStack d={d} />
        <DomainFilter domains={d.domains} value={filter} onChange={setFilter} />
        <div style={{ display: 'grid', gap: 10 }}>
          {list.map((p) => <LauncherCard key={p.key} p={p} />)}
        </div>
      </div>
    );
  }

  function MobileEmpty({ d }) {
    return (
      <div style={{ padding: 14, display: 'grid', gap: 14 }}>
        <div>
          <div className="ds-eyebrow">Workspace</div>
          <h1 style={{ margin: '2px 0 0', fontSize: 'var(--text-h1)', fontWeight: 700, color: 'var(--text-strong)' }}>Centro de operaciones</h1>
        </div>
        <SummaryStack d={Object.assign({}, d, { accessOverview: { counts: [{ state: 'available', label: 'Listos para activar', value: 8, tone: 'primary' }] } })} />
        <div style={{ display: 'grid', placeItems: 'center', padding: '28px 16px', background: 'var(--surface)', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ textAlign: 'center', display: 'grid', gap: 12, justifyItems: 'center' }}>
            <span style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', display: 'grid', placeItems: 'center', background: 'var(--primary-soft)', color: 'var(--primary)' }}><Icon name="sprout" size={22} /></span>
            <h2 style={{ margin: 0, fontSize: 'var(--text-h3)', fontWeight: 600, color: 'var(--text-strong)' }}>{d.empty.title}</h2>
            <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.5 }}>{d.empty.message}</p>
            <Btn variant="primary" size="sm" leading="marketplace">Explorar el marketplace</Btn>
          </div>
        </div>
      </div>
    );
  }

  function MobileError({ d }) {
    return (
      <div style={{ padding: 14, display: 'grid', gap: 12 }}>
        <Banner tone="danger" icon="server" title={d.backendError.title}>{d.backendError.message}</Banner>
        <div style={{ display: 'grid', placeItems: 'center', padding: '32px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ textAlign: 'center', display: 'grid', gap: 12, justifyItems: 'center' }}>
            <span style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', display: 'grid', placeItems: 'center', background: 'var(--danger-soft)', color: 'var(--danger)' }}><Icon name="server" size={22} /></span>
            <h2 style={{ margin: 0, fontSize: 'var(--text-h3)', fontWeight: 600, color: 'var(--text-strong)' }}>No pudimos cargar tus productos</h2>
            <Btn variant="primary" size="sm" leading="refresh">Reintentar</Btn>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)' }}>correlationId {d.backendError.correlationId}</div>
          </div>
        </div>
      </div>
    );
  }

  function MobileLoading() {
    return (
      <div style={{ padding: 14, display: 'grid', gap: 12 }}>
        <div style={{ height: 40, width: 220, borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)', border: '1px solid var(--border)' }} />
        <div style={{ height: 120, borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)', border: '1px solid var(--border)' }} />
        {[0, 1, 2].map((i) => <div key={i} style={{ height: 132, borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)', border: '1px solid var(--border)', opacity: 1 - i * 0.12 }} />)}
      </div>
    );
  }

  function MobileShell({ d, state, mood, onMood }) {
    const [tab, setTab] = useState('command-center');
    const [sheet, setSheet] = useState(null);

    let body, devBanner = null;
    if (state === 'dev-banner') devBanner = <Banner tone="warning" icon="alert" title="Local / dev">{d.env.apiBaseUrl}</Banner>;
    if (state === 'permission-limited') devBanner = <Banner tone="info" icon="eye" title="2 productos con permiso limitado">Tax Compliance EC y AI Console: tienes acceso parcial. Solicita permisos para operar al 100%.</Banner>;

    if (state === 'loading') body = <MobileLoading />;
    else if (state === 'backend-unavailable') body = <MobileError d={d} />;
    else if (state === 'empty') body = <MobileEmpty d={d} />;
    else body = <MobileCommandCenter d={d} banner={devBanner} />;

    const showChrome = state !== 'loading';

    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--app-bg)', position: 'relative', overflow: 'hidden' }}>
        {showChrome && <MobileTopBar tenant={d.tenant} onTenant={() => setSheet('tenant')} onMood={() => setSheet('mood')} onAssistant={() => setSheet('assistant')} />}
        <div style={{ flex: 1, overflowY: 'auto' }}>{body}</div>
        {showChrome && <BottomTabs active={state === 'empty' || state === 'backend-unavailable' ? 'command-center' : tab} onTab={(k) => { if (k === 'more') setSheet('nav'); else setTab(k); }} />}

        {sheet === 'nav' && (
          <Sheet title="Productos" onClose={() => setSheet(null)}>
            <div style={{ display: 'grid', gap: 4 }}>
              {d.nav.filter((p) => p.group !== 'Core').map((p) => {
                const muted = p.state === 'disabled' || p.state === 'locked';
                return (
                  <div key={p.key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8px', borderRadius: 'var(--radius-xs)', opacity: muted ? 0.55 : 1 }}>
                    <span style={{ color: muted ? 'var(--text-subtle)' : 'var(--text)', display: 'inline-flex' }}><Icon name={p.icon} size={19} /></span>
                    <span style={{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: 500, color: muted ? 'var(--text-subtle)' : 'var(--text-strong)' }}>{p.name}</span>
                    {p.state === 'locked' && <Icon name="lock" size={14} style={{ color: 'var(--text-subtle)' }} />}
                    {p.state === 'limited' && <Pill tone="warning">Limited</Pill>}
                    {p.state === 'disabled' && <Pill tone="neutral">Off</Pill>}
                    {p.state === 'available' && <Pill tone="primary">Add</Pill>}
                    {p.badge && <Pill tone="neutral">{p.badge}</Pill>}
                  </div>
                );
              })}
            </div>
          </Sheet>
        )}

        {sheet === 'tenant' && (
          <Sheet title="Switch tenant" onClose={() => setSheet(null)}>
            <div style={{ display: 'grid', gap: 8 }}>
              {d.memberships.map((m) => (
                <div key={m.slug} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, borderRadius: 'var(--radius-sm)', border: `1px solid ${m.slug === d.tenant.slug ? 'var(--primary)' : 'var(--border)'}`, background: m.slug === d.tenant.slug ? 'var(--primary-soft)' : 'var(--surface)' }}>
                  <Avatar name={m.name} size={34} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)' }}>{m.name}</div>
                    <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>{m.role}</div>
                  </div>
                  {m.slug === d.tenant.slug && <Icon name="check" size={16} style={{ color: 'var(--primary)' }} />}
                </div>
              ))}
            </div>
          </Sheet>
        )}

        {sheet === 'mood' && (
          <Sheet title="Design mood" onClose={() => setSheet(null)}>
            <MoodMenu value={mood} onChange={onMood} moods={d.moods} />
          </Sheet>
        )}

        {sheet === 'assistant' && (
          <Sheet title="Asistente IA" onClose={() => setSheet(null)}>
            <div style={{ display: 'grid', gap: 12 }}>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text)', lineHeight: 1.5 }}>{d.assistant.greeting}</p>
              {d.assistant.suggestions.map((s, i) => (
                <div key={i} style={{ background: 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 13, display: 'grid', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ width: 28, height: 28, flex: 'none', borderRadius: 'var(--radius-xs)', display: 'grid', placeItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', color: aTones[s.tone] }}><Icon name={s.icon} size={15} /></span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)', lineHeight: 1.35 }}>{s.title}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.45 }}>{s.body}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Btn variant="secondary" size="sm">{s.action}</Btn>
                    <Btn variant="ghost" size="sm">Descartar</Btn>
                  </div>
                </div>
              ))}
              <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', lineHeight: 1.45, paddingTop: 2 }}>{d.assistant.disclaimer}</div>
            </div>
          </Sheet>
        )}
      </div>
    );
  }

  window.MobileApp = { MobileShell };
})();
