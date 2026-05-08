import { FormEvent, startTransition, useEffect, useMemo, useState } from 'react';
import styles from './app.module.css';
import {
  acceptInvitation,
  cancelInvitation,
  checkInvoiceElectronicAuthorization,
  createCustomer,
  createCreditNote,
  createInvitation,
  createInvoice,
  createInvoiceItem,
  createInvoicePayment,
  createTaxRate,
  downloadInvoiceElectronicRideHtml,
  downloadInvoiceElectronicXmlPreview,
  fetchElectronicSandboxReadiness,
  fetchElectronicSubmissionSettings,
  fetchElectronicSignatureSettings,
  fetchInvitationForInvitee,
  fetchInvoiceDetail,
  fetchInvoiceDocument,
  fetchInvoiceElectronicArtifacts,
  fetchInvoiceDocumentHtml,
  fetchInvoiceElectronicRide,
  fetchInvoiceElectronicRideHtml,
  fetchInvoiceElectronicXmlPreview,
  fetchInvoiceNumberingSettings,
  fetchInvoicingReportSummary,
  fetchIssuerProfile,
  fetchSession,
  getTenantInvitation,
  listCustomers,
  listInvoices,
  listPlans,
  listProducts,
  listTaxRates,
  listTenantEnabledProducts,
  listTenantInvitations,
  reverseInvoicePayment,
  resendInvitation,
  sendInvoiceEmail,
  setCurrentTenancy,
  submitInvoiceElectronicDocument,
  submitPresignedInvoiceElectronicDocument,
  upsertElectronicSubmissionSettings,
  upsertElectronicSignatureSettings,
  upsertInvoiceNumberingSettings,
  upsertIssuerProfile,
  updateInvoiceElectronicStatus,
  updateInvoiceStatus,
} from './api';
import {
  AuthenticatedInvitationResponse,
  AuthenticatedSessionResponse,
  CustomerResponse,
  ElectronicSandboxReadinessResponse,
  ElectronicSubmissionSettingsResponse,
  ElectronicSignatureSettingsResponse,
  InvoiceElectronicArtifactsResponse,
  InvoiceNumberingSettingsResponse,
  InvoiceDetailResponse,
  InvoiceDocumentResponse,
  InvoiceRideResponse,
  InvoicingReportSummaryResponse,
  InvitationResponse,
  IssuerProfileResponse,
  InvoiceSummaryResponse,
  PlatformPlan,
  PlatformProduct,
  TaxRateResponse,
  SessionPendingInvitation,
  SessionEntitlement,
  SessionTenancy,
} from './types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:3000/api';
const TOKEN_STORAGE_KEY = 'saas-platform.web.token';

