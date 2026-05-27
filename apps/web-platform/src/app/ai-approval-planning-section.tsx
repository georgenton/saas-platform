import styles from './app.module.css';
import {
  AiApprovalCapacityWorkspaceResponse,
  AiApprovalDesignWorkspaceResponse,
  AiApprovalLaunchWorkspaceResponse,
  AiApprovalReadinessWorkspaceResponse,
  AiApprovalRolloutWorkspaceResponse,
  AiApprovalSlaWorkspaceResponse,
  AiApprovalStaffingPlanWorkspaceResponse,
  AiApprovalStaffingWorkspaceResponse,
} from './types';

type Props = {
  formatDate: (value: string | null) => string;
  humanizeKey: (value: string | null) => string;
  approvalSlaStatusLabel: (
    status: AiApprovalSlaWorkspaceResponse['agents'][number]['simulatedSlaStatus'],
  ) => string;
  approvalDesignStatusTone: (
    status: AiApprovalDesignWorkspaceResponse['agents'][number]['designStatus'],
  ) => string;
  approvalDesignStatusLabel: (
    status: AiApprovalDesignWorkspaceResponse['agents'][number]['designStatus'],
  ) => string;
  approvalCapacityStatusTone: (
    status: AiApprovalCapacityWorkspaceResponse['agents'][number]['capacityStatus'],
  ) => string;
  approvalCapacityStatusLabel: (
    status: AiApprovalCapacityWorkspaceResponse['agents'][number]['capacityStatus'],
  ) => string;
  approvalSlaStatusTone: (
    status: AiApprovalSlaWorkspaceResponse['agents'][number]['simulatedSlaStatus'],
  ) => string;
  approvalStaffingStatusTone: (
    status: AiApprovalStaffingWorkspaceResponse['agents'][number]['staffingStatus'],
  ) => string;
  approvalStaffingStatusLabel: (
    status: AiApprovalStaffingWorkspaceResponse['agents'][number]['staffingStatus'],
  ) => string;
  approvalStaffingPlanStatusTone: (
    status: AiApprovalStaffingPlanWorkspaceResponse['agents'][number]['planStatus'],
  ) => string;
  approvalStaffingPlanStatusLabel: (
    status: AiApprovalStaffingPlanWorkspaceResponse['agents'][number]['planStatus'],
  ) => string;
  approvalRolloutStatusTone: (
    status: AiApprovalRolloutWorkspaceResponse['agents'][number]['rolloutStatus'],
  ) => string;
  approvalRolloutStatusLabel: (
    status: AiApprovalRolloutWorkspaceResponse['agents'][number]['rolloutStatus'],
  ) => string;
  approvalReadinessStatusTone: (
    status: AiApprovalReadinessWorkspaceResponse['agents'][number]['readinessStatus'],
  ) => string;
  approvalReadinessStatusLabel: (
    status: AiApprovalReadinessWorkspaceResponse['agents'][number]['readinessStatus'],
  ) => string;
  approvalLaunchStatusTone: (
    status: AiApprovalLaunchWorkspaceResponse['agents'][number]['launchStatus'],
  ) => string;
  approvalLaunchStatusLabel: (
    status: AiApprovalLaunchWorkspaceResponse['agents'][number]['launchStatus'],
  ) => string;
  tenantAiApprovalDesignWorkspace: AiApprovalDesignWorkspaceResponse | null;
  tenantAiApprovalDesignWorkspaceLoading: boolean;
  tenantAiApprovalCapacityWorkspace: AiApprovalCapacityWorkspaceResponse | null;
  tenantAiApprovalCapacityWorkspaceLoading: boolean;
  tenantAiApprovalSlaWorkspace: AiApprovalSlaWorkspaceResponse | null;
  tenantAiApprovalSlaWorkspaceLoading: boolean;
  tenantAiApprovalStaffingWorkspace: AiApprovalStaffingWorkspaceResponse | null;
  tenantAiApprovalStaffingWorkspaceLoading: boolean;
  tenantAiApprovalStaffingPlanWorkspace:
    | AiApprovalStaffingPlanWorkspaceResponse
    | null;
  tenantAiApprovalStaffingPlanWorkspaceLoading: boolean;
  tenantAiApprovalRolloutWorkspace: AiApprovalRolloutWorkspaceResponse | null;
  tenantAiApprovalRolloutWorkspaceLoading: boolean;
  tenantAiApprovalReadinessWorkspace:
    | AiApprovalReadinessWorkspaceResponse
    | null;
  tenantAiApprovalReadinessWorkspaceLoading: boolean;
  tenantAiApprovalLaunchWorkspace: AiApprovalLaunchWorkspaceResponse | null;
  tenantAiApprovalLaunchWorkspaceLoading: boolean;
};

