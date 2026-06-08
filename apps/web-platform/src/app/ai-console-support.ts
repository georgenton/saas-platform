import styles from './app.module.css';
import {
  AiActivityFeedEventType,
  AiAgentCatalogResponse,
  AiGuardedExecutionAuditWorkspaceResponse,
  AiGuardedExecutionControlWorkspaceResponse,
  AiGuardedExecutionEventLogEntryType,
  AiGuardedExecutionLaunchWorkspaceResponse,
  AiGuardedExecutionMonitorWorkspaceResponse,
  AiGuardedExecutionPilotWorkspaceResponse,
  AiGuardedExecutionRollbackWorkspaceResponse,
  AiGuardedExecutionRunbookWorkspaceResponse,
  AiGuardedExecutionWorkspaceResponse,
  AiOperatingModelAgentResponse,
} from './types';

export type AiAgentDedicatedActionKeyPrefixes = {
  prepare: string;
  requestApproval?: string;
  reviewApproval?: string;
  loadDetail?: string;
};

export const AI_AGENT_WEB_REGISTRY = {
  'growth-assist-coach': {
    fallbackTitle: 'Growth Assist Coach',
    dedicatedActionKeyPrefixes: {
      prepare: 'prepare-ai-suggestion-run',
      requestApproval: 'request-ai-approval',
      reviewApproval: 'review-ai-approval',
      loadDetail: 'load-ai-run-detail',
    },
  },
  'invoice-document-assistant': {
    fallbackTitle: 'Invoice Document Assistant',
    dedicatedActionKeyPrefixes: {
      prepare: 'prepare-invoice-ai-suggestion-run',
      requestApproval: 'request-invoice-ai-approval',
      reviewApproval: 'review-invoice-ai-approval',
      loadDetail: 'load-invoice-ai-run-detail',
    },
  },
  'ecommerce-launch-assistant': {
    fallbackTitle: 'Ecommerce Launch Assistant',
    dedicatedActionKeyPrefixes: {
      prepare: 'prepare-ecommerce-ai-suggestion-run',
      requestApproval: 'request-ecommerce-ai-approval',
      reviewApproval: 'review-ecommerce-ai-approval',
      loadDetail: 'load-ecommerce-ai-run-detail',
    },
  },
  'medical-clinic-assistant': {
    fallbackTitle: 'Medical Clinic Assistant',
    dedicatedActionKeyPrefixes: {
      prepare: 'prepare-medical-clinic-ai-suggestion-run',
      requestApproval: 'request-medical-clinic-ai-approval',
      reviewApproval: 'review-medical-clinic-ai-approval',
      loadDetail: 'load-medical-clinic-ai-run-detail',
    },
  },
  'psychology-clinic-assistant': {
    fallbackTitle: 'Psychology Clinic Assistant',
    dedicatedActionKeyPrefixes: {
      prepare: 'prepare-psychology-clinic-ai-suggestion-run',
      requestApproval: 'request-psychology-clinic-ai-approval',
      reviewApproval: 'review-psychology-clinic-ai-approval',
      loadDetail: 'load-psychology-clinic-ai-run-detail',
    },
  },
} as const satisfies Record<
  string,
  {
    fallbackTitle: string;
    dedicatedActionKeyPrefixes: AiAgentDedicatedActionKeyPrefixes;
  }
>;

export type SupportedAiAgentKey = keyof typeof AI_AGENT_WEB_REGISTRY;

export const SUPPORTED_AI_AGENT_KEYS = Object.keys(
  AI_AGENT_WEB_REGISTRY,
) as SupportedAiAgentKey[];

function humanizeAiConsoleKey(value: string | null): string {
  if (!value) {
    return 'No definido';
  }

  return value.split('_').join(' ');
}

export function isSupportedAiAgentKey(
  agentKey: string,
): agentKey is SupportedAiAgentKey {
  return (SUPPORTED_AI_AGENT_KEYS as readonly string[]).includes(agentKey);
}

export function fallbackAiAgentTitle(agentKey: string): string {
  return isSupportedAiAgentKey(agentKey)
    ? AI_AGENT_WEB_REGISTRY[agentKey].fallbackTitle
    : humanizeAiConsoleKey(agentKey);
}

export function shortAiAgentLabel(input: {
  domainKey: AiAgentCatalogResponse['domainKey'];
  title: string;
}): string {
  switch (input.domainKey) {
    case 'growth':
      return 'Growth';
    case 'invoicing':
      return 'Invoice';
    case 'ecommerce':
      return 'Ecommerce';
    case 'tax-compliance':
      return 'Taxes';
    case 'medical':
      return 'Medical';
    case 'psychology':
      return 'Psychology';
    default:
      return input.title;
  }
}

