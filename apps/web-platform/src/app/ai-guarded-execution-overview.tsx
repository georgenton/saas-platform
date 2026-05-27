import styles from './app.module.css';
import {
  guardedExecutionAuditStatusLabel,
  guardedExecutionAuditStatusTone,
  guardedExecutionLaunchStatusLabel,
  guardedExecutionLaunchStatusTone,
  guardedExecutionMonitorStatusLabel,
  guardedExecutionMonitorStatusTone,
  guardedExecutionPilotStatusLabel,
  guardedExecutionPilotStatusTone,
  guardedExecutionRollbackStatusLabel,
  guardedExecutionRollbackStatusTone,
  guardedExecutionRunbookStatusLabel,
  guardedExecutionRunbookStatusTone,
  guardedExecutionStatusLabel,
  guardedExecutionStatusTone,
} from './ai-console-support';
import {
  AiGuardedExecutionAuditWorkspaceResponse,
  AiGuardedExecutionLaunchWorkspaceResponse,
  AiGuardedExecutionMonitorWorkspaceResponse,
  AiGuardedExecutionPilotWorkspaceResponse,
  AiGuardedExecutionRollbackWorkspaceResponse,
  AiGuardedExecutionRunbookWorkspaceResponse,
  AiGuardedExecutionWorkspaceResponse,
  AiOperatingModelAgentResponse,
} from './types';

type Props = {
  formatDate: (value: string | null) => string;
  humanizeKey: (value: string | null) => string;
  approvalSlaStatusLabel: (
    status: 'on_track' | 'at_risk' | 'breached',
  ) => string;
  resolveAiGuardedExecutionCandidate: (
    agentKey: string,
  ) => AiOperatingModelAgentResponse['guardedExecutionCandidate'];
  tenantAiGuardedExecutionWorkspace: AiGuardedExecutionWorkspaceResponse | null;
  tenantAiGuardedExecutionWorkspaceLoading: boolean;
  tenantAiGuardedExecutionPilotWorkspace: AiGuardedExecutionPilotWorkspaceResponse | null;
  tenantAiGuardedExecutionPilotWorkspaceLoading: boolean;
  tenantAiGuardedExecutionRunbookWorkspace: AiGuardedExecutionRunbookWorkspaceResponse | null;
  tenantAiGuardedExecutionRunbookWorkspaceLoading: boolean;
  tenantAiGuardedExecutionRollbackWorkspace: AiGuardedExecutionRollbackWorkspaceResponse | null;
  tenantAiGuardedExecutionRollbackWorkspaceLoading: boolean;
  tenantAiGuardedExecutionAuditWorkspace: AiGuardedExecutionAuditWorkspaceResponse | null;
  tenantAiGuardedExecutionAuditWorkspaceLoading: boolean;
  tenantAiGuardedExecutionLaunchWorkspace: AiGuardedExecutionLaunchWorkspaceResponse | null;
  tenantAiGuardedExecutionLaunchWorkspaceLoading: boolean;
  tenantAiGuardedExecutionMonitorWorkspace: AiGuardedExecutionMonitorWorkspaceResponse | null;
  tenantAiGuardedExecutionMonitorWorkspaceLoading: boolean;
};

function renderCandidateLaneSummary(input: {
  agentKey: string;
  candidateToolKey: string | null;
  simulatedSlaStatus: 'on_track' | 'at_risk' | 'breached';
  resolveAiGuardedExecutionCandidate: Props['resolveAiGuardedExecutionCandidate'];
  approvalSlaStatusLabel: Props['approvalSlaStatusLabel'];
}) {
  return (
    <>
      Candidate lane{' '}
      {input.resolveAiGuardedExecutionCandidate(input.agentKey)?.title ??
        input.candidateToolKey ??
        'none'}{' '}
      {'·'} SLA {input.approvalSlaStatusLabel(input.simulatedSlaStatus)}
    </>
  );
}

