import { useEffect, useMemo, useState } from 'react';
import {
  fetchSession,
  setCurrentTenancy,
} from '../../app/api';
import styles from '../../app/app.module.css';
import type {
  AuthenticatedSessionResponse,
  InvoiceSummaryResponse,
  PlatformPlan,
  SessionTenancy,
} from '../../app/types';
import { CommandCenter } from '../command-center/command-center';
import { useCommandCenterModel } from '../command-center/use-command-center-model';
import { useCommandCenterPlatformData } from '../command-center/queries';
import {
  useInvoicingWorkspaceQuery,
  type InvoicingWorkspaceQueryData,
} from '../invoicing/queries';
import { useInvoicingWorkspaceModel } from '../invoicing/use-invoicing-workspace-model';
import type { InvoicingWorkspaceFoundationModel } from '../invoicing/model';
import {
  buildPlatformShellNavItems,
  resolveActiveProductWorkspace,
} from './platform-shell-routing';
import { PlatformShell } from '../../shared/layout/platform-shell';
import {
  PLATFORM_MOODS,
  type PlatformMoodKey,
  type PlatformShellMetric,
} from '../../shared/layout/platform-shell.model';
import { Button, Card, StatusPill } from '../../shared/design-system';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:3000/api';
const TOKEN_STORAGE_KEY = 'saas-platform.web.token';
const PLATFORM_MOOD_STORAGE_KEY = 'saas-platform.web.platformMood';

type AuthPhase = 'idle' | 'loading' | 'ready' | 'error';

function isPlatformMoodKey(value: string): value is PlatformMoodKey {
  return PLATFORM_MOODS.some((mood) => mood.key === value);
}

function readStoredPlatformMood(): PlatformMoodKey {
  const storedMood = window.localStorage.getItem(PLATFORM_MOOD_STORAGE_KEY);

  return storedMood && isPlatformMoodKey(storedMood) ? storedMood : 'comfort';
}

function readInitialHash(): string {
  return window.location.hash || '#platform-home';
}