export function buildFallbackAiAgentHandoffContract(input: {
  agentTitle: string;
  domainKey: AiAgentCatalogResponse['domainKey'] | null;
}): AiOperatingModelAgentResponse['handoffContract'] {
  switch (input.domainKey) {
    case 'growth':
      return {
        requestApprovalRationale:
          'Solicitar revision humana antes de tratar el handoff como aprobado.',
        reviewNotes: {
          approved: 'Aprobado desde la consola transversal de AI.',
          rejected: 'Rechazado desde la consola transversal de AI.',
        },
      };
    case 'invoicing':
      return {
        requestApprovalRationale:
          'Solicitar revision humana antes de usar la sugerencia sobre documentos tributarios.',
        reviewNotes: {
          approved: `Aprobado desde la consola transversal de AI para ${input.agentTitle}.`,
          rejected: `Rechazado desde la consola transversal de AI para ${input.agentTitle}.`,
        },
      };
    default:
      return {
        requestApprovalRationale:
          `Solicitar revision humana antes de usar la sugerencia de ${input.agentTitle}.`,
        reviewNotes: {
          approved: `Aprobado desde la consola transversal de AI para ${input.agentTitle}.`,
          rejected: `Rechazado desde la consola transversal de AI para ${input.agentTitle}.`,
        },
      };
  }
}

export function humanizeAiActivityFeedEventType(
  eventType: AiActivityFeedEventType,
): string {
  switch (eventType) {
    case 'suggestion_run_prepared':
      return 'Handoff preparado';
    case 'approval_requested':
      return 'Approval requested';
    case 'approval_reviewed':
      return 'Approval reviewed';
    default:
      return humanizeAiConsoleKey(eventType);
  }
}

type GuardedExecutionStatus =
  AiGuardedExecutionWorkspaceResponse['agents'][number]['guardedExecutionStatus'];
type GuardedExecutionPilotStatus =
  AiGuardedExecutionPilotWorkspaceResponse['agents'][number]['pilotStatus'];
type GuardedExecutionRunbookStatus =
  AiGuardedExecutionRunbookWorkspaceResponse['agents'][number]['runbookStatus'];
type GuardedExecutionRollbackStatus =
  AiGuardedExecutionRollbackWorkspaceResponse['agents'][number]['rollbackStatus'];
type GuardedExecutionAuditStatus =
  AiGuardedExecutionAuditWorkspaceResponse['agents'][number]['auditStatus'];
type GuardedExecutionLaunchStatus =
  AiGuardedExecutionLaunchWorkspaceResponse['agents'][number]['launchStatus'];
type GuardedExecutionMonitorStatus =
  AiGuardedExecutionMonitorWorkspaceResponse['agents'][number]['monitorStatus'];
type GuardedExecutionControlStatus =
  AiGuardedExecutionControlWorkspaceResponse['agents'][number]['controlStatus'];

export function guardedExecutionStatusTone(status: GuardedExecutionStatus): string {
  switch (status) {
    case 'pilot_candidate':
      return styles.healthy;
    case 'needs_launch_readiness':
      return styles.warning;
    case 'suggestion_only':
      return styles.muted;
    default:
      return '';
  }
}

export function guardedExecutionStatusLabel(status: GuardedExecutionStatus): string {
  switch (status) {
    case 'pilot_candidate':
      return 'Pilot candidate';
    case 'needs_launch_readiness':
      return 'Needs launch readiness';
    case 'suggestion_only':
      return 'Suggestion only';
    default:
      return status;
  }
}

export function guardedExecutionPilotStatusTone(
  status: GuardedExecutionPilotStatus,
): string {
  switch (status) {
    case 'ready_for_pilot':
      return styles.healthy;
    case 'needs_operational_backing':
      return styles.warning;
    case 'no_candidate':
      return styles.muted;
    default:
      return '';
  }
}

export function guardedExecutionPilotStatusLabel(
  status: GuardedExecutionPilotStatus,
): string {
  switch (status) {
    case 'ready_for_pilot':
      return 'Ready for pilot';
    case 'needs_operational_backing':
      return 'Needs operational backing';
    case 'no_candidate':
      return 'No candidate';
    default:
      return status;
  }
}

export function guardedExecutionRunbookStatusTone(
  status: GuardedExecutionRunbookStatus,
): string {
  switch (status) {
    case 'ready_to_document':
      return styles.healthy;
    case 'needs_design':
      return styles.warning;
    case 'not_available':
      return styles.muted;
    default:
      return '';
  }
}

