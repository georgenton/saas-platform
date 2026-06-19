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
  resolveActiveInvoicingSubview,
  resolveActiveProductWorkspace,
} from './platform-shell-routing';
import type { InvoicingWorkspaceSubview } from '../invoicing/invoicing-workspace';
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

const INVOICING_WORKSPACE_TABS: Array<{
  href: string;
  key: InvoicingWorkspaceSubview;
  label: string;
}> = [
  { href: '#invoicing-domain', key: 'overview', label: 'Resumen' },
  { href: '#invoicing-settings-sri', key: 'settings', label: 'Configuracion SRI' },
  { href: '#invoicing-customer-draft', key: 'draft', label: 'Clientes y borrador' },
  { href: '#invoicing-items', key: 'items', label: 'Items' },
  { href: '#invoicing-documents', key: 'documents', label: 'Documentos' },
];

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

function statusTone(
  tone: 'success' | 'warning' | 'danger' | 'neutral',
): 'success' | 'warning' | 'danger' | 'default' {
  return tone === 'neutral' ? 'default' : tone;
}

function getDeliveryLabel(invoice: InvoiceSummaryResponse | null): string {
  if (!invoice) {
    return 'Sin documento';
  }

  return invoice.buyerName || invoice.buyerIdentification
    ? 'Listo para entrega'
    : 'Falta comprador';
}

function getPaymentLabel(invoice: InvoiceSummaryResponse | null): string {
  if (!invoice) {
    return 'Sin pago';
  }

  return invoice.settlement.isFullyPaid ? 'Pagado' : 'Saldo abierto';
}

function getSriReadinessVerdict(
  data: InvoicingWorkspaceQueryData | undefined,
): {
  description: string;
  label: string;
  tone: 'success' | 'warning' | 'danger' | 'neutral';
} {
  const readiness = data?.electronicSandboxReadiness;

  if (!readiness) {
    return {
      description: 'La respuesta de readiness aun no esta disponible.',
      label: 'Readiness pendiente',
      tone: 'neutral',
    };
  }

  if (
    readiness.isReadyForRemoteSandboxSubmission &&
    readiness.blockers.length === 0
  ) {
    return {
      description:
        readiness.warnings[0] ??
        'Los controles principales permiten operar el carril remoto sandbox.',
      label: readiness.warnings.length ? 'Listo con advertencias' : 'Listo',
      tone: readiness.warnings.length ? 'warning' : 'success',
    };
  }

  if (readiness.blockers.length > 0) {
    return {
      description: readiness.blockers[0],
      label: 'Bloqueado',
      tone: 'danger',
    };
  }

  if (readiness.warnings.length > 0) {
    return {
      description: readiness.warnings[0],
      label: 'Requiere revision',
      tone: 'warning',
    };
  }

  return {
    description: readiness.recommendedNextStep,
    label: 'En preparacion',
    tone: 'neutral',
  };
}

function getSriSandboxTier(data: InvoicingWorkspaceQueryData | undefined): string {
  const readiness = data?.electronicSandboxReadiness;

  if (!readiness) {
    return 'Sin readiness';
  }

  if (readiness.isReadyForRemoteSandboxSubmission) {
    return 'Sandbox remoto';
  }

  if (readiness.isReadyForPresignedRemoteSandboxSubmission) {
    return 'Presigned remoto';
  }

  if (readiness.isReadyForLocalStubSubmission) {
    return 'Stub local';
  }

  return 'Sin carril listo';
}

function formatBuyerIdentificationType(value: string | null | undefined): string {
  switch (value) {
    case '04':
      return 'RUC';
    case '05':
      return 'Cedula';
    case '06':
      return 'Pasaporte';
    case '07':
      return 'Consumidor final';
    case '08':
      return 'Exterior';
    default:
      return 'Sin tipo';
  }
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
          activeSubview={resolveActiveInvoicingSubview(activeHash)}
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
            <StatusPill tone={authPhase === 'error' ? 'danger' : 'default'}>
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
  activeSubview: InvoicingWorkspaceSubview;
  data: InvoicingWorkspaceQueryData | undefined;
  error: string | null;
  isLoading: boolean;
  model: InvoicingWorkspaceFoundationModel;
  onRefresh: () => void;
  onSelectInvoice: (invoiceId: string) => void;
  selectedInvoice: InvoiceSummaryResponse | null;
};