export function AiApprovalPlanningSection({
  formatDate,
  humanizeKey,
  approvalSlaStatusLabel,
  approvalDesignStatusTone,
  approvalDesignStatusLabel,
  approvalCapacityStatusTone,
  approvalCapacityStatusLabel,
  approvalSlaStatusTone,
  approvalStaffingStatusTone,
  approvalStaffingStatusLabel,
  approvalStaffingPlanStatusTone,
  approvalStaffingPlanStatusLabel,
  approvalRolloutStatusTone,
  approvalRolloutStatusLabel,
  approvalReadinessStatusTone,
  approvalReadinessStatusLabel,
  approvalLaunchStatusTone,
  approvalLaunchStatusLabel,
  tenantAiApprovalDesignWorkspace,
  tenantAiApprovalDesignWorkspaceLoading,
  tenantAiApprovalCapacityWorkspace,
  tenantAiApprovalCapacityWorkspaceLoading,
  tenantAiApprovalSlaWorkspace,
  tenantAiApprovalSlaWorkspaceLoading,
  tenantAiApprovalStaffingWorkspace,
  tenantAiApprovalStaffingWorkspaceLoading,
  tenantAiApprovalStaffingPlanWorkspace,
  tenantAiApprovalStaffingPlanWorkspaceLoading,
  tenantAiApprovalRolloutWorkspace,
  tenantAiApprovalRolloutWorkspaceLoading,
  tenantAiApprovalReadinessWorkspace,
  tenantAiApprovalReadinessWorkspaceLoading,
  tenantAiApprovalLaunchWorkspace,
  tenantAiApprovalLaunchWorkspaceLoading,
}: Props) {
  return (
    <>
      <div className={styles.detailCard}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>AI approval design</span>
            <h3>Carga humana esperada por escenario de approval</h3>
          </div>
          <span className={styles.statusPill}>
            {tenantAiApprovalDesignWorkspace
              ? formatDate(tenantAiApprovalDesignWorkspace.generatedAt)
              : 'sin diseno'}
          </span>
        </div>

        <div className={styles.commercialMetricsGrid}>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Human reviews actuales</span>
            <strong>
              {tenantAiApprovalDesignWorkspace?.counts.currentExpectedHumanReviews ?? 0}
            </strong>
            <small>Backlog y handoffs reviewables bajo la postura actual.</small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Human reviews simulados</span>
            <strong>
              {tenantAiApprovalDesignWorkspace?.counts.simulatedExpectedHumanReviews ??
                0}
            </strong>
            <small>Carga esperada si pasamos a un diseno mas review-first.</small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Touches extra</span>
            <strong>
              {tenantAiApprovalDesignWorkspace?.counts.addedHumanReviewTouches ?? 0}
            </strong>
            <small>Revision adicional que el nuevo diseno agregaria.</small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Agentes con mas revision</span>
            <strong>
              {tenantAiApprovalDesignWorkspace?.counts.agentsWithHeavierReview ?? 0}
            </strong>
            <small>Agentes cuyo diseno aumentaria el trabajo humano.</small>
          </div>
        </div>

        <div className={styles.stack}>
          {tenantAiApprovalDesignWorkspace?.agents.length ? (
            tenantAiApprovalDesignWorkspace.agents.map((agent) => (
              <div
                className={styles.assistCueCard}
                key={`ai-approval-design:${agent.agentKey}`}
              >
                <div className={styles.invoiceCardHeader}>
                  <strong>{agent.title}</strong>
                  <span
                    className={`${styles.statusPill} ${approvalDesignStatusTone(
                      agent.designStatus,
                    )}`}
                  >
                    {approvalDesignStatusLabel(agent.designStatus)}
                  </span>
                </div>
                <small>
                  {humanizeKey(agent.domainKey)} · current load{' '}
                  {agent.currentExpectedReviewLoad.totalHumanReviewTouches} {'->'}{' '}
                  simulated load{' '}
                  {agent.simulatedExpectedReviewLoad.totalHumanReviewTouches}
                </small>
                <small>
                  Pending approvals {agent.currentExpectedReviewLoad.pendingApprovalRequests}
                  {' · '}reviewable handoffs{' '}
                  {agent.currentExpectedReviewLoad.reviewableSuggestionRuns}
                  {' · '}extra tool checkpoints{' '}
                  {agent.simulatedExpectedReviewLoad.promotedToolReviewPoints}
                </small>
                <div className={styles.stack}>
                  {agent.notes.map((note, index) => (
                    <small key={`ai-approval-design-note:${agent.agentKey}:${index}`}>
                      {note}
                    </small>
                  ))}
                </div>
                <div className={styles.stack}>
                  <small>
                    Approval policies:{' '}
                    {agent.approvalPolicyKeys.length
                      ? agent.approvalPolicyKeys.join(', ')
                      : 'none'}
                  </small>
                  <small>
                    Promoted tools:{' '}
                    {agent.promotedToolKeys.length
                      ? agent.promotedToolKeys.join(', ')
                      : 'none'}
                  </small>
                  <small>
                    Still blocked tools:{' '}
                    {agent.stillBlockedToolKeys.length
                      ? agent.stillBlockedToolKeys.join(', ')
                      : 'none'}
                  </small>
                </div>
              </div>
            ))
          ) : tenantAiApprovalDesignWorkspaceLoading ? (
            <small className={styles.muted}>
              Cargando diseno de approvals de AI...
            </small>
          ) : (
            <div className={styles.emptyState}>
              <p>
                Todavia no hay suficiente contexto para disenar escenarios de
                approval en este tenant.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.detailCard}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>AI approval capacity</span>
            <h3>Capacidad minima diaria de revision por agente</h3>
          </div>
          <span className={styles.statusPill}>
            {tenantAiApprovalCapacityWorkspace
              ? formatDate(tenantAiApprovalCapacityWorkspace.generatedAt)
              : 'sin capacidad'}
          </span>
        </div>

        <div className={styles.commercialMetricsGrid}>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Reviews/dia actual</span>
            <strong>
              {tenantAiApprovalCapacityWorkspace?.counts.currentMinimumReviewsPerDay ??
                0}
            </strong>
            <small>Piso minimo de toques humanos con la postura actual.</small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Reviews/dia simulado</span>
            <strong>
              {tenantAiApprovalCapacityWorkspace?.counts
                .simulatedMinimumReviewsPerDay ?? 0}
            </strong>
            <small>Piso minimo si abrimos el escenario review-first.</small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Carga extra/dia</span>
            <strong>
              {tenantAiApprovalCapacityWorkspace?.counts.addedReviewsPerDay ?? 0}
            </strong>
            <small>Revision diaria adicional para sostener el cambio.</small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Agentes en riesgo</span>
            <strong>
              {tenantAiApprovalCapacityWorkspace?.counts.agentsAtCapacityRisk ?? 0}
            </strong>
            <small>Agentes que pedirian buffer humano o rediseño.</small>
          </div>
        </div>

        <div className={styles.stack}>
          {tenantAiApprovalCapacityWorkspace?.agents.length ? (
            tenantAiApprovalCapacityWorkspace.agents.map((agent) => (
              <div
                className={styles.assistCueCard}
                key={`ai-approval-capacity:${agent.agentKey}`}
              >
                <div className={styles.invoiceCardHeader}>
                  <strong>{agent.title}</strong>
                  <span
                    className={`${styles.statusPill} ${approvalCapacityStatusTone(
                      agent.capacityStatus,
                    )}`}
                  >
                    {approvalCapacityStatusLabel(agent.capacityStatus)}
                  </span>
                </div>
                <small>
                  {humanizeKey(agent.domainKey)} · current{' '}
                  {agent.currentMinimumReviewsPerDay} {'->'} simulated{' '}
                  {agent.simulatedMinimumReviewsPerDay} review touch(es)/day
                </small>
                <small>
                  Added load: {agent.addedReviewsPerDay} {'· '}Approval policies:{' '}
                  {agent.approvalPolicyKeys.length
                    ? agent.approvalPolicyKeys.join(', ')
                    : 'none'}
                </small>
                <div className={styles.stack}>
                  {agent.bottleneckReasons.map((reason, index) => (
                    <small
                      key={`ai-approval-capacity-bottleneck:${agent.agentKey}:${index}`}
                    >
                      {reason}
                    </small>
                  ))}
                </div>
                <div className={styles.stack}>
                  {agent.notes.map((note, index) => (
                    <small key={`ai-approval-capacity-note:${agent.agentKey}:${index}`}>
                      {note}
                    </small>
                  ))}
                </div>
              </div>
            ))
          ) : tenantAiApprovalCapacityWorkspaceLoading ? (
            <small className={styles.muted}>
              Cargando capacidad de approvals de AI...
            </small>
          ) : (
            <div className={styles.emptyState}>
              <p>
                Todavia no hay suficiente contexto para estimar capacidad de
                approvals en este tenant.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.detailCard}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>AI approval SLA</span>
            <h3>Riesgo temporal del loop humano por agente</h3>
          </div>
          <span className={styles.statusPill}>
            {tenantAiApprovalSlaWorkspace
              ? formatDate(tenantAiApprovalSlaWorkspace.generatedAt)
              : 'sin SLA'}
          </span>
        </div>

        <div className={styles.commercialMetricsGrid}>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Backlog actual</span>
            <strong>
              {tenantAiApprovalSlaWorkspace?.counts.currentBacklogTouches ?? 0}
            </strong>
            <small>Touches humanos pendientes bajo la postura actual.</small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Backlog simulado</span>
            <strong>
              {tenantAiApprovalSlaWorkspace?.counts.simulatedBacklogTouches ?? 0}
            </strong>
            <small>Touches humanos si abrimos el escenario review-first.</small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Agentes en riesgo</span>
            <strong>
              {tenantAiApprovalSlaWorkspace?.counts.agentsAtRisk ?? 0}
            </strong>
            <small>Agentes que ya se acercan a incumplir same-day review.</small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Agentes breached</span>
            <strong>
              {tenantAiApprovalSlaWorkspace?.counts.agentsBreached ?? 0}
            </strong>
            <small>Agentes que ya necesitarian rediseño o buffer adicional.</small>
          </div>
        </div>

        <div className={styles.stack}>
          {tenantAiApprovalSlaWorkspace?.agents.length ? (
            tenantAiApprovalSlaWorkspace.agents.map((agent) => (
              <div className={styles.assistCueCard} key={`ai-approval-sla:${agent.agentKey}`}>
                <div className={styles.invoiceCardHeader}>
                  <strong>{agent.title}</strong>
                  <span
                    className={`${styles.statusPill} ${approvalSlaStatusTone(
                      agent.simulatedSlaStatus,
                    )}`}
                  >
                    {approvalSlaStatusLabel(agent.simulatedSlaStatus)}
                  </span>
                </div>
                <small>
                  {humanizeKey(agent.domainKey)} · current{' '}
                  {agent.currentEstimatedClearDays}d {'->'} simulated{' '}
                  {agent.simulatedEstimatedClearDays}d clear time
                </small>
                <small>
                  Current status {approvalSlaStatusLabel(agent.currentSlaStatus)}
                  {' · '}Pending approvals {agent.pendingApprovalRequests}
                  {' · '}Reviewable handoffs {agent.reviewableSuggestionRuns}
                </small>
                <div className={styles.stack}>
                  {agent.notes.map((note, index) => (
                    <small key={`ai-approval-sla-note:${agent.agentKey}:${index}`}>
                      {note}
                    </small>
                  ))}
                </div>
              </div>
            ))
          ) : tenantAiApprovalSlaWorkspaceLoading ? (
            <small className={styles.muted}>Cargando SLA de approvals de AI...</small>
          ) : (
            <div className={styles.emptyState}>
              <p>
                Todavia no hay suficiente contexto para estimar el SLA de
                approvals en este tenant.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.detailCard}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>AI approval staffing</span>
            <h3>Reviewer-equivalents minimos para sostener el loop</h3>
          </div>
          <span className={styles.statusPill}>
            {tenantAiApprovalStaffingWorkspace
              ? formatDate(tenantAiApprovalStaffingWorkspace.generatedAt)
              : 'sin staffing'}
          </span>
        </div>

        <div className={styles.commercialMetricsGrid}>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Reviewers actuales</span>
            <strong>
              {tenantAiApprovalStaffingWorkspace?.counts
                .currentRequiredReviewerEquivalents ?? 0}
            </strong>
            <small>Minimo equivalente para sostener same-day review hoy.</small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Reviewers simulados</span>
            <strong>
              {tenantAiApprovalStaffingWorkspace?.counts
                .simulatedRequiredReviewerEquivalents ?? 0}
            </strong>
            <small>Minimo equivalente si abrimos la postura review-first.</small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Cobertura extra</span>
            <strong>
              {tenantAiApprovalStaffingWorkspace?.counts.addedReviewerEquivalents ?? 0}
            </strong>
            <small>Reviewer-equivalents adicionales que harian falta.</small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Agentes con gap</span>
            <strong>
              {tenantAiApprovalStaffingWorkspace?.counts.agentsNeedingMoreCoverage ??
                0}
            </strong>
            <small>Agentes donde el staffing actual quedaria corto.</small>
          </div>
        </div>

        <div className={styles.stack}>
          {tenantAiApprovalStaffingWorkspace?.agents.length ? (
            tenantAiApprovalStaffingWorkspace.agents.map((agent) => (
              <div
                className={styles.assistCueCard}
                key={`ai-approval-staffing:${agent.agentKey}`}
              >
                <div className={styles.invoiceCardHeader}>
                  <strong>{agent.title}</strong>
                  <span
                    className={`${styles.statusPill} ${approvalStaffingStatusTone(
                      agent.staffingStatus,
                    )}`}
                  >
                    {approvalStaffingStatusLabel(agent.staffingStatus)}
                  </span>
                </div>
                <small>
                  {humanizeKey(agent.domainKey)} · current{' '}
                  {agent.currentRequiredReviewerEquivalents} {'->'} simulated{' '}
                  {agent.simulatedRequiredReviewerEquivalents} reviewer-equivalent(s)
                </small>
                <small>
                  Added coverage {agent.addedReviewerEquivalents}
                  {' · '}Approval policies:{' '}
                  {agent.approvalPolicyKeys.length
                    ? agent.approvalPolicyKeys.join(', ')
                    : 'none'}
                </small>
                <div className={styles.stack}>
                  {agent.staffingReasons.map((reason, index) => (
                    <small
                      key={`ai-approval-staffing-reason:${agent.agentKey}:${index}`}
                    >
                      {reason}
                    </small>
                  ))}
                </div>
                <div className={styles.stack}>
                  {agent.notes.map((note, index) => (
                    <small key={`ai-approval-staffing-note:${agent.agentKey}:${index}`}>
                      {note}
                    </small>
                  ))}
                </div>
              </div>
            ))
          ) : tenantAiApprovalStaffingWorkspaceLoading ? (
            <small className={styles.muted}>
              Cargando staffing de approvals de AI...
            </small>
          ) : (
            <div className={styles.emptyState}>
              <p>
                Todavia no hay suficiente contexto para estimar staffing de
                approvals en este tenant.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.detailCard}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>AI approval staffing plan</span>
            <h3>Reparto recomendado de cobertura por agente</h3>
          </div>
          <span className={styles.statusPill}>
            {tenantAiApprovalStaffingPlanWorkspace
              ? formatDate(tenantAiApprovalStaffingPlanWorkspace.generatedAt)
              : 'sin plan'}
          </span>
        </div>

        <div className={styles.commercialMetricsGrid}>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Coverage recomendada</span>
            <strong>
              {tenantAiApprovalStaffingPlanWorkspace?.counts
                .totalRecommendedReviewerEquivalents ?? 0}
            </strong>
            <small>Reviewer-equivalents totales recomendados por el plan.</small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Coverage extra</span>
            <strong>
              {tenantAiApprovalStaffingPlanWorkspace?.counts
                .totalAdditionalReviewerEquivalents ?? 0}
            </strong>
            <small>Reviewer-equivalents adicionales sobre la base actual.</small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Agentes a reforzar</span>
            <strong>
              {tenantAiApprovalStaffingPlanWorkspace?.counts.agentsRequiringIncrease ??
                0}
            </strong>
            <small>Agentes donde el plan pide aumentar cobertura.</small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Prioridades activas</span>
            <strong>
              {tenantAiApprovalStaffingPlanWorkspace?.counts.highestPriorityAgents ??
                0}
            </strong>
            <small>Agentes que deberían entrar primero al plan.</small>
          </div>
        </div>

        <div className={styles.stack}>
          {tenantAiApprovalStaffingPlanWorkspace?.agents.length ? (
            tenantAiApprovalStaffingPlanWorkspace.agents.map((agent) => (
              <div
                className={styles.assistCueCard}
                key={`ai-approval-staffing-plan:${agent.agentKey}`}
              >
                <div className={styles.invoiceCardHeader}>
                  <strong>
                    #{agent.priorityRank} {agent.title}
                  </strong>
                  <span
                    className={`${styles.statusPill} ${approvalStaffingPlanStatusTone(
                      agent.planStatus,
                    )}`}
                  >
                    {approvalStaffingPlanStatusLabel(agent.planStatus)}
                  </span>
                </div>
                <small>
                  {humanizeKey(agent.domainKey)} · current{' '}
                  {agent.currentRequiredReviewerEquivalents} {'->'} recommended{' '}
                  {agent.recommendedReviewerEquivalents} reviewer-equivalent(s)
                </small>
                <small>
                  Extra assignment {agent.additionalReviewerEquivalentsToAssign}
                  {' · '}Approval policies:{' '}
                  {agent.approvalPolicyKeys.length
                    ? agent.approvalPolicyKeys.join(', ')
                    : 'none'}
                </small>
                <div className={styles.stack}>
                  {agent.planActions.map((action, index) => (
                    <small
                      key={`ai-approval-staffing-plan-action:${agent.agentKey}:${index}`}
                    >
                      {action}
                    </small>
                  ))}
                </div>
                <div className={styles.stack}>
                  {agent.notes.map((note, index) => (
                    <small
                      key={`ai-approval-staffing-plan-note:${agent.agentKey}:${index}`}
                    >
                      {note}
                    </small>
                  ))}
                </div>
              </div>
            ))
          ) : tenantAiApprovalStaffingPlanWorkspaceLoading ? (
            <small className={styles.muted}>
              Cargando plan de staffing de approvals de AI...
            </small>
          ) : (
            <div className={styles.emptyState}>
              <p>
                Todavia no hay suficiente contexto para proponer un plan de
                staffing en este tenant.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.detailCard}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>AI approval rollout</span>
            <h3>Secuencia por fases para abrir review-first</h3>
          </div>
          <span className={styles.statusPill}>
            {tenantAiApprovalRolloutWorkspace
              ? formatDate(tenantAiApprovalRolloutWorkspace.generatedAt)
              : 'sin rollout'}
          </span>
        </div>

        <div className={styles.commercialMetricsGrid}>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Phase 1</span>
            <strong>{tenantAiApprovalRolloutWorkspace?.counts.phase1Agents ?? 0}</strong>
            <small>Agentes que piden refuerzo antes de abrir el path.</small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Phase 2</span>
            <strong>{tenantAiApprovalRolloutWorkspace?.counts.phase2Agents ?? 0}</strong>
            <small>Agentes que pueden entrar despues sin refuerzo extra.</small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Hold</span>
            <strong>{tenantAiApprovalRolloutWorkspace?.counts.holdAgents ?? 0}</strong>
            <small>Agentes que siguen bloqueados por restricciones de diseño.</small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Coverage extra</span>
            <strong>
              {tenantAiApprovalRolloutWorkspace?.counts
                .totalAdditionalReviewerEquivalents ?? 0}
            </strong>
            <small>Reviewer-equivalents extra a provisionar para el rollout.</small>
          </div>
        </div>

        <div className={styles.stack}>
          {tenantAiApprovalRolloutWorkspace?.agents.length ? (
            tenantAiApprovalRolloutWorkspace.agents.map((agent) => (
              <div
                className={styles.assistCueCard}
                key={`ai-approval-rollout:${agent.agentKey}`}
              >
                <div className={styles.invoiceCardHeader}>
                  <strong>
                    #{agent.priorityRank} {agent.title}
                  </strong>
                  <span
                    className={`${styles.statusPill} ${approvalRolloutStatusTone(
                      agent.rolloutStatus,
                    )}`}
                  >
                    {approvalRolloutStatusLabel(agent.rolloutStatus)}
                  </span>
                </div>
                <small>
                  {humanizeKey(agent.domainKey)} · {humanizeKey(agent.rolloutPhase)} ·
                  current {agent.currentRequiredReviewerEquivalents} {'->'} target{' '}
                  {agent.recommendedReviewerEquivalents}
                </small>
                <small>
                  Extra assignment {agent.additionalReviewerEquivalentsToAssign}
                  {' · '}Approval policies:{' '}
                  {agent.approvalPolicyKeys.length
                    ? agent.approvalPolicyKeys.join(', ')
                    : 'none'}
                </small>
                <div className={styles.stack}>
                  {agent.rolloutActions.map((action, index) => (
                    <small key={`ai-approval-rollout-action:${agent.agentKey}:${index}`}>
                      {action}
                    </small>
                  ))}
                </div>
                <div className={styles.stack}>
                  {agent.notes.map((note, index) => (
                    <small key={`ai-approval-rollout-note:${agent.agentKey}:${index}`}>
                      {note}
                    </small>
                  ))}
                </div>
              </div>
            ))
          ) : tenantAiApprovalRolloutWorkspaceLoading ? (
            <small className={styles.muted}>
              Cargando rollout de approvals de AI...
            </small>
          ) : (
            <div className={styles.emptyState}>
              <p>
                Todavia no hay suficiente contexto para ordenar un rollout de
                approvals en este tenant.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.detailCard}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>AI approval readiness</span>
            <h3>Que agente esta listo hoy para abrir review-first</h3>
          </div>
          <span className={styles.statusPill}>
            {tenantAiApprovalReadinessWorkspace
              ? formatDate(tenantAiApprovalReadinessWorkspace.generatedAt)
              : 'sin readiness'}
          </span>
        </div>

        <div className={styles.commercialMetricsGrid}>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Ready now</span>
            <strong>{tenantAiApprovalReadinessWorkspace?.counts.readyNowAgents ?? 0}</strong>
            <small>Agentes que ya pueden abrir el path con la cobertura actual.</small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Needs coverage</span>
            <strong>
              {tenantAiApprovalReadinessWorkspace?.counts.needsCoverageAgents ?? 0}
            </strong>
            <small>Agentes que primero necesitan refuerzo humano o bajar riesgo.</small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Blocked</span>
            <strong>{tenantAiApprovalReadinessWorkspace?.counts.blockedAgents ?? 0}</strong>
            <small>Agentes que siguen cerrados por guardrails de diseño.</small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Total</span>
            <strong>{tenantAiApprovalReadinessWorkspace?.counts.totalAgents ?? 0}</strong>
            <small>Agentes AI visibles en esta lectura compacta de readiness.</small>
          </div>
        </div>

        <div className={styles.stack}>
          {tenantAiApprovalReadinessWorkspace?.agents.length ? (
            tenantAiApprovalReadinessWorkspace.agents.map((agent) => (
              <div
                className={styles.assistCueCard}
                key={`ai-approval-readiness:${agent.agentKey}`}
              >
                <div className={styles.invoiceCardHeader}>
                  <strong>{agent.title}</strong>
                  <span
                    className={`${styles.statusPill} ${approvalReadinessStatusTone(
                      agent.readinessStatus,
                    )}`}
                  >
                    {approvalReadinessStatusLabel(agent.readinessStatus)}
                  </span>
                </div>
                <small>
                  {humanizeKey(agent.domainKey)} · {humanizeKey(agent.rolloutPhase)} ·
                  current {agent.currentRequiredReviewerEquivalents} {'->'} target{' '}
                  {agent.recommendedReviewerEquivalents}
                </small>
                <small>
                  SLA {approvalSlaStatusLabel(agent.currentSlaStatus)} {'->'}{' '}
                  {approvalSlaStatusLabel(agent.simulatedSlaStatus)} {' · '}extra
                  coverage {agent.additionalReviewerEquivalentsToAssign}
                </small>
                <small>{agent.nextStep}</small>
                <div className={styles.stack}>
                  {agent.readinessReasons.map((reason, index) => (
                    <small
                      key={`ai-approval-readiness-reason:${agent.agentKey}:${index}`}
                    >
                      {reason}
                    </small>
                  ))}
                </div>
                <div className={styles.stack}>
                  {agent.notes.map((note, index) => (
                    <small key={`ai-approval-readiness-note:${agent.agentKey}:${index}`}>
                      {note}
                    </small>
                  ))}
                </div>
              </div>
            ))
          ) : tenantAiApprovalReadinessWorkspaceLoading ? (
            <small className={styles.muted}>
              Cargando readiness de approvals de AI...
            </small>
          ) : (
            <div className={styles.emptyState}>
              <p>
                Todavia no hay suficiente contexto para decidir readiness de
                approvals en este tenant.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.detailCard}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>AI approval launch</span>
            <h3>Recomendacion explicita para abrir el path por agente</h3>
          </div>
          <span className={styles.statusPill}>
            {tenantAiApprovalLaunchWorkspace
              ? formatDate(tenantAiApprovalLaunchWorkspace.generatedAt)
              : 'sin launch plan'}
          </span>
        </div>

        <div className={styles.commercialMetricsGrid}>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Launch now</span>
            <strong>{tenantAiApprovalLaunchWorkspace?.counts.launchNowAgents ?? 0}</strong>
            <small>Agentes que podemos abrir en la ventana actual.</small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Pilot next</span>
            <strong>
              {tenantAiApprovalLaunchWorkspace?.counts.pilotAfterCoverageAgents ?? 0}
            </strong>
            <small>Agentes que primero necesitan cobertura o estabilizar SLA.</small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Hold</span>
            <strong>{tenantAiApprovalLaunchWorkspace?.counts.holdAgents ?? 0}</strong>
            <small>Agentes que no deberiamos meter todavia en launch scope.</small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Coverage gap</span>
            <strong>{tenantAiApprovalLaunchWorkspace?.counts.totalCoverageGap ?? 0}</strong>
            <small>Reviewer-equivalents que faltan para el siguiente corte.</small>
          </div>
        </div>

        <div className={styles.stack}>
          {tenantAiApprovalLaunchWorkspace?.agents.length ? (
            tenantAiApprovalLaunchWorkspace.agents.map((agent) => (
              <div
                className={styles.assistCueCard}
                key={`ai-approval-launch:${agent.agentKey}`}
              >
                <div className={styles.invoiceCardHeader}>
                  <strong>{agent.title}</strong>
                  <span
                    className={`${styles.statusPill} ${approvalLaunchStatusTone(
                      agent.launchStatus,
                    )}`}
                  >
                    {approvalLaunchStatusLabel(agent.launchStatus)}
                  </span>
                </div>
                <small>
                  {humanizeKey(agent.domainKey)} · {humanizeKey(agent.launchWindow)} ·{' '}
                  {humanizeKey(agent.rolloutPhase)}
                </small>
                <small>
                  Coverage {agent.currentRequiredReviewerEquivalents} {'->'}{' '}
                  {agent.recommendedReviewerEquivalents} {' · '}SLA{' '}
                  {approvalSlaStatusLabel(agent.simulatedSlaStatus)}
                </small>
                <small>{agent.recommendedAction}</small>
                <div className={styles.stack}>
                  {agent.launchChecklist.map((item, index) => (
                    <small key={`ai-approval-launch-check:${agent.agentKey}:${index}`}>
                      {item}
                    </small>
                  ))}
                </div>
                <div className={styles.stack}>
                  {agent.notes.map((note, index) => (
                    <small key={`ai-approval-launch-note:${agent.agentKey}:${index}`}>
                      {note}
                    </small>
                  ))}
                </div>
              </div>
            ))
          ) : tenantAiApprovalLaunchWorkspaceLoading ? (
            <small className={styles.muted}>
              Cargando launch workspace de approvals de AI...
            </small>
          ) : (
            <div className={styles.emptyState}>
              <p>
                Todavia no hay suficiente contexto para decidir launch de
                approvals en este tenant.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
