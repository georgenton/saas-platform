import styles from './app.module.css';
import {
  AiAgentCatalogResponse,
  AiApprovalPolicyResponse,
  AiApprovalRequestResponse,
  AiOperatingModelAgentResponse,
  AiSuggestionEnvelopeResponse,
  AiSuggestionRunDetailResponse,
  AiSuggestionRunResponse,
  EcommerceLaunchPlanDetailResponse,
  EcommerceLaunchPlanRegistryResponse,
  EcommerceLaunchWorkspaceResponse,
  RequestEcommerceLaunchPlanActivationReadinessResponse,
} from './types';

type Props = {
  hasSession: boolean;
  hasCurrentTenancy: boolean;
  canReadTenantEntitlements: boolean;
  tenantAiEcommerceLaunchWorkspaceLoading: boolean;
  tenantAiEcommerceLaunchWorkspace: EcommerceLaunchWorkspaceResponse | null;
  tenantEcommerceLaunchPlanRegistry: EcommerceLaunchPlanRegistryResponse | null;
  selectedTenantEcommerceLaunchPlanDetail: EcommerceLaunchPlanDetailResponse | null;
  tenantEcommerceLaunchPlanDetailLoading: boolean;
  lastEcommerceLaunchActivationReadiness:
    | RequestEcommerceLaunchPlanActivationReadinessResponse
    | null;
  ecommerceLaunchPlanActionLoading: boolean;
  ecommerceLaunchError: string | null;
  ecommerceLaunchActionMessage: string | null;
  ecommerceLaunchAssistantAiEnvelope: AiSuggestionEnvelopeResponse | null;
  activeEcommerceAiAgent: AiAgentCatalogResponse | null;
  activeEcommerceAiPrimarySurface:
    | AiOperatingModelAgentResponse['primarySurface']
    | null;
  activeEcommerceAiPromptPack: AiOperatingModelAgentResponse['promptPack'] | null;
  activeEcommerceAiApprovalPolicies: AiApprovalPolicyResponse[];
  activeEcommerceAiToolAccess: AiOperatingModelAgentResponse['toolAccess'];
  activeEcommerceAiSuggestionRuns: AiSuggestionRunResponse[];
  selectedEcommerceAiSuggestionRunDetail: AiSuggestionRunDetailResponse | null;
  ecommerceLaunchAssistantAiApprovalRequests: AiApprovalRequestResponse[];
  latestApprovedEcommerceAiApprovalRequest: AiApprovalRequestResponse | null;
  actionLoading: string | null;
  ecommerceAgentActionLoadingState: string | null;
  formatDate: (value: string | null) => string;
  humanizeKey: (value: string | null) => string;
  operationalStatusTone: (
    status: 'healthy' | 'warning' | 'critical',
  ) => string;
  operationalStatusLabel: (
    status: 'healthy' | 'warning' | 'critical',
  ) => string;
  aiAgentAvailabilityTone: (
    availability: AiAgentCatalogResponse['availability'],
  ) => string;
  aiAgentAvailabilityLabel: (
    availability: AiAgentCatalogResponse['availability'],
  ) => string;
  getDedicatedActionKey: (
    action: 'load_detail' | 'request_approval' | 'review_approval',
    targetId: string,
  ) => string;
  onRefresh: () => void;
  onSelectLaunchPlan: (launchPlanId: string) => void;
  onRequestActivationReadiness: () => void;
  onPrepare: () => void;
  onOpenDetail: (runId: string) => void;
  onRequestApproval: (runId: string) => void;
  onReviewApproval: (
    requestId: string,
    status: 'approved' | 'rejected',
  ) => void;
};

const ECOMMERCE_AGENT_KEY = 'ecommerce-launch-assistant';

