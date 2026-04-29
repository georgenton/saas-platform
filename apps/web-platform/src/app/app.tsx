import { FormEvent, startTransition, useEffect, useMemo, useState } from 'react';
import styles from './app.module.css';
import {
  acceptInvitation,
  cancelInvitation,
  createCustomer,
  createInvitation,
  createInvoice,
  createInvoiceItem,
  createInvoicePayment,
  createTaxRate,
  fetchInvitationForInvitee,
  fetchInvoiceDetail,
  fetchInvoiceDocument,
  fetchInvoiceDocumentHtml,
  fetchInvoicingReportSummary,
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
  updateInvoiceStatus,
} from './api';
import {
  AuthenticatedInvitationResponse,
  AuthenticatedSessionResponse,
  CustomerResponse,
  InvoiceDetailResponse,
  InvoiceDocumentResponse,
  InvoicingReportSummaryResponse,
  InvitationResponse,
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
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [selectedInvoiceDetail, setSelectedInvoiceDetail] =
    useState<InvoiceDetailResponse | null>(null);
  const [selectedInvoiceDocument, setSelectedInvoiceDocument] =
    useState<InvoiceDocumentResponse | null>(null);
  const [invoicingReport, setInvoicingReport] =
    useState<InvoicingReportSummaryResponse | null>(null);
  const [invoicingLoading, setInvoicingLoading] = useState(false);
  const [invoiceDetailLoading, setInvoiceDetailLoading] = useState(false);
  const [invoicingError, setInvoicingError] = useState<string | null>(null);
  const [invoicingActionMessage, setInvoicingActionMessage] = useState<
    string | null
  >(null);

  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');
  const [newCustomerTaxId, setNewCustomerTaxId] = useState('');
  const [newInvoiceCustomerId, setNewInvoiceCustomerId] = useState('');
  const [newTaxRateName, setNewTaxRateName] = useState('');
  const [newTaxRatePercentage, setNewTaxRatePercentage] = useState('');
  const [newInvoiceNumber, setNewInvoiceNumber] = useState('');
  const [newInvoiceCurrency, setNewInvoiceCurrency] = useState('USD');
  const [newInvoiceStatus, setNewInvoiceStatus] = useState('draft');
  const [newInvoiceDueAt, setNewInvoiceDueAt] = useState('');
  const [newInvoiceNotes, setNewInvoiceNotes] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('1');
  const [newItemUnitPriceInCents, setNewItemUnitPriceInCents] = useState('');
  const [newItemTaxRateId, setNewItemTaxRateId] = useState('');
  const [newPaymentAmountInCents, setNewPaymentAmountInCents] = useState('');
  const [newPaymentMethod, setNewPaymentMethod] = useState('transfer');
  const [newPaymentReference, setNewPaymentReference] = useState('');
  const [newPaymentPaidAt, setNewPaymentPaidAt] = useState('');
  const [newPaymentNotes, setNewPaymentNotes] = useState('');
  const [paymentReversalReason, setPaymentReversalReason] = useState('');
  const [invoiceEmailRecipient, setInvoiceEmailRecipient] = useState('');
  const [invoiceEmailMessage, setInvoiceEmailMessage] = useState('');

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
    () => `INV-${String(invoices.length + 1).padStart(4, '0')}`,
    [invoices.length],
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

    let cancelled = false;

    async function loadEnabledProducts() {
      try {
        const products = await listTenantEnabledProducts(
          token,
          currentTenancy.tenant.slug,
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
      setInvoicingReport(null);
      setSelectedInvoiceId(null);
      setSelectedInvoiceDetail(null);
      setSelectedInvoiceDocument(null);
      setInvoicingError(null);
      return;
    }

    let cancelled = false;

    async function loadInvoicingWorkspace() {
      setInvoicingLoading(true);
      setInvoicingError(null);

      try {
        const [nextCustomers, nextTaxRates, nextInvoices, nextReport] =
          await Promise.all([
          listCustomers(token, currentTenancy.tenant.slug),
          listTaxRates(token, currentTenancy.tenant.slug),
          listInvoices(token, currentTenancy.tenant.slug),
          fetchInvoicingReportSummary(token, currentTenancy.tenant.slug),
        ]);

        if (cancelled) {
          return;
        }

        startTransition(() => {
          setCustomers(nextCustomers);
          setTaxRates(nextTaxRates);
          setInvoices(nextInvoices);
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
        setInvoicingReport(null);
        setInvoices([]);
        setSelectedInvoiceId(null);
        setSelectedInvoiceDetail(null);
        setSelectedInvoiceDocument(null);
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
      return;
    }

    let cancelled = false;

    async function loadSelectedInvoiceDetail() {
      setInvoiceDetailLoading(true);

      try {
        const [detail, document] = await Promise.all([
          fetchInvoiceDetail(token, currentTenancy.tenant.slug, selectedInvoiceId),
          fetchInvoiceDocument(
            token,
            currentTenancy.tenant.slug,
            selectedInvoiceId,
          ),
        ]);

        if (cancelled) {
          return;
        }

        startTransition(() => {
          setSelectedInvoiceDetail(detail);
          setSelectedInvoiceDocument(document);
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        setSelectedInvoiceDetail(null);
        setSelectedInvoiceDocument(null);
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

    let cancelled = false;

    async function loadPendingInvitationDetail() {
      setPendingInvitationLoading(true);
      setPendingInvitationError(null);

      try {
        const detail = await fetchInvitationForInvitee(
          token,
          selectedPendingInvitationId,
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
    if (!token || !currentTenancy || !canManageInvitations) {
      setTenantInvitations([]);
      setSelectedTenantInvitation(null);
      setTenantInvitationsError(null);
      return;
    }

    let cancelled = false;

    async function loadTenantInvitations() {
      setTenantInvitationsLoading(true);
      setTenantInvitationsError(null);

      try {
        const invitations = await listTenantInvitations(
          token,
          currentTenancy.tenant.slug,
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

    setInvoicingLoading(true);
    setInvoicingError(null);

    try {
      const [nextTaxRates, nextCustomers, nextInvoices, nextReport] =
        await Promise.all([
        listTaxRates(token, currentTenancy.tenant.slug),
        listCustomers(token, currentTenancy.tenant.slug),
        listInvoices(token, currentTenancy.tenant.slug),
        fetchInvoicingReportSummary(token, currentTenancy.tenant.slug),
      ]);

      startTransition(() => {
        setTaxRates(nextTaxRates);
        setCustomers(nextCustomers);
        setInvoices(nextInvoices);
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
      });

      setNewCustomerName('');
      setNewCustomerEmail('');
      setNewCustomerTaxId('');
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

  async function handleCreateInvoice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !token ||
      !currentTenancy ||
      !invoicingEnabled ||
      !newInvoiceCustomerId ||
      !newInvoiceNumber.trim() ||
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
        number: newInvoiceNumber.trim(),
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
                          <span>Tax ID</span>
                          <input
                            onChange={(event) => setNewCustomerTaxId(event.target.value)}
                            placeholder="0999999999"
                            value={newCustomerTaxId}
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
                        Cada customer queda aislado por tenant y despues podra reutilizarse en multiples facturas.
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
                            <small>{customer.taxId ?? 'Sin tax id'}</small>
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
                          !newInvoiceNumber.trim() ||
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
                        Tip: usa estado <strong>draft</strong> para ir agregando items antes de pasarla a emitida.
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
                              {customerNameById.get(invoice.customerId) ?? invoice.customerId}
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
                              {customerNameById.get(selectedInvoiceDetail.customerId) ??
                                selectedInvoiceDetail.customerId}
                            </strong>
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

                        <div className={styles.invoiceTotalsGrid}>
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
                            </div>

                            <div className={styles.invoiceDetailGrid}>
                              <div className={styles.detailCard}>
                                <span className={styles.muted}>Emisor</span>
                                <strong>{selectedInvoiceDocument.issuer.tenantName}</strong>
                                <small>{selectedInvoiceDocument.issuer.tenantSlug}</small>
                              </div>
                              <div className={styles.detailCard}>
                                <span className={styles.muted}>Cliente</span>
                                <strong>{selectedInvoiceDocument.customer.name}</strong>
                                <small>
                                  {selectedInvoiceDocument.customer.taxId ??
                                    selectedInvoiceDocument.customer.email ??
                                    'Sin identificacion fiscal'}
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