export function guardedExecutionRunbookStatusLabel(
  status: GuardedExecutionRunbookStatus,
): string {
  switch (status) {
    case 'ready_to_document':
      return 'Ready to document';
    case 'needs_design':
      return 'Needs design';
    case 'not_available':
      return 'Not available';
    default:
      return status;
  }
}

export function guardedExecutionRollbackStatusTone(
  status: GuardedExecutionRollbackStatus,
): string {
  switch (status) {
    case 'ready_with_rollback':
      return styles.healthy;
    case 'needs_rollback_design':
      return styles.warning;
    case 'not_applicable':
      return styles.muted;
    default:
      return '';
  }
}

export function guardedExecutionRollbackStatusLabel(
  status: GuardedExecutionRollbackStatus,
): string {
  switch (status) {
    case 'ready_with_rollback':
      return 'Ready with rollback';
    case 'needs_rollback_design':
      return 'Needs rollback design';
    case 'not_applicable':
      return 'Not applicable';
    default:
      return status;
  }
}

export function guardedExecutionAuditStatusTone(
  status: GuardedExecutionAuditStatus,
): string {
  switch (status) {
    case 'ready_for_audit':
      return styles.healthy;
    case 'needs_evidence_design':
      return styles.warning;
    case 'not_applicable':
      return styles.muted;
    default:
      return '';
  }
}

export function guardedExecutionAuditStatusLabel(
  status: GuardedExecutionAuditStatus,
): string {
  switch (status) {
    case 'ready_for_audit':
      return 'Ready for audit';
    case 'needs_evidence_design':
      return 'Needs evidence design';
    case 'not_applicable':
      return 'Not applicable';
    default:
      return status;
  }
}

export function guardedExecutionLaunchStatusTone(
  status: GuardedExecutionLaunchStatus,
): string {
  switch (status) {
    case 'ready_to_launch':
      return styles.healthy;
    case 'pilot_only':
      return styles.warning;
    case 'hold':
      return styles.muted;
    default:
      return '';
  }
}

export function guardedExecutionLaunchStatusLabel(
  status: GuardedExecutionLaunchStatus,
): string {
  switch (status) {
    case 'ready_to_launch':
      return 'Ready to launch';
    case 'pilot_only':
      return 'Pilot only';
    case 'hold':
      return 'Hold';
    default:
      return status;
  }
}

export function guardedExecutionMonitorStatusTone(
  status: GuardedExecutionMonitorStatus,
): string {
  switch (status) {
    case 'ready_to_monitor':
      return styles.healthy;
    case 'monitor_after_launch':
      return styles.warning;
    case 'not_applicable':
      return styles.muted;
    default:
      return '';
  }
}

export function guardedExecutionMonitorStatusLabel(
  status: GuardedExecutionMonitorStatus,
): string {
  switch (status) {
    case 'ready_to_monitor':
      return 'Ready to monitor';
    case 'monitor_after_launch':
      return 'Monitor after launch';
    case 'not_applicable':
      return 'Not applicable';
    default:
      return status;
  }
}

export function guardedExecutionControlStatusTone(
  status: GuardedExecutionControlStatus,
): string {
  switch (status) {
    case 'open_lane':
      return styles.healthy;
    case 'pilot_then_open':
      return styles.warning;
    case 'hold':
      return styles.muted;
    default:
      return '';
  }
}

export function guardedExecutionControlStatusLabel(
  status: GuardedExecutionControlStatus,
): string {
  switch (status) {
    case 'open_lane':
      return 'Open lane';
    case 'pilot_then_open':
      return 'Pilot then open';
    case 'hold':
      return 'Hold';
    default:
      return status;
  }
}

export function guardedExecutionEventLogTone(
  eventType: AiGuardedExecutionEventLogEntryType,
): string {
  switch (eventType) {
    case 'guarded_execution_executed':
    case 'approval_reviewed':
    case 'guarded_execution_lane_ready':
      return styles.healthy;
    case 'guarded_execution_rolled_back':
    case 'approval_requested':
    case 'guarded_execution_pilot_only':
      return styles.warning;
    case 'suggestion_run_prepared':
    default:
      return styles.muted;
  }
}

export function guardedExecutionEventLogLabel(
  eventType: AiGuardedExecutionEventLogEntryType,
): string {
  switch (eventType) {
    case 'suggestion_run_prepared':
      return 'Suggestion prepared';
    case 'approval_requested':
      return 'Approval requested';
    case 'approval_reviewed':
      return 'Approval reviewed';
    case 'guarded_execution_executed':
      return 'Executed';
    case 'guarded_execution_rolled_back':
      return 'Rolled back';
    case 'guarded_execution_pilot_only':
      return 'Pilot only';
    case 'guarded_execution_lane_ready':
      return 'Lane ready';
    default:
      return eventType;
  }
}