export function AiEcommerceLaunchSection({
  hasSession,
  hasCurrentTenancy,
  canReadTenantEntitlements,
  tenantAiEcommerceLaunchWorkspaceLoading,
  tenantAiEcommerceLaunchWorkspace,
  tenantEcommerceLaunchPlanRegistry,
  selectedTenantEcommerceLaunchPlanDetail,
  tenantEcommerceLaunchPlanDetailLoading,
  lastEcommerceLaunchActivationReadiness,
  ecommerceLaunchPlanActionLoading,
  ecommerceLaunchError,
  ecommerceLaunchActionMessage,
  ecommerceLaunchAssistantAiEnvelope,
  activeEcommerceAiAgent,
  activeEcommerceAiPrimarySurface,
  activeEcommerceAiPromptPack,
  activeEcommerceAiApprovalPolicies,
  activeEcommerceAiToolAccess,
  activeEcommerceAiSuggestionRuns,
  selectedEcommerceAiSuggestionRunDetail,
  ecommerceLaunchAssistantAiApprovalRequests,
  latestApprovedEcommerceAiApprovalRequest,
  actionLoading,
  ecommerceAgentActionLoadingState,
  formatDate,
  humanizeKey,
  operationalStatusTone,
  operationalStatusLabel,
  aiAgentAvailabilityTone,
  aiAgentAvailabilityLabel,
  getDedicatedActionKey,
  onRefresh,
  onSelectLaunchPlan,
  onRequestActivationReadiness,
  onPrepare,
  onOpenDetail,
  onRequestApproval,
  onReviewApproval,
}: Props) {
  return (
    <section className={styles.adminPanel}>
      <div className={styles.sectionHeading}>
        <div>
          <span className={styles.label}>AI ecommerce launch</span>
          <h2>Surface determinística para preparar el primer launch</h2>
        </div>
        {hasSession && hasCurrentTenancy && canReadTenantEntitlements ? (
          <button
            className={styles.ghostButton}
            disabled={tenantAiEcommerceLaunchWorkspaceLoading}
            onClick={onRefresh}
            type="button"
          >
            {tenantAiEcommerceLaunchWorkspaceLoading
              ? 'Refrescando ecommerce AI...'
              : 'Refrescar ecommerce AI'}
          </button>
        ) : null}
      </div>

      {!hasSession ? (
        <div className={styles.emptyState}>
          <p>Primero carguemos la sesión para abrir el workspace AI de ecommerce.</p>
        </div>
      ) : !hasCurrentTenancy ? (
        <div className={styles.emptyState}>
          <p>Selecciona un tenant actual para revisar el launch workspace de ecommerce.</p>
        </div>
      ) : !canReadTenantEntitlements ? (
        <div className={styles.emptyState}>
          <p>
            Este tenant no expone <code>tenant.entitlements.read</code>, así que
            todavía no podemos abrir la superficie AI de ecommerce.
          </p>
        </div>
      ) : (
        <div className={styles.stack}>
          {ecommerceLaunchError ? (
            <p className={styles.errorBanner}>{ecommerceLaunchError}</p>
          ) : null}
          {ecommerceLaunchActionMessage ? (
            <p className={styles.successBanner}>{ecommerceLaunchActionMessage}</p>
          ) : null}

          <div className={styles.twoColumn}>
            <div className={styles.detailCard}>
              <div className={styles.sectionHeading}>
                <div>
                  <span className={styles.label}>Launch workspace</span>
                  <h3>Base real para catálogo, landing y campaña</h3>
                </div>
                <span
                  className={`${styles.statusPill} ${operationalStatusTone(
                    tenantAiEcommerceLaunchWorkspace?.summary.tone ?? 'healthy',
                  )}`}
                >
                  {tenantAiEcommerceLaunchWorkspace
                    ? operationalStatusLabel(
                        tenantAiEcommerceLaunchWorkspace.summary.tone,
                      )
                    : 'sin workspace'}
                </span>
              </div>

              {tenantAiEcommerceLaunchWorkspace ? (
                <div className={styles.stack}>
                  <p>{tenantAiEcommerceLaunchWorkspace.summary.headline}</p>
                  <small>{tenantAiEcommerceLaunchWorkspace.summary.detail}</small>
                  <small>
                    Focus sugerido:{' '}
                    {tenantAiEcommerceLaunchWorkspace.summary.suggestedFocus}
                  </small>

                  <div className={styles.invoiceKpiGrid}>
                    <div className={styles.commercialCard}>
                      <span className={styles.muted}>Readiness</span>
                      <strong>
                        {humanizeKey(
                          tenantAiEcommerceLaunchWorkspace.summary.launchReadiness,
                        )}
                      </strong>
                      <small>Estado base del launch actual.</small>
                    </div>
                    <div className={styles.commercialCard}>
                      <span className={styles.muted}>Producto</span>
                      <strong>
                        {tenantAiEcommerceLaunchWorkspace.moduleSnapshot.productEnabled
                          ? 'Activo'
                          : 'Inactivo'}
                      </strong>
                      <small>Si ecommerce ya está habilitado para el tenant.</small>
                    </div>
                    <div className={styles.commercialCard}>
                      <span className={styles.muted}>Módulos activos</span>
                      <strong>
                        {
                          tenantAiEcommerceLaunchWorkspace.moduleSnapshot
                            .activeModuleCount
                        }
                      </strong>
                      <small>Base disponible para el primer brief.</small>
                    </div>
                    <div className={styles.commercialCard}>
                      <span className={styles.muted}>Inactivos</span>
                      <strong>
                        {
                          tenantAiEcommerceLaunchWorkspace.moduleSnapshot
                            .inactiveModuleKeys.length
                        }
                      </strong>
                      <small>Piezas que conviene dejar fuera del scope inicial.</small>
                    </div>
                  </div>

                  <div className={styles.stack}>
                    <div className={styles.sectionHeading}>
                      <div>
                        <span className={styles.label}>Checklist</span>
                        <h3>Módulos y postura del launch</h3>
                      </div>
                    </div>
                    {tenantAiEcommerceLaunchWorkspace.checklist.map((entry) => (
                      <div
                        className={styles.invoiceItemCard}
                        key={`ecommerce-launch-check:${entry.key}`}
                      >
                        <div className={styles.invoiceCardHeader}>
                          <strong>{entry.label}</strong>
                          <span
                            className={`${styles.statusPill} ${operationalStatusTone(
                              entry.status === 'blocked'
                                ? 'critical'
                                : entry.status === 'warning'
                                  ? 'warning'
                                  : 'healthy',
                            )}`}
                          >
                            {entry.status}
                          </span>
                        </div>
                        <small>
                          {entry.isCore ? 'Core' : 'Optional'} · {entry.detail}
                        </small>
                      </div>
                    ))}
                  </div>

                  <div className={styles.stack}>
                    <div className={styles.sectionHeading}>
                      <div>
                        <span className={styles.label}>Launch lanes</span>
                        <h3>Cómo bajar el brief sin inventar estructura</h3>
                      </div>
                    </div>
                    {tenantAiEcommerceLaunchWorkspace.channelGuidance.map((entry) => (
                      <div
                        className={styles.assistCueCard}
                        key={`ecommerce-launch-lane:${entry.key}`}
                      >
                        <div className={styles.invoiceCardHeader}>
                          <strong>{entry.title}</strong>
                          <span
                            className={`${styles.statusPill} ${operationalStatusTone(
                              entry.status === 'blocked'
                                ? 'critical'
                                : entry.status === 'warning'
                                  ? 'warning'
                                  : 'healthy',
                            )}`}
                          >
                            {entry.status}
                          </span>
                        </div>
                        <small>{entry.detail}</small>
                        <small>Uso recomendado: {entry.recommendedUse}</small>
                      </div>
                    ))}
                  </div>

                  <div className={styles.stack}>
                    <div className={styles.sectionHeading}>
                      <div>
                        <span className={styles.label}>Launch plans</span>
                        <h3>Targets concretos para approval y shadow review</h3>
                      </div>
                    </div>
                    {tenantEcommerceLaunchPlanRegistry ? (
                      <div className={styles.invoiceKpiGrid}>
                        <div className={styles.commercialCard}>
                          <span className={styles.muted}>Total</span>
                          <strong>{tenantEcommerceLaunchPlanRegistry.counts.totalPlans}</strong>
                          <small>Launch plans visibles para este tenant.</small>
                        </div>
                        <div className={styles.commercialCard}>
                          <span className={styles.muted}>Shadow review ready</span>
                          <strong>
                            {
                              tenantEcommerceLaunchPlanRegistry.counts
                                .shadowReviewReadyPlans
                            }
                          </strong>
                          <small>Planes que ya pueden entrar al piloto auditado.</small>
                        </div>
                        <div className={styles.commercialCard}>
                          <span className={styles.muted}>Blocked</span>
                          <strong>
                            {tenantEcommerceLaunchPlanRegistry.counts.blockedPlans}
                          </strong>
                          <small>Planes que siguen frenados por activación o core.</small>
                        </div>
                      </div>
                    ) : null}
                    {(tenantEcommerceLaunchPlanRegistry?.plans ??
                      tenantAiEcommerceLaunchWorkspace.launchPlans
                    ).map((entry) => (
                      <button
                        className={styles.assistCueCard}
                        key={`ecommerce-launch-plan:${entry.id}`}
                        onClick={() => onSelectLaunchPlan(entry.id)}
                        type="button"
                      >
                        <div className={styles.invoiceCardHeader}>
                          <strong>{entry.title}</strong>
                          <span
                            className={`${styles.statusPill} ${operationalStatusTone(
                              entry.status === 'blocked'
                                ? 'critical'
                                : entry.status === 'warning'
                                  ? 'warning'
                                  : 'healthy',
                            )}`}
                          >
                            {humanizeKey(entry.status)}
                          </span>
                        </div>
                        <small>{entry.scopeSummary}</small>
                        <small>
                          Guarded execution {humanizeKey(entry.guardedExecutionReadiness)}{' '}
                          · channels {entry.selectedChannels.join(', ')}
                        </small>
                        <small>{entry.nextStep}</small>
                        <small className={styles.muted}>
                          {selectedTenantEcommerceLaunchPlanDetail?.plan.id === entry.id
                            ? 'Detalle cargado abajo'
                            : 'Haz clic para abrir detalle'}
                        </small>
                      </button>
                    ))}

                    {tenantEcommerceLaunchPlanDetailLoading ? (
                      <small className={styles.muted}>
                        Cargando detalle del launch plan...
                      </small>
                    ) : selectedTenantEcommerceLaunchPlanDetail ? (
                      <div className={styles.detailCard}>
                        <div className={styles.sectionHeading}>
                          <div>
                            <span className={styles.label}>Launch plan detail</span>
                            <h3>{selectedTenantEcommerceLaunchPlanDetail.plan.title}</h3>
                          </div>
                          <span
                            className={`${styles.statusPill} ${operationalStatusTone(
                              selectedTenantEcommerceLaunchPlanDetail.plan.status ===
                                'blocked'
                                ? 'critical'
                                : selectedTenantEcommerceLaunchPlanDetail.plan
                                      .status === 'warning'
                                  ? 'warning'
                                  : 'healthy',
                            )}`}
                          >
                            {humanizeKey(
                              selectedTenantEcommerceLaunchPlanDetail.plan.status,
                            )}
                          </span>
                        </div>
                        <small>
                          {selectedTenantEcommerceLaunchPlanDetail.plan.scopeSummary}
                        </small>
                        <small>
                          Workspace: {
                            selectedTenantEcommerceLaunchPlanDetail.workspaceSummary
                              .headline
                          }
                        </small>
                        <div className={styles.badgeRow}>
                          {selectedTenantEcommerceLaunchPlanDetail.plan.selectedChannels.map(
                            (entry) => (
                              <span
                                className={styles.badge}
                                key={`ecommerce-launch-plan-channel:${entry}`}
                              >
                                {humanizeKey(entry)}
                              </span>
                            ),
                          )}
                        </div>
                        <button
                          className={styles.secondaryButton}
                          disabled={ecommerceLaunchPlanActionLoading}
                          onClick={onRequestActivationReadiness}
                          type="button"
                        >
                          {ecommerceLaunchPlanActionLoading
                            ? 'Solicitando readiness...'
                            : 'Solicitar activation readiness'}
                        </button>
                        <div className={styles.stack}>
                          <small>
                            Próximo paso:{' '}
                            {selectedTenantEcommerceLaunchPlanDetail.plan.nextStep}
                          </small>
                          <small>
                            Safe actions:{' '}
                            {selectedTenantEcommerceLaunchPlanDetail.safeActions.join(
                              ' · ',
                            )}
                          </small>
                          <small>
                            Bloqueado:{' '}
                            {selectedTenantEcommerceLaunchPlanDetail.blockedActions.join(
                              ' · ',
                            )}
                          </small>
                        </div>
                        {lastEcommerceLaunchActivationReadiness ? (
                          <div className={styles.assistCueCard}>
                            <div className={styles.invoiceCardHeader}>
                              <strong>Activation readiness</strong>
                              <span className={styles.badge}>
                                {humanizeKey(
                                  lastEcommerceLaunchActivationReadiness.activationStatus,
                                )}
                              </span>
                            </div>
                            <small>
                              {lastEcommerceLaunchActivationReadiness.summary}
                            </small>
                            <small>
                              Required actions:{' '}
                              {lastEcommerceLaunchActivationReadiness.requiredActions.join(
                                ' · ',
                              ) || 'ninguna'}
                            </small>
                            <small>
                              Guardrails:{' '}
                              {lastEcommerceLaunchActivationReadiness.guardrails.join(
                                ' · ',
                              )}
                            </small>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : tenantAiEcommerceLaunchWorkspaceLoading ? (
                <small className={styles.muted}>
                  Cargando workspace AI de ecommerce launch...
                </small>
              ) : (
                <div className={styles.emptyState}>
                  <p>
                    Todavía no hay suficiente contexto para hidratar el launch
                    workspace de ecommerce.
                  </p>
                </div>
              )}
            </div>

            <div className={styles.detailCard}>
              <div className={styles.sectionHeading}>
                <div>
                  <span className={styles.label}>AI Capability Platform</span>
                  <h3>Ecommerce Launch Assistant</h3>
                </div>
                {activeEcommerceAiAgent ? (
                  <span
                    className={`${styles.statusPill} ${aiAgentAvailabilityTone(
                      activeEcommerceAiAgent.availability,
                    )}`}
                  >
                    {aiAgentAvailabilityLabel(activeEcommerceAiAgent.availability)}
                  </span>
                ) : null}
              </div>

              {ecommerceLaunchAssistantAiEnvelope ? (
                <div className={styles.stack}>
                  <p className={styles.muted}>
                    <strong>{ecommerceLaunchAssistantAiEnvelope.agent.title}</strong>{' '}
                    ya puede convertir esta superficie determinística en un brief
                    reusable para catálogo, landing y campaña, pero sigue en modo
                    sugerencia y no publica nada por sí solo.
                  </p>
                  <div className={styles.badgeRow}>
                    {activeEcommerceAiPrimarySurface ? (
                      <span className={styles.badge}>
                        Surface {activeEcommerceAiPrimarySurface.key}
                      </span>
                    ) : null}
                    <span className={styles.badge}>
                      Prompt pack{' '}
                      {activeEcommerceAiPromptPack?.key ??
                        ecommerceLaunchAssistantAiEnvelope.promptPack.key}
                    </span>
                    <span className={styles.badge}>
                      Mode {ecommerceLaunchAssistantAiEnvelope.mode}
                    </span>
                  </div>
                  {activeEcommerceAiPromptPack ? (
                    <div className={styles.assistReplyBox}>
                      <span className={styles.muted}>Objetivo del agente</span>
                      <strong>{activeEcommerceAiPromptPack.objective}</strong>
                    </div>
                  ) : null}

                  <div className={styles.assistChecklist}>
                    {ecommerceLaunchAssistantAiEnvelope.promptPack.suggestedOutputs.map(
                      (entry) => (
                        <span
                          className={styles.badge}
                          key={`ecommerce-output:${entry.key}`}
                        >
                          {entry.label}
                        </span>
                      ),
                    )}
                  </div>

                  <div className={styles.actionRow}>
                    <button
                      className={styles.primaryButton}
                      disabled={
                        !canReadTenantEntitlements ||
                        actionLoading === 'prepare-ecommerce-ai-suggestion-run'
                      }
                      onClick={onPrepare}
                      type="button"
                    >
                      {actionLoading === 'prepare-ecommerce-ai-suggestion-run'
                        ? 'Preparando...'
                        : 'Preparar handoff AI'}
                    </button>
                  </div>

                  <div className={styles.stack}>
                    <div className={styles.sectionHeading}>
                      <div>
                        <span className={styles.label}>Tool access</span>
                        <h3>Postura real de la capacidad AI</h3>
                      </div>
                    </div>
                    {activeEcommerceAiToolAccess.map((entry) => (
                      <div
                        className={styles.invoiceItemCard}
                        key={`ecommerce-tool:${entry.tool.key}`}
                      >
                        <div className={styles.invoiceCardHeader}>
                          <strong>{entry.tool.title}</strong>
                          <span className={styles.statusPill}>
                            {entry.accessLevel}
                          </span>
                        </div>
                        <small>{entry.rationale}</small>
                        <small>
                          Boundary{' '}
                          {humanizeKey(entry.tool.executionBoundary.executionMode)}
                        </small>
                      </div>
                    ))}
                  </div>

                  {ecommerceLaunchAssistantAiEnvelope.retrieval ? (
                    <div className={styles.stack}>
                      <div className={styles.sectionHeading}>
                        <div>
                          <span className={styles.label}>Retrieved memory</span>
                          <h3>Contexto persistido que ya entra al brief</h3>
                        </div>
                      </div>
                      <small>
                        {ecommerceLaunchAssistantAiEnvelope.retrieval.recordCount}{' '}
                        record(s) visibles para este agente.
                      </small>
                      {ecommerceLaunchAssistantAiEnvelope.retrieval.notes.map(
                        (note, index) => (
                          <small key={`ecommerce-retrieval-note:${index}`}>
                            {note}
                          </small>
                        ),
                      )}
                    </div>
                  ) : null}

                  {activeEcommerceAiApprovalPolicies.length > 0 ? (
                    <div className={styles.stack}>
                      <div className={styles.sectionHeading}>
                        <div>
                          <span className={styles.label}>Human gate</span>
                          <h3>Cómo entra a revisión humana</h3>
                        </div>
                      </div>
                      {activeEcommerceAiApprovalPolicies.map((entry) => (
                        <div
                          className={styles.assistCueCard}
                          key={`ecommerce-policy:${entry.policyKey}`}
                        >
                          <div className={styles.invoiceCardHeader}>
                            <strong>{entry.title}</strong>
                            <span
                              className={`${styles.statusPill} ${styles.statusWarning}`}
                            >
                              {entry.scope}
                            </span>
                          </div>
                          <small>{entry.summary}</small>
                          <small>{entry.reviewGuidance}</small>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {activeEcommerceAiSuggestionRuns.length > 0 ? (
                    <div className={styles.stack}>
                      <div className={styles.sectionHeading}>
                        <div>
                          <span className={styles.label}>Recent handoffs</span>
                          <h3>Últimos briefs preparados</h3>
                        </div>
                      </div>
                      {activeEcommerceAiSuggestionRuns.slice(0, 2).map((entry) => (
                        <div
                          className={styles.timelineCard}
                          key={`ecommerce-run:${entry.id}`}
                        >
                          <div className={styles.invoiceCardHeader}>
                            <strong>{entry.summary}</strong>
                            <span className={styles.statusPill}>
                              {humanizeKey(entry.approvalSummary.status)}
                            </span>
                          </div>
                          <small>
                            {formatDate(entry.createdAt)} · {entry.promptPackKey}@
                            {entry.promptPackVersion}
                          </small>
                          <div className={styles.inlineActions}>
                            <button
                              className={styles.secondaryButton}
                              type="button"
                              onClick={() => onOpenDetail(entry.id)}
                              disabled={
                                ecommerceAgentActionLoadingState ===
                                getDedicatedActionKey('load_detail', entry.id)
                              }
                            >
                              Ver detalle
                            </button>
                            {entry.approvalSummary.status !== 'pending' &&
                            entry.approvalSummary.status !== 'approved' ? (
                              <button
                                className={styles.ghostButton}
                                type="button"
                                onClick={() => onRequestApproval(entry.id)}
                                disabled={
                                  ecommerceAgentActionLoadingState ===
                                  getDedicatedActionKey(
                                    'request_approval',
                                    entry.id,
                                  )
                                }
                              >
                                Pedir approval
                              </button>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {selectedEcommerceAiSuggestionRunDetail ? (
                    <div className={styles.stack}>
                      <div className={styles.sectionHeading}>
                        <div>
                          <span className={styles.label}>Suggestion detail</span>
                          <h3>Brief abierto para revisión humana</h3>
                        </div>
                      </div>
                      <div className={styles.detailCard}>
                        <div className={styles.stack}>
                          <small>
                            {selectedEcommerceAiSuggestionRunDetail.promptPackKey}@
                            {
                              selectedEcommerceAiSuggestionRunDetail.promptPackVersion
                            }
                          </small>
                          <strong>
                            {selectedEcommerceAiSuggestionRunDetail.summary}
                          </strong>
                          <small>
                            Outputs sugeridos:{' '}
                            {selectedEcommerceAiSuggestionRunDetail.suggestedOutputKeys.join(
                              ', ',
                            )}
                          </small>
                        </div>
                        <div className={styles.stack}>
                          {selectedEcommerceAiSuggestionRunDetail.approvalRequests.map(
                            (entry) => (
                              <div
                                className={styles.assistCueCard}
                                key={`ecommerce-detail-approval:${entry.id}`}
                              >
                                <div className={styles.invoiceCardHeader}>
                                  <strong>{entry.summary}</strong>
                                  <span className={styles.statusPill}>
                                    {humanizeKey(entry.status)}
                                  </span>
                                </div>
                                <small>{entry.policyKey}</small>
                                <small>{entry.rationale}</small>
                                {entry.status === 'pending' ? (
                                  <div className={styles.inlineActions}>
                                    <button
                                      className={styles.secondaryButton}
                                      type="button"
                                      onClick={() =>
                                        onReviewApproval(entry.id, 'approved')
                                      }
                                      disabled={
                                        ecommerceAgentActionLoadingState ===
                                        getDedicatedActionKey(
                                          'review_approval',
                                          entry.id,
                                        )
                                      }
                                    >
                                      Aprobar
                                    </button>
                                    <button
                                      className={styles.ghostButton}
                                      type="button"
                                      onClick={() =>
                                        onReviewApproval(entry.id, 'rejected')
                                      }
                                      disabled={
                                        ecommerceAgentActionLoadingState ===
                                        getDedicatedActionKey(
                                          'review_approval',
                                          entry.id,
                                        )
                                      }
                                    >
                                      Rechazar
                                    </button>
                                  </div>
                                ) : null}
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {ecommerceLaunchAssistantAiApprovalRequests.length > 0 ? (
                    <div className={styles.stack}>
                      <div className={styles.sectionHeading}>
                        <div>
                          <span className={styles.label}>Approval queue</span>
                          <h3>Solicitudes visibles para ecommerce launch</h3>
                        </div>
                      </div>
                      {ecommerceLaunchAssistantAiApprovalRequests
                        .slice(0, 3)
                        .map((entry) => (
                          <div
                            className={styles.assistCueCard}
                            key={`ecommerce-approval:${entry.id}`}
                          >
                            <div className={styles.invoiceCardHeader}>
                              <strong>{entry.summary}</strong>
                              <span className={styles.statusPill}>
                                {humanizeKey(entry.status)}
                              </span>
                            </div>
                            <small>{entry.policyKey}</small>
                            <small>{entry.rationale}</small>
                            <small>
                              Suggestion run {entry.suggestionRunId} · creada{' '}
                              {formatDate(entry.createdAt)}
                            </small>
                          </div>
                        ))}
                    </div>
                  ) : null}

                  {latestApprovedEcommerceAiApprovalRequest ? (
                    <div className={styles.assistCueCard}>
                      <strong>Última decisión humana</strong>
                      <small>{latestApprovedEcommerceAiApprovalRequest.summary}</small>
                      <small>
                        Revisada{' '}
                        {formatDate(
                          latestApprovedEcommerceAiApprovalRequest.reviewedAt,
                        )}
                      </small>
                    </div>
                  ) : null}
                </div>
              ) : tenantAiEcommerceLaunchWorkspaceLoading ? (
                <small className={styles.muted}>
                  Cargando envelope AI de ecommerce launch...
                </small>
              ) : (
                <div className={styles.emptyState}>
                  <p>
                    Cuando el envelope AI esté disponible, aquí veremos el brief
                    reusable del launch assistant.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
