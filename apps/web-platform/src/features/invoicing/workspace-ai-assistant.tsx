import styles from '../../app/app.module.css';
import type {
  AiAgentCatalogResponse,
  AiAgentToolAccessResponse,
  AiApprovalPolicyResponse,
  AiApprovalRequestResponse,
  AiApprovalRequestStatusFilter,
  AiSuggestionEnvelopeResponse,
  AiSuggestionRunDetailResponse,
  AiSuggestionRunResponse,
} from '../../app/types';

type InvoicingWorkspaceAiAssistantPanelProps = {
  actionLoading: string | null;
  activeAgent: AiAgentCatalogResponse | null;
  approvalPolicies: AiApprovalPolicyResponse[];
  approvalRequests: AiApprovalRequestResponse[];
  canReadInvoicingReports: boolean;
  envelope: AiSuggestionEnvelopeResponse | null;
  formatDate: (value: string | null | undefined) => string;
  humanizeKey: (value: string | null) => string;
  onFilterChange: (filter: AiApprovalRequestStatusFilter) => void;
  onOpenSuggestionRunDetail: (runId: string) => void;
  onPrepareHandoff: () => void;
  onRequestApproval: (runId: string) => void;
  onReviewApproval: (
    requestId: string,
    decision: 'approved' | 'rejected',
  ) => void;
  primarySurfaceKey: string | null;
  promptPack: { key: string; objective: string } | null;
  selectedSuggestionRunDetail: AiSuggestionRunDetailResponse | null;
  statusFilter: AiApprovalRequestStatusFilter;
  suggestionRuns: AiSuggestionRunResponse[];
  toolAccess: AiAgentToolAccessResponse[];
  availabilityLabel: (availability: AiAgentCatalogResponse['availability']) => string;
  availabilityTone: (
    availability: AiAgentCatalogResponse['availability'],
  ) => string;
};