export function AiGuardedExecutionOverview({
  formatDate,
  humanizeKey,
  approvalSlaStatusLabel,
  resolveAiGuardedExecutionCandidate,
  tenantAiGuardedExecutionWorkspace,
  tenantAiGuardedExecutionWorkspaceLoading,
  tenantAiGuardedExecutionPilotWorkspace,
  tenantAiGuardedExecutionPilotWorkspaceLoading,
  tenantAiGuardedExecutionRunbookWorkspace,
  tenantAiGuardedExecutionRunbookWorkspaceLoading,
  tenantAiGuardedExecutionRollbackWorkspace,
  tenantAiGuardedExecutionRollbackWorkspaceLoading,
  tenantAiGuardedExecutionAuditWorkspace,
  tenantAiGuardedExecutionAuditWorkspaceLoading,
  tenantAiGuardedExecutionLaunchWorkspace,
  tenantAiGuardedExecutionLaunchWorkspaceLoading,
  tenantAiGuardedExecutionMonitorWorkspace,
  tenantAiGuardedExecutionMonitorWorkspaceLoading,
}: Props) {
  return (
    <>
      <div className={styles.detailCard}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>AI guarded execution</span>
            <h3>Que agente podria pasar de suggestion mode a un piloto guardado</h3>
          </div>
          <span className={styles.statusPill}>
            {tenantAiGuardedExecutionWorkspace
              ? formatDate(tenantAiGuardedExecutionWorkspace.generatedAt)
              : 'sin guarded execution'}
          </span>
        </div>

        <div className={styles.commercialMetricsGrid}>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Pilot candidates</span>
            <strong>
              {tenantAiGuardedExecutionWorkspace?.counts.pilotCandidateAgents ?? 0}
            </strong>
            <small>Agentes que ya podrian entrar a un piloto guardado narrow.</small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Needs launch readiness</span>
            <strong>
              {tenantAiGuardedExecutionWorkspace?.counts.needsLaunchReadinessAgents ??
                0}
            </strong>
            <small>
              Agentes con candidate tools, pero todavia sin condiciones operativas
              suficientes.
            </small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Suggestion only</span>
            <strong>
              {tenantAiGuardedExecutionWorkspace?.counts.suggestionOnlyAgents ?? 0}
            </strong>
            <small>
              Agentes que aun no tienen un path real para guarded execution.
            </small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Candidate tools</span>
            <strong>
              {tenantAiGuardedExecutionWorkspace?.counts.executionCandidateTools ?? 0}
            </strong>
            <small>
              Tools que hoy viven solo como candidatos a ejecucion guardada.
            </small>
          </div>
        </div>

        <div className={styles.stack}>
          {tenantAiGuardedExecutionWorkspace?.agents.length ? (
            tenantAiGuardedExecutionWorkspace.agents.map((agent) => (
              <div
                className={styles.assistCueCard}
                key={`ai-guarded-execution:${agent.agentKey}`}
              >
                <div className={styles.invoiceCardHeader}>
                  <strong>{agent.title}</strong>
                  <span
                    className={`${styles.statusPill} ${guardedExecutionStatusTone(
                      agent.guardedExecutionStatus,
                    )}`}
                  >
                    {guardedExecutionStatusLabel(agent.guardedExecutionStatus)}
                  </span>
                </div>
                <small>
                  {humanizeKey(agent.domainKey)} · mode {humanizeKey(agent.currentMode)} ·
                  {humanizeKey(agent.rolloutPhase)}
                </small>
                <small>
                  Pending approvals {agent.pendingApprovalRequests} {'·'} Reviewable
                  runs {agent.reviewableSuggestionRuns}
                </small>
                <small>{agent.nextStep}</small>
                <div className={styles.stack}>
                  {agent.guardrailChecklist.map((item, index) => (
                    <small
                      key={`ai-guarded-execution-check:${agent.agentKey}:${index}`}
                    >
                      {item}
                    </small>
                  ))}
                </div>
                <div className={styles.stack}>
                  {agent.notes.map((note, index) => (
                    <small key={`ai-guarded-execution-note:${agent.agentKey}:${index}`}>
                      {note}
                    </small>
                  ))}
                </div>
              </div>
            ))
          ) : tenantAiGuardedExecutionWorkspaceLoading ? (
            <small className={styles.muted}>
              Cargando guarded execution workspace de AI...
            </small>
          ) : (
            <div className={styles.emptyState}>
              <p>
                Todavia no hay suficiente contexto para decidir pilotos de guarded
                execution en este tenant.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.detailCard}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>AI guarded execution pilot</span>
            <h3>Como seria el primer piloto narrow por agente</h3>
          </div>
          <span className={styles.statusPill}>
            {tenantAiGuardedExecutionPilotWorkspace
              ? formatDate(tenantAiGuardedExecutionPilotWorkspace.generatedAt)
              : 'sin pilot plan'}
          </span>
        </div>

        <div className={styles.commercialMetricsGrid}>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Ready for pilot</span>
            <strong>
              {tenantAiGuardedExecutionPilotWorkspace?.counts.readyForPilotAgents ?? 0}
            </strong>
            <small>Agentes que ya podrian entrar a un piloto narrow controlado.</small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Needs backing</span>
            <strong>
              {tenantAiGuardedExecutionPilotWorkspace?.counts
                .needsOperationalBackingAgents ?? 0}
            </strong>
            <small>
              Agentes con idea de piloto, pero sin respaldo operativo suficiente.
            </small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>No candidate</span>
            <strong>
              {tenantAiGuardedExecutionPilotWorkspace?.counts.noCandidateAgents ?? 0}
            </strong>
            <small>
              Agentes que todavia no tienen un tool concreto para pilotar.
            </small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Candidate pilots</span>
            <strong>
              {tenantAiGuardedExecutionPilotWorkspace?.counts.candidateToolPilots ?? 0}
            </strong>
            <small>
              Tools concretos que ya sirven como primer scope de piloto.
            </small>
          </div>
        </div>

        <div className={styles.stack}>
          {tenantAiGuardedExecutionPilotWorkspace?.agents.length ? (
            tenantAiGuardedExecutionPilotWorkspace.agents.map((agent) => (
              <div
                className={styles.assistCueCard}
                key={`ai-guarded-execution-pilot:${agent.agentKey}`}
              >
                <div className={styles.invoiceCardHeader}>
                  <strong>{agent.title}</strong>
                  <span
                    className={`${styles.statusPill} ${guardedExecutionPilotStatusTone(
                      agent.pilotStatus,
                    )}`}
                  >
                    {guardedExecutionPilotStatusLabel(agent.pilotStatus)}
                  </span>
                </div>
                <small>
                  {humanizeKey(agent.domainKey)} · {humanizeKey(agent.pilotType)} ·
                  {humanizeKey(agent.rolloutPhase)}
                </small>
                <small>
                  {renderCandidateLaneSummary({
                    agentKey: agent.agentKey,
                    candidateToolKey: agent.candidateToolKey,
                    simulatedSlaStatus: agent.simulatedSlaStatus,
                    resolveAiGuardedExecutionCandidate,
                    approvalSlaStatusLabel,
                  })}
                </small>
                <small>{agent.recommendedPilotScope}</small>
                <small>{agent.nextStep}</small>
                <div className={styles.stack}>
                  {agent.pilotPreconditions.map((item, index) => (
                    <small
                      key={`ai-guarded-execution-pilot-pre:${agent.agentKey}:${index}`}
                    >
                      {item}
                    </small>
                  ))}
                </div>
                <div className={styles.stack}>
                  {agent.pilotGuardrails.map((item, index) => (
                    <small
                      key={`ai-guarded-execution-pilot-guard:${agent.agentKey}:${index}`}
                    >
                      {item}
                    </small>
                  ))}
                </div>
                <div className={styles.stack}>
                  {agent.notes.map((note, index) => (
                    <small
                      key={`ai-guarded-execution-pilot-note:${agent.agentKey}:${index}`}
                    >
                      {note}
                    </small>
                  ))}
                </div>
              </div>
            ))
          ) : tenantAiGuardedExecutionPilotWorkspaceLoading ? (
            <small className={styles.muted}>
              Cargando guarded execution pilot workspace de AI...
            </small>
          ) : (
            <div className={styles.emptyState}>
              <p>
                Todavia no hay suficiente contexto para definir el primer piloto
                narrow de guarded execution.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.detailCard}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>AI guarded execution runbook</span>
            <h3>Como operar el piloto con lane, gate y stop conditions explicitas</h3>
          </div>
          <span className={styles.statusPill}>
            {tenantAiGuardedExecutionRunbookWorkspace
              ? formatDate(tenantAiGuardedExecutionRunbookWorkspace.generatedAt)
              : 'sin runbook'}
          </span>
        </div>

        <div className={styles.commercialMetricsGrid}>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Ready to document</span>
            <strong>
              {tenantAiGuardedExecutionRunbookWorkspace?.counts.readyToDocumentAgents ??
                0}
            </strong>
            <small>
              Agentes que ya pueden documentar un runbook narrow con execute path
              guardado.
            </small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Needs design</span>
            <strong>
              {tenantAiGuardedExecutionRunbookWorkspace?.counts.needsDesignAgents ?? 0}
            </strong>
            <small>
              Agentes que aun necesitan shadow review o cierre operativo antes del
              runbook final.
            </small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Not available</span>
            <strong>
              {tenantAiGuardedExecutionRunbookWorkspace?.counts.notAvailableAgents ??
                0}
            </strong>
            <small>
              Agentes sin candidate tool concreto para bajar a runbook.
            </small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Candidate runbooks</span>
            <strong>
              {tenantAiGuardedExecutionRunbookWorkspace?.counts.candidateRunbooks ?? 0}
            </strong>
            <small>
              Scopes concretos que ya pueden aterrizarse como lane operativa.
            </small>
          </div>
        </div>

        <div className={styles.stack}>
          {tenantAiGuardedExecutionRunbookWorkspace?.agents.length ? (
            tenantAiGuardedExecutionRunbookWorkspace.agents.map((agent) => (
              <div
                className={styles.assistCueCard}
                key={`ai-guarded-execution-runbook:${agent.agentKey}`}
              >
                <div className={styles.invoiceCardHeader}>
                  <strong>{agent.title}</strong>
                  <span
                    className={`${styles.statusPill} ${guardedExecutionRunbookStatusTone(
                      agent.runbookStatus,
                    )}`}
                  >
                    {guardedExecutionRunbookStatusLabel(agent.runbookStatus)}
                  </span>
                </div>
                <small>
                  {humanizeKey(agent.domainKey)} · {humanizeKey(agent.pilotType)} ·
                  {humanizeKey(agent.rolloutPhase)}
                </small>
                <small>
                  Lane {humanizeKey(agent.operatingLane)} {'·'} Gate {agent.namedHumanGate}
                  {' · '}Blast radius {humanizeKey(agent.blastRadius)}
                </small>
                <small>
                  {renderCandidateLaneSummary({
                    agentKey: agent.agentKey,
                    candidateToolKey: agent.candidateToolKey,
                    simulatedSlaStatus: agent.simulatedSlaStatus,
                    resolveAiGuardedExecutionCandidate,
                    approvalSlaStatusLabel,
                  })}
                </small>
                <small>{agent.nextStep}</small>
                <div className={styles.stack}>
                  {agent.entryChecklist.map((item, index) => (
                    <small
                      key={`ai-guarded-execution-runbook-entry:${agent.agentKey}:${index}`}
                    >
                      {item}
                    </small>
                  ))}
                </div>
                <div className={styles.stack}>
                  {agent.stopConditions.map((item, index) => (
                    <small
                      key={`ai-guarded-execution-runbook-stop:${agent.agentKey}:${index}`}
                    >
                      {item}
                    </small>
                  ))}
                </div>
                <div className={styles.stack}>
                  {agent.exitCriteria.map((item, index) => (
                    <small
                      key={`ai-guarded-execution-runbook-exit:${agent.agentKey}:${index}`}
                    >
                      {item}
                    </small>
                  ))}
                </div>
                <div className={styles.stack}>
                  {agent.notes.map((note, index) => (
                    <small
                      key={`ai-guarded-execution-runbook-note:${agent.agentKey}:${index}`}
                    >
                      {note}
                    </small>
                  ))}
                </div>
              </div>
            ))
          ) : tenantAiGuardedExecutionRunbookWorkspaceLoading ? (
            <small className={styles.muted}>
              Cargando guarded execution runbook workspace de AI...
            </small>
          ) : (
            <div className={styles.emptyState}>
              <p>
                Todavia no hay suficiente contexto para definir runbooks de guarded
                execution en este tenant.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.detailCard}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>AI guarded execution rollback</span>
            <h3>Como contener el piloto y volver a suggestion mode sin perder control</h3>
          </div>
          <span className={styles.statusPill}>
            {tenantAiGuardedExecutionRollbackWorkspace
              ? formatDate(tenantAiGuardedExecutionRollbackWorkspace.generatedAt)
              : 'sin rollback'}
          </span>
        </div>

        <div className={styles.commercialMetricsGrid}>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Ready with rollback</span>
            <strong>
              {tenantAiGuardedExecutionRollbackWorkspace?.counts
                .readyWithRollbackAgents ?? 0}
            </strong>
            <small>
              Agentes que ya tienen suficiente forma para documentar rollback junto
              al execute path.
            </small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Needs rollback design</span>
            <strong>
              {tenantAiGuardedExecutionRollbackWorkspace?.counts
                .needsRollbackDesignAgents ?? 0}
            </strong>
            <small>
              Agentes que aun necesitan disenar bien contencion y reversion antes
              de abrir el lane.
            </small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Not applicable</span>
            <strong>
              {tenantAiGuardedExecutionRollbackWorkspace?.counts.notApplicableAgents ??
                0}
            </strong>
            <small>
              Agentes que todavia no tienen lane ejecutable como para exigir rollback.
            </small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Rollback candidates</span>
            <strong>
              {tenantAiGuardedExecutionRollbackWorkspace?.counts
                .rollbackCandidateTools ?? 0}
            </strong>
            <small>
              Candidate tools que ya requieren fallback y reversion explicita.
            </small>
          </div>
        </div>

        <div className={styles.stack}>
          {tenantAiGuardedExecutionRollbackWorkspace?.agents.length ? (
            tenantAiGuardedExecutionRollbackWorkspace.agents.map((agent) => (
              <div
                className={styles.assistCueCard}
                key={`ai-guarded-execution-rollback:${agent.agentKey}`}
              >
                <div className={styles.invoiceCardHeader}>
                  <strong>{agent.title}</strong>
                  <span
                    className={`${styles.statusPill} ${guardedExecutionRollbackStatusTone(
                      agent.rollbackStatus,
                    )}`}
                  >
                    {guardedExecutionRollbackStatusLabel(agent.rollbackStatus)}
                  </span>
                </div>
                <small>
                  {humanizeKey(agent.domainKey)} · {humanizeKey(agent.pilotType)} ·
                  {humanizeKey(agent.rolloutPhase)}
                </small>
                <small>
                  Rollback owner {agent.rollbackOwner} {'·'} Blast radius{' '}
                  {humanizeKey(agent.blastRadius)}
                </small>
                <small>
                  Fallback {humanizeKey(agent.safeFallbackMode)} {'·'} Runbook{' '}
                  {humanizeKey(agent.runbookStatus)}
                </small>
                <small>{agent.nextStep}</small>
                <div className={styles.stack}>
                  {agent.rollbackTriggerSummary.map((item, index) => (
                    <small
                      key={`ai-guarded-execution-rollback-trigger:${agent.agentKey}:${index}`}
                    >
                      {item}
                    </small>
                  ))}
                </div>
                <div className={styles.stack}>
                  {agent.rollbackSteps.map((item, index) => (
                    <small
                      key={`ai-guarded-execution-rollback-step:${agent.agentKey}:${index}`}
                    >
                      {item}
                    </small>
                  ))}
                </div>
                <div className={styles.stack}>
                  {agent.verificationChecks.map((item, index) => (
                    <small
                      key={`ai-guarded-execution-rollback-check:${agent.agentKey}:${index}`}
                    >
                      {item}
                    </small>
                  ))}
                </div>
                <div className={styles.stack}>
                  {agent.notes.map((note, index) => (
                    <small
                      key={`ai-guarded-execution-rollback-note:${agent.agentKey}:${index}`}
                    >
                      {note}
                    </small>
                  ))}
                </div>
              </div>
            ))
          ) : tenantAiGuardedExecutionRollbackWorkspaceLoading ? (
            <small className={styles.muted}>
              Cargando guarded execution rollback workspace de AI...
            </small>
          ) : (
            <div className={styles.emptyState}>
              <p>
                Todavia no hay suficiente contexto para definir rollback de guarded
                execution en este tenant.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.detailCard}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>AI guarded execution audit</span>
            <h3>Que evidencia y trail humano harian auditable el primer lane</h3>
          </div>
          <span className={styles.statusPill}>
            {tenantAiGuardedExecutionAuditWorkspace
              ? formatDate(tenantAiGuardedExecutionAuditWorkspace.generatedAt)
              : 'sin audit'}
          </span>
        </div>

        <div className={styles.commercialMetricsGrid}>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Ready for audit</span>
            <strong>
              {tenantAiGuardedExecutionAuditWorkspace?.counts.readyForAuditAgents ?? 0}
            </strong>
            <small>
              Agentes que ya podrían empaquetar evidencia formal para el primer lane
              guardado.
            </small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Needs evidence design</span>
            <strong>
              {tenantAiGuardedExecutionAuditWorkspace?.counts
                .needsEvidenceDesignAgents ?? 0}
            </strong>
            <small>
              Agentes que todavía necesitan mejor evidencia, logging y trail humano
              antes de auditarse bien.
            </small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Not applicable</span>
            <strong>
              {tenantAiGuardedExecutionAuditWorkspace?.counts.notApplicableAgents ??
                0}
            </strong>
            <small>
              Agentes que aún no tienen candidate tool como para exigir paquete de
              auditoría.
            </small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Audit candidates</span>
            <strong>
              {tenantAiGuardedExecutionAuditWorkspace?.counts.auditCandidateTools ?? 0}
            </strong>
            <small>
              Scopes ejecutables que ya exigen evidencia y trazabilidad explícitas.
            </small>
          </div>
        </div>

        <div className={styles.stack}>
          {tenantAiGuardedExecutionAuditWorkspace?.agents.length ? (
            tenantAiGuardedExecutionAuditWorkspace.agents.map((agent) => (
              <div
                className={styles.assistCueCard}
                key={`ai-guarded-execution-audit:${agent.agentKey}`}
              >
                <div className={styles.invoiceCardHeader}>
                  <strong>{agent.title}</strong>
                  <span
                    className={`${styles.statusPill} ${guardedExecutionAuditStatusTone(
                      agent.auditStatus,
                    )}`}
                  >
                    {guardedExecutionAuditStatusLabel(agent.auditStatus)}
                  </span>
                </div>
                <small>
                  {humanizeKey(agent.domainKey)} · {humanizeKey(agent.pilotType)} ·
                  {humanizeKey(agent.rolloutPhase)}
                </small>
                <small>
                  Audit owner {agent.auditOwner} {'·'} Fallback{' '}
                  {humanizeKey(agent.safeFallbackMode)}
                </small>
                <small>
                  {renderCandidateLaneSummary({
                    agentKey: agent.agentKey,
                    candidateToolKey: agent.candidateToolKey,
                    simulatedSlaStatus: agent.simulatedSlaStatus,
                    resolveAiGuardedExecutionCandidate,
                    approvalSlaStatusLabel,
                  })}
                </small>
                <small>{agent.nextStep}</small>
                <div className={styles.stack}>
                  {agent.evidencePackSummary.map((item, index) => (
                    <small
                      key={`ai-guarded-execution-audit-evidence:${agent.agentKey}:${index}`}
                    >
                      {item}
                    </small>
                  ))}
                </div>
                <div className={styles.stack}>
                  {agent.requiredArtifacts.map((item, index) => (
                    <small
                      key={`ai-guarded-execution-audit-artifact:${agent.agentKey}:${index}`}
                    >
                      {item}
                    </small>
                  ))}
                </div>
                <div className={styles.stack}>
                  {agent.loggingChecks.map((item, index) => (
                    <small
                      key={`ai-guarded-execution-audit-log:${agent.agentKey}:${index}`}
                    >
                      {item}
                    </small>
                  ))}
                </div>
                <div className={styles.stack}>
                  {agent.reviewTrailSummary.map((item, index) => (
                    <small
                      key={`ai-guarded-execution-audit-review:${agent.agentKey}:${index}`}
                    >
                      {item}
                    </small>
                  ))}
                </div>
                <div className={styles.stack}>
                  {agent.notes.map((note, index) => (
                    <small
                      key={`ai-guarded-execution-audit-note:${agent.agentKey}:${index}`}
                    >
                      {note}
                    </small>
                  ))}
                </div>
              </div>
            ))
          ) : tenantAiGuardedExecutionAuditWorkspaceLoading ? (
            <small className={styles.muted}>
              Cargando guarded execution audit workspace de AI...
            </small>
          ) : (
            <div className={styles.emptyState}>
              <p>
                Todavia no hay suficiente contexto para definir evidencia de
                auditoria para guarded execution en este tenant.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.detailCard}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>AI guarded execution launch</span>
            <h3>Que agente ya puede abrir un lane guardado y cual debe quedarse en piloto</h3>
          </div>
          <span className={styles.statusPill}>
            {tenantAiGuardedExecutionLaunchWorkspace
              ? formatDate(tenantAiGuardedExecutionLaunchWorkspace.generatedAt)
              : 'sin launch'}
          </span>
        </div>

        <div className={styles.commercialMetricsGrid}>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Ready to launch</span>
            <strong>
              {tenantAiGuardedExecutionLaunchWorkspace?.counts.readyToLaunchAgents ?? 0}
            </strong>
            <small>
              Agentes que ya tendrían un go explícito para abrir un lane guardado
              narrow.
            </small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Pilot only</span>
            <strong>
              {tenantAiGuardedExecutionLaunchWorkspace?.counts.pilotOnlyAgents ?? 0}
            </strong>
            <small>
              Agentes que todavía deben quedarse en piloto o shadow-review antes del
              go-live.
            </small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Hold</span>
            <strong>
              {tenantAiGuardedExecutionLaunchWorkspace?.counts.holdAgents ?? 0}
            </strong>
            <small>Agentes que aún deben permanecer en suggestion mode.</small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Launch candidates</span>
            <strong>
              {tenantAiGuardedExecutionLaunchWorkspace?.counts.launchCandidateTools ?? 0}
            </strong>
            <small>
              Tools candidatos que ya entran en conversación real de go/no-go.
            </small>
          </div>
        </div>

        <div className={styles.stack}>
          {tenantAiGuardedExecutionLaunchWorkspace?.agents.length ? (
            tenantAiGuardedExecutionLaunchWorkspace.agents.map((agent) => (
              <div
                className={styles.assistCueCard}
                key={`ai-guarded-execution-launch:${agent.agentKey}`}
              >
                <div className={styles.invoiceCardHeader}>
                  <strong>{agent.title}</strong>
                  <span
                    className={`${styles.statusPill} ${guardedExecutionLaunchStatusTone(
                      agent.launchStatus,
                    )}`}
                  >
                    {guardedExecutionLaunchStatusLabel(agent.launchStatus)}
                  </span>
                </div>
                <small>
                  {humanizeKey(agent.domainKey)} · {humanizeKey(agent.pilotType)} ·
                  {humanizeKey(agent.launchWindow)}
                </small>
                <small>
                  Launch owner {agent.launchOwner} {'·'} Fallback{' '}
                  {humanizeKey(agent.safeFallbackMode)}
                </small>
                <small>
                  {renderCandidateLaneSummary({
                    agentKey: agent.agentKey,
                    candidateToolKey: agent.candidateToolKey,
                    simulatedSlaStatus: agent.simulatedSlaStatus,
                    resolveAiGuardedExecutionCandidate,
                    approvalSlaStatusLabel,
                  })}
                </small>
                <small>{agent.nextStep}</small>
                <div className={styles.stack}>
                  {agent.launchChecklist.map((item, index) => (
                    <small
                      key={`ai-guarded-execution-launch-check:${agent.agentKey}:${index}`}
                    >
                      {item}
                    </small>
                  ))}
                </div>
                <div className={styles.stack}>
                  {agent.blockingFactors.map((item, index) => (
                    <small
                      key={`ai-guarded-execution-launch-block:${agent.agentKey}:${index}`}
                    >
                      {item}
                    </small>
                  ))}
                </div>
                <div className={styles.stack}>
                  {agent.successSignals.map((item, index) => (
                    <small
                      key={`ai-guarded-execution-launch-signal:${agent.agentKey}:${index}`}
                    >
                      {item}
                    </small>
                  ))}
                </div>
                <div className={styles.stack}>
                  {agent.notes.map((note, index) => (
                    <small
                      key={`ai-guarded-execution-launch-note:${agent.agentKey}:${index}`}
                    >
                      {note}
                    </small>
                  ))}
                </div>
              </div>
            ))
          ) : tenantAiGuardedExecutionLaunchWorkspaceLoading ? (
            <small className={styles.muted}>
              Cargando guarded execution launch workspace de AI...
            </small>
          ) : (
            <div className={styles.emptyState}>
              <p>
                Todavia no hay suficiente contexto para decidir launch de guarded
                execution en este tenant.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.detailCard}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>AI guarded execution monitor</span>
            <h3>Que deberiamos vigilar el dia 0 y que señales disparan escalacion</h3>
          </div>
          <span className={styles.statusPill}>
            {tenantAiGuardedExecutionMonitorWorkspace
              ? formatDate(tenantAiGuardedExecutionMonitorWorkspace.generatedAt)
              : 'sin monitor'}
          </span>
        </div>

        <div className={styles.commercialMetricsGrid}>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Ready to monitor</span>
            <strong>
              {tenantAiGuardedExecutionMonitorWorkspace?.counts.readyToMonitorAgents ??
                0}
            </strong>
            <small>
              Agentes cuyo lane ya tendría una watchlist explícita para day 0.
            </small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Monitor after launch</span>
            <strong>
              {tenantAiGuardedExecutionMonitorWorkspace?.counts
                .monitorAfterLaunchAgents ?? 0}
            </strong>
            <small>
              Agentes que todavía requieren piloto o siguiente ventana antes de una
              vigilancia day 0 real.
            </small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Not applicable</span>
            <strong>
              {tenantAiGuardedExecutionMonitorWorkspace?.counts.notApplicableAgents ??
                0}
            </strong>
            <small>
              Agentes que siguen en suggestion mode sin lane ejecutable para vigilar.
            </small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Monitor candidates</span>
            <strong>
              {tenantAiGuardedExecutionMonitorWorkspace?.counts.monitorCandidateTools ??
                0}
            </strong>
            <small>
              Tools candidatos que ya exigen señales de watch y escalación explícitas.
            </small>
          </div>
        </div>

        <div className={styles.stack}>
          {tenantAiGuardedExecutionMonitorWorkspace?.agents.length ? (
            tenantAiGuardedExecutionMonitorWorkspace.agents.map((agent) => (
              <div
                className={styles.assistCueCard}
                key={`ai-guarded-execution-monitor:${agent.agentKey}`}
              >
                <div className={styles.invoiceCardHeader}>
                  <strong>{agent.title}</strong>
                  <span
                    className={`${styles.statusPill} ${guardedExecutionMonitorStatusTone(
                      agent.monitorStatus,
                    )}`}
                  >
                    {guardedExecutionMonitorStatusLabel(agent.monitorStatus)}
                  </span>
                </div>
                <small>
                  {humanizeKey(agent.domainKey)} · {humanizeKey(agent.launchWindow)} ·
                  {humanizeKey(agent.watchWindow)}
                </small>
                <small>
                  Monitor owner {agent.monitorOwner} {'·'} Fallback{' '}
                  {humanizeKey(agent.safeFallbackMode)}
                </small>
                <small>
                  Candidate lane{' '}
                  {resolveAiGuardedExecutionCandidate(agent.agentKey)?.title ??
                    agent.candidateToolKey ??
                    'none'}{' '}
                  {'·'} Launch {guardedExecutionLaunchStatusLabel(agent.launchStatus)}
                </small>
                <small>{agent.nextStep}</small>
                <div className={styles.stack}>
                  {agent.watchSignals.map((item, index) => (
                    <small
                      key={`ai-guarded-execution-monitor-watch:${agent.agentKey}:${index}`}
                    >
                      {item}
                    </small>
                  ))}
                </div>
                <div className={styles.stack}>
                  {agent.escalationSignals.map((item, index) => (
                    <small
                      key={`ai-guarded-execution-monitor-escalation:${agent.agentKey}:${index}`}
                    >
                      {item}
                    </small>
                  ))}
                </div>
                <div className={styles.stack}>
                  {agent.rollbackReadinessChecks.map((item, index) => (
                    <small
                      key={`ai-guarded-execution-monitor-rollback:${agent.agentKey}:${index}`}
                    >
                      {item}
                    </small>
                  ))}
                </div>
                <div className={styles.stack}>
                  {agent.notes.map((note, index) => (
                    <small
                      key={`ai-guarded-execution-monitor-note:${agent.agentKey}:${index}`}
                    >
                      {note}
                    </small>
                  ))}
                </div>
              </div>
            ))
          ) : tenantAiGuardedExecutionMonitorWorkspaceLoading ? (
            <small className={styles.muted}>
              Cargando guarded execution monitor workspace de AI...
            </small>
          ) : (
            <div className={styles.emptyState}>
              <p>
                Todavia no hay suficiente contexto para definir vigilancia day 0
                para guarded execution en este tenant.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
