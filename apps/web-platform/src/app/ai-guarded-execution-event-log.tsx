import styles from './app.module.css';
import {
  guardedExecutionEventLogLabel,
  guardedExecutionEventLogTone,
} from './ai-console-support';
import {
  AiGuardedExecutionEventLogWorkspaceResponse,
  AiOperatingModelAgentResponse,
} from './types';

type Props = {
  formatDate: (value: string | null) => string;
  humanizeKey: (value: string | null) => string;
  tenantAiGuardedExecutionEventLogWorkspace: AiGuardedExecutionEventLogWorkspaceResponse | null;
  tenantAiGuardedExecutionEventLogWorkspaceLoading: boolean;
  resolveAiGuardedExecutionCandidate: (
    agentKey: string,
  ) => AiOperatingModelAgentResponse['guardedExecutionCandidate'];
};

export function AiGuardedExecutionEventLog({
  formatDate,
  humanizeKey,
  tenantAiGuardedExecutionEventLogWorkspace,
  tenantAiGuardedExecutionEventLogWorkspaceLoading,
  resolveAiGuardedExecutionCandidate,
}: Props) {
  return (
    <div className={styles.detailCard}>
      <div className={styles.sectionHeading}>
        <div>
          <span className={styles.label}>AI guarded execution event log</span>
          <h3>Bitacora temporal del lane: handoff, approvals y posture operativo</h3>
        </div>
        <span className={styles.statusPill}>
          {tenantAiGuardedExecutionEventLogWorkspace
            ? formatDate(tenantAiGuardedExecutionEventLogWorkspace.generatedAt)
            : 'sin event log'}
        </span>
      </div>

      <div className={styles.commercialMetricsGrid}>
        <div className={styles.commercialCard}>
          <span className={styles.muted}>Total events</span>
          <strong>
            {tenantAiGuardedExecutionEventLogWorkspace?.counts.totalEvents ?? 0}
          </strong>
          <small>
            Eventos reales y marcadores sintéticos del frente guarded execution.
          </small>
        </div>
        <div className={styles.commercialCard}>
          <span className={styles.muted}>Prepared</span>
          <strong>
            {tenantAiGuardedExecutionEventLogWorkspace?.counts
              .suggestionRunPreparedEvents ?? 0}
          </strong>
          <small>Handoffs preparados que abren el rastro temporal.</small>
        </div>
        <div className={styles.commercialCard}>
          <span className={styles.muted}>Approvals</span>
          <strong>
            {(tenantAiGuardedExecutionEventLogWorkspace?.counts
              .approvalRequestedEvents ?? 0) +
              (tenantAiGuardedExecutionEventLogWorkspace?.counts
                .approvalReviewedEvents ?? 0)}
          </strong>
          <small>Solicitudes y revisiones humanas visibles en la bitácora.</small>
        </div>
        <div className={styles.commercialCard}>
          <span className={styles.muted}>Execute / rollback</span>
          <strong>
            {(tenantAiGuardedExecutionEventLogWorkspace?.counts.executedEvents ?? 0) +
              (tenantAiGuardedExecutionEventLogWorkspace?.counts.rolledBackEvents ?? 0)}
          </strong>
          <small>
            Eventos reales que ya cruzaron el lane ejecutable y su fallback.
          </small>
        </div>
      </div>

      <div className={styles.stack}>
        {tenantAiGuardedExecutionEventLogWorkspace?.entries.length ? (
          tenantAiGuardedExecutionEventLogWorkspace.entries.map((entry) => (
            <div className={styles.assistCueCard} key={entry.id}>
              <div className={styles.invoiceCardHeader}>
                <strong>{entry.summary}</strong>
                <span
                  className={`${styles.statusPill} ${guardedExecutionEventLogTone(
                    entry.eventType,
                  )}`}
                >
                  {guardedExecutionEventLogLabel(entry.eventType)}
                </span>
              </div>
              <small>
                {humanizeKey(entry.agentKey)} · {formatDate(entry.occurredAt)}
              </small>
              <small>
                Candidate lane{' '}
                {resolveAiGuardedExecutionCandidate(entry.agentKey)?.title ??
                  entry.candidateToolKey ??
                  'none'}{' '}
                {'·'} Suggestion run {entry.suggestionRunId ?? 'n/a'} {'·'} Approval{' '}
                {entry.approvalRequestId ?? 'n/a'}
              </small>
              <small>{entry.detail}</small>
            </div>
          ))
        ) : tenantAiGuardedExecutionEventLogWorkspaceLoading ? (
          <small className={styles.muted}>
            Cargando guarded execution event log workspace de AI...
          </small>
        ) : (
          <div className={styles.emptyState}>
            <p>
              Todavia no hay suficiente contexto para construir la bitacora temporal
              de guarded execution en este tenant.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