export function InvoicingWorkspaceAiAssistantPanel({
  actionLoading,
  activeAgent,
  approvalPolicies,
  approvalRequests,
  canReadInvoicingReports,
  envelope,
  formatDate,
  humanizeKey,
  onFilterChange,
  onOpenSuggestionRunDetail,
  onPrepareHandoff,
  onRequestApproval,
  onReviewApproval,
  primarySurfaceKey,
  promptPack,
  selectedSuggestionRunDetail,
  statusFilter,
  suggestionRuns,
  toolAccess,
  availabilityLabel,
  availabilityTone,
}: InvoicingWorkspaceAiAssistantPanelProps) {
  return (
    <div className={styles.detailCard}>
      <div className={styles.sectionHeading}>
        <div>
          <span className={styles.label}>AI Capability Platform</span>
          <h3>Invoice Document Assistant</h3>
        </div>
        {activeAgent ? (
          <span
            className={`${styles.statusPill} ${availabilityTone(
              activeAgent.availability,
            )}`}
          >
            {availabilityLabel(activeAgent.availability)}
          </span>
        ) : null}
      </div>

      {envelope ? (
        <div className={styles.stack}>
          <p className={styles.muted}>
            <strong>{envelope.agent.title}</strong> recibe este contrato
            determinístico y se mantiene en modo sugerencia. Ayuda a explicar,
            revisar y ordenar, pero no firma ni envía documentos.
          </p>
          <div className={styles.badgeRow}>
            {primarySurfaceKey ? (
              <span className={styles.badge}>Surface {primarySurfaceKey}</span>
            ) : null}
            <span className={styles.badge}>
              Prompt pack {promptPack?.key ?? envelope.promptPack.key}
            </span>
            <span className={styles.badge}>Mode {envelope.mode}</span>
          </div>
          <p className={styles.muted}>
            <strong>{promptPack?.objective ?? envelope.promptPack.objective}</strong>
          </p>

          <div className={styles.actionRow}>
            <button
              className={styles.primaryButton}
              disabled={
                !canReadInvoicingReports ||
                actionLoading === 'prepare-invoice-ai-suggestion-run'
              }
              onClick={onPrepareHandoff}
              type="button"
            >
              {actionLoading === 'prepare-invoice-ai-suggestion-run'
                ? 'Preparando...'
                : 'Preparar handoff AI'}
            </button>
          </div>

          <div className={styles.stack}>
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.label}>Tool access</span>
                <h3>Herramientas permitidas y bloqueadas</h3>
              </div>
            </div>
            {toolAccess.map((entry) => (
              <div className={styles.invoiceItemCard} key={entry.tool.key}>
                <div className={styles.invoiceCardHeader}>
                  <strong>{entry.tool.title}</strong>
                  <span className={styles.statusPill}>{entry.accessLevel}</span>
                </div>
                <small>{entry.rationale}</small>
              </div>
            ))}
          </div>

          <div className={styles.stack}>
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.label}>Suggestion runs</span>
                <h3>Historial auditable reciente</h3>
              </div>
            </div>
            {suggestionRuns.length === 0 ? (
              <div className={styles.emptyState}>
                <p>Todavia no hay handoffs auditables para este agente.</p>
              </div>
            ) : (
              suggestionRuns.slice(0, 3).map((entry) => {
                const hasPendingApproval =
                  entry.approvalSummary.status === 'pending';
                const hasApprovedApproval =
                  entry.approvalSummary.status === 'approved';

                return (
                  <div className={styles.invoiceItemCard} key={entry.id}>
                    <div className={styles.invoiceCardHeader}>
                      <strong>{entry.promptPackKey}</strong>
                      <span className={styles.statusPill}>{entry.status}</span>
                    </div>
                    <small>{entry.summary}</small>
                    <small>
                      Outputs: {entry.suggestedOutputKeys.join(', ')}
                    </small>
                    <small>
                      Approval: {humanizeKey(entry.approvalSummary.status)}
                      {entry.approvalSummary.latestRequestedAt
                        ? ` · ${formatDate(
                            entry.approvalSummary.latestReviewedAt ??
                              entry.approvalSummary.latestRequestedAt,
                          )}`
                        : ''}
                    </small>
                    <div className={styles.actionRow}>
                      <button
                        className={styles.ghostButton}
                        disabled={
                          actionLoading === `load-invoice-ai-run-detail:${entry.id}`
                        }
                        onClick={() => onOpenSuggestionRunDetail(entry.id)}
                        type="button"
                      >
                        {actionLoading ===
                        `load-invoice-ai-run-detail:${entry.id}`
                          ? 'Cargando detalle...'
                          : 'Ver detalle'}
                      </button>
                      <button
                        className={styles.secondaryButton}
                        disabled={
                          hasPendingApproval ||
                          hasApprovedApproval ||
                          actionLoading ===
                            `request-invoice-ai-approval:${entry.id}`
                        }
                        onClick={() => onRequestApproval(entry.id)}
                        type="button"
                      >
                        {actionLoading ===
                        `request-invoice-ai-approval:${entry.id}`
                          ? 'Solicitando...'
                          : hasPendingApproval
                            ? 'Revision pendiente'
                            : hasApprovedApproval
                              ? 'Revision aprobada'
                              : 'Pedir revision'}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {selectedSuggestionRunDetail ? (
            <div className={styles.stack}>
              <div className={styles.sectionHeading}>
                <div>
                  <span className={styles.label}>Selected handoff</span>
                  <h3>Timeline de aprobación</h3>
                </div>
              </div>
              <div className={styles.invoiceItemCard}>
                <div className={styles.invoiceCardHeader}>
                  <strong>{selectedSuggestionRunDetail.promptPackKey}</strong>
                  <span className={styles.statusPill}>
                    {humanizeKey(
                      selectedSuggestionRunDetail.approvalSummary.status,
                    )}
                  </span>
                </div>
                <small>{selectedSuggestionRunDetail.summary}</small>
                <small>
                  Outputs:{' '}
                  {selectedSuggestionRunDetail.suggestedOutputKeys.join(', ')}
                </small>
                {selectedSuggestionRunDetail.approvalRequests.length === 0 ? (
                  <small className={styles.muted}>
                    Todavía no hay approval requests para este handoff.
                  </small>
                ) : (
                  selectedSuggestionRunDetail.approvalRequests.map((entry) => (
                    <div className={styles.invoiceItemCard} key={entry.id}>
                      <div className={styles.invoiceCardHeader}>
                        <strong>{entry.policyKey}</strong>
                        <span className={styles.statusPill}>
                          {humanizeKey(entry.status)}
                        </span>
                      </div>
                      <small>
                        Solicitada {formatDate(entry.createdAt)}
                        {entry.reviewedAt
                          ? ` · revisada ${formatDate(entry.reviewedAt)}`
                          : ''}
                      </small>
                      {entry.rationale ? <small>{entry.rationale}</small> : null}
                      {entry.reviewNote ? <small>{entry.reviewNote}</small> : null}
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : null}

          <div className={styles.stack}>
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.label}>Approval policy</span>
                <h3>Guardrails vigentes</h3>
              </div>
            </div>
            {approvalPolicies.length === 0 ? (
              <div className={styles.emptyState}>
                <p>Este agente todavía no expone políticas de revisión.</p>
              </div>
            ) : (
              approvalPolicies.map((entry) => (
                <div className={styles.invoiceItemCard} key={entry.policyKey}>
                  <div className={styles.invoiceCardHeader}>
                    <strong>{entry.title}</strong>
                    <span className={styles.statusPill}>{entry.scope}</span>
                  </div>
                  <small>{entry.reviewGuidance}</small>
                </div>
              ))
            )}
          </div>

          <div className={styles.stack}>
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.label}>Approval queue</span>
                <h3>Revisión humana obligatoria</h3>
              </div>
            </div>
            <div className={styles.actionRow}>
              {(['all', 'pending', 'approved', 'rejected'] as const).map(
                (filter) => (
                  <button
                    key={filter}
                    className={
                      statusFilter === filter
                        ? styles.secondaryButton
                        : styles.ghostButton
                    }
                    onClick={() => onFilterChange(filter)}
                    type="button"
                  >
                    {filter === 'all' ? 'Todas' : humanizeKey(filter)}
                  </button>
                ),
              )}
            </div>
            {approvalRequests.length === 0 ? (
              <div className={styles.emptyState}>
                <p>
                  No hay approvals en estado{' '}
                  {statusFilter === 'all'
                    ? 'visible'
                    : humanizeKey(statusFilter)}
                  .
                </p>
              </div>
            ) : (
              approvalRequests.slice(0, 3).map((entry) => (
                <div className={styles.invoiceItemCard} key={entry.id}>
                  <div className={styles.invoiceCardHeader}>
                    <strong>{entry.policyKey}</strong>
                    <span className={styles.statusPill}>{entry.status}</span>
                  </div>
                  <small>{entry.summary}</small>
                  <small>
                    Solicitada {formatDate(entry.createdAt)}
                    {entry.reviewedAt
                      ? ` · revisada ${formatDate(entry.reviewedAt)}`
                      : ''}
                  </small>
                  <div className={styles.actionRow}>
                    <button
                      className={styles.ghostButton}
                      disabled={
                        actionLoading ===
                        `load-invoice-ai-run-detail:${entry.suggestionRunId}`
                      }
                      onClick={() => onOpenSuggestionRunDetail(entry.suggestionRunId)}
                      type="button"
                    >
                      {actionLoading ===
                      `load-invoice-ai-run-detail:${entry.suggestionRunId}`
                        ? 'Cargando handoff...'
                        : 'Ver handoff'}
                    </button>
                  </div>
                  {entry.status === 'pending' ? (
                    <div className={styles.actionRow}>
                      <button
                        className={styles.secondaryButton}
                        disabled={
                          actionLoading ===
                          `review-invoice-ai-approval:${entry.id}`
                        }
                        onClick={() => onReviewApproval(entry.id, 'approved')}
                        type="button"
                      >
                        Aprobar
                      </button>
                      <button
                        className={styles.dangerButton}
                        disabled={
                          actionLoading ===
                          `review-invoice-ai-approval:${entry.id}`
                        }
                        onClick={() => onReviewApproval(entry.id, 'rejected')}
                        type="button"
                      >
                        Rechazar
                      </button>
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>
            Cuando el envelope AI esté disponible, aquí veremos el handoff
            auditable del agente documental.
          </p>
        </div>
      )}
    </div>
  );
}