function formatDate(value: string | null): string {
  if (!value) {
    return 'No registrado';
  }

  return new Intl.DateTimeFormat('es-EC', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function invitationStateTone(status: string): string {
  switch (status.toLowerCase()) {
    case 'pending':
      return styles.pending;
    case 'accepted':
      return styles.accepted;
    case 'expired':
      return styles.expired;
    case 'cancelled':
      return styles.cancelled;
    default:
      return '';
  }
}

function flowLabel(flow: AuthenticatedSessionResponse['sessionState']['recommendedFlow']): string {
  switch (flow) {
    case 'workspace':
      return 'Entrar al workspace';
    case 'select-tenancy':
      return 'Elegir tenant';
    case 'accept-invitation':
      return 'Revisar invitacion';
    case 'empty':
      return 'Comenzar onboarding';
    default:
      return flow;
  }
}

function formatMoney(priceInCents: number, currency: string): string {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(priceInCents / 100);
}

function downloadTextArtifact(
  content: string,
  fileName: string,
  contentType: string,
): void {
  const blob = new Blob([content], { type: contentType });
  const url = window.URL.createObjectURL(blob);
  const anchor = window.document.createElement('a');

  anchor.href = url;
  anchor.download = fileName;
  window.document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
}

function formatInvoiceStatus(status: string): string {
  switch (status.toLowerCase()) {
    case 'draft':
      return 'Borrador';
    case 'issued':
      return 'Emitida';
    case 'partially_paid':
      return 'Parcialmente pagada';
    case 'paid':
      return 'Pagada';
    case 'void':
      return 'Anulada';
    default:
      return status;
  }
}

function formatPaymentStatus(status: string): string {
  switch (status.toLowerCase()) {
    case 'posted':
      return 'Aplicado';
    case 'reversed':
      return 'Revertido';
    default:
      return status;
  }
}

function formatElectronicStatus(status: string | null): string {
  switch (status) {
    case 'pending_submission':
      return 'Pendiente de envio';
    case 'submitted':
      return 'Enviado al SRI';
    case 'authorized':
      return 'Autorizada';
    case 'rejected':
      return 'Rechazada';
    default:
      return 'Sin estado electronico';
  }
}

function formatBuyerIdentificationType(value: string | null): string {
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
      return value ?? 'No configurado';
  }
}

function formatPercentage(value: number): string {
  return new Intl.NumberFormat('es-EC', {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatReportMonth(value: string): string {
  const [year, month] = value.split('-');

  if (!year || !month) {
    return value;
  }

  return new Intl.DateTimeFormat('es-EC', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(Number(year), Number(month) - 1, 1));
}

function getEntitlementValue(
  entitlements: SessionEntitlement[],
  key: string,
): unknown | null {
  return entitlements.find((entitlement) => entitlement.key === key)?.value ?? null;
}

function getStringArrayEntitlement(
  entitlements: SessionEntitlement[],
  key: string,
): string[] {
  const value = getEntitlementValue(entitlements, key);

  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function getBooleanEntitlement(
  entitlements: SessionEntitlement[],
  key: string,
): boolean | null {
  const value = getEntitlementValue(entitlements, key);

  return typeof value === 'boolean' ? value : null;
}

function getNumberEntitlement(
  entitlements: SessionEntitlement[],
  key: string,
): number | null {
  const value = getEntitlementValue(entitlements, key);

  return typeof value === 'number' ? value : null;
}

function findRideAdditionalInfoValue(
  ride: InvoiceRideResponse | null,
  label: string,
): string | null {
  if (!ride) {
    return null;
  }

  return (
    ride.ride.additionalInfoFields.find((field) => field.label === label)?.value ??
    null
  );
}

function findPendingInvitation(
  session: AuthenticatedSessionResponse | null,
  invitationId: string | null,
): SessionPendingInvitation | null {
  if (!session || !invitationId) {
    return null;
  }

  return (
    session.pendingInvitations.find(
      ({ invitation }) => invitation.id === invitationId,
    ) ?? null
  );
}

async function loadOptionalInvoicingSettings(token: string, tenantSlug: string): Promise<{
  electronicSandboxReadiness: ElectronicSandboxReadinessResponse | null;
  electronicSubmissionSettings: ElectronicSubmissionSettingsResponse | null;
  electronicSignatureSettings: ElectronicSignatureSettingsResponse | null;
  issuerProfile: IssuerProfileResponse | null;
  invoiceNumberingSettings: InvoiceNumberingSettingsResponse | null;
}> {
  const [
    electronicSandboxReadiness,
    electronicSubmissionSettings,
    electronicSignatureSettings,
    issuerProfile,
    invoiceNumberingSettings,
  ] =
    await Promise.all([
      fetchElectronicSandboxReadiness(token, tenantSlug).catch(() => null),
      fetchElectronicSubmissionSettings(token, tenantSlug).catch(() => null),
      fetchElectronicSignatureSettings(token, tenantSlug).catch(() => null),
      fetchIssuerProfile(token, tenantSlug).catch(() => null),
      fetchInvoiceNumberingSettings(token, tenantSlug).catch(() => null),
    ]);

  return {
    electronicSandboxReadiness,
    electronicSubmissionSettings,
    electronicSignatureSettings,
    issuerProfile,
    invoiceNumberingSettings,
  };
}

export function App() {
  const [deepLinkedInvitationId, setDeepLinkedInvitationId] = useState<string | null>(
    null,
  );
  const [tokenInput, setTokenInput] = useState('');
  const [token, setToken] = useState('');
  const [session, setSession] = useState<AuthenticatedSessionResponse | null>(
    null,
  );
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [planCatalog, setPlanCatalog] = useState<PlatformPlan[]>([]);
  const [productCatalog, setProductCatalog] = useState<PlatformProduct[]>([]);
  const [tenantEnabledProducts, setTenantEnabledProducts] = useState<
    PlatformProduct[]
  >([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [taxRates, setTaxRates] = useState<TaxRateResponse[]>([]);
  const [invoices, setInvoices] = useState<InvoiceSummaryResponse[]>([]);
  const [electronicSubmissionSettings, setElectronicSubmissionSettings] =
    useState<ElectronicSubmissionSettingsResponse | null>(null);
  const [electronicSandboxReadiness, setElectronicSandboxReadiness] =
    useState<ElectronicSandboxReadinessResponse | null>(null);
  const [electronicSignatureSettings, setElectronicSignatureSettings] =
    useState<ElectronicSignatureSettingsResponse | null>(null);
  const [issuerProfile, setIssuerProfile] = useState<IssuerProfileResponse | null>(
    null,
  );
  const [invoiceNumberingSettings, setInvoiceNumberingSettings] =
    useState<InvoiceNumberingSettingsResponse | null>(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [selectedInvoiceDetail, setSelectedInvoiceDetail] =
    useState<InvoiceDetailResponse | null>(null);
  const [selectedInvoiceDocument, setSelectedInvoiceDocument] =
    useState<InvoiceDocumentResponse | null>(null);
  const [selectedInvoiceArtifacts, setSelectedInvoiceArtifacts] =
    useState<InvoiceElectronicArtifactsResponse | null>(null);
  const [selectedInvoiceRide, setSelectedInvoiceRide] =
    useState<InvoiceRideResponse | null>(null);
  const [selectedInvoiceXmlPreview, setSelectedInvoiceXmlPreview] = useState<
    string | null
  >(null);
  const [invoicingReport, setInvoicingReport] =
    useState<InvoicingReportSummaryResponse | null>(null);
  const [invoicingLoading, setInvoicingLoading] = useState(false);
  const [invoiceDetailLoading, setInvoiceDetailLoading] = useState(false);
  const [invoicingError, setInvoicingError] = useState<string | null>(null);
  const [invoicingActionMessage, setInvoicingActionMessage] = useState<
    string | null
  >(null);

  const selectedInvoiceDocumentSupport =
    selectedInvoiceDetail && electronicSandboxReadiness
      ? electronicSandboxReadiness.documentSupport.find(
          (item) => item.documentCode === (selectedInvoiceDetail.documentCode ?? '01'),
        ) ?? null
      : null;

  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');
  const [newCustomerTaxId, setNewCustomerTaxId] = useState('');
  const [newCustomerIdentificationType, setNewCustomerIdentificationType] =
    useState<'04' | '05' | '06' | '07' | '08'>('04');
  const [newCustomerBillingAddress, setNewCustomerBillingAddress] = useState('');
  const [newInvoiceCustomerId, setNewInvoiceCustomerId] = useState('');
  const [newTaxRateName, setNewTaxRateName] = useState('');
  const [newTaxRatePercentage, setNewTaxRatePercentage] = useState('');
  const [issuerLegalName, setIssuerLegalName] = useState('');
  const [issuerCommercialName, setIssuerCommercialName] = useState('');
  const [issuerTaxId, setIssuerTaxId] = useState('');
  const [issuerEnvironment, setIssuerEnvironment] = useState<'test' | 'production'>(
    'test',
  );
  const [issuerAccountingObligated, setIssuerAccountingObligated] = useState(false);
  const [issuerSpecialTaxpayerCode, setIssuerSpecialTaxpayerCode] = useState('');
  const [issuerRimpeTaxpayerType, setIssuerRimpeTaxpayerType] = useState('');
  const [issuerMatrixAddress, setIssuerMatrixAddress] = useState('');
  const [issuerEstablishmentAddress, setIssuerEstablishmentAddress] =
    useState('');
  const [signatureProvider, setSignatureProvider] = useState<
    'stub_local' | 'xades_pkcs12'
  >('stub_local');
  const [signatureStorageMode, setSignatureStorageMode] = useState<
    'stub_inline' | 'secret_ref'
  >('stub_inline');
  const [signatureCertificateLabel, setSignatureCertificateLabel] = useState('');
  const [signatureCertificateFingerprint, setSignatureCertificateFingerprint] =
    useState('');
  const [signaturePkcs12SecretRef, setSignaturePkcs12SecretRef] = useState('');
  const [signaturePasswordSecretRef, setSignaturePasswordSecretRef] =
    useState('');
  const [signatureSubjectName, setSignatureSubjectName] = useState('');
  const [signatureIsActive, setSignatureIsActive] = useState(true);
  const [submissionProvider, setSubmissionProvider] = useState<
    'stub_sri' | 'sri_offline_ws'
  >('stub_sri');
  const [submissionEnvironment, setSubmissionEnvironment] = useState<
    'test' | 'production'
  >('test');
  const [submissionMode, setSubmissionMode] = useState<
    'sync_stub' | 'offline'
  >('sync_stub');
  const [submissionReceptionUrl, setSubmissionReceptionUrl] = useState('');
  const [submissionAuthorizationUrl, setSubmissionAuthorizationUrl] =
    useState('');
  const [submissionCredentialsSecretRef, setSubmissionCredentialsSecretRef] =
    useState('');
  const [submissionTimeoutMs, setSubmissionTimeoutMs] = useState('10000');
  const [submissionIsActive, setSubmissionIsActive] = useState(true);
  const [numberingDocumentCode, setNumberingDocumentCode] = useState('01');
  const [numberingEstablishmentCode, setNumberingEstablishmentCode] =
    useState('');
  const [numberingEmissionPointCode, setNumberingEmissionPointCode] =
    useState('');
  const [numberingNextSequence, setNumberingNextSequence] = useState('1');
  const [newInvoiceNumber, setNewInvoiceNumber] = useState('');
  const [newInvoiceCurrency, setNewInvoiceCurrency] = useState('USD');
  const [newInvoiceStatus, setNewInvoiceStatus] = useState('draft');
  const [newInvoiceDueAt, setNewInvoiceDueAt] = useState('');
  const [newInvoiceNotes, setNewInvoiceNotes] = useState('');
  const [newCreditNoteReason, setNewCreditNoteReason] = useState(
    'Devolucion parcial de la factura origen.',
  );
  const [newCreditNoteIssuedAt, setNewCreditNoteIssuedAt] = useState('');
  const [newCreditNoteNotes, setNewCreditNoteNotes] = useState(
    'Nota de credito de prueba.',
  );
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('1');
  const [newItemUnitPriceInCents, setNewItemUnitPriceInCents] = useState('');
  const [newItemTaxRateId, setNewItemTaxRateId] = useState('');
  const [newPaymentAmountInCents, setNewPaymentAmountInCents] = useState('');
  const [newPaymentMethod, setNewPaymentMethod] = useState('transfer');
  const [newPaymentReference, setNewPaymentReference] = useState('');
  const [newPaymentPaidAt, setNewPaymentPaidAt] = useState('');
  const [newPaymentNotes, setNewPaymentNotes] = useState('');
  const [invoiceElectronicStatus, setInvoiceElectronicStatus] = useState<
    'pending_submission' | 'submitted' | 'authorized' | 'rejected'
  >('pending_submission');
  const [invoiceAccessKey, setInvoiceAccessKey] = useState('');
  const [invoiceAuthorizationNumber, setInvoiceAuthorizationNumber] = useState('');
  const [invoiceAuthorizedAt, setInvoiceAuthorizedAt] = useState('');
  const [invoiceElectronicStatusMessage, setInvoiceElectronicStatusMessage] =
    useState('');
  const [paymentReversalReason, setPaymentReversalReason] = useState('');
  const [invoiceEmailRecipient, setInvoiceEmailRecipient] = useState('');
  const [invoiceEmailMessage, setInvoiceEmailMessage] = useState('');
  const [presignedInvoiceXml, setPresignedInvoiceXml] = useState('');
  const [presignedInvoiceSignerName, setPresignedInvoiceSignerName] =
    useState('');

  const [tenantInvitations, setTenantInvitations] = useState<InvitationResponse[]>(
    [],
  );
  const [tenantInvitationsLoading, setTenantInvitationsLoading] = useState(false);
  const [tenantInvitationsError, setTenantInvitationsError] = useState<string | null>(
    null,
  );
  const [selectedTenantInvitation, setSelectedTenantInvitation] =
    useState<InvitationResponse | null>(null);
  const [selectedPendingInvitationId, setSelectedPendingInvitationId] = useState<
    string | null
  >(null);
  const [pendingInvitationDetail, setPendingInvitationDetail] =
    useState<AuthenticatedInvitationResponse | null>(null);
  const [pendingInvitationLoading, setPendingInvitationLoading] = useState(false);
  const [pendingInvitationError, setPendingInvitationError] = useState<string | null>(
    null,
  );

  const [newInvitationEmail, setNewInvitationEmail] = useState('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const currentTenancy = session?.currentTenancy ?? null;
  const currentEntitlements = currentTenancy?.entitlements ?? [];
  const currentSubscription = currentTenancy?.subscription ?? null;
  const canManageInvitations = Boolean(
    currentTenancy?.permissionKeys.includes('tenant.invitations.manage'),
  );
  const canSendInvoiceNotifications = Boolean(
    currentTenancy?.permissionKeys.includes('invoicing.notifications.send'),
  );
  const selectedPendingInvitation = findPendingInvitation(
    session,
    selectedPendingInvitationId,
  );

  const sessionHeadline = useMemo(() => {
    if (!session) {
      return 'Conecta un Bearer token para ver la sesion del usuario y probar el onboarding.';
    }

    if (session.currentTenancy) {
      return `Trabajando en ${session.currentTenancy.tenant.name}`;
    }

    if (session.pendingInvitations.length > 0) {
      return 'Hay onboarding pendiente listo para revisarse.';
    }

    return 'La sesion existe, pero todavia no tiene un workspace activo.';
  }, [session]);

  const currentPlan = useMemo(() => {
    if (!currentSubscription) {
      return null;
    }

    return (
      planCatalog.find((plan) => plan.id === currentSubscription.planId) ?? null
    );
  }, [currentSubscription, planCatalog]);

  const enabledProductKeys = useMemo(
    () => new Set(tenantEnabledProducts.map((product) => product.key)),
    [tenantEnabledProducts],
  );

  const enabledProducts = useMemo(
    () => tenantEnabledProducts,
    [tenantEnabledProducts],
  );

  const lockedProducts = useMemo(
    () =>
      productCatalog.filter(
        (product) => product.isActive && !enabledProductKeys.has(product.key),
      ),
    [enabledProductKeys, productCatalog],
  );
  const invoicingEnabled = enabledProductKeys.has('invoicing');
  const selectedInvoiceSummary = useMemo(
    () =>
      invoices.find((invoice) => invoice.id === selectedInvoiceId) ?? null,
    [invoices, selectedInvoiceId],
  );
  const customerNameById = useMemo(
    () =>
      new Map(customers.map((customer) => [customer.id, customer.name] as const)),
    [customers],
  );
  const invoicePortfolioTotal = useMemo(
    () =>
      invoices.reduce(
        (sum, invoice) => sum + invoice.totals.totalInCents,
        0,
      ),
    [invoices],
  );
  const invoicePortfolioCurrency = invoices[0]?.currency ?? 'USD';
  const issuedInvoiceCount = useMemo(
    () =>
      invoices.filter((invoice) => invoice.status.toLowerCase() === 'issued')
        .length,
    [invoices],
  );
  const nextInvoiceNumberSuggestion = useMemo(
    () =>
      invoiceNumberingSettings?.previewNumber ??
      `INV-${String(invoices.length + 1).padStart(4, '0')}`,
    [invoiceNumberingSettings, invoices.length],
  );

  const aiEnabled = getBooleanEntitlement(currentEntitlements, 'ai_enabled');
  const maxUsers = getNumberEntitlement(currentEntitlements, 'max_users');
  const storageLimit = getNumberEntitlement(
    currentEntitlements,
    'storage_limit_gb',
  );

  useEffect(() => {
    const url = new URL(window.location.href);
    setDeepLinkedInvitationId(url.searchParams.get('invitationId'));

    const savedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY) ?? '';
    setToken(savedToken);
    setTokenInput(savedToken);
  }, []);

  useEffect(() => {
    if (!token) {
      setSession(null);
      return;
    }

    let cancelled = false;

    async function loadInitialSession() {
      setSessionLoading(true);
      setSessionError(null);

      try {
        const nextSession = await fetchSession(token);

        if (cancelled) {
          return;
        }

        startTransition(() => {
          setSession(nextSession);
          setSelectedPendingInvitationId(
            nextSession.pendingInvitations.some(
              ({ invitation }) => invitation.id === deepLinkedInvitationId,
            )
              ? deepLinkedInvitationId
              : nextSession.pendingInvitations[0]?.invitation.id ?? null,
          );
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        setSession(null);
        setSessionError(
          error instanceof Error ? error.message : 'No se pudo cargar la sesion.',
        );
      } finally {
        if (!cancelled) {
          setSessionLoading(false);
        }
      }
    }

    void loadInitialSession();

    return () => {
      cancelled = true;
    };
  }, [deepLinkedInvitationId, token]);

  useEffect(() => {
    if (!token) {
      setPlanCatalog([]);
      setProductCatalog([]);
      setCatalogError(null);
      return;
    }

    let cancelled = false;

    async function loadCatalog() {
      setCatalogLoading(true);
      setCatalogError(null);

      try {
        const [plans, products] = await Promise.all([
          listPlans(token),
          listProducts(token),
        ]);

        if (cancelled) {
          return;
        }

        startTransition(() => {
          setPlanCatalog(plans);
          setProductCatalog(products);
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        setCatalogError(
          error instanceof Error
            ? error.message
            : 'No se pudo cargar el catalogo comercial.',
        );
      } finally {
        if (!cancelled) {
          setCatalogLoading(false);
        }
      }
    }

    void loadCatalog();

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (!token || !currentTenancy) {
      setTenantEnabledProducts([]);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    const invoiceId = selectedInvoiceId;
    let cancelled = false;

    async function loadEnabledProducts() {
      try {
        const products = await listTenantEnabledProducts(
          token,
          tenantSlug,
        );

        if (cancelled) {
          return;
        }

        startTransition(() => {
          setTenantEnabledProducts(products);
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        setCatalogError(
          error instanceof Error
            ? error.message
            : 'No se pudo resolver el acceso efectivo del tenant.',
        );
        setTenantEnabledProducts([]);
      }
    }

    void loadEnabledProducts();

    return () => {
      cancelled = true;
    };
  }, [currentTenancy, token]);

  useEffect(() => {
    if (!token || !currentTenancy || !invoicingEnabled) {
      setCustomers([]);
      setTaxRates([]);
      setInvoices([]);
      setElectronicSandboxReadiness(null);
      setElectronicSubmissionSettings(null);
      setElectronicSignatureSettings(null);
      setIssuerProfile(null);
      setInvoiceNumberingSettings(null);
      setInvoicingReport(null);
      setSelectedInvoiceId(null);
      setSelectedInvoiceDetail(null);
      setSelectedInvoiceDocument(null);
      setSelectedInvoiceArtifacts(null);
      setSelectedInvoiceRide(null);
      setInvoicingError(null);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    const invoiceId = selectedInvoiceId;
    let cancelled = false;

    async function loadInvoicingWorkspace() {
      setInvoicingLoading(true);
      setInvoicingError(null);

      try {
        const [
          nextCustomers,
          nextTaxRates,
          nextInvoices,
          nextReport,
          nextSettings,
        ] =
          await Promise.all([
          listCustomers(token, tenantSlug),
          listTaxRates(token, tenantSlug),
          listInvoices(token, tenantSlug),
          fetchInvoicingReportSummary(token, tenantSlug),
          loadOptionalInvoicingSettings(token, tenantSlug),
        ]);

        if (cancelled) {
          return;
        }

        startTransition(() => {
          setCustomers(nextCustomers);
          setTaxRates(nextTaxRates);
          setInvoices(nextInvoices);
          setElectronicSandboxReadiness(
            nextSettings.electronicSandboxReadiness,
          );
          setElectronicSubmissionSettings(
            nextSettings.electronicSubmissionSettings,
          );
          setElectronicSignatureSettings(nextSettings.electronicSignatureSettings);
          setIssuerProfile(nextSettings.issuerProfile);
          setInvoiceNumberingSettings(nextSettings.invoiceNumberingSettings);
          setInvoicingReport(nextReport);
          setSelectedInvoiceId((currentSelection) =>
            nextInvoices.some((invoice) => invoice.id === currentSelection)
              ? currentSelection
              : nextInvoices[0]?.id ?? null,
          );
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        setCustomers([]);
        setElectronicSandboxReadiness(null);
        setElectronicSignatureSettings(null);
        setIssuerProfile(null);
        setInvoiceNumberingSettings(null);
        setInvoicingReport(null);
        setInvoices([]);
        setSelectedInvoiceId(null);
        setSelectedInvoiceDetail(null);
        setSelectedInvoiceDocument(null);
        setSelectedInvoiceArtifacts(null);
        setSelectedInvoiceRide(null);
        setInvoicingError(
          error instanceof Error
            ? error.message
            : 'No se pudo cargar el workspace de invoicing.',
        );
      } finally {
        if (!cancelled) {
          setInvoicingLoading(false);
        }
      }
    }

    void loadInvoicingWorkspace();

    return () => {
      cancelled = true;
    };
  }, [currentTenancy, invoicingEnabled, token]);

  useEffect(() => {
    if (!token || !currentTenancy || !selectedInvoiceId || !invoicingEnabled) {
      setSelectedInvoiceDetail(null);
      setSelectedInvoiceDocument(null);
      setSelectedInvoiceArtifacts(null);
      setSelectedInvoiceRide(null);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    const invoiceId = selectedInvoiceId;
    let cancelled = false;

    async function loadSelectedInvoiceDetail() {
      setInvoiceDetailLoading(true);

      try {
        const [detail, document, artifacts, ride] = await Promise.all([
          fetchInvoiceDetail(token, tenantSlug, invoiceId),
          fetchInvoiceDocument(
            token,
            tenantSlug,
            invoiceId,
          ),
          fetchInvoiceElectronicArtifacts(token, tenantSlug, invoiceId),
          fetchInvoiceElectronicRide(token, tenantSlug, invoiceId),
        ]);

        if (cancelled) {
          return;
        }

        startTransition(() => {
          setSelectedInvoiceDetail(detail);
          setSelectedInvoiceDocument(document);
          setSelectedInvoiceArtifacts(artifacts);
          setSelectedInvoiceRide(ride);
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        setSelectedInvoiceDetail(null);
        setSelectedInvoiceDocument(null);
        setSelectedInvoiceArtifacts(null);
        setSelectedInvoiceRide(null);
        setInvoicingError(
          error instanceof Error
            ? error.message
            : 'No se pudo cargar el detalle de la factura.',
        );
      } finally {
        if (!cancelled) {
          setInvoiceDetailLoading(false);
        }
      }
    }

    void loadSelectedInvoiceDetail();

    return () => {
      cancelled = true;
    };
  }, [currentTenancy, invoicingEnabled, selectedInvoiceId, token]);

  useEffect(() => {
    if (!token || !selectedPendingInvitationId) {
      setPendingInvitationDetail(null);
      setPendingInvitationError(null);
      return;
    }

    const invitationId = selectedPendingInvitationId;
    let cancelled = false;

    async function loadPendingInvitationDetail() {
      setPendingInvitationLoading(true);
      setPendingInvitationError(null);

      try {
        const detail = await fetchInvitationForInvitee(
          token,
          invitationId,
        );

        if (cancelled) {
          return;
        }

        startTransition(() => {
          setPendingInvitationDetail(detail);
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        setPendingInvitationDetail(null);
        setPendingInvitationError(
          error instanceof Error
            ? error.message
            : 'No se pudo cargar el detalle de la invitacion.',
        );
      } finally {
        if (!cancelled) {
          setPendingInvitationLoading(false);
        }
      }
    }

    void loadPendingInvitationDetail();

    return () => {
      cancelled = true;
    };
  }, [selectedPendingInvitationId, token]);

  useEffect(() => {
    if (!customers.some((customer) => customer.id === newInvoiceCustomerId)) {
      setNewInvoiceCustomerId(customers[0]?.id ?? '');
    }
  }, [customers, newInvoiceCustomerId]);

  useEffect(() => {
    if (!taxRates.some((taxRate) => taxRate.id === newItemTaxRateId)) {
      setNewItemTaxRateId('');
    }
  }, [newItemTaxRateId, taxRates]);

  useEffect(() => {
    if (!selectedInvoiceDocument) {
      setInvoiceEmailRecipient('');
      setInvoiceEmailMessage('');
      return;
    }

    setInvoiceEmailRecipient(
      selectedInvoiceDocument.customer.email ?? '',
    );
  }, [selectedInvoiceDocument]);

  useEffect(() => {
    if (!selectedInvoiceDetail) {
      setInvoiceElectronicStatus('pending_submission');
      setInvoiceAccessKey('');
      setInvoiceAuthorizationNumber('');
      setInvoiceAuthorizedAt('');
      setInvoiceElectronicStatusMessage('');
      setSelectedInvoiceXmlPreview(null);
      return;
    }

    setSelectedInvoiceXmlPreview(null);

    setInvoiceElectronicStatus(
      (selectedInvoiceDetail.electronicStatus as
        | 'pending_submission'
        | 'submitted'
        | 'authorized'
        | 'rejected'
        | null) ?? 'pending_submission',
    );
    setInvoiceAccessKey(selectedInvoiceDetail.accessKey ?? '');
    setInvoiceAuthorizationNumber(
      selectedInvoiceDetail.authorizationNumber ?? '',
    );
    setInvoiceAuthorizedAt(
      selectedInvoiceDetail.authorizedAt
        ? selectedInvoiceDetail.authorizedAt.slice(0, 16)
        : '',
    );
    setInvoiceElectronicStatusMessage(
      selectedInvoiceDetail.electronicStatusMessage ?? '',
    );
  }, [selectedInvoiceDetail]);

  useEffect(() => {
    if (!issuerProfile) {
      setIssuerLegalName('');
      setIssuerCommercialName('');
      setIssuerTaxId('');
      setIssuerEnvironment('test');
      setIssuerAccountingObligated(false);
      setIssuerSpecialTaxpayerCode('');
      setIssuerRimpeTaxpayerType('');
      setIssuerMatrixAddress('');
      setIssuerEstablishmentAddress('');
      return;
    }

    setIssuerLegalName(issuerProfile.legalName);
    setIssuerCommercialName(issuerProfile.commercialName ?? '');
    setIssuerTaxId(issuerProfile.taxId);
    setIssuerEnvironment(
      issuerProfile.environment === 'production' ? 'production' : 'test',
    );
    setIssuerAccountingObligated(issuerProfile.accountingObligated);
    setIssuerSpecialTaxpayerCode(issuerProfile.specialTaxpayerCode ?? '');
    setIssuerRimpeTaxpayerType(issuerProfile.rimpeTaxpayerType ?? '');
    setIssuerMatrixAddress(issuerProfile.matrixAddress);
    setIssuerEstablishmentAddress(issuerProfile.establishmentAddress);
  }, [issuerProfile]);

  useEffect(() => {
    if (!electronicSubmissionSettings) {
      setSubmissionProvider('stub_sri');
      setSubmissionEnvironment('test');
      setSubmissionMode('sync_stub');
      setSubmissionReceptionUrl('');
      setSubmissionAuthorizationUrl('');
      setSubmissionCredentialsSecretRef('');
      setSubmissionTimeoutMs('10000');
      setSubmissionIsActive(true);
      return;
    }

    setSubmissionProvider(
      electronicSubmissionSettings.provider === 'sri_offline_ws'
        ? 'sri_offline_ws'
        : 'stub_sri',
    );
    setSubmissionEnvironment(
      electronicSubmissionSettings.environment === 'production'
        ? 'production'
        : 'test',
    );
    setSubmissionMode(
      electronicSubmissionSettings.transmissionMode === 'offline'
        ? 'offline'
        : 'sync_stub',
    );
    setSubmissionReceptionUrl(
      electronicSubmissionSettings.receptionUrl ?? '',
    );
    setSubmissionAuthorizationUrl(
      electronicSubmissionSettings.authorizationUrl ?? '',
    );
    setSubmissionCredentialsSecretRef(
      electronicSubmissionSettings.credentialsSecretRef ?? '',
    );
    setSubmissionTimeoutMs(String(electronicSubmissionSettings.timeoutMs));
    setSubmissionIsActive(electronicSubmissionSettings.isActive);
  }, [electronicSubmissionSettings]);

  useEffect(() => {
    if (!electronicSignatureSettings) {
      setSignatureProvider('stub_local');
      setSignatureStorageMode('stub_inline');
      setSignatureCertificateLabel('');
      setSignatureCertificateFingerprint('');
      setSignaturePkcs12SecretRef('');
      setSignaturePasswordSecretRef('');
      setSignatureSubjectName('');
      setSignatureIsActive(true);
      return;
    }

    setSignatureProvider(
      electronicSignatureSettings.provider === 'xades_pkcs12'
        ? 'xades_pkcs12'
        : 'stub_local',
    );
    setSignatureStorageMode(
      electronicSignatureSettings.storageMode === 'secret_ref'
        ? 'secret_ref'
        : 'stub_inline',
    );
    setSignatureCertificateLabel(
      electronicSignatureSettings.certificateLabel,
    );
    setSignatureCertificateFingerprint(
      electronicSignatureSettings.certificateFingerprint ?? '',
    );
    setSignaturePkcs12SecretRef(
      electronicSignatureSettings.pkcs12SecretRef ?? '',
    );
    setSignaturePasswordSecretRef(
      electronicSignatureSettings.privateKeyPasswordSecretRef ?? '',
    );
    setSignatureSubjectName(electronicSignatureSettings.subjectName ?? '');
    setSignatureIsActive(electronicSignatureSettings.isActive);
  }, [electronicSignatureSettings]);

  useEffect(() => {
    if (!invoiceNumberingSettings) {
      setNumberingDocumentCode('01');
      setNumberingEstablishmentCode('');
      setNumberingEmissionPointCode('');
      setNumberingNextSequence('1');
      return;
    }

    setNumberingDocumentCode(invoiceNumberingSettings.documentCode);
    setNumberingEstablishmentCode(invoiceNumberingSettings.establishmentCode);
    setNumberingEmissionPointCode(invoiceNumberingSettings.emissionPointCode);
    setNumberingNextSequence(String(invoiceNumberingSettings.nextSequenceNumber));
  }, [invoiceNumberingSettings]);

  useEffect(() => {
    if (!token || !currentTenancy || !canManageInvitations) {
      setTenantInvitations([]);
      setSelectedTenantInvitation(null);
      setTenantInvitationsError(null);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    let cancelled = false;

    async function loadTenantInvitations() {
      setTenantInvitationsLoading(true);
      setTenantInvitationsError(null);

      try {
        const invitations = await listTenantInvitations(
          token,
          tenantSlug,
        );

        if (cancelled) {
          return;
        }

        startTransition(() => {
          setTenantInvitations(invitations);
          setSelectedTenantInvitation((currentSelection) => {
            if (!currentSelection) {
              return invitations[0] ?? null;
            }

            return (
              invitations.find(
                ({ id }) => id === currentSelection.id,
              ) ?? invitations[0] ?? null
            );
          });
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        setTenantInvitations([]);
        setSelectedTenantInvitation(null);
        setTenantInvitationsError(
          error instanceof Error
            ? error.message
            : 'No se pudieron cargar las invitaciones del tenant.',
        );
      } finally {
        if (!cancelled) {
          setTenantInvitationsLoading(false);
        }
      }
    }

    void loadTenantInvitations();

    return () => {
      cancelled = true;
    };
  }, [canManageInvitations, currentTenancy, token]);

  async function refreshSession(tenantSlug?: string | null) {
    if (!token) {
      return;
    }

    setSessionLoading(true);
    setSessionError(null);

    try {
      const nextSession = await fetchSession(token, tenantSlug);
      startTransition(() => {
        setSession(nextSession);

        if (
          !nextSession.pendingInvitations.some(
            ({ invitation }) => invitation.id === selectedPendingInvitationId,
          )
        ) {
          setSelectedPendingInvitationId(
            nextSession.pendingInvitations.some(
              ({ invitation }) => invitation.id === deepLinkedInvitationId,
            )
              ? deepLinkedInvitationId
              : nextSession.pendingInvitations[0]?.invitation.id ?? null,
          );
        }
      });
    } catch (error) {
      setSessionError(
        error instanceof Error ? error.message : 'No se pudo refrescar la sesion.',
      );
    } finally {
      setSessionLoading(false);
    }
  }

  async function refreshInvoicingWorkspace(options?: {
    selectInvoiceId?: string | null;
  }) {
    if (!token || !currentTenancy || !invoicingEnabled) {
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    setInvoicingLoading(true);
    setInvoicingError(null);

    try {
      const [
        nextTaxRates,
        nextCustomers,
        nextInvoices,
        nextReport,
        nextSettings,
      ] =
        await Promise.all([
        listTaxRates(token, tenantSlug),
        listCustomers(token, tenantSlug),
        listInvoices(token, tenantSlug),
        fetchInvoicingReportSummary(token, tenantSlug),
        loadOptionalInvoicingSettings(token, tenantSlug),
      ]);

      startTransition(() => {
        setTaxRates(nextTaxRates);
        setCustomers(nextCustomers);
        setInvoices(nextInvoices);
        setElectronicSandboxReadiness(nextSettings.electronicSandboxReadiness);
        setElectronicSubmissionSettings(nextSettings.electronicSubmissionSettings);
        setElectronicSignatureSettings(nextSettings.electronicSignatureSettings);
        setIssuerProfile(nextSettings.issuerProfile);
        setInvoiceNumberingSettings(nextSettings.invoiceNumberingSettings);
        setInvoicingReport(nextReport);
        const preferredInvoiceId = options?.selectInvoiceId;
        if (
          preferredInvoiceId &&
          nextInvoices.some((invoice) => invoice.id === preferredInvoiceId)
        ) {
          setSelectedInvoiceId(preferredInvoiceId);
          return;
        }

        setSelectedInvoiceId((currentSelection) =>
          nextInvoices.some((invoice) => invoice.id === currentSelection)
            ? currentSelection
            : nextInvoices[0]?.id ?? null,
        );
      });
    } catch (error) {
      setInvoicingError(
        error instanceof Error
          ? error.message
          : 'No se pudo refrescar el workspace de invoicing.',
      );
    } finally {
      setInvoicingLoading(false);
    }
  }

  async function handleTokenSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextToken = tokenInput.trim();
    window.localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    setActionMessage(null);
    setSessionError(null);
    setToken(nextToken);
  }

  function handleTokenReset() {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken('');
    setTokenInput('');
    setSession(null);
    setSelectedPendingInvitationId(null);
    setPendingInvitationDetail(null);
    setSelectedTenantInvitation(null);
    setActionMessage(null);
    setSessionError(null);
  }

  async function handleSelectTenancy(tenantSlug: string | null) {
    if (!token) {
      return;
    }

    setActionLoading(`select:${tenantSlug ?? 'clear'}`);
    setActionMessage(null);

    try {
      const nextSession = await setCurrentTenancy(token, tenantSlug);
      startTransition(() => {
        setSession(nextSession);
      });
      setActionMessage(
        tenantSlug
          ? `Workspace actual actualizado a ${tenantSlug}.`
          : 'Se limpio la preferencia de tenant actual.',
      );
    } catch (error) {
      setSessionError(
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar el tenant actual.',
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCreateInvitation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token || !currentTenancy || !newInvitationEmail.trim()) {
      return;
    }

    setActionLoading('create-invitation');
    setActionMessage(null);

    try {
      const created = await createInvitation(
        token,
        currentTenancy.tenant.slug,
        newInvitationEmail.trim(),
      );
      startTransition(() => {
        setTenantInvitations((currentItems) => [created, ...currentItems]);
        setSelectedTenantInvitation(created);
      });
      setNewInvitationEmail('');
      setActionMessage(`Invitacion creada para ${created.email}.`);
      await refreshSession(currentTenancy.tenant.slug);
    } catch (error) {
      setTenantInvitationsError(
        error instanceof Error
          ? error.message
          : 'No se pudo crear la invitacion.',
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleOpenTenantInvitation(invitationId: string) {
    if (!token || !currentTenancy) {
      return;
    }

    setActionLoading(`detail:${invitationId}`);
    setActionMessage(null);

    try {
      const detail = await getTenantInvitation(
        token,
        currentTenancy.tenant.slug,
        invitationId,
      );
      startTransition(() => {
        setSelectedTenantInvitation(detail);
      });
    } catch (error) {
      setTenantInvitationsError(
        error instanceof Error
          ? error.message
          : 'No se pudo abrir el detalle de la invitacion.',
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleInvitationMutation(
    invitationId: string,
    mode: 'cancel' | 'resend',
  ) {
    if (!token || !currentTenancy) {
      return;
    }

    setActionLoading(`${mode}:${invitationId}`);
    setActionMessage(null);

    try {
      if (mode === 'cancel') {
        await cancelInvitation(token, currentTenancy.tenant.slug, invitationId);
        setActionMessage('Invitacion cancelada.');
      } else {
        const resent = await resendInvitation(
          token,
          currentTenancy.tenant.slug,
          invitationId,
        );
        setActionMessage(`Invitacion reenviada a ${resent.email}.`);
      }

      const updated = await listTenantInvitations(token, currentTenancy.tenant.slug);

      startTransition(() => {
        setTenantInvitations(updated);
        setSelectedTenantInvitation(
          updated.find(({ id }) => id === invitationId) ?? updated[0] ?? null,
        );
      });

      await refreshSession(currentTenancy.tenant.slug);
    } catch (error) {
      setTenantInvitationsError(
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar la invitacion.',
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleAcceptInvitation(invitationId: string) {
    if (!token) {
      return;
    }

    setActionLoading(`accept:${invitationId}`);
    setActionMessage(null);

    try {
      const nextSession = await acceptInvitation(token, invitationId);
      startTransition(() => {
        setSession(nextSession);
        setSelectedPendingInvitationId(
          nextSession.pendingInvitations[0]?.invitation.id ?? null,
        );
      });
      const url = new URL(window.location.href);
      url.searchParams.delete('invitationId');
      window.history.replaceState({}, '', url.toString());
      setDeepLinkedInvitationId(null);
      setActionMessage('Invitacion aceptada y sesion actualizada.');
    } catch (error) {
      setPendingInvitationError(
        error instanceof Error
          ? error.message
          : 'No se pudo aceptar la invitacion.',
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCreateCustomer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token || !currentTenancy || !invoicingEnabled || !newCustomerName.trim()) {
      return;
    }

    setActionLoading('create-customer');
    setInvoicingActionMessage(null);
    setInvoicingError(null);

    try {
      const customer = await createCustomer(token, currentTenancy.tenant.slug, {
        name: newCustomerName.trim(),
        email: newCustomerEmail.trim() || null,
        taxId: newCustomerTaxId.trim() || null,
        identificationType: newCustomerIdentificationType,
        identification: newCustomerTaxId.trim() || null,
        billingAddress: newCustomerBillingAddress.trim() || null,
      });

      setNewCustomerName('');
      setNewCustomerEmail('');
      setNewCustomerTaxId('');
      setNewCustomerIdentificationType('04');
      setNewCustomerBillingAddress('');
      setNewInvoiceCustomerId((currentValue) => currentValue || customer.id);
      setInvoicingActionMessage(`Customer creado: ${customer.name}.`);
      await refreshInvoicingWorkspace();
    } catch (error) {
      setInvoicingError(
        error instanceof Error ? error.message : 'No se pudo crear el customer.',
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleUpsertIssuerProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !token ||
      !currentTenancy ||
      !invoicingEnabled ||
      !issuerLegalName.trim() ||
      !issuerTaxId.trim() ||
      !issuerMatrixAddress.trim() ||
      !issuerEstablishmentAddress.trim()
    ) {
      return;
    }

    setActionLoading('upsert-issuer-profile');
    setInvoicingActionMessage(null);
    setInvoicingError(null);

    try {
      await upsertIssuerProfile(token, currentTenancy.tenant.slug, {
        legalName: issuerLegalName.trim(),
        commercialName: issuerCommercialName.trim() || null,
        taxId: issuerTaxId.trim(),
        environment: issuerEnvironment,
        emissionType: 'normal',
        accountingObligated: issuerAccountingObligated,
        specialTaxpayerCode: issuerSpecialTaxpayerCode.trim() || null,
        rimpeTaxpayerType: issuerRimpeTaxpayerType.trim() || null,
        matrixAddress: issuerMatrixAddress.trim(),
        establishmentAddress: issuerEstablishmentAddress.trim(),
      });

      setInvoicingActionMessage('Perfil fiscal del emisor actualizado.');
      await refreshInvoicingWorkspace();
    } catch (error) {
      setInvoicingError(
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar el perfil fiscal del emisor.',
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleUpsertElectronicSignatureSettings(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !token ||
      !currentTenancy ||
      !invoicingEnabled ||
      !signatureCertificateLabel.trim()
    ) {
      return;
    }

    setActionLoading('upsert-electronic-signature-settings');
    setInvoicingActionMessage(null);
    setInvoicingError(null);

    try {
      await upsertElectronicSignatureSettings(token, currentTenancy.tenant.slug, {
        provider: signatureProvider,
        certificateLabel: signatureCertificateLabel.trim(),
        storageMode: signatureStorageMode,
        certificateFingerprint: signatureCertificateFingerprint.trim() || null,
        pkcs12SecretRef: signaturePkcs12SecretRef.trim() || null,
        privateKeyPasswordSecretRef:
          signaturePasswordSecretRef.trim() || null,
        subjectName: signatureSubjectName.trim() || null,
        isActive: signatureIsActive,
      });

      setInvoicingActionMessage(
        'Configuracion de firma electronica actualizada.',
      );
      await refreshInvoicingWorkspace();
    } catch (error) {
      setInvoicingError(
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar la configuracion de firma electronica.',
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleUpsertElectronicSubmissionSettings(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!token || !currentTenancy || !invoicingEnabled || !submissionTimeoutMs.trim()) {
      return;
    }

    const timeoutMs = Number(submissionTimeoutMs);

    if (!Number.isInteger(timeoutMs) || timeoutMs < 1000) {
      setInvoicingError('El timeout del gateway debe ser un entero mayor o igual a 1000 ms.');
      return;
    }

    setActionLoading('upsert-electronic-submission-settings');
    setInvoicingActionMessage(null);
    setInvoicingError(null);

    try {
      await upsertElectronicSubmissionSettings(
        token,
        currentTenancy.tenant.slug,
        {
          provider: submissionProvider,
          environment: submissionEnvironment,
          transmissionMode: submissionMode,
          receptionUrl: submissionReceptionUrl.trim() || null,
          authorizationUrl: submissionAuthorizationUrl.trim() || null,
          credentialsSecretRef: submissionCredentialsSecretRef.trim() || null,
          timeoutMs,
          isActive: submissionIsActive,
        },
      );

      setInvoicingActionMessage(
        'Configuracion de envio electronico actualizada.',
      );
      await refreshInvoicingWorkspace();
    } catch (error) {
      setInvoicingError(
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar la configuracion de envio electronico.',
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleUpsertInvoiceNumbering(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !token ||
      !currentTenancy ||
      !invoicingEnabled ||
      !numberingDocumentCode.trim() ||
      !numberingEstablishmentCode.trim() ||
      !numberingEmissionPointCode.trim() ||
      !numberingNextSequence.trim()
    ) {
      return;
    }

    const nextSequenceNumber = Number(numberingNextSequence);
    if (!Number.isInteger(nextSequenceNumber) || nextSequenceNumber < 1) {
      setInvoicingError('La siguiente secuencia debe ser un entero mayor a cero.');
      return;
    }

    setActionLoading('upsert-invoice-numbering');
    setInvoicingActionMessage(null);
    setInvoicingError(null);

    try {
      await upsertInvoiceNumberingSettings(token, currentTenancy.tenant.slug, {
        documentCode: numberingDocumentCode.trim(),
        establishmentCode: numberingEstablishmentCode.trim(),
        emissionPointCode: numberingEmissionPointCode.trim(),
        nextSequenceNumber,
      });

      setInvoicingActionMessage('Numeracion Ecuador actualizada.');
      await refreshInvoicingWorkspace();
    } catch (error) {
      setInvoicingError(
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar la numeracion de facturas.',
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCreateInvoice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !token ||
      !currentTenancy ||
      !invoicingEnabled ||
      !newInvoiceCustomerId ||
      !newInvoiceCurrency.trim()
    ) {
      return;
    }

    setActionLoading('create-invoice');
    setInvoicingActionMessage(null);
    setInvoicingError(null);

    try {
      const invoice = await createInvoice(token, currentTenancy.tenant.slug, {
        customerId: newInvoiceCustomerId,
        number: newInvoiceNumber.trim() || undefined,
        currency: newInvoiceCurrency.trim().toUpperCase(),
        status: newInvoiceStatus,
        dueAt: newInvoiceDueAt.trim() || null,
        notes: newInvoiceNotes.trim() || null,
      });

      setNewInvoiceNumber('');
      setNewInvoiceDueAt('');
      setNewInvoiceNotes('');
      setNewInvoiceStatus('draft');
      setSelectedInvoiceId(invoice.id);
      setSelectedInvoiceDetail(invoice);
      setInvoicingActionMessage(`Factura ${invoice.number} creada.`);
      await refreshInvoicingWorkspace({ selectInvoiceId: invoice.id });
    } catch (error) {
      setInvoicingError(
        error instanceof Error ? error.message : 'No se pudo crear la factura.',
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCreateCreditNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !token ||
      !currentTenancy ||
      !invoicingEnabled ||
      !selectedInvoiceDetail ||
      selectedInvoiceDetail.documentCode === '04' ||
      !newCreditNoteReason.trim()
    ) {
      return;
    }

    setActionLoading('create-credit-note');
    setInvoicingActionMessage(null);
    setInvoicingError(null);

    try {
      const creditNote = await createCreditNote(
        token,
        currentTenancy.tenant.slug,
        {
          sourceInvoiceId: selectedInvoiceDetail.id,
          reason: newCreditNoteReason.trim(),
          issuedAt: newCreditNoteIssuedAt.trim() || undefined,
          notes: newCreditNoteNotes.trim() || null,
        },
      );

      setNewCreditNoteReason('Devolucion parcial de la factura origen.');
      setNewCreditNoteIssuedAt('');
      setNewCreditNoteNotes('Nota de credito de prueba.');
      setSelectedInvoiceId(creditNote.invoice.id);
      setInvoicingActionMessage(
        `Nota de credito ${creditNote.invoice.number} creada desde ${selectedInvoiceDetail.number}.`,
      );
      await refreshInvoicingWorkspace({ selectInvoiceId: creditNote.invoice.id });
    } catch (error) {
      setInvoicingError(
        error instanceof Error
          ? error.message
          : 'No se pudo crear la nota de credito.',
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCreateTaxRate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !token ||
      !currentTenancy ||
      !invoicingEnabled ||
      !newTaxRateName.trim() ||
      !newTaxRatePercentage.trim()
    ) {
      return;
    }

    const percentage = Number(newTaxRatePercentage);

    if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) {
      setInvoicingError('La tasa debe estar entre 0 y 100.');
      return;
    }

    setActionLoading('create-tax-rate');
    setInvoicingActionMessage(null);
    setInvoicingError(null);

    try {
      const taxRate = await createTaxRate(token, currentTenancy.tenant.slug, {
        name: newTaxRateName.trim(),
        percentage,
        isActive: true,
      });

      setNewTaxRateName('');
      setNewTaxRatePercentage('');
      setNewItemTaxRateId(taxRate.id);
      setInvoicingActionMessage(`Impuesto creado: ${taxRate.name}.`);
      await refreshInvoicingWorkspace();
    } catch (error) {
      setInvoicingError(
        error instanceof Error
          ? error.message
          : 'No se pudo crear la tasa de impuesto.',
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCreateInvoiceItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !token ||
      !currentTenancy ||
      !invoicingEnabled ||
      !selectedInvoiceDetail ||
      !newItemDescription.trim() ||
      !newItemUnitPriceInCents.trim()
    ) {
      return;
    }

    const quantity = Number(newItemQuantity);
    const unitPriceInCents = Number(newItemUnitPriceInCents);

    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      !Number.isInteger(unitPriceInCents) ||
      unitPriceInCents < 0
    ) {
      setInvoicingError(
        'La cantidad debe ser entera mayor a cero y el precio en centavos no puede ser negativo.',
      );
      return;
    }

    setActionLoading('create-invoice-item');
    setInvoicingActionMessage(null);
    setInvoicingError(null);

    try {
      await createInvoiceItem(
        token,
        currentTenancy.tenant.slug,
        selectedInvoiceDetail.id,
        {
          description: newItemDescription.trim(),
          quantity,
          unitPriceInCents,
          taxRateId: newItemTaxRateId || null,
        },
      );

      setNewItemDescription('');
      setNewItemQuantity('1');
      setNewItemUnitPriceInCents('');
      setNewItemTaxRateId('');
      setInvoicingActionMessage(
        `Linea agregada a la factura ${selectedInvoiceDetail.number}.`,
      );
      await refreshInvoicingWorkspace({ selectInvoiceId: selectedInvoiceDetail.id });
    } catch (error) {
      setInvoicingError(
        error instanceof Error
          ? error.message
          : 'No se pudo crear la linea de factura.',
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleOpenPrintableInvoice() {
    if (!token || !currentTenancy || !selectedInvoiceDetail) {
      return;
    }

    setActionLoading('open-invoice-document');
    setInvoicingActionMessage(null);
    setInvoicingError(null);

    try {
      const html = await fetchInvoiceDocumentHtml(
        token,
        currentTenancy.tenant.slug,
        selectedInvoiceDetail.id,
      );
      const printWindow = window.open('', '_blank', 'noopener,noreferrer');

      if (!printWindow) {
        throw new Error('El navegador bloqueo la ventana de impresion.');
      }

      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();

      setInvoicingActionMessage(
        `Documento imprimible listo para ${selectedInvoiceDetail.number}.`,
      );
    } catch (error) {
      setInvoicingError(
        error instanceof Error
          ? error.message
          : 'No se pudo abrir la version imprimible de la factura.',
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleOpenElectronicRide() {
    if (!token || !currentTenancy || !selectedInvoiceDetail) {
      return;
    }

    setActionLoading('open-invoice-ride');
    setInvoicingActionMessage(null);
    setInvoicingError(null);

    try {
      const html = await fetchInvoiceElectronicRideHtml(
        token,
        currentTenancy.tenant.slug,
        selectedInvoiceDetail.id,
      );
      const printWindow = window.open('', '_blank', 'noopener,noreferrer');

      if (!printWindow) {
        throw new Error('El navegador bloqueo la ventana del RIDE.');
      }

      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();

      setInvoicingActionMessage(
        `RIDE electronico listo para ${selectedInvoiceDetail.number}.`,
      );
    } catch (error) {
      setInvoicingError(
        error instanceof Error
          ? error.message
          : 'No se pudo abrir la version RIDE de la factura.',
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDownloadElectronicRide() {
    if (!token || !currentTenancy || !selectedInvoiceDetail) {
      return;
    }

    setActionLoading('download-invoice-ride');
    setInvoicingActionMessage(null);
    setInvoicingError(null);

    try {
      const result = await downloadInvoiceElectronicRideHtml(
        token,
        currentTenancy.tenant.slug,
        selectedInvoiceDetail.id,
      );

      downloadTextArtifact(
        result.content,
        result.fileName ??
          selectedInvoiceArtifacts?.rideHtmlFileName ??
          `${selectedInvoiceDetail.number}-ride.html`,
        result.contentType ?? 'text/html; charset=utf-8',
      );

      setInvoicingActionMessage(
        `RIDE descargado para ${selectedInvoiceDetail.number}.`,
      );
    } catch (error) {
      setInvoicingError(
        error instanceof Error
          ? error.message
          : 'No se pudo descargar el RIDE electronico.',
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDownloadElectronicXml() {
    if (!token || !currentTenancy || !selectedInvoiceDetail) {
      return;
    }

    setActionLoading('download-invoice-xml');
    setInvoicingActionMessage(null);
    setInvoicingError(null);

    try {
      const result = await downloadInvoiceElectronicXmlPreview(
        token,
        currentTenancy.tenant.slug,
        selectedInvoiceDetail.id,
      );

      downloadTextArtifact(
        result.content,
        result.fileName ??
          selectedInvoiceArtifacts?.xmlFileName ??
          `${selectedInvoiceDetail.number}.xml`,
        result.contentType ?? 'application/xml; charset=utf-8',
      );

      setInvoicingActionMessage(
        `XML descargado para ${selectedInvoiceDetail.number}.`,
      );
    } catch (error) {
      setInvoicingError(
        error instanceof Error
          ? error.message
          : 'No se pudo descargar el XML del comprobante.',
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleSendInvoiceEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token || !currentTenancy || !selectedInvoiceDetail) {
      return;
    }

    setActionLoading('send-invoice-email');
    setInvoicingActionMessage(null);
    setInvoicingError(null);

    try {
      await sendInvoiceEmail(
        token,
        currentTenancy.tenant.slug,
        selectedInvoiceDetail.id,
        {
          recipientEmail: invoiceEmailRecipient.trim() || null,
          message: invoiceEmailMessage.trim() || null,
        },
      );

      setInvoicingActionMessage(
        `Factura ${selectedInvoiceDetail.number} enviada por email.`,
      );
    } catch (error) {
      setInvoicingError(
        error instanceof Error
          ? error.message
          : 'No se pudo enviar la factura por email.',
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleLoadInvoiceXmlPreview() {
    if (!token || !currentTenancy || !selectedInvoiceDetail) {
      return;
    }

    setActionLoading('load-invoice-xml-preview');
    setInvoicingActionMessage(null);
    setInvoicingError(null);

    try {
      const xml = await fetchInvoiceElectronicXmlPreview(
        token,
        currentTenancy.tenant.slug,
        selectedInvoiceDetail.id,
      );

      startTransition(() => {
        setSelectedInvoiceXmlPreview(xml);
      });

      setInvoicingActionMessage(
        `XML preliminar listo para ${selectedInvoiceDetail.number}.`,
      );
    } catch (error) {
      setInvoicingError(
        error instanceof Error
          ? error.message
          : 'No se pudo cargar el XML preliminar de la factura.',
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleUpdateInvoiceStatus(
    nextStatus: 'issued' | 'paid' | 'void',
  ) {
    if (!token || !currentTenancy || !selectedInvoiceDetail) {
      return;
    }

    setActionLoading(`invoice-status:${nextStatus}`);
    setInvoicingActionMessage(null);
    setInvoicingError(null);

    try {
      const updatedDetail = await updateInvoiceStatus(
        token,
        currentTenancy.tenant.slug,
        selectedInvoiceDetail.id,
        nextStatus,
      );

      startTransition(() => {
        setSelectedInvoiceDetail(updatedDetail);
        setSelectedInvoiceId(updatedDetail.id);
      });

      setInvoicingActionMessage(
        `Factura ${updatedDetail.number} actualizada a ${formatInvoiceStatus(
          updatedDetail.status,
        )}.`,
      );
      await refreshInvoicingWorkspace({ selectInvoiceId: updatedDetail.id });
    } catch (error) {
      setInvoicingError(
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar el estado de la factura.',
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleUpdateInvoiceElectronicStatus(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!token || !currentTenancy || !selectedInvoiceDetail) {
      return;
    }

    setActionLoading('invoice-electronic-status');
    setInvoicingActionMessage(null);
    setInvoicingError(null);

    try {
      const updatedDetail = await updateInvoiceElectronicStatus(
        token,
        currentTenancy.tenant.slug,
        selectedInvoiceDetail.id,
        {
          electronicStatus: invoiceElectronicStatus,
          accessKey: invoiceAccessKey.trim() || null,
          authorizationNumber: invoiceAuthorizationNumber.trim() || null,
          authorizedAt: invoiceAuthorizedAt
            ? new Date(invoiceAuthorizedAt).toISOString()
            : null,
          electronicStatusMessage: invoiceElectronicStatusMessage.trim() || null,
        },
      );

      startTransition(() => {
        setSelectedInvoiceDetail(updatedDetail);
        setSelectedInvoiceId(updatedDetail.id);
      });

      setInvoicingActionMessage(
        `Estado electronico actualizado: ${formatElectronicStatus(
          updatedDetail.electronicStatus,
        )}.`,
      );
      await refreshInvoicingWorkspace({ selectInvoiceId: updatedDetail.id });
    } catch (error) {
      setInvoicingError(
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar el estado electronico.',
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleSubmitInvoiceElectronicDocument() {
    if (!token || !currentTenancy || !selectedInvoiceDetail) {
      return;
    }

    setActionLoading('submit-invoice-electronic-document');
    setInvoicingActionMessage(null);
    setInvoicingError(null);

    try {
      const result = await submitInvoiceElectronicDocument(
        token,
        currentTenancy.tenant.slug,
        selectedInvoiceDetail.id,
      );

      setInvoicingActionMessage(
        `Documento firmado y enviado en stub. Referencia: ${
          result.submissionReference ?? 'sin referencia'
        }.`,
      );
      await refreshInvoicingWorkspace({ selectInvoiceId: selectedInvoiceDetail.id });
    } catch (error) {
      setInvoicingError(
        error instanceof Error
          ? error.message
          : 'No se pudo firmar y enviar el comprobante.',
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleSubmitPresignedInvoiceElectronicDocument() {
    if (!token || !currentTenancy || !selectedInvoiceDetail) {
      return;
    }

    setActionLoading('submit-presigned-invoice-electronic-document');
    setInvoicingActionMessage(null);
    setInvoicingError(null);

    try {
      const result = await submitPresignedInvoiceElectronicDocument(
        token,
        currentTenancy.tenant.slug,
        selectedInvoiceDetail.id,
        {
          signedXml: presignedInvoiceXml,
          signerName: presignedInvoiceSignerName || null,
        },
      );

      setInvoicingActionMessage(
        `XML prefirmado enviado. Referencia: ${
          result.submissionReference ?? 'sin referencia'
        }.`,
      );
      setPresignedInvoiceXml('');
      setPresignedInvoiceSignerName('');
      await refreshInvoicingWorkspace({ selectInvoiceId: selectedInvoiceDetail.id });
    } catch (error) {
      setInvoicingError(
        error instanceof Error
          ? error.message
          : 'No se pudo enviar el XML firmado externamente.',
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCheckInvoiceElectronicAuthorization() {
    if (!token || !currentTenancy || !selectedInvoiceDetail) {
      return;
    }

    setActionLoading('check-invoice-electronic-authorization');
    setInvoicingActionMessage(null);
    setInvoicingError(null);

    try {
      const updatedDetail = await checkInvoiceElectronicAuthorization(
        token,
        currentTenancy.tenant.slug,
        selectedInvoiceDetail.id,
      );

      startTransition(() => {
        setSelectedInvoiceDetail(updatedDetail);
        setSelectedInvoiceId(updatedDetail.id);
      });

      setInvoicingActionMessage(
        `Autorizacion consultada: ${formatElectronicStatus(
          updatedDetail.electronicStatus,
        )}.`,
      );
      await refreshInvoicingWorkspace({ selectInvoiceId: updatedDetail.id });
    } catch (error) {
      setInvoicingError(
        error instanceof Error
          ? error.message
          : 'No se pudo consultar la autorizacion del comprobante.',
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCreateInvoicePayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token || !currentTenancy || !selectedInvoiceDetail) {
      return;
    }

    const amountInCents = Number(newPaymentAmountInCents);
    if (!Number.isFinite(amountInCents) || amountInCents <= 0) {
      setInvoicingError('El monto del pago debe ser mayor a cero.');
      return;
    }

    setActionLoading('create-invoice-payment');
    setInvoicingActionMessage(null);
    setInvoicingError(null);

    try {
      await createInvoicePayment(
        token,
        currentTenancy.tenant.slug,
        selectedInvoiceDetail.id,
        {
          amountInCents,
          method: newPaymentMethod,
          reference: newPaymentReference.trim() || null,
          paidAt: newPaymentPaidAt || null,
          notes: newPaymentNotes.trim() || null,
        },
      );

      setNewPaymentAmountInCents('');
      setNewPaymentMethod('transfer');
      setNewPaymentReference('');
      setNewPaymentPaidAt('');
      setNewPaymentNotes('');
      setInvoicingActionMessage(
        `Pago registrado para la factura ${selectedInvoiceDetail.number}.`,
      );
      await refreshInvoicingWorkspace({ selectInvoiceId: selectedInvoiceDetail.id });
    } catch (error) {
      setInvoicingError(
        error instanceof Error
          ? error.message
          : 'No se pudo registrar el pago.',
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReverseInvoicePayment(paymentId: string) {
    if (!token || !currentTenancy || !selectedInvoiceDetail) {
      return;
    }

    setActionLoading(`reverse-payment:${paymentId}`);
    setInvoicingActionMessage(null);
    setInvoicingError(null);

    try {
      await reverseInvoicePayment(
        token,
        currentTenancy.tenant.slug,
        selectedInvoiceDetail.id,
        paymentId,
        {
          reason: paymentReversalReason.trim() || null,
        },
      );

      setPaymentReversalReason('');
      setInvoicingActionMessage(
        `Pago revertido para la factura ${selectedInvoiceDetail.number}.`,
      );
      await refreshInvoicingWorkspace({ selectInvoiceId: selectedInvoiceDetail.id });
    } catch (error) {
      setInvoicingError(
        error instanceof Error
          ? error.message
          : 'No se pudo revertir el pago.',
      );
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className={styles.shell}>
      <div className={styles.backdrop} />

      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <span className={styles.eyebrow}>SaaS Platform / Web Onboarding</span>
            <h1>Primer shell React para sesion, invitaciones y workspace bootstrap</h1>
            <p>{sessionHeadline}</p>
          </div>

          <div className={styles.heroMeta}>
            <div className={styles.metric}>
              <span>API</span>
              <strong>{API_BASE_URL}</strong>
            </div>
            <div className={styles.metric}>
              <span>Plan actual</span>
              <strong>
                {currentPlan
                  ? `${currentPlan.name} · ${formatMoney(
                      currentPlan.priceInCents,
                      currentPlan.currency,
                    )}/${currentPlan.billingCycle}`
                  : session?.currentTenancy
                    ? 'Sin plan resuelto'
                    : 'Sin workspace'}
              </strong>
            </div>
            <div className={styles.metric}>
              <span>Flow recomendado</span>
              <strong>{session ? flowLabel(session.sessionState.recommendedFlow) : 'Sin sesion'}</strong>
            </div>
          </div>
        </section>

        <section className={styles.tokenCard}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.label}>Acceso temporal</span>
              <h2>Conectar un Bearer token</h2>
            </div>
            {token ? (
              <button className={styles.ghostButton} onClick={handleTokenReset} type="button">
                Limpiar sesion local
              </button>
            ) : null}
          </div>

          <form className={styles.tokenForm} onSubmit={handleTokenSubmit}>
            <label className={styles.field}>
              <span>Authorization Bearer</span>
              <textarea
                value={tokenInput}
                onChange={(event) => setTokenInput(event.target.value)}
                placeholder="Pega aqui el JWT que usas para probar /api/auth/me"
                rows={4}
              />
            </label>
            <button
              className={styles.primaryButton}
              disabled={!tokenInput.trim() || sessionLoading}
              type="submit"
            >
              {sessionLoading ? 'Cargando sesion...' : 'Cargar sesion'}
            </button>
          </form>

          {sessionError ? <p className={styles.errorBanner}>{sessionError}</p> : null}
          {actionMessage ? <p className={styles.successBanner}>{actionMessage}</p> : null}
        </section>

        <section className={styles.contentGrid}>
          <article className={styles.panel}>
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.label}>Sesion autenticada</span>
                <h2>Resumen operativo</h2>
              </div>
            </div>

            {!session ? (
              <div className={styles.emptyState}>
                <p>Cuando carguemos la sesion veremos identidad, tenancies y onboarding pendiente.</p>
              </div>
            ) : (
              <>
                <div className={styles.identityBlock}>
                  <div>
                    <span className={styles.muted}>Usuario</span>
                    <strong>{session.email ?? 'Sin email en claims'}</strong>
                  </div>
                  <div>
                    <span className={styles.muted}>Provider</span>
                    <strong>{session.provider ?? 'local'}</strong>
                  </div>
                  <div>
                    <span className={styles.muted}>External auth id</span>
                    <strong>{session.externalAuthId ?? session.id}</strong>
                  </div>
                </div>

                <div className={styles.badgeRow}>
                  <span className={styles.badge}>
                    {session.tenancies.length} tenancies
                  </span>
                  <span className={styles.badge}>
                    {session.pendingInvitations.length} invitaciones pendientes
                  </span>
                  <span className={styles.badge}>
                    {flowLabel(session.sessionState.recommendedFlow)}
                  </span>
                </div>

                <div className={styles.currentWorkspace}>
                  <div className={styles.sectionHeading}>
                    <div>
                      <span className={styles.label}>Workspace actual</span>
                      <h3>
                        {currentTenancy
                          ? currentTenancy.tenant.name
                          : 'Sin tenant seleccionado'}
                      </h3>
                    </div>
                    {currentTenancy ? (
                      <button
                        className={styles.ghostButton}
                        onClick={() => void handleSelectTenancy(null)}
                        type="button"
                      >
                        Limpiar preferencia
                      </button>
                    ) : null}
                  </div>

                  {currentTenancy ? (
                    <>
                      <p className={styles.muted}>
                        {currentTenancy.tenant.slug} · membership{' '}
                        {currentTenancy.membership.status}
                      </p>
                      <div className={styles.tokenList}>
                        {currentTenancy.roleKeys.map((roleKey) => (
                          <span className={styles.tokenPill} key={roleKey}>
                            {roleKey}
                          </span>
                        ))}
                      </div>
                      <div className={styles.planSpotlight}>
                        <div className={styles.planSpotlightHeader}>
                          <div>
                            <span className={styles.label}>Commercial access</span>
                            <h3>
                              {currentPlan?.name ??
                                currentSubscription?.planId ??
                                'Sin plan'}
                            </h3>
                          </div>
                          {currentPlan ? (
                            <span className={styles.planPrice}>
                              {formatMoney(
                                currentPlan.priceInCents,
                                currentPlan.currency,
                              )}
                              /{currentPlan.billingCycle}
                            </span>
                          ) : null}
                        </div>

                        <div className={styles.commercialGrid}>
                          <div className={styles.commercialCard}>
                            <span className={styles.muted}>Subscription status</span>
                            <strong>{currentSubscription?.status ?? 'No registrada'}</strong>
                          </div>
                          <div className={styles.commercialCard}>
                            <span className={styles.muted}>Max users</span>
                            <strong>{maxUsers ?? 'No definido'}</strong>
                          </div>
                          <div className={styles.commercialCard}>
                            <span className={styles.muted}>Storage</span>
                            <strong>
                              {storageLimit !== null
                                ? `${storageLimit} GB`
                                : 'No definido'}
                            </strong>
                          </div>
                          <div className={styles.commercialCard}>
                            <span className={styles.muted}>AI enabled</span>
                            <strong>
                              {aiEnabled === null
                                ? 'No definido'
                                : aiEnabled
                                  ? 'Si'
                                  : 'No'}
                            </strong>
                          </div>
                        </div>

                        <div className={styles.sectionHeading}>
                          <div>
                            <span className={styles.label}>Feature gating</span>
                            <h3>Productos habilitados por el plan</h3>
                          </div>
                        </div>

                        {catalogError ? (
                          <p className={styles.errorBanner}>{catalogError}</p>
                        ) : null}

                        <div className={styles.featureGrid}>
                          {enabledProducts.map((product) => (
                            <article className={styles.featureCard} key={product.id}>
                              <span className={styles.statusPill}>Enabled</span>
                              <strong>{product.name}</strong>
                              <p>{product.description ?? 'Sin descripcion'}</p>
                            </article>
                          ))}
                          {lockedProducts.map((product) => (
                            <article
                              className={`${styles.featureCard} ${styles.featureCardLocked}`}
                              key={product.id}
                            >
                              <span className={styles.statusPill}>Locked</span>
                              <strong>{product.name}</strong>
                              <p>{product.description ?? 'Sin descripcion'}</p>
                            </article>
                          ))}
                        </div>
                        {catalogLoading ? (
                          <p className={styles.muted}>Cargando catalogo comercial...</p>
                        ) : null}
                      </div>
                    </>
                  ) : (
                    <p className={styles.muted}>
                      La sesion todavia no tiene un workspace activo. Podemos
                      resolverlo desde invitaciones o desde el selector de tenant.
                    </p>
                  )}
                </div>

                <div className={styles.sessionStateGrid}>
                  <div className={styles.stateCard}>
                    <span className={styles.muted}>hasTenancies</span>
                    <strong>{String(session.sessionState.hasTenancies)}</strong>
                  </div>
                  <div className={styles.stateCard}>
                    <span className={styles.muted}>hasPendingInvitations</span>
                    <strong>{String(session.sessionState.hasPendingInvitations)}</strong>
                  </div>
                  <div className={styles.stateCard}>
                    <span className={styles.muted}>canSelectTenancy</span>
                    <strong>{String(session.sessionState.canSelectTenancy)}</strong>
                  </div>
                  <div className={styles.stateCard}>
                    <span className={styles.muted}>recommendedFlow</span>
                    <strong>{flowLabel(session.sessionState.recommendedFlow)}</strong>
                  </div>
                </div>
              </>
            )}
          </article>

          <article className={styles.panel}>
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.label}>Onboarding visible</span>
                <h2>Selector de tenant y review de invitaciones</h2>
              </div>
            </div>

            {!session ? (
              <div className={styles.emptyState}>
                <p>Primero necesitamos una sesion para decidir si el usuario entra al workspace, elige tenant o revisa invitaciones.</p>
              </div>
            ) : (
              <>
                <div className={styles.selectorGrid}>
                  {session.tenancies.map((tenancy) => {
                    const isCurrent = tenancy.tenant.id === currentTenancy?.tenant.id;

                    return (
                      <button
                        className={`${styles.selectorCard} ${
                          isCurrent ? styles.selectorCardActive : ''
                        }`}
                        disabled={actionLoading !== null}
                        key={tenancy.tenant.id}
                        onClick={() => void handleSelectTenancy(tenancy.tenant.slug)}
                        type="button"
                      >
                        <span>{tenancy.tenant.name}</span>
                        <small>{tenancy.tenant.slug}</small>
                        <small>{tenancy.permissionKeys.length} permisos</small>
                      </button>
                    );
                  })}
                </div>

                <div className={styles.invitationSection}>
                  <div className={styles.sectionHeading}>
                    <div>
                      <span className={styles.label}>Pending invitations</span>
                      <h3>Invitaciones del invitee</h3>
                    </div>
                  </div>

                  {session.pendingInvitations.length === 0 ? (
                    <div className={styles.emptyState}>
                      <p>No hay invitaciones pendientes para este usuario.</p>
                    </div>
                  ) : (
                    <div className={styles.twoColumn}>
                      <div className={styles.stack}>
                        {session.pendingInvitations.map((pendingItem) => {
                          const isSelected =
                            pendingItem.invitation.id === selectedPendingInvitationId;

                          return (
                            <button
                              className={`${styles.invitationCard} ${
                                isSelected ? styles.invitationCardActive : ''
                              }`}
                              key={pendingItem.invitation.id}
                              onClick={() =>
                                setSelectedPendingInvitationId(
                                  pendingItem.invitation.id,
                                )
                              }
                              type="button"
                            >
                              <span>{pendingItem.tenant.name}</span>
                              <small>{pendingItem.invitation.roleKey}</small>
                              <small>Expira {formatDate(pendingItem.invitation.expiresAt)}</small>
                            </button>
                          );
                        })}
                      </div>

                      <div className={styles.detailCard}>
                        {pendingInvitationLoading ? (
                          <p className={styles.muted}>Cargando detalle de invitacion...</p>
                        ) : pendingInvitationError ? (
                          <p className={styles.errorBanner}>{pendingInvitationError}</p>
                        ) : pendingInvitationDetail && selectedPendingInvitation ? (
                          <>
                            <div className={styles.sectionHeading}>
                              <div>
                                <span className={styles.label}>Invitation review</span>
                                <h3>{pendingInvitationDetail.tenant.name}</h3>
                              </div>
                              <span
                                className={`${styles.statusPill} ${invitationStateTone(
                                  pendingInvitationDetail.invitation.status,
                                )}`}
                              >
                                {pendingInvitationDetail.invitation.status}
                              </span>
                            </div>
                            <p className={styles.muted}>
                              Rol ofrecido: {pendingInvitationDetail.invitation.roleKey}
                            </p>
                            <p className={styles.muted}>
                              Expira {formatDate(pendingInvitationDetail.invitation.expiresAt)}
                            </p>
                            <button
                              className={styles.primaryButton}
                              disabled={
                                !pendingInvitationDetail.canAccept ||
                                actionLoading ===
                                  `accept:${pendingInvitationDetail.invitation.id}`
                              }
                              onClick={() =>
                                void handleAcceptInvitation(
                                  pendingInvitationDetail.invitation.id,
                                )
                              }
                              type="button"
                            >
                              {actionLoading ===
                              `accept:${pendingInvitationDetail.invitation.id}`
                                ? 'Aceptando...'
                                : 'Aceptar invitacion'}
                            </button>
                          </>
                        ) : (
                          <p className={styles.muted}>
                            Selecciona una invitacion para revisar el detalle.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </article>
        </section>

        <section className={styles.adminPanel}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.label}>Tenant admin surface</span>
              <h2>Gestion de invitaciones del workspace actual</h2>
            </div>
          </div>

          {!session ? (
            <div className={styles.emptyState}>
              <p>Con una sesion autenticada podremos inspeccionar el panel admin del tenant.</p>
            </div>
          ) : !currentTenancy ? (
            <div className={styles.emptyState}>
              <p>Selecciona un tenant actual para habilitar la administracion de onboarding.</p>
            </div>
          ) : !canManageInvitations ? (
            <div className={styles.emptyState}>
              <p>
                El tenant actual no expone `tenant.invitations.manage`, asi que este
                usuario ve la experiencia de invitee pero no la consola admin.
              </p>
            </div>
          ) : (
            <div className={styles.twoColumn}>
              <div className={styles.stack}>
                <form className={styles.inlineForm} onSubmit={handleCreateInvitation}>
                  <label className={styles.field}>
                    <span>Invitar por email</span>
                    <input
                      onChange={(event) => setNewInvitationEmail(event.target.value)}
                      placeholder="persona@empresa.com"
                      type="email"
                      value={newInvitationEmail}
                    />
                  </label>
                  <button
                    className={styles.primaryButton}
                    disabled={
                      !newInvitationEmail.trim() ||
                      actionLoading === 'create-invitation'
                    }
                    type="submit"
                  >
                    {actionLoading === 'create-invitation'
                      ? 'Creando...'
                      : 'Crear invitacion'}
                  </button>
                </form>

                {tenantInvitationsError ? (
                  <p className={styles.errorBanner}>{tenantInvitationsError}</p>
                ) : null}

                {tenantInvitationsLoading ? (
                  <p className={styles.muted}>Cargando invitaciones del tenant...</p>
                ) : tenantInvitations.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>Este tenant todavia no tiene invitaciones registradas.</p>
                  </div>
                ) : (
                  tenantInvitations.map((invitation) => (
                    <button
                      className={`${styles.invitationCard} ${
                        invitation.id === selectedTenantInvitation?.id
                          ? styles.invitationCardActive
                          : ''
                      }`}
                      key={invitation.id}
                      onClick={() => void handleOpenTenantInvitation(invitation.id)}
                      type="button"
                    >
                      <span>{invitation.email}</span>
                      <small>{invitation.roleKey}</small>
                      <small>{formatDate(invitation.createdAt)}</small>
                    </button>
                  ))
                )}
              </div>

              <div className={styles.detailCard}>
                {selectedTenantInvitation ? (
                  <>
                    <div className={styles.sectionHeading}>
                      <div>
                        <span className={styles.label}>Invitation detail</span>
                        <h3>{selectedTenantInvitation.email}</h3>
                      </div>
                      <span
                        className={`${styles.statusPill} ${invitationStateTone(
                          selectedTenantInvitation.status,
                        )}`}
                      >
                        {selectedTenantInvitation.status}
                      </span>
                    </div>

                    <div className={styles.detailGrid}>
                      <div>
                        <span className={styles.muted}>Rol</span>
                        <strong>{selectedTenantInvitation.roleKey}</strong>
                      </div>
                      <div>
                        <span className={styles.muted}>Creada</span>
                        <strong>{formatDate(selectedTenantInvitation.createdAt)}</strong>
                      </div>
                      <div>
                        <span className={styles.muted}>Expira</span>
                        <strong>{formatDate(selectedTenantInvitation.expiresAt)}</strong>
                      </div>
                      <div>
                        <span className={styles.muted}>Aceptada</span>
                        <strong>{formatDate(selectedTenantInvitation.acceptedAt)}</strong>
                      </div>
                    </div>

                    <div className={styles.actionRow}>
                      <button
                        className={styles.secondaryButton}
                        disabled={
                          actionLoading === `resend:${selectedTenantInvitation.id}`
                        }
                        onClick={() =>
                          void handleInvitationMutation(
                            selectedTenantInvitation.id,
                            'resend',
                          )
                        }
                        type="button"
                      >
                        {actionLoading === `resend:${selectedTenantInvitation.id}`
                          ? 'Reenviando...'
                          : 'Reenviar'}
                      </button>
                      <button
                        className={styles.dangerButton}
                        disabled={
                          actionLoading === `cancel:${selectedTenantInvitation.id}`
                        }
                        onClick={() =>
                          void handleInvitationMutation(
                            selectedTenantInvitation.id,
                            'cancel',
                          )
                        }
                        type="button"
                      >
                        {actionLoading === `cancel:${selectedTenantInvitation.id}`
                          ? 'Cancelando...'
                          : 'Cancelar'}
                      </button>
                    </div>
                  </>
                ) : (
                  <p className={styles.muted}>
                    Selecciona una invitacion del tenant para revisar o disparar acciones.
                  </p>
                )}
              </div>
            </div>
          )}
        </section>

        <section className={styles.adminPanel}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.label}>Invoicing product domain</span>
              <h2>Customers, invoices y detalle operacional</h2>
            </div>
            {session && currentTenancy && invoicingEnabled ? (
              <button
                className={styles.ghostButton}
                disabled={invoicingLoading || invoiceDetailLoading}
                onClick={() => void refreshInvoicingWorkspace()}
                type="button"
              >
                {invoicingLoading ? 'Refrescando...' : 'Refrescar invoicing'}
              </button>
            ) : null}
          </div>

          {!session ? (
            <div className={styles.emptyState}>
              <p>Primero carguemos la sesion para abrir el workspace de invoicing.</p>
            </div>
          ) : !currentTenancy ? (
            <div className={styles.emptyState}>
              <p>Selecciona un tenant actual para consultar y operar el dominio de invoicing.</p>
            </div>
          ) : !invoicingEnabled ? (
            <div className={styles.emptyState}>
              <p>
                El producto <strong>invoicing</strong> no esta habilitado para este
                tenant segun su acceso efectivo actual.
              </p>
            </div>
          ) : (
            <div className={styles.stack}>
              {invoicingError ? <p className={styles.errorBanner}>{invoicingError}</p> : null}
              {invoicingActionMessage ? (
                <p className={styles.successBanner}>{invoicingActionMessage}</p>
              ) : null}

              <div className={styles.invoiceKpiGrid}>
                <div className={styles.commercialCard}>
                  <span className={styles.muted}>Customers activos</span>
                  <strong>{customers.length}</strong>
                </div>
                <div className={styles.commercialCard}>
                  <span className={styles.muted}>Facturas emitidas</span>
                  <strong>{issuedInvoiceCount}</strong>
                </div>
                <div className={styles.commercialCard}>
                  <span className={styles.muted}>Valor total del portafolio</span>
                  <strong>
                    {formatMoney(invoicePortfolioTotal, invoicePortfolioCurrency)}
                  </strong>
                </div>
                <div className={styles.commercialCard}>
                  <span className={styles.muted}>Siguiente numero sugerido</span>
                  <strong>{nextInvoiceNumberSuggestion}</strong>
                </div>
              </div>

              {invoicingReport ? (
                <div className={styles.stack}>
                  <div className={styles.sectionHeading}>
                    <div>
                      <span className={styles.label}>Reports</span>
                      <h3>Resumen operativo</h3>
                    </div>
                    <small className={styles.muted}>
                      Generado {formatDate(invoicingReport.generatedAt)}
                    </small>
                  </div>

                  <div className={styles.invoiceKpiGrid}>
                    <div className={styles.commercialCard}>
                      <span className={styles.muted}>Customers</span>
                      <strong>{invoicingReport.customerCount}</strong>
                    </div>
                    <div className={styles.commercialCard}>
                      <span className={styles.muted}>Invoices</span>
                      <strong>{invoicingReport.invoiceCount}</strong>
                    </div>
                    <div className={styles.commercialCard}>
                      <span className={styles.muted}>Estados</span>
                      <strong>{invoicingReport.statusBreakdown.length}</strong>
                    </div>
                    <div className={styles.commercialCard}>
                      <span className={styles.muted}>Currencies</span>
                      <strong>{invoicingReport.totalsByCurrency.length}</strong>
                    </div>
                  </div>

                  <div className={styles.twoColumn}>
                    <div className={styles.stack}>
                      <div className={styles.sectionHeading}>
                        <div>
                          <span className={styles.label}>Status mix</span>
                          <h3>Facturas por estado</h3>
                        </div>
                      </div>

                      {invoicingReport.statusBreakdown.map((entry) => (
                        <div className={styles.invoiceItemCard} key={entry.status}>
                          <div className={styles.invoiceCardHeader}>
                            <strong>{formatInvoiceStatus(entry.status)}</strong>
                            <span className={styles.statusPill}>{entry.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className={styles.stack}>
                      <div className={styles.sectionHeading}>
                        <div>
                          <span className={styles.label}>Currency totals</span>
                          <h3>Totales por moneda</h3>
                        </div>
                      </div>

                      {invoicingReport.totalsByCurrency.map((entry) => (
                        <div className={styles.invoiceItemCard} key={entry.currency}>
                          <div className={styles.invoiceCardHeader}>
                            <strong>{entry.currency}</strong>
                            <span className={styles.statusPill}>
                              {formatMoney(entry.totalInCents, entry.currency)}
                            </span>
                          </div>
                          <small>
                            Subtotal:{' '}
                            {formatMoney(entry.subtotalInCents, entry.currency)}
                          </small>
                          <small>
                            Tax: {formatMoney(entry.taxInCents, entry.currency)}
                          </small>
                          <small>
                            Outstanding:{' '}
                            {formatMoney(
                              entry.outstandingTotalInCents,
                              entry.currency,
                            )}
                          </small>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.stack}>
                    <div className={styles.sectionHeading}>
                      <div>
                        <span className={styles.label}>Monthly trend</span>
                        <h3>Totales mensuales</h3>
                      </div>
                    </div>

                    {invoicingReport.monthlyTotals.length === 0 ? (
                      <div className={styles.emptyState}>
                        <p>
                          Todavia no hay actividad suficiente para reportes mensuales.
                        </p>
                      </div>
                    ) : (
                      <div className={styles.stack}>
                        {invoicingReport.monthlyTotals.map((entry) => (
                          <div
                            className={styles.invoiceItemCard}
                            key={`${entry.month}-${entry.currency}`}
                          >
                            <div className={styles.invoiceCardHeader}>
                              <strong>
                                {formatReportMonth(entry.month)} · {entry.currency}
                              </strong>
                              <span className={styles.statusPill}>
                                {entry.invoiceCount} facturas
                              </span>
                            </div>
                            <small>
                              Total: {formatMoney(entry.totalInCents, entry.currency)}
                            </small>
                            <small>
                              Tax: {formatMoney(entry.taxInCents, entry.currency)}
                            </small>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : null}

              <div className={styles.twoColumn}>
                <div className={styles.stack}>
                  <div className={styles.detailCard}>
                    <div className={styles.sectionHeading}>
                      <div>
                        <span className={styles.label}>Electronic issuer</span>
                        <h3>Perfil fiscal del emisor</h3>
                      </div>
                    </div>

                    <form className={styles.stack} onSubmit={handleUpsertIssuerProfile}>
                      <div className={styles.invoiceInlineGrid}>
                        <label className={styles.field}>
                          <span>Razon social</span>
                          <input
                            onChange={(event) => setIssuerLegalName(event.target.value)}
                            placeholder="Mi Empresa S.A."
                            value={issuerLegalName}
                          />
                        </label>
                        <label className={styles.field}>
                          <span>Nombre comercial</span>
                          <input
                            onChange={(event) =>
                              setIssuerCommercialName(event.target.value)
                            }
                            placeholder="Mi Empresa"
                            value={issuerCommercialName}
                          />
                        </label>
                      </div>

                      <div className={styles.invoiceInlineGrid}>
                        <label className={styles.field}>
                          <span>RUC</span>
                          <input
                            maxLength={13}
                            onChange={(event) => setIssuerTaxId(event.target.value)}
                            placeholder="1790012345001"
                            value={issuerTaxId}
                          />
                        </label>
                        <label className={styles.field}>
                          <span>Ambiente</span>
                          <select
                            className={styles.selectField}
                            onChange={(event) =>
                              setIssuerEnvironment(
                                event.target.value === 'production'
                                  ? 'production'
                                  : 'test',
                              )
                            }
                            value={issuerEnvironment}
                          >
                            <option value="test">Pruebas</option>
                            <option value="production">Produccion</option>
                          </select>
                        </label>
                      </div>

                      <div className={styles.invoiceInlineGrid}>
                        <label className={styles.field}>
                          <span>Contribuyente especial</span>
                          <input
                            onChange={(event) =>
                              setIssuerSpecialTaxpayerCode(event.target.value)
                            }
                            placeholder="5368"
                            value={issuerSpecialTaxpayerCode}
                          />
                        </label>
                        <label className={styles.field}>
                          <span>RIMPE</span>
                          <input
                            onChange={(event) =>
                              setIssuerRimpeTaxpayerType(event.target.value)
                            }
                            placeholder="Negocio popular / Emprendedor"
                            value={issuerRimpeTaxpayerType}
                          />
                        </label>
                      </div>

                      <label className={styles.checkboxField}>
                        <input
                          checked={issuerAccountingObligated}
                          onChange={(event) =>
                            setIssuerAccountingObligated(event.target.checked)
                          }
                          type="checkbox"
                        />
                        <span>Obligado a llevar contabilidad</span>
                      </label>

                      <label className={styles.field}>
                        <span>Direccion matriz</span>
                        <input
                          onChange={(event) =>
                            setIssuerMatrixAddress(event.target.value)
                          }
                          placeholder="Av. Principal y Calle Secundaria"
                          value={issuerMatrixAddress}
                        />
                      </label>

                      <label className={styles.field}>
                        <span>Direccion establecimiento</span>
                        <input
                          onChange={(event) =>
                            setIssuerEstablishmentAddress(event.target.value)
                          }
                          placeholder="Sucursal matriz o punto de emision"
                          value={issuerEstablishmentAddress}
                        />
                      </label>

                      <button
                        className={styles.primaryButton}
                        disabled={
                          !issuerLegalName.trim() ||
                          !issuerTaxId.trim() ||
                          !issuerMatrixAddress.trim() ||
                          !issuerEstablishmentAddress.trim() ||
                          actionLoading === 'upsert-issuer-profile'
                        }
                        type="submit"
                      >
                        {actionLoading === 'upsert-issuer-profile'
                          ? 'Guardando perfil...'
                          : 'Guardar perfil fiscal'}
                      </button>
                    </form>
                  </div>

                  <div className={styles.detailCard}>
                    <div className={styles.sectionHeading}>
                      <div>
                        <span className={styles.label}>Ecuador numbering</span>
                        <h3>Serie y secuencial</h3>
                      </div>
                    </div>

                    <form
                      className={styles.stack}
                      onSubmit={handleUpsertInvoiceNumbering}
                    >
                      <div className={styles.invoiceInlineGrid}>
                        <label className={styles.field}>
                          <span>CodDoc</span>
                          <input
                            maxLength={2}
                            onChange={(event) =>
                              setNumberingDocumentCode(event.target.value)
                            }
                            placeholder="01"
                            value={numberingDocumentCode}
                          />
                        </label>
                        <label className={styles.field}>
                          <span>Estab</span>
                          <input
                            maxLength={3}
                            onChange={(event) =>
                              setNumberingEstablishmentCode(event.target.value)
                            }
                            placeholder="001"
                            value={numberingEstablishmentCode}
                          />
                        </label>
                        <label className={styles.field}>
                          <span>PtoEmi</span>
                          <input
                            maxLength={3}
                            onChange={(event) =>
                              setNumberingEmissionPointCode(event.target.value)
                            }
                            placeholder="002"
                            value={numberingEmissionPointCode}
                          />
                        </label>
                      </div>

                      <label className={styles.field}>
                        <span>Siguiente secuencial</span>
                        <input
                          min="1"
                          onChange={(event) =>
                            setNumberingNextSequence(event.target.value)
                          }
                          placeholder="31"
                          type="number"
                          value={numberingNextSequence}
                        />
                      </label>

                      <button
                        className={styles.primaryButton}
                        disabled={
                          !numberingDocumentCode.trim() ||
                          !numberingEstablishmentCode.trim() ||
                          !numberingEmissionPointCode.trim() ||
                          !numberingNextSequence.trim() ||
                          actionLoading === 'upsert-invoice-numbering'
                        }
                        type="submit"
                      >
                        {actionLoading === 'upsert-invoice-numbering'
                          ? 'Guardando numeracion...'
                          : 'Guardar numeracion'}
                      </button>

                      <p className={styles.muted}>
                        {invoiceNumberingSettings
                          ? `Proxima factura sugerida: ${invoiceNumberingSettings.previewNumber}`
                          : 'Si dejas el numero vacio al crear la factura, se usara esta configuracion automaticamente.'}
                      </p>
                    </form>
                  </div>

                  <div className={styles.detailCard}>
                    <div className={styles.sectionHeading}>
                      <div>
                        <span className={styles.label}>Electronic signature</span>
                        <h3>Configuracion de firma</h3>
                      </div>
                    </div>

                    <form
                      className={styles.stack}
                      onSubmit={handleUpsertElectronicSignatureSettings}
                    >
                      <div className={styles.invoiceInlineGrid}>
                        <label className={styles.field}>
                          <span>Provider</span>
                          <select
                            className={styles.selectField}
                            onChange={(event) =>
                              setSignatureProvider(
                                event.target.value === 'xades_pkcs12'
                                  ? 'xades_pkcs12'
                                  : 'stub_local',
                              )
                            }
                            value={signatureProvider}
                          >
                            <option value="stub_local">stub_local</option>
                            <option value="xades_pkcs12">xades_pkcs12</option>
                          </select>
                        </label>
                        <label className={styles.field}>
                          <span>Storage mode</span>
                          <select
                            className={styles.selectField}
                            onChange={(event) =>
                              setSignatureStorageMode(
                                event.target.value === 'secret_ref'
                                  ? 'secret_ref'
                                  : 'stub_inline',
                              )
                            }
                            value={signatureStorageMode}
                          >
                            <option value="stub_inline">stub_inline</option>
                            <option value="secret_ref">secret_ref</option>
                          </select>
                        </label>
                      </div>

                      <div className={styles.invoiceInlineGrid}>
                        <label className={styles.field}>
                          <span>Nombre del certificado</span>
                          <input
                            onChange={(event) =>
                              setSignatureCertificateLabel(event.target.value)
                            }
                            placeholder="TOKEN BCE pruebas / Firma Legal"
                            value={signatureCertificateLabel}
                          />
                        </label>
                        <label className={styles.field}>
                          <span>Subject name</span>
                          <input
                            onChange={(event) =>
                              setSignatureSubjectName(event.target.value)
                            }
                            placeholder="CN=Empresa S.A., O=Empresa"
                            value={signatureSubjectName}
                          />
                        </label>
                      </div>

                      <div className={styles.invoiceInlineGrid}>
                        <label className={styles.field}>
                          <span>Fingerprint</span>
                          <input
                            onChange={(event) =>
                              setSignatureCertificateFingerprint(event.target.value)
                            }
                            placeholder="AA:BB:CC:DD..."
                            value={signatureCertificateFingerprint}
                          />
                        </label>
                        <label className={styles.field}>
                          <span>Estado del material</span>
                          <input
                            disabled
                            value={
                              electronicSignatureSettings?.materialConfigured
                                ? 'Configurado'
                                : 'Incompleto'
                            }
                          />
                        </label>
                      </div>

                      {signatureProvider === 'xades_pkcs12' ? (
                        <div className={styles.invoiceInlineGrid}>
                          <label className={styles.field}>
                            <span>PKCS#12 secret ref</span>
                            <input
                              onChange={(event) =>
                                setSignaturePkcs12SecretRef(event.target.value)
                              }
                              placeholder="vault://ec/signatures/tenant-123/pkcs12"
                              value={signaturePkcs12SecretRef}
                            />
                          </label>
                          <label className={styles.field}>
                            <span>Password secret ref</span>
                            <input
                              onChange={(event) =>
                                setSignaturePasswordSecretRef(event.target.value)
                              }
                              placeholder="vault://ec/signatures/tenant-123/password"
                              value={signaturePasswordSecretRef}
                            />
                          </label>
                        </div>
                      ) : null}

                      <label className={styles.checkboxField}>
                        <input
                          checked={signatureIsActive}
                          onChange={(event) =>
                            setSignatureIsActive(event.target.checked)
                          }
                          type="checkbox"
                        />
                        <span>Firma habilitada para el tenant</span>
                      </label>

                      <button
                        className={styles.primaryButton}
                        disabled={
                          !signatureCertificateLabel.trim() ||
                          actionLoading ===
                            'upsert-electronic-signature-settings'
                        }
                        type="submit"
                      >
                        {actionLoading === 'upsert-electronic-signature-settings'
                          ? 'Guardando firma...'
                          : 'Guardar firma electronica'}
                      </button>

                      <p className={styles.muted}>
                        Esta configuracion separa metadatos visibles del
                        material sensible. Para `xades_pkcs12`, el sistema ya
                        exige referencias al PKCS#12 y su password antes de
                        firmar, aunque el signer siga siendo stub en este
                        branch.
                      </p>
                    </form>
                  </div>

                  <div className={styles.detailCard}>
                    <div className={styles.sectionHeading}>
                      <div>
                        <span className={styles.label}>Electronic submission</span>
                        <h3>Gateway SRI</h3>
                      </div>
                    </div>

                    <form
                      className={styles.stack}
                      onSubmit={handleUpsertElectronicSubmissionSettings}
                    >
                      <div className={styles.invoiceInlineGrid}>
                        <label className={styles.field}>
                          <span>Provider</span>
                          <select
                            className={styles.selectField}
                            onChange={(event) =>
                              setSubmissionProvider(
                                event.target.value === 'sri_offline_ws'
                                  ? 'sri_offline_ws'
                                  : 'stub_sri',
                              )
                            }
                            value={submissionProvider}
                          >
                            <option value="stub_sri">stub_sri</option>
                            <option value="sri_offline_ws">sri_offline_ws</option>
                          </select>
                        </label>
                        <label className={styles.field}>
                          <span>Ambiente</span>
                          <select
                            className={styles.selectField}
                            onChange={(event) =>
                              setSubmissionEnvironment(
                                event.target.value === 'production'
                                  ? 'production'
                                  : 'test',
                              )
                            }
                            value={submissionEnvironment}
                          >
                            <option value="test">Pruebas</option>
                            <option value="production">Produccion</option>
                          </select>
                        </label>
                      </div>

                      <div className={styles.invoiceInlineGrid}>
                        <label className={styles.field}>
                          <span>Modo de transmision</span>
                          <select
                            className={styles.selectField}
                            onChange={(event) =>
                              setSubmissionMode(
                                event.target.value === 'offline'
                                  ? 'offline'
                                  : 'sync_stub',
                              )
                            }
                            value={submissionMode}
                          >
                            <option value="sync_stub">sync_stub</option>
                            <option value="offline">offline</option>
                          </select>
                        </label>
                        <label className={styles.field}>
                          <span>Timeout (ms)</span>
                          <input
                            min="1000"
                            onChange={(event) =>
                              setSubmissionTimeoutMs(event.target.value)
                            }
                            type="number"
                            value={submissionTimeoutMs}
                          />
                        </label>
                      </div>

                      <div className={styles.invoiceInlineGrid}>
                        <label className={styles.field}>
                          <span>Reception URL</span>
                          <input
                            onChange={(event) =>
                              setSubmissionReceptionUrl(event.target.value)
                            }
                            placeholder="https://celcer.sri.gob.ec/..."
                            value={submissionReceptionUrl}
                          />
                        </label>
                        <label className={styles.field}>
                          <span>Authorization URL</span>
                          <input
                            onChange={(event) =>
                              setSubmissionAuthorizationUrl(event.target.value)
                            }
                            placeholder="https://celcer.sri.gob.ec/..."
                            value={submissionAuthorizationUrl}
                          />
                        </label>
                      </div>

                      <div className={styles.invoiceInlineGrid}>
                        <label className={styles.field}>
                          <span>Credentials secret ref</span>
                          <input
                            onChange={(event) =>
                              setSubmissionCredentialsSecretRef(
                                event.target.value,
                              )
                            }
                            placeholder="vault://ec/sri/tenant-123"
                            value={submissionCredentialsSecretRef}
                          />
                        </label>
                        <label className={styles.field}>
                          <span>Gateway readiness</span>
                          <input
                            disabled
                            value={
                              electronicSubmissionSettings?.gatewayConfigured
                                ? 'Configurado'
                                : 'Incompleto'
                            }
                          />
                        </label>
                      </div>

                      <label className={styles.checkboxField}>
                        <input
                          checked={submissionIsActive}
                          onChange={(event) =>
                            setSubmissionIsActive(event.target.checked)
                          }
                          type="checkbox"
                        />
                        <span>Envio electronico habilitado para el tenant</span>
                      </label>

                      <button
                        className={styles.primaryButton}
                        disabled={
                          !submissionTimeoutMs.trim() ||
                          actionLoading ===
                            'upsert-electronic-submission-settings'
                        }
                        type="submit"
                      >
                        {actionLoading === 'upsert-electronic-submission-settings'
                          ? 'Guardando gateway...'
                          : 'Guardar gateway SRI'}
                      </button>

                      <p className={styles.muted}>
                        Este setting prepara la frontera real de recepcion y
                        autorizacion. En `stub_sri` todo queda local; en
                        `sri_offline_ws` ya empezamos a modelar URLs y secretos
                        por tenant sin cambiar el contrato del gateway.
                      </p>

                      {electronicSandboxReadiness ? (
                        <div className={styles.detailCard}>
                          <div className={styles.sectionHeading}>
                            <div>
                              <span className={styles.label}>
                                Sandbox readiness
                              </span>
                              <h3>
                                {electronicSandboxReadiness.isReadyForRemoteSandboxSubmission
                                  ? 'Listo para una prueba controlada'
                                  : 'Todavia bloqueado para sandbox real'}
                              </h3>
                            </div>
                          </div>

                          <div className={styles.invoiceDetailGrid}>
                            <div className={styles.detailCard}>
                              <span className={styles.muted}>Signature provider</span>
                              <strong>
                                {electronicSandboxReadiness.signatureProvider ??
                                  'No configurado'}
                              </strong>
                            </div>
                            <div className={styles.detailCard}>
                              <span className={styles.muted}>Submission path</span>
                              <strong>
                                {electronicSandboxReadiness.submissionProvider ??
                                  'No configurado'}
                              </strong>
                              <small>
                                {electronicSandboxReadiness.transmissionMode ??
                                  'Sin transmission mode'}
                              </small>
                            </div>
                          </div>

                          {electronicSandboxReadiness.blockers.length > 0 ? (
                            <div className={styles.detailCard}>
                              <span className={styles.muted}>Blockers</span>
                              {electronicSandboxReadiness.blockers.map((item) => (
                                <p key={item}>{item}</p>
                              ))}
                            </div>
                          ) : null}

                          {electronicSandboxReadiness.warnings.length > 0 ? (
                            <div className={styles.detailCard}>
                              <span className={styles.muted}>Warnings</span>
                              {electronicSandboxReadiness.warnings.map((item) => (
                                <p key={item}>{item}</p>
                              ))}
                            </div>
                          ) : null}

                          {electronicSandboxReadiness.documentSupport.length > 0 ? (
                            <div className={styles.detailCard}>
                              <span className={styles.muted}>
                                Document support matrix
                              </span>
                              {electronicSandboxReadiness.documentSupport.map(
                                (item) => (
                                  <div
                                    className={styles.detailCard}
                                    key={item.documentCode}
                                  >
                                    <strong>
                                      {item.label} · {item.documentCode}
                                    </strong>
                                    <p>{item.detail}</p>
                                    <div className={styles.invoiceDetailGrid}>
                                      <div className={styles.detailCard}>
                                        <span className={styles.muted}>
                                          Numbering
                                        </span>
                                        <strong>
                                          {item.numberingConfigured
                                            ? 'Configurado'
                                            : 'Pendiente'}
                                        </strong>
                                      </div>
                                      <div className={styles.detailCard}>
                                        <span className={styles.muted}>
                                          Preview XML
                                        </span>
                                        <strong>
                                          {item.previewAvailable ? 'Si' : 'No'}
                                        </strong>
                                      </div>
                                      <div className={styles.detailCard}>
                                        <span className={styles.muted}>RIDE</span>
                                        <strong>
                                          {item.rideAvailable ? 'Si' : 'No'}
                                        </strong>
                                      </div>
                                      <div className={styles.detailCard}>
                                        <span className={styles.muted}>
                                          XSD local
                                        </span>
                                        <strong>
                                          {item.schemaValidationAvailable
                                            ? 'Disponible'
                                            : 'Faltante'}
                                        </strong>
                                      </div>
                                      <div className={styles.detailCard}>
                                        <span className={styles.muted}>
                                          Submit electronico
                                        </span>
                                        <strong>
                                          {item.submitSupported
                                            ? 'Habilitado'
                                            : 'Bloqueado'}
                                        </strong>
                                      </div>
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          ) : null}

                          <p className={styles.muted}>
                            {electronicSandboxReadiness.recommendedNextStep}
                          </p>
                        </div>
                      ) : null}
                    </form>
                  </div>

                  <div className={styles.detailCard}>
                    <div className={styles.sectionHeading}>
                      <div>
                        <span className={styles.label}>Customers</span>
                        <h3>{customers.length} registrados</h3>
                      </div>
                    </div>

                    <form className={styles.stack} onSubmit={handleCreateCustomer}>
                      <label className={styles.field}>
                        <span>Nombre del customer</span>
                        <input
                          onChange={(event) => setNewCustomerName(event.target.value)}
                          placeholder="Acme Corp"
                          value={newCustomerName}
                        />
                      </label>
                      <div className={styles.invoiceInlineGrid}>
                        <label className={styles.field}>
                          <span>Email</span>
                          <input
                            onChange={(event) => setNewCustomerEmail(event.target.value)}
                            placeholder="billing@acme.com"
                            type="email"
                            value={newCustomerEmail}
                          />
                        </label>
                        <label className={styles.field}>
                          <span>Tipo identificacion</span>
                          <select
                            className={styles.selectField}
                            onChange={(event) =>
                              setNewCustomerIdentificationType(
                                event.target.value as '04' | '05' | '06' | '07' | '08',
                              )
                            }
                            value={newCustomerIdentificationType}
                          >
                            <option value="04">04 · RUC</option>
                            <option value="05">05 · Cedula</option>
                            <option value="06">06 · Pasaporte</option>
                            <option value="07">07 · Consumidor final</option>
                            <option value="08">08 · Exterior</option>
                          </select>
                        </label>
                      </div>
                      <div className={styles.invoiceInlineGrid}>
                        <label className={styles.field}>
                          <span>Identificacion</span>
                          <input
                            onChange={(event) => setNewCustomerTaxId(event.target.value)}
                            placeholder={
                              newCustomerIdentificationType === '07'
                                ? '9999999999999'
                                : '0999999999'
                            }
                            value={newCustomerTaxId}
                          />
                        </label>
                        <label className={styles.field}>
                          <span>Direccion</span>
                          <input
                            onChange={(event) =>
                              setNewCustomerBillingAddress(event.target.value)
                            }
                            placeholder="Direccion del comprador"
                            value={newCustomerBillingAddress}
                          />
                        </label>
                      </div>
                      <button
                        className={styles.primaryButton}
                        disabled={
                          !newCustomerName.trim() ||
                          actionLoading === 'create-customer'
                        }
                        type="submit"
                      >
                        {actionLoading === 'create-customer'
                          ? 'Creando customer...'
                          : 'Crear customer'}
                      </button>
                      <p className={styles.muted}>
                        Cada customer queda aislado por tenant y ahora tambien puede guardar la semantica Ecuador del comprador para reutilizarla en multiples facturas.
                      </p>
                    </form>

                    {invoicingLoading ? (
                      <p className={styles.muted}>Cargando customers...</p>
                    ) : customers.length === 0 ? (
                      <div className={styles.emptyState}>
                        <p>Este tenant todavia no tiene customers registrados.</p>
                      </div>
                    ) : (
                      <div className={styles.stack}>
                        {customers.map((customer) => (
                          <div className={styles.invoiceCard} key={customer.id}>
                            <strong>{customer.name}</strong>
                            <span>{customer.email ?? 'Sin email'}</span>
                            <small>
                              {customer.identificationType
                                ? `${formatBuyerIdentificationType(
                                    customer.identificationType,
                                  )}: ${customer.identification ?? 'Sin identificacion'}`
                                : customer.taxId ?? 'Sin tax id'}
                            </small>
                            <small>{customer.billingAddress ?? 'Sin direccion'}</small>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={styles.detailCard}>
                    <div className={styles.sectionHeading}>
                      <div>
                        <span className={styles.label}>Create invoice</span>
                        <h3>Nueva factura</h3>
                      </div>
                    </div>

                    <form className={styles.stack} onSubmit={handleCreateInvoice}>
                      {customers.length === 0 ? (
                        <div className={styles.emptyState}>
                          <p>
                            Primero necesitamos al menos un customer para poder emitir la primera factura.
                          </p>
                        </div>
                      ) : null}

                      <div className={styles.invoiceInlineGrid}>
                        <label className={styles.field}>
                          <span>Customer</span>
                          <select
                            className={styles.selectField}
                            onChange={(event) => setNewInvoiceCustomerId(event.target.value)}
                            value={newInvoiceCustomerId}
                          >
                            <option value="">Selecciona un customer</option>
                            {customers.map((customer) => (
                              <option key={customer.id} value={customer.id}>
                                {customer.name}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className={styles.field}>
                          <span>Numero</span>
                          <input
                            onChange={(event) => setNewInvoiceNumber(event.target.value)}
                            placeholder={nextInvoiceNumberSuggestion}
                            value={newInvoiceNumber}
                          />
                        </label>
                      </div>

                      <div className={styles.invoiceInlineGrid}>
                        <label className={styles.field}>
                          <span>Currency</span>
                          <input
                            maxLength={3}
                            onChange={(event) => setNewInvoiceCurrency(event.target.value)}
                            placeholder="USD"
                            value={newInvoiceCurrency}
                          />
                        </label>
                        <label className={styles.field}>
                          <span>Status</span>
                          <select
                            className={styles.selectField}
                            onChange={(event) => setNewInvoiceStatus(event.target.value)}
                            value={newInvoiceStatus}
                          >
                            <option value="draft">draft</option>
                            <option value="issued">issued</option>
                            <option value="paid">paid</option>
                            <option value="void">void</option>
                          </select>
                        </label>
                      </div>

                      <label className={styles.field}>
                        <span>Due at</span>
                        <input
                          onChange={(event) => setNewInvoiceDueAt(event.target.value)}
                          type="date"
                          value={newInvoiceDueAt}
                        />
                      </label>

                      <label className={styles.field}>
                        <span>Notes</span>
                        <textarea
                          onChange={(event) => setNewInvoiceNotes(event.target.value)}
                          placeholder="Notas opcionales para la factura"
                          value={newInvoiceNotes}
                        />
                      </label>

                      <button
                        className={styles.primaryButton}
                        disabled={
                          customers.length === 0 ||
                          !newInvoiceCustomerId ||
                          !newInvoiceCurrency.trim() ||
                          actionLoading === 'create-invoice'
                        }
                        type="submit"
                      >
                        {actionLoading === 'create-invoice'
                          ? 'Creando factura...'
                          : 'Crear factura'}
                      </button>
                      <p className={styles.muted}>
                        Tip: usa estado <strong>draft</strong> para ir agregando items antes de pasarla a emitida. Si dejas el numero vacio y ya configuraste la numeracion Ecuador, se autogenerara.
                      </p>
                    </form>
                  </div>

                  <div className={styles.detailCard}>
                    <div className={styles.sectionHeading}>
                      <div>
                        <span className={styles.label}>Taxes</span>
                        <h3>{taxRates.length} tasas configuradas</h3>
                      </div>
                    </div>

                    <form className={styles.stack} onSubmit={handleCreateTaxRate}>
                      <div className={styles.invoiceInlineGrid}>
                        <label className={styles.field}>
                          <span>Nombre</span>
                          <input
                            onChange={(event) => setNewTaxRateName(event.target.value)}
                            placeholder="VAT 12%"
                            value={newTaxRateName}
                          />
                        </label>
                        <label className={styles.field}>
                          <span>Porcentaje</span>
                          <input
                            min="0"
                            max="100"
                            step="0.01"
                            onChange={(event) =>
                              setNewTaxRatePercentage(event.target.value)
                            }
                            placeholder="12"
                            type="number"
                            value={newTaxRatePercentage}
                          />
                        </label>
                      </div>

                      <button
                        className={styles.primaryButton}
                        disabled={
                          !newTaxRateName.trim() ||
                          !newTaxRatePercentage.trim() ||
                          actionLoading === 'create-tax-rate'
                        }
                        type="submit"
                      >
                        {actionLoading === 'create-tax-rate'
                          ? 'Creando impuesto...'
                          : 'Crear impuesto'}
                      </button>
                    </form>

                    {taxRates.length === 0 ? (
                      <div className={styles.emptyState}>
                        <p>
                          Todavia no hay tasas configuradas. Puedes seguir sin impuestos o crear la primera ahora mismo.
                        </p>
                      </div>
                    ) : (
                      <div className={styles.stack}>
                        {taxRates.map((taxRate) => (
                          <div className={styles.invoiceCard} key={taxRate.id}>
                            <div className={styles.invoiceCardHeader}>
                              <strong>{taxRate.name}</strong>
                              <span className={styles.statusPill}>
                                {formatPercentage(taxRate.percentage)}%
                              </span>
                            </div>
                            <small>
                              {taxRate.isActive ? 'Activa' : 'Inactiva'}
                            </small>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.stack}>
                  <div className={styles.detailCard}>
                    <div className={styles.sectionHeading}>
                      <div>
                        <span className={styles.label}>Invoices</span>
                        <h3>{invoices.length} facturas</h3>
                      </div>
                    </div>

                    {invoicingLoading ? (
                      <p className={styles.muted}>Cargando invoices...</p>
                    ) : invoices.length === 0 ? (
                      <div className={styles.emptyState}>
                        <p>Este tenant todavia no tiene facturas creadas.</p>
                      </div>
                    ) : (
                      <div className={styles.stack}>
                        {invoices.map((invoice) => (
                          <button
                            className={`${styles.invoiceCard} ${
                              invoice.id === selectedInvoiceSummary?.id
                                ? styles.invoiceCardActive
                                : ''
                            }`}
                            key={invoice.id}
                            onClick={() => setSelectedInvoiceId(invoice.id)}
                            type="button"
                          >
                            <div className={styles.invoiceCardHeader}>
                              <strong>{invoice.number}</strong>
                              <span className={styles.statusPill}>
                                {formatInvoiceStatus(invoice.status)}
                              </span>
                            </div>
                            <span>
                              {invoice.buyerName ??
                                customerNameById.get(invoice.customerId) ??
                                invoice.customerId}
                            </span>
                            <small>
                              {invoice.itemCount} items ·{' '}
                              {formatMoney(
                                invoice.totals.totalInCents,
                                invoice.currency,
                              )}
                            </small>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={styles.detailCard}>
                    <div className={styles.sectionHeading}>
                      <div>
                        <span className={styles.label}>Invoice detail</span>
                        <h3>
                          {selectedInvoiceDetail?.number ??
                            selectedInvoiceSummary?.number ??
                            'Selecciona una factura'}
                        </h3>
                      </div>
                    </div>

                    {invoiceDetailLoading ? (
                      <p className={styles.muted}>Cargando detalle de factura...</p>
                    ) : selectedInvoiceDetail ? (
                      <>
                        <div className={styles.invoiceDetailGrid}>
                          <div>
                            <span className={styles.muted}>Customer</span>
                            <strong>
                              {selectedInvoiceDetail.buyerName ??
                                customerNameById.get(selectedInvoiceDetail.customerId) ??
                                selectedInvoiceDetail.customerId}
                            </strong>
                            <small>
                              {selectedInvoiceDetail.buyerIdentificationType
                                ? `${formatBuyerIdentificationType(
                                    selectedInvoiceDetail.buyerIdentificationType,
                                  )}: ${selectedInvoiceDetail.buyerIdentification ?? 'Sin identificacion'}`
                                : 'Sin identificacion Ecuador'}
                            </small>
                          </div>
                          <div>
                            <span className={styles.muted}>Issued</span>
                            <strong>{formatDate(selectedInvoiceDetail.issuedAt)}</strong>
                          </div>
                          <div>
                            <span className={styles.muted}>Due</span>
                            <strong>{formatDate(selectedInvoiceDetail.dueAt)}</strong>
                          </div>
                          <div>
                            <span className={styles.muted}>Currency</span>
                            <strong>{selectedInvoiceDetail.currency}</strong>
                          </div>
                          <div>
                            <span className={styles.muted}>Estado</span>
                            <strong>
                              {formatInvoiceStatus(selectedInvoiceDetail.status)}
                            </strong>
                          </div>
                          <div>
                            <span className={styles.muted}>Serie Ecuador</span>
                            <strong>
                              {selectedInvoiceDetail.establishmentCode &&
                              selectedInvoiceDetail.emissionPointCode
                                ? `${selectedInvoiceDetail.establishmentCode}-${selectedInvoiceDetail.emissionPointCode}`
                                : 'No configurada'}
                            </strong>
                          </div>
                          <div>
                            <span className={styles.muted}>Secuencial</span>
                            <strong>
                              {selectedInvoiceDetail.sequenceNumber !== null
                                ? String(selectedInvoiceDetail.sequenceNumber).padStart(
                                    9,
                                    '0',
                                  )
                                : 'Manual'}
                            </strong>
                          </div>
                        </div>

                        <div className={styles.actionRow}>
                          {selectedInvoiceDetail.status === 'draft' ? (
                            <button
                              className={styles.secondaryButton}
                              disabled={actionLoading === 'invoice-status:issued'}
                              onClick={() => void handleUpdateInvoiceStatus('issued')}
                              type="button"
                            >
                              {actionLoading === 'invoice-status:issued'
                                ? 'Emitiendo...'
                                : 'Marcar como emitida'}
                            </button>
                          ) : null}

                          {(selectedInvoiceDetail.status === 'issued' ||
                            selectedInvoiceDetail.status === 'partially_paid') ? (
                            <button
                              className={styles.primaryButton}
                              disabled={actionLoading === 'invoice-status:paid'}
                              onClick={() => void handleUpdateInvoiceStatus('paid')}
                              type="button"
                            >
                              {actionLoading === 'invoice-status:paid'
                                ? 'Registrando...'
                                : 'Marcar como pagada'}
                            </button>
                          ) : null}

                          {(selectedInvoiceDetail.status === 'draft' ||
                            selectedInvoiceDetail.status === 'issued') ? (
                            <button
                              className={styles.dangerButton}
                              disabled={actionLoading === 'invoice-status:void'}
                              onClick={() => void handleUpdateInvoiceStatus('void')}
                              type="button"
                            >
                              {actionLoading === 'invoice-status:void'
                                ? 'Anulando...'
                                : 'Anular factura'}
                            </button>
                          ) : null}
                        </div>

                        {selectedInvoiceDetail.documentCode === '04' ? (
                          <div className={styles.detailCard}>
                            <div className={styles.sectionHeading}>
                              <div>
                                <span className={styles.label}>Credit note</span>
                                <h3>Documento modificado</h3>
                              </div>
                            </div>

                            <div className={styles.invoiceDetailGrid}>
                              <div>
                                <span className={styles.muted}>Documento sustento</span>
                                <strong>
                                  {findRideAdditionalInfoValue(
                                    selectedInvoiceRide,
                                    'Documento modificado',
                                  ) ?? 'Disponible en el XML/RIDE'}
                                </strong>
                              </div>
                              <div>
                                <span className={styles.muted}>Motivo</span>
                                <strong>
                                  {findRideAdditionalInfoValue(
                                    selectedInvoiceRide,
                                    'Motivo',
                                  ) ?? 'Disponible en el XML/RIDE'}
                                </strong>
                              </div>
                            </div>
                          </div>
                        ) : null}

                        {selectedInvoiceDetail.documentCode !== '04' ? (
                          <div className={styles.detailCard}>
                            <div className={styles.sectionHeading}>
                              <div>
                                <span className={styles.label}>Credit note</span>
                                <h3>Crear borrador `04` desde esta factura</h3>
                              </div>
                            </div>

                            <form className={styles.stack} onSubmit={handleCreateCreditNote}>
                              <label className={styles.field}>
                                <span>Motivo</span>
                                <textarea
                                  onChange={(event) =>
                                    setNewCreditNoteReason(event.target.value)
                                  }
                                  placeholder="Devolucion parcial de la factura origen."
                                  value={newCreditNoteReason}
                                />
                              </label>

                              <div className={styles.invoiceInlineGrid}>
                                <label className={styles.field}>
                                  <span>Fecha emision</span>
                                  <input
                                    onChange={(event) =>
                                      setNewCreditNoteIssuedAt(event.target.value)
                                    }
                                    type="datetime-local"
                                    value={newCreditNoteIssuedAt}
                                  />
                                </label>
                                <label className={styles.field}>
                                  <span>Notas</span>
                                  <input
                                    onChange={(event) =>
                                      setNewCreditNoteNotes(event.target.value)
                                    }
                                    placeholder="Nota de credito de prueba."
                                    value={newCreditNoteNotes}
                                  />
                                </label>
                              </div>

                              <button
                                className={styles.secondaryButton}
                                disabled={
                                  actionLoading === 'create-credit-note' ||
                                  !newCreditNoteReason.trim()
                                }
                                type="submit"
                              >
                                {actionLoading === 'create-credit-note'
                                  ? 'Creando nota de credito...'
                                  : 'Crear nota de credito'}
                              </button>
                              <p className={styles.muted}>
                                Este flujo crea un borrador `04` con lineas reversadas y numeracion independiente si ya configuraste el carril de nota de credito.
                              </p>
                            </form>
                          </div>
                        ) : null}

                        <div className={styles.invoiceTotalsGrid}>
                          <div className={styles.commercialCard}>
                            <span className={styles.muted}>Estado electronico</span>
                            <strong>
                              {formatElectronicStatus(
                                selectedInvoiceDetail.electronicStatus,
                              )}
                            </strong>
                          </div>
                          <div className={styles.commercialCard}>
                            <span className={styles.muted}>Subtotal</span>
                            <strong>
                              {formatMoney(
                                selectedInvoiceDetail.totals.subtotalInCents,
                                selectedInvoiceDetail.currency,
                              )}
                            </strong>
                          </div>
                          <div className={styles.commercialCard}>
                            <span className={styles.muted}>Tax</span>
                            <strong>
                              {formatMoney(
                                selectedInvoiceDetail.totals.taxInCents,
                                selectedInvoiceDetail.currency,
                              )}
                            </strong>
                          </div>
                          <div className={styles.commercialCard}>
                            <span className={styles.muted}>Grand total</span>
                            <strong>
                              {formatMoney(
                                selectedInvoiceDetail.totals.totalInCents,
                                selectedInvoiceDetail.currency,
                              )}
                            </strong>
                          </div>
                          <div className={styles.commercialCard}>
                            <span className={styles.muted}>Paid</span>
                            <strong>
                              {formatMoney(
                                selectedInvoiceDetail.settlement.paidInCents,
                                selectedInvoiceDetail.currency,
                              )}
                            </strong>
                          </div>
                          <div className={styles.commercialCard}>
                            <span className={styles.muted}>Balance due</span>
                            <strong>
                              {formatMoney(
                                selectedInvoiceDetail.settlement.balanceDueInCents,
                                selectedInvoiceDetail.currency,
                              )}
                            </strong>
                          </div>
                        </div>

                        <div className={styles.detailCard}>
                          <div className={styles.sectionHeading}>
                            <div>
                              <span className={styles.label}>Electronic status</span>
                              <h3>Autorizacion SRI</h3>
                            </div>
                          </div>

                          <form className={styles.stack} onSubmit={handleUpdateInvoiceElectronicStatus}>
                            <div className={styles.invoiceInlineGrid}>
                              <label className={styles.field}>
                                <span>Estado</span>
                                <select
                                  className={styles.selectField}
                                  onChange={(event) =>
                                    setInvoiceElectronicStatus(
                                      event.target.value as
                                        | 'pending_submission'
                                        | 'submitted'
                                        | 'authorized'
                                        | 'rejected',
                                    )
                                  }
                                  value={invoiceElectronicStatus}
                                >
                                  <option value="pending_submission">Pendiente de envio</option>
                                  <option value="submitted">Enviado al SRI</option>
                                  <option value="authorized">Autorizada</option>
                                  <option value="rejected">Rechazada</option>
                                </select>
                              </label>
                              <label className={styles.field}>
                                <span>Fecha autorizacion</span>
                                <input
                                  onChange={(event) =>
                                    setInvoiceAuthorizedAt(event.target.value)
                                  }
                                  type="datetime-local"
                                  value={invoiceAuthorizedAt}
                                />
                              </label>
                            </div>

                            <div className={styles.invoiceInlineGrid}>
                              <label className={styles.field}>
                                <span>Clave de acceso</span>
                                <input
                                  onChange={(event) => setInvoiceAccessKey(event.target.value)}
                                  placeholder="49 digitos"
                                  value={invoiceAccessKey}
                                />
                              </label>
                              <label className={styles.field}>
                                <span>No. autorizacion</span>
                                <input
                                  onChange={(event) =>
                                    setInvoiceAuthorizationNumber(event.target.value)
                                  }
                                  placeholder="Numero de autorizacion SRI"
                                  value={invoiceAuthorizationNumber}
                                />
                              </label>
                            </div>

                            <label className={styles.field}>
                              <span>Mensaje SRI</span>
                              <textarea
                                onChange={(event) =>
                                  setInvoiceElectronicStatusMessage(
                                    event.target.value,
                                  )
                                }
                                placeholder="Detalle tecnico o comercial del estado electronico"
                                value={invoiceElectronicStatusMessage}
                              />
                            </label>

                            <button
                              className={styles.secondaryButton}
                              disabled={
                                actionLoading === 'invoice-electronic-status' ||
                                selectedInvoiceDetail.status === 'draft' ||
                                selectedInvoiceDocumentSupport?.submitSupported ===
                                  false
                              }
                              type="submit"
                            >
                              {actionLoading === 'invoice-electronic-status'
                                ? 'Actualizando...'
                                : 'Actualizar estado electronico'}
                            </button>
                            <button
                              className={styles.ghostButton}
                              disabled={actionLoading === 'load-invoice-xml-preview'}
                              onClick={() => void handleLoadInvoiceXmlPreview()}
                              type="button"
                            >
                              {actionLoading === 'load-invoice-xml-preview'
                                ? 'Cargando XML...'
                                : 'Ver XML preliminar'}
                            </button>
                            <button
                              className={styles.primaryButton}
                              disabled={
                                actionLoading === 'submit-invoice-electronic-document' ||
                                selectedInvoiceDetail.status === 'draft' ||
                                selectedInvoiceDocumentSupport?.submitSupported ===
                                  false
                              }
                              onClick={() =>
                                void handleSubmitInvoiceElectronicDocument()
                              }
                              type="button"
                            >
                              {actionLoading === 'submit-invoice-electronic-document'
                                ? 'Firmando y enviando...'
                                : 'Firmar y enviar (stub)'}
                            </button>
                            <button
                              className={styles.secondaryButton}
                              disabled={
                                actionLoading ===
                                  'check-invoice-electronic-authorization' ||
                                selectedInvoiceDocumentSupport?.submitSupported ===
                                  false ||
                                selectedInvoiceDetail.electronicStatus !==
                                  'submitted'
                              }
                              onClick={() =>
                                void handleCheckInvoiceElectronicAuthorization()
                              }
                              type="button"
                            >
                              {actionLoading ===
                              'check-invoice-electronic-authorization'
                                ? 'Consultando autorizacion...'
                                : 'Consultar autorizacion (stub)'}
                            </button>
                            <p className={styles.muted}>
                              Puedes dejar vacia la clave de acceso para que el backend la genere desde el perfil fiscal y la numeracion Ecuador.
                            </p>
                            {selectedInvoiceDocumentSupport &&
                            !selectedInvoiceDocumentSupport.submitSupported ? (
                              <p className={styles.muted}>
                                {selectedInvoiceDocumentSupport.detail}
                              </p>
                            ) : null}
                          </form>

                          <form
                            className={styles.stack}
                            onSubmit={(event) => {
                              event.preventDefault();
                              void handleSubmitPresignedInvoiceElectronicDocument();
                            }}
                          >
                            <div className={styles.sectionHeading}>
                              <div>
                                <span className={styles.label}>
                                  External signed XML
                                </span>
                                <h3>Puente para sandbox real</h3>
                              </div>
                            </div>

                            <label className={styles.field}>
                              <span>Signer name</span>
                              <input
                                onChange={(event) =>
                                  setPresignedInvoiceSignerName(event.target.value)
                                }
                                placeholder="sandbox-signer o nombre del firmador externo"
                                value={presignedInvoiceSignerName}
                              />
                            </label>

                            <label className={styles.field}>
                              <span>Signed XML</span>
                              <textarea
                                onChange={(event) =>
                                  setPresignedInvoiceXml(event.target.value)
                                }
                                placeholder="<factura ...><ds:Signature>...</ds:Signature></factura>"
                                value={presignedInvoiceXml}
                              />
                            </label>

                            <button
                              className={styles.primaryButton}
                              disabled={
                                actionLoading ===
                                  'submit-presigned-invoice-electronic-document' ||
                                selectedInvoiceDetail.status === 'draft' ||
                                selectedInvoiceDocumentSupport?.submitSupported ===
                                  false ||
                                !presignedInvoiceXml.trim()
                              }
                              type="submit"
                            >
                              {actionLoading ===
                              'submit-presigned-invoice-electronic-document'
                                ? 'Enviando XML firmado...'
                                : 'Enviar XML prefirmado'}
                            </button>

                            <p className={styles.muted}>
                              Este camino sirve para probar SRI sandbox con una
                              firma real generada fuera del sistema, mientras la
                              firma XAdES nativa del repo sigue pendiente.
                            </p>
                            {selectedInvoiceDocumentSupport &&
                            !selectedInvoiceDocumentSupport.submitSupported ? (
                              <p className={styles.muted}>
                                {selectedInvoiceDocumentSupport.detail}
                              </p>
                            ) : null}
                          </form>
                        </div>

                        <div className={styles.invoiceDetailGrid}>
                          <div className={styles.detailCard}>
                            <span className={styles.muted}>Firma</span>
                            <strong>
                              {selectedInvoiceDetail.signedAt
                                ? formatDate(selectedInvoiceDetail.signedAt)
                                : 'Sin firma tecnica'}
                            </strong>
                          </div>
                          <div className={styles.detailCard}>
                            <span className={styles.muted}>Envio SRI</span>
                            <strong>
                              {selectedInvoiceDetail.submittedAt
                                ? formatDate(selectedInvoiceDetail.submittedAt)
                                : 'Sin envio registrado'}
                            </strong>
                            <small>
                              {selectedInvoiceDetail.submissionReference ??
                                'Sin referencia de envio'}
                            </small>
                          </div>
                        </div>

                        {selectedInvoiceDetail.electronicEvents.length > 0 ? (
                          <div className={styles.detailCard}>
                            <div className={styles.sectionHeading}>
                              <div>
                                <span className={styles.label}>Technical trace</span>
                                <h3>Historial tecnico SRI</h3>
                              </div>
                            </div>

                            <div className={styles.stack}>
                              {selectedInvoiceDetail.electronicEvents.map((event) => (
                                <div className={styles.detailCard} key={event.id}>
                                  <span className={styles.muted}>
                                    {event.eventType === 'submission'
                                      ? 'Envio'
                                      : 'Consulta de autorizacion'}
                                  </span>
                                  <strong>
                                    {event.provider} / {event.providerStatus}
                                  </strong>
                                  <small>{formatDate(event.occurredAt)}</small>
                                  <small>{event.message}</small>
                                  <small>
                                    {event.soapAction
                                      ? `SOAP ${event.soapAction}`
                                      : 'Sin SOAP action'}
                                    {event.endpoint ? ` · ${event.endpoint}` : ''}
                                  </small>
                                  {event.submissionReference ? (
                                    <small>
                                      Ref: {event.submissionReference}
                                    </small>
                                  ) : null}
                                  {event.authorizationNumber ? (
                                    <small>
                                      Autorizacion: {event.authorizationNumber}
                                    </small>
                                  ) : null}
                                  {event.requestPayload ? (
                                    <details>
                                      <summary>Request payload</summary>
                                      <pre className={styles.codeBlock}>
                                        {event.requestPayload}
                                      </pre>
                                    </details>
                                  ) : null}
                                  {event.responsePayload ? (
                                    <details>
                                      <summary>Response payload</summary>
                                      <pre className={styles.codeBlock}>
                                        {event.responsePayload}
                                      </pre>
                                    </details>
                                  ) : null}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        {selectedInvoiceDocument ? (
                          <div className={styles.documentPreview}>
                            <div className={styles.sectionHeading}>
                              <div>
                                <span className={styles.label}>Document preview</span>
                                <h3>Factura {selectedInvoiceDocument.invoice.number}</h3>
                              </div>
                              <button
                                className={styles.secondaryButton}
                                disabled={actionLoading === 'open-invoice-document'}
                                onClick={() => void handleOpenPrintableInvoice()}
                                type="button"
                              >
                                {actionLoading === 'open-invoice-document'
                                  ? 'Abriendo...'
                                  : 'Abrir version imprimible'}
                              </button>
                              <button
                                className={styles.ghostButton}
                                disabled={actionLoading === 'open-invoice-ride'}
                                onClick={() => void handleOpenElectronicRide()}
                                type="button"
                              >
                                {actionLoading === 'open-invoice-ride'
                                  ? 'Abriendo RIDE...'
                                  : 'Abrir RIDE electronico'}
                              </button>
                            </div>

                            <div className={styles.invoiceDetailGrid}>
                              <div className={styles.detailCard}>
                                <span className={styles.muted}>Emisor</span>
                                <strong>{selectedInvoiceDocument.issuer.legalName}</strong>
                                <small>
                                  {selectedInvoiceDocument.issuer.taxId
                                    ? `RUC ${selectedInvoiceDocument.issuer.taxId}`
                                    : selectedInvoiceDocument.issuer.tenantSlug}
                                </small>
                              </div>
                              <div className={styles.detailCard}>
                                <span className={styles.muted}>Cliente</span>
                                <strong>{selectedInvoiceDocument.customer.name}</strong>
                                <small>
                                  {selectedInvoiceDocument.customer.identificationType
                                    ? `${formatBuyerIdentificationType(
                                        selectedInvoiceDocument.customer.identificationType,
                                      )}: ${
                                        selectedInvoiceDocument.customer.identification ??
                                        'Sin identificacion'
                                      }`
                                    : selectedInvoiceDocument.customer.taxId ??
                                      selectedInvoiceDocument.customer.email ??
                                      'Sin identificacion fiscal'}
                                </small>
                                <small>
                                  {selectedInvoiceDocument.customer.billingAddress ??
                                    'Sin direccion del comprador'}
                                </small>
                              </div>
                            </div>

                            <div className={styles.invoiceDetailGrid}>
                              <div className={styles.detailCard}>
                                <span className={styles.muted}>Ambiente</span>
                                <strong>
                                  {selectedInvoiceDocument.issuer.environment ??
                                    'No configurado'}
                                </strong>
                                <small>
                                  Emision:{' '}
                                  {selectedInvoiceDocument.issuer.emissionType ??
                                    'No configurada'}
                                </small>
                              </div>
                              <div className={styles.detailCard}>
                                <span className={styles.muted}>Estado electronico</span>
                                <strong>
                                  {formatElectronicStatus(
                                    selectedInvoiceDocument.invoice.electronicStatus,
                                  )}
                                </strong>
                                <small>
                                  {selectedInvoiceDocument.invoice.authorizationNumber ??
                                    selectedInvoiceDocument.invoice.accessKey ??
                                    'Sin autorizacion registrada'}
                                </small>
                              </div>
                              <div className={styles.detailCard}>
                                <span className={styles.muted}>Numeracion</span>
                                <strong>
                                  {selectedInvoiceDocument.invoice.documentCode ??
                                    'Sin codDoc'}{' '}
                                  ·{' '}
                                  {selectedInvoiceDocument.invoice.establishmentCode ??
                                    '---'}
                                  -
                                  {selectedInvoiceDocument.invoice.emissionPointCode ??
                                    '---'}
                                </strong>
                                <small>
                                  Secuencial:{' '}
                                  {selectedInvoiceDocument.invoice.sequenceNumber !==
                                  null
                                    ? String(
                                        selectedInvoiceDocument.invoice.sequenceNumber,
                                      ).padStart(9, '0')
                                    : 'Manual'}
                                </small>
                              </div>
                            </div>

                            <div className={styles.stack}>
                              {selectedInvoiceDocument.lines.map((line) => (
                                <div className={styles.documentLineCard} key={line.id}>
                                  <div className={styles.invoiceCardHeader}>
                                    <strong>
                                      #{line.position} · {line.description}
                                    </strong>
                                    <span className={styles.statusPill}>
                                      {formatMoney(
                                        line.lineTotalInCents,
                                        selectedInvoiceDocument.invoice.currency,
                                      )}
                                    </span>
                                  </div>
                                  <small>
                                    {line.quantity} x{' '}
                                    {formatMoney(
                                      line.unitPriceInCents,
                                      selectedInvoiceDocument.invoice.currency,
                                    )}{' '}
                                    ={' '}
                                    {formatMoney(
                                      line.lineSubtotalInCents,
                                      selectedInvoiceDocument.invoice.currency,
                                    )}
                                  </small>
                                  <small>
                                    Impuesto:{' '}
                                    {line.taxRateName && line.taxRatePercentage !== null
                                      ? `${line.taxRateName} (${formatPercentage(
                                          line.taxRatePercentage,
                                        )}%)`
                                      : 'Sin impuesto'}
                                  </small>
                                  <small>
                                    Tax line:{' '}
                                    {formatMoney(
                                      line.lineTaxInCents,
                                      selectedInvoiceDocument.invoice.currency,
                                    )}
                                  </small>
                                </div>
                              ))}
                            </div>

                            {selectedInvoiceDocument.invoice.notes ? (
                              <div className={styles.detailCard}>
                                <span className={styles.muted}>Notas</span>
                                <strong>{selectedInvoiceDocument.invoice.notes}</strong>
                              </div>
                            ) : null}

                            {canSendInvoiceNotifications ? (
                              <form
                                className={styles.stack}
                                onSubmit={handleSendInvoiceEmail}
                              >
                                <div className={styles.sectionHeading}>
                                  <div>
                                    <span className={styles.label}>Notifications</span>
                                    <h3>Enviar factura por email</h3>
                                  </div>
                                </div>

                                <label className={styles.field}>
                                  <span>Destinatario</span>
                                  <input
                                    onChange={(event) =>
                                      setInvoiceEmailRecipient(event.target.value)
                                    }
                                    placeholder="billing@customer.dev"
                                    type="email"
                                    value={invoiceEmailRecipient}
                                  />
                                </label>

                                <label className={styles.field}>
                                  <span>Mensaje opcional</span>
                                  <textarea
                                    onChange={(event) =>
                                      setInvoiceEmailMessage(event.target.value)
                                    }
                                    placeholder="Te compartimos la factura del periodo."
                                    value={invoiceEmailMessage}
                                  />
                                </label>

                                <button
                                  className={styles.primaryButton}
                                  disabled={actionLoading === 'send-invoice-email'}
                                  type="submit"
                                >
                                  {actionLoading === 'send-invoice-email'
                                    ? 'Enviando...'
                                    : 'Enviar factura'}
                                </button>
                              </form>
                            ) : null}
                          </div>
                        ) : null}

                        {selectedInvoiceXmlPreview ? (
                          <div className={styles.detailCard}>
                            <div className={styles.sectionHeading}>
                              <div>
                                <span className={styles.label}>Electronic XML</span>
                                <h3>Vista previa del comprobante</h3>
                              </div>
                            </div>
                            <pre className={styles.codeBlock}>
                              {selectedInvoiceXmlPreview}
                            </pre>
                            <p className={styles.muted}>
                              Este XML es un preview estructural para validar el modelo Ecuador antes de firma y envio real al SRI.
                            </p>
                          </div>
                        ) : null}

                        {selectedInvoiceRide ? (
                          <div className={styles.documentPreview}>
                            <div className={styles.sectionHeading}>
                              <div>
                                <span className={styles.label}>Electronic RIDE</span>
                                <h3>{selectedInvoiceRide.ride.documentLabel}</h3>
                              </div>
                              <div className={styles.actionRow}>
                                <button
                                  className={styles.ghostButton}
                                  disabled={actionLoading === 'download-invoice-ride'}
                                  onClick={() => void handleDownloadElectronicRide()}
                                  type="button"
                                >
                                  {actionLoading === 'download-invoice-ride'
                                    ? 'Descargando RIDE...'
                                    : 'Descargar RIDE'}
                                </button>
                                <button
                                  className={styles.ghostButton}
                                  disabled={
                                    actionLoading === 'download-invoice-xml' ||
                                    !selectedInvoiceArtifacts?.canDownloadXml
                                  }
                                  onClick={() => void handleDownloadElectronicXml()}
                                  type="button"
                                >
                                  {actionLoading === 'download-invoice-xml'
                                    ? 'Descargando XML...'
                                    : 'Descargar XML'}
                                </button>
                              </div>
                            </div>

                            <div className={styles.invoiceDetailGrid}>
                              <div className={styles.detailCard}>
                                <span className={styles.muted}>Ambiente</span>
                                <strong>{selectedInvoiceRide.ride.environmentLabel}</strong>
                                <small>
                                  Emision {selectedInvoiceRide.ride.emissionTypeLabel}
                                </small>
                              </div>
                              <div className={styles.detailCard}>
                                <span className={styles.muted}>Estado RIDE</span>
                                <strong>
                                  {selectedInvoiceRide.ride.electronicStatusLabel}
                                </strong>
                                <small>
                                  {selectedInvoiceRide.ride.canBePrintedAsAuthorized
                                    ? 'Listo como comprobante autorizado'
                                    : 'Aun referencial o pendiente'}
                                </small>
                              </div>
                            </div>

                            <div className={styles.detailCard}>
                              <span className={styles.muted}>Clave de acceso</span>
                              <pre className={styles.codeBlock}>
                                {selectedInvoiceRide.ride.accessKeyChunks.length > 0
                                  ? selectedInvoiceRide.ride.accessKeyChunks.join(
                                      ' · ',
                                    )
                                  : 'No generada'}
                              </pre>
                            </div>

                            {selectedInvoiceArtifacts ? (
                              <div className={styles.invoiceDetailGrid}>
                                <div className={styles.detailCard}>
                                  <span className={styles.muted}>Archivo RIDE</span>
                                  <strong>
                                    {selectedInvoiceArtifacts.rideHtmlFileName}
                                  </strong>
                                </div>
                                <div className={styles.detailCard}>
                                  <span className={styles.muted}>Archivo XML</span>
                                  <strong>
                                    {selectedInvoiceArtifacts.xmlFileName}
                                  </strong>
                                </div>
                              </div>
                            ) : null}

                            {selectedInvoiceRide.ride.additionalInfoFields.length >
                            0 ? (
                              <div className={styles.stack}>
                                {selectedInvoiceRide.ride.additionalInfoFields.map(
                                  (field) => (
                                    <div className={styles.detailCard} key={field.label}>
                                      <span className={styles.muted}>
                                        {field.label}
                                      </span>
                                      <strong>{field.value}</strong>
                                    </div>
                                  ),
                                )}
                              </div>
                            ) : null}
                          </div>
                        ) : null}

                        <div className={styles.stack}>
                          <div className={styles.sectionHeading}>
                            <div>
                              <span className={styles.label}>Payments</span>
                              <h3>{selectedInvoiceDetail.payments.length} pagos</h3>
                            </div>
                          </div>

                          {selectedInvoiceDetail.payments.length === 0 ? (
                            <div className={styles.emptyState}>
                              <p>Esta factura todavia no tiene pagos registrados.</p>
                            </div>
                          ) : (
                            <div className={styles.stack}>
                              {selectedInvoiceDetail.payments.map((payment) => (
                                <div className={styles.invoiceItemCard} key={payment.id}>
                                  <div className={styles.invoiceCardHeader}>
                                    <strong>{payment.method}</strong>
                                    <span className={styles.statusPill}>
                                      {formatMoney(
                                        payment.amountInCents,
                                        payment.currency,
                                      )}
                                    </span>
                                  </div>
                                  <small>
                                    Estado: {formatPaymentStatus(payment.status)}
                                  </small>
                                  <small>Fecha: {formatDate(payment.paidAt)}</small>
                                  <small>
                                    Referencia: {payment.reference ?? 'Sin referencia'}
                                  </small>
                                  <small>{payment.notes ?? 'Sin notas'}</small>
                                  {payment.reversedAt ? (
                                    <small>
                                      Revertido: {formatDate(payment.reversedAt)}
                                      {payment.reversalReason
                                        ? ` · ${payment.reversalReason}`
                                        : ''}
                                    </small>
                                  ) : null}
                                  {payment.status === 'posted' ? (
                                    <button
                                      className={styles.secondaryButton}
                                      disabled={
                                        actionLoading === `reverse-payment:${payment.id}`
                                      }
                                      onClick={() =>
                                        void handleReverseInvoicePayment(payment.id)
                                      }
                                      type="button"
                                    >
                                      {actionLoading === `reverse-payment:${payment.id}`
                                        ? 'Revirtiendo...'
                                        : 'Revertir pago'}
                                    </button>
                                  ) : null}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <label className={styles.field}>
                          <span>Motivo de reversa</span>
                          <input
                            onChange={(event) =>
                              setPaymentReversalReason(event.target.value)
                            }
                            placeholder="Pago duplicado, error de conciliacion, etc."
                            value={paymentReversalReason}
                          />
                        </label>

                        <form className={styles.stack} onSubmit={handleCreateInvoicePayment}>
                          <div className={styles.sectionHeading}>
                            <div>
                              <span className={styles.label}>Register payment</span>
                              <h3>Nuevo pago</h3>
                            </div>
                          </div>

                          <div className={styles.invoiceInlineGrid}>
                            <label className={styles.field}>
                              <span>Monto (cents)</span>
                              <input
                                min="1"
                                onChange={(event) =>
                                  setNewPaymentAmountInCents(event.target.value)
                                }
                                placeholder="6800"
                                type="number"
                                value={newPaymentAmountInCents}
                              />
                            </label>
                            <label className={styles.field}>
                              <span>Metodo</span>
                              <input
                                onChange={(event) =>
                                  setNewPaymentMethod(event.target.value)
                                }
                                placeholder="transfer"
                                value={newPaymentMethod}
                              />
                            </label>
                          </div>

                          <div className={styles.invoiceInlineGrid}>
                            <label className={styles.field}>
                              <span>Referencia</span>
                              <input
                                onChange={(event) =>
                                  setNewPaymentReference(event.target.value)
                                }
                                placeholder="TRX-001"
                                value={newPaymentReference}
                              />
                            </label>
                            <label className={styles.field}>
                              <span>Fecha de pago</span>
                              <input
                                onChange={(event) => setNewPaymentPaidAt(event.target.value)}
                                type="datetime-local"
                                value={newPaymentPaidAt}
                              />
                            </label>
                          </div>

                          <label className={styles.field}>
                            <span>Notas</span>
                            <textarea
                              onChange={(event) => setNewPaymentNotes(event.target.value)}
                              placeholder="Pago parcial del periodo."
                              value={newPaymentNotes}
                            />
                          </label>

                          <button
                            className={styles.primaryButton}
                            disabled={
                              selectedInvoiceDetail.status === 'draft' ||
                              selectedInvoiceDetail.status === 'void' ||
                              selectedInvoiceDetail.settlement.balanceDueInCents === 0 ||
                              actionLoading === 'create-invoice-payment'
                            }
                            type="submit"
                          >
                            {actionLoading === 'create-invoice-payment'
                              ? 'Registrando pago...'
                              : 'Registrar pago'}
                          </button>
                        </form>

                        <div className={styles.stack}>
                          <div className={styles.sectionHeading}>
                            <div>
                              <span className={styles.label}>Invoice items</span>
                              <h3>{selectedInvoiceDetail.items.length} lineas</h3>
                            </div>
                          </div>

                          {selectedInvoiceDetail.items.length === 0 ? (
                            <div className={styles.emptyState}>
                              <p>Esta factura todavia no tiene items.</p>
                            </div>
                          ) : (
                            <div className={styles.stack}>
                              {selectedInvoiceDetail.items.map((item) => (
                                <div className={styles.invoiceItemCard} key={item.id}>
                                  <div className={styles.invoiceCardHeader}>
                                    <strong>
                                      #{item.position} · {item.description}
                                    </strong>
                                    <span className={styles.statusPill}>
                                      {formatMoney(
                                        item.lineTotalInCents,
                                        selectedInvoiceDetail.currency,
                                      )}
                                    </span>
                                  </div>
                                  <small>
                                    {item.quantity} x{' '}
                                    {formatMoney(
                                      item.unitPriceInCents,
                                      selectedInvoiceDetail.currency,
                                    )}
                                  </small>
                                  <small>
                                    Impuesto:{' '}
                                    {item.taxRateName && item.taxRatePercentage !== null
                                      ? `${item.taxRateName} (${formatPercentage(
                                          item.taxRatePercentage,
                                        )}%)`
                                      : 'Sin impuesto'}
                                  </small>
                                  <small>
                                    Tax line:{' '}
                                    {formatMoney(
                                      item.lineTaxInCents,
                                      selectedInvoiceDetail.currency,
                                    )}
                                  </small>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <form className={styles.stack} onSubmit={handleCreateInvoiceItem}>
                          <div className={styles.sectionHeading}>
                            <div>
                              <span className={styles.label}>Add item</span>
                              <h3>Nueva linea</h3>
                            </div>
                          </div>

                          <label className={styles.field}>
                            <span>Descripcion</span>
                            <input
                              onChange={(event) => setNewItemDescription(event.target.value)}
                              placeholder="Servicio mensual"
                              value={newItemDescription}
                            />
                          </label>

                          <div className={styles.invoiceInlineGrid}>
                            <label className={styles.field}>
                              <span>Quantity</span>
                              <input
                                min="1"
                                onChange={(event) => setNewItemQuantity(event.target.value)}
                                type="number"
                                value={newItemQuantity}
                              />
                            </label>
                            <label className={styles.field}>
                              <span>Unit price (cents)</span>
                              <input
                                min="0"
                                onChange={(event) =>
                                  setNewItemUnitPriceInCents(event.target.value)
                                }
                                placeholder="2500"
                                type="number"
                                value={newItemUnitPriceInCents}
                              />
                            </label>
                          </div>

                          <label className={styles.field}>
                            <span>Impuesto</span>
                            <select
                              className={styles.selectField}
                              onChange={(event) => setNewItemTaxRateId(event.target.value)}
                              value={newItemTaxRateId}
                            >
                              <option value="">Sin impuesto</option>
                              {taxRates
                                .filter((taxRate) => taxRate.isActive)
                                .map((taxRate) => (
                                  <option key={taxRate.id} value={taxRate.id}>
                                    {taxRate.name} ({formatPercentage(taxRate.percentage)}%)
                                  </option>
                                ))}
                            </select>
                          </label>

                          <button
                            className={styles.primaryButton}
                            disabled={
                              !newItemDescription.trim() ||
                              !newItemUnitPriceInCents.trim() ||
                              actionLoading === 'create-invoice-item'
                            }
                            type="submit"
                          >
                            {actionLoading === 'create-invoice-item'
                              ? 'Agregando item...'
                              : 'Agregar item'}
                          </button>
                          <p className={styles.muted}>
                            El backend calcula `lineTotalInCents`, `lineTaxInCents` y reordena la posicion automaticamente.
                          </p>
                        </form>
                      </>
                    ) : (
                      <div className={styles.emptyState}>
                        <p>Selecciona una factura para revisar sus items y totales.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