function ClaudeInvoicingWorkspace({
  activeSubview,
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
      <div className={styles.productWorkspaceHero}>
        <div className={styles.productWorkspaceTitleRow}>
          <span className={styles.label}>Producto activo · Ecuador</span>
          <h2>Facturacion electronica SRI</h2>
        </div>
        <div className={styles.productWorkspaceActions}>
          <a className={styles.secondaryButton} href="#platform-home">
            Volver al Command Center
          </a>
          <a className={styles.primaryButton} href="#invoicing-settings-sri">
            Configurar SRI
          </a>
        </div>
      </div>

      <nav className={styles.productWorkspaceTabs} aria-label="Invoicing">
        {INVOICING_WORKSPACE_TABS.map((tab) => (
          <a
            aria-current={activeSubview === tab.key ? 'page' : undefined}
            href={tab.href}
            key={tab.key}
          >
            {tab.label}
          </a>
        ))}
      </nav>

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
      </Card>

      <ClaudeInvoicingContextStrip
        data={data}
        model={model}
        selectedInvoice={selectedInvoice}
      />

      {error ? <Card>{error}</Card> : null}
      {isLoading ? <Card>Cargando facturacion...</Card> : null}

      {activeSubview === 'overview' ? (
        <ClaudeInvoicingOverview
          currency={currency}
          invoices={invoices}
          onRefresh={onRefresh}
          portfolioTotal={portfolioTotal}
          selectedInvoice={selectedInvoice}
        />
      ) : activeSubview === 'settings' ? (
        <ClaudeInvoicingSettings data={data} model={model} />
      ) : activeSubview === 'draft' ? (
        <ClaudeInvoicingDraft data={data} invoices={invoices} />
      ) : activeSubview === 'items' ? (
        <ClaudeInvoicingItems
          data={data}
          invoices={invoices}
          selectedInvoice={selectedInvoice}
        />
      ) : (
        <ClaudeInvoicingDocuments
          invoices={invoices}
          onRefresh={onRefresh}
          onSelectInvoice={onSelectInvoice}
          selectedInvoice={selectedInvoice}
          stage={stage}
        />
      )}
    </section>
  );
}

type ClaudeInvoicingContextStripProps = {
  data: InvoicingWorkspaceQueryData | undefined;
  model: InvoicingWorkspaceFoundationModel;
  selectedInvoice: InvoiceSummaryResponse | null;
};

function ClaudeInvoicingContextStrip({
  data,
  model,
  selectedInvoice,
}: ClaudeInvoicingContextStripProps) {
  const stage = getInvoiceStage(selectedInvoice);

  return (
    <div className={styles.invoicingContextStrip}>
      <div className={styles.invoicingContextIdentity}>
        <span className={styles.label}>Contexto operativo</span>
        <strong>{data?.issuerProfile?.legalName ?? 'Emisor pendiente'}</strong>
        <small>
          {data?.invoiceNumberingSettings?.previewNumber ??
            'Numeracion pendiente'}{' '}
          · {model.readiness.ready ? 'Listo para operar' : 'Con bloqueos'}
        </small>
      </div>
      <div className={styles.invoicingContextTriad}>
        <ContextSignal
          detail="No implica autorizacion hasta confirmacion backend"
          label="SRI"
          tone={stage.tone}
          value={stage.label}
        />
        <ContextSignal
          detail={selectedInvoice?.buyerName ?? 'Comprador pendiente'}
          label="Entrega"
          tone={selectedInvoice ? 'success' : 'neutral'}
          value={getDeliveryLabel(selectedInvoice)}
        />
        <ContextSignal
          detail={
            selectedInvoice
              ? formatMoney(
                  selectedInvoice.settlement.balanceDueInCents,
                  selectedInvoice.currency,
                )
              : 'Sin saldo'
          }
          label="Pago"
          tone={selectedInvoice?.settlement.isFullyPaid ? 'success' : 'warning'}
          value={getPaymentLabel(selectedInvoice)}
        />
      </div>
    </div>
  );
}

type ContextSignalProps = {
  detail: string;
  label: string;
  tone: 'success' | 'warning' | 'danger' | 'neutral';
  value: string;
};

