import styles from './app.module.css';
import {
  guardedExecutionControlStatusLabel,
  guardedExecutionControlStatusTone,
  guardedExecutionMonitorStatusLabel,
} from './ai-console-support';
import {
  AiApprovalRequestResponse,
  AiEcommerceLaunchWorkspaceResponse,
  AiGuardedExecutionControlWorkspaceResponse,
  AiGuardedExecutionExecutionResponse,
  AiGuardedExecutionRollbackExecutionResponse,
  AiOperatingModelAgentResponse,
  GrowthOperationalCaseResponse,
  InvoiceDetailResponse,
  InvoiceSummaryResponse,
} from './types';

type Props = {
  formatDate: (value: string | null) => string;
  formatMoney: (priceInCents: number, currency: string) => string;
  humanizeKey: (value: string | null) => string;
  tenantAiGuardedExecutionControlWorkspace: AiGuardedExecutionControlWorkspaceResponse | null;
  tenantAiGuardedExecutionControlWorkspaceLoading: boolean;
  lastGuardedExecutionResult: AiGuardedExecutionExecutionResponse | null;
  lastGuardedExecutionRollbackResult: AiGuardedExecutionRollbackExecutionResponse | null;
  latestApprovedAiApprovalRequestByAgent: Map<string, AiApprovalRequestResponse>;
  guardedExecutionCaseSelectionByAgent: Record<string, string>;
  availableGuardedExecutionGrowthCases: GrowthOperationalCaseResponse[];
  availableGuardedExecutionInvoices: InvoiceSummaryResponse[];
  tenantAiEcommerceLaunchWorkspace: AiEcommerceLaunchWorkspaceResponse | null;
  invoices: InvoiceSummaryResponse[];
  selectedInvoiceId: string | null;
  selectedInvoiceDetail: InvoiceDetailResponse | null;
  canManageGrowthConversations: boolean;
  canReadInvoicingReports: boolean;
  growthActionLoading: string | null;
  resolveAiGuardedExecutionCandidate: (
    agentKey: string,
  ) => AiOperatingModelAgentResponse['guardedExecutionCandidate'];
  onSelectGuardedExecutionTarget: (agentKey: string, targetId: string) => void;
  onExecuteGuardedExecution: (
    agentKey: string,
    requestId: string,
    targetId: string,
  ) => void;
  onRollbackGuardedExecution: (
    agentKey: string,
    requestId: string,
    targetId: string,
  ) => void;
};