function formatDate(value: string | null | undefined): string {
  if (!value) {
    return 'No registrado';
  }

  return new Intl.DateTimeFormat('es-EC', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function formatMoney(valueInCents: number, currency: string): string {
  return new Intl.NumberFormat('es-EC', {
    currency,
    maximumFractionDigits: 2,
    style: 'currency',
  }).format(valueInCents / 100);
}

function humanizeKey(value: string | null): string {
  if (!value) {
    return 'No definido';
  }

  return value.split('_').join(' ');
}

function flowLabel(
  flow: AuthenticatedSessionResponse['sessionState']['recommendedFlow'],
): string {
  switch (flow) {
    case 'workspace':
      return 'Workspace operativo';
    case 'select-tenancy':
      return 'Elegir tenant';
    case 'accept-invitation':
      return 'Revisar invitacion';
    case 'empty':
      return 'Sin workspace';
    default:
      return flow;
  }
}

function resolveCurrentPlan(
  plans: PlatformPlan[],
  currentTenancy: SessionTenancy | null,
): PlatformPlan | null {
  const planId = currentTenancy?.subscription?.planId;

  if (!planId) {
    return plans[0] ?? null;
  }

  return plans.find((plan) => plan.id === planId) ?? plans[0] ?? null;
}

function getInvoiceStage(invoice: InvoiceSummaryResponse | null): {
  label: string;
  tone: 'success' | 'warning' | 'danger' | 'neutral';
} {
  if (!invoice) {
    return { label: 'Sin documento', tone: 'neutral' };
  }

  if (invoice.authorizedAt || invoice.electronicStatus === 'authorized') {
    return { label: 'Autorizado', tone: 'success' };
  }

  if (
    invoice.electronicStatus === 'rejected' ||
    invoice.electronicStatus === 'failed'
  ) {
    return { label: 'Rechazado', tone: 'danger' };
  }

  if (invoice.submittedAt || invoice.electronicStatus === 'submitted') {
    return { label: 'En el SRI', tone: 'warning' };
  }

  if (invoice.signedAt || invoice.status.toLowerCase() === 'issued') {
    return { label: 'Generado', tone: 'neutral' };
  }

  return { label: 'Borrador', tone: 'neutral' };
}

export function ClaudePlatformApp() {
  const [activeHash, setActiveHash] = useState(readInitialHash);
  const [mood, setMood] = useState<PlatformMoodKey>(readStoredPlatformMood);
  const [token, setToken] = useState(
    () => window.localStorage.getItem(TOKEN_STORAGE_KEY) ?? '',
  );
  const [tokenDraft, setTokenDraft] = useState(token);
  const [session, setSession] =
    useState<AuthenticatedSessionResponse | null>(null);
  const [authPhase, setAuthPhase] = useState<AuthPhase>(
    token ? 'loading' : 'idle',
  );
  const [authError, setAuthError] = useState<string | null>(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => setActiveHash(readInitialHash());

    window.addEventListener('hashchange', handleHashChange);

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(PLATFORM_MOOD_STORAGE_KEY, mood);
  }, [mood]);

  const loadSession = async (nextToken: string, tenantSlug?: string | null) => {
    const trimmedToken = nextToken.trim();

    if (!trimmedToken) {
      setSession(null);
      setToken('');
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      setAuthPhase('idle');
      return;
    }

    setAuthPhase('loading');
    setAuthError(null);

    try {
      const nextSession = await fetchSession(trimmedToken, tenantSlug);

      setSession(nextSession);
      setToken(trimmedToken);
      setTokenDraft(trimmedToken);
      window.localStorage.setItem(TOKEN_STORAGE_KEY, trimmedToken);
      setAuthPhase('ready');
    } catch (error) {
      setSession(null);
      setAuthError(error instanceof Error ? error.message : 'No se pudo cargar la sesion.');
      setAuthPhase('error');
    }
  };

  useEffect(() => {
    if (token) {
      void loadSession(token);
    }
    // The first load is intentionally bound to the stored token only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentTenancy = session?.currentTenancy ?? null;
  const currentTenantSlug = currentTenancy?.tenant.slug ?? null;
  const sessionFlowLabel = session
    ? flowLabel(session.sessionState.recommendedFlow)
    : 'Conectar token';

  const {
    catalogError,
    catalogLoading,
    planCatalog,
    productCatalog,
    tenantEnabledProducts,
  } = useCommandCenterPlatformData(token, currentTenantSlug);

  const enabledProductKeys = useMemo(
    () => new Set(tenantEnabledProducts.map((product) => product.key)),
    [tenantEnabledProducts],
  );
  const canManageInvitations = Boolean(
    currentTenancy?.permissionKeys.includes('tenant.invitations.manage'),
  );
  const canReadGrowthConversations = Boolean(
    currentTenancy?.permissionKeys.includes('growth.conversations.read'),
  );
  const canAccessTransversalAiConsole = Boolean(
    currentTenancy?.permissionKeys.includes('ai.approvals.read') ||
      currentTenancy?.permissionKeys.includes('ai.executions.read') ||
      currentTenancy?.permissionKeys.includes('ai.memory.read'),
  );

  const invoicingEnabled = enabledProductKeys.has('invoicing');
  const invoicingQuery = useInvoicingWorkspaceQuery(
    token,
    currentTenantSlug,
    invoicingEnabled,
  );
  const invoicingData = invoicingQuery.data;
  const invoices = invoicingData?.invoices ?? [];

  useEffect(() => {
    if (!selectedInvoiceId && invoices[0]?.id) {
      setSelectedInvoiceId(invoices[0].id);
    }
  }, [invoices, selectedInvoiceId]);

  const selectedInvoice =
    invoices.find((invoice) => invoice.id === selectedInvoiceId) ??
    invoices[0] ??
    null;
  const currentPlan = resolveCurrentPlan(planCatalog, currentTenancy);
  const commandCenterModel = useCommandCenterModel({
    ai: {
      approvalRequestCount: 0,
      memoryAgentCount: 0,
      operationsGeneratedAt: null,
      operationsSummaryLoaded: false,
    },
    aiEnabled: canAccessTransversalAiConsole,
    canAccessTransversalAiConsole,
    canReadGrowthConversations,
    currentPlan,
    ecommerce: {
      completionCloseoutStatus: null,
      hasInvoiceDraftHandoff: false,
      postSaleReportingStatus: null,
    },
    enabledProductKeys,
    formatDate: (value) => formatDate(value),
    growth: {
      openCaseCount: 0,
      operationalAlertCount: null,
      whatsappSummaryLoaded: false,
    },
    humanizeKey,
    invoicing: {
      electronicSubmissionSettingsLoaded: Boolean(
        invoicingData?.electronicSubmissionSettings,
      ),
      invoiceCount: invoices.length,
      issuedInvoiceCount: invoices.filter(
        (invoice) => invoice.status.toLowerCase() === 'issued',
      ).length,
      issuerEnvironment: invoicingData?.issuerProfile?.environment ?? null,
      issuerProfileLoaded: Boolean(invoicingData?.issuerProfile),
      selectedInvoice: selectedInvoice
        ? {
            issuedAt: selectedInvoice.issuedAt,
            number: selectedInvoice.number,
            status: selectedInvoice.status,
          }
        : null,
    },
    permissionKeys: currentTenancy?.permissionKeys ?? [],
    productCatalog,
    taxCompliance: {
      accountantReviewCount: 0,
      eventCount: 0,
      period: 'Actual',
      workspaceStatus: null,
    },
  });
  const invoicingModel = useInvoicingWorkspaceModel({
    customers: invoicingData?.customers ?? [],
    electronicSandboxReadiness: invoicingData?.electronicSandboxReadiness ?? null,
    electronicSignatureMaterialInspection:
      invoicingData?.electronicSignatureMaterialInspection ?? null,
    electronicSubmissionSettings:
      invoicingData?.electronicSubmissionSettings ?? null,
    formatMoney,
    humanizeKey,
    invoiceNumberingSettings:
      invoicingData?.invoiceNumberingSettings ?? null,
    invoices,
    issuerProfile: invoicingData?.issuerProfile ?? null,
    selectedInvoice,
  });
  const activeProductWorkspace = resolveActiveProductWorkspace(activeHash);
  const navItems = buildPlatformShellNavItems({
    canAccessTransversalAiConsole,
    canManageInvitations,
    canReadGrowthConversations,
    currentTenantSlug,
    enabledProductKeys,
    invoices,
    sessionFlowLabel,
  });
  const shellMetrics: PlatformShellMetric[] = [
    { label: 'Tenant', value: currentTenantSlug ?? 'Sin tenant' },
    { label: 'Plan', value: currentPlan?.name ?? 'Piloto' },
    { label: 'Productos activos', value: tenantEnabledProducts.length },
    { label: 'Facturas', value: invoices.length },
  ];

  if (!session || !currentTenancy) {
    return (
      <ClaudeAccessGateway
        authError={authError}
        authPhase={authPhase}
        mood={mood}
        onMoodChange={setMood}
        onSelectTenancy={async (tenantSlug) => {
          const nextSession = await setCurrentTenancy(token, tenantSlug);
          setSession(nextSession);
        }}
        onUseToken={() => void loadSession(tokenDraft)}
        session={session}
        tokenDraft={tokenDraft}
        onTokenDraftChange={setTokenDraft}
      />
    );
  }

  return (
    <PlatformShell
      activeHash={activeHash}
      activeProductWorkspace={activeProductWorkspace}
      apiBaseUrl={API_BASE_URL}
      headline={sessionFlowLabel}
      metrics={shellMetrics}
      mood={mood}
      navItems={navItems}
      onMoodChange={setMood}
      tenantSlug={currentTenancy.tenant.slug}
      title={currentTenancy.tenant.name}
    >
      {activeProductWorkspace === 'invoicing' ? (
        <ClaudeInvoicingWorkspace
          data={invoicingData}
          error={
            invoicingQuery.error instanceof Error
              ? invoicingQuery.error.message
              : null
          }
          isLoading={invoicingQuery.isLoading}
          model={invoicingModel}
          onRefresh={() => void invoicingQuery.refetch()}
          onSelectInvoice={setSelectedInvoiceId}
          selectedInvoice={selectedInvoice}
        />
      ) : (
        <CommandCenter
          accessCounts={commandCenterModel.accessCounts}
          catalogError={catalogError}
          catalogLoading={catalogLoading}
          currentPlanLabel={currentPlan?.name ?? 'Piloto'}
          currentPlanPriceLabel={
            currentPlan
              ? formatMoney(currentPlan.priceInCents, currentPlan.currency)
              : 'Sin precio'
          }
          hasCurrentTenancy={Boolean(currentTenancy)}
          hasSession={Boolean(session)}
          maxUsersLabel="Workspace piloto"
          products={commandCenterModel.products}
          subscriptionStatusLabel={
            currentTenancy.subscription?.status ?? 'active'
          }
          tenantMemberCount={session.tenancies.length}
          tenantName={currentTenancy.tenant.name}
          tenantRoleLabel={currentTenancy.roleKeys.join(', ') || 'owner'}
          tenantSlug={currentTenancy.tenant.slug}
        />
      )}
    </PlatformShell>
  );
}

type ClaudeAccessGatewayProps = {
  authError: string | null;
  authPhase: AuthPhase;
  mood: PlatformMoodKey;
  onMoodChange: (mood: PlatformMoodKey) => void;
  onSelectTenancy: (tenantSlug: string) => Promise<void>;
  onTokenDraftChange: (value: string) => void;
  onUseToken: () => void;
  session: AuthenticatedSessionResponse | null;
  tokenDraft: string;
};

function ClaudeAccessGateway({
  authError,
  authPhase,
  mood,
  onMoodChange,
  onSelectTenancy,
  onTokenDraftChange,
  onUseToken,
  session,
  tokenDraft,
}: ClaudeAccessGatewayProps) {
  return (
    <div className={styles.shell} data-mood={mood}>
      <main className={styles.page}>
        <section className={styles.commandCenter}>
          <div className={styles.commandCenterHeader}>
            <div>
              <span className={styles.label}>Acceso operativo</span>
              <h2>SaaS Platform Pilot</h2>
              <p>
                Conecta un token de piloto para abrir el Command Center y validar
                la experiencia rediseñada con datos reales del backend.
              </p>
            </div>
            <StatusPill tone={authPhase === 'error' ? 'error' : 'info'}>
              {authPhase === 'loading' ? 'Validando' : 'Piloto local'}
            </StatusPill>
          </div>

          <div className={styles.commandSummaryRail}>
            <Card>
              <span className={styles.label}>API base</span>
              <h3>{API_BASE_URL}</h3>
              <p>Railway/Vercel usan esta URL para las llamadas autenticadas.</p>
            </Card>
            <Card>
              <span className={styles.label}>Modo visual</span>
              <h3>{PLATFORM_MOODS.find((item) => item.key === mood)?.label}</h3>
              <div className={styles.buttonRow}>
                {PLATFORM_MOODS.map((item) => (
                  <button
                    className={
                      item.key === mood ? styles.primaryButton : styles.secondaryButton
                    }
                    key={item.key}
                    onClick={() => onMoodChange(item.key)}
                    type="button"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </Card>
            <Card>
              <span className={styles.label}>Fuente de diseño</span>
              <h3>Claude Design</h3>
              <p>El shell activo parte de las slices 00-11, no del App legacy.</p>
            </Card>
          </div>

          {session && session.tenancies.length > 0 ? (
            <Card>
              <span className={styles.label}>Selecciona workspace</span>
              <div className={styles.featureGrid}>
                {session.tenancies.map((tenancy) => (
                  <button
                    className={styles.invoiceListItem}
                    key={tenancy.tenant.slug}
                    onClick={() => void onSelectTenancy(tenancy.tenant.slug)}
                    type="button"
                  >
                    <span>
                      <strong>{tenancy.tenant.name}</strong>
                      <small>{tenancy.tenant.slug}</small>
                    </span>
                    <StatusPill>{tenancy.roleKeys[0] ?? 'member'}</StatusPill>
                  </button>
                ))}
              </div>
            </Card>
          ) : (
            <Card>
              <label className={styles.formField}>
                <span>Bearer token</span>
                <textarea
                  onChange={(event) => onTokenDraftChange(event.target.value)}
                  placeholder="Pega aqui el Bearer token del piloto o QA"
                  rows={5}
                  value={tokenDraft}
                />
              </label>
              {authError ? <p className={styles.errorText}>{authError}</p> : null}
              <div className={styles.buttonRow}>
                <Button disabled={authPhase === 'loading'} onClick={onUseToken}>
                  {authPhase === 'loading' ? 'Validando...' : 'Usar token'}
                </Button>
              </div>
            </Card>
          )}
        </section>
      </main>
    </div>
  );
}

type ClaudeInvoicingWorkspaceProps = {
  data: InvoicingWorkspaceQueryData | undefined;
  error: string | null;
  isLoading: boolean;
  model: InvoicingWorkspaceFoundationModel;
  onRefresh: () => void;
  onSelectInvoice: (invoiceId: string) => void;
  selectedInvoice: InvoiceSummaryResponse | null;
};

function ClaudeInvoicingWorkspace({
  data,
  error,
  isLoading,
  model,
  onRefresh,
  onSelectInvoice,
  selectedInvoice,
}: ClaudeInvoicingWorkspaceProps) {
  const invoices = data?.invoices ?? [];
  const stage = getInvoiceStage(selectedInvoice);
  const portfolioTotal = invoices.reduce(
    (sum, invoice) => sum + invoice.totals.totalInCents,
    0,
  );
  const currency = selectedInvoice?.currency ?? invoices[0]?.currency ?? 'USD';

  return (
    <section
      className={styles.invoicingDomainConsole}
      data-product-workspace="invoicing"
      id="invoicing-domain"
    >
      <Card className={styles.invoicingDomainHero}>
        <div className={styles.invoicingDomainHeroMain}>
          <span
            className={`${styles.invoicingDomainHeroIcon} ${
              model.readiness.ready
                ? styles.invoicingDomainHeroIconSuccess
                : styles.invoicingDomainHeroIconWarning
            }`}
            aria-hidden="true"
          >
            {model.readiness.ready ? '✓' : '!'}
          </span>
          <div>
            <span className={styles.label}>Operaciones · Ecuador</span>
            <h2>{model.hero.title}</h2>
            <p>{model.hero.description}</p>
          </div>
          <a className={styles.primaryButton} href="#invoicing-settings-sri">
            Revisar SRI
          </a>
        </div>
        <div className={styles.invoicingContextStrip}>
          <div className={styles.invoicingContextIdentity}>
            <span className={styles.label}>Readiness</span>
            <strong>
              {data?.issuerProfile?.legalName ?? 'Emisor pendiente'}
            </strong>
            <small>
              {data?.invoiceNumberingSettings?.previewNumber ??
                'Numeracion pendiente'}{' '}
              · {model.readiness.ready ? 'Listo para operar' : 'Con bloqueos'}
            </small>
          </div>
          <div className={styles.invoicingContextTriad}>
            {model.readiness.pillars.slice(0, 3).map((pillar) => (
              <div className={styles.invoicingContextSignal} key={pillar.key}>
                <i
                  className={`${styles.invoicingContextSignalDot} ${
                    pillar.tone === 'success'
                      ? styles.invoicingContextSignalSuccess
                      : pillar.tone === 'danger'
                        ? styles.invoicingContextSignalDanger
                        : pillar.tone === 'warning'
                          ? styles.invoicingContextSignalWarning
                          : styles.invoicingContextSignalInfo
                  }`}
                />
                <span>{pillar.label}</span>
                <strong>{pillar.value}</strong>
                <small>{pillar.sub}</small>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {error ? <Card>{error}</Card> : null}
      {isLoading ? <Card>Cargando facturacion...</Card> : null}

      <div className={styles.invoicingDomainMetricGrid}>
        <Card className={styles.invoicingDomainMetricCard}>
          <span className={styles.label}>Por autorizar</span>
          <h3>
            {
              invoices.filter((invoice) =>
                ['submitted', 'sent'].includes(
                  invoice.electronicStatus?.toLowerCase() ?? '',
                ),
              ).length
            }
          </h3>
          <p>en el SRI</p>
        </Card>
        <Card className={styles.invoicingDomainMetricCard}>
          <span className={styles.label}>Autorizadas</span>
          <h3>{invoices.filter((invoice) => invoice.authorizedAt).length}</h3>
          <p>confirmadas por backend</p>
        </Card>
        <Card className={styles.invoicingDomainMetricCard}>
          <span className={styles.label}>Cartera del mes</span>
          <h3>{formatMoney(portfolioTotal, currency)}</h3>
          <p>facturado</p>
        </Card>
        <Card className={styles.invoicingDomainMetricCard}>
          <span className={styles.label}>Por cobrar</span>
          <h3>
            {formatMoney(
              invoices.reduce(
                (sum, invoice) => sum + invoice.settlement.balanceDueInCents,
                0,
              ),
              currency,
            )}
          </h3>
          <p>pendiente de pago</p>
        </Card>
      </div>

      <div className={styles.invoicingDomainWorkGrid}>
        <Card className={styles.invoicingDomainQueueCard}>
          <div className={styles.invoicingDomainCardHeader}>
            <div>
              <h3>Facturas</h3>
              <p>Selecciona una para revisar el estado a la derecha.</p>
            </div>
            <button className={styles.primaryButton} type="button">
              + Nueva
            </button>
          </div>
          <div className={styles.invoicingQueueList}>
            {invoices.map((invoice) => (
              <button
                className={`${styles.invoiceQueueRow} ${
                  selectedInvoice?.id === invoice.id ? styles.drilldownCardActive : ''
                }`}
                key={invoice.id}
                onClick={() => onSelectInvoice(invoice.id)}
                type="button"
              >
                <span className={styles.invoiceQueueNumber}>{invoice.number}</span>
                <span className={styles.invoiceQueueCustomer}>
                  {invoice.buyerName ?? invoice.customerId}
                  <small>{formatDate(invoice.issuedAt)}</small>
                </span>
                <span className={styles.invoiceQueueTotal}>
                  {formatMoney(invoice.totals.totalInCents, invoice.currency)}
                </span>
                <StatusPill>{humanizeKey(invoice.status)}</StatusPill>
              </button>
            ))}
          </div>
        </Card>

        <Card className={styles.invoicingDomainDetailCard}>
          <div className={styles.invoicingDomainCardHeader}>
            <div>
              <h3>{selectedInvoice?.buyerName ?? 'Sin factura seleccionada'}</h3>
              <p>{selectedInvoice?.number ?? 'La cola esta vacia'}</p>
            </div>
            <StatusPill
              tone={
                stage.tone === 'danger'
                  ? 'error'
                  : stage.tone === 'warning'
                    ? 'warning'
                    : 'info'
              }
            >
              {stage.label}
            </StatusPill>
          </div>
          <div className={styles.documentPreview}>
            <h3>
              {selectedInvoice
                ? formatMoney(selectedInvoice.totals.totalInCents, selectedInvoice.currency)
                : '$0,00'}
            </h3>
            <div className={styles.invoicingContextTriad}>
              <div className={styles.invoicingContextSignal}>
                <i className={styles.invoicingContextSignalDot} />
                <span>Documento</span>
                <strong>{selectedInvoice ? humanizeKey(selectedInvoice.status) : 'Sin dato'}</strong>
                <small>Condicion del sistema</small>
              </div>
              <div className={styles.invoicingContextSignal}>
                <i className={styles.invoicingContextSignalDot} />
                <span>SRI</span>
                <strong>
                  {selectedInvoice
                    ? humanizeKey(selectedInvoice.electronicStatus)
                    : 'Sin dato'}
                </strong>
                <small>No implica autorizacion hasta confirmacion backend</small>
              </div>
              <div className={styles.invoicingContextSignal}>
                <i className={styles.invoicingContextSignalDot} />
                <span>Pago</span>
                <strong>
                  {selectedInvoice?.settlement.isFullyPaid ? 'Pagado' : 'Sin pago'}
                </strong>
                <small>
                  {selectedInvoice
                    ? formatMoney(
                        selectedInvoice.settlement.balanceDueInCents,
                        selectedInvoice.currency,
                      )
                    : 'Sin saldo'}
                </small>
              </div>
            </div>
            <div className={styles.buttonRow}>
              <button className={styles.primaryButton} onClick={onRefresh} type="button">
                Refrescar
              </button>
              <a className={styles.secondaryButton} href="#invoicing-documents">
                Ver documentos
              </a>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