function ContextSignal({ detail, label, tone, value }: ContextSignalProps) {
  return (
    <div className={styles.invoicingContextSignal}>
      <i
        className={`${styles.invoicingContextSignalDot} ${
          tone === 'success'
            ? styles.invoicingContextSignalSuccess
            : tone === 'danger'
              ? styles.invoicingContextSignalDanger
              : tone === 'warning'
                ? styles.invoicingContextSignalWarning
                : styles.invoicingContextSignalInfo
        }`}
      />
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

type ClaudeInvoicingOverviewProps = {
  currency: string;
  invoices: InvoiceSummaryResponse[];
  onRefresh: () => void;
  portfolioTotal: number;
  selectedInvoice: InvoiceSummaryResponse | null;
};

function ClaudeInvoicingOverview({
  currency,
  invoices,
  onRefresh,
  portfolioTotal,
  selectedInvoice,
}: ClaudeInvoicingOverviewProps) {
  const pendingSriCount = invoices.filter((invoice) =>
    ['submitted', 'sent'].includes(
      invoice.electronicStatus?.toLowerCase() ?? '',
    ),
  ).length;
  const outstandingTotal = invoices.reduce(
    (sum, invoice) => sum + invoice.settlement.balanceDueInCents,
    0,
  );

  return (
    <>
      <div className={styles.invoicingDomainMetricGrid}>
        <MetricCard label="Por autorizar" sublabel="en el SRI" value={pendingSriCount} />
        <MetricCard
          label="Autorizadas"
          sublabel="confirmadas por backend"
          value={invoices.filter((invoice) => invoice.authorizedAt).length}
        />
        <MetricCard
          label="Cartera del mes"
          sublabel="facturado"
          value={formatMoney(portfolioTotal, currency)}
        />
        <MetricCard
          label="Por cobrar"
          sublabel="pendiente de pago"
          value={formatMoney(outstandingTotal, currency)}
        />
      </div>

      <div className={styles.invoicingDomainWorkGrid}>
        <Card>
          <span className={styles.label}>Siguiente foco operativo</span>
          <h3>
            {pendingSriCount > 0
              ? 'Revisar documentos esperando autorizacion.'
              : 'Mantener la configuracion SRI al dia.'}
          </h3>
          <p>
            La consola mantiene separadas las verdades de documento, SRI,
            entrega y pago para evitar falsas autorizaciones.
          </p>
          <div className={styles.buttonRow}>
            <a className={styles.primaryButton} href="#invoicing-documents">
              Revisar documentos
            </a>
            <button className={styles.secondaryButton} onClick={onRefresh} type="button">
              Refrescar
            </button>
          </div>
        </Card>

        <Card>
          <span className={styles.label}>Factura activa</span>
          <h3>{selectedInvoice?.number ?? 'Sin factura seleccionada'}</h3>
          <p>
            {selectedInvoice
              ? `${selectedInvoice.buyerName ?? selectedInvoice.customerId} · ${formatMoney(
                  selectedInvoice.totals.totalInCents,
                  selectedInvoice.currency,
                )}`
              : 'Selecciona un documento para abrir el detalle operacional.'}
          </p>
          <div className={styles.buttonRow}>
            <a className={styles.secondaryButton} href="#invoicing-settings-sri">
              Configuracion SRI
            </a>
          </div>
        </Card>
      </div>
    </>
  );
}

type MetricCardProps = {
  label: string;
  sublabel: string;
  value: string | number;
};

function MetricCard({ label, sublabel, value }: MetricCardProps) {
  return (
    <Card className={styles.invoicingDomainMetricCard}>
      <span className={styles.label}>{label}</span>
      <h3>{value}</h3>
      <p>{sublabel}</p>
    </Card>
  );
}

type ClaudeInvoicingSettingsProps = {
  data: InvoicingWorkspaceQueryData | undefined;
  model: InvoicingWorkspaceFoundationModel;
};

function ClaudeInvoicingSettings({ data, model }: ClaudeInvoicingSettingsProps) {
  const verdict = getSriReadinessVerdict(data);
  const readiness = data?.electronicSandboxReadiness;
  const missingItems = [
    ...(readiness?.blockers ?? []),
    ...(readiness?.warnings ?? []),
  ];

  return (
    <div className={styles.stack}>
      <Card>
        <div className={styles.commandCenterHeader}>
          <div>
            <span className={styles.label}>Preparacion SRI · Ecuador</span>
            <h3>{verdict.label}</h3>
            <p>{verdict.description}</p>
          </div>
          <StatusPill tone={statusTone(verdict.tone)}>
            {getSriSandboxTier(data)}
          </StatusPill>
        </div>
      </Card>

      <Card>
        <div className={styles.productWorkspaceContext}>
          <div>
            <span className={styles.label}>Siguiente paso recomendado</span>
            <p>
              {readiness?.recommendedNextStep ??
                'Carga el readiness SRI para conocer el siguiente paso seguro.'}
            </p>
          </div>
          <a className={styles.primaryButton} href="#invoicing-documents">
            Ir a facturas
          </a>
        </div>
      </Card>

      <div className={styles.invoicingDomainMetricGrid}>
        {model.readiness.pillars.map((pillar) => (
          <Card className={styles.invoicingDomainMetricCard} key={pillar.key}>
            <span className={styles.label}>{pillar.label}</span>
            <h3>{pillar.value}</h3>
            <p>{pillar.sub}</p>
          </Card>
        ))}
      </div>

      <div className={styles.invoicingDomainWorkGrid}>
        <Card>
          <span className={styles.label}>Areas de configuracion</span>
          <h3>Cuatro controles antes de operar</h3>
          <div className={styles.invoicingQueueList}>
            <div className={styles.invoiceItemCard}>
              <div className={styles.invoiceCardHeader}>
                <strong>Emisor fiscal</strong>
                <StatusPill tone={data?.issuerProfile ? 'success' : 'warning'}>
                  {data?.issuerProfile ? 'Configurado' : 'Pendiente'}
                </StatusPill>
              </div>
              <small>
                {data?.issuerProfile?.legalName ?? 'Completa razon social, RUC y direcciones.'}
              </small>
            </div>

            <div className={styles.invoiceItemCard}>
              <div className={styles.invoiceCardHeader}>
                <strong>Numeracion</strong>
                <StatusPill
                  tone={data?.invoiceNumberingSettings ? 'success' : 'warning'}
                >
                  {data?.invoiceNumberingSettings?.previewNumber ?? 'Pendiente'}
                </StatusPill>
              </div>
              <small>
                Serie y secuencial sugeridos para el siguiente documento.
              </small>
            </div>

            <div className={styles.invoiceItemCard}>
              <div className={styles.invoiceCardHeader}>
                <strong>Firma electronica</strong>
                <StatusPill
                  tone={
                    data?.electronicSignatureSettings?.isActive
                      ? 'success'
                      : 'warning'
                  }
                >
                  {data?.electronicSignatureSettings?.isActive
                    ? 'Activa'
                    : 'Pendiente'}
                </StatusPill>
              </div>
              <small>
                {data?.electronicSignatureSettings?.certificateLabel ??
                  data?.electronicSignatureMaterialInspection?.certificateLabel ??
                  'Configura certificado y material de firma.'}
              </small>
            </div>

            <div className={styles.invoiceItemCard}>
              <div className={styles.invoiceCardHeader}>
                <strong>Gateway SRI</strong>
                <StatusPill
                  tone={
                    data?.electronicSubmissionSettings?.isActive
                      ? 'success'
                      : 'warning'
                  }
                >
                  {data?.electronicSubmissionSettings?.provider ?? 'Pendiente'}
                </StatusPill>
              </div>
              <small>
                {data?.electronicSubmissionSettings?.transmissionMode ??
                  'Define provider, modo de transmision y credenciales.'}
              </small>
            </div>
          </div>
        </Card>

        <Card>
          <span className={styles.label}>Readiness SRI</span>
          <h3>Escalera sandbox</h3>
          <div className={styles.invoicingQueueList}>
            <ContextSignal
              detail="Permite previews y validacion local sin prometer envio remoto."
              label="Tier 1"
              tone={
                readiness?.isReadyForLocalStubSubmission ? 'success' : 'warning'
              }
              value="Stub local"
            />
            <ContextSignal
              detail="Prepara artefactos firmados sin ejecutar el carril remoto final."
              label="Tier 2"
              tone={
                readiness?.isReadyForPresignedRemoteSandboxSubmission
                  ? 'success'
                  : 'warning'
              }
              value="Presigned remoto"
            />
            <ContextSignal
              detail="Carril remoto sandbox con respuesta SRI y trazabilidad."
              label="Tier 3"
              tone={
                readiness?.isReadyForRemoteSandboxSubmission
                  ? 'success'
                  : 'warning'
              }
              value="Sandbox remoto"
            />
          </div>
        </Card>
      </div>

      <div className={styles.invoicingDomainWorkGrid}>
        <Card>
          <span className={styles.label}>Que falta</span>
          <h3>Bloqueos y advertencias</h3>
          {missingItems.length ? (
            <ul className={styles.compactList}>
              {missingItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>No hay bloqueos ni advertencias reportadas por readiness.</p>
          )}
        </Card>

        <Card>
          <span className={styles.label}>Matriz de documentos</span>
          <h3>Soporte electronico</h3>
          <div className={styles.invoicingQueueList}>
            {(readiness?.documentSupport ?? []).map((document) => (
              <div className={styles.invoiceItemCard} key={document.documentCode}>
                <div className={styles.invoiceCardHeader}>
                  <strong>{document.label}</strong>
                  <StatusPill tone={document.submitSupported ? 'success' : 'warning'}>
                    {document.submitSupported ? 'Enviable' : 'Parcial'}
                  </StatusPill>
                </div>
                <small>
                  Num {document.numberingConfigured ? 'ok' : 'pendiente'} · XML{' '}
                  {document.schemaValidationAvailable ? 'ok' : 'pendiente'} ·
                  RIDE {document.rideAvailable ? 'ok' : 'pendiente'}
                </small>
              </div>
            ))}
            {readiness?.documentSupport.length ? null : (
              <p>La matriz aparecera cuando el readiness entregue soporte.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

type ClaudeInvoicingDraftProps = {
  data: InvoicingWorkspaceQueryData | undefined;
  invoices: InvoiceSummaryResponse[];
};

function ClaudeInvoicingDraft({ data, invoices }: ClaudeInvoicingDraftProps) {
  const customers = data?.customers ?? [];
  const selectedCustomer = customers[0] ?? null;
  const draftInvoices = invoices.filter(
    (invoice) => invoice.status.toLowerCase() === 'draft',
  );
  const latestDraft = draftInvoices[0] ?? null;
  const nextInvoiceNumber =
    data?.invoiceNumberingSettings?.previewNumber ?? 'Autogenerado';

  return (
    <div className={styles.stack}>
      <Card>
        <div className={styles.commandCenterHeader}>
          <div>
            <span className={styles.label}>Emision guiada</span>
            <h3>Comprador → identidad fiscal → borrador</h3>
            <p>
              Una lane simple para crear la base comercial de la factura sin
              insinuar firma, envio ni autorizacion del SRI.
            </p>
          </div>
          <StatusPill tone={latestDraft ? 'success' : 'warning'}>
            {latestDraft ? 'Borrador disponible' : 'Preparar borrador'}
          </StatusPill>
        </div>
      </Card>

      <div className={styles.invoicingDomainMetricGrid}>
        <MetricCard
          label="Compradores"
          sublabel="directorio actual"
          value={customers.length}
        />
        <MetricCard
          label="Identidad fiscal"
          sublabel={
            selectedCustomer
              ? formatBuyerIdentificationType(selectedCustomer.identificationType)
              : 'pendiente'
          }
          value={selectedCustomer?.taxId ?? selectedCustomer?.identification ?? 'Sin comprador'}
        />
        <MetricCard
          label="Borradores"
          sublabel="en la cola"
          value={draftInvoices.length}
        />
        <MetricCard
          label="Siguiente numero"
          sublabel="sugerido"
          value={nextInvoiceNumber}
        />
      </div>

      <div className={styles.invoicingDomainWorkGrid}>
        <Card>
          <span className={styles.label}>Lane de creacion</span>
          <div className={styles.invoicingQueueList}>
            <div className={styles.invoiceItemCard}>
              <div className={styles.invoiceCardHeader}>
                <strong>1 · Comprador</strong>
                <StatusPill tone={selectedCustomer ? 'success' : 'warning'}>
                  {selectedCustomer ? 'Seleccionado' : 'Pendiente'}
                </StatusPill>
              </div>
              <small>
                {selectedCustomer
                  ? `${selectedCustomer.name} · ${
                      selectedCustomer.email ?? 'sin email'
                    }`
                  : 'Selecciona o crea un comprador antes de avanzar.'}
              </small>
            </div>

            <div className={styles.invoiceItemCard}>
              <div className={styles.invoiceCardHeader}>
                <strong>2 · Identidad fiscal</strong>
                <StatusPill tone={selectedCustomer ? 'success' : 'warning'}>
                  {selectedCustomer
                    ? formatBuyerIdentificationType(
                        selectedCustomer.identificationType,
                      )
                    : 'Pendiente'}
                </StatusPill>
              </div>
              <small>
                {selectedCustomer
                  ? selectedCustomer.taxId ??
                    selectedCustomer.identification ??
                    'Identificacion pendiente'
                  : 'Confirma RUC, cedula, pasaporte, consumidor final o exterior.'}
              </small>
            </div>

            <div className={styles.invoiceItemCard}>
              <div className={styles.invoiceCardHeader}>
                <strong>3 · Borrador</strong>
                <StatusPill tone={latestDraft ? 'success' : 'warning'}>
                  {latestDraft ? latestDraft.number : 'Por crear'}
                </StatusPill>
              </div>
              <small>
                {latestDraft
                  ? `${latestDraft.buyerName ?? latestDraft.customerId} · ${formatMoney(
                      latestDraft.totals.totalInCents,
                      latestDraft.currency,
                    )}`
                  : `Numero sugerido ${nextInvoiceNumber}; vacio = autogenera backend.`}
              </small>
            </div>
          </div>
        </Card>

        <Card>
          <span className={styles.label}>Directorio de compradores</span>
          <h3>{customers.length ? 'Compradores disponibles' : 'Aun no hay compradores'}</h3>
          <div className={styles.invoicingQueueList}>
            {customers.length ? (
              customers.slice(0, 4).map((customer) => (
                <div className={styles.invoiceItemCard} key={customer.id}>
                  <div className={styles.invoiceCardHeader}>
                    <strong>{customer.name}</strong>
                    <StatusPill>
                      {formatBuyerIdentificationType(customer.identificationType)}
                    </StatusPill>
                  </div>
                  <small>
                    {customer.taxId ?? customer.identification ?? 'Sin identificacion'} ·{' '}
                    {customer.billingAddress ?? 'Sin direccion'}
                  </small>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                Crea un comprador para habilitar la creacion de borradores.
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className={styles.invoicingDomainWorkGrid}>
        <Card>
          <span className={styles.label}>Confirmacion fiscal</span>
          <h3>{selectedCustomer?.name ?? 'Selecciona un comprador'}</h3>
          <p>
            {selectedCustomer
              ? `${formatBuyerIdentificationType(
                  selectedCustomer.identificationType,
                )}: ${
                  selectedCustomer.taxId ??
                  selectedCustomer.identification ??
                  'pendiente'
                }`
              : 'Esta pausa reduce errores antes de crear el borrador fiscal.'}
          </p>
          <div className={styles.buttonRow}>
            <button className={styles.secondaryButton} disabled type="button">
              Guardar comprador
            </button>
            <button className={styles.primaryButton} disabled={!selectedCustomer} type="button">
              Confirmar identidad
            </button>
          </div>
        </Card>

        <Card>
          <span className={styles.label}>Guardrail</span>
          <h3>Crear borrador no es emitir</h3>
          <p>
            El borrador todavia no esta firmado, enviado ni autorizado. La
            emision electronica vive en documentos y ciclo SRI.
          </p>
          <div className={styles.buttonRow}>
            <button className={styles.primaryButton} disabled={!selectedCustomer} type="button">
              Crear borrador
            </button>
            <a className={styles.secondaryButton} href="#invoicing-documents">
              Revisar documentos
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}

type ClaudeInvoicingItemsProps = {
  data: InvoicingWorkspaceQueryData | undefined;
  invoices: InvoiceSummaryResponse[];
  selectedInvoice: InvoiceSummaryResponse | null;
};

function ClaudeInvoicingItems({
  data,
  invoices,
  selectedInvoice,
}: ClaudeInvoicingItemsProps) {
  const invoice =
    selectedInvoice ??
    invoices.find((candidate) => candidate.status.toLowerCase() === 'draft') ??
    invoices[0] ??
    null;
  const activeTaxRates = (data?.taxRates ?? []).filter((rate) => rate.isActive);
  const defaultTaxRate = activeTaxRates[0] ?? null;
  const draftIsEditable = invoice?.status.toLowerCase() === 'draft';
  const currency = invoice?.currency ?? 'USD';
  const sampleSubtotalInCents = 2500;
  const sampleTaxInCents = defaultTaxRate
    ? Math.round((sampleSubtotalInCents * defaultTaxRate.percentage) / 100)
    : 0;
  const sampleTotalInCents = sampleSubtotalInCents + sampleTaxInCents;

  return (
    <div className={styles.stack}>
      <Card>
        <div className={styles.commandCenterHeader}>
          <div>
            <span className={styles.label}>Composicion comercial</span>
            <h3>Items → impuestos → totales</h3>
            <p>
              La pantalla ordena las lineas del borrador sin mezclarlo con firma,
              envio o autorizacion SRI. Los totales finales siguen siendo
              calculados por el backend.
            </p>
          </div>
          <StatusPill tone={draftIsEditable ? 'success' : 'warning'}>
            {draftIsEditable ? 'Borrador editable' : 'Solo lectura'}
          </StatusPill>
        </div>
      </Card>

      <div className={styles.invoicingDomainMetricGrid}>
        <MetricCard
          label="Factura activa"
          sublabel={invoice?.buyerName ?? 'sin comprador'}
          value={invoice?.number ?? 'Sin borrador'}
        />
        <MetricCard
          label="Lineas"
          sublabel="registradas en backend"
          value={invoice?.itemCount ?? 0}
        />
        <MetricCard
          label="Base imponible"
          sublabel="subtotal actual"
          value={
            invoice
              ? formatMoney(invoice.totals.subtotalInCents, invoice.currency)
              : formatMoney(0, currency)
          }
        />
        <MetricCard
          label="Total"
          sublabel="documento actual"
          value={
            invoice
              ? formatMoney(invoice.totals.totalInCents, invoice.currency)
              : formatMoney(0, currency)
          }
        />
      </div>

      <div className={styles.invoicingDomainWorkGrid}>
        <Card>
          <span className={styles.label}>Lineas del documento</span>
          <h3>{invoice ? invoice.number : 'Selecciona o crea un borrador'}</h3>
          <div className={styles.invoicingQueueList}>
            {invoice && invoice.itemCount > 0 ? (
              <div className={styles.invoiceItemCard}>
                <div className={styles.invoiceCardHeader}>
                  <strong>{invoice.itemCount} lineas registradas</strong>
                  <StatusPill tone="success">Backend</StatusPill>
                </div>
                <small>
                  Esta lane ya respeta el contrato fiscal: el detalle completo
                  vive en la factura del backend y se conectara aqui sin duplicar
                  reglas de calculo en UI.
                </small>
              </div>
            ) : (
              <div className={styles.emptyState}>
                Crea un borrador y agrega la primera linea comercial antes de
                revisar el documento.
              </div>
            )}
          </div>
          <div className={styles.buttonRow}>
            <a className={styles.secondaryButton} href="#invoicing-customer-draft">
              Volver al borrador
            </a>
            <a className={styles.primaryButton} href="#invoicing-documents">
              Revisar documento
            </a>
          </div>
        </Card>

        <Card>
          <span className={styles.label}>Agregar item</span>
          <h3>Entrada guiada, calculo del backend</h3>
          <div className={styles.invoiceInlineGrid}>
            <label className={styles.field}>
              Descripcion
              <input disabled value="Servicio profesional" readOnly />
            </label>
            <label className={styles.field}>
              Cantidad
              <input disabled value="1" readOnly />
            </label>
            <label className={styles.field}>
              Precio unitario
              <input
                disabled
                value={formatMoney(sampleSubtotalInCents, currency)}
                readOnly
              />
            </label>
            <label className={styles.field}>
              IVA
              <input
                disabled
                value={
                  defaultTaxRate
                    ? `${defaultTaxRate.name} · ${defaultTaxRate.percentage}%`
                    : 'Pendiente'
                }
                readOnly
              />
            </label>
          </div>
          <p>
            El formulario queda preparado para guardar la linea con el contrato
            real; por ahora no simula guardados ni recalcula impuestos fuera del
            backend.
          </p>
          <button className={styles.primaryButton} disabled type="button">
            Agregar linea
          </button>
        </Card>
      </div>

      <div className={styles.invoicingDomainWorkGrid}>
        <Card>
          <span className={styles.label}>Totales del borrador</span>
          <div className={styles.documentPreview}>
            <h3>
              {invoice
                ? formatMoney(invoice.totals.totalInCents, invoice.currency)
                : formatMoney(sampleTotalInCents, currency)}
            </h3>
            <div className={styles.invoicingContextTriad}>
              <ContextSignal
                detail="Base antes de impuestos"
                label="Subtotal"
                tone="neutral"
                value={
                  invoice
                    ? formatMoney(invoice.totals.subtotalInCents, invoice.currency)
                    : formatMoney(sampleSubtotalInCents, currency)
                }
              />
              <ContextSignal
                detail={defaultTaxRate?.name ?? 'Tarifa no seleccionada'}
                label="IVA"
                tone={defaultTaxRate ? 'success' : 'warning'}
                value={
                  invoice
                    ? formatMoney(invoice.totals.taxInCents, invoice.currency)
                    : formatMoney(sampleTaxInCents, currency)
                }
              />
              <ContextSignal
                detail="Listo para revision documental"
                label="Total"
                tone={invoice ? 'success' : 'warning'}
                value={
                  invoice
                    ? formatMoney(invoice.totals.totalInCents, invoice.currency)
                    : formatMoney(sampleTotalInCents, currency)
                }
              />
            </div>
          </div>
        </Card>

        <Card>
          <span className={styles.label}>Guardrail Ecuador</span>
          <h3>Items no autorizan SRI</h3>
          <p>
            Agregar lineas solo compone el documento comercial. La firma, el
            envio y la autorizacion siguen bloqueados hasta que el ciclo SRI lo
            confirme con evidencia del backend.
          </p>
          <div className={styles.buttonRow}>
            <a className={styles.secondaryButton} href="#invoicing-settings-sri">
              Revisar readiness
            </a>
            <a className={styles.primaryButton} href="#invoicing-documents">
              Ir a documentos
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}

type ClaudeInvoicingDocumentsProps = {
  invoices: InvoiceSummaryResponse[];
  onRefresh: () => void;
  onSelectInvoice: (invoiceId: string) => void;
  selectedInvoice: InvoiceSummaryResponse | null;
  stage: ReturnType<typeof getInvoiceStage>;
};

function ClaudeInvoicingDocuments({
  invoices,
  onRefresh,
  onSelectInvoice,
  selectedInvoice,
  stage,
}: ClaudeInvoicingDocumentsProps) {
  return (
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
          {invoices.length === 0 ? (
            <div className={styles.emptyState}>
              No hay documentos visibles para este tenant.
            </div>
          ) : (
            invoices.map((invoice) => (
              <button
                className={`${styles.invoiceQueueRow} ${
                  selectedInvoice?.id === invoice.id
                    ? styles.drilldownCardActive
                    : ''
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
            ))
          )}
        </div>
      </Card>

      <Card className={styles.invoicingDomainDetailCard}>
        <div className={styles.invoicingDomainCardHeader}>
          <div>
            <h3>{selectedInvoice?.buyerName ?? 'Sin factura seleccionada'}</h3>
            <p>{selectedInvoice?.number ?? 'La cola esta vacia'}</p>
          </div>
          <StatusPill tone={statusTone(stage.tone)}>{stage.label}</StatusPill>
        </div>
        <div className={styles.documentPreview}>
          <h3>
            {selectedInvoice
              ? formatMoney(
                  selectedInvoice.totals.totalInCents,
                  selectedInvoice.currency,
                )
              : '$0,00'}
          </h3>
          <div className={styles.invoicingContextTriad}>
            <ContextSignal
              detail="Condicion del sistema"
              label="Documento"
              tone="neutral"
              value={
                selectedInvoice ? humanizeKey(selectedInvoice.status) : 'Sin dato'
              }
            />
            <ContextSignal
              detail="No implica autorizacion hasta confirmacion backend"
              label="SRI"
              tone={stage.tone}
              value={
                selectedInvoice
                  ? humanizeKey(selectedInvoice.electronicStatus)
                  : 'Sin dato'
              }
            />
            <ContextSignal
              detail={
                selectedInvoice
                  ? formatMoney(
                      selectedInvoice.settlement.balanceDueInCents,
                      selectedInvoice.currency,
                    )
                  : 'Sin saldo'
              }
              label="Pago"
              tone={selectedInvoice?.settlement.isFullyPaid ? 'success' : 'warning'}
              value={getPaymentLabel(selectedInvoice)}
            />
          </div>
          <div className={styles.buttonRow}>
            <button className={styles.primaryButton} onClick={onRefresh} type="button">
              Refrescar
            </button>
            <a className={styles.secondaryButton} href="#invoicing-settings-sri">
              Ajustar SRI
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