export function AiGuardedExecutionControl({
  formatDate,
  formatMoney,
  humanizeKey,
  tenantAiGuardedExecutionControlWorkspace,
  tenantAiGuardedExecutionControlWorkspaceLoading,
  lastGuardedExecutionResult,
  lastGuardedExecutionRollbackResult,
  latestApprovedAiApprovalRequestByAgent,
  guardedExecutionCaseSelectionByAgent,
  availableGuardedExecutionGrowthCases,
  availableGuardedExecutionInvoices,
  tenantAiEcommerceLaunchWorkspace,
  invoices,
  selectedInvoiceId,
  selectedInvoiceDetail,
  canManageGrowthConversations,
  canReadInvoicingReports,
  growthActionLoading,
  resolveAiGuardedExecutionCandidate,
  onSelectGuardedExecutionTarget,
  onExecuteGuardedExecution,
  onRollbackGuardedExecution,
}: Props) {
  return (
    <div className={styles.detailCard}>
      <div className={styles.sectionHeading}>
        <div>
          <span className={styles.label}>AI guarded execution control</span>
          <h3>La tarjeta compacta de go no-go para cada lane guardado</h3>
        </div>
        <span className={styles.statusPill}>
          {tenantAiGuardedExecutionControlWorkspace
            ? formatDate(tenantAiGuardedExecutionControlWorkspace.generatedAt)
            : 'sin control'}
        </span>
      </div>

      <div className={styles.commercialMetricsGrid}>
        <div className={styles.commercialCard}>
          <span className={styles.muted}>Open lane</span>
          <strong>
            {tenantAiGuardedExecutionControlWorkspace?.counts.openLaneAgents ?? 0}
          </strong>
          <small>
            Agentes que ya tendrían un go explícito para abrir el lane guardado.
          </small>
        </div>
        <div className={styles.commercialCard}>
          <span className={styles.muted}>Pilot then open</span>
          <strong>
            {tenantAiGuardedExecutionControlWorkspace?.counts.pilotThenOpenAgents ?? 0}
          </strong>
          <small>
            Agentes que todavía necesitan piloto o maduración antes del go.
          </small>
        </div>
        <div className={styles.commercialCard}>
          <span className={styles.muted}>Hold</span>
          <strong>
            {tenantAiGuardedExecutionControlWorkspace?.counts.holdAgents ?? 0}
          </strong>
          <small>Agentes que deben quedarse en suggestion mode por ahora.</small>
        </div>
        <div className={styles.commercialCard}>
          <span className={styles.muted}>Control candidates</span>
          <strong>
            {tenantAiGuardedExecutionControlWorkspace?.counts.controlCandidateTools ?? 0}
          </strong>
          <small>
            Tools candidatos que ya entran en una lectura compacta de control.
          </small>
        </div>
      </div>

      <div className={styles.stack}>
        {lastGuardedExecutionResult ? (
          <div className={styles.assistCueCard}>
            <div className={styles.invoiceCardHeader}>
              <strong>{lastGuardedExecutionResult.summary}</strong>
              <span className={styles.statusPill}>
                {formatDate(lastGuardedExecutionResult.executedAt)}
              </span>
            </div>
            <small>{lastGuardedExecutionResult.detail}</small>
            {lastGuardedExecutionResult.targetKind === 'invoice_payment' ? (
              <small>
                Factura {lastGuardedExecutionResult.invoice?.number ?? 'sin numero'} ·
                Estado{' '}
                {humanizeKey(lastGuardedExecutionResult.invoice?.status ?? 'unknown')}{' '}
                · Pago {lastGuardedExecutionResult.payment?.id ?? 'sin pago'} · Tool{' '}
                {lastGuardedExecutionResult.toolKey}
              </small>
            ) : lastGuardedExecutionResult.targetKind ===
              'ecommerce_launch_plan' ? (
              <small>
                Launch plan{' '}
                {lastGuardedExecutionResult.launchPlan?.title ??
                  lastGuardedExecutionResult.launchPlan?.id ??
                  'sin plan'}{' '}
                · Readiness{' '}
                {humanizeKey(
                  lastGuardedExecutionResult.launchPlan
                    ?.guardedExecutionReadiness ?? 'unknown',
                )}{' '}
                · Tool {lastGuardedExecutionResult.toolKey}
              </small>
            ) : (
              <small>
                Caso {lastGuardedExecutionResult.operationalCase?.id ?? 'sin caso'} ·
                Estado{' '}
                {humanizeKey(
                  lastGuardedExecutionResult.operationalCase?.status ?? 'unknown',
                )}{' '}
                · Tool {lastGuardedExecutionResult.toolKey}
              </small>
            )}
          </div>
        ) : null}

        {lastGuardedExecutionRollbackResult ? (
          <div className={styles.assistCueCard}>
            <div className={styles.invoiceCardHeader}>
              <strong>{lastGuardedExecutionRollbackResult.summary}</strong>
              <span className={styles.statusPill}>
                {formatDate(lastGuardedExecutionRollbackResult.rolledBackAt)}
              </span>
            </div>
            <small>{lastGuardedExecutionRollbackResult.detail}</small>
            {lastGuardedExecutionRollbackResult.targetKind === 'invoice_payment' ? (
              <small>
                Factura{' '}
                {lastGuardedExecutionRollbackResult.invoice?.number ?? 'sin numero'} ·
                Estado{' '}
                {humanizeKey(
                  lastGuardedExecutionRollbackResult.invoice?.status ?? 'unknown',
                )}{' '}
                · Pago{' '}
                {lastGuardedExecutionRollbackResult.payment?.id ?? 'sin pago'} ·
                Fallback {lastGuardedExecutionRollbackResult.safeFallbackMode}
              </small>
            ) : lastGuardedExecutionRollbackResult.targetKind ===
              'ecommerce_launch_plan' ? (
              <small>
                Launch plan{' '}
                {lastGuardedExecutionRollbackResult.launchPlan?.title ??
                  lastGuardedExecutionRollbackResult.launchPlan?.id ??
                  'sin plan'}{' '}
                · Readiness{' '}
                {humanizeKey(
                  lastGuardedExecutionRollbackResult.launchPlan
                    ?.guardedExecutionReadiness ?? 'unknown',
                )}{' '}
                · Fallback {lastGuardedExecutionRollbackResult.safeFallbackMode}
              </small>
            ) : (
              <small>
                Caso{' '}
                {lastGuardedExecutionRollbackResult.operationalCase?.id ?? 'sin caso'} ·
                Estado{' '}
                {humanizeKey(
                  lastGuardedExecutionRollbackResult.operationalCase?.status ??
                    'unknown',
                )}{' '}
                · Fallback {lastGuardedExecutionRollbackResult.safeFallbackMode}
              </small>
            )}
          </div>
        ) : null}

        {tenantAiGuardedExecutionControlWorkspace?.agents.length ? (
          tenantAiGuardedExecutionControlWorkspace.agents.map((agent) => {
            const approvedRequest =
              latestApprovedAiApprovalRequestByAgent.get(agent.agentKey) ?? null;
            const selectedCaseId =
              guardedExecutionCaseSelectionByAgent[agent.agentKey] ??
              availableGuardedExecutionGrowthCases[0]?.id ??
              '';
            const selectedInvoiceIdForGuardedExecution =
              guardedExecutionCaseSelectionByAgent[agent.agentKey] ??
              selectedInvoiceId ??
              availableGuardedExecutionInvoices[0]?.id ??
              '';
            const selectedCase =
              availableGuardedExecutionGrowthCases.find(
                (entry) => entry.id === selectedCaseId,
              ) ?? null;
            const selectedLaunchPlanId =
              guardedExecutionCaseSelectionByAgent[agent.agentKey] ??
              tenantAiEcommerceLaunchWorkspace?.launchPlans[0]?.id ??
              '';
            const selectedInvoiceForGuardedExecution =
              invoices.find((entry) => entry.id === selectedInvoiceIdForGuardedExecution) ??
              null;
            const selectedLaunchPlan =
              tenantAiEcommerceLaunchWorkspace?.launchPlans.find(
                (entry) => entry.id === selectedLaunchPlanId,
              ) ?? null;
            const candidateLane = resolveAiGuardedExecutionCandidate(agent.agentKey);
            const isGrowthCaseCandidate =
              candidateLane?.targetKind === 'growth_operational_case';
            const isInvoicePaymentCandidate = candidateLane?.targetKind === 'invoice';
            const isEcommerceLaunchCandidate =
              candidateLane?.targetKind === 'ecommerce_launch_plan';
            const selectedGuardedExecutionTargetId = isInvoicePaymentCandidate
              ? selectedInvoiceIdForGuardedExecution
              : isEcommerceLaunchCandidate
                ? selectedLaunchPlanId
                : selectedCaseId;
            const executeActionKey =
              approvedRequest && selectedGuardedExecutionTargetId
                ? `execute-ai-guarded:${approvedRequest.id}:${selectedGuardedExecutionTargetId}`
                : null;
            const rollbackActionKey =
              approvedRequest && selectedGuardedExecutionTargetId
                ? `rollback-ai-guarded:${approvedRequest.id}:${selectedGuardedExecutionTargetId}`
                : null;
            const canExecuteGrowthLane =
              canManageGrowthConversations &&
              isGrowthCaseCandidate &&
              approvedRequest !== null &&
              selectedCaseId.length > 0;
            const canRollbackGrowthLane =
              canExecuteGrowthLane &&
              selectedCase !== null &&
              selectedCase.status === 'in_progress' &&
              selectedCase.assignedUserId !== null;
            const canExecuteInvoiceLane =
              canReadInvoicingReports &&
              isInvoicePaymentCandidate &&
              approvedRequest !== null &&
              selectedInvoiceForGuardedExecution !== null &&
              (selectedInvoiceForGuardedExecution.status === 'issued' ||
                selectedInvoiceForGuardedExecution.status === 'partially_paid') &&
              selectedInvoiceForGuardedExecution.settlement.balanceDueInCents > 0;
            const matchingInvoiceRollbackPayment =
              isInvoicePaymentCandidate &&
              approvedRequest !== null &&
              selectedInvoiceDetail?.id === selectedInvoiceIdForGuardedExecution
                ? [...selectedInvoiceDetail.payments]
                    .reverse()
                    .find(
                      (payment) =>
                        payment.reference === `ai-approval:${approvedRequest.id}` &&
                        payment.status === 'posted' &&
                        payment.reversedAt === null,
                    ) ?? null
                : null;
            const canRollbackInvoiceLane =
              canReadInvoicingReports &&
              isInvoicePaymentCandidate &&
              approvedRequest !== null &&
              selectedInvoiceForGuardedExecution !== null &&
              matchingInvoiceRollbackPayment !== null;
            const ecommerceLaneInShadowReviewOnly =
              isEcommerceLaunchCandidate &&
              selectedLaunchPlan?.guardedExecutionReadiness === 'shadow_review_ready';
            const canExecuteEcommerceLane =
              isEcommerceLaunchCandidate &&
              approvedRequest !== null &&
              selectedLaunchPlan !== null &&
              ecommerceLaneInShadowReviewOnly;
            const canRollbackEcommerceLane = canExecuteEcommerceLane;

            return (
              <div
                className={styles.assistCueCard}
                key={`ai-guarded-execution-control:${agent.agentKey}`}
              >
                <div className={styles.invoiceCardHeader}>
                  <strong>{agent.title}</strong>
                  <span
                    className={`${styles.statusPill} ${guardedExecutionControlStatusTone(
                      agent.controlStatus,
                    )}`}
                  >
                    {guardedExecutionControlStatusLabel(agent.controlStatus)}
                  </span>
                </div>
                <small>
                  {humanizeKey(agent.domainKey)} · {humanizeKey(agent.controlWindow)} ·
                  {guardedExecutionMonitorStatusLabel(agent.monitorStatus)}
                </small>
                <small>
                  Control owner {agent.controlOwner} {'·'} Escalation{' '}
                  {agent.escalationOwner}
                </small>
                <small>
                  Candidate lane {candidateLane?.title ?? agent.candidateToolKey ?? 'none'}{' '}
                  {'·'} Fallback {humanizeKey(agent.safeFallbackMode)}
                </small>
                <small>{agent.topAction}</small>
                <small>{agent.nextStep}</small>

                {isGrowthCaseCandidate ? (
                  <>
                    <small>
                      {approvedRequest
                        ? `Approval aprobado visible: ${approvedRequest.id}.`
                        : 'Todavia no hay un approval aprobado visible para abrir el execute path.'}
                    </small>
                    <div className={styles.inlineActions}>
                      <select
                        className={styles.selectField}
                        value={selectedCaseId}
                        onChange={(event) => {
                          onSelectGuardedExecutionTarget(
                            agent.agentKey,
                            event.target.value,
                          );
                        }}
                        disabled={
                          availableGuardedExecutionGrowthCases.length === 0 ||
                          growthActionLoading === executeActionKey
                        }
                      >
                        {availableGuardedExecutionGrowthCases.length === 0 ? (
                          <option value="">
                            {candidateLane?.emptyTargetSelectionLabel ??
                              'No eligible operational cases'}
                          </option>
                        ) : (
                          availableGuardedExecutionGrowthCases.map((entry) => (
                            <option key={entry.id} value={entry.id}>
                              {entry.id} · {entry.title}
                            </option>
                          ))
                        )}
                      </select>
                      <button
                        className={styles.secondaryButton}
                        type="button"
                        onClick={() => {
                          if (approvedRequest && selectedCaseId) {
                            onExecuteGuardedExecution(
                              agent.agentKey,
                              approvedRequest.id,
                              selectedCaseId,
                            );
                          }
                        }}
                        disabled={
                          !canExecuteGrowthLane ||
                          growthActionLoading === executeActionKey
                        }
                      >
                        {candidateLane?.executeActionLabel ?? 'Execute take-case'}
                      </button>
                      <button
                        className={styles.ghostButton}
                        type="button"
                        onClick={() => {
                          if (approvedRequest && selectedCaseId) {
                            onRollbackGuardedExecution(
                              agent.agentKey,
                              approvedRequest.id,
                              selectedCaseId,
                            );
                          }
                        }}
                        disabled={
                          !canRollbackGrowthLane ||
                          growthActionLoading === rollbackActionKey
                        }
                      >
                        {candidateLane?.rollbackActionLabel ?? 'Rollback take-case'}
                      </button>
                    </div>
                  </>
                ) : null}

                {isInvoicePaymentCandidate ? (
                  <>
                    <small>
                      {approvedRequest
                        ? `Approval aprobado visible: ${approvedRequest.id}.`
                        : 'Todavia no hay un approval aprobado visible para abrir el execute path.'}
                    </small>
                    <div className={styles.inlineActions}>
                      <select
                        className={styles.selectField}
                        value={selectedInvoiceIdForGuardedExecution}
                        onChange={(event) => {
                          onSelectGuardedExecutionTarget(
                            agent.agentKey,
                            event.target.value,
                          );
                        }}
                        disabled={
                          availableGuardedExecutionInvoices.length === 0 ||
                          growthActionLoading === executeActionKey
                        }
                      >
                        {availableGuardedExecutionInvoices.length === 0 ? (
                          <option value="">
                            {candidateLane?.emptyTargetSelectionLabel ??
                              'No eligible invoices'}
                          </option>
                        ) : (
                          availableGuardedExecutionInvoices.map((entry) => (
                            <option key={entry.id} value={entry.id}>
                              {entry.number} · saldo{' '}
                              {formatMoney(
                                entry.settlement.balanceDueInCents,
                                entry.currency,
                              )}
                            </option>
                          ))
                        )}
                      </select>
                      <button
                        className={styles.secondaryButton}
                        type="button"
                        onClick={() => {
                          if (approvedRequest && selectedInvoiceIdForGuardedExecution) {
                            onExecuteGuardedExecution(
                              agent.agentKey,
                              approvedRequest.id,
                              selectedInvoiceIdForGuardedExecution,
                            );
                          }
                        }}
                        disabled={
                          !canExecuteInvoiceLane ||
                          growthActionLoading === executeActionKey
                        }
                      >
                        {candidateLane?.executeActionLabel ?? 'Execute post-payment'}
                      </button>
                      <button
                        className={styles.ghostButton}
                        type="button"
                        onClick={() => {
                          if (approvedRequest && selectedInvoiceIdForGuardedExecution) {
                            onRollbackGuardedExecution(
                              agent.agentKey,
                              approvedRequest.id,
                              selectedInvoiceIdForGuardedExecution,
                            );
                          }
                        }}
                        disabled={
                          !canRollbackInvoiceLane ||
                          growthActionLoading === rollbackActionKey
                        }
                      >
                        {candidateLane?.rollbackActionLabel ?? 'Rollback payment'}
                      </button>
                    </div>
                    <small>
                      {selectedInvoiceForGuardedExecution
                        ? `Factura ${selectedInvoiceForGuardedExecution.number} · estado ${humanizeKey(
                            selectedInvoiceForGuardedExecution.status,
                          )} · saldo ${formatMoney(
                            selectedInvoiceForGuardedExecution.settlement.balanceDueInCents,
                            selectedInvoiceForGuardedExecution.currency,
                          )}.`
                        : 'Selecciona una factura elegible para abrir este lane.'}
                    </small>
                    <small>
                      {matchingInvoiceRollbackPayment
                        ? `Pago reversible visible: ${matchingInvoiceRollbackPayment.id}.`
                        : 'Todavia no hay un pago reversible visible para esta factura y approval.'}
                    </small>
                  </>
                ) : null}

                {isEcommerceLaunchCandidate ? (
                  <>
                    <small>
                      {approvedRequest
                        ? `Approval aprobado visible: ${approvedRequest.id}.`
                        : 'Todavia no hay un approval aprobado visible para abrir el shadow review de ecommerce.'}
                    </small>
                    <div className={styles.inlineActions}>
                      <select
                        className={styles.selectField}
                        value={selectedLaunchPlanId}
                        onChange={(event) => {
                          onSelectGuardedExecutionTarget(
                            agent.agentKey,
                            event.target.value,
                          );
                        }}
                        disabled={
                          (tenantAiEcommerceLaunchWorkspace?.launchPlans.length ?? 0) ===
                          0
                        }
                      >
                        {(tenantAiEcommerceLaunchWorkspace?.launchPlans.length ?? 0) ===
                        0 ? (
                          <option value="">
                            {candidateLane?.emptyTargetSelectionLabel ??
                              'No eligible launch plan'}
                          </option>
                        ) : (
                          tenantAiEcommerceLaunchWorkspace!.launchPlans.map((entry) => (
                            <option key={entry.id} value={entry.id}>
                              {entry.title} · {humanizeKey(entry.status)}
                            </option>
                          ))
                        )}
                      </select>
                      <button
                        className={styles.secondaryButton}
                        type="button"
                        onClick={() => {
                          if (approvedRequest && selectedLaunchPlanId) {
                            onExecuteGuardedExecution(
                              agent.agentKey,
                              approvedRequest.id,
                              selectedLaunchPlanId,
                            );
                          }
                        }}
                        disabled={
                          !canExecuteEcommerceLane ||
                          growthActionLoading === executeActionKey
                        }
                      >
                        {candidateLane?.executeActionLabel ?? 'Execute launch publish'}
                      </button>
                      <button
                        className={styles.ghostButton}
                        type="button"
                        onClick={() => {
                          if (approvedRequest && selectedLaunchPlanId) {
                            onRollbackGuardedExecution(
                              agent.agentKey,
                              approvedRequest.id,
                              selectedLaunchPlanId,
                            );
                          }
                        }}
                        disabled={
                          !canRollbackEcommerceLane ||
                          growthActionLoading === rollbackActionKey
                        }
                      >
                        {candidateLane?.rollbackActionLabel ?? 'Rollback launch publish'}
                      </button>
                    </div>
                    <small>
                      {selectedLaunchPlan
                        ? `${selectedLaunchPlan.scopeSummary} · channels ${selectedLaunchPlan.selectedChannels.join(', ')}.`
                        : 'Selecciona un launch plan elegible para preparar este lane.'}
                    </small>
                    <small>
                      {ecommerceLaneInShadowReviewOnly
                        ? 'Este lane ya puede registrar un publish pilot auditado en shadow review, pero el publish real sigue bloqueado hasta que exista la automatizacion operativa.'
                        : 'Este lane todavia no llega a shadow review operativo.'}
                    </small>
                  </>
                ) : null}

                <div className={styles.stack}>
                  {agent.controlChecklist.map((item, index) => (
                    <small
                      key={`ai-guarded-execution-control-check:${agent.agentKey}:${index}`}
                    >
                      {item}
                    </small>
                  ))}
                </div>
                <div className={styles.stack}>
                  {agent.guardrails.map((item, index) => (
                    <small
                      key={`ai-guarded-execution-control-guard:${agent.agentKey}:${index}`}
                    >
                      {item}
                    </small>
                  ))}
                </div>
                <div className={styles.stack}>
                  {agent.notes.map((note, index) => (
                    <small
                      key={`ai-guarded-execution-control-note:${agent.agentKey}:${index}`}
                    >
                      {note}
                    </small>
                  ))}
                </div>
              </div>
            );
          })
        ) : tenantAiGuardedExecutionControlWorkspaceLoading ? (
          <small className={styles.muted}>
            Cargando guarded execution control workspace de AI...
          </small>
        ) : (
          <div className={styles.emptyState}>
            <p>
              Todavia no hay suficiente contexto para decidir el control de go no-go de
              guarded execution en este tenant.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
