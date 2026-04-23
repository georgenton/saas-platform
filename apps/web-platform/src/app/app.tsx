import { FormEvent, startTransition, useEffect, useMemo, useState } from 'react';
import styles from './app.module.css';
import {
  acceptInvitation,
  cancelInvitation,
  createInvitation,
  fetchInvitationForInvitee,
  fetchSession,
  getTenantInvitation,
  listPlans,
  listProducts,
  listTenantInvitations,
  resendInvitation,
  setCurrentTenancy,
} from './api';
import {
  AuthenticatedInvitationResponse,
  AuthenticatedSessionResponse,
  InvitationResponse,
  PlatformPlan,
  PlatformProduct,
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
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);

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
    () => new Set(getStringArrayEntitlement(currentEntitlements, 'products')),
    [currentEntitlements],
  );

  const enabledProducts = useMemo(
    () =>
      productCatalog.filter((product) => enabledProductKeys.has(product.key)),
    [enabledProductKeys, productCatalog],
  );

  const lockedProducts = useMemo(
    () =>
      productCatalog.filter(
        (product) => product.isActive && !enabledProductKeys.has(product.key),
      ),
    [enabledProductKeys, productCatalog],
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
                                  ? 'Yes'
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
      </main>
    </div>
  );
}

export default App;
