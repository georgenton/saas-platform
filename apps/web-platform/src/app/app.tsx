import { FormEvent, startTransition, useEffect, useMemo, useState } from 'react';
import styles from './app.module.css';
import {
  fetchAiAgentApprovalPolicies,
  fetchAiAgentCatalog,
  fetchAiApprovalPolicies,
  fetchAiAgentToolAccess,
  fetchTenantAiActivityFeed,
  fetchTenantAiApprovalCapacityWorkspace,
  fetchTenantAiApprovalDesignWorkspace,
  fetchTenantAiApprovalSlaWorkspace,
  fetchTenantAiApprovalStaffingWorkspace,
  fetchTenantAiApprovalStaffingPlanWorkspace,
  fetchTenantAiApprovalRolloutWorkspace,
  fetchTenantAiApprovalReadinessWorkspace,
  fetchTenantAiApprovalLaunchWorkspace,
  fetchTenantAiEvaluationWorkspace,
  fetchTenantAiGovernanceWorkspace,
  fetchTenantAiHealthWorkspace,
  fetchTenantAiMemoryWorkspace,
  fetchTenantAiOperationsSummary,
  fetchTenantAiPolicySimulationWorkspace,
  fetchAiPromptRegistry,
  fetchTenantAiHandoffWorkspace,
  fetchTenantAiSuggestionWorkspaceDetail,
  fetchTenantAiSuggestionRunDetail,
  fetchAiToolRegistry,
  fetchTenantAiApprovalRequests,
  fetchTenantAiApprovalWorkspaceSummary,
  fetchTenantAiSuggestionEnvelope,
  fetchTenantAiSuggestionRuns,
  acceptInvitation,
  cancelInvitation,
  checkInvoiceElectronicAuthorization,
  createCustomer,
  createCreditNote,
  createDebitNote,
  createGrowthOperationalCase,
  createRemissionGuide,
  createWithholding,
  createInvitation,
  createInvoice,
  createInvoiceItem,
  createInvoicePayment,
  createTaxRate,
  autoAssignGrowthOperationalCases,
  deleteWhatsappOperationalAlertAcknowledgement,
  downloadInvoiceElectronicRideHtml,
  downloadInvoiceElectronicXmlPreview,
  fetchGrowthAssistDailyAgenda,
  fetchGrowthOperationalCaseAutoAssignmentSettings,
  fetchWhatsappOperationalAlertAcknowledgements,
  fetchWhatsappOperationalMonitorAnalytics,
  fetchWhatsappOperationalMonitorRuns,
  fetchGrowthOperationalCases,
  fetchGrowthConversationWorkbench,
  fetchElectronicSandboxReadiness,
  fetchElectronicSubmissionSettings,
  fetchElectronicSignatureMaterialInspection,
  fetchElectronicSignatureSettings,
  fetchInvitationForInvitee,
  fetchInvoiceDetail,
  fetchInvoiceDocumentDraftingAssist,
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
  fetchWhatsappOutboundReportingSummary,
  getTenantInvitation,
  listCustomers,
  listInvoices,
  listPlans,
  listProducts,
  listTaxRates,
  listTenantEnabledProducts,
  prepareTenantAiSuggestionRun,
  requestTenantAiSuggestionRunApproval,
  listTenantInvitations,
  reverseInvoicePayment,
  reviewTenantAiApprovalRequest,
  runWhatsappOperationalMonitor,
  acknowledgeWhatsappOperationalAlert,
  reopenGrowthOperationalCase,
  reviewGrowthOperationalCaseRouting,
  resendInvitation,
  resolveGrowthOperationalCase,
  sendInvoiceEmail,
  setCurrentTenancy,
  submitInvoiceElectronicDocument,
  submitPresignedInvoiceElectronicDocument,
  syncIssuerProfileTaxIdFromSignature,
  takeGrowthOperationalCase,
  updateGrowthOperationalCaseFollowUpState,
  upsertElectronicSubmissionSettings,
  upsertElectronicSignatureSettings,
  upsertGrowthOperationalCaseAutoAssignmentSettings,
  upsertInvoiceNumberingSettings,
  upsertIssuerProfile,
  updateInvoiceElectronicStatus,
  updateInvoiceStatus,
} from './api';
import {
  AiActivityFeedEventType,
  AiActivityFeedResponse,
  AiApprovalCapacityWorkspaceResponse,
  AiApprovalDesignWorkspaceResponse,
  AiApprovalSlaWorkspaceResponse,
  AiApprovalStaffingWorkspaceResponse,
  AiApprovalStaffingPlanWorkspaceResponse,
  AiApprovalRolloutWorkspaceResponse,
  AiApprovalReadinessWorkspaceResponse,
  AiApprovalLaunchWorkspaceResponse,
  AiEvaluationWorkspaceResponse,
  AiGovernanceWorkspaceResponse,
  AiHealthWorkspaceResponse,
  AiMemoryWorkspaceResponse,
  AiPolicySimulationWorkspaceResponse,
  AiApprovalPolicyResponse,
  AiApprovalWorkspaceResponse,
  AiApprovalRequestResponse,
  AiApprovalRequestStatusFilter,
  AiAgentCatalogResponse,
  AiAgentToolAccessResponse,
  AiHandoffWorkspaceResponse,
  AiOperationsSummaryResponse,
  AiPromptRegistryResponse,
  AiSuggestionRunDetailResponse,
  AiSuggestionEnvelopeResponse,
  AiSuggestionRunResponse,
  AiToolRegistryResponse,
  AuthenticatedInvitationResponse,
  AuthenticatedSessionResponse,
  CustomerResponse,
  ElectronicSandboxReadinessResponse,
  ElectronicSignatureMaterialInspectionResponse,
  ElectronicSubmissionSettingsResponse,
  ElectronicSignatureSettingsResponse,
  GrowthAssistDailyAgendaResponse,
  GrowthOperationalCaseAutoAssignmentSettingsResponse,
  GrowthConversationWorkbenchResponse,
  GrowthOperationalCaseAutoAssignmentResponse,
  GrowthOperationalCaseResponse,
  GrowthOperationalCaseRoutingReviewResponse,
  InvoiceElectronicArtifactsResponse,
  InvoiceDocumentDraftingAssistResponse,
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
  RemissionGuideResponse,
  WithholdingResponse,
  TaxRateResponse,
  SessionPendingInvitation,
  SessionEntitlement,
  SessionTenancy,
  WhatsappOperationalAlertAcknowledgementResponse,
  WhatsappOperationalMonitorAnalyticsResponse,
  WhatsappOperationalMonitorSummaryResponse,
  WhatsappOperationalMonitorRunResponse,
  WhatsappOutboundReportingSummaryResponse,
} from './types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:3000/api';
const TOKEN_STORAGE_KEY = 'saas-platform.web.token';

type GrowthDrilldownTarget =
  | {
      kind: 'alert';
      key: string;
    }
  | {
      kind: 'taxonomy';
      key: string;
    }
  | {
      kind: 'error';
      key: string;
    }
  | {
      kind: 'thread';
      key: string;
    }
  | {
      kind: 'history';
      key: string;
    };

type GrowthFleetTenantSnapshot = {
  tenancy: SessionTenancy;
  workbench: GrowthConversationWorkbenchResponse;
  summary: WhatsappOutboundReportingSummaryResponse;
  analytics: WhatsappOperationalMonitorAnalyticsResponse;
  acknowledgements: WhatsappOperationalAlertAcknowledgementResponse[];
  cases: GrowthOperationalCaseResponse[];
  latestRun: WhatsappOperationalMonitorRunResponse | null;
};

type GrowthFleetRunbook = {
  key: string;
  severity: 'healthy' | 'warning' | 'critical';
  title: string;
  summary: string;
  affectedTenants: string[];
  steps: string[];
};

type GrowthAssistTask = {
  key: string;
  urgency: 'today' | 'soon' | 'watch';
  category: 'reply_now' | 'follow_up' | 'assign_owner' | 'channel_risk';
  title: string;
  summary: string;
  actionLabel: string;
  dueAt: string | null;
};

type GrowthAssistConversationCue = {
  key: string;
  warmth: 'hot' | 'warm' | 'watch';
  title: string;
  summary: string;
  suggestedReply: string;
  nextMove: string;
};

type GrowthAssistReplySuggestion = {
  key: string;
  warmth: 'hot' | 'warm' | 'watch';
  title: string;
  reason: string;
  goal: string;
  suggestedReply: string;
  followUpPrompt: string;
  checklist: string[];
};

type TenantAiActivityFeedFilter = 'all' | AiActivityFeedEventType;

type GrowthAssistNextAction = {
  key: string;
  emphasis: 'do_now' | 'today' | 'stabilize';
  actionType: 'reply_now' | 'follow_up' | 'assign_owner' | 'channel_risk';
  title: string;
  whyNow: string;
  recommendedAction: string;
  businessImpact: string;
};

type GrowthAssistLeadWarmthHint = {
  key: string;
  warmth: 'hot' | 'warm' | 'watch';
  title: string;
  signalSummary: string;
  whyWarmth: string;
  recommendedCadence: string;
  riskNote: string;
};

type GrowthAssistPlaybook = {
  key: string;
  title: string;
  detail: string;
  goal: string;
  avoid: string;
  successSignal: string;
  whenToUse: string;
  steps: string[];
};

type GrowthOperationalCaseRoutingPolicyKey =
  GrowthOperationalCaseResponse['routingPolicyKey'];
type GrowthOperationalCaseAutoAssignmentPolicyKey =
  GrowthOperationalCaseAutoAssignmentResponse['policyKey'];

const growthOperationalCaseRoutingPolicies: Array<{
  key: GrowthOperationalCaseRoutingPolicyKey;
  label: string;
  summary: string;
}> = [
  {
    key: 'growth_ops',
    label: 'Growth ops',
    summary: 'Escalaciones y bloqueos que piden triage operativo.',
  },
  {
    key: 'escalation_review',
    label: 'Escalation review',
    summary: 'Casos vencidos que ya piden revisión operativa.',
  },
  {
    key: 'owner_assignment',
    label: 'Owner assignment',
    summary: 'Casos que primero necesitan dueño claro o rebalanceo.',
  },
  {
    key: 'follow_up_team',
    label: 'Follow-up team',
    summary: 'Seguimientos que siguen del lado del equipo.',
  },
  {
    key: 'follow_up_waiting_customer',
    label: 'Waiting customer',
    summary: 'Seguimientos que quedan a la espera del cliente.',
  },
];

const growthOperationalCaseAutoAssignmentPolicies: Array<{
  key: GrowthOperationalCaseAutoAssignmentPolicyKey;
  label: string;
  summary: string;
}> = [
  {
    key: 'balanced',
    label: 'Balanced',
    summary:
      'Prioriza escalaciones primero, luego ownership queue y finalmente follow-up del equipo.',
  },
  {
    key: 'owner_queue_first',
    label: 'Owner queue first',
    summary:
      'Vacía primero los casos sin owner claro antes de seguir con escalaciones y follow-up.',
  },
  {
    key: 'follow_up_first',
    label: 'Follow-up first',
    summary:
      'Empuja antes los seguimientos del equipo y luego reparte ownership pendiente.',
  },
];

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

function formatElectronicDocumentLabel(value: string | null): string {
  switch (value) {
    case '04':
      return 'Nota de credito';
    case '05':
      return 'Nota de debito';
    case '06':
      return 'Guia de remision';
    case '07':
      return 'Comprobante de retencion';
    case '01':
    case null:
      return 'Factura';
    default:
      return `Documento ${value}`;
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

function formatRate(value: number): string {
  return new Intl.NumberFormat('es-EC', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

function humanizeKey(value: string | null): string {
  if (!value) {
    return 'No definido';
  }

  return value.split('_').join(' ');
}

function fallbackAiAgentTitle(agentKey: string): string {
  switch (agentKey) {
    case 'growth-assist-coach':
      return 'Growth Assist Coach';
    case 'invoice-document-assistant':
      return 'Invoice Document Assistant';
    default:
      return humanizeKey(agentKey);
  }
}

function humanizeAiActivityFeedEventType(
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
      return humanizeKey(eventType);
  }
}

function matchesAiApprovalRequestStatusFilter(
  approvalRequest: AiApprovalRequestResponse,
  filter: AiApprovalRequestStatusFilter,
): boolean {
  return filter === 'all' || approvalRequest.status === filter;
}

function bumpSuggestionRunApprovalToPending(
  runs: AiSuggestionRunResponse[],
  approvalRequest: AiApprovalRequestResponse,
): AiSuggestionRunResponse[] {
  return runs.map((entry) =>
    entry.id === approvalRequest.suggestionRunId
      ? {
          ...entry,
          approvalSummary: {
            status: 'pending',
            totalRequests: entry.approvalSummary.totalRequests + 1,
            latestRequestId: approvalRequest.id,
            latestPolicyKey: approvalRequest.policyKey,
            latestRequestedAt: approvalRequest.createdAt,
            latestReviewedAt: approvalRequest.reviewedAt,
          },
        }
      : entry,
  );
}

function applyReviewedApprovalToSuggestionRuns(
  runs: AiSuggestionRunResponse[],
  approvalRequest: AiApprovalRequestResponse,
): AiSuggestionRunResponse[] {
  return runs.map((entry) =>
    entry.id === approvalRequest.suggestionRunId
      ? {
          ...entry,
          approvalSummary: {
            ...entry.approvalSummary,
            status: approvalRequest.status,
            latestRequestId:
              entry.approvalSummary.latestRequestId ?? approvalRequest.id,
            latestPolicyKey:
              entry.approvalSummary.latestPolicyKey ?? approvalRequest.policyKey,
            latestRequestedAt:
              entry.approvalSummary.latestRequestedAt ?? approvalRequest.createdAt,
            latestReviewedAt: approvalRequest.reviewedAt,
          },
        }
      : entry,
  );
}

function prependOrReplaceApprovalRequest(
  approvalRequests: AiApprovalRequestResponse[],
  nextApprovalRequest: AiApprovalRequestResponse,
): AiApprovalRequestResponse[] {
  return [
    nextApprovalRequest,
    ...approvalRequests.filter((entry) => entry.id !== nextApprovalRequest.id),
  ];
}

function syncApprovalRequestsWithFilter(
  approvalRequests: AiApprovalRequestResponse[],
  nextApprovalRequest: AiApprovalRequestResponse,
  filter: AiApprovalRequestStatusFilter,
): AiApprovalRequestResponse[] {
  if (!matchesAiApprovalRequestStatusFilter(nextApprovalRequest, filter)) {
    return approvalRequests.filter((entry) => entry.id !== nextApprovalRequest.id);
  }

  return prependOrReplaceApprovalRequest(approvalRequests, nextApprovalRequest);
}

function prependOrReplaceSuggestionRun(
  runs: AiSuggestionRunResponse[],
  nextRun: AiSuggestionRunResponse,
): AiSuggestionRunResponse[] {
  return [nextRun, ...runs.filter((entry) => entry.id !== nextRun.id)];
}

function formatThresholdValue(
  value: number,
  unit: 'rate' | 'count',
): string {
  return unit === 'rate' ? formatRate(value) : String(value);
}

function operationalStatusTone(
  status: 'healthy' | 'warning' | 'critical',
): string {
  switch (status) {
    case 'healthy':
      return styles.healthy;
    case 'warning':
      return styles.warning;
    case 'critical':
      return styles.critical;
    default:
      return '';
  }
}

function operationalStatusLabel(
  status: 'healthy' | 'warning' | 'critical',
): string {
  switch (status) {
    case 'healthy':
      return 'Saludable';
    case 'warning':
      return 'Atencion';
    case 'critical':
      return 'Critico';
    default:
      return status;
  }
}

function operationalStatusWeight(
  status: 'healthy' | 'warning' | 'critical',
): number {
  switch (status) {
    case 'critical':
      return 3;
    case 'warning':
      return 2;
    case 'healthy':
      return 1;
    default:
      return 0;
  }
}

function policySimulationStatusTone(
  status: 'review_ready' | 'more_reviewable' | 'still_blocked',
): string {
  switch (status) {
    case 'review_ready':
      return styles.healthy;
    case 'more_reviewable':
      return styles.warning;
    case 'still_blocked':
      return styles.critical;
    default:
      return '';
  }
}

function policySimulationStatusLabel(
  status: 'review_ready' | 'more_reviewable' | 'still_blocked',
): string {
  switch (status) {
    case 'review_ready':
      return 'Review-ready';
    case 'more_reviewable':
      return 'Mas revisable';
    case 'still_blocked':
      return 'Sigue bloqueado';
    default:
      return status;
  }
}

function approvalDesignStatusTone(
  status: 'unchanged' | 'heavier_review' | 'blocked_design',
): string {
  switch (status) {
    case 'unchanged':
      return styles.healthy;
    case 'heavier_review':
      return styles.warning;
    case 'blocked_design':
      return styles.critical;
    default:
      return '';
  }
}

function approvalDesignStatusLabel(
  status: 'unchanged' | 'heavier_review' | 'blocked_design',
): string {
  switch (status) {
    case 'unchanged':
      return 'Sin cambio';
    case 'heavier_review':
      return 'Mas revision';
    case 'blocked_design':
      return 'Diseno bloqueado';
    default:
      return status;
  }
}

function approvalCapacityStatusTone(
  status: 'stable' | 'watch' | 'overloaded',
): string {
  switch (status) {
    case 'stable':
      return styles.healthy;
    case 'watch':
      return styles.warning;
    case 'overloaded':
      return styles.critical;
    default:
      return '';
  }
}

function approvalCapacityStatusLabel(
  status: 'stable' | 'watch' | 'overloaded',
): string {
  switch (status) {
    case 'stable':
      return 'Estable';
    case 'watch':
      return 'Mirar';
    case 'overloaded':
      return 'Sobrecarga';
    default:
      return status;
  }
}

function approvalSlaStatusTone(
  status: 'on_track' | 'at_risk' | 'breached',
): string {
  switch (status) {
    case 'on_track':
      return styles.healthy;
    case 'at_risk':
      return styles.warning;
    case 'breached':
      return styles.critical;
    default:
      return '';
  }
}

function approvalSlaStatusLabel(
  status: 'on_track' | 'at_risk' | 'breached',
): string {
  switch (status) {
    case 'on_track':
      return 'On track';
    case 'at_risk':
      return 'En riesgo';
    case 'breached':
      return 'Breached';
    default:
      return status;
  }
}

function approvalStaffingStatusTone(
  status: 'sufficient' | 'watch' | 'insufficient',
): string {
  switch (status) {
    case 'sufficient':
      return styles.healthy;
    case 'watch':
      return styles.warning;
    case 'insufficient':
      return styles.critical;
    default:
      return '';
  }
}

function approvalStaffingStatusLabel(
  status: 'sufficient' | 'watch' | 'insufficient',
): string {
  switch (status) {
    case 'sufficient':
      return 'Suficiente';
    case 'watch':
      return 'Mirar staffing';
    case 'insufficient':
      return 'Falta staffing';
    default:
      return status;
  }
}

function approvalStaffingPlanStatusTone(
  status: 'maintain' | 'increase' | 'blocked',
): string {
  switch (status) {
    case 'maintain':
      return styles.healthy;
    case 'increase':
      return styles.warning;
    case 'blocked':
      return styles.critical;
    default:
      return '';
  }
}

function approvalStaffingPlanStatusLabel(
  status: 'maintain' | 'increase' | 'blocked',
): string {
  switch (status) {
    case 'maintain':
      return 'Mantener';
    case 'increase':
      return 'Aumentar';
    case 'blocked':
      return 'Bloqueado';
    default:
      return status;
  }
}

function approvalRolloutStatusTone(
  status: 'increase_then_rollout' | 'safe_to_rollout' | 'blocked',
): string {
  switch (status) {
    case 'safe_to_rollout':
      return styles.healthy;
    case 'increase_then_rollout':
      return styles.warning;
    case 'blocked':
      return styles.critical;
    default:
      return '';
  }
}

function approvalRolloutStatusLabel(
  status: 'increase_then_rollout' | 'safe_to_rollout' | 'blocked',
): string {
  switch (status) {
    case 'safe_to_rollout':
      return 'Listo';
    case 'increase_then_rollout':
      return 'Refuerza y abre';
    case 'blocked':
      return 'Hold';
    default:
      return status;
  }
}

function approvalReadinessStatusTone(
  status: 'ready_now' | 'needs_coverage' | 'blocked',
): string {
  switch (status) {
    case 'ready_now':
      return styles.healthy;
    case 'needs_coverage':
      return styles.warning;
    case 'blocked':
      return styles.critical;
    default:
      return '';
  }
}

function approvalReadinessStatusLabel(
  status: 'ready_now' | 'needs_coverage' | 'blocked',
): string {
  switch (status) {
    case 'ready_now':
      return 'Ready now';
    case 'needs_coverage':
      return 'Pide cobertura';
    case 'blocked':
      return 'Blocked';
    default:
      return status;
  }
}

function approvalLaunchStatusTone(
  status: 'launch_now' | 'pilot_after_coverage' | 'hold',
): string {
  switch (status) {
    case 'launch_now':
      return styles.healthy;
    case 'pilot_after_coverage':
      return styles.warning;
    case 'hold':
      return styles.critical;
    default:
      return '';
  }
}

function approvalLaunchStatusLabel(
  status: 'launch_now' | 'pilot_after_coverage' | 'hold',
): string {
  switch (status) {
    case 'launch_now':
      return 'Launch now';
    case 'pilot_after_coverage':
      return 'Pilot after coverage';
    case 'hold':
      return 'Hold';
    default:
      return status;
  }
}

function workbenchPriorityWeight(priority: string): number {
  switch (priority) {
    case 'critical':
    case 'urgent':
      return 4;
    case 'high':
      return 3;
    case 'normal':
    case 'medium':
      return 2;
    case 'low':
      return 1;
    default:
      return 0;
  }
}

function retryDispositionLabel(value: string): string {
  switch (value) {
    case 'retryable':
      return 'Reintentable';
    case 'permanent':
      return 'Permanente';
    default:
      return humanizeKey(value);
  }
}

function channelLabel(channel: string): string {
  switch (channel) {
    case 'whatsapp':
      return 'WhatsApp';
    case 'manual':
      return 'Manual';
    default:
      return channel;
  }
}

function growthOperationalCaseTypeLabel(
  value: GrowthOperationalCaseResponse['caseType'],
): string {
  switch (value) {
    case 'alert_escalation':
      return 'Escalacion';
    case 'ownership_routing':
      return 'Ownership';
    case 'follow_up':
      return 'Follow-up';
    default:
      return humanizeKey(value);
  }
}

function growthOperationalCaseStatusLabel(
  value: GrowthOperationalCaseResponse['status'],
): string {
  switch (value) {
    case 'open':
      return 'Abierto';
    case 'in_progress':
      return 'En curso';
    case 'resolved':
      return 'Resuelto';
    default:
      return humanizeKey(value);
  }
}

function growthOperationalCaseFollowUpStateLabel(
  value: GrowthOperationalCaseResponse['followUpState'],
): string {
  switch (value) {
    case 'pending_team':
      return 'Pendiente del equipo';
    case 'scheduled':
      return 'Programado';
    case 'waiting_customer':
      return 'Esperando cliente';
    default:
      return 'Sin estado';
  }
}

function growthOperationalCaseRoutingPolicyLabel(
  value: GrowthOperationalCaseResponse['routingPolicyKey'],
): string {
  switch (value) {
    case 'growth_ops':
      return 'Growth ops';
    case 'escalation_review':
      return 'Escalation review';
    case 'owner_assignment':
      return 'Owner assignment';
    case 'follow_up_team':
      return 'Follow-up team';
    case 'follow_up_waiting_customer':
      return 'Follow-up waiting customer';
    default:
      return humanizeKey(value);
  }
}

function growthOperationalCaseRoutingPolicySummary(
  value: GrowthOperationalCaseResponse['routingPolicyKey'],
): string {
  return (
    growthOperationalCaseRoutingPolicies.find((entry) => entry.key === value)?.summary ??
    'Lane operativo compartido.'
  );
}

function summarizeGrowthOperationalCaseRoutingReview(
  result: GrowthOperationalCaseRoutingReviewResponse,
): string {
  if (result.updatedCount === 0) {
    return `Se revisaron ${result.reviewedCount} casos y no hizo falta reubicar ninguno.`;
  }

  return `Se revisaron ${result.reviewedCount} casos, se actualizaron ${result.updatedCount} y ${result.escalationReviewCount} quedaron en escalation review.`;
}

function summarizeGrowthOperationalCaseAutoAssignment(
  result: GrowthOperationalCaseAutoAssignmentResponse,
): string {
  if (result.reviewedCount === 0) {
    return 'No habia casos operativos elegibles para auto-asignacion.';
  }

  if (result.candidateCount === 0) {
    return `Se revisaron ${result.reviewedCount} casos, pero no hay operadores elegibles con permisos de Growth para auto-asignarlos.`;
  }

  if (result.assignedCount === 0) {
    return `Se revisaron ${result.reviewedCount} casos y no hizo falta auto-asignar ninguno.`;
  }

  const policyLabel =
    growthOperationalCaseAutoAssignmentPolicies.find(
      (entry) => entry.key === result.policyKey,
    )?.label ?? result.policyKey;

  return `Policy ${policyLabel}: se revisaron ${result.reviewedCount} casos, se auto-asignaron ${result.assignedCount}, ${result.inheritedOwnerCount} heredaron owner y ${result.fallbackAssignmentCount} cayeron por menor carga.`;
}

function describeGrowthOperationalCaseAutoAssignmentPolicy(
  policyKey: GrowthOperationalCaseAutoAssignmentPolicyKey,
): string {
  return (
    growthOperationalCaseAutoAssignmentPolicies.find(
      (entry) => entry.key === policyKey,
    )?.label ?? policyKey
  );
}

function describeGrowthAssistAutoAssignmentPolicy(
  policyKey: GrowthOperationalCaseAutoAssignmentPolicyKey,
): string {
  switch (policyKey) {
    case 'follow_up_first':
      return 'empezar por seguimientos antes de repartir nueva cola';
    case 'owner_queue_first':
      return 'vaciar primero trabajo sin owner claro';
    case 'balanced':
    default:
      return 'repartir de forma equilibrada entre urgencias, owners y follow-up';
  }
}

function growthAssistUrgencyTone(
  urgency: GrowthAssistTask['urgency'],
): string {
  switch (urgency) {
    case 'today':
      return styles.critical;
    case 'soon':
      return styles.warning;
    case 'watch':
    default:
      return styles.healthy;
  }
}

function growthAssistUrgencyLabel(
  urgency: GrowthAssistTask['urgency'],
): string {
  switch (urgency) {
    case 'today':
      return 'Hoy';
    case 'soon':
      return 'Pronto';
    case 'watch':
    default:
      return 'En radar';
  }
}

function growthAssistTaskCategoryLabel(
  category: GrowthAssistTask['category'],
): string {
  switch (category) {
    case 'reply_now':
      return 'Responder';
    case 'follow_up':
      return 'Seguimiento';
    case 'assign_owner':
      return 'Ordenar cola';
    case 'channel_risk':
    default:
      return 'Canal';
  }
}

function growthAssistWarmthTone(
  warmth: GrowthAssistConversationCue['warmth'],
): string {
  switch (warmth) {
    case 'hot':
      return styles.critical;
    case 'warm':
      return styles.warning;
    case 'watch':
    default:
      return styles.healthy;
  }
}

function growthAssistWarmthLabel(
  warmth: GrowthAssistConversationCue['warmth'],
): string {
  switch (warmth) {
    case 'hot':
      return 'Lead caliente';
    case 'warm':
      return 'En movimiento';
    case 'watch':
    default:
      return 'En radar';
  }
}

function growthAssistDominantWarmthLabel(
  warmth: 'hot' | 'warm' | 'watch' | 'none',
): string {
  if (warmth === 'none') {
    return 'Sin señales fuertes';
  }

  return growthAssistWarmthLabel(warmth);
}

function growthAssistNextActionTone(
  emphasis: GrowthAssistNextAction['emphasis'],
): string {
  switch (emphasis) {
    case 'do_now':
      return styles.critical;
    case 'stabilize':
      return styles.warning;
    case 'today':
    default:
      return styles.healthy;
  }
}

function growthAssistNextActionLabel(
  emphasis: GrowthAssistNextAction['emphasis'],
): string {
  switch (emphasis) {
    case 'do_now':
      return 'Haz esto ya';
    case 'stabilize':
      return 'Estabiliza primero';
    case 'today':
    default:
      return 'Hazlo hoy';
  }
}

function aiAgentAvailabilityTone(
  availability: AiAgentCatalogResponse['availability'],
): string {
  return availability === 'ready' ? styles.healthy : styles.warning;
}

function aiAgentAvailabilityLabel(
  availability: AiAgentCatalogResponse['availability'],
): string {
  return availability === 'ready' ? 'Ready' : 'Planned';
}

function formatRelativeHours(value: number | null): string {
  if (value === null) {
    return 'sin referencia reciente';
  }

  if (value < 1) {
    return 'menos de 1 hora';
  }

  const rounded = value < 24 ? Math.round(value) : Math.round(value / 24);
  if (value < 24) {
    return `${rounded} hora${rounded === 1 ? '' : 's'}`;
  }

  return `${rounded} dia${rounded === 1 ? '' : 's'}`;
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
  electronicSignatureMaterialInspection: ElectronicSignatureMaterialInspectionResponse | null;
  electronicSubmissionSettings: ElectronicSubmissionSettingsResponse | null;
  electronicSignatureSettings: ElectronicSignatureSettingsResponse | null;
  issuerProfile: IssuerProfileResponse | null;
  invoiceNumberingSettings: InvoiceNumberingSettingsResponse | null;
}> {
  const [
    electronicSandboxReadiness,
    electronicSignatureMaterialInspection,
    electronicSubmissionSettings,
    electronicSignatureSettings,
    issuerProfile,
    invoiceNumberingSettings,
  ] =
    await Promise.all([
      fetchElectronicSandboxReadiness(token, tenantSlug).catch(() => null),
      fetchElectronicSignatureMaterialInspection(token, tenantSlug).catch(
        () => null,
      ),
      fetchElectronicSubmissionSettings(token, tenantSlug).catch(() => null),
      fetchElectronicSignatureSettings(token, tenantSlug).catch(() => null),
      fetchIssuerProfile(token, tenantSlug).catch(() => null),
      fetchInvoiceNumberingSettings(token, tenantSlug).catch(() => null),
    ]);

  return {
    electronicSandboxReadiness,
    electronicSignatureMaterialInspection,
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
  const [
    electronicSignatureMaterialInspection,
    setElectronicSignatureMaterialInspection,
  ] = useState<ElectronicSignatureMaterialInspectionResponse | null>(null);
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
  const [invoiceDocumentDraftingAssist, setInvoiceDocumentDraftingAssist] =
    useState<InvoiceDocumentDraftingAssistResponse | null>(null);
  const [invoiceAssistantAiEnvelope, setInvoiceAssistantAiEnvelope] =
    useState<AiSuggestionEnvelopeResponse | null>(null);
  const [invoiceAssistantAiToolAccess, setInvoiceAssistantAiToolAccess] =
    useState<AiAgentToolAccessResponse[]>([]);
  const [invoiceAssistantAiApprovalPolicies, setInvoiceAssistantAiApprovalPolicies] =
    useState<AiApprovalPolicyResponse[]>([]);
  const [invoiceAssistantAiApprovalRequests, setInvoiceAssistantAiApprovalRequests] =
    useState<AiApprovalRequestResponse[]>([]);
  const [invoiceAiApprovalStatusFilter, setInvoiceAiApprovalStatusFilter] =
    useState<AiApprovalRequestStatusFilter>('all');
  const [invoiceAssistantAiSuggestionRuns, setInvoiceAssistantAiSuggestionRuns] =
    useState<AiSuggestionRunResponse[]>([]);
  const [selectedInvoiceAiSuggestionRunDetail, setSelectedInvoiceAiSuggestionRunDetail] =
    useState<AiSuggestionRunDetailResponse | null>(null);
  const [invoicingLoading, setInvoicingLoading] = useState(false);
  const [invoiceDetailLoading, setInvoiceDetailLoading] = useState(false);
  const [invoicingError, setInvoicingError] = useState<string | null>(null);
  const [invoicingActionMessage, setInvoicingActionMessage] = useState<
    string | null
  >(null);
  const [growthWorkbench, setGrowthWorkbench] =
    useState<GrowthConversationWorkbenchResponse | null>(null);
  const [growthAssistAgenda, setGrowthAssistAgenda] =
    useState<GrowthAssistDailyAgendaResponse | null>(null);
  const [aiApprovalPolicyRegistry, setAiApprovalPolicyRegistry] = useState<
    AiApprovalPolicyResponse[]
  >([]);
  const [aiAgentCatalog, setAiAgentCatalog] = useState<AiAgentCatalogResponse[]>(
    [],
  );
  const [aiPromptRegistry, setAiPromptRegistry] = useState<
    AiPromptRegistryResponse[]
  >([]);
  const [aiToolRegistry, setAiToolRegistry] = useState<AiToolRegistryResponse[]>(
    [],
  );
  const [growthAssistAiEnvelope, setGrowthAssistAiEnvelope] =
    useState<AiSuggestionEnvelopeResponse | null>(null);
  const [growthAssistAiToolAccess, setGrowthAssistAiToolAccess] = useState<
    AiAgentToolAccessResponse[]
  >([]);
  const [growthAssistAiApprovalPolicies, setGrowthAssistAiApprovalPolicies] =
    useState<AiApprovalPolicyResponse[]>([]);
  const [growthAssistAiApprovalRequests, setGrowthAssistAiApprovalRequests] =
    useState<AiApprovalRequestResponse[]>([]);
  const [growthAiApprovalStatusFilter, setGrowthAiApprovalStatusFilter] =
    useState<AiApprovalRequestStatusFilter>('all');
  const [tenantAiApprovalWorkspace, setTenantAiApprovalWorkspace] = useState<
    AiApprovalRequestResponse[]
  >([]);
  const [tenantAiApprovalWorkspaceStatusFilter, setTenantAiApprovalWorkspaceStatusFilter] =
    useState<AiApprovalRequestStatusFilter>('all');
  const [tenantAiApprovalWorkspaceSummary, setTenantAiApprovalWorkspaceSummary] =
    useState<AiApprovalWorkspaceResponse | null>(null);
  const [tenantAiApprovalWorkspaceLoading, setTenantAiApprovalWorkspaceLoading] =
    useState(false);
  const [tenantAiOperationsSummary, setTenantAiOperationsSummary] =
    useState<AiOperationsSummaryResponse | null>(null);
  const [tenantAiOperationsSummaryLoading, setTenantAiOperationsSummaryLoading] =
    useState(false);
  const [tenantAiActivityFeed, setTenantAiActivityFeed] =
    useState<AiActivityFeedResponse | null>(null);
  const [tenantAiActivityFeedFilter, setTenantAiActivityFeedFilter] =
    useState<TenantAiActivityFeedFilter>('all');
  const [tenantAiActivityFeedLoading, setTenantAiActivityFeedLoading] =
    useState(false);
  const [tenantAiMemoryWorkspace, setTenantAiMemoryWorkspace] =
    useState<AiMemoryWorkspaceResponse | null>(null);
  const [tenantAiMemoryWorkspaceLoading, setTenantAiMemoryWorkspaceLoading] =
    useState(false);
  const [tenantAiHealthWorkspace, setTenantAiHealthWorkspace] =
    useState<AiHealthWorkspaceResponse | null>(null);
  const [tenantAiHealthWorkspaceLoading, setTenantAiHealthWorkspaceLoading] =
    useState(false);
  const [tenantAiEvaluationWorkspace, setTenantAiEvaluationWorkspace] =
    useState<AiEvaluationWorkspaceResponse | null>(null);
  const [tenantAiEvaluationWorkspaceLoading, setTenantAiEvaluationWorkspaceLoading] =
    useState(false);
  const [tenantAiGovernanceWorkspace, setTenantAiGovernanceWorkspace] =
    useState<AiGovernanceWorkspaceResponse | null>(null);
  const [tenantAiGovernanceWorkspaceLoading, setTenantAiGovernanceWorkspaceLoading] =
    useState(false);
  const [tenantAiPolicySimulationWorkspace, setTenantAiPolicySimulationWorkspace] =
    useState<AiPolicySimulationWorkspaceResponse | null>(null);
  const [
    tenantAiPolicySimulationWorkspaceLoading,
    setTenantAiPolicySimulationWorkspaceLoading,
  ] = useState(false);
  const [tenantAiApprovalDesignWorkspace, setTenantAiApprovalDesignWorkspace] =
    useState<AiApprovalDesignWorkspaceResponse | null>(null);
  const [
    tenantAiApprovalDesignWorkspaceLoading,
    setTenantAiApprovalDesignWorkspaceLoading,
  ] = useState(false);
  const [tenantAiApprovalCapacityWorkspace, setTenantAiApprovalCapacityWorkspace] =
    useState<AiApprovalCapacityWorkspaceResponse | null>(null);
  const [
    tenantAiApprovalCapacityWorkspaceLoading,
    setTenantAiApprovalCapacityWorkspaceLoading,
  ] = useState(false);
  const [tenantAiApprovalSlaWorkspace, setTenantAiApprovalSlaWorkspace] =
    useState<AiApprovalSlaWorkspaceResponse | null>(null);
  const [
    tenantAiApprovalSlaWorkspaceLoading,
    setTenantAiApprovalSlaWorkspaceLoading,
  ] = useState(false);
  const [tenantAiApprovalStaffingWorkspace, setTenantAiApprovalStaffingWorkspace] =
    useState<AiApprovalStaffingWorkspaceResponse | null>(null);
  const [
    tenantAiApprovalStaffingWorkspaceLoading,
    setTenantAiApprovalStaffingWorkspaceLoading,
  ] = useState(false);
  const [
    tenantAiApprovalStaffingPlanWorkspace,
    setTenantAiApprovalStaffingPlanWorkspace,
  ] = useState<AiApprovalStaffingPlanWorkspaceResponse | null>(null);
  const [
    tenantAiApprovalStaffingPlanWorkspaceLoading,
    setTenantAiApprovalStaffingPlanWorkspaceLoading,
  ] = useState(false);
  const [
    tenantAiApprovalRolloutWorkspace,
    setTenantAiApprovalRolloutWorkspace,
  ] = useState<AiApprovalRolloutWorkspaceResponse | null>(null);
  const [
    tenantAiApprovalRolloutWorkspaceLoading,
    setTenantAiApprovalRolloutWorkspaceLoading,
  ] = useState(false);
  const [
    tenantAiApprovalReadinessWorkspace,
    setTenantAiApprovalReadinessWorkspace,
  ] = useState<AiApprovalReadinessWorkspaceResponse | null>(null);
  const [
    tenantAiApprovalReadinessWorkspaceLoading,
    setTenantAiApprovalReadinessWorkspaceLoading,
  ] = useState(false);
  const [
    tenantAiApprovalLaunchWorkspace,
    setTenantAiApprovalLaunchWorkspace,
  ] = useState<AiApprovalLaunchWorkspaceResponse | null>(null);
  const [
    tenantAiApprovalLaunchWorkspaceLoading,
    setTenantAiApprovalLaunchWorkspaceLoading,
  ] = useState(false);
  const [tenantAiHandoffWorkspaceSummary, setTenantAiHandoffWorkspaceSummary] =
    useState<AiHandoffWorkspaceResponse | null>(null);
  const [tenantAiSuggestionWorkspace, setTenantAiSuggestionWorkspace] = useState<
    AiSuggestionRunResponse[]
  >([]);
  const [tenantAiSuggestionWorkspaceAgentFilter, setTenantAiSuggestionWorkspaceAgentFilter] =
    useState<'all' | 'growth-assist-coach' | 'invoice-document-assistant'>('all');
  const [tenantAiSuggestionWorkspaceLoading, setTenantAiSuggestionWorkspaceLoading] =
    useState(false);
  const [selectedTenantAiSuggestionWorkspaceDetail, setSelectedTenantAiSuggestionWorkspaceDetail] =
    useState<AiSuggestionRunDetailResponse | null>(null);
  const [growthAssistAiSuggestionRuns, setGrowthAssistAiSuggestionRuns] =
    useState<AiSuggestionRunResponse[]>([]);
  const [selectedGrowthAiSuggestionRunDetail, setSelectedGrowthAiSuggestionRunDetail] =
    useState<AiSuggestionRunDetailResponse | null>(null);
  const [whatsappSummary, setWhatsappSummary] =
    useState<WhatsappOutboundReportingSummaryResponse | null>(null);
  const [whatsappMonitorSummary, setWhatsappMonitorSummary] =
    useState<WhatsappOperationalMonitorSummaryResponse | null>(null);
  const [whatsappMonitorAnalytics, setWhatsappMonitorAnalytics] =
    useState<WhatsappOperationalMonitorAnalyticsResponse | null>(null);
  const [growthLoading, setGrowthLoading] = useState(false);
  const [growthError, setGrowthError] = useState<string | null>(null);
  const [growthActionMessage, setGrowthActionMessage] = useState<string | null>(null);
  const [copiedGrowthAssistReplyKey, setCopiedGrowthAssistReplyKey] = useState<
    string | null
  >(null);
  const [growthActionLoading, setGrowthActionLoading] = useState<string | null>(null);
  const [growthChannelFilter, setGrowthChannelFilter] = useState<
    'all' | 'manual' | 'whatsapp'
  >('whatsapp');
  const [growthAssigneeFilter, setGrowthAssigneeFilter] = useState('');
  const [firstResponseSlaHours, setFirstResponseSlaHours] = useState('2');
  const [followUpSlaHours, setFollowUpSlaHours] = useState('6');
  const [staleThreadHours, setStaleThreadHours] = useState('24');
  const [monitorAutoRunReadyRetries, setMonitorAutoRunReadyRetries] =
    useState(false);
  const [monitorRetryReadyLimit, setMonitorRetryReadyLimit] = useState('10');
  const [growthAlertAcknowledgements, setGrowthAlertAcknowledgements] = useState<
    WhatsappOperationalAlertAcknowledgementResponse[]
  >([]);
  const [growthOperationalCases, setGrowthOperationalCases] = useState<
    GrowthOperationalCaseResponse[]
  >([]);
  const [
    growthOperationalCaseAutoAssignmentSettings,
    setGrowthOperationalCaseAutoAssignmentSettings,
  ] = useState<GrowthOperationalCaseAutoAssignmentSettingsResponse | null>(null);
  const [growthMonitorHistory, setGrowthMonitorHistory] = useState<
    WhatsappOperationalMonitorRunResponse[]
  >([]);
  const [growthFleetSnapshots, setGrowthFleetSnapshots] = useState<
    GrowthFleetTenantSnapshot[]
  >([]);
  const [growthFleetLoading, setGrowthFleetLoading] = useState(false);
  const [growthFleetError, setGrowthFleetError] = useState<string | null>(null);
  const [growthFleetStatusFilter, setGrowthFleetStatusFilter] = useState<
    'all' | 'healthy' | 'warning' | 'critical'
  >('all');
  const [growthFleetOperationalCaseRoutingFilter, setGrowthFleetOperationalCaseRoutingFilter] =
    useState<'all' | GrowthOperationalCaseRoutingPolicyKey>('all');
  const [growthOperationalCaseRoutingFilter, setGrowthOperationalCaseRoutingFilter] =
    useState<'all' | GrowthOperationalCaseRoutingPolicyKey>('all');
  const [growthOperationalCaseAutoAssignmentPolicy, setGrowthOperationalCaseAutoAssignmentPolicy] =
    useState<GrowthOperationalCaseAutoAssignmentPolicyKey>('balanced');
  const [selectedGrowthFleetTenantSlug, setSelectedGrowthFleetTenantSlug] =
    useState<string | null>(null);
  const [growthDrilldownTarget, setGrowthDrilldownTarget] =
    useState<GrowthDrilldownTarget | null>(null);

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
  const extractedCertificateTaxId = useMemo(() => {
    const value =
      electronicSignatureMaterialInspection?.inspection.extractedTaxId?.trim() ??
      '';

    return value || null;
  }, [electronicSignatureMaterialInspection]);
  const issuerTaxIdMatchesCertificate = useMemo(() => {
    if (!extractedCertificateTaxId || !issuerTaxId.trim()) {
      return null;
    }

    return extractedCertificateTaxId === issuerTaxId.trim();
  }, [extractedCertificateTaxId, issuerTaxId]);
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
  const [signatureHydrateMetadataFromPkcs12, setSignatureHydrateMetadataFromPkcs12] =
    useState(false);
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
  const [newDebitNoteReason, setNewDebitNoteReason] = useState(
    'Interes por mora de la factura origen.',
  );
  const [newDebitNoteAmountInCents, setNewDebitNoteAmountInCents] = useState('2500');
  const [newDebitNoteIssuedAt, setNewDebitNoteIssuedAt] = useState('');
  const [newDebitNoteNotes, setNewDebitNoteNotes] = useState(
    'Nota de debito de prueba.',
  );
  const [newDebitNoteTaxRateId, setNewDebitNoteTaxRateId] = useState('');
  const [newRemissionGuideReason, setNewRemissionGuideReason] = useState(
    'Traslado de mercaderia al cliente.',
  );
  const [newRemissionGuideStartAt, setNewRemissionGuideStartAt] = useState('');
  const [newRemissionGuideEndAt, setNewRemissionGuideEndAt] = useState('');
  const [newRemissionGuideDepartureAddress, setNewRemissionGuideDepartureAddress] =
    useState('Sucursal Matriz');
  const [newRemissionGuideArrivalAddress, setNewRemissionGuideArrivalAddress] =
    useState('Bodega del cliente');
  const [newRemissionGuideCarrierName, setNewRemissionGuideCarrierName] = useState(
    'Transportes Demo S.A.',
  );
  const [
    newRemissionGuideCarrierIdentificationType,
    setNewRemissionGuideCarrierIdentificationType,
  ] = useState<'04' | '05' | '06' | '07' | '08'>('04');
  const [
    newRemissionGuideCarrierIdentification,
    setNewRemissionGuideCarrierIdentification,
  ] = useState('1790012345001');
  const [newRemissionGuideVehiclePlate, setNewRemissionGuideVehiclePlate] =
    useState('ABC-1234');
  const [newRemissionGuideRoute, setNewRemissionGuideRoute] = useState(
    'Matriz - Cliente',
  );
  const [newRemissionGuideIssuedAt, setNewRemissionGuideIssuedAt] = useState('');
  const [newRemissionGuideNotes, setNewRemissionGuideNotes] = useState(
    'Guia de remision de prueba.',
  );
  const [newWithholdingReason, setNewWithholdingReason] = useState(
    'Retencion sobre la factura origen.',
  );
  const [newWithholdingAmountInCents, setNewWithholdingAmountInCents] =
    useState('1000');
  const [newWithholdingIssuedAt, setNewWithholdingIssuedAt] = useState('');
  const [newWithholdingNotes, setNewWithholdingNotes] = useState(
    'Comprobante de retencion de prueba.',
  );
  const [newWithholdingTaxRateId, setNewWithholdingTaxRateId] = useState('');
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
  const canReadInvoicingReports = Boolean(
    currentTenancy?.permissionKeys.includes('invoicing.reports.read'),
  );
  const canReadGrowthConversations = Boolean(
    currentTenancy?.permissionKeys.includes('growth.conversations.read'),
  );
  const canManageGrowthConversations = Boolean(
    currentTenancy?.permissionKeys.includes('growth.conversations.manage'),
  );
  const growthAccessibleTenancies = useMemo(
    () =>
      session?.tenancies.filter((tenancy) =>
        tenancy.permissionKeys.includes('growth.conversations.read'),
      ) ?? [],
    [session],
  );
  const growthWorkspaceFleetAvailable = growthAccessibleTenancies.length > 0;
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
  const growthProductEnabled = enabledProductKeys.has('growth');
  const growthWorkspaceAvailable = canReadGrowthConversations;
  const currentTenantGrowthAccessible = Boolean(
    currentTenancy?.permissionKeys.includes('growth.conversations.read'),
  );
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
  const leadingOperationalAlerts = useMemo(
    () => whatsappSummary?.operationalAlerts.slice(0, 4) ?? [],
    [whatsappSummary],
  );
  const leadingProviderTaxonomy = useMemo(
    () => whatsappSummary?.byProviderTaxonomy.slice(0, 4) ?? [],
    [whatsappSummary],
  );
  const leadingProviderErrors = useMemo(
    () => whatsappSummary?.topProviderErrorCodes.slice(0, 4) ?? [],
    [whatsappSummary],
  );
  const leadingHistoricalAlerts = useMemo(
    () => whatsappMonitorAnalytics?.alertFrequency.slice(0, 4) ?? [],
    [whatsappMonitorAnalytics],
  );
  const thresholdCalibrationSuggestions = useMemo(
    () => whatsappMonitorAnalytics?.thresholdCalibration.slice(0, 4) ?? [],
    [whatsappMonitorAnalytics],
  );
  const workbenchThreads = useMemo(
    () => growthWorkbench?.threads.slice(0, 6) ?? [],
    [growthWorkbench],
  );
  const currentTenantAlertAcknowledgements = useMemo(() => {
    return new Map(
      growthAlertAcknowledgements
        .map((acknowledgement) => [acknowledgement.alertKey, acknowledgement] as const),
    );
  }, [growthAlertAcknowledgements]);
  const currentTenantOperationalCasesBySourceKey = useMemo(() => {
    return new Map(
      growthOperationalCases
        .filter((entry) => entry.status !== 'resolved')
        .map((entry) => [entry.sourceKey, entry] as const),
    );
  }, [growthOperationalCases]);
  const currentTenantOperationalCaseCountsByRoutingPolicy = useMemo(() => {
    return growthOperationalCases.reduce(
      (counts, entry) => {
        if (entry.status !== 'resolved') {
          counts[entry.routingPolicyKey] += 1;
        }

        return counts;
      },
      {
        growth_ops: 0,
        escalation_review: 0,
        owner_assignment: 0,
        follow_up_team: 0,
        follow_up_waiting_customer: 0,
      } satisfies Record<GrowthOperationalCaseRoutingPolicyKey, number>,
    );
  }, [growthOperationalCases]);
  const visibleAlertHistory = useMemo(
    () => growthMonitorHistory.slice(0, 6),
    [growthMonitorHistory],
  );
  const acknowledgedAlertCount = currentTenantAlertAcknowledgements.size;
  const filteredGrowthOperationalCases = useMemo(
    () =>
      growthOperationalCases
        .filter((entry) => entry.status !== 'resolved')
        .filter((entry) =>
          growthOperationalCaseRoutingFilter === 'all'
            ? true
            : entry.routingPolicyKey === growthOperationalCaseRoutingFilter,
        )
        .sort(
          (left, right) =>
            operationalStatusWeight(right.priority) -
              operationalStatusWeight(left.priority) ||
            (left.dueAt ?? '').localeCompare(right.dueAt ?? '') ||
            right.updatedAt.localeCompare(left.updatedAt),
        ),
    [growthOperationalCaseRoutingFilter, growthOperationalCases],
  );
  const visibleGrowthOperationalCases = useMemo(
    () => filteredGrowthOperationalCases.slice(0, 8),
    [filteredGrowthOperationalCases],
  );
  const visibleGrowthOperationalCaseLanes = useMemo(
    () =>
      growthOperationalCaseRoutingPolicies.map((policy) => ({
        ...policy,
        count: currentTenantOperationalCaseCountsByRoutingPolicy[policy.key],
        entries: visibleGrowthOperationalCases.filter(
          (entry) => entry.routingPolicyKey === policy.key,
        ),
      })),
    [currentTenantOperationalCaseCountsByRoutingPolicy, visibleGrowthOperationalCases],
  );
  const growthFleetPartialFailureCount = Math.max(
    0,
    growthAccessibleTenancies.length - growthFleetSnapshots.length,
  );
  const filteredGrowthFleetSnapshots = useMemo(() => {
    return growthFleetSnapshots.filter((snapshot) => {
      if (growthFleetStatusFilter === 'all') {
        return true;
      }

      return (
        snapshot.summary.operationalDashboard.overallStatus ===
        growthFleetStatusFilter
      );
    });
  }, [growthFleetSnapshots, growthFleetStatusFilter]);
  const effectiveSelectedGrowthFleetTenantSlug = useMemo(() => {
    const preferredTenantSlug = selectedGrowthFleetTenantSlug?.trim() ?? '';
    if (
      preferredTenantSlug &&
      growthFleetSnapshots.some(
        (snapshot) => snapshot.tenancy.tenant.slug === preferredTenantSlug,
      )
    ) {
      return preferredTenantSlug;
    }

    const currentTenantSlug = currentTenancy?.tenant.slug ?? '';
    if (
      currentTenantSlug &&
      growthFleetSnapshots.some(
        (snapshot) => snapshot.tenancy.tenant.slug === currentTenantSlug,
      )
    ) {
      return currentTenantSlug;
    }

    return growthFleetSnapshots[0]?.tenancy.tenant.slug ?? null;
  }, [currentTenancy, growthFleetSnapshots, selectedGrowthFleetTenantSlug]);
  const selectedGrowthFleetTenant = useMemo(() => {
    if (!effectiveSelectedGrowthFleetTenantSlug) {
      return null;
    }

    return (
      growthFleetSnapshots.find(
        (snapshot) =>
          snapshot.tenancy.tenant.slug === effectiveSelectedGrowthFleetTenantSlug,
      ) ?? null
    );
  }, [effectiveSelectedGrowthFleetTenantSlug, growthFleetSnapshots]);
  const selectedGrowthFleetTenantCaseCountsByRoutingPolicy = useMemo(() => {
    if (!selectedGrowthFleetTenant) {
      return null;
    }

    return selectedGrowthFleetTenant.cases.reduce(
      (counts, entry) => {
        if (entry.status !== 'resolved') {
          counts[entry.routingPolicyKey] += 1;
        }

        return counts;
      },
      {
        growth_ops: 0,
        escalation_review: 0,
        owner_assignment: 0,
        follow_up_team: 0,
        follow_up_waiting_customer: 0,
      } satisfies Record<GrowthOperationalCaseRoutingPolicyKey, number>,
    );
  }, [selectedGrowthFleetTenant]);
  const growthFleetOverview = useMemo(() => {
    return growthFleetSnapshots.reduce(
      (summary, snapshot) => {
        const status = snapshot.summary.operationalDashboard.overallStatus;

        summary.statusCounts[status] += 1;
        summary.totalActiveAlerts += snapshot.summary.operationalAlerts.length;
        summary.totalCriticalAlerts += snapshot.summary.operationalAlerts.filter(
          (alert) => alert.severity === 'critical',
        ).length;
        summary.totalReadyRetries +=
          snapshot.summary.retryOperations.readyNowCount;
        summary.totalAcknowledgements += snapshot.acknowledgements.length;
        summary.totalOperationalCases += snapshot.cases.filter(
          (entry) => entry.status !== 'resolved',
        ).length;

        return summary;
      },
      {
        statusCounts: {
          healthy: 0,
          warning: 0,
          critical: 0,
        },
        totalActiveAlerts: 0,
        totalCriticalAlerts: 0,
        totalReadyRetries: 0,
        totalAcknowledgements: 0,
        totalOperationalCases: 0,
      },
    );
  }, [growthFleetSnapshots]);
  const growthFleetOperationalCaseQueue = useMemo(() => {
    return growthFleetSnapshots
      .flatMap((snapshot) =>
        snapshot.cases.map((entry) => ({
          ...entry,
          tenantSlug: snapshot.tenancy.tenant.slug,
          tenantName: snapshot.tenancy.tenant.name,
        })),
      )
      .filter((entry) => entry.status !== 'resolved')
      .sort(
        (left, right) =>
          operationalStatusWeight(right.priority) -
            operationalStatusWeight(left.priority) ||
          (left.dueAt ?? '').localeCompare(right.dueAt ?? '') ||
          right.updatedAt.localeCompare(left.updatedAt),
      );
  }, [growthFleetSnapshots]);
  const growthFleetOperationalCaseCountsByRoutingPolicy = useMemo(() => {
    return growthFleetOperationalCaseQueue.reduce(
      (counts, entry) => {
        counts[entry.routingPolicyKey] += 1;
        return counts;
      },
      {
        growth_ops: 0,
        escalation_review: 0,
        owner_assignment: 0,
        follow_up_team: 0,
        follow_up_waiting_customer: 0,
      } satisfies Record<GrowthOperationalCaseRoutingPolicyKey, number>,
    );
  }, [growthFleetOperationalCaseQueue]);
  const filteredGrowthFleetOperationalCases = useMemo(
    () =>
      growthFleetOperationalCaseQueue.filter((entry) =>
        growthFleetOperationalCaseRoutingFilter === 'all'
          ? true
          : entry.routingPolicyKey === growthFleetOperationalCaseRoutingFilter,
      ),
    [growthFleetOperationalCaseQueue, growthFleetOperationalCaseRoutingFilter],
  );
  const visibleGrowthFleetOperationalCases = useMemo(
    () => filteredGrowthFleetOperationalCases.slice(0, 8),
    [filteredGrowthFleetOperationalCases],
  );
  const visibleGrowthFleetOperationalCaseLanes = useMemo(
    () =>
      growthOperationalCaseRoutingPolicies.map((policy) => ({
        ...policy,
        count: growthFleetOperationalCaseCountsByRoutingPolicy[policy.key],
        entries: visibleGrowthFleetOperationalCases.filter(
          (entry) => entry.routingPolicyKey === policy.key,
        ),
      })),
    [
      growthFleetOperationalCaseCountsByRoutingPolicy,
      visibleGrowthFleetOperationalCases,
    ],
  );
  const growthFleetOperationalCasesBySourceKey = useMemo(() => {
    return new Map(
      growthFleetSnapshots.flatMap((snapshot) =>
        snapshot.cases
          .filter((entry) => entry.status !== 'resolved')
          .map((entry) => [
            `${snapshot.tenancy.tenant.slug}:${entry.sourceKey}`,
            {
              ...entry,
              tenantSlug: snapshot.tenancy.tenant.slug,
              tenantName: snapshot.tenancy.tenant.name,
            },
          ] as const),
      ),
    );
  }, [growthFleetSnapshots]);
  const growthFleetTopAlerts = useMemo(() => {
    const alertMap = new Map<
      string,
      {
        key: string;
        title: string;
        severity: 'warning' | 'critical';
        tenantCount: number;
        occurrenceCount: number;
        lastSeenAt: string;
      }
    >();

    for (const snapshot of growthFleetSnapshots) {
      for (const alert of snapshot.summary.operationalAlerts) {
        const current = alertMap.get(alert.key);
        if (current) {
          current.tenantCount += 1;
          current.occurrenceCount += 1;
          current.lastSeenAt =
            current.lastSeenAt > snapshot.summary.generatedAt
              ? current.lastSeenAt
              : snapshot.summary.generatedAt;
        } else {
          alertMap.set(alert.key, {
            key: alert.key,
            title: alert.title,
            severity: alert.severity,
            tenantCount: 1,
            occurrenceCount: 1,
            lastSeenAt: snapshot.summary.generatedAt,
          });
        }
      }
    }

    return [...alertMap.values()]
      .sort((left, right) => {
        return (
          right.tenantCount - left.tenantCount ||
          operationalStatusWeight(
            left.severity === 'critical' ? 'critical' : 'warning',
          ) -
            operationalStatusWeight(
              right.severity === 'critical' ? 'critical' : 'warning',
            ) ||
          right.lastSeenAt.localeCompare(left.lastSeenAt)
        );
      })
      .slice(0, 4);
  }, [growthFleetSnapshots]);
  const growthFleetTopTaxonomy = useMemo(() => {
    const taxonomyMap = new Map<
      string,
      {
        key: string;
        provider: string;
        providerTaxonomyFamily: string;
        providerTaxonomyDetail: string;
        tenantCount: number;
        messageCount: number;
      }
    >();

    for (const snapshot of growthFleetSnapshots) {
      for (const entry of snapshot.summary.byProviderTaxonomy) {
        const key = `${entry.provider}-${entry.providerTaxonomyFamily}-${entry.providerTaxonomyDetail}`;
        const current = taxonomyMap.get(key);
        if (current) {
          current.tenantCount += 1;
          current.messageCount += entry.messageCount;
        } else {
          taxonomyMap.set(key, {
            key,
            provider: entry.provider,
            providerTaxonomyFamily: entry.providerTaxonomyFamily,
            providerTaxonomyDetail: entry.providerTaxonomyDetail,
            tenantCount: 1,
            messageCount: entry.messageCount,
          });
        }
      }
    }

    return [...taxonomyMap.values()]
      .sort(
        (left, right) =>
          right.tenantCount - left.tenantCount ||
          right.messageCount - left.messageCount,
      )
      .slice(0, 4);
  }, [growthFleetSnapshots]);
  const growthFleetEscalationCandidates = useMemo(() => {
    return growthFleetSnapshots
      .map((snapshot) => {
        const criticalAlertCount = snapshot.summary.operationalAlerts.filter(
          (alert) => alert.severity === 'critical',
        ).length;
        const unacknowledgedCriticalCount = snapshot.summary.operationalAlerts.filter(
          (alert) =>
            alert.severity === 'critical' &&
            !snapshot.acknowledgements.some(
              (acknowledgement) => acknowledgement.alertKey === alert.key,
            ),
        ).length;
        const staleSchedulerCoverage =
          snapshot.analytics.triggerSourceCounts.scheduler === 0;
        const score =
          criticalAlertCount * 5 +
          unacknowledgedCriticalCount * 4 +
          snapshot.summary.retryOperations.readyNowCount * 2 +
          (staleSchedulerCoverage ? 2 : 0) +
          snapshot.workbench.summary.overdueFollowUpCount +
          snapshot.workbench.summary.unassignedThreadCount;

        return {
          tenantSlug: snapshot.tenancy.tenant.slug,
          tenantName: snapshot.tenancy.tenant.name,
          overallStatus: snapshot.summary.operationalDashboard.overallStatus,
          criticalAlertCount,
          unacknowledgedCriticalCount,
          readyNowCount: snapshot.summary.retryOperations.readyNowCount,
          overdueFollowUpCount: snapshot.workbench.summary.overdueFollowUpCount,
          unassignedThreadCount: snapshot.workbench.summary.unassignedThreadCount,
          staleSchedulerCoverage,
          score,
        };
      })
      .filter((entry) => entry.score > 0)
      .sort(
        (left, right) =>
          right.score - left.score ||
          operationalStatusWeight(right.overallStatus) -
            operationalStatusWeight(left.overallStatus) ||
          right.criticalAlertCount - left.criticalAlertCount,
      )
      .slice(0, 5);
  }, [growthFleetSnapshots]);
  const growthFleetStaffingPressure = useMemo(() => {
    return growthFleetSnapshots
      .map((snapshot) => {
        const summary = snapshot.workbench.summary;
        const pressureScore =
          summary.waitingOnTeamCount * 2 +
          summary.unassignedThreadCount * 3 +
          summary.staleThreadCount * 2 +
          summary.overdueFirstResponseCount * 4 +
          summary.overdueFollowUpCount * 3;

        return {
          tenantSlug: snapshot.tenancy.tenant.slug,
          tenantName: snapshot.tenancy.tenant.name,
          waitingOnTeamCount: summary.waitingOnTeamCount,
          unassignedThreadCount: summary.unassignedThreadCount,
          staleThreadCount: summary.staleThreadCount,
          overdueFirstResponseCount: summary.overdueFirstResponseCount,
          overdueFollowUpCount: summary.overdueFollowUpCount,
          openThreadCount: summary.openThreadCount,
          pressureScore,
        };
      })
      .filter((entry) => entry.pressureScore > 0)
      .sort(
        (left, right) =>
          right.pressureScore - left.pressureScore ||
          right.overdueFirstResponseCount - left.overdueFirstResponseCount ||
          right.unassignedThreadCount - left.unassignedThreadCount,
      )
      .slice(0, 5);
  }, [growthFleetSnapshots]);
  const growthFleetOwnershipQueue = useMemo(() => {
    return growthFleetSnapshots
      .flatMap((snapshot) =>
        snapshot.workbench.threads.map((thread) => {
          const ownershipScore =
            workbenchPriorityWeight(thread.priority) * 5 +
            (thread.assigneeUserId ? 0 : 4) +
            (thread.nextActionOwner === 'team' ? 2 : 0) +
            (thread.firstResponseStatus === 'overdue' ? 4 : 0) +
            (thread.followUpStatus === 'overdue' ? 3 : 0) +
            (thread.staleStatus === 'stale' ? 2 : 0);

          return {
            tenantSlug: snapshot.tenancy.tenant.slug,
            tenantName: snapshot.tenancy.tenant.name,
            threadId: thread.threadId,
            subject: thread.subject,
            channel: thread.channel,
            assigneeUserId: thread.assigneeUserId,
            nextActionOwner: thread.nextActionOwner,
            firstResponseStatus: thread.firstResponseStatus,
            followUpStatus: thread.followUpStatus,
            staleStatus: thread.staleStatus,
            priority: thread.priority,
            hoursSinceLastActivity: thread.hoursSinceLastActivity,
            ownershipScore,
          };
        }),
      )
      .filter((thread) => thread.ownershipScore > 0)
      .sort(
        (left, right) =>
          right.ownershipScore - left.ownershipScore ||
          workbenchPriorityWeight(right.priority) -
            workbenchPriorityWeight(left.priority) ||
          right.hoursSinceLastActivity - left.hoursSinceLastActivity,
      )
      .slice(0, 8);
  }, [growthFleetSnapshots]);
  const growthFleetRunbooks = useMemo(() => {
    const runbooks: GrowthFleetRunbook[] = [];

    const schedulerGapTenants = growthFleetEscalationCandidates
      .filter((entry) => entry.staleSchedulerCoverage)
      .map((entry) => entry.tenantName);
    if (schedulerGapTenants.length > 0) {
      runbooks.push({
        key: 'scheduler-coverage-gap',
        severity: 'warning',
        title: 'Recuperar cobertura del scheduler',
        summary:
          'Hay tenancies críticas o sensibles sin evidencia reciente de corridas automáticas del monitor.',
        affectedTenants: schedulerGapTenants,
        steps: [
          'Verificar que el scheduler esté habilitado para esos tenants y que la lista de slugs siga vigente.',
          'Ejecutar el monitor manualmente si hace falta una lectura inmediata antes de corregir el scheduler.',
          'Confirmar que vuelva a aparecer mezcla scheduler/manual en la analítica histórica del tenant.',
        ],
      });
    }

    const unackCriticalTenants = growthFleetEscalationCandidates
      .filter((entry) => entry.unacknowledgedCriticalCount > 0)
      .map((entry) => entry.tenantName);
    if (unackCriticalTenants.length > 0) {
      runbooks.push({
        key: 'critical-alert-triage',
        severity: 'critical',
        title: 'Triage de alertas críticas sin acknowledgement',
        summary:
          'La flota todavía muestra alertas críticas activas que ningún operador ha reconocido.',
        affectedTenants: unackCriticalTenants,
        steps: [
          'Entrar al tenant más crítico desde la cola fleet y revisar la alerta dominante.',
          'Confirmar si el bloqueo es de policy, configuración o backlog de retries antes de reconocerlo.',
          'Dejar acknowledgement solo cuando ya exista dueño claro y acción concreta en curso.',
        ],
      });
    }

    const retryPressureTenants = growthFleetEscalationCandidates
      .filter((entry) => entry.readyNowCount > 0)
      .map((entry) => entry.tenantName);
    if (retryPressureTenants.length > 0) {
      runbooks.push({
        key: 'retry-backlog-pressure',
        severity:
          growthFleetOverview.totalReadyRetries >= 5 ? 'critical' : 'warning',
        title: 'Vaciar backlog de ready-now retries',
        summary:
          'Hay mensajes fallidos listos para reintento repartidos en varias colas tenant-aware.',
        affectedTenants: retryPressureTenants,
        steps: [
          'Priorizar primero tenants con más ready-now retries y alertas críticas simultáneas.',
          'Usar el monitor/manual retry posture del tenant para separar fallos reintentables de permanentes.',
          'Volver al radar fleet y confirmar que el backlog agregado baje después de intervenir.',
        ],
      });
    }

    const staffingTenants = growthFleetStaffingPressure
      .filter(
        (entry) =>
          entry.overdueFirstResponseCount > 0 || entry.unassignedThreadCount > 0,
      )
      .map((entry) => entry.tenantName);
    if (staffingTenants.length > 0) {
      runbooks.push({
        key: 'staffing-overload',
        severity: 'warning',
        title: 'Rebalancear ownership y capacidad',
        summary:
          'El workbench cross-tenant ya muestra colas con señales de falta de owner o follow-up vencido.',
        affectedTenants: staffingTenants,
        steps: [
          'Entrar a los tenants con mayor pressure score y asignar primero threads unassigned u overdue first response.',
          'Validar si el problema es de capacidad real o de filtros/owners desactualizados en el tenant.',
          'Revisar luego la queue cross-tenant para confirmar que bajó la presión agregada.',
        ],
      });
    }

    const clusteredTaxonomies = growthFleetTopTaxonomy
      .filter((entry) => entry.tenantCount > 1)
      .map((entry) => humanizeKey(entry.providerTaxonomyDetail));
    if (clusteredTaxonomies.length > 0) {
      runbooks.push({
        key: 'provider-pattern-cluster',
        severity: 'healthy',
        title: 'Consolidar patrón compartido del provider',
        summary:
          'La flota ya deja ver taxonomías repetidas que conviene tratar como incidente compartido y no como casos aislados.',
        affectedTenants: growthFleetTopTaxonomy
          .filter((entry) => entry.tenantCount > 1)
          .map((entry) => `${entry.provider} · ${humanizeKey(entry.providerTaxonomyDetail)}`),
        steps: [
          'Agrupar los tenants afectados por la misma taxonomía antes de tomar acciones dispersas.',
          'Contrastar si el patrón apunta a policy, throughput o configuración para definir un solo frente de trabajo.',
          'Actualizar thresholds o documentación operativa solo cuando el patrón ya esté suficientemente repetido.',
        ],
      });
    }

    return runbooks.slice(0, 5);
  }, [
    growthFleetEscalationCandidates,
    growthFleetOverview.totalReadyRetries,
    growthFleetStaffingPressure,
    growthFleetTopTaxonomy,
  ]);
  const growthFleetOperatorBrief = useMemo(() => {
    if (!growthWorkspaceFleetAvailable) {
      return null;
    }

    if (growthFleetOverview.statusCounts.critical > 0) {
      return {
        headline:
          'Hay tenancies en estado critico; la consola fleet ya sirve para decidir donde intervenir primero.',
        detail:
          'Empieza por las colas con mayor numero de alertas activas o ready-now retries y luego entra al tenant puntual para operar el detalle.',
      };
    }

    if (growthFleetOverview.statusCounts.warning > 0) {
      return {
        headline:
          'La flota no esta rota, pero si muestra desgaste distribuido entre varios tenants.',
        detail:
          'Usa los hotspots compartidos para encontrar taxonomias o alertas repetidas antes de que se vuelvan un patron critico.',
      };
    }

    return {
      headline:
        'La flota esta saludable; esta vista ya funciona como radar cruzado y no solo como panel del tenant actual.',
      detail:
        'Aprovecha este momento para revisar tenants sin corridas recientes o con thresholds que todavia se estan calibrando.',
    };
  }, [growthFleetOverview, growthWorkspaceFleetAvailable]);
  const growthFiltersCustomized = useMemo(
    () =>
      growthChannelFilter !== 'whatsapp' ||
      growthAssigneeFilter.trim().length > 0 ||
      firstResponseSlaHours !== '2' ||
      followUpSlaHours !== '6' ||
      staleThreadHours !== '24',
    [
      firstResponseSlaHours,
      followUpSlaHours,
      growthAssigneeFilter,
      growthChannelFilter,
      staleThreadHours,
    ],
  );
  const growthOperatorBrief = useMemo(() => {
    if (!whatsappSummary) {
      return null;
    }

    const dashboard = whatsappSummary.operationalDashboard;
    const firstAlert = whatsappSummary.operationalAlerts[0] ?? null;

    if (dashboard.overallStatus === 'critical') {
      return {
        headline:
          'La operacion necesita intervencion prioritaria antes de seguir empujando mas trafico.',
        detail:
          firstAlert?.recommendedAction ??
          'Revisa bloqueos de configuracion, policy o backlog de retries antes de enviar mas mensajes.',
      };
    }

    if (dashboard.overallStatus === 'warning') {
      return {
        headline:
          'Hay senales de desgaste operativo; la cola sigue viva, pero conviene actuar antes de que escale.',
        detail:
          firstAlert?.recommendedAction ??
          'Empieza por la taxonomia dominante y el backlog listo para retry para bajar la presion.',
      };
    }

    return {
      headline:
        'La cola esta saludable; este es un buen momento para usar la vista como radar temprano y no solo como alarma.',
      detail:
        'Si cambias filtros o ejecutas el monitor manual, el dashboard te devolvera una lectura fresca del tenant actual.',
    };
  }, [whatsappSummary]);
  const growthAssistSignals = useMemo(() => {
    const openCases = growthOperationalCases.filter(
      (entry) => entry.status !== 'resolved',
    );

    return {
      replyNowCount: growthWorkbench?.summary.overdueFirstResponseCount ?? 0,
      followUpNowCount:
        (growthWorkbench?.summary.overdueFollowUpCount ?? 0) +
        openCases.filter((entry) => entry.routingPolicyKey === 'follow_up_team').length,
      waitingCustomerCount: openCases.filter(
        (entry) =>
          entry.routingPolicyKey === 'follow_up_waiting_customer' ||
          entry.followUpState === 'waiting_customer',
      ).length,
      queueToOrganizeCount:
        (growthWorkbench?.summary.unassignedThreadCount ?? 0) +
        openCases.filter(
          (entry) =>
            entry.routingPolicyKey === 'owner_assignment' ||
            entry.routingPolicyKey === 'escalation_review',
        ).length,
      channelRiskCount: whatsappSummary?.operationalAlerts.length ?? 0,
    };
  }, [growthOperationalCases, growthWorkbench, whatsappSummary]);
  const growthAssistSummary = useMemo<GrowthAssistDailyAgendaResponse['summary'] | null>(() => {
    if (!growthWorkbench || !whatsappSummary) {
      return null;
    }

    const dashboard = whatsappSummary.operationalDashboard;
    const baseSummary = {
      replyNowCount: growthAssistSignals.replyNowCount,
      followUpNowCount: growthAssistSignals.followUpNowCount,
      waitingCustomerCount: growthAssistSignals.waitingCustomerCount,
      queueToOrganizeCount: growthAssistSignals.queueToOrganizeCount,
      channelRiskCount: growthAssistSignals.channelRiskCount,
      savedPolicyKey:
        (growthOperationalCaseAutoAssignmentSettings?.defaultPolicyKey ?? 'balanced') as
          GrowthAssistDailyAgendaResponse['summary']['savedPolicyKey'],
    };

    if (growthAssistSignals.replyNowCount > 0) {
      return {
        ...baseSummary,
        tone: 'critical' as const,
        headline: 'Hoy ya hay conversaciones que necesitan respuesta inmediata.',
        detail:
          'Empieza por las conversaciones sin primera respuesta o con seguimiento vencido antes de abrir campañas nuevas.',
      };
    }

    if (growthAssistSignals.followUpNowCount > 0) {
      return {
        ...baseSummary,
        tone: 'warning' as const,
        headline: 'La bandeja no esta rota, pero si hay seguimientos que no conviene dejar enfriar.',
        detail:
          'Usa esta agenda como recordatorio simple: primero sigue lo que ya esta caliente, luego reparte owner nuevo si hace falta.',
      };
    }

    if (dashboard.overallStatus === 'critical') {
      return {
        ...baseSummary,
        tone: 'critical' as const,
        headline: 'La conversacion comercial esta ordenada, pero el canal necesita atencion.',
        detail:
          'Antes de empujar mas trafico, revisa el estado del canal y los bloqueos operativos que puedan afectar entregas o retries.',
      };
    }

    if (dashboard.overallStatus === 'warning') {
      return {
        ...baseSummary,
        tone: 'warning' as const,
        headline: 'La agenda esta controlada, aunque el canal ya muestra desgaste ligero.',
        detail:
          'Es buen momento para ordenar la cola y mirar alertas antes de que se conviertan en un problema mayor.',
      };
    }

    return {
      ...baseSummary,
      tone: 'healthy' as const,
      headline: 'La operacion esta bajo control; puedes usar Growth como agenda diaria y radar temprano.',
      detail:
        'No hay urgencias fuertes ahora mismo. Aprovecha para mantener seguimiento consistente y revisar leads calientes antes de que se enfrien.',
    };
  }, [
    growthAssistSignals,
    growthOperationalCaseAutoAssignmentSettings?.defaultPolicyKey,
    growthWorkbench,
    whatsappSummary,
  ]);
  const growthAssistTasks = useMemo(() => {
    const tasks: GrowthAssistTask[] = [];

    if (growthWorkbench) {
      for (const thread of growthWorkbench.threads) {
        if (thread.firstResponseStatus === 'overdue' && thread.nextActionOwner === 'team') {
          tasks.push({
            key: `reply:${thread.threadId}`,
            urgency: 'today',
            category: 'reply_now',
            title: `Responder a ${thread.subject}`,
            summary: `${channelLabel(thread.channel)} lleva ${formatRelativeHours(
              thread.hoursSinceLastInbound ?? thread.hoursSinceOpened,
            )} esperando una respuesta del equipo.`,
            actionLabel: thread.assigneeUserId ? 'Responder ahora' : 'Asignar y responder',
            dueAt: thread.lastInboundAt,
          });
        } else if (
          thread.followUpStatus === 'overdue' &&
          thread.nextActionOwner === 'team'
        ) {
          tasks.push({
            key: `follow-thread:${thread.threadId}`,
            urgency: 'soon',
            category: 'follow_up',
            title: `Retomar ${thread.subject}`,
            summary: `El siguiente paso del equipo ya quedo atrasado y la conversacion lleva ${formatRelativeHours(
              thread.hoursSinceLastActivity,
            )} sin movimiento.`,
            actionLabel: 'Hacer follow-up',
            dueAt: thread.lastActivityAt,
          });
        }
      }
    }

    for (const entry of growthOperationalCases) {
      if (entry.status === 'resolved') {
        continue;
      }

      if (entry.routingPolicyKey === 'owner_assignment') {
        tasks.push({
          key: `case-owner:${entry.id}`,
          urgency: entry.priority === 'critical' ? 'today' : 'soon',
          category: 'assign_owner',
          title: `Definir responsable: ${entry.title}`,
          summary:
            entry.assignedUserEmail === null
              ? 'Nadie lleva este caso todavia; conviene ordenarlo antes de perder contexto.'
              : entry.nextAction,
          actionLabel: 'Auto-organizar cola',
          dueAt: entry.dueAt,
        });
      } else if (entry.routingPolicyKey === 'follow_up_team') {
        tasks.push({
          key: `case-follow-up:${entry.id}`,
          urgency: entry.priority === 'critical' ? 'today' : 'soon',
          category: 'follow_up',
          title: `No dejar enfriar: ${entry.title}`,
          summary: entry.nextAction,
          actionLabel: 'Mover seguimiento',
          dueAt: entry.dueAt,
        });
      } else if (
        entry.routingPolicyKey === 'escalation_review' ||
        entry.caseType === 'alert_escalation'
      ) {
        tasks.push({
          key: `case-risk:${entry.id}`,
          urgency: 'today',
          category: 'channel_risk',
          title: `Revisar bloqueo: ${entry.title}`,
          summary:
            entry.summary ||
            'Este caso ya escalo y conviene revisarlo antes de seguir empujando trafico.',
          actionLabel: 'Revisar routing',
          dueAt: entry.dueAt,
        });
      }
    }

    const urgencyWeight = {
      today: 3,
      soon: 2,
      watch: 1,
    } satisfies Record<GrowthAssistTask['urgency'], number>;

    return tasks
      .sort(
        (left, right) =>
          urgencyWeight[right.urgency] - urgencyWeight[left.urgency] ||
          (left.dueAt ?? '').localeCompare(right.dueAt ?? '') ||
          left.title.localeCompare(right.title),
      )
      .slice(0, 6);
  }, [growthOperationalCases, growthWorkbench]);
  const growthAssistWaitingCustomers = useMemo(() => {
    return growthOperationalCases
      .filter(
        (entry) =>
          entry.status !== 'resolved' &&
          (entry.routingPolicyKey === 'follow_up_waiting_customer' ||
            entry.followUpState === 'waiting_customer'),
      )
      .sort(
        (left, right) =>
          (left.dueAt ?? '').localeCompare(right.dueAt ?? '') ||
          right.updatedAt.localeCompare(left.updatedAt),
      )
      .slice(0, 4);
  }, [growthOperationalCases]);
  const growthAssistPlaybooks = useMemo(() => {
    const playbooks: GrowthAssistPlaybook[] = [];

    if (growthAssistSignals.replyNowCount > 0) {
      playbooks.push({
        key: 'reply-now',
        title: 'Responder primero',
        detail:
          'Antes de abrir nueva prospeccion, responde lo que ya llego caliente. Esa es la forma mas simple de no perder conversion por demora.',
        goal:
          'Recuperar velocidad de respuesta y dejar un siguiente paso claro sin sonar robotico.',
        avoid:
          'No contestes con un texto generico que ignore el contexto ni dejes la conversacion abierta sin siguiente paso.',
        successSignal:
          'El lead responde o acepta el siguiente paso dentro de la misma ventana de seguimiento.',
        whenToUse: 'Cuando hay conversaciones sin primera respuesta o follow-up vencido.',
        steps: [
          'Agradece el contacto y retoma el contexto en una frase simple.',
          'Propón un siguiente paso concreto para hoy.',
          'Cierra con una pregunta breve que invite a responder.',
        ],
      });
    }

    if (growthAssistSignals.queueToOrganizeCount > 0) {
      playbooks.push({
        key: 'queue-organize',
        title: 'Ordenar responsables',
        detail: `El negocio ya puede repartir trabajo con el criterio guardado: ${describeGrowthAssistAutoAssignmentPolicy(
          growthOperationalCaseAutoAssignmentSettings?.defaultPolicyKey ?? 'balanced',
        )}.`,
        goal:
          'Evitar que conversaciones vivas se queden sin dueño o se repartan tarde.',
        avoid:
          'No dejes casos criticos flotando ni asumas que alguien mas los va a tomar despues.',
        successSignal:
          'Cada conversacion prioritaria queda con owner claro y proxima accion visible.',
        whenToUse: 'Cuando hay trabajo sin owner claro o la cola se siente desordenada.',
        steps: [
          'Auto-organiza la cola con el pack guardado.',
          'Revisa si quedó algún caso crítico sin owner.',
          'Confirma quién responde y quién da seguimiento.',
        ],
      });
    }

    if (growthAssistSignals.channelRiskCount > 0) {
      playbooks.push({
        key: 'channel-risk',
        title: 'Cuidar la salud del canal',
        detail:
          'Si el canal esta inestable, mas mensajes no siempre ayudan. Revisa alertas y retries antes de empujar volumen nuevo.',
        goal:
          'Proteger el timing comercial evitando que el canal falle en silencio.',
        avoid:
          'No aumentes volumen si el monitor ya esta advirtiendo fallos o retries bloqueados.',
        successSignal:
          'Las alertas bajan, los retries se ordenan y el canal vuelve a estado saludable o controlado.',
        whenToUse: 'Cuando el canal muestra alertas, fallos o retries listos.',
        steps: [
          'Actualiza la salud del canal antes de empujar más volumen.',
          'Revisa alertas y retries dominantes.',
          'Retoma campañas cuando el canal vuelva a estar estable.',
        ],
      });
    }

    if (growthAssistSignals.waitingCustomerCount > 0) {
      playbooks.push({
        key: 'waiting-customer',
        title: 'Vigilar respuestas pendientes',
        detail:
          'No todo requiere accionar hoy; tambien conviene tener a mano lo que ya esta esperando cliente para retomar en el momento justo.',
        goal:
          'Mantener presencia comercial sin sobre-insistir cuando el siguiente turno depende del cliente.',
        avoid:
          'No empujes demasiado pronto ni dejes que el caso desaparezca del radar por completo.',
        successSignal:
          'El caso sigue visible con fecha clara de retoma y contexto suficiente para volver sin friccion.',
        whenToUse: 'Cuando hay seguimientos que dependen del cliente y no del equipo.',
        steps: [
          'Mantén visibles los casos esperando cliente.',
          'Define cuándo conviene retomar si no responden.',
          'Evita sobre-escribir cuando todavía están dentro del tiempo esperado.',
        ],
      });
    }

    if (playbooks.length === 0) {
      playbooks.push({
        key: 'healthy-routine',
        title: 'Mantener ritmo comercial',
        detail:
          'Sin urgencias visibles, Growth ya funciona como agenda simple: revisa leads nuevos, confirma seguimientos de hoy y deja claro el siguiente paso de cada conversacion.',
        goal:
          'Sostener consistencia comercial antes de que aparezcan urgencias de verdad.',
        avoid:
          'No confundas calma con abandono; una agenda sin urgencias igual necesita ritmo y siguiente paso claro.',
        successSignal:
          'Las conversaciones activas mantienen movimiento y las nuevas no se enfrían por falta de rutina.',
        whenToUse: 'Cuando no hay urgencias fuertes y el canal está sano.',
        steps: [
          'Revisa leads nuevos y conversaciones tibias.',
          'Deja siguiente paso claro en cada hilo activo.',
          'Usa la agenda como radar para que nada se enfríe.',
        ],
      });
    }

    return playbooks.slice(0, 4);
  }, [growthAssistSignals, growthOperationalCaseAutoAssignmentSettings]);
  const growthAssistConversationCues = useMemo(() => {
    if (!growthWorkbench) {
      return [];
    }

    return growthWorkbench.threads
      .filter(
        (thread) =>
          thread.nextActionOwner === 'team' &&
          (thread.firstResponseStatus === 'overdue' ||
            thread.followUpStatus === 'overdue' ||
            thread.priority === 'critical' ||
            thread.priority === 'high'),
      )
      .map((thread) => {
        const warmth: GrowthAssistConversationCue['warmth'] =
          thread.firstResponseStatus === 'overdue' || thread.priority === 'critical'
            ? 'hot'
            : thread.followUpStatus === 'overdue' || thread.priority === 'high'
              ? 'warm'
              : 'watch';

        const suggestedReply =
          thread.firstResponseStatus === 'overdue'
            ? `Hola ${thread.subject}, gracias por escribirnos. Quiero retomar esto hoy mismo y dejarte el siguiente paso claro.`
            : thread.followUpStatus === 'overdue'
              ? `Hola ${thread.subject}, retomo esta conversacion para no dejarla enfriar. Si te parece, hoy cerramos el siguiente paso.`
              : `Hola ${thread.subject}, te escribo para mantener el avance y confirmar si seguimos con el siguiente paso.`;

        const nextMove =
          thread.assigneeUserId === null
            ? 'Primero deja owner claro y luego responde.'
            : thread.firstResponseStatus === 'overdue'
              ? 'Responde hoy y deja siguiente accion acordada.'
              : 'Haz follow-up y deja la fecha del siguiente toque.';

        return {
          key: thread.threadId,
          warmth,
          title: thread.subject,
          summary: `${channelLabel(thread.channel)} · ultima actividad hace ${formatRelativeHours(
            thread.hoursSinceLastActivity,
          )} · ${thread.latestMessagePreview ?? 'Sin preview reciente.'}`,
          suggestedReply,
          nextMove,
        } satisfies GrowthAssistConversationCue;
      })
      .slice(0, 4);
  }, [growthWorkbench]);
  const growthAssistReplySuggestions = useMemo(() => {
    if (!growthWorkbench) {
      return [];
    }

    return growthWorkbench.threads
      .filter(
        (thread) =>
          thread.nextActionOwner === 'team' &&
          (thread.firstResponseStatus === 'overdue' ||
            thread.followUpStatus === 'overdue' ||
            thread.priority === 'critical' ||
            thread.priority === 'high'),
      )
      .map((thread) => {
        const warmth: GrowthAssistReplySuggestion['warmth'] =
          thread.firstResponseStatus === 'overdue' || thread.priority === 'critical'
            ? 'hot'
            : thread.followUpStatus === 'overdue' || thread.priority === 'high'
              ? 'warm'
              : 'watch';

        return {
          key: `reply-suggestion:${thread.threadId}`,
          warmth,
          title: thread.subject,
          reason:
            thread.firstResponseStatus === 'overdue'
              ? `La conversacion sigue sin primera respuesta despues de ${formatRelativeHours(
                  thread.hoursSinceLastInbound ?? thread.hoursSinceOpened,
                )}.`
              : thread.followUpStatus === 'overdue'
                ? `El follow-up ya se paso y el hilo lleva ${formatRelativeHours(
                    thread.hoursSinceLastActivity,
                  )} sin movimiento.`
                : 'La conversacion sigue con prioridad alta y conviene mantener el ritmo hoy.',
          goal:
            thread.firstResponseStatus === 'overdue'
              ? 'Retomar confianza y dejar un siguiente paso concreto.'
              : thread.followUpStatus === 'overdue'
                ? 'Reactivar el hilo sin sonar invasivo.'
                : 'Confirmar interés real y dejar acordado el próximo movimiento.',
          suggestedReply:
            thread.firstResponseStatus === 'overdue'
              ? `Hola ${thread.subject}, gracias por escribirnos. Retomo esto hoy para ayudarte sin dejarlo enfriar. Si te parece, te comparto el siguiente paso y lo dejamos encaminado ahora mismo.`
              : thread.followUpStatus === 'overdue'
                ? `Hola ${thread.subject}, retomo esta conversacion para no dejarla enfriar. Quiero confirmar si seguimos con el siguiente paso y ayudarte a cerrarlo hoy de la forma mas simple posible.`
                : `Hola ${thread.subject}, te escribo para retomar el avance y confirmar si seguimos con el siguiente paso. Si te sirve, hoy mismo lo dejamos encaminado.`,
          followUpPrompt:
            thread.firstResponseStatus === 'overdue'
              ? 'Pregunta si prefiere demo, cotizacion o una respuesta puntual para destrabar la conversacion.'
              : 'Pregunta si le hace sentido seguir hoy o que dia conviene retomar.',
          checklist: [
            thread.assigneeUserId === null
              ? 'Deja un owner claro antes de cerrar el siguiente paso.'
              : 'Mantén el seguimiento desde el owner actual para conservar contexto.',
            thread.firstResponseStatus === 'overdue'
              ? 'Agradece el contacto y reconoce la espera si aplica.'
              : 'Retoma el contexto en una frase corta.',
            'Propón un siguiente paso concreto, no una pregunta abierta genérica.',
            'Cierra con una pregunta simple que facilite responder rápido.',
          ],
        } satisfies GrowthAssistReplySuggestion;
      })
      .slice(0, 4);
  }, [growthWorkbench]);
  const growthAssistNextActions = useMemo(() => {
    const fromTasks = growthAssistTasks.slice(0, 3).map((task) => ({
      key: `next-action:${task.key}`,
      emphasis:
        task.urgency === 'today'
          ? 'do_now'
          : task.category === 'channel_risk'
            ? 'stabilize'
            : 'today',
      actionType: task.category,
      title: task.title,
      whyNow: task.summary,
      recommendedAction:
        task.category === 'reply_now'
          ? 'Responder hoy mismo y cerrar con un siguiente paso concreto.'
          : task.category === 'follow_up'
            ? 'Retomar el hilo con contexto corto y acordar fecha o siguiente movimiento.'
            : task.category === 'assign_owner'
              ? 'Dejar owner claro antes de que el caso pierda contexto o prioridad.'
              : 'Mirar monitor, alertas y retries antes de empujar mas trafico.',
      businessImpact:
        task.category === 'reply_now'
          ? 'Responder tarde enfria conversaciones que ya llegaron con intencion activa.'
          : task.category === 'follow_up'
            ? 'Un follow-up a tiempo mantiene movimiento sin obligarte a reabrir contexto mas tarde.'
            : task.category === 'assign_owner'
              ? 'Sin owner claro, el trabajo parece existir pero nadie lo termina de mover.'
              : 'Un canal inestable puede romper entregas y arruinar timing comercial aunque el equipo responda bien.',
    }) satisfies GrowthAssistNextAction);

    if (fromTasks.length === 0 && growthAssistSummary) {
      return [
        {
          key: 'next-action:healthy-routine',
          emphasis: 'today',
          actionType: 'follow_up',
          title: 'Mantener ritmo comercial sin sobre-operar',
          whyNow: growthAssistSummary.detail,
          recommendedAction:
            'Revisa leads tibios, confirma proximo paso en conversaciones activas y evita abrir complejidad nueva si no hace falta.',
          businessImpact:
            'La constancia suele mover mas negocio que reaccionar tarde solo cuando algo ya esta vencido.',
        } satisfies GrowthAssistNextAction,
      ];
    }

    return fromTasks;
  }, [growthAssistSummary, growthAssistTasks]);
  const growthAssistLeadWarmthSummary = useMemo(() => {
    const counts = growthAssistConversationCues.reduce(
      (summary, cue) => {
        summary[cue.warmth] += 1;
        return summary;
      },
      { hot: 0, warm: 0, watch: 0 },
    );

    return counts;
  }, [growthAssistConversationCues]);
  const growthAssistLeadWarmthHints = useMemo(() => {
    return growthAssistConversationCues.map((cue) => ({
      key: `warmth:${cue.key}`,
      warmth: cue.warmth,
      title: cue.title,
      signalSummary: cue.summary,
      whyWarmth:
        cue.warmth === 'hot'
          ? 'Se ve caliente porque ya pide movimiento del equipo y puede enfriarse rapido.'
          : cue.warmth === 'warm'
            ? 'Sigue con movimiento real y conviene sostener el ritmo.'
            : 'No es urgente todavia, pero vale la pena mantenerla en radar.',
      recommendedCadence:
        cue.warmth === 'hot'
          ? 'Muévelo hoy mismo.'
          : cue.warmth === 'warm'
            ? 'Revísalo hoy o deja siguiente toque claro.'
            : 'Déjalo visible y retómalo en el momento acordado.',
      riskNote:
        cue.warmth === 'hot'
          ? 'Si se demora, puedes perder la intención más fuerte.'
          : cue.warmth === 'warm'
            ? 'Si nadie lo toca, puede pasar de interés activo a conversación tibia.'
            : 'Si desaparece del radar, luego cuesta más reabrirlo con contexto.',
    }) satisfies GrowthAssistLeadWarmthHint);
  }, [growthAssistConversationCues]);
  const effectiveGrowthAssistSummary =
    growthAssistAgenda?.summary ?? growthAssistSummary;
  const effectiveGrowthAssistLeadWarmthSummary = growthAssistAgenda
    ? growthAssistAgenda.leadWarmthSummary
    : {
        hotCount: growthAssistLeadWarmthSummary.hot,
        warmCount: growthAssistLeadWarmthSummary.warm,
        watchCount: growthAssistLeadWarmthSummary.watch,
        dominantWarmth:
          growthAssistLeadWarmthSummary.hot > 0
            ? ('hot' as const)
            : growthAssistLeadWarmthSummary.warm > 0
              ? ('warm' as const)
              : growthAssistLeadWarmthSummary.watch > 0
                ? ('watch' as const)
                : ('none' as const),
        recommendedFocus:
          growthAssistLeadWarmthSummary.hot > 0
            ? 'Prioriza respuestas o seguimientos que ya estan pidiendo movimiento hoy.'
            : growthAssistLeadWarmthSummary.warm > 0
              ? 'Mantén el ritmo de conversaciones que siguen vivas antes de que se enfrien.'
              : growthAssistLeadWarmthSummary.watch > 0
                ? 'Usa el radar para no perder timing en conversaciones que todavia no son urgentes.'
                : 'Todavia no hay señales fuertes; puedes usar Growth como una agenda comercial tranquila.',
      };
  const effectiveGrowthAssistTasks =
    growthAssistAgenda?.tasks ?? growthAssistTasks;
  const effectiveGrowthAssistConversationCues =
    growthAssistAgenda?.conversationCues ?? growthAssistConversationCues;
  const effectiveGrowthAssistReplySuggestions =
    growthAssistAgenda?.replySuggestions ?? growthAssistReplySuggestions;
  const effectiveGrowthAssistNextActions =
    growthAssistAgenda?.nextActions ?? growthAssistNextActions;
  const effectiveGrowthAssistLeadWarmthHints =
    growthAssistAgenda?.leadWarmthHints ?? growthAssistLeadWarmthHints;
  const effectiveGrowthAssistPlaybooks =
    growthAssistAgenda?.playbooks ?? growthAssistPlaybooks;
  const effectiveGrowthAssistWaitingCustomers =
    growthAssistAgenda?.waitingCustomerQueue ?? growthAssistWaitingCustomers;
  const effectiveGrowthAssistWaitingCustomerCards = useMemo(
    () =>
      effectiveGrowthAssistWaitingCustomers.map((entry) => ({
        id: 'caseId' in entry ? entry.caseId : entry.id,
        title: entry.title,
        summary: entry.summary,
        nextAction: entry.nextAction,
        assignedUserEmail: entry.assignedUserEmail,
        dueAt: entry.dueAt,
        followUpState:
          'followUpState' in entry ? entry.followUpState : ('waiting_customer' as const),
      })),
    [effectiveGrowthAssistWaitingCustomers],
  );
  const effectiveGrowthAssistChannelHealth = growthAssistAgenda?.channelHealth ?? null;
  const aiAgentCatalogByKey = useMemo(() => {
    const entries = [
      ...aiAgentCatalog,
      growthAssistAiEnvelope?.agent,
      invoiceAssistantAiEnvelope?.agent,
    ].filter((entry): entry is AiAgentCatalogResponse => entry !== null && entry !== undefined);

    return new Map(entries.map((entry) => [entry.key, entry] as const));
  }, [aiAgentCatalog, growthAssistAiEnvelope, invoiceAssistantAiEnvelope]);
  const activeGrowthAiAgent = useMemo(
    () =>
      growthAssistAiEnvelope?.agent ??
      aiAgentCatalog.find((entry) => entry.key === 'growth-assist-coach') ??
      null,
    [aiAgentCatalog, growthAssistAiEnvelope],
  );
  const plannedAiAgents = useMemo(
    () => aiAgentCatalog.filter((entry) => entry.key !== 'growth-assist-coach'),
    [aiAgentCatalog],
  );
  const activeGrowthAiPromptPack = useMemo(
    () =>
      growthAssistAiEnvelope?.promptPack ??
      aiPromptRegistry.find((entry) => entry.agentKey === 'growth-assist-coach') ??
      null,
    [aiPromptRegistry, growthAssistAiEnvelope],
  );
  const activeGrowthAiToolAccess = useMemo(
    () =>
      growthAssistAiEnvelope?.toolAccess ??
      growthAssistAiToolAccess,
    [growthAssistAiEnvelope, growthAssistAiToolAccess],
  );
  const activeGrowthAiApprovalPolicies = useMemo(
    () =>
      growthAssistAiApprovalPolicies.length > 0
        ? growthAssistAiApprovalPolicies
        : aiApprovalPolicyRegistry.filter(
            (entry) => entry.agentKey === 'growth-assist-coach',
          ),
    [aiApprovalPolicyRegistry, growthAssistAiApprovalPolicies],
  );
  const activeInvoiceAiAgent = useMemo(
    () => invoiceAssistantAiEnvelope?.agent ?? null,
    [invoiceAssistantAiEnvelope],
  );
  const activeInvoiceAiToolAccess = useMemo(
    () =>
      invoiceAssistantAiEnvelope?.toolAccess ??
      invoiceAssistantAiToolAccess,
    [invoiceAssistantAiEnvelope, invoiceAssistantAiToolAccess],
  );
  const visibleTenantAiSuggestionWorkspace = useMemo(() => {
    return tenantAiSuggestionWorkspace.filter((entry) =>
      tenantAiSuggestionWorkspaceAgentFilter === 'all'
        ? true
        : entry.agentKey === tenantAiSuggestionWorkspaceAgentFilter,
    );
  }, [tenantAiSuggestionWorkspace, tenantAiSuggestionWorkspaceAgentFilter]);
  const tenantAiSuggestionWorkspaceAgentOptions = useMemo(() => {
    const options = [
      {
        key: 'all' as const,
        label: 'Todas',
        count: tenantAiHandoffWorkspaceSummary?.counts.totalSuggestionRuns ?? 0,
        visible:
          (tenantAiHandoffWorkspaceSummary?.counts.totalSuggestionRuns ?? 0) > 0 ||
          canReadGrowthConversations ||
          canReadInvoicingReports,
      },
      {
        key: 'growth-assist-coach' as const,
        label: 'Growth',
        count:
          tenantAiHandoffWorkspaceSummary?.agentBreakdown.find(
            (entry) => entry.agentKey === 'growth-assist-coach',
          )?.totalSuggestionRuns ?? 0,
        visible: canReadGrowthConversations,
      },
      {
        key: 'invoice-document-assistant' as const,
        label: 'Invoice',
        count:
          tenantAiHandoffWorkspaceSummary?.agentBreakdown.find(
            (entry) => entry.agentKey === 'invoice-document-assistant',
          )?.totalSuggestionRuns ?? 0,
        visible: canReadInvoicingReports,
      },
    ];

    return options.filter((entry) => entry.visible);
  }, [
    canReadGrowthConversations,
    canReadInvoicingReports,
    tenantAiHandoffWorkspaceSummary,
  ]);
  const tenantAiApprovalWorkspaceStatusOptions = useMemo(() => {
    return [
      {
        key: 'all' as const,
        label: 'Todas',
        count:
          tenantAiApprovalWorkspaceSummary?.counts.totalApprovalRequests ?? 0,
      },
      {
        key: 'pending' as const,
        label: 'Pending',
        count:
          tenantAiApprovalWorkspaceSummary?.counts.pendingApprovalRequests ?? 0,
      },
      {
        key: 'approved' as const,
        label: 'Approved',
        count:
          tenantAiApprovalWorkspaceSummary?.counts.approvedApprovalRequests ?? 0,
      },
      {
        key: 'rejected' as const,
        label: 'Rejected',
        count:
          tenantAiApprovalWorkspaceSummary?.counts.rejectedApprovalRequests ?? 0,
      },
    ];
  }, [tenantAiApprovalWorkspaceSummary]);
  const featuredTenantAiPendingApproval =
    tenantAiOperationsSummary?.actionCenter.featuredPendingApprovalRequest ?? null;
  const featuredTenantAiReviewableSuggestionRun =
    tenantAiOperationsSummary?.actionCenter.featuredReviewableSuggestionRun ?? null;
  const latestTenantAiReviewedApproval =
    tenantAiOperationsSummary?.actionCenter.latestReviewedApprovalRequest ?? null;
  const oldestTenantAiPendingWorkspaceApproval =
    tenantAiApprovalWorkspaceSummary?.oldestPendingApprovalRequest ?? null;
  const latestTenantAiReviewedWorkspaceApproval =
    tenantAiApprovalWorkspaceSummary?.latestReviewedApprovalRequest ?? null;
  const tenantAiActivityFeedFilterOptions = useMemo(() => {
    return [
      {
        key: 'all' as const,
        label: 'Todas',
      },
      {
        key: 'suggestion_run_prepared' as const,
        label: 'Handoffs',
      },
      {
        key: 'approval_requested' as const,
        label: 'Approval requested',
      },
      {
        key: 'approval_reviewed' as const,
        label: 'Approval reviewed',
      },
    ];
  }, []);

  async function copyGrowthAssistReplySuggestion(
    key: string,
    suggestedReply: string,
    followUpPrompt: string,
  ) {
    const nextText = `${suggestedReply}\n\n${followUpPrompt}`;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(nextText);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = nextText;
        textArea.setAttribute('readonly', 'true');
        textArea.style.position = 'absolute';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setCopiedGrowthAssistReplyKey(key);
      window.setTimeout(() => {
        setCopiedGrowthAssistReplyKey((current) => (current === key ? null : current));
      }, 1800);
    } catch (error) {
      setGrowthActionMessage(
        error instanceof Error
          ? error.message
          : 'No se pudo copiar la sugerencia de reply.',
      );
    }
  }
  const workbenchEmptyMessage = useMemo(() => {
    if (!growthWorkbench) {
      return 'Cuando termine la carga veremos el resumen SLA del workbench.';
    }

    if (growthWorkbench.summary.openThreadCount === 0) {
      return 'No hay conversaciones abiertas para la politica actual del tenant.';
    }

    if (growthFiltersCustomized) {
      return 'Hay conversaciones en el tenant, pero los filtros actuales no dejaron threads visibles. Prueba reseteando la policy o quitando el assignee.';
    }

    return 'No hay threads visibles para el filtro actual.';
  }, [growthFiltersCustomized, growthWorkbench]);
  const latestMonitorExecutions = useMemo(
    () => whatsappMonitorSummary?.retryRunnerSummary?.executions.slice(0, 3) ?? [],
    [whatsappMonitorSummary],
  );
  const selectedGrowthAlert = useMemo(() => {
    if (!whatsappSummary || growthDrilldownTarget?.kind !== 'alert') {
      return null;
    }

    return (
      whatsappSummary.operationalAlerts.find(
        (alert) => alert.key === growthDrilldownTarget.key,
      ) ?? null
    );
  }, [growthDrilldownTarget, whatsappSummary]);
  const selectedGrowthTaxonomy = useMemo(() => {
    if (!whatsappSummary || growthDrilldownTarget?.kind !== 'taxonomy') {
      return null;
    }

    return (
      whatsappSummary.byProviderTaxonomy.find(
        (entry) =>
          `${entry.provider}-${entry.providerTaxonomyFamily}-${entry.providerTaxonomyDetail}` ===
          growthDrilldownTarget.key,
      ) ?? null
    );
  }, [growthDrilldownTarget, whatsappSummary]);
  const selectedGrowthErrorCode = useMemo(() => {
    if (!whatsappSummary || growthDrilldownTarget?.kind !== 'error') {
      return null;
    }

    return (
      whatsappSummary.topProviderErrorCodes.find(
        (entry) =>
          `${entry.provider}-${entry.providerErrorCode}-${entry.providerTaxonomyDetail}` ===
          growthDrilldownTarget.key,
      ) ?? null
    );
  }, [growthDrilldownTarget, whatsappSummary]);
  const selectedGrowthThread = useMemo(() => {
    if (!growthWorkbench || growthDrilldownTarget?.kind !== 'thread') {
      return null;
    }

    return (
      growthWorkbench.threads.find(
        (thread) => thread.threadId === growthDrilldownTarget.key,
      ) ?? null
    );
  }, [growthDrilldownTarget, growthWorkbench]);
  const selectedGrowthHistoryEntry = useMemo(() => {
    if (growthDrilldownTarget?.kind !== 'history') {
      return null;
    }

    return (
      visibleAlertHistory.find(
        (entry) => entry.id === growthDrilldownTarget.key,
      ) ?? null
    );
  }, [growthDrilldownTarget, visibleAlertHistory]);

  async function refreshGrowthFleet() {
    if (!token || growthAccessibleTenancies.length === 0) {
      setGrowthFleetSnapshots([]);
      setGrowthFleetError(null);
      return;
    }

    setGrowthFleetLoading(true);
    setGrowthFleetError(null);

    try {
      const snapshotResults = await Promise.allSettled(
        growthAccessibleTenancies.map(async (tenancy) => {
          const tenantSlug = tenancy.tenant.slug;
          const [workbench, summary, analytics, acknowledgements, monitorRuns, cases] =
            await Promise.all([
              fetchGrowthConversationWorkbench(token, tenantSlug, {
                channel: 'whatsapp',
                firstResponseSlaHours: 2,
                followUpSlaHours: 6,
                staleThreadHours: 24,
              }),
              fetchWhatsappOutboundReportingSummary(token, tenantSlug),
              fetchWhatsappOperationalMonitorAnalytics(token, tenantSlug),
              fetchWhatsappOperationalAlertAcknowledgements(token, tenantSlug),
              fetchWhatsappOperationalMonitorRuns(token, tenantSlug, 1),
              fetchGrowthOperationalCases(token, tenantSlug, 'open'),
            ]);

          return {
            tenancy,
            workbench,
            summary,
            analytics,
            acknowledgements,
            cases,
            latestRun: monitorRuns[0] ?? null,
          } satisfies GrowthFleetTenantSnapshot;
        }),
      );

      const nextSnapshots: GrowthFleetTenantSnapshot[] = [];
      const failedTenantSlugs: string[] = [];

      snapshotResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          nextSnapshots.push(result.value);
        } else {
          failedTenantSlugs.push(growthAccessibleTenancies[index].tenant.slug);
        }
      });

      nextSnapshots.sort((left, right) => {
        return (
          operationalStatusWeight(
            right.summary.operationalDashboard.overallStatus,
          ) -
            operationalStatusWeight(
              left.summary.operationalDashboard.overallStatus,
            ) ||
          right.summary.operationalAlerts.length -
            left.summary.operationalAlerts.length ||
          right.summary.retryOperations.readyNowCount -
            left.summary.retryOperations.readyNowCount ||
          left.tenancy.tenant.name.localeCompare(right.tenancy.tenant.name)
        );
      });

      startTransition(() => {
        setGrowthFleetSnapshots(nextSnapshots);
      });

      if (failedTenantSlugs.length > 0) {
        setGrowthFleetError(
          `No se pudo hidratar la vista fleet para ${failedTenantSlugs.join(', ')}.`,
        );
      } else {
        setGrowthFleetError(null);
      }
    } catch (error) {
      setGrowthFleetSnapshots([]);
      setGrowthFleetError(
        error instanceof Error
          ? error.message
          : 'No se pudo cargar la consola fleet de Growth.',
      );
    } finally {
      setGrowthFleetLoading(false);
    }
  }

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
    if (selectedGrowthAlert) {
      return;
    }

    if (leadingOperationalAlerts[0]) {
      setGrowthDrilldownTarget({
        kind: 'alert',
        key: leadingOperationalAlerts[0].key,
      });
    }
  }, [leadingOperationalAlerts, selectedGrowthAlert]);

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
      setElectronicSignatureMaterialInspection(null);
      setElectronicSubmissionSettings(null);
      setElectronicSignatureSettings(null);
      setIssuerProfile(null);
      setInvoiceNumberingSettings(null);
      setInvoicingReport(null);
      setInvoiceDocumentDraftingAssist(null);
      setInvoiceAssistantAiEnvelope(null);
      setInvoiceAssistantAiToolAccess([]);
      setInvoiceAssistantAiApprovalPolicies([]);
      setInvoiceAssistantAiApprovalRequests([]);
      setInvoiceAssistantAiSuggestionRuns([]);
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
          nextDraftingAssist,
          nextAiApprovalPolicies,
          nextAiApprovalRequests,
          nextAiToolAccess,
          nextAiSuggestionEnvelope,
          nextAiSuggestionRuns,
        ] =
          await Promise.all([
          listCustomers(token, tenantSlug),
          listTaxRates(token, tenantSlug),
          listInvoices(token, tenantSlug),
          fetchInvoicingReportSummary(token, tenantSlug),
          loadOptionalInvoicingSettings(token, tenantSlug),
          fetchInvoiceDocumentDraftingAssist(token, tenantSlug).catch(() => null),
          fetchAiAgentApprovalPolicies(
            token,
            'invoice-document-assistant',
          ).catch(() => []),
          fetchTenantAiApprovalRequests(
            token,
            tenantSlug,
            'invoice-document-assistant',
            {
              status: invoiceAiApprovalStatusFilter,
            },
          ).catch(() => []),
          fetchAiAgentToolAccess(
            token,
            'invoice-document-assistant',
          ).catch(() => []),
          fetchTenantAiSuggestionEnvelope(
            token,
            tenantSlug,
            'invoice-document-assistant',
          ).catch(() => null),
          fetchTenantAiSuggestionRuns(
            token,
            tenantSlug,
            'invoice-document-assistant',
          ).catch(() => []),
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
          setElectronicSignatureMaterialInspection(
            nextSettings.electronicSignatureMaterialInspection,
          );
          setElectronicSubmissionSettings(
            nextSettings.electronicSubmissionSettings,
          );
          setElectronicSignatureSettings(nextSettings.electronicSignatureSettings);
          setIssuerProfile(nextSettings.issuerProfile);
          setInvoiceNumberingSettings(nextSettings.invoiceNumberingSettings);
          setInvoicingReport(nextReport);
          setInvoiceDocumentDraftingAssist(nextDraftingAssist);
          setInvoiceAssistantAiApprovalPolicies(nextAiApprovalPolicies);
          setInvoiceAssistantAiApprovalRequests(nextAiApprovalRequests);
          setInvoiceAssistantAiToolAccess(nextAiToolAccess);
          setInvoiceAssistantAiEnvelope(nextAiSuggestionEnvelope);
          setInvoiceAssistantAiSuggestionRuns(nextAiSuggestionRuns);
          setSelectedInvoiceAiSuggestionRunDetail(null);
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
        setElectronicSignatureMaterialInspection(null);
        setElectronicSignatureSettings(null);
        setIssuerProfile(null);
        setInvoiceNumberingSettings(null);
        setInvoicingReport(null);
        setInvoiceDocumentDraftingAssist(null);
        setInvoiceAssistantAiEnvelope(null);
        setInvoiceAssistantAiToolAccess([]);
        setInvoiceAssistantAiApprovalPolicies([]);
        setInvoiceAssistantAiApprovalRequests([]);
        setInvoiceAssistantAiSuggestionRuns([]);
        setSelectedInvoiceAiSuggestionRunDetail(null);
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
    if (!token || !currentTenancy || !invoicingEnabled) {
      setInvoiceAssistantAiApprovalRequests([]);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    let cancelled = false;

    async function loadInvoiceApprovalQueue() {
      try {
        const approvalRequests = await fetchTenantAiApprovalRequests(
          token,
          tenantSlug,
          'invoice-document-assistant',
          {
            status: invoiceAiApprovalStatusFilter,
          },
        );

        if (cancelled) {
          return;
        }

        startTransition(() => {
          setInvoiceAssistantAiApprovalRequests(approvalRequests);
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        setInvoicingError(
          error instanceof Error
            ? error.message
            : 'No se pudo cargar la cola de aprobaciones de invoicing.',
        );
      }
    }

    void loadInvoiceApprovalQueue();

    return () => {
      cancelled = true;
    };
  }, [currentTenancy, invoiceAiApprovalStatusFilter, invoicingEnabled, token]);

  useEffect(() => {
    if (!token || growthAccessibleTenancies.length === 0) {
      setGrowthFleetSnapshots([]);
      setGrowthFleetError(null);
      setSelectedGrowthFleetTenantSlug(null);
      setGrowthFleetLoading(false);
      return;
    }

    let cancelled = false;

    async function loadGrowthFleet() {
      setGrowthFleetLoading(true);
      setGrowthFleetError(null);

      try {
        const snapshotResults = await Promise.allSettled(
          growthAccessibleTenancies.map(async (tenancy) => {
            const tenantSlug = tenancy.tenant.slug;
            const [workbench, summary, analytics, acknowledgements, monitorRuns, cases] =
              await Promise.all([
                fetchGrowthConversationWorkbench(token, tenantSlug, {
                  channel: 'whatsapp',
                  firstResponseSlaHours: 2,
                  followUpSlaHours: 6,
                  staleThreadHours: 24,
                }),
                fetchWhatsappOutboundReportingSummary(token, tenantSlug),
                fetchWhatsappOperationalMonitorAnalytics(token, tenantSlug),
                fetchWhatsappOperationalAlertAcknowledgements(token, tenantSlug),
                fetchWhatsappOperationalMonitorRuns(token, tenantSlug, 1),
                fetchGrowthOperationalCases(token, tenantSlug, 'open'),
              ]);

            return {
              tenancy,
              workbench,
              summary,
              analytics,
              acknowledgements,
              cases,
              latestRun: monitorRuns[0] ?? null,
            } satisfies GrowthFleetTenantSnapshot;
          }),
        );

        if (cancelled) {
          return;
        }

        const nextSnapshots: GrowthFleetTenantSnapshot[] = [];
        const failedTenantSlugs: string[] = [];

        snapshotResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            nextSnapshots.push(result.value);
          } else {
            failedTenantSlugs.push(growthAccessibleTenancies[index].tenant.slug);
          }
        });

        nextSnapshots.sort((left, right) => {
          return (
            operationalStatusWeight(
              right.summary.operationalDashboard.overallStatus,
            ) -
              operationalStatusWeight(
                left.summary.operationalDashboard.overallStatus,
              ) ||
            right.summary.operationalAlerts.length -
              left.summary.operationalAlerts.length ||
            right.summary.retryOperations.readyNowCount -
              left.summary.retryOperations.readyNowCount ||
            left.tenancy.tenant.name.localeCompare(right.tenancy.tenant.name)
          );
        });

        startTransition(() => {
          setGrowthFleetSnapshots(nextSnapshots);
        });

        if (failedTenantSlugs.length > 0) {
          setGrowthFleetError(
            `No se pudo hidratar la vista fleet para ${failedTenantSlugs.join(', ')}.`,
          );
        } else {
          setGrowthFleetError(null);
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        setGrowthFleetSnapshots([]);
        setGrowthFleetError(
          error instanceof Error
            ? error.message
            : 'No se pudo cargar la consola fleet de Growth.',
        );
      } finally {
        if (!cancelled) {
          setGrowthFleetLoading(false);
        }
      }
    }

    void loadGrowthFleet();

    return () => {
      cancelled = true;
    };
  }, [growthAccessibleTenancies, token]);

  useEffect(() => {
    if (
      !token ||
      !currentTenancy ||
      !growthWorkspaceAvailable
    ) {
      setGrowthWorkbench(null);
      setGrowthAssistAgenda(null);
      setAiAgentCatalog([]);
      setAiPromptRegistry([]);
      setAiApprovalPolicyRegistry([]);
      setAiToolRegistry([]);
      setGrowthAssistAiApprovalPolicies([]);
      setGrowthAssistAiApprovalRequests([]);
      setGrowthAssistAiToolAccess([]);
      setGrowthAssistAiEnvelope(null);
      setWhatsappSummary(null);
      setWhatsappMonitorSummary(null);
      setWhatsappMonitorAnalytics(null);
      setGrowthAlertAcknowledgements([]);
      setGrowthOperationalCases([]);
      setGrowthOperationalCaseAutoAssignmentSettings(null);
      setGrowthOperationalCaseAutoAssignmentPolicy('balanced');
      setGrowthMonitorHistory([]);
      setGrowthError(null);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    let cancelled = false;

    async function loadGrowthWorkspace() {
      setGrowthLoading(true);
      setGrowthError(null);

      try {
        const [
          nextWorkbench,
          nextAssistAgenda,
          nextSummary,
          nextMonitorRuns,
          nextMonitorAnalytics,
          nextAcknowledgements,
          nextOperationalCases,
          nextAutoAssignmentSettings,
          nextAiApprovalPolicyRegistry,
          nextAiAgentCatalog,
          nextAiPromptRegistry,
          nextAiToolRegistry,
          nextAiApprovalPolicies,
          nextAiApprovalRequests,
          nextAiToolAccess,
          nextAiSuggestionEnvelope,
          nextAiSuggestionRuns,
        ] =
        await Promise.all([
          fetchGrowthConversationWorkbench(token, tenantSlug, {
            assigneeUserId: growthAssigneeFilter.trim() || null,
            channel:
              growthChannelFilter === 'all' ? null : growthChannelFilter,
            firstResponseSlaHours: Number(firstResponseSlaHours) || null,
            followUpSlaHours: Number(followUpSlaHours) || null,
            staleThreadHours: Number(staleThreadHours) || null,
          }),
          fetchGrowthAssistDailyAgenda(token, tenantSlug),
          fetchWhatsappOutboundReportingSummary(token, tenantSlug),
          fetchWhatsappOperationalMonitorRuns(token, tenantSlug),
          fetchWhatsappOperationalMonitorAnalytics(token, tenantSlug),
          fetchWhatsappOperationalAlertAcknowledgements(token, tenantSlug),
          fetchGrowthOperationalCases(token, tenantSlug),
          fetchGrowthOperationalCaseAutoAssignmentSettings(token, tenantSlug),
          fetchAiApprovalPolicies(token).catch(() => []),
          fetchAiAgentCatalog(token).catch(() => []),
          fetchAiPromptRegistry(token).catch(() => []),
          fetchAiToolRegistry(token).catch(() => []),
          fetchAiAgentApprovalPolicies(token, 'growth-assist-coach').catch(
            () => [],
          ),
          fetchTenantAiApprovalRequests(
            token,
            tenantSlug,
            'growth-assist-coach',
            {
              status: growthAiApprovalStatusFilter,
            },
          ).catch(() => []),
          fetchAiAgentToolAccess(token, 'growth-assist-coach').catch(() => []),
          fetchTenantAiSuggestionEnvelope(
            token,
            tenantSlug,
            'growth-assist-coach',
          ).catch(() => null),
          fetchTenantAiSuggestionRuns(
            token,
            tenantSlug,
            'growth-assist-coach',
          ).catch(() => []),
        ]);

        if (cancelled) {
          return;
        }

        startTransition(() => {
          setGrowthWorkbench(nextWorkbench);
          setGrowthAssistAgenda(nextAssistAgenda);
          setAiApprovalPolicyRegistry(nextAiApprovalPolicyRegistry);
          setAiAgentCatalog(nextAiAgentCatalog);
          setAiPromptRegistry(nextAiPromptRegistry);
          setAiToolRegistry(nextAiToolRegistry);
          setGrowthAssistAiApprovalPolicies(nextAiApprovalPolicies);
          setGrowthAssistAiApprovalRequests(nextAiApprovalRequests);
          setGrowthAssistAiToolAccess(nextAiToolAccess);
          setGrowthAssistAiEnvelope(nextAiSuggestionEnvelope);
          setGrowthAssistAiSuggestionRuns(nextAiSuggestionRuns);
          setSelectedGrowthAiSuggestionRunDetail(null);
          setWhatsappSummary(nextSummary);
          setGrowthMonitorHistory(nextMonitorRuns);
          setWhatsappMonitorAnalytics(nextMonitorAnalytics);
          setGrowthAlertAcknowledgements(nextAcknowledgements);
          setGrowthOperationalCases(nextOperationalCases);
          setGrowthOperationalCaseAutoAssignmentSettings(
            nextAutoAssignmentSettings,
          );
          setGrowthOperationalCaseAutoAssignmentPolicy(
            nextAutoAssignmentSettings.defaultPolicyKey,
          );
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        setGrowthWorkbench(null);
        setGrowthAssistAgenda(null);
        setAiAgentCatalog([]);
        setAiPromptRegistry([]);
        setAiApprovalPolicyRegistry([]);
        setAiToolRegistry([]);
        setGrowthAssistAiApprovalPolicies([]);
        setGrowthAssistAiApprovalRequests([]);
        setGrowthAssistAiToolAccess([]);
        setGrowthAssistAiEnvelope(null);
        setGrowthAssistAiSuggestionRuns([]);
        setSelectedGrowthAiSuggestionRunDetail(null);
        setWhatsappSummary(null);
        setWhatsappMonitorSummary(null);
        setWhatsappMonitorAnalytics(null);
        setGrowthAlertAcknowledgements([]);
        setGrowthOperationalCases([]);
        setGrowthOperationalCaseAutoAssignmentSettings(null);
        setGrowthOperationalCaseAutoAssignmentPolicy('balanced');
        setGrowthMonitorHistory([]);
        setGrowthError(
          error instanceof Error
            ? error.message
            : 'No se pudo cargar el workspace operativo de Growth.',
        );
      } finally {
        if (!cancelled) {
          setGrowthLoading(false);
        }
      }
    }

    void loadGrowthWorkspace();

    return () => {
      cancelled = true;
    };
  }, [
    currentTenancy,
    firstResponseSlaHours,
    followUpSlaHours,
    growthAssigneeFilter,
    growthChannelFilter,
    growthWorkspaceAvailable,
    staleThreadHours,
    token,
  ]);

  useEffect(() => {
    if (!token || !currentTenancy || !growthWorkspaceAvailable) {
      setGrowthAssistAiApprovalRequests([]);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    let cancelled = false;

    async function loadGrowthApprovalQueue() {
      try {
        const approvalRequests = await fetchTenantAiApprovalRequests(
          token,
          tenantSlug,
          'growth-assist-coach',
          {
            status: growthAiApprovalStatusFilter,
          },
        );

        if (cancelled) {
          return;
        }

        startTransition(() => {
          setGrowthAssistAiApprovalRequests(approvalRequests);
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        setGrowthError(
          error instanceof Error
            ? error.message
            : 'No se pudo cargar la cola de aprobaciones de Growth.',
        );
      }
    }

    void loadGrowthApprovalQueue();

    return () => {
      cancelled = true;
    };
  }, [currentTenancy, growthAiApprovalStatusFilter, growthWorkspaceAvailable, token]);

  useEffect(() => {
    if (
      !token ||
      !currentTenancy ||
      (!canReadGrowthConversations && !canReadInvoicingReports)
    ) {
      setTenantAiApprovalWorkspaceSummary(null);
      setTenantAiApprovalWorkspace([]);
      setTenantAiApprovalWorkspaceLoading(false);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    let cancelled = false;

    async function loadTenantAiApprovalWorkspace() {
      setTenantAiApprovalWorkspaceLoading(true);

      try {
        const summary = await fetchTenantAiApprovalWorkspaceSummary(
          token,
          tenantSlug,
          {
            status: tenantAiApprovalWorkspaceStatusFilter,
          },
        );

        if (cancelled) {
          return;
        }

        startTransition(() => {
          setTenantAiApprovalWorkspaceSummary(summary);
          setTenantAiApprovalWorkspace(summary.recentApprovalRequests);
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : 'No se pudo cargar el workspace transversal de aprobaciones AI.';

        if (growthWorkspaceAvailable) {
          setGrowthError(message);
        } else {
          setInvoicingError(message);
        }
      } finally {
        if (!cancelled) {
          setTenantAiApprovalWorkspaceLoading(false);
        }
      }
    }

    void loadTenantAiApprovalWorkspace();

    return () => {
      cancelled = true;
    };
  }, [
    canReadGrowthConversations,
    canReadInvoicingReports,
    currentTenancy,
    growthWorkspaceAvailable,
    tenantAiApprovalWorkspaceStatusFilter,
    token,
  ]);

  useEffect(() => {
    if (
      !token ||
      !currentTenancy ||
      (!canReadGrowthConversations && !canReadInvoicingReports)
    ) {
      setTenantAiOperationsSummary(null);
      setTenantAiOperationsSummaryLoading(false);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    let cancelled = false;

    async function loadTenantAiOperationsSummary() {
      setTenantAiOperationsSummaryLoading(true);

      try {
        const summary = await fetchTenantAiOperationsSummary(token, tenantSlug);

        if (cancelled) {
          return;
        }

        startTransition(() => {
          setTenantAiOperationsSummary(summary);
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : 'No se pudo cargar el operations summary transversal de AI.';

        if (growthWorkspaceAvailable) {
          setGrowthError(message);
        } else {
          setInvoicingError(message);
        }
      } finally {
        if (!cancelled) {
          setTenantAiOperationsSummaryLoading(false);
        }
      }
    }

    void loadTenantAiOperationsSummary();

    return () => {
      cancelled = true;
    };
  }, [
    canReadGrowthConversations,
    canReadInvoicingReports,
    currentTenancy,
    growthWorkspaceAvailable,
    token,
  ]);

  useEffect(() => {
    if (
      !token ||
      !currentTenancy ||
      (!canReadGrowthConversations && !canReadInvoicingReports)
    ) {
      setTenantAiApprovalLaunchWorkspace(null);
      setTenantAiApprovalLaunchWorkspaceLoading(false);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    let cancelled = false;

    async function loadTenantAiApprovalLaunchWorkspace() {
      setTenantAiApprovalLaunchWorkspaceLoading(true);

      try {
        const approvalLaunchWorkspace =
          await fetchTenantAiApprovalLaunchWorkspace(token, tenantSlug);

        if (cancelled) {
          return;
        }

        startTransition(() => {
          setTenantAiApprovalLaunchWorkspace(approvalLaunchWorkspace);
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : 'No se pudo cargar el launch workspace de approvals de AI.';

        if (growthWorkspaceAvailable) {
          setGrowthError(message);
        } else {
          setInvoicingError(message);
        }
      } finally {
        if (!cancelled) {
          setTenantAiApprovalLaunchWorkspaceLoading(false);
        }
      }
    }

    void loadTenantAiApprovalLaunchWorkspace();

    return () => {
      cancelled = true;
    };
  }, [
    canReadGrowthConversations,
    canReadInvoicingReports,
    currentTenancy,
    growthWorkspaceAvailable,
    token,
  ]);

  useEffect(() => {
    if (
      !token ||
      !currentTenancy ||
      (!canReadGrowthConversations && !canReadInvoicingReports)
    ) {
      setTenantAiApprovalReadinessWorkspace(null);
      setTenantAiApprovalReadinessWorkspaceLoading(false);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    let cancelled = false;

    async function loadTenantAiApprovalReadinessWorkspace() {
      setTenantAiApprovalReadinessWorkspaceLoading(true);

      try {
        const approvalReadinessWorkspace =
          await fetchTenantAiApprovalReadinessWorkspace(token, tenantSlug);

        if (cancelled) {
          return;
        }

        startTransition(() => {
          setTenantAiApprovalReadinessWorkspace(approvalReadinessWorkspace);
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : 'No se pudo cargar la readiness de approvals de AI.';

        if (growthWorkspaceAvailable) {
          setGrowthError(message);
        } else {
          setInvoicingError(message);
        }
      } finally {
        if (!cancelled) {
          setTenantAiApprovalReadinessWorkspaceLoading(false);
        }
      }
    }

    void loadTenantAiApprovalReadinessWorkspace();

    return () => {
      cancelled = true;
    };
  }, [
    canReadGrowthConversations,
    canReadInvoicingReports,
    currentTenancy,
    growthWorkspaceAvailable,
    token,
  ]);

  useEffect(() => {
    if (
      !token ||
      !currentTenancy ||
      (!canReadGrowthConversations && !canReadInvoicingReports)
    ) {
      setTenantAiApprovalRolloutWorkspace(null);
      setTenantAiApprovalRolloutWorkspaceLoading(false);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    let cancelled = false;

    async function loadTenantAiApprovalRolloutWorkspace() {
      setTenantAiApprovalRolloutWorkspaceLoading(true);

      try {
        const approvalRolloutWorkspace =
          await fetchTenantAiApprovalRolloutWorkspace(token, tenantSlug);

        if (cancelled) {
          return;
        }

        startTransition(() => {
          setTenantAiApprovalRolloutWorkspace(approvalRolloutWorkspace);
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : 'No se pudo cargar el rollout de approvals de AI.';

        if (growthWorkspaceAvailable) {
          setGrowthError(message);
        } else {
          setInvoicingError(message);
        }
      } finally {
        if (!cancelled) {
          setTenantAiApprovalRolloutWorkspaceLoading(false);
        }
      }
    }

    void loadTenantAiApprovalRolloutWorkspace();

    return () => {
      cancelled = true;
    };
  }, [
    canReadGrowthConversations,
    canReadInvoicingReports,
    currentTenancy,
    growthWorkspaceAvailable,
    token,
  ]);

  useEffect(() => {
    if (
      !token ||
      !currentTenancy ||
      (!canReadGrowthConversations && !canReadInvoicingReports)
    ) {
      setTenantAiApprovalStaffingPlanWorkspace(null);
      setTenantAiApprovalStaffingPlanWorkspaceLoading(false);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    let cancelled = false;

    async function loadTenantAiApprovalStaffingPlanWorkspace() {
      setTenantAiApprovalStaffingPlanWorkspaceLoading(true);

      try {
        const approvalStaffingPlanWorkspace =
          await fetchTenantAiApprovalStaffingPlanWorkspace(token, tenantSlug);

        if (cancelled) {
          return;
        }

        startTransition(() => {
          setTenantAiApprovalStaffingPlanWorkspace(
            approvalStaffingPlanWorkspace,
          );
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : 'No se pudo cargar el plan de staffing de approvals de AI.';

        if (growthWorkspaceAvailable) {
          setGrowthError(message);
        } else {
          setInvoicingError(message);
        }
      } finally {
        if (!cancelled) {
          setTenantAiApprovalStaffingPlanWorkspaceLoading(false);
        }
      }
    }

    void loadTenantAiApprovalStaffingPlanWorkspace();

    return () => {
      cancelled = true;
    };
  }, [
    canReadGrowthConversations,
    canReadInvoicingReports,
    currentTenancy,
    growthWorkspaceAvailable,
    token,
  ]);

  useEffect(() => {
    if (
      !token ||
      !currentTenancy ||
      (!canReadGrowthConversations && !canReadInvoicingReports)
    ) {
      setTenantAiApprovalStaffingWorkspace(null);
      setTenantAiApprovalStaffingWorkspaceLoading(false);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    let cancelled = false;

    async function loadTenantAiApprovalStaffingWorkspace() {
      setTenantAiApprovalStaffingWorkspaceLoading(true);

      try {
        const approvalStaffingWorkspace =
          await fetchTenantAiApprovalStaffingWorkspace(token, tenantSlug);

        if (cancelled) {
          return;
        }

        startTransition(() => {
          setTenantAiApprovalStaffingWorkspace(approvalStaffingWorkspace);
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : 'No se pudo cargar el staffing de approvals de AI.';

        if (growthWorkspaceAvailable) {
          setGrowthError(message);
        } else {
          setInvoicingError(message);
        }
      } finally {
        if (!cancelled) {
          setTenantAiApprovalStaffingWorkspaceLoading(false);
        }
      }
    }

    void loadTenantAiApprovalStaffingWorkspace();

    return () => {
      cancelled = true;
    };
  }, [
    canReadGrowthConversations,
    canReadInvoicingReports,
    currentTenancy,
    growthWorkspaceAvailable,
    token,
  ]);

  useEffect(() => {
    if (
      !token ||
      !currentTenancy ||
      (!canReadGrowthConversations && !canReadInvoicingReports)
    ) {
      setTenantAiApprovalSlaWorkspace(null);
      setTenantAiApprovalSlaWorkspaceLoading(false);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    let cancelled = false;

    async function loadTenantAiApprovalSlaWorkspace() {
      setTenantAiApprovalSlaWorkspaceLoading(true);

      try {
        const approvalSlaWorkspace = await fetchTenantAiApprovalSlaWorkspace(
          token,
          tenantSlug,
        );

        if (cancelled) {
          return;
        }

        startTransition(() => {
          setTenantAiApprovalSlaWorkspace(approvalSlaWorkspace);
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : 'No se pudo cargar el SLA de approvals de AI.';

        if (growthWorkspaceAvailable) {
          setGrowthError(message);
        } else {
          setInvoicingError(message);
        }
      } finally {
        if (!cancelled) {
          setTenantAiApprovalSlaWorkspaceLoading(false);
        }
      }
    }

    void loadTenantAiApprovalSlaWorkspace();

    return () => {
      cancelled = true;
    };
  }, [
    canReadGrowthConversations,
    canReadInvoicingReports,
    currentTenancy,
    growthWorkspaceAvailable,
    token,
  ]);

  useEffect(() => {
    if (
      !token ||
      !currentTenancy ||
      (!canReadGrowthConversations && !canReadInvoicingReports)
    ) {
      setTenantAiApprovalCapacityWorkspace(null);
      setTenantAiApprovalCapacityWorkspaceLoading(false);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    let cancelled = false;

    async function loadTenantAiApprovalCapacityWorkspace() {
      setTenantAiApprovalCapacityWorkspaceLoading(true);

      try {
        const approvalCapacityWorkspace =
          await fetchTenantAiApprovalCapacityWorkspace(token, tenantSlug);

        if (cancelled) {
          return;
        }

        startTransition(() => {
          setTenantAiApprovalCapacityWorkspace(approvalCapacityWorkspace);
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : 'No se pudo cargar la capacidad de approvals de AI.';

        if (growthWorkspaceAvailable) {
          setGrowthError(message);
        } else {
          setInvoicingError(message);
        }
      } finally {
        if (!cancelled) {
          setTenantAiApprovalCapacityWorkspaceLoading(false);
        }
      }
    }

    void loadTenantAiApprovalCapacityWorkspace();

    return () => {
      cancelled = true;
    };
  }, [
    canReadGrowthConversations,
    canReadInvoicingReports,
    currentTenancy,
    growthWorkspaceAvailable,
    token,
  ]);

  useEffect(() => {
    if (
      !token ||
      !currentTenancy ||
      (!canReadGrowthConversations && !canReadInvoicingReports)
    ) {
      setTenantAiApprovalDesignWorkspace(null);
      setTenantAiApprovalDesignWorkspaceLoading(false);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    let cancelled = false;

    async function loadTenantAiApprovalDesignWorkspace() {
      setTenantAiApprovalDesignWorkspaceLoading(true);

      try {
        const approvalDesignWorkspace =
          await fetchTenantAiApprovalDesignWorkspace(token, tenantSlug);

        if (cancelled) {
          return;
        }

        startTransition(() => {
          setTenantAiApprovalDesignWorkspace(approvalDesignWorkspace);
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : 'No se pudo cargar el diseno de approvals de AI.';

        if (growthWorkspaceAvailable) {
          setGrowthError(message);
        } else {
          setInvoicingError(message);
        }
      } finally {
        if (!cancelled) {
          setTenantAiApprovalDesignWorkspaceLoading(false);
        }
      }
    }

    void loadTenantAiApprovalDesignWorkspace();

    return () => {
      cancelled = true;
    };
  }, [
    canReadGrowthConversations,
    canReadInvoicingReports,
    currentTenancy,
    growthWorkspaceAvailable,
    token,
  ]);

  useEffect(() => {
    if (
      !token ||
      !currentTenancy ||
      (!canReadGrowthConversations && !canReadInvoicingReports)
    ) {
      setTenantAiPolicySimulationWorkspace(null);
      setTenantAiPolicySimulationWorkspaceLoading(false);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    let cancelled = false;

    async function loadTenantAiPolicySimulationWorkspace() {
      setTenantAiPolicySimulationWorkspaceLoading(true);

      try {
        const policySimulationWorkspace =
          await fetchTenantAiPolicySimulationWorkspace(token, tenantSlug);

        if (cancelled) {
          return;
        }

        startTransition(() => {
          setTenantAiPolicySimulationWorkspace(policySimulationWorkspace);
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : 'No se pudo cargar la simulación de políticas de AI.';

        if (growthWorkspaceAvailable) {
          setGrowthError(message);
        } else {
          setInvoicingError(message);
        }
      } finally {
        if (!cancelled) {
          setTenantAiPolicySimulationWorkspaceLoading(false);
        }
      }
    }

    void loadTenantAiPolicySimulationWorkspace();

    return () => {
      cancelled = true;
    };
  }, [
    canReadGrowthConversations,
    canReadInvoicingReports,
    currentTenancy,
    growthWorkspaceAvailable,
    token,
  ]);

  useEffect(() => {
    if (
      !token ||
      !currentTenancy ||
      (!canReadGrowthConversations && !canReadInvoicingReports)
    ) {
      setTenantAiGovernanceWorkspace(null);
      setTenantAiGovernanceWorkspaceLoading(false);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    let cancelled = false;

    async function loadTenantAiGovernanceWorkspace() {
      setTenantAiGovernanceWorkspaceLoading(true);

      try {
        const governanceWorkspace = await fetchTenantAiGovernanceWorkspace(
          token,
          tenantSlug,
        );

        if (cancelled) {
          return;
        }

        startTransition(() => {
          setTenantAiGovernanceWorkspace(governanceWorkspace);
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : 'No se pudo cargar la gobernanza transversal de AI.';

        if (growthWorkspaceAvailable) {
          setGrowthError(message);
        } else {
          setInvoicingError(message);
        }
      } finally {
        if (!cancelled) {
          setTenantAiGovernanceWorkspaceLoading(false);
        }
      }
    }

    void loadTenantAiGovernanceWorkspace();

    return () => {
      cancelled = true;
    };
  }, [
    canReadGrowthConversations,
    canReadInvoicingReports,
    currentTenancy,
    growthWorkspaceAvailable,
    token,
  ]);

  useEffect(() => {
    if (
      !token ||
      !currentTenancy ||
      (!canReadGrowthConversations && !canReadInvoicingReports)
    ) {
      setTenantAiEvaluationWorkspace(null);
      setTenantAiEvaluationWorkspaceLoading(false);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    let cancelled = false;

    async function loadTenantAiEvaluationWorkspace() {
      setTenantAiEvaluationWorkspaceLoading(true);

      try {
        const evaluationWorkspace = await fetchTenantAiEvaluationWorkspace(
          token,
          tenantSlug,
        );

        if (cancelled) {
          return;
        }

        startTransition(() => {
          setTenantAiEvaluationWorkspace(evaluationWorkspace);
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : 'No se pudo cargar la evaluación transversal de AI.';

        if (growthWorkspaceAvailable) {
          setGrowthError(message);
        } else {
          setInvoicingError(message);
        }
      } finally {
        if (!cancelled) {
          setTenantAiEvaluationWorkspaceLoading(false);
        }
      }
    }

    void loadTenantAiEvaluationWorkspace();

    return () => {
      cancelled = true;
    };
  }, [
    canReadGrowthConversations,
    canReadInvoicingReports,
    currentTenancy,
    growthWorkspaceAvailable,
    token,
  ]);

  useEffect(() => {
    if (
      !token ||
      !currentTenancy ||
      (!canReadGrowthConversations && !canReadInvoicingReports)
    ) {
      setTenantAiHealthWorkspace(null);
      setTenantAiHealthWorkspaceLoading(false);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    let cancelled = false;

    async function loadTenantAiHealthWorkspace() {
      setTenantAiHealthWorkspaceLoading(true);

      try {
        const healthWorkspace = await fetchTenantAiHealthWorkspace(
          token,
          tenantSlug,
        );

        if (cancelled) {
          return;
        }

        startTransition(() => {
          setTenantAiHealthWorkspace(healthWorkspace);
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : 'No se pudo cargar la salud transversal de AI.';

        if (growthWorkspaceAvailable) {
          setGrowthError(message);
        } else {
          setInvoicingError(message);
        }
      } finally {
        if (!cancelled) {
          setTenantAiHealthWorkspaceLoading(false);
        }
      }
    }

    void loadTenantAiHealthWorkspace();

    return () => {
      cancelled = true;
    };
  }, [
    canReadGrowthConversations,
    canReadInvoicingReports,
    currentTenancy,
    growthWorkspaceAvailable,
    token,
  ]);

  useEffect(() => {
    if (
      !token ||
      !currentTenancy ||
      (!canReadGrowthConversations && !canReadInvoicingReports)
    ) {
      setTenantAiActivityFeed(null);
      setTenantAiActivityFeedLoading(false);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    let cancelled = false;

    async function loadTenantAiActivityFeed() {
      setTenantAiActivityFeedLoading(true);

      try {
        const feed = await fetchTenantAiActivityFeed(token, tenantSlug, {
          limit: 8,
          type: tenantAiActivityFeedFilter,
        });

        if (cancelled) {
          return;
        }

        startTransition(() => {
          setTenantAiActivityFeed(feed);
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : 'No se pudo cargar el activity feed transversal de AI.';

        if (growthWorkspaceAvailable) {
          setGrowthError(message);
        } else {
          setInvoicingError(message);
        }
      } finally {
        if (!cancelled) {
          setTenantAiActivityFeedLoading(false);
        }
      }
    }

    void loadTenantAiActivityFeed();

    return () => {
      cancelled = true;
    };
  }, [
    canReadGrowthConversations,
    canReadInvoicingReports,
    currentTenancy,
    growthWorkspaceAvailable,
    tenantAiActivityFeedFilter,
    token,
  ]);

  useEffect(() => {
    if (
      !token ||
      !currentTenancy ||
      (!canReadGrowthConversations && !canReadInvoicingReports)
    ) {
      setTenantAiMemoryWorkspace(null);
      setTenantAiMemoryWorkspaceLoading(false);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    let cancelled = false;

    async function loadTenantAiMemoryWorkspace() {
      setTenantAiMemoryWorkspaceLoading(true);

      try {
        const memoryWorkspace = await fetchTenantAiMemoryWorkspace(
          token,
          tenantSlug,
        );

        if (cancelled) {
          return;
        }

        startTransition(() => {
          setTenantAiMemoryWorkspace(memoryWorkspace);
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : 'No se pudo cargar la memoria transversal de AI.';

        if (growthWorkspaceAvailable) {
          setGrowthError(message);
        } else {
          setInvoicingError(message);
        }
      } finally {
        if (!cancelled) {
          setTenantAiMemoryWorkspaceLoading(false);
        }
      }
    }

    void loadTenantAiMemoryWorkspace();

    return () => {
      cancelled = true;
    };
  }, [
    canReadGrowthConversations,
    canReadInvoicingReports,
    currentTenancy,
    growthWorkspaceAvailable,
    token,
  ]);

  useEffect(() => {
    if (
      !token ||
      !currentTenancy ||
      (!canReadGrowthConversations && !canReadInvoicingReports)
    ) {
      setTenantAiHandoffWorkspaceSummary(null);
      setTenantAiSuggestionWorkspace([]);
      setTenantAiSuggestionWorkspaceLoading(false);
      setSelectedTenantAiSuggestionWorkspaceDetail(null);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    let cancelled = false;

    async function loadTenantAiSuggestionWorkspace() {
      setTenantAiSuggestionWorkspaceLoading(true);

      try {
        const summary = await fetchTenantAiHandoffWorkspace(
          token,
          tenantSlug,
        );

        if (cancelled) {
          return;
        }

        startTransition(() => {
          setTenantAiHandoffWorkspaceSummary(summary);
          setTenantAiSuggestionWorkspace(summary.recentSuggestionRuns);
          setSelectedTenantAiSuggestionWorkspaceDetail((current) =>
            current &&
            summary.recentSuggestionRuns.some((entry) => entry.id === current.id)
              ? current
              : null,
          );
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : 'No se pudo cargar el workspace transversal de handoffs AI.';

        if (growthWorkspaceAvailable) {
          setGrowthError(message);
        } else {
          setInvoicingError(message);
        }
      } finally {
        if (!cancelled) {
          setTenantAiSuggestionWorkspaceLoading(false);
        }
      }
    }

    void loadTenantAiSuggestionWorkspace();

    return () => {
      cancelled = true;
    };
  }, [
    canReadGrowthConversations,
    canReadInvoicingReports,
    currentTenancy,
    growthWorkspaceAvailable,
    token,
  ]);

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
      setSignatureHydrateMetadataFromPkcs12(false);
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
    setSignatureHydrateMetadataFromPkcs12(
      electronicSignatureSettings.provider === 'xades_pkcs12' &&
        (!electronicSignatureSettings.certificateFingerprint ||
          !electronicSignatureSettings.subjectName),
    );
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

  async function refreshTenantAiOperationsSummary() {
    if (
      !token ||
      !currentTenancy ||
      (!canReadGrowthConversations && !canReadInvoicingReports)
    ) {
      setTenantAiOperationsSummary(null);
      setTenantAiOperationsSummaryLoading(false);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    setTenantAiOperationsSummaryLoading(true);

    try {
      const summary = await fetchTenantAiOperationsSummary(token, tenantSlug);

      startTransition(() => {
        setTenantAiOperationsSummary(summary);
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo cargar el operations summary transversal de AI.';

      if (growthWorkspaceAvailable) {
        setGrowthError(message);
      } else {
        setInvoicingError(message);
      }
    } finally {
      setTenantAiOperationsSummaryLoading(false);
    }
  }

  async function refreshTenantAiApprovalWorkspaceSummary() {
    if (
      !token ||
      !currentTenancy ||
      (!canReadGrowthConversations && !canReadInvoicingReports)
    ) {
      setTenantAiApprovalWorkspaceSummary(null);
      setTenantAiApprovalWorkspace([]);
      setTenantAiApprovalWorkspaceLoading(false);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    setTenantAiApprovalWorkspaceLoading(true);

    try {
      const summary = await fetchTenantAiApprovalWorkspaceSummary(
        token,
        tenantSlug,
        {
          status: tenantAiApprovalWorkspaceStatusFilter,
        },
      );

      startTransition(() => {
        setTenantAiApprovalWorkspaceSummary(summary);
        setTenantAiApprovalWorkspace(summary.recentApprovalRequests);
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo cargar el workspace transversal de aprobaciones AI.';

      if (growthWorkspaceAvailable) {
        setGrowthError(message);
      } else {
        setInvoicingError(message);
      }
    } finally {
      setTenantAiApprovalWorkspaceLoading(false);
    }
  }

  async function refreshTenantAiHandoffWorkspaceSummary() {
    if (
      !token ||
      !currentTenancy ||
      (!canReadGrowthConversations && !canReadInvoicingReports)
    ) {
      setTenantAiHandoffWorkspaceSummary(null);
      setTenantAiSuggestionWorkspace([]);
      setTenantAiSuggestionWorkspaceLoading(false);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    setTenantAiSuggestionWorkspaceLoading(true);

    try {
      const summary = await fetchTenantAiHandoffWorkspace(token, tenantSlug);

      startTransition(() => {
        setTenantAiHandoffWorkspaceSummary(summary);
        setTenantAiSuggestionWorkspace(summary.recentSuggestionRuns);
        setSelectedTenantAiSuggestionWorkspaceDetail((current) =>
          current && summary.recentSuggestionRuns.some((entry) => entry.id === current.id)
            ? current
            : null,
        );
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo cargar el workspace transversal de handoffs AI.';

      if (growthWorkspaceAvailable) {
        setGrowthError(message);
      } else {
        setInvoicingError(message);
      }
    } finally {
      setTenantAiSuggestionWorkspaceLoading(false);
    }
  }

  async function refreshTenantAiActivityFeed() {
    if (
      !token ||
      !currentTenancy ||
      (!canReadGrowthConversations && !canReadInvoicingReports)
    ) {
      setTenantAiActivityFeed(null);
      setTenantAiActivityFeedLoading(false);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    setTenantAiActivityFeedLoading(true);

    try {
      const feed = await fetchTenantAiActivityFeed(token, tenantSlug, {
        limit: 8,
        type: tenantAiActivityFeedFilter,
      });

      startTransition(() => {
        setTenantAiActivityFeed(feed);
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo cargar el activity feed transversal de AI.';

      if (growthWorkspaceAvailable) {
        setGrowthError(message);
      } else {
        setInvoicingError(message);
      }
    } finally {
      setTenantAiActivityFeedLoading(false);
    }
  }

  async function refreshTenantAiMemoryWorkspace() {
    if (
      !token ||
      !currentTenancy ||
      (!canReadGrowthConversations && !canReadInvoicingReports)
    ) {
      setTenantAiMemoryWorkspace(null);
      setTenantAiMemoryWorkspaceLoading(false);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    setTenantAiMemoryWorkspaceLoading(true);

    try {
      const memoryWorkspace = await fetchTenantAiMemoryWorkspace(
        token,
        tenantSlug,
      );

      startTransition(() => {
        setTenantAiMemoryWorkspace(memoryWorkspace);
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo cargar la memoria transversal de AI.';

      if (growthWorkspaceAvailable) {
        setGrowthError(message);
      } else {
        setInvoicingError(message);
      }
    } finally {
      setTenantAiMemoryWorkspaceLoading(false);
    }
  }

  async function refreshTenantAiHealthWorkspace() {
    if (
      !token ||
      !currentTenancy ||
      (!canReadGrowthConversations && !canReadInvoicingReports)
    ) {
      setTenantAiHealthWorkspace(null);
      setTenantAiHealthWorkspaceLoading(false);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    setTenantAiHealthWorkspaceLoading(true);

    try {
      const healthWorkspace = await fetchTenantAiHealthWorkspace(
        token,
        tenantSlug,
      );

      startTransition(() => {
        setTenantAiHealthWorkspace(healthWorkspace);
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo cargar la salud transversal de AI.';

      if (growthWorkspaceAvailable) {
        setGrowthError(message);
      } else {
        setInvoicingError(message);
      }
    } finally {
      setTenantAiHealthWorkspaceLoading(false);
    }
  }

  async function refreshTenantAiEvaluationWorkspace() {
    if (
      !token ||
      !currentTenancy ||
      (!canReadGrowthConversations && !canReadInvoicingReports)
    ) {
      setTenantAiEvaluationWorkspace(null);
      setTenantAiEvaluationWorkspaceLoading(false);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    setTenantAiEvaluationWorkspaceLoading(true);

    try {
      const evaluationWorkspace = await fetchTenantAiEvaluationWorkspace(
        token,
        tenantSlug,
      );

      startTransition(() => {
        setTenantAiEvaluationWorkspace(evaluationWorkspace);
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo cargar la evaluación transversal de AI.';

      if (growthWorkspaceAvailable) {
        setGrowthError(message);
      } else {
        setInvoicingError(message);
      }
    } finally {
      setTenantAiEvaluationWorkspaceLoading(false);
    }
  }

  async function refreshTenantAiGovernanceWorkspace() {
    if (
      !token ||
      !currentTenancy ||
      (!canReadGrowthConversations && !canReadInvoicingReports)
    ) {
      setTenantAiGovernanceWorkspace(null);
      setTenantAiGovernanceWorkspaceLoading(false);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    setTenantAiGovernanceWorkspaceLoading(true);

    try {
      const governanceWorkspace = await fetchTenantAiGovernanceWorkspace(
        token,
        tenantSlug,
      );

      startTransition(() => {
        setTenantAiGovernanceWorkspace(governanceWorkspace);
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo cargar la gobernanza transversal de AI.';

      if (growthWorkspaceAvailable) {
        setGrowthError(message);
      } else {
        setInvoicingError(message);
      }
    } finally {
      setTenantAiGovernanceWorkspaceLoading(false);
    }
  }

  async function refreshTenantAiPolicySimulationWorkspace() {
    if (
      !token ||
      !currentTenancy ||
      (!canReadGrowthConversations && !canReadInvoicingReports)
    ) {
      setTenantAiPolicySimulationWorkspace(null);
      setTenantAiPolicySimulationWorkspaceLoading(false);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    setTenantAiPolicySimulationWorkspaceLoading(true);

    try {
      const policySimulationWorkspace =
        await fetchTenantAiPolicySimulationWorkspace(token, tenantSlug);

      startTransition(() => {
        setTenantAiPolicySimulationWorkspace(policySimulationWorkspace);
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo cargar la simulación de políticas de AI.';

      if (growthWorkspaceAvailable) {
        setGrowthError(message);
      } else {
        setInvoicingError(message);
      }
    } finally {
      setTenantAiPolicySimulationWorkspaceLoading(false);
    }
  }

  async function refreshTenantAiApprovalDesignWorkspace() {
    if (
      !token ||
      !currentTenancy ||
      (!canReadGrowthConversations && !canReadInvoicingReports)
    ) {
      setTenantAiApprovalDesignWorkspace(null);
      setTenantAiApprovalDesignWorkspaceLoading(false);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    setTenantAiApprovalDesignWorkspaceLoading(true);

    try {
      const approvalDesignWorkspace =
        await fetchTenantAiApprovalDesignWorkspace(token, tenantSlug);

      startTransition(() => {
        setTenantAiApprovalDesignWorkspace(approvalDesignWorkspace);
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo cargar el diseno de approvals de AI.';

      if (growthWorkspaceAvailable) {
        setGrowthError(message);
      } else {
        setInvoicingError(message);
      }
    } finally {
      setTenantAiApprovalDesignWorkspaceLoading(false);
    }
  }

  async function refreshTenantAiApprovalCapacityWorkspace() {
    if (
      !token ||
      !currentTenancy ||
      (!canReadGrowthConversations && !canReadInvoicingReports)
    ) {
      setTenantAiApprovalCapacityWorkspace(null);
      setTenantAiApprovalCapacityWorkspaceLoading(false);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    setTenantAiApprovalCapacityWorkspaceLoading(true);

    try {
      const approvalCapacityWorkspace =
        await fetchTenantAiApprovalCapacityWorkspace(token, tenantSlug);

      startTransition(() => {
        setTenantAiApprovalCapacityWorkspace(approvalCapacityWorkspace);
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo cargar la capacidad de approvals de AI.';

      if (growthWorkspaceAvailable) {
        setGrowthError(message);
      } else {
        setInvoicingError(message);
      }
    } finally {
      setTenantAiApprovalCapacityWorkspaceLoading(false);
    }
  }

  async function refreshTenantAiApprovalSlaWorkspace() {
    if (
      !token ||
      !currentTenancy ||
      (!canReadGrowthConversations && !canReadInvoicingReports)
    ) {
      setTenantAiApprovalSlaWorkspace(null);
      setTenantAiApprovalSlaWorkspaceLoading(false);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    setTenantAiApprovalSlaWorkspaceLoading(true);

    try {
      const approvalSlaWorkspace = await fetchTenantAiApprovalSlaWorkspace(
        token,
        tenantSlug,
      );

      startTransition(() => {
        setTenantAiApprovalSlaWorkspace(approvalSlaWorkspace);
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo cargar el SLA de approvals de AI.';

      if (growthWorkspaceAvailable) {
        setGrowthError(message);
      } else {
        setInvoicingError(message);
      }
    } finally {
      setTenantAiApprovalSlaWorkspaceLoading(false);
    }
  }

  async function refreshTenantAiApprovalStaffingWorkspace() {
    if (
      !token ||
      !currentTenancy ||
      (!canReadGrowthConversations && !canReadInvoicingReports)
    ) {
      setTenantAiApprovalStaffingWorkspace(null);
      setTenantAiApprovalStaffingWorkspaceLoading(false);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    setTenantAiApprovalStaffingWorkspaceLoading(true);

    try {
      const approvalStaffingWorkspace =
        await fetchTenantAiApprovalStaffingWorkspace(token, tenantSlug);

      startTransition(() => {
        setTenantAiApprovalStaffingWorkspace(approvalStaffingWorkspace);
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo cargar el staffing de approvals de AI.';

      if (growthWorkspaceAvailable) {
        setGrowthError(message);
      } else {
        setInvoicingError(message);
      }
    } finally {
      setTenantAiApprovalStaffingWorkspaceLoading(false);
    }
  }

  async function refreshTenantAiApprovalStaffingPlanWorkspace() {
    if (
      !token ||
      !currentTenancy ||
      (!canReadGrowthConversations && !canReadInvoicingReports)
    ) {
      setTenantAiApprovalStaffingPlanWorkspace(null);
      setTenantAiApprovalStaffingPlanWorkspaceLoading(false);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    setTenantAiApprovalStaffingPlanWorkspaceLoading(true);

    try {
      const approvalStaffingPlanWorkspace =
        await fetchTenantAiApprovalStaffingPlanWorkspace(token, tenantSlug);

      startTransition(() => {
        setTenantAiApprovalStaffingPlanWorkspace(
          approvalStaffingPlanWorkspace,
        );
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo cargar el plan de staffing de approvals de AI.';

      if (growthWorkspaceAvailable) {
        setGrowthError(message);
      } else {
        setInvoicingError(message);
      }
    } finally {
      setTenantAiApprovalStaffingPlanWorkspaceLoading(false);
    }
  }

  async function refreshTenantAiApprovalRolloutWorkspace() {
    if (
      !token ||
      !currentTenancy ||
      (!canReadGrowthConversations && !canReadInvoicingReports)
    ) {
      setTenantAiApprovalRolloutWorkspace(null);
      setTenantAiApprovalRolloutWorkspaceLoading(false);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    setTenantAiApprovalRolloutWorkspaceLoading(true);

    try {
      const approvalRolloutWorkspace =
        await fetchTenantAiApprovalRolloutWorkspace(token, tenantSlug);

      startTransition(() => {
        setTenantAiApprovalRolloutWorkspace(approvalRolloutWorkspace);
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo cargar el rollout de approvals de AI.';

      if (growthWorkspaceAvailable) {
        setGrowthError(message);
      } else {
        setInvoicingError(message);
      }
    } finally {
      setTenantAiApprovalRolloutWorkspaceLoading(false);
    }
  }

  async function refreshTenantAiApprovalReadinessWorkspace() {
    if (
      !token ||
      !currentTenancy ||
      (!canReadGrowthConversations && !canReadInvoicingReports)
    ) {
      setTenantAiApprovalReadinessWorkspace(null);
      setTenantAiApprovalReadinessWorkspaceLoading(false);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    setTenantAiApprovalReadinessWorkspaceLoading(true);

    try {
      const approvalReadinessWorkspace =
        await fetchTenantAiApprovalReadinessWorkspace(token, tenantSlug);

      startTransition(() => {
        setTenantAiApprovalReadinessWorkspace(approvalReadinessWorkspace);
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo cargar la readiness de approvals de AI.';

      if (growthWorkspaceAvailable) {
        setGrowthError(message);
      } else {
        setInvoicingError(message);
      }
    } finally {
      setTenantAiApprovalReadinessWorkspaceLoading(false);
    }
  }

  async function refreshTenantAiApprovalLaunchWorkspace() {
    if (
      !token ||
      !currentTenancy ||
      (!canReadGrowthConversations && !canReadInvoicingReports)
    ) {
      setTenantAiApprovalLaunchWorkspace(null);
      setTenantAiApprovalLaunchWorkspaceLoading(false);
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    setTenantAiApprovalLaunchWorkspaceLoading(true);

    try {
      const approvalLaunchWorkspace =
        await fetchTenantAiApprovalLaunchWorkspace(token, tenantSlug);

      startTransition(() => {
        setTenantAiApprovalLaunchWorkspace(approvalLaunchWorkspace);
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo cargar el launch workspace de approvals de AI.';

      if (growthWorkspaceAvailable) {
        setGrowthError(message);
      } else {
        setInvoicingError(message);
      }
    } finally {
      setTenantAiApprovalLaunchWorkspaceLoading(false);
    }
  }

  async function refreshTenantAiOperationsConsole() {
    await refreshTenantAiOperationsSummary();
    await refreshTenantAiApprovalWorkspaceSummary();
    await refreshTenantAiHandoffWorkspaceSummary();
    await refreshTenantAiActivityFeed();
    await refreshTenantAiMemoryWorkspace();
    await refreshTenantAiHealthWorkspace();
    await refreshTenantAiEvaluationWorkspace();
    await refreshTenantAiGovernanceWorkspace();
    await refreshTenantAiPolicySimulationWorkspace();
    await refreshTenantAiApprovalDesignWorkspace();
    await refreshTenantAiApprovalCapacityWorkspace();
    await refreshTenantAiApprovalSlaWorkspace();
    await refreshTenantAiApprovalStaffingWorkspace();
    await refreshTenantAiApprovalStaffingPlanWorkspace();
    await refreshTenantAiApprovalRolloutWorkspace();
    await refreshTenantAiApprovalReadinessWorkspace();
    await refreshTenantAiApprovalLaunchWorkspace();
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
        nextDraftingAssist,
        nextAiApprovalPolicies,
        nextAiApprovalRequests,
        nextAiToolAccess,
        nextAiSuggestionEnvelope,
        nextAiSuggestionRuns,
      ] =
        await Promise.all([
        listTaxRates(token, tenantSlug),
        listCustomers(token, tenantSlug),
        listInvoices(token, tenantSlug),
        fetchInvoicingReportSummary(token, tenantSlug),
        loadOptionalInvoicingSettings(token, tenantSlug),
        fetchInvoiceDocumentDraftingAssist(token, tenantSlug).catch(() => null),
        fetchAiAgentApprovalPolicies(
          token,
          'invoice-document-assistant',
        ).catch(() => []),
        fetchTenantAiApprovalRequests(
          token,
          tenantSlug,
          'invoice-document-assistant',
          {
            status: invoiceAiApprovalStatusFilter,
          },
        ).catch(() => []),
        fetchAiAgentToolAccess(token, 'invoice-document-assistant').catch(
          () => [],
        ),
        fetchTenantAiSuggestionEnvelope(
          token,
          tenantSlug,
          'invoice-document-assistant',
        ).catch(() => null),
        fetchTenantAiSuggestionRuns(
          token,
          tenantSlug,
          'invoice-document-assistant',
        ).catch(() => []),
      ]);

      startTransition(() => {
        setTaxRates(nextTaxRates);
        setCustomers(nextCustomers);
        setInvoices(nextInvoices);
        setElectronicSandboxReadiness(nextSettings.electronicSandboxReadiness);
        setElectronicSignatureMaterialInspection(
          nextSettings.electronicSignatureMaterialInspection,
        );
        setElectronicSubmissionSettings(nextSettings.electronicSubmissionSettings);
        setElectronicSignatureSettings(nextSettings.electronicSignatureSettings);
        setIssuerProfile(nextSettings.issuerProfile);
        setInvoiceNumberingSettings(nextSettings.invoiceNumberingSettings);
        setInvoicingReport(nextReport);
        setInvoiceDocumentDraftingAssist(nextDraftingAssist);
        setInvoiceAssistantAiApprovalPolicies(nextAiApprovalPolicies);
        setInvoiceAssistantAiApprovalRequests(nextAiApprovalRequests);
        setInvoiceAssistantAiToolAccess(nextAiToolAccess);
        setInvoiceAssistantAiEnvelope(nextAiSuggestionEnvelope);
        setInvoiceAssistantAiSuggestionRuns(nextAiSuggestionRuns);
        setSelectedInvoiceAiSuggestionRunDetail(null);
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

  async function refreshGrowthWorkspace() {
    if (
      !token ||
      !currentTenancy ||
      !growthWorkspaceAvailable
    ) {
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    setGrowthLoading(true);
    setGrowthError(null);

    try {
      const [
        nextWorkbench,
        nextAssistAgenda,
        nextSummary,
        nextMonitorRuns,
        nextMonitorAnalytics,
        nextAcknowledgements,
        nextOperationalCases,
        nextAutoAssignmentSettings,
        nextAiApprovalPolicyRegistry,
        nextAiAgentCatalog,
        nextAiPromptRegistry,
        nextAiToolRegistry,
        nextAiApprovalPolicies,
        nextAiApprovalRequests,
        nextAiToolAccess,
        nextAiSuggestionEnvelope,
        nextAiSuggestionRuns,
      ] =
        await Promise.all([
        fetchGrowthConversationWorkbench(token, tenantSlug, {
          assigneeUserId: growthAssigneeFilter.trim() || null,
          channel: growthChannelFilter === 'all' ? null : growthChannelFilter,
          firstResponseSlaHours: Number(firstResponseSlaHours) || null,
          followUpSlaHours: Number(followUpSlaHours) || null,
          staleThreadHours: Number(staleThreadHours) || null,
        }),
        fetchGrowthAssistDailyAgenda(token, tenantSlug),
        fetchWhatsappOutboundReportingSummary(token, tenantSlug),
        fetchWhatsappOperationalMonitorRuns(token, tenantSlug),
        fetchWhatsappOperationalMonitorAnalytics(token, tenantSlug),
        fetchWhatsappOperationalAlertAcknowledgements(token, tenantSlug),
        fetchGrowthOperationalCases(token, tenantSlug),
        fetchGrowthOperationalCaseAutoAssignmentSettings(token, tenantSlug),
        fetchAiApprovalPolicies(token).catch(() => []),
        fetchAiAgentCatalog(token).catch(() => []),
        fetchAiPromptRegistry(token).catch(() => []),
        fetchAiToolRegistry(token).catch(() => []),
        fetchAiAgentApprovalPolicies(token, 'growth-assist-coach').catch(
          () => [],
        ),
        fetchTenantAiApprovalRequests(
          token,
          tenantSlug,
          'growth-assist-coach',
          {
            status: growthAiApprovalStatusFilter,
          },
        ).catch(() => []),
        fetchAiAgentToolAccess(token, 'growth-assist-coach').catch(() => []),
        fetchTenantAiSuggestionEnvelope(
          token,
          tenantSlug,
          'growth-assist-coach',
        ).catch(() => null),
        fetchTenantAiSuggestionRuns(
          token,
          tenantSlug,
          'growth-assist-coach',
        ).catch(() => []),
      ]);

      startTransition(() => {
        setGrowthWorkbench(nextWorkbench);
        setGrowthAssistAgenda(nextAssistAgenda);
        setAiApprovalPolicyRegistry(nextAiApprovalPolicyRegistry);
        setAiAgentCatalog(nextAiAgentCatalog);
        setAiPromptRegistry(nextAiPromptRegistry);
        setAiToolRegistry(nextAiToolRegistry);
        setGrowthAssistAiApprovalPolicies(nextAiApprovalPolicies);
        setGrowthAssistAiApprovalRequests(nextAiApprovalRequests);
        setGrowthAssistAiToolAccess(nextAiToolAccess);
        setGrowthAssistAiEnvelope(nextAiSuggestionEnvelope);
        setGrowthAssistAiSuggestionRuns(nextAiSuggestionRuns);
        setSelectedGrowthAiSuggestionRunDetail(null);
        setWhatsappSummary(nextSummary);
        setGrowthMonitorHistory(nextMonitorRuns);
        setWhatsappMonitorAnalytics(nextMonitorAnalytics);
        setGrowthAlertAcknowledgements(nextAcknowledgements);
        setGrowthOperationalCases(nextOperationalCases);
        setGrowthOperationalCaseAutoAssignmentSettings(
          nextAutoAssignmentSettings,
        );
        setGrowthOperationalCaseAutoAssignmentPolicy(
          nextAutoAssignmentSettings.defaultPolicyKey,
        );
      });
    } catch (error) {
      setGrowthError(
        error instanceof Error
          ? error.message
          : 'No se pudo refrescar el workspace operativo de Growth.',
      );
    } finally {
      setGrowthLoading(false);
    }
  }

  function resetGrowthWorkspacePolicy() {
    setGrowthChannelFilter('whatsapp');
    setGrowthAssigneeFilter('');
    setFirstResponseSlaHours('2');
    setFollowUpSlaHours('6');
    setStaleThreadHours('24');
  }

  async function toggleGrowthAlertAcknowledgement(
    alert: WhatsappOutboundReportingSummaryResponse['operationalAlerts'][number],
  ) {
    if (!token || !currentTenancy || !canManageGrowthConversations) {
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    const alreadyAcknowledged = growthAlertAcknowledgements.some(
      (acknowledgement) => acknowledgement.alertKey === alert.key,
    );

    setGrowthActionLoading(`ack-alert:${alert.key}`);
    setGrowthActionMessage(null);
    setGrowthError(null);

    try {
      if (alreadyAcknowledged) {
        await deleteWhatsappOperationalAlertAcknowledgement(
          token,
          tenantSlug,
          alert.key,
        );
      } else {
        await acknowledgeWhatsappOperationalAlert(token, tenantSlug, alert.key, {
          title: alert.title,
          severity: alert.severity,
          summary: alert.summary,
          provider: alert.provider,
          failureClass: alert.failureClass,
          providerTaxonomyFamily: alert.providerTaxonomyFamily,
          providerTaxonomyDetail: alert.providerTaxonomyDetail,
          affectedMessageCount: alert.affectedMessageCount,
          recommendedAction: alert.recommendedAction,
          lastSeenGeneratedAt: whatsappSummary?.generatedAt ?? null,
        });
      }

      const nextAcknowledgements =
        await fetchWhatsappOperationalAlertAcknowledgements(token, tenantSlug);
      setGrowthAlertAcknowledgements(nextAcknowledgements);
      await refreshGrowthFleet();
    } catch (error) {
      setGrowthError(
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar el acknowledgement operativo.',
      );
    } finally {
      setGrowthActionLoading(null);
    }
  }

  async function handleCreateGrowthOperationalCase(input: {
    tenantSlug: string;
    sourceKey: string;
    caseType: GrowthOperationalCaseResponse['caseType'];
    priority: GrowthOperationalCaseResponse['priority'];
    title: string;
    summary: string;
    nextAction: string;
    followUpState?:
      | 'pending_team'
      | 'scheduled'
      | 'waiting_customer'
      | null;
    threadId?: string | null;
    alertKey?: string | null;
    dueAt?: string | null;
  }) {
    if (!token || !canManageGrowthConversations) {
      return;
    }

    setGrowthActionLoading(`create-case:${input.sourceKey}`);
    setGrowthActionMessage(null);
    setGrowthError(null);

    try {
      await createGrowthOperationalCase(token, input.tenantSlug, input);
      await Promise.all([refreshGrowthWorkspace(), refreshGrowthFleet()]);
      setGrowthActionMessage('Caso operativo compartido actualizado.');
    } catch (error) {
      setGrowthError(
        error instanceof Error
          ? error.message
          : 'No se pudo crear el caso operativo.',
      );
    } finally {
      setGrowthActionLoading(null);
    }
  }

  async function handleTakeGrowthOperationalCase(
    tenantSlug: string,
    caseId: string,
  ) {
    if (!token || !canManageGrowthConversations) {
      return;
    }

    setGrowthActionLoading(`take-case:${caseId}`);
    setGrowthActionMessage(null);
    setGrowthError(null);

    try {
      await takeGrowthOperationalCase(token, tenantSlug, caseId);
      await Promise.all([refreshGrowthWorkspace(), refreshGrowthFleet()]);
      setGrowthActionMessage('Caso operativo tomado por el operador actual.');
    } catch (error) {
      setGrowthError(
        error instanceof Error
          ? error.message
          : 'No se pudo tomar el caso operativo.',
      );
    } finally {
      setGrowthActionLoading(null);
    }
  }

  async function handleResolveGrowthOperationalCase(
    tenantSlug: string,
    caseId: string,
  ) {
    if (!token || !canManageGrowthConversations) {
      return;
    }

    setGrowthActionLoading(`resolve-case:${caseId}`);
    setGrowthActionMessage(null);
    setGrowthError(null);

    try {
      await resolveGrowthOperationalCase(token, tenantSlug, caseId);
      await Promise.all([refreshGrowthWorkspace(), refreshGrowthFleet()]);
      setGrowthActionMessage('Caso operativo marcado como resuelto.');
    } catch (error) {
      setGrowthError(
        error instanceof Error
          ? error.message
          : 'No se pudo resolver el caso operativo.',
      );
    } finally {
      setGrowthActionLoading(null);
    }
  }

  async function handleReopenGrowthOperationalCase(
    tenantSlug: string,
    caseId: string,
  ) {
    if (!token || !canManageGrowthConversations) {
      return;
    }

    setGrowthActionLoading(`reopen-case:${caseId}`);
    setGrowthActionMessage(null);
    setGrowthError(null);

    try {
      await reopenGrowthOperationalCase(token, tenantSlug, caseId);
      await Promise.all([refreshGrowthWorkspace(), refreshGrowthFleet()]);
      setGrowthActionMessage('Caso operativo reabierto.');
    } catch (error) {
      setGrowthError(
        error instanceof Error
          ? error.message
          : 'No se pudo reabrir el caso operativo.',
      );
    } finally {
      setGrowthActionLoading(null);
    }
  }

  async function handleUpdateGrowthOperationalCaseFollowUpState(input: {
    tenantSlug: string;
    caseId: string;
    followUpState: 'pending_team' | 'scheduled' | 'waiting_customer';
    nextAction?: string | null;
    dueAt?: string | null;
  }) {
    if (!token || !canManageGrowthConversations) {
      return;
    }

    setGrowthActionLoading(`follow-up-case:${input.caseId}:${input.followUpState}`);
    setGrowthActionMessage(null);
    setGrowthError(null);

    try {
      await updateGrowthOperationalCaseFollowUpState(
        token,
        input.tenantSlug,
        input.caseId,
        {
          followUpState: input.followUpState,
          nextAction: input.nextAction ?? null,
          dueAt: input.dueAt,
        },
      );
      await Promise.all([refreshGrowthWorkspace(), refreshGrowthFleet()]);
      setGrowthActionMessage('Estado de follow-up actualizado.');
    } catch (error) {
      setGrowthError(
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar el estado de follow-up.',
      );
    } finally {
      setGrowthActionLoading(null);
    }
  }

  async function handleReviewGrowthOperationalCaseRouting(tenantSlug: string) {
    if (!token || !canManageGrowthConversations) {
      return;
    }

    setGrowthActionLoading(`review-routing:${tenantSlug}`);
    setGrowthActionMessage(null);
    setGrowthError(null);

    try {
      const result = await reviewGrowthOperationalCaseRouting(token, tenantSlug);
      await Promise.all([refreshGrowthWorkspace(), refreshGrowthFleet()]);
      setGrowthActionMessage(
        summarizeGrowthOperationalCaseRoutingReview(result),
      );
    } catch (error) {
      setGrowthError(
        error instanceof Error
          ? error.message
          : 'No se pudo revisar el routing de los casos operativos.',
      );
    } finally {
      setGrowthActionLoading(null);
    }
  }

  async function handleSaveGrowthOperationalCaseAutoAssignmentSettings() {
    if (!token || !currentTenancy || !canManageGrowthConversations) {
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    setGrowthActionLoading(`save-auto-assign-settings:${tenantSlug}`);
    setGrowthActionMessage(null);
    setGrowthError(null);

    try {
      const settings = await upsertGrowthOperationalCaseAutoAssignmentSettings(
        token,
        tenantSlug,
        {
          defaultPolicyKey: growthOperationalCaseAutoAssignmentPolicy,
        },
      );
      startTransition(() => {
        setGrowthOperationalCaseAutoAssignmentSettings(settings);
        setGrowthOperationalCaseAutoAssignmentPolicy(settings.defaultPolicyKey);
      });
      await refreshGrowthFleet();
      setGrowthActionMessage(
        `Pack por defecto guardado: ${describeGrowthOperationalCaseAutoAssignmentPolicy(
          settings.defaultPolicyKey,
        )}.`,
      );
    } catch (error) {
      setGrowthError(
        error instanceof Error
          ? error.message
          : 'No se pudo guardar el pack por defecto de auto-asignacion.',
      );
    } finally {
      setGrowthActionLoading(null);
    }
  }

  async function handleAutoAssignGrowthOperationalCases(
    tenantSlug: string,
    policyKey?: GrowthOperationalCaseAutoAssignmentPolicyKey,
  ) {
    if (!token || !canManageGrowthConversations) {
      return;
    }

    setGrowthActionLoading(`auto-assign:${tenantSlug}`);
    setGrowthActionMessage(null);
    setGrowthError(null);

    try {
      const result = await autoAssignGrowthOperationalCases(
        token,
        tenantSlug,
        policyKey ? { policyKey } : undefined,
      );
      await Promise.all([refreshGrowthWorkspace(), refreshGrowthFleet()]);
      setGrowthActionMessage(
        summarizeGrowthOperationalCaseAutoAssignment(result),
      );
    } catch (error) {
      setGrowthError(
        error instanceof Error
          ? error.message
          : 'No se pudo ejecutar la auto-asignacion operativa.',
      );
    } finally {
      setGrowthActionLoading(null);
    }
  }

  async function handleRunGrowthOperationalMonitor() {
    if (
      !token ||
      !currentTenancy ||
      !canManageGrowthConversations
    ) {
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    setGrowthActionLoading('run-monitor');
    setGrowthActionMessage(null);
    setGrowthError(null);

    try {
      const summary = await runWhatsappOperationalMonitor(token, tenantSlug, {
        autoRunReadyRetries: monitorAutoRunReadyRetries,
        retryReadyLimit: Number(monitorRetryReadyLimit) || null,
      });

      startTransition(() => {
        setWhatsappMonitorSummary(summary);
      });

      await refreshGrowthWorkspace();
      await refreshGrowthFleet();
      setGrowthActionMessage(
        summary.retryRunnerExecuted
          ? `Monitor ejecutado. Estado ${operationalStatusLabel(
              summary.overallStatus,
            ).toLowerCase()} y retries listos procesados.`
          : `Monitor ejecutado. Estado ${operationalStatusLabel(
              summary.overallStatus,
            ).toLowerCase()}.`,
      );
    } catch (error) {
      setGrowthError(
        error instanceof Error
          ? error.message
          : 'No se pudo ejecutar el monitor operativo de Growth.',
      );
    } finally {
      setGrowthActionLoading(null);
    }
  }

  async function handlePrepareAiSuggestionRun() {
    if (!token || !currentTenancy || !canReadGrowthConversations) {
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    setGrowthActionLoading('prepare-ai-suggestion-run');
    setGrowthActionMessage(null);
    setGrowthError(null);

    try {
      const record = await prepareTenantAiSuggestionRun(
        token,
        tenantSlug,
        'growth-assist-coach',
      );

      startTransition(() => {
        setGrowthAssistAiSuggestionRuns((current) => [
          record,
          ...current.filter((entry) => entry.id !== record.id),
        ]);
        setTenantAiSuggestionWorkspace((current) =>
          prependOrReplaceSuggestionRun(current, record),
        );
      });

      await refreshTenantAiOperationsConsole();

      setGrowthActionMessage(
        `Handoff auditable preparado con ${record.promptPackKey}@${record.promptPackVersion}.`,
      );
    } catch (error) {
      setGrowthError(
        error instanceof Error
          ? error.message
          : 'No se pudo preparar el handoff auditable de AI.',
      );
    } finally {
      setGrowthActionLoading(null);
    }
  }

  async function handleRequestAiSuggestionRunApproval(suggestionRunId: string) {
    if (!token || !currentTenancy || !canReadGrowthConversations) {
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    const actionKey = `request-ai-approval:${suggestionRunId}`;
    setGrowthActionLoading(actionKey);
    setGrowthActionMessage(null);
    setGrowthError(null);

    try {
      const record = await requestTenantAiSuggestionRunApproval(
        token,
        tenantSlug,
        'growth-assist-coach',
        suggestionRunId,
        {
          rationale:
            'Solicitar revision humana antes de tratar el handoff como aprobado.',
        },
      );

      startTransition(() => {
        setGrowthAssistAiApprovalRequests((current) =>
          syncApprovalRequestsWithFilter(
            current,
            record,
            growthAiApprovalStatusFilter,
          ),
        );
        setTenantAiApprovalWorkspace((current) =>
          syncApprovalRequestsWithFilter(
            current,
            record,
            tenantAiApprovalWorkspaceStatusFilter,
          ),
        );
        setGrowthAssistAiSuggestionRuns((current) =>
          bumpSuggestionRunApprovalToPending(current, record),
        );
        setTenantAiSuggestionWorkspace((current) =>
          bumpSuggestionRunApprovalToPending(current, record),
        );
        setSelectedTenantAiSuggestionWorkspaceDetail((current) =>
          current && current.id === record.suggestionRunId
            ? {
                ...current,
                approvalSummary: {
                  status: 'pending',
                  totalRequests: current.approvalSummary.totalRequests + 1,
                  latestRequestId: record.id,
                  latestPolicyKey: record.policyKey,
                  latestRequestedAt: record.createdAt,
                  latestReviewedAt: record.reviewedAt,
                },
                approvalRequests: prependOrReplaceApprovalRequest(
                  current.approvalRequests,
                  record,
                ),
              }
            : current,
        );
        setSelectedGrowthAiSuggestionRunDetail((current) =>
          current && current.id === record.suggestionRunId
            ? {
                ...current,
                approvalSummary: {
                  status: 'pending',
                  totalRequests: current.approvalSummary.totalRequests + 1,
                  latestRequestId: record.id,
                  latestPolicyKey: record.policyKey,
                  latestRequestedAt: record.createdAt,
                  latestReviewedAt: record.reviewedAt,
                },
                approvalRequests: prependOrReplaceApprovalRequest(
                  current.approvalRequests,
                  record,
                ),
              }
            : current,
        );
      });

      await refreshTenantAiOperationsConsole();

      setGrowthActionMessage(
        `Solicitud de aprobacion registrada bajo ${record.policyKey}.`,
      );
    } catch (error) {
      setGrowthError(
        error instanceof Error
          ? error.message
          : 'No se pudo pedir la aprobación del handoff de AI.',
      );
    } finally {
      setGrowthActionLoading(null);
    }
  }

  async function handleReviewAiApprovalRequest(
    requestId: string,
    status: 'approved' | 'rejected',
  ) {
    if (!token || !currentTenancy || !canReadGrowthConversations) {
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    const actionKey = `review-ai-approval:${requestId}`;
    setGrowthActionLoading(actionKey);
    setGrowthActionMessage(null);
    setGrowthError(null);

    try {
      const record = await reviewTenantAiApprovalRequest(
        token,
        tenantSlug,
        'growth-assist-coach',
        requestId,
        {
          status,
          reviewNote:
            status === 'approved'
              ? 'Aprobado desde la consola transversal de AI.'
              : 'Rechazado desde la consola transversal de AI.',
        },
      );

      startTransition(() => {
        setGrowthAssistAiApprovalRequests((current) =>
          syncApprovalRequestsWithFilter(
            current,
            record,
            growthAiApprovalStatusFilter,
          ),
        );
        setTenantAiApprovalWorkspace((current) =>
          syncApprovalRequestsWithFilter(
            current,
            record,
            tenantAiApprovalWorkspaceStatusFilter,
          ),
        );
        setGrowthAssistAiSuggestionRuns((current) =>
          applyReviewedApprovalToSuggestionRuns(current, record),
        );
        setTenantAiSuggestionWorkspace((current) =>
          applyReviewedApprovalToSuggestionRuns(current, record),
        );
        setSelectedTenantAiSuggestionWorkspaceDetail((current) =>
          current && current.id === record.suggestionRunId
            ? {
                ...current,
                approvalSummary: {
                  ...current.approvalSummary,
                  status: record.status,
                  latestReviewedAt: record.reviewedAt,
                },
                approvalRequests: prependOrReplaceApprovalRequest(
                  current.approvalRequests,
                  record,
                ),
              }
            : current,
        );
        setSelectedGrowthAiSuggestionRunDetail((current) =>
          current && current.id === record.suggestionRunId
            ? {
                ...current,
                approvalSummary: {
                  ...current.approvalSummary,
                  status: record.status,
                  latestReviewedAt: record.reviewedAt,
                },
                approvalRequests: prependOrReplaceApprovalRequest(
                  current.approvalRequests,
                  record,
                ),
              }
            : current,
        );
      });

      await refreshTenantAiOperationsConsole();

      setGrowthActionMessage(
        status === 'approved'
          ? 'Solicitud de aprobación marcada como aprobada.'
          : 'Solicitud de aprobación marcada como rechazada.',
      );
    } catch (error) {
      setGrowthError(
        error instanceof Error
          ? error.message
          : 'No se pudo revisar la solicitud de aprobación de AI.',
      );
    } finally {
      setGrowthActionLoading(null);
    }
  }

  async function handlePrepareInvoiceAiSuggestionRun() {
    if (!token || !currentTenancy || !canReadInvoicingReports) {
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    setActionLoading('prepare-invoice-ai-suggestion-run');
    setInvoicingActionMessage(null);
    setInvoicingError(null);

    try {
      const record = await prepareTenantAiSuggestionRun(
        token,
        tenantSlug,
        'invoice-document-assistant',
      );

      startTransition(() => {
        setInvoiceAssistantAiSuggestionRuns((current) => [
          record,
          ...current.filter((entry) => entry.id !== record.id),
        ]);
        setTenantAiSuggestionWorkspace((current) =>
          prependOrReplaceSuggestionRun(current, record),
        );
      });

      await refreshTenantAiOperationsConsole();

      setInvoicingActionMessage(
        `Handoff auditable preparado con ${record.promptPackKey}@${record.promptPackVersion}.`,
      );
    } catch (error) {
      setInvoicingError(
        error instanceof Error
          ? error.message
          : 'No se pudo preparar el handoff auditable de AI para invoicing.',
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRequestInvoiceAiSuggestionRunApproval(
    suggestionRunId: string,
  ) {
    if (!token || !currentTenancy || !canReadInvoicingReports) {
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    const actionKey = `request-invoice-ai-approval:${suggestionRunId}`;
    setActionLoading(actionKey);
    setInvoicingActionMessage(null);
    setInvoicingError(null);

    try {
      const record = await requestTenantAiSuggestionRunApproval(
        token,
        tenantSlug,
        'invoice-document-assistant',
        suggestionRunId,
        {
          rationale:
            'Solicitar revision humana antes de usar la sugerencia sobre documentos tributarios.',
        },
      );

      startTransition(() => {
        setInvoiceAssistantAiApprovalRequests((current) =>
          syncApprovalRequestsWithFilter(
            current,
            record,
            invoiceAiApprovalStatusFilter,
          ),
        );
        setTenantAiApprovalWorkspace((current) =>
          syncApprovalRequestsWithFilter(
            current,
            record,
            tenantAiApprovalWorkspaceStatusFilter,
          ),
        );
        setInvoiceAssistantAiSuggestionRuns((current) =>
          bumpSuggestionRunApprovalToPending(current, record),
        );
        setTenantAiSuggestionWorkspace((current) =>
          bumpSuggestionRunApprovalToPending(current, record),
        );
        setSelectedTenantAiSuggestionWorkspaceDetail((current) =>
          current && current.id === record.suggestionRunId
            ? {
                ...current,
                approvalSummary: {
                  status: 'pending',
                  totalRequests: current.approvalSummary.totalRequests + 1,
                  latestRequestId: record.id,
                  latestPolicyKey: record.policyKey,
                  latestRequestedAt: record.createdAt,
                  latestReviewedAt: record.reviewedAt,
                },
                approvalRequests: prependOrReplaceApprovalRequest(
                  current.approvalRequests,
                  record,
                ),
              }
            : current,
        );
        setSelectedInvoiceAiSuggestionRunDetail((current) =>
          current && current.id === record.suggestionRunId
            ? {
                ...current,
                approvalSummary: {
                  status: 'pending',
                  totalRequests: current.approvalSummary.totalRequests + 1,
                  latestRequestId: record.id,
                  latestPolicyKey: record.policyKey,
                  latestRequestedAt: record.createdAt,
                  latestReviewedAt: record.reviewedAt,
                },
                approvalRequests: prependOrReplaceApprovalRequest(
                  current.approvalRequests,
                  record,
                ),
              }
            : current,
        );
      });

      await refreshTenantAiOperationsConsole();

      setInvoicingActionMessage(
        `Solicitud de aprobacion registrada bajo ${record.policyKey}.`,
      );
    } catch (error) {
      setInvoicingError(
        error instanceof Error
          ? error.message
          : 'No se pudo pedir la aprobación del handoff de AI para invoicing.',
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReviewInvoiceAiApprovalRequest(
    requestId: string,
    status: 'approved' | 'rejected',
  ) {
    if (!token || !currentTenancy || !canReadInvoicingReports) {
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    const actionKey = `review-invoice-ai-approval:${requestId}`;
    setActionLoading(actionKey);
    setInvoicingActionMessage(null);
    setInvoicingError(null);

    try {
      const record = await reviewTenantAiApprovalRequest(
        token,
        tenantSlug,
        'invoice-document-assistant',
        requestId,
        {
          status,
          reviewNote:
            status === 'approved'
              ? 'Aprobado desde la consola transversal de AI para invoicing.'
              : 'Rechazado desde la consola transversal de AI para invoicing.',
        },
      );

      startTransition(() => {
        setInvoiceAssistantAiApprovalRequests((current) =>
          syncApprovalRequestsWithFilter(
            current,
            record,
            invoiceAiApprovalStatusFilter,
          ),
        );
        setTenantAiApprovalWorkspace((current) =>
          syncApprovalRequestsWithFilter(
            current,
            record,
            tenantAiApprovalWorkspaceStatusFilter,
          ),
        );
        setInvoiceAssistantAiSuggestionRuns((current) =>
          applyReviewedApprovalToSuggestionRuns(current, record),
        );
        setTenantAiSuggestionWorkspace((current) =>
          applyReviewedApprovalToSuggestionRuns(current, record),
        );
        setSelectedTenantAiSuggestionWorkspaceDetail((current) =>
          current && current.id === record.suggestionRunId
            ? {
                ...current,
                approvalSummary: {
                  ...current.approvalSummary,
                  status: record.status,
                  latestReviewedAt: record.reviewedAt,
                },
                approvalRequests: prependOrReplaceApprovalRequest(
                  current.approvalRequests,
                  record,
                ),
              }
            : current,
        );
        setSelectedInvoiceAiSuggestionRunDetail((current) =>
          current && current.id === record.suggestionRunId
            ? {
                ...current,
                approvalSummary: {
                  ...current.approvalSummary,
                  status: record.status,
                  latestReviewedAt: record.reviewedAt,
                },
                approvalRequests: prependOrReplaceApprovalRequest(
                  current.approvalRequests,
                  record,
                ),
              }
            : current,
        );
      });

      await refreshTenantAiOperationsConsole();

      setInvoicingActionMessage(
        status === 'approved'
          ? 'Solicitud de aprobación de invoicing marcada como aprobada.'
          : 'Solicitud de aprobación de invoicing marcada como rechazada.',
      );
    } catch (error) {
      setInvoicingError(
        error instanceof Error
          ? error.message
          : 'No se pudo revisar la aprobación del handoff de AI para invoicing.',
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleOpenGrowthAiSuggestionRunDetail(suggestionRunId: string) {
    if (!token || !currentTenancy || !canReadGrowthConversations) {
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    const actionKey = `load-ai-run-detail:${suggestionRunId}`;
    setGrowthActionLoading(actionKey);
    setGrowthActionMessage(null);
    setGrowthError(null);

    try {
      const detail = await fetchTenantAiSuggestionRunDetail(
        token,
        tenantSlug,
        'growth-assist-coach',
        suggestionRunId,
      );

      startTransition(() => {
        setSelectedGrowthAiSuggestionRunDetail(detail);
      });
    } catch (error) {
      setGrowthError(
        error instanceof Error
          ? error.message
          : 'No se pudo cargar el detalle del handoff de AI.',
      );
    } finally {
      setGrowthActionLoading(null);
    }
  }

  async function handleOpenInvoiceAiSuggestionRunDetail(suggestionRunId: string) {
    if (!token || !currentTenancy || !canReadInvoicingReports) {
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    const actionKey = `load-invoice-ai-run-detail:${suggestionRunId}`;
    setActionLoading(actionKey);
    setInvoicingActionMessage(null);
    setInvoicingError(null);

    try {
      const detail = await fetchTenantAiSuggestionRunDetail(
        token,
        tenantSlug,
        'invoice-document-assistant',
        suggestionRunId,
      );

      startTransition(() => {
        setSelectedInvoiceAiSuggestionRunDetail(detail);
      });
    } catch (error) {
      setInvoicingError(
        error instanceof Error
          ? error.message
          : 'No se pudo cargar el detalle del handoff de AI para invoicing.',
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleOpenTenantAiWorkspaceSuggestionRunDetail(
    suggestionRunId: string,
  ) {
    if (!token || !currentTenancy) {
      return;
    }

    const tenantSlug = currentTenancy.tenant.slug;
    const actionKey = `load-tenant-ai-run-detail:${suggestionRunId}`;
    setGrowthActionMessage(null);
    setInvoicingActionMessage(null);
    setGrowthError(null);
    setInvoicingError(null);
    setGrowthActionLoading(actionKey);

    try {
      const detail = await fetchTenantAiSuggestionWorkspaceDetail(
        token,
        tenantSlug,
        suggestionRunId,
      );

      startTransition(() => {
        setSelectedTenantAiSuggestionWorkspaceDetail(detail);
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo cargar el detalle transversal del handoff de AI.';

      if (growthWorkspaceAvailable) {
        setGrowthError(message);
      } else {
        setInvoicingError(message);
      }
    } finally {
      setGrowthActionLoading(null);
    }
  }

  async function handleReviewTenantAiApprovalWorkspaceRequest(
    agentKey: string,
    requestId: string,
    status: 'approved' | 'rejected',
  ) {
    if (agentKey === 'invoice-document-assistant') {
      await handleReviewInvoiceAiApprovalRequest(requestId, status);
      return;
    }

    await handleReviewAiApprovalRequest(requestId, status);
  }

  async function handleRequestTenantAiWorkspaceSuggestionRunApproval(
    agentKey: string,
    suggestionRunId: string,
  ) {
    if (agentKey === 'invoice-document-assistant') {
      await handleRequestInvoiceAiSuggestionRunApproval(suggestionRunId);
      return;
    }

    await handleRequestAiSuggestionRunApproval(suggestionRunId);
  }

  async function handleTokenSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextToken = tokenInput.trim();
    window.localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    setActionMessage(null);
    setGrowthActionMessage(null);
    setGrowthError(null);
    setWhatsappMonitorSummary(null);
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
    setGrowthActionMessage(null);
    setGrowthError(null);
    setGrowthWorkbench(null);
    setGrowthAssistAgenda(null);
    setAiAgentCatalog([]);
    setAiPromptRegistry([]);
    setAiApprovalPolicyRegistry([]);
    setAiToolRegistry([]);
    setGrowthAssistAiApprovalPolicies([]);
    setGrowthAssistAiApprovalRequests([]);
    setGrowthAssistAiToolAccess([]);
    setGrowthAssistAiEnvelope(null);
    setGrowthAssistAiSuggestionRuns([]);
    setSelectedGrowthAiSuggestionRunDetail(null);
    setSelectedInvoiceAiSuggestionRunDetail(null);
    setWhatsappSummary(null);
    setWhatsappMonitorSummary(null);
    setWhatsappMonitorAnalytics(null);
    setGrowthAlertAcknowledgements([]);
    setGrowthOperationalCases([]);
    setGrowthMonitorHistory([]);
    setGrowthFleetSnapshots([]);
    setGrowthFleetError(null);
    setGrowthFleetLoading(false);
    setSelectedGrowthFleetTenantSlug(null);
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

  async function handleSyncIssuerProfileTaxIdFromSignature() {
    if (!token || !currentTenancy || !invoicingEnabled) {
      return;
    }

    setActionLoading('sync-issuer-profile-tax-id');
    setInvoicingActionMessage(null);
    setInvoicingError(null);

    try {
      const profile = await syncIssuerProfileTaxIdFromSignature(
        token,
        currentTenancy.tenant.slug,
      );

      setIssuerTaxId(profile.taxId);
      setInvoicingActionMessage(
        'RUC del perfil fiscal alineado con el certificado.',
      );
      await refreshInvoicingWorkspace();
    } catch (error) {
      setInvoicingError(
        error instanceof Error
          ? error.message
          : 'No se pudo alinear el RUC del perfil fiscal con el certificado.',
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
        hydrateMetadataFromPkcs12:
          signatureProvider === 'xades_pkcs12'
            ? signatureHydrateMetadataFromPkcs12
            : undefined,
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
      (selectedInvoiceDetail.documentCode ?? '01') !== '01' ||
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

  async function handleCreateDebitNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const amountInCents = Number(newDebitNoteAmountInCents);

    if (
      !token ||
      !currentTenancy ||
      !invoicingEnabled ||
      !selectedInvoiceDetail ||
      (selectedInvoiceDetail.documentCode ?? '01') !== '01' ||
      !newDebitNoteReason.trim() ||
      !Number.isInteger(amountInCents) ||
      amountInCents < 1
    ) {
      return;
    }

    setActionLoading('create-debit-note');
    setInvoicingActionMessage(null);
    setInvoicingError(null);

    try {
      const debitNote = await createDebitNote(token, currentTenancy.tenant.slug, {
        sourceInvoiceId: selectedInvoiceDetail.id,
        reason: newDebitNoteReason.trim(),
        amountInCents,
        taxRateId: newDebitNoteTaxRateId.trim() || null,
        issuedAt: newDebitNoteIssuedAt.trim() || undefined,
        notes: newDebitNoteNotes.trim() || null,
      });

      setNewDebitNoteReason('Interes por mora de la factura origen.');
      setNewDebitNoteAmountInCents('2500');
      setNewDebitNoteIssuedAt('');
      setNewDebitNoteNotes('Nota de debito de prueba.');
      setNewDebitNoteTaxRateId('');
      setSelectedInvoiceId(debitNote.invoice.id);
      setInvoicingActionMessage(
        `Nota de debito ${debitNote.invoice.number} creada desde ${selectedInvoiceDetail.number}.`,
      );
      await refreshInvoicingWorkspace({ selectInvoiceId: debitNote.invoice.id });
    } catch (error) {
      setInvoicingError(
        error instanceof Error ? error.message : 'No se pudo crear la nota de debito.',
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCreateWithholding(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const amountInCents = Number(newWithholdingAmountInCents);

    if (
      !token ||
      !currentTenancy ||
      !invoicingEnabled ||
      !selectedInvoiceDetail ||
      (selectedInvoiceDetail.documentCode ?? '01') !== '01' ||
      !newWithholdingReason.trim() ||
      !Number.isInteger(amountInCents) ||
      amountInCents < 1
    ) {
      return;
    }

    setActionLoading('create-withholding');
    setInvoicingActionMessage(null);
    setInvoicingError(null);

    try {
      const withholding: WithholdingResponse = await createWithholding(
        token,
        currentTenancy.tenant.slug,
        {
          sourceInvoiceId: selectedInvoiceDetail.id,
          reason: newWithholdingReason.trim(),
          amountInCents,
          taxRateId: newWithholdingTaxRateId.trim() || null,
          issuedAt: newWithholdingIssuedAt.trim() || undefined,
          notes: newWithholdingNotes.trim() || null,
        },
      );

      setNewWithholdingReason('Retencion sobre la factura origen.');
      setNewWithholdingAmountInCents('1000');
      setNewWithholdingIssuedAt('');
      setNewWithholdingNotes('Comprobante de retencion de prueba.');
      setNewWithholdingTaxRateId('');
      setSelectedInvoiceId(withholding.invoice.id);
      setInvoicingActionMessage(
        `Comprobante de retencion ${withholding.invoice.number} creado desde ${selectedInvoiceDetail.number}.`,
      );
      await refreshInvoicingWorkspace({ selectInvoiceId: withholding.invoice.id });
    } catch (error) {
      setInvoicingError(
        error instanceof Error
          ? error.message
          : 'No se pudo crear el comprobante de retencion.',
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCreateRemissionGuide(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !token ||
      !currentTenancy ||
      !invoicingEnabled ||
      !selectedInvoiceDetail ||
      (selectedInvoiceDetail.documentCode ?? '01') !== '01' ||
      !newRemissionGuideReason.trim() ||
      !newRemissionGuideStartAt.trim() ||
      !newRemissionGuideEndAt.trim() ||
      !newRemissionGuideDepartureAddress.trim() ||
      !newRemissionGuideArrivalAddress.trim() ||
      !newRemissionGuideCarrierName.trim() ||
      !newRemissionGuideCarrierIdentification.trim() ||
      !newRemissionGuideVehiclePlate.trim()
    ) {
      return;
    }

    if (
      new Date(newRemissionGuideEndAt).getTime() <
      new Date(newRemissionGuideStartAt).getTime()
    ) {
      setInvoicingError(
        'La fecha fin de traslado debe ser igual o posterior a la fecha de inicio.',
      );
      return;
    }

    setActionLoading('create-remission-guide');
    setInvoicingActionMessage(null);
    setInvoicingError(null);

    try {
      const remissionGuide: RemissionGuideResponse = await createRemissionGuide(
        token,
        currentTenancy.tenant.slug,
        {
          sourceInvoiceId: selectedInvoiceDetail.id,
          shipmentReason: newRemissionGuideReason.trim(),
          shipmentStartAt: newRemissionGuideStartAt,
          shipmentEndAt: newRemissionGuideEndAt,
          departureAddress: newRemissionGuideDepartureAddress.trim(),
          arrivalAddress: newRemissionGuideArrivalAddress.trim(),
          carrierName: newRemissionGuideCarrierName.trim(),
          carrierIdentificationType:
            newRemissionGuideCarrierIdentificationType,
          carrierIdentification:
            newRemissionGuideCarrierIdentification.trim(),
          vehiclePlate: newRemissionGuideVehiclePlate.trim().toUpperCase(),
          destinationRoute: newRemissionGuideRoute.trim() || null,
          issuedAt: newRemissionGuideIssuedAt.trim() || undefined,
          notes: newRemissionGuideNotes.trim() || null,
        },
      );

      setNewRemissionGuideReason('Traslado de mercaderia al cliente.');
      setNewRemissionGuideStartAt('');
      setNewRemissionGuideEndAt('');
      setNewRemissionGuideDepartureAddress('Sucursal Matriz');
      setNewRemissionGuideArrivalAddress('Bodega del cliente');
      setNewRemissionGuideCarrierName('Transportes Demo S.A.');
      setNewRemissionGuideCarrierIdentificationType('04');
      setNewRemissionGuideCarrierIdentification('1790012345001');
      setNewRemissionGuideVehiclePlate('ABC-1234');
      setNewRemissionGuideRoute('Matriz - Cliente');
      setNewRemissionGuideIssuedAt('');
      setNewRemissionGuideNotes('Guia de remision de prueba.');
      setSelectedInvoiceId(remissionGuide.invoice.id);
      setInvoicingActionMessage(
        `Guia de remision ${remissionGuide.invoice.number} creada desde ${selectedInvoiceDetail.number}.`,
      );
      await refreshInvoicingWorkspace({
        selectInvoiceId: remissionGuide.invoice.id,
      });
    } catch (error) {
      setInvoicingError(
        error instanceof Error
          ? error.message
          : 'No se pudo crear la guia de remision.',
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
              <span className={styles.label}>Growth & Conversations platform</span>
              <h2>Consumer operativo de workbench, alertas y monitor</h2>
            </div>
            {session && growthWorkspaceFleetAvailable ? (
              <div className={styles.inlineActionRow}>
                <button
                  className={styles.ghostButton}
                  disabled={growthFleetLoading}
                  onClick={() => void refreshGrowthFleet()}
                  type="button"
                >
                  {growthFleetLoading ? 'Refrescando fleet...' : 'Refrescar fleet'}
                </button>
                {currentTenancy && growthWorkspaceAvailable ? (
                  <button
                    className={styles.ghostButton}
                    disabled={growthLoading || growthActionLoading !== null}
                    onClick={() => void refreshGrowthWorkspace()}
                    type="button"
                  >
                    {growthLoading ? 'Refrescando...' : 'Refrescar tenant actual'}
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>

          {!session ? (
            <div className={styles.emptyState}>
              <p>Primero carguemos la sesion para abrir la consola operativa de Growth.</p>
            </div>
          ) : !growthWorkspaceFleetAvailable ? (
            <div className={styles.emptyState}>
              <p>
                Esta sesion no expone <code>growth.conversations.read</code> en ninguna
                tenancy accesible, asi que todavia no podemos abrir la consola
                operativa dedicada.
              </p>
            </div>
          ) : (
            <div className={styles.stack}>
              {growthError ? <p className={styles.errorBanner}>{growthError}</p> : null}
              {growthFleetError ? (
                <p className={styles.errorBanner}>{growthFleetError}</p>
              ) : null}
              {growthActionMessage ? (
                <p className={styles.successBanner}>{growthActionMessage}</p>
              ) : null}
              {currentTenancy && growthWorkspaceAvailable ? (
                <div className={styles.stack}>
                  {effectiveGrowthAssistSummary ? (
                    <div className={styles.assistBrief}>
                      <div className={styles.sectionHeading}>
                        <div>
                          <span className={styles.label}>Growth Assist</span>
                          <h3>Agenda guiada para el negocio</h3>
                        </div>
                        <span
                          className={`${styles.statusPill} ${operationalStatusTone(
                            effectiveGrowthAssistSummary.tone,
                          )}`}
                        >
                          {operationalStatusLabel(effectiveGrowthAssistSummary.tone)}
                        </span>
                      </div>
                      <p>{effectiveGrowthAssistSummary.headline}</p>
                      <small>{effectiveGrowthAssistSummary.detail}</small>

                      <div className={styles.invoiceKpiGrid}>
                        <div className={styles.commercialCard}>
                          <span className={styles.muted}>Responder hoy</span>
                          <strong>{effectiveGrowthAssistSummary.replyNowCount}</strong>
                          <small>Conversaciones sin primera respuesta a tiempo</small>
                        </div>
                        <div className={styles.commercialCard}>
                          <span className={styles.muted}>Seguimientos del equipo</span>
                          <strong>{effectiveGrowthAssistSummary.followUpNowCount}</strong>
                          <small>Casos o threads que no conviene dejar enfriar</small>
                        </div>
                        <div className={styles.commercialCard}>
                          <span className={styles.muted}>Esperando cliente</span>
                          <strong>{effectiveGrowthAssistSummary.waitingCustomerCount}</strong>
                          <small>Seguimientos que solo piden vigilancia y timing</small>
                        </div>
                        <div className={styles.commercialCard}>
                          <span className={styles.muted}>Ordenar cola</span>
                          <strong>{effectiveGrowthAssistSummary.queueToOrganizeCount}</strong>
                          <small>
                            Trabajo sin owner claro o ya escalado para revision
                          </small>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div className={styles.twoColumn}>
                    <div className={styles.detailCard}>
                      <div className={styles.sectionHeading}>
                        <div>
                          <span className={styles.label}>AI Capability Platform</span>
                          <h3>Handoff transversal listo para suggestion mode</h3>
                        </div>
                        {activeGrowthAiAgent ? (
                          <span
                            className={`${styles.statusPill} ${aiAgentAvailabilityTone(
                              activeGrowthAiAgent.availability,
                            )}`}
                          >
                            {aiAgentAvailabilityLabel(activeGrowthAiAgent.availability)}
                          </span>
                        ) : null}
                      </div>

                      {growthAssistAiEnvelope ? (
                        <div className={styles.stack}>
                          <p className={styles.muted}>
                            <strong>{growthAssistAiEnvelope.agent.title}</strong> ya
                            vive como capa transversal separada de Growth. El
                            workspace solo le entrega un contrato determinístico y el
                            agente queda restringido a modo sugerencia.
                          </p>
                          <div className={styles.badgeRow}>
                            <span className={styles.badge}>
                              Surface {growthAssistAiEnvelope.surface.key}
                            </span>
                            <span className={styles.badge}>
                              Prompt pack {growthAssistAiEnvelope.promptPack.key}
                            </span>
                            <span className={styles.badge}>
                              Mode {growthAssistAiEnvelope.mode}
                            </span>
                          </div>
                          <div className={styles.assistReplyBox}>
                            <span className={styles.muted}>Objetivo del agente</span>
                            <strong>{growthAssistAiEnvelope.promptPack.objective}</strong>
                          </div>
                          {activeGrowthAiPromptPack ? (
                            <div className={styles.assistReplyBox}>
                              <span className={styles.muted}>Prompt pack transversal</span>
                              <strong>
                                {activeGrowthAiPromptPack.title} ·{' '}
                                {activeGrowthAiPromptPack.version}
                              </strong>
                            </div>
                          ) : null}
                          <div className={styles.assistChecklist}>
                            {growthAssistAiEnvelope.promptPack.suggestedOutputs.map(
                              (entry) => (
                                <span className={styles.badge} key={entry.key}>
                                  {entry.label}
                                </span>
                              ),
                            )}
                          </div>
                          <div className={styles.assistChecklist}>
                            {growthAssistAiEnvelope.promptPack.styleGuidance.map(
                              (entry) => (
                                <span className={styles.badge} key={entry}>
                                  {entry}
                                </span>
                              ),
                            )}
                          </div>
                          {activeGrowthAiApprovalPolicies.length > 0 ? (
                            <div className={styles.stack}>
                              <span className={styles.muted}>
                                Approval flow · {activeGrowthAiApprovalPolicies.length}{' '}
                                política
                                {activeGrowthAiApprovalPolicies.length === 1
                                  ? ''
                                  : 's'}{' '}
                                activa
                                {activeGrowthAiApprovalPolicies.length === 1
                                  ? ''
                                  : 's'}
                              </span>
                              {activeGrowthAiApprovalPolicies.map((entry) => (
                                <div
                                  className={styles.assistCueCard}
                                  key={entry.policyKey}
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
                                  <div className={styles.assistChecklist}>
                                    <span className={styles.badge}>
                                      {entry.policyKey}
                                    </span>
                                    <span className={styles.badge}>
                                      {entry.approvalRequired
                                        ? 'human approval required'
                                        : 'no approval required'}
                                    </span>
                                  </div>
                                  <small>{entry.reviewGuidance}</small>
                                </div>
                              ))}
                            </div>
                          ) : null}
                          {activeGrowthAiToolAccess.length > 0 ? (
                            <div className={styles.stack}>
                              <span className={styles.muted}>
                                Tool access model · {activeGrowthAiToolAccess.length}{' '}
                                tools declaradas
                              </span>
                              {activeGrowthAiToolAccess.map((entry) => (
                                <div
                                  className={styles.assistCueCard}
                                  key={entry.tool.key}
                                >
                                  <div className={styles.invoiceCardHeader}>
                                    <strong>{entry.tool.title}</strong>
                                    <span
                                      className={`${styles.statusPill} ${
                                        entry.accessLevel === 'allowed'
                                          ? styles.statusHealthy
                                          : entry.accessLevel ===
                                              'approval_required'
                                            ? styles.statusWarning
                                            : styles.statusCritical
                                      }`}
                                    >
                                      {humanizeKey(entry.accessLevel)}
                                    </span>
                                  </div>
                                  <small>{entry.tool.summary}</small>
                                  <div className={styles.assistChecklist}>
                                    <span className={styles.badge}>
                                      {entry.tool.actionKind}
                                    </span>
                                    <span className={styles.badge}>
                                      risk {entry.tool.riskLevel}
                                    </span>
                                    <span className={styles.badge}>
                                      {entry.tool.availability}
                                    </span>
                                    <span className={styles.badge}>
                                      {entry.tool.requiresApproval
                                        ? 'requires approval'
                                        : 'no approval'}
                                    </span>
                                    <span className={styles.badge}>
                                      {humanizeKey(
                                        entry.tool.executionBoundary.executionMode,
                                      )}
                                    </span>
                                  </div>
                                  <small>
                                    <strong>Entrada:</strong>{' '}
                                    {entry.tool.inputContract.primaryPayload}
                                  </small>
                                  <div className={styles.assistChecklist}>
                                    {entry.tool.inputContract.sourceSurfaceKeys.map(
                                      (surfaceKey) => (
                                        <span
                                          className={styles.badge}
                                          key={`${entry.tool.key}:${surfaceKey}`}
                                        >
                                          {surfaceKey}
                                        </span>
                                      ),
                                    )}
                                  </div>
                                  <small>
                                    <strong>Salida:</strong>{' '}
                                    {entry.tool.outputContract.primaryArtifact}
                                  </small>
                                  <div className={styles.assistChecklist}>
                                    {entry.tool.outputContract.suggestedOutputKeys.map(
                                      (outputKey) => (
                                        <span
                                          className={styles.badge}
                                          key={`${entry.tool.key}:${outputKey}`}
                                        >
                                          {outputKey}
                                        </span>
                                      ),
                                    )}
                                  </div>
                                  <small>
                                    <strong>Boundary:</strong>{' '}
                                    {entry.tool.executionBoundary.reviewRequirement}
                                  </small>
                                  {entry.tool.executionBoundary.blockedCapabilities
                                    .length > 0 ? (
                                    <div className={styles.assistChecklist}>
                                      {entry.tool.executionBoundary.blockedCapabilities.map(
                                        (capability) => (
                                          <span
                                            className={styles.badge}
                                            key={`${entry.tool.key}:${capability}`}
                                          >
                                            blocked: {capability}
                                          </span>
                                        ),
                                      )}
                                    </div>
                                  ) : null}
                                  <small>{entry.rationale}</small>
                                </div>
                              ))}
                              {aiToolRegistry.length > 0 ? (
                                <small className={styles.muted}>
                                  Registro transversal disponible: {aiToolRegistry.length}{' '}
                                  tools en total.
                                </small>
                              ) : null}
                            </div>
                          ) : null}
                          <div className={styles.inlineActions}>
                            <button
                              className={styles.secondaryButton}
                              type="button"
                              onClick={() => {
                                void handlePrepareAiSuggestionRun();
                              }}
                              disabled={
                                growthActionLoading === 'prepare-ai-suggestion-run'
                              }
                            >
                              {growthActionLoading === 'prepare-ai-suggestion-run'
                                ? 'Preparando handoff...'
                                : 'Registrar handoff auditable'}
                            </button>
                          </div>
                          <div className={styles.stack}>
                            <span className={styles.muted}>
                              AI operations summary
                            </span>
                            <div className={styles.commercialMetricsGrid}>
                              <div className={styles.commercialCard}>
                                <span className={styles.muted}>
                                  Approvals totales
                                </span>
                                <strong>
                                  {tenantAiOperationsSummary?.approvalWorkspace
                                    .counts.totalApprovalRequests ?? 0}
                                </strong>
                                <small>
                                  Solicitudes humanas acumuladas en los agentes AI
                                  disponibles.
                                </small>
                              </div>
                              <div className={styles.commercialCard}>
                                <span className={styles.muted}>
                                  Handoffs totales
                                </span>
                                <strong>
                                  {tenantAiOperationsSummary?.handoffWorkspace
                                    .counts.totalSuggestionRuns ?? 0}
                                </strong>
                                <small>
                                  Runs auditable preparados para Growth e
                                  Invoicing.
                                </small>
                              </div>
                              <div className={styles.commercialCard}>
                                <span className={styles.muted}>
                                  Pendientes de review
                                </span>
                                <strong>
                                  {tenantAiOperationsSummary?.actionCenter.counts
                                    .pendingApprovalRequests ?? 0}
                                </strong>
                                <small>
                                  Aprobaciones humanas esperando una decision.
                                </small>
                              </div>
                              <div className={styles.commercialCard}>
                                <span className={styles.muted}>
                                  Listos para escalar
                                </span>
                                <strong>
                                  {tenantAiOperationsSummary?.actionCenter.counts
                                    .reviewableSuggestionRuns ?? 0}
                                </strong>
                                <small>
                                  Handoffs listos para pedir revision humana.
                                </small>
                              </div>
                            </div>
                            {tenantAiOperationsSummary?.approvalWorkspace
                              .oldestPendingApprovalRequest ? (
                              <div className={styles.assistCueCard}>
                                <strong>Cola prioritaria</strong>
                                <small>
                                  {
                                    tenantAiOperationsSummary.approvalWorkspace
                                      .oldestPendingApprovalRequest.summary
                                  }
                                </small>
                                <small>
                                  Pendiente desde{' '}
                                  {formatDate(
                                    tenantAiOperationsSummary.approvalWorkspace
                                      .oldestPendingApprovalRequest.createdAt,
                                  )}
                                </small>
                              </div>
                            ) : null}
                            {tenantAiOperationsSummary?.handoffWorkspace
                              .latestSuggestionRun ? (
                              <div className={styles.assistCueCard}>
                                <strong>Ultimo handoff generado</strong>
                                <small>
                                  {
                                    tenantAiOperationsSummary.handoffWorkspace
                                      .latestSuggestionRun.summary
                                  }
                                </small>
                                <small>
                                  Generado{' '}
                                  {formatDate(
                                    tenantAiOperationsSummary.handoffWorkspace
                                      .latestSuggestionRun.createdAt,
                                  )}{' '}
                                  ·{' '}
                                  {aiAgentCatalogByKey.get(
                                    tenantAiOperationsSummary.handoffWorkspace
                                      .latestSuggestionRun.agentKey,
                                  )?.title ??
                                    fallbackAiAgentTitle(
                                      tenantAiOperationsSummary.handoffWorkspace
                                        .latestSuggestionRun.agentKey,
                                    )}
                                </small>
                              </div>
                            ) : null}
                            {tenantAiOperationsSummaryLoading &&
                            !tenantAiOperationsSummary ? (
                              <small className={styles.muted}>
                                Cargando operations summary transversal...
                              </small>
                            ) : null}
                          </div>
                          <div className={styles.stack}>
                            <span className={styles.muted}>
                              AI action center
                            </span>
                            <div className={styles.commercialMetricsGrid}>
                              <div className={styles.commercialCard}>
                                <span className={styles.muted}>
                                  Pendientes de review
                                </span>
                                <strong>
                                  {tenantAiOperationsSummary?.actionCenter.counts
                                    .pendingApprovalRequests ?? 0}
                                </strong>
                                <small>
                                  Approvals humanas que todavía piden decisión.
                                </small>
                              </div>
                              <div className={styles.commercialCard}>
                                <span className={styles.muted}>
                                  Listos para pedir review
                                </span>
                                <strong>
                                  {tenantAiOperationsSummary?.actionCenter.counts
                                    .reviewableSuggestionRuns ?? 0}
                                </strong>
                                <small>
                                  Handoffs preparados que aún no escalan a
                                  revisión humana.
                                </small>
                              </div>
                              <div className={styles.commercialCard}>
                                <span className={styles.muted}>
                                  Decisiones recientes
                                </span>
                                <strong>
                                  {tenantAiOperationsSummary?.actionCenter.counts
                                    .reviewedApprovalRequests ?? 0}
                                </strong>
                                <small>
                                  Reviews ya resueltas para cerrar el loop
                                  operativo.
                                </small>
                              </div>
                            </div>
                            {featuredTenantAiPendingApproval ? (
                              <div className={styles.assistCueCard}>
                                <div className={styles.invoiceCardHeader}>
                                  <strong>Atender ahora</strong>
                                  <span
                                    className={`${styles.statusPill} ${styles.statusWarning}`}
                                  >
                                    {
                                      aiAgentCatalogByKey.get(
                                        featuredTenantAiPendingApproval.agentKey,
                                      )?.title ??
                                        fallbackAiAgentTitle(
                                          featuredTenantAiPendingApproval.agentKey,
                                        )
                                    }
                                  </span>
                                </div>
                                <small>
                                  {featuredTenantAiPendingApproval.summary}
                                </small>
                                <small>
                                  Solicitada{' '}
                                  {formatDate(
                                    featuredTenantAiPendingApproval.createdAt,
                                  )}
                                </small>
                                <div className={styles.inlineActions}>
                                  <button
                                    className={styles.ghostButton}
                                    type="button"
                                    onClick={() => {
                                      void handleOpenTenantAiWorkspaceSuggestionRunDetail(
                                        featuredTenantAiPendingApproval.suggestionRunId,
                                      );
                                    }}
                                    disabled={
                                      growthActionLoading ===
                                      `load-tenant-ai-run-detail:${featuredTenantAiPendingApproval.suggestionRunId}`
                                    }
                                  >
                                    {growthActionLoading ===
                                    `load-tenant-ai-run-detail:${featuredTenantAiPendingApproval.suggestionRunId}`
                                      ? 'Cargando detalle...'
                                      : 'Abrir handoff'}
                                  </button>
                                  <button
                                    className={styles.secondaryButton}
                                    type="button"
                                    onClick={() => {
                                      void handleReviewTenantAiApprovalWorkspaceRequest(
                                        featuredTenantAiPendingApproval.agentKey,
                                        featuredTenantAiPendingApproval.id,
                                        'approved',
                                      );
                                    }}
                                    disabled={
                                      (featuredTenantAiPendingApproval.agentKey ===
                                      'invoice-document-assistant'
                                        ? actionLoading
                                        : growthActionLoading) ===
                                      (featuredTenantAiPendingApproval.agentKey ===
                                      'invoice-document-assistant'
                                        ? `review-invoice-ai-approval:${featuredTenantAiPendingApproval.id}`
                                        : `review-ai-approval:${featuredTenantAiPendingApproval.id}`)
                                    }
                                  >
                                    Aprobar
                                  </button>
                                  <button
                                    className={styles.ghostButton}
                                    type="button"
                                    onClick={() => {
                                      void handleReviewTenantAiApprovalWorkspaceRequest(
                                        featuredTenantAiPendingApproval.agentKey,
                                        featuredTenantAiPendingApproval.id,
                                        'rejected',
                                      );
                                    }}
                                    disabled={
                                      (featuredTenantAiPendingApproval.agentKey ===
                                      'invoice-document-assistant'
                                        ? actionLoading
                                        : growthActionLoading) ===
                                      (featuredTenantAiPendingApproval.agentKey ===
                                      'invoice-document-assistant'
                                        ? `review-invoice-ai-approval:${featuredTenantAiPendingApproval.id}`
                                        : `review-ai-approval:${featuredTenantAiPendingApproval.id}`)
                                    }
                                  >
                                    Rechazar
                                  </button>
                                </div>
                              </div>
                            ) : null}
                            {featuredTenantAiReviewableSuggestionRun ? (
                              <div className={styles.assistCueCard}>
                                <div className={styles.invoiceCardHeader}>
                                  <strong>Siguiente handoff para escalar</strong>
                                  <span className={styles.statusPill}>
                                    {
                                      aiAgentCatalogByKey.get(
                                        featuredTenantAiReviewableSuggestionRun.agentKey,
                                      )?.title ??
                                        fallbackAiAgentTitle(
                                          featuredTenantAiReviewableSuggestionRun.agentKey,
                                        )
                                    }
                                  </span>
                                </div>
                                <small>
                                  {featuredTenantAiReviewableSuggestionRun.summary}
                                </small>
                                <small>
                                  Estado actual:{' '}
                                  {humanizeKey(
                                    featuredTenantAiReviewableSuggestionRun
                                      .approvalSummary.status,
                                  )}
                                </small>
                                <div className={styles.inlineActions}>
                                  <button
                                    className={styles.ghostButton}
                                    type="button"
                                    onClick={() => {
                                      void handleOpenTenantAiWorkspaceSuggestionRunDetail(
                                        featuredTenantAiReviewableSuggestionRun.id,
                                      );
                                    }}
                                    disabled={
                                      growthActionLoading ===
                                      `load-tenant-ai-run-detail:${featuredTenantAiReviewableSuggestionRun.id}`
                                    }
                                  >
                                    {growthActionLoading ===
                                    `load-tenant-ai-run-detail:${featuredTenantAiReviewableSuggestionRun.id}`
                                      ? 'Cargando detalle...'
                                      : 'Abrir handoff'}
                                  </button>
                                  <button
                                    className={styles.secondaryButton}
                                    type="button"
                                    onClick={() => {
                                      void handleRequestTenantAiWorkspaceSuggestionRunApproval(
                                        featuredTenantAiReviewableSuggestionRun.agentKey,
                                        featuredTenantAiReviewableSuggestionRun.id,
                                      );
                                    }}
                                    disabled={
                                      (featuredTenantAiReviewableSuggestionRun.agentKey ===
                                      'invoice-document-assistant'
                                        ? actionLoading
                                        : growthActionLoading) ===
                                      (featuredTenantAiReviewableSuggestionRun.agentKey ===
                                      'invoice-document-assistant'
                                        ? `request-invoice-ai-approval:${featuredTenantAiReviewableSuggestionRun.id}`
                                        : `request-ai-approval:${featuredTenantAiReviewableSuggestionRun.id}`)
                                    }
                                  >
                                    Pedir revisión humana
                                  </button>
                                </div>
                              </div>
                            ) : null}
                            {latestTenantAiReviewedApproval ? (
                              <div className={styles.assistCueCard}>
                                <div className={styles.invoiceCardHeader}>
                                  <strong>Última decisión registrada</strong>
                                  <span
                                    className={`${styles.statusPill} ${
                                      latestTenantAiReviewedApproval.status ===
                                      'approved'
                                        ? styles.statusHealthy
                                        : styles.statusCritical
                                    }`}
                                  >
                                    {humanizeKey(
                                      latestTenantAiReviewedApproval.status,
                                    )}
                                  </span>
                                </div>
                                <small>
                                  {latestTenantAiReviewedApproval.summary}
                                </small>
                                <small>
                                  Revisada{' '}
                                  {formatDate(
                                    latestTenantAiReviewedApproval.reviewedAt,
                                  )}{' '}
                                  por{' '}
                                  {latestTenantAiReviewedApproval.reviewedByEmail ??
                                    latestTenantAiReviewedApproval.reviewedByUserId ??
                                    'sin reviewer'}
                                </small>
                              </div>
                            ) : null}
                            {tenantAiOperationsSummaryLoading &&
                            !tenantAiOperationsSummary ? (
                              <small className={styles.muted}>
                                Cargando action center transversal...
                              </small>
                            ) : null}
                          </div>
                          <div className={styles.stack}>
                            <span className={styles.muted}>
                              Handoff workspace transversal
                            </span>
                            <div className={styles.commercialMetricsGrid}>
                              <div className={styles.commercialCard}>
                                <span className={styles.muted}>
                                  Handoffs recientes
                                </span>
                                <strong>
                                  {tenantAiHandoffWorkspaceSummary?.counts
                                    .totalSuggestionRuns ?? 0}
                                </strong>
                                <small>
                                  Runs sugeridos visibles en el workspace
                                  transversal.
                                </small>
                              </div>
                              <div className={styles.commercialCard}>
                                <span className={styles.muted}>
                                  Listos para escalar
                                </span>
                                <strong>
                                  {tenantAiHandoffWorkspaceSummary?.counts
                                    .reviewableSuggestionRuns ?? 0}
                                </strong>
                                <small>
                                  Handoffs que todavia pueden pedir revision
                                  humana.
                                </small>
                              </div>
                              <div className={styles.commercialCard}>
                                <span className={styles.muted}>
                                  Pendientes de aprobacion
                                </span>
                                <strong>
                                  {tenantAiHandoffWorkspaceSummary?.counts
                                    .pendingApprovalSuggestionRuns ?? 0}
                                </strong>
                                <small>
                                  Runs que ya fueron escalados y siguen esperando
                                  decision.
                                </small>
                              </div>
                            </div>
                            <div className={styles.inlineActions}>
                              {tenantAiSuggestionWorkspaceAgentOptions.map(
                                ({ key, label, count }) => (
                                  <button
                                    key={key}
                                    className={
                                      tenantAiSuggestionWorkspaceAgentFilter === key
                                        ? styles.secondaryButton
                                        : styles.ghostButton
                                    }
                                    type="button"
                                    onClick={() => {
                                      setTenantAiSuggestionWorkspaceAgentFilter(key);
                                    }}
                                  >
                                    {label} ({count})
                                  </button>
                                ),
                              )}
                            </div>
                            {tenantAiHandoffWorkspaceSummary?.agentBreakdown.length ? (
                              <div className={styles.assistChecklist}>
                                {tenantAiHandoffWorkspaceSummary.agentBreakdown.map(
                                  (entry) => (
                                    <span
                                      className={styles.badge}
                                      key={entry.agentKey}
                                    >
                                      {entry.title}: {entry.totalSuggestionRuns}{' '}
                                      total / {entry.reviewableSuggestionRuns}{' '}
                                      listos /{' '}
                                      {entry.pendingApprovalSuggestionRuns}{' '}
                                      pendientes
                                    </span>
                                  ),
                                )}
                              </div>
                            ) : null}
                            {visibleTenantAiSuggestionWorkspace.length > 0 ? (
                              visibleTenantAiSuggestionWorkspace
                                .slice(0, 4)
                                .map((entry) => {
                                  const agentTitle =
                                    aiAgentCatalogByKey.get(entry.agentKey)?.title ??
                                    fallbackAiAgentTitle(entry.agentKey);
                                  const isInvoiceAgent =
                                    entry.agentKey === 'invoice-document-assistant';
                                  const actionKey = isInvoiceAgent
                                    ? `request-invoice-ai-approval:${entry.id}`
                                    : `request-ai-approval:${entry.id}`;
                                  const loadActionKey =
                                    `load-tenant-ai-run-detail:${entry.id}`;
                                  const canRequestHumanReview =
                                    entry.approvalSummary.status ===
                                      'not_requested' ||
                                    entry.approvalSummary.status === 'rejected';

                                  return (
                                    <div
                                      className={styles.assistCueCard}
                                      key={entry.id}
                                    >
                                      <div className={styles.invoiceCardHeader}>
                                        <strong>{entry.summary}</strong>
                                        <span className={styles.statusPill}>
                                          {agentTitle}
                                        </span>
                                      </div>
                                      <small>
                                        {formatDate(entry.createdAt)} ·{' '}
                                        {entry.requestedByEmail ??
                                          entry.requestedByUserId}
                                      </small>
                                      <div className={styles.assistChecklist}>
                                        <span className={styles.badge}>
                                          {entry.promptPackKey}@
                                          {entry.promptPackVersion}
                                        </span>
                                        <span className={styles.badge}>
                                          approval{' '}
                                          {humanizeKey(
                                            entry.approvalSummary.status,
                                          )}
                                        </span>
                                        {entry.suggestedOutputKeys.map((outputKey) => (
                                          <span
                                            className={styles.badge}
                                            key={`${entry.id}:${outputKey}`}
                                          >
                                            {outputKey}
                                          </span>
                                        ))}
                                      </div>
                                      <div className={styles.inlineActions}>
                                        <button
                                          className={styles.ghostButton}
                                          type="button"
                                          onClick={() => {
                                            void handleOpenTenantAiWorkspaceSuggestionRunDetail(
                                              entry.id,
                                            );
                                          }}
                                          disabled={
                                            growthActionLoading === loadActionKey
                                          }
                                        >
                                          {growthActionLoading === loadActionKey
                                            ? 'Cargando detalle...'
                                            : 'Ver detalle'}
                                        </button>
                                        {canRequestHumanReview ? (
                                          <button
                                            className={styles.secondaryButton}
                                            type="button"
                                            onClick={() => {
                                              void handleRequestTenantAiWorkspaceSuggestionRunApproval(
                                                entry.agentKey,
                                                entry.id,
                                              );
                                            }}
                                            disabled={
                                              (isInvoiceAgent
                                                ? actionLoading
                                                : growthActionLoading) ===
                                              actionKey
                                            }
                                          >
                                            {(isInvoiceAgent
                                              ? actionLoading
                                              : growthActionLoading) === actionKey
                                              ? 'Pidiendo aprobación...'
                                              : 'Pedir revisión humana'}
                                          </button>
                                        ) : null}
                                      </div>
                                    </div>
                                  );
                                })
                            ) : tenantAiSuggestionWorkspaceLoading ? (
                              <small className={styles.muted}>
                                Cargando handoffs transversales...
                              </small>
                            ) : (
                              <small className={styles.muted}>
                                No hay handoffs visibles para este filtro.
                              </small>
                            )}
                          </div>
                          {selectedTenantAiSuggestionWorkspaceDetail ? (
                            <div className={styles.stack}>
                              <span className={styles.muted}>
                                Detalle transversal del handoff seleccionado
                              </span>
                              <div className={styles.assistCueCard}>
                                <div className={styles.invoiceCardHeader}>
                                  <strong>
                                    {
                                      aiAgentCatalogByKey.get(
                                        selectedTenantAiSuggestionWorkspaceDetail.agentKey,
                                      )?.title ??
                                        fallbackAiAgentTitle(
                                          selectedTenantAiSuggestionWorkspaceDetail.agentKey,
                                        )
                                    }
                                  </strong>
                                  <span className={styles.statusPill}>
                                    {humanizeKey(
                                      selectedTenantAiSuggestionWorkspaceDetail
                                        .approvalSummary.status,
                                    )}
                                  </span>
                                </div>
                                <small>
                                  {selectedTenantAiSuggestionWorkspaceDetail.summary}
                                </small>
                                <small>
                                  {selectedTenantAiSuggestionWorkspaceDetail.promptPackKey}@
                                  {
                                    selectedTenantAiSuggestionWorkspaceDetail
                                      .promptPackVersion
                                  }{' '}
                                  · {formatDate(
                                    selectedTenantAiSuggestionWorkspaceDetail.createdAt,
                                  )}
                                </small>
                                <div className={styles.assistChecklist}>
                                  {selectedTenantAiSuggestionWorkspaceDetail.suggestedOutputKeys.map(
                                    (outputKey) => (
                                      <span
                                        className={styles.badge}
                                        key={`tenant-selected:${outputKey}`}
                                      >
                                        {outputKey}
                                      </span>
                                    ),
                                  )}
                                </div>
                                {selectedTenantAiSuggestionWorkspaceDetail.approvalRequests
                                  .length === 0 ? (
                                  <small className={styles.muted}>
                                    Todavía no hay approval requests para este
                                    handoff.
                                  </small>
                                ) : (
                                  selectedTenantAiSuggestionWorkspaceDetail.approvalRequests.map(
                                    (entry) => (
                                      <div
                                        className={styles.assistCueCard}
                                        key={`tenant-selected:${entry.id}`}
                                      >
                                        <div className={styles.invoiceCardHeader}>
                                          <strong>{entry.policyKey}</strong>
                                          <span
                                            className={`${styles.statusPill} ${
                                              entry.status === 'approved'
                                                ? styles.statusHealthy
                                                : entry.status === 'rejected'
                                                  ? styles.statusCritical
                                                  : styles.statusWarning
                                            }`}
                                          >
                                            {humanizeKey(entry.status)}
                                          </span>
                                        </div>
                                        <small>
                                          Solicitada {formatDate(entry.createdAt)}
                                          {entry.reviewedAt
                                            ? ` · revisada ${formatDate(
                                                entry.reviewedAt,
                                              )}`
                                            : ''}
                                        </small>
                                        {entry.rationale ? (
                                          <small>{entry.rationale}</small>
                                        ) : null}
                                        {entry.reviewNote ? (
                                          <small>{entry.reviewNote}</small>
                                        ) : null}
                                      </div>
                                    ),
                                  )
                                )}
                              </div>
                            </div>
                          ) : null}
                          <div className={styles.stack}>
                            {growthAssistAiEnvelope.contextBlocks
                              .slice(0, 3)
                              .map((block) => (
                                <div className={styles.assistCueCard} key={block.key}>
                                  <strong>{block.title}</strong>
                                  <small>{block.detail}</small>
                                  <div className={styles.assistChecklist}>
                                    {block.bullets.map((bullet) => (
                                      <span className={styles.badge} key={bullet}>
                                        {bullet}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                          </div>
                          {growthAssistAiSuggestionRuns.length > 0 ? (
                            <div className={styles.stack}>
                              <span className={styles.muted}>
                                Historial auditable reciente
                              </span>
                              {growthAssistAiSuggestionRuns
                                .slice(0, 3)
                                .map((entry) => {
                                  const canRequestHumanReview =
                                    entry.approvalSummary.status ===
                                      'not_requested' ||
                                    entry.approvalSummary.status === 'rejected';

                                  return (
                                    <div
                                      className={styles.assistCueCard}
                                      key={entry.id}
                                    >
                                      <strong>{entry.summary}</strong>
                                      <small>
                                        {formatDate(entry.createdAt)} ·{' '}
                                        {entry.requestedByEmail ??
                                          entry.requestedByUserId}
                                      </small>
                                      <div className={styles.assistChecklist}>
                                        <span className={styles.badge}>
                                          {entry.status}
                                        </span>
                                        <span className={styles.badge}>
                                          {entry.promptPackKey}@{entry.promptPackVersion}
                                        </span>
                                        <span className={styles.badge}>
                                          approval{' '}
                                          {humanizeKey(
                                            entry.approvalSummary.status,
                                          )}
                                        </span>
                                        {entry.suggestedOutputKeys.map((outputKey) => (
                                          <span
                                            className={styles.badge}
                                            key={outputKey}
                                          >
                                            {outputKey}
                                          </span>
                                        ))}
                                      </div>
                                      {entry.approvalSummary.status !==
                                      'not_requested' ? (
                                        <small>
                                          Approval más reciente:{' '}
                                          {humanizeKey(
                                            entry.approvalSummary.status,
                                          )}{' '}
                                          ·{' '}
                                          {formatDate(
                                            entry.approvalSummary
                                              .latestReviewedAt ??
                                              entry.approvalSummary
                                                .latestRequestedAt,
                                          )}
                                        </small>
                                      ) : (
                                        <small className={styles.muted}>
                                          Todavía no hay revisión humana pedida para este
                                          handoff.
                                        </small>
                                      )}
                                      <div className={styles.inlineActions}>
                                        <button
                                          className={styles.ghostButton}
                                          type="button"
                                          onClick={() => {
                                            void handleOpenGrowthAiSuggestionRunDetail(
                                              entry.id,
                                            );
                                          }}
                                          disabled={
                                            growthActionLoading ===
                                            `load-ai-run-detail:${entry.id}`
                                          }
                                        >
                                          {growthActionLoading ===
                                          `load-ai-run-detail:${entry.id}`
                                            ? 'Cargando detalle...'
                                            : 'Ver detalle'}
                                        </button>
                                        {canRequestHumanReview ? (
                                          <button
                                            className={styles.secondaryButton}
                                            type="button"
                                            onClick={() => {
                                              void handleRequestAiSuggestionRunApproval(
                                                entry.id,
                                              );
                                            }}
                                            disabled={
                                              growthActionLoading ===
                                              `request-ai-approval:${entry.id}`
                                            }
                                          >
                                            {growthActionLoading ===
                                            `request-ai-approval:${entry.id}`
                                              ? 'Pidiendo aprobación...'
                                              : 'Pedir revisión humana'}
                                          </button>
                                        ) : null}
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          ) : null}
                          {selectedGrowthAiSuggestionRunDetail ? (
                            <div className={styles.stack}>
                              <span className={styles.muted}>
                                Detalle del handoff seleccionado
                              </span>
                              <div className={styles.assistCueCard}>
                                <strong>
                                  {selectedGrowthAiSuggestionRunDetail.summary}
                                </strong>
                                <small>
                                  {selectedGrowthAiSuggestionRunDetail.promptPackKey}@
                                  {
                                    selectedGrowthAiSuggestionRunDetail
                                      .promptPackVersion
                                  }{' '}
                                  · approval{' '}
                                  {humanizeKey(
                                    selectedGrowthAiSuggestionRunDetail
                                      .approvalSummary.status,
                                  )}
                                </small>
                                <div className={styles.assistChecklist}>
                                  {selectedGrowthAiSuggestionRunDetail.suggestedOutputKeys.map(
                                    (outputKey) => (
                                      <span
                                        className={styles.badge}
                                        key={outputKey}
                                      >
                                        {outputKey}
                                      </span>
                                    ),
                                  )}
                                </div>
                                {selectedGrowthAiSuggestionRunDetail.approvalRequests
                                  .length === 0 ? (
                                  <small className={styles.muted}>
                                    Todavía no hay approval requests para este
                                    handoff.
                                  </small>
                                ) : (
                                  selectedGrowthAiSuggestionRunDetail.approvalRequests.map(
                                    (entry) => (
                                      <div
                                        className={styles.assistCueCard}
                                        key={entry.id}
                                      >
                                        <div className={styles.invoiceCardHeader}>
                                          <strong>{entry.policyKey}</strong>
                                          <span
                                            className={`${styles.statusPill} ${
                                              entry.status === 'approved'
                                                ? styles.statusHealthy
                                                : entry.status === 'rejected'
                                                  ? styles.statusCritical
                                                  : styles.statusWarning
                                            }`}
                                          >
                                            {humanizeKey(entry.status)}
                                          </span>
                                        </div>
                                        <small>
                                          Solicitada {formatDate(entry.createdAt)}
                                          {entry.reviewedAt
                                            ? ` · revisada ${formatDate(
                                                entry.reviewedAt,
                                              )}`
                                            : ''}
                                        </small>
                                        {entry.rationale ? (
                                          <small>{entry.rationale}</small>
                                        ) : null}
                                        {entry.reviewNote ? (
                                          <small>{entry.reviewNote}</small>
                                        ) : null}
                                      </div>
                                    ),
                                  )
                                )}
                              </div>
                            </div>
                          ) : null}
                          {tenantAiApprovalWorkspace.length > 0 ? (
                            <div className={styles.stack}>
                              <span className={styles.muted}>
                                Approval workspace transversal
                              </span>
                              <div className={styles.commercialMetricsGrid}>
                                <div className={styles.commercialCard}>
                                  <span className={styles.muted}>
                                    Solicitudes totales
                                  </span>
                                  <strong>
                                    {tenantAiApprovalWorkspaceSummary?.counts
                                      .totalApprovalRequests ?? 0}
                                  </strong>
                                  <small>
                                    Approval requests visibles para el tenant en
                                    todos los agentes AI habilitados.
                                  </small>
                                </div>
                                <div className={styles.commercialCard}>
                                  <span className={styles.muted}>
                                    Pendientes
                                  </span>
                                  <strong>
                                    {tenantAiApprovalWorkspaceSummary?.counts
                                      .pendingApprovalRequests ?? 0}
                                  </strong>
                                  <small>
                                    Revisiones humanas que todavia necesitan una
                                    decision.
                                  </small>
                                </div>
                                <div className={styles.commercialCard}>
                                  <span className={styles.muted}>
                                    Decisiones cerradas
                                  </span>
                                  <strong>
                                    {(tenantAiApprovalWorkspaceSummary?.counts
                                      .approvedApprovalRequests ?? 0) +
                                      (tenantAiApprovalWorkspaceSummary?.counts
                                        .rejectedApprovalRequests ?? 0)}
                                  </strong>
                                  <small>
                                    Approvals ya resueltas para cerrar el loop
                                    operativo.
                                  </small>
                                </div>
                              </div>
                              {oldestTenantAiPendingWorkspaceApproval ? (
                                <div className={styles.assistCueCard}>
                                  <strong>SLA sugerido: atender pendiente mas antiguo</strong>
                                  <small>
                                    {
                                      oldestTenantAiPendingWorkspaceApproval.summary
                                    }
                                  </small>
                                  <small>
                                    Solicitada{' '}
                                    {formatDate(
                                      oldestTenantAiPendingWorkspaceApproval.createdAt,
                                    )}{' '}
                                    por{' '}
                                    {oldestTenantAiPendingWorkspaceApproval.requestedByEmail ??
                                      oldestTenantAiPendingWorkspaceApproval.requestedByUserId}
                                  </small>
                                </div>
                              ) : null}
                              {latestTenantAiReviewedWorkspaceApproval ? (
                                <div className={styles.assistCueCard}>
                                  <strong>Ultima decision registrada</strong>
                                  <small>
                                    {
                                      latestTenantAiReviewedWorkspaceApproval.summary
                                    }
                                  </small>
                                  <small>
                                    Revisada{' '}
                                    {formatDate(
                                      latestTenantAiReviewedWorkspaceApproval.reviewedAt,
                                    )}{' '}
                                    por{' '}
                                    {latestTenantAiReviewedWorkspaceApproval.reviewedByEmail ??
                                      latestTenantAiReviewedWorkspaceApproval.reviewedByUserId ??
                                      'sin reviewer'}
                                  </small>
                                </div>
                              ) : null}
                              <div className={styles.inlineActions}>
                                {tenantAiApprovalWorkspaceStatusOptions.map(
                                  ({ key, label, count }) => (
                                  <button
                                    key={key}
                                    className={
                                      tenantAiApprovalWorkspaceStatusFilter === key
                                        ? styles.secondaryButton
                                        : styles.ghostButton
                                    }
                                    type="button"
                                    onClick={() => {
                                      setTenantAiApprovalWorkspaceStatusFilter(key);
                                    }}
                                  >
                                    {key === 'all' ? label : humanizeKey(key)} ({count})
                                  </button>
                                  ),
                                )}
                              </div>
                              {tenantAiApprovalWorkspaceSummary?.agentBreakdown.length ? (
                                <div className={styles.assistChecklist}>
                                  {tenantAiApprovalWorkspaceSummary.agentBreakdown.map(
                                    (entry) => (
                                      <span
                                        className={styles.badge}
                                        key={`approval-workspace:${entry.agentKey}`}
                                      >
                                        {entry.title}: {entry.pendingApprovalRequests}{' '}
                                        pending / {entry.approvedApprovalRequests}{' '}
                                        approved / {entry.rejectedApprovalRequests}{' '}
                                        rejected
                                      </span>
                                    ),
                                  )}
                                </div>
                              ) : null}
                              {tenantAiApprovalWorkspace
                                .slice(0, 3)
                                .map((entry) => {
                                  const isInvoiceAgent =
                                    entry.agentKey === 'invoice-document-assistant';
                                  const agentTitle =
                                    aiAgentCatalogByKey.get(entry.agentKey)?.title ??
                                    fallbackAiAgentTitle(entry.agentKey);
                                  const loadActionKey =
                                    `load-tenant-ai-run-detail:${entry.suggestionRunId}`;
                                  const reviewActionKey = isInvoiceAgent
                                    ? `review-invoice-ai-approval:${entry.id}`
                                    : `review-ai-approval:${entry.id}`;
                                  const handoffLoading =
                                    growthActionLoading === loadActionKey;
                                  const reviewLoading =
                                    (isInvoiceAgent
                                      ? actionLoading
                                      : growthActionLoading) === reviewActionKey;

                                  return (
                                    <div
                                      className={styles.assistCueCard}
                                      key={entry.id}
                                    >
                                      <div className={styles.invoiceCardHeader}>
                                        <strong>{entry.summary}</strong>
                                        <span
                                          className={`${styles.statusPill} ${
                                            entry.status === 'approved'
                                              ? styles.statusHealthy
                                              : entry.status === 'rejected'
                                                ? styles.statusCritical
                                                : styles.statusWarning
                                          }`}
                                        >
                                          {humanizeKey(entry.status)}
                                        </span>
                                      </div>
                                      <div className={styles.assistChecklist}>
                                        <span className={styles.badge}>
                                          {agentTitle}
                                        </span>
                                        <span className={styles.badge}>
                                          {entry.policyKey}
                                        </span>
                                      </div>
                                      <small>
                                        {formatDate(entry.createdAt)} ·{' '}
                                        {entry.requestedByEmail ??
                                          entry.requestedByUserId}
                                      </small>
                                      {entry.rationale ? (
                                        <small>{entry.rationale}</small>
                                      ) : null}
                                      <div className={styles.inlineActions}>
                                        <button
                                          className={styles.ghostButton}
                                          type="button"
                                          onClick={() => {
                                            void handleOpenTenantAiWorkspaceSuggestionRunDetail(
                                              entry.suggestionRunId,
                                            );
                                          }}
                                          disabled={handoffLoading}
                                        >
                                          {handoffLoading
                                            ? 'Cargando handoff...'
                                            : 'Ver handoff'}
                                        </button>
                                      </div>
                                      {entry.status === 'pending' ? (
                                        <div className={styles.inlineActions}>
                                          <button
                                            className={styles.secondaryButton}
                                            type="button"
                                            onClick={() => {
                                              void handleReviewTenantAiApprovalWorkspaceRequest(
                                                entry.agentKey,
                                                entry.id,
                                                'approved',
                                              );
                                            }}
                                            disabled={reviewLoading}
                                          >
                                            {reviewLoading ? 'Guardando...' : 'Aprobar'}
                                          </button>
                                          <button
                                            className={styles.ghostButton}
                                            type="button"
                                            onClick={() => {
                                              void handleReviewTenantAiApprovalWorkspaceRequest(
                                                entry.agentKey,
                                                entry.id,
                                                'rejected',
                                              );
                                            }}
                                            disabled={reviewLoading}
                                          >
                                            Rechazar
                                          </button>
                                        </div>
                                      ) : entry.reviewedAt ? (
                                        <small>
                                          Revisada el {formatDate(entry.reviewedAt)} por{' '}
                                          {entry.reviewedByEmail ??
                                            entry.reviewedByUserId ??
                                            'sin reviewer'}
                                        </small>
                                      ) : null}
                                    </div>
                                  );
                                })}
                            </div>
                          ) : (
                            <div className={styles.stack}>
                              <span className={styles.muted}>
                                Approval workspace transversal
                              </span>
                              <div className={styles.commercialMetricsGrid}>
                                <div className={styles.commercialCard}>
                                  <span className={styles.muted}>
                                    Solicitudes totales
                                  </span>
                                  <strong>
                                    {tenantAiApprovalWorkspaceSummary?.counts
                                      .totalApprovalRequests ?? 0}
                                  </strong>
                                  <small>
                                    Approval requests visibles para el tenant en
                                    todos los agentes AI habilitados.
                                  </small>
                                </div>
                                <div className={styles.commercialCard}>
                                  <span className={styles.muted}>
                                    Pendientes
                                  </span>
                                  <strong>
                                    {tenantAiApprovalWorkspaceSummary?.counts
                                      .pendingApprovalRequests ?? 0}
                                  </strong>
                                  <small>
                                    Revisiones humanas que todavia necesitan una
                                    decision.
                                  </small>
                                </div>
                                <div className={styles.commercialCard}>
                                  <span className={styles.muted}>
                                    Decisiones cerradas
                                  </span>
                                  <strong>
                                    {(tenantAiApprovalWorkspaceSummary?.counts
                                      .approvedApprovalRequests ?? 0) +
                                      (tenantAiApprovalWorkspaceSummary?.counts
                                        .rejectedApprovalRequests ?? 0)}
                                  </strong>
                                  <small>
                                    Approvals ya resueltas para cerrar el loop
                                    operativo.
                                  </small>
                                </div>
                              </div>
                              <div className={styles.inlineActions}>
                                {tenantAiApprovalWorkspaceStatusOptions.map(
                                  ({ key, label, count }) => (
                                  <button
                                    key={key}
                                    className={
                                      tenantAiApprovalWorkspaceStatusFilter === key
                                        ? styles.secondaryButton
                                        : styles.ghostButton
                                    }
                                    type="button"
                                    onClick={() => {
                                      setTenantAiApprovalWorkspaceStatusFilter(key);
                                    }}
                                  >
                                    {key === 'all' ? label : humanizeKey(key)} ({count})
                                  </button>
                                  ),
                                )}
                              </div>
                              {tenantAiApprovalWorkspaceLoading ? (
                                <small className={styles.muted}>
                                  Cargando approvals transversales...
                                </small>
                              ) : (
                                <small className={styles.muted}>
                                  No hay approvals en estado{' '}
                                  {tenantAiApprovalWorkspaceStatusFilter === 'all'
                                  ? 'visible'
                                  : humanizeKey(
                                      tenantAiApprovalWorkspaceStatusFilter,
                                    )}
                                  .
                                </small>
                              )}
                            </div>
                          )}
                          <small className={styles.muted}>
                            Guardrails:{' '}
                            {growthAssistAiEnvelope.promptPack.constraints.join(' ')}
                          </small>
                          {plannedAiAgents.length > 0 ? (
                            <small className={styles.muted}>
                              Próximos agentes transversales:{' '}
                              {plannedAiAgents.map((entry) => entry.title).join(' · ')}
                            </small>
                          ) : null}
                        </div>
                      ) : (
                        <div className={styles.emptyState}>
                          <p>
                            El tenant ya tiene Growth Assist, pero todavía no se pudo
                            cargar el envelope transversal preparado para IA.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className={styles.detailCard}>
                      <div className={styles.sectionHeading}>
                        <div>
                          <span className={styles.label}>Top 3 del dia</span>
                          <h3>Si solo haces 3 cosas hoy</h3>
                        </div>
                      </div>

                      <div className={styles.stack}>
                        {effectiveGrowthAssistNextActions.map((action) => (
                          <div className={styles.assistTaskCard} key={action.key}>
                            <div className={styles.invoiceCardHeader}>
                              <strong>{action.title}</strong>
                              <span
                                className={`${styles.statusPill} ${growthAssistNextActionTone(
                                  action.emphasis,
                                )}`}
                              >
                                {growthAssistNextActionLabel(action.emphasis)}
                              </span>
                            </div>
                            <small>{action.whyNow}</small>
                            <div className={styles.assistReplyBox}>
                              <span className={styles.muted}>Que haria ahora</span>
                              <strong>{action.recommendedAction}</strong>
                            </div>
                            <small>{action.businessImpact}</small>
                            <div className={styles.badgeRow}>
                              <span className={styles.badge}>
                                {growthAssistTaskCategoryLabel(action.actionType)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={styles.detailCard}>
                      <div className={styles.sectionHeading}>
                        <div>
                          <span className={styles.label}>Que hacer ahora</span>
                          <h3>Lista simple de proximos pasos</h3>
                        </div>
                      </div>

                      {effectiveGrowthAssistTasks.length === 0 ? (
                        <div className={styles.emptyState}>
                          <p>
                            Hoy no hay una tarea urgente marcada por el sistema. Puedes
                            usar Growth como agenda tranquila para revisar leads y
                            mantener ritmo comercial.
                          </p>
                        </div>
                      ) : (
                        effectiveGrowthAssistTasks.map((task) => (
                          <div className={styles.assistTaskCard} key={task.key}>
                            <div className={styles.invoiceCardHeader}>
                              <strong>{task.title}</strong>
                              <span
                                className={`${styles.statusPill} ${growthAssistUrgencyTone(
                                  task.urgency,
                                )}`}
                              >
                                {growthAssistUrgencyLabel(task.urgency)}
                              </span>
                            </div>
                            <small>{task.summary}</small>
                            <div className={styles.badgeRow}>
                              <span className={styles.badge}>
                                {growthAssistTaskCategoryLabel(task.category)}
                              </span>
                              <span className={styles.badge}>{task.actionLabel}</span>
                              {task.dueAt ? (
                                <span className={styles.badge}>
                                  Referencia {formatDate(task.dueAt)}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className={styles.detailCard}>
                      <div className={styles.sectionHeading}>
                        <div>
                          <span className={styles.label}>Cues comerciales</span>
                          <h3>Como arrancar la conversacion correcta</h3>
                        </div>
                      </div>

                      <div className={styles.badgeRow}>
                        <span className={styles.badge}>
                          Calientes {effectiveGrowthAssistLeadWarmthSummary.hotCount}
                        </span>
                        <span className={styles.badge}>
                          En movimiento {effectiveGrowthAssistLeadWarmthSummary.warmCount}
                        </span>
                        <span className={styles.badge}>
                          En radar {effectiveGrowthAssistLeadWarmthSummary.watchCount}
                        </span>
                      </div>

                      <p className={styles.muted}>
                        {effectiveGrowthAssistLeadWarmthSummary.recommendedFocus}
                      </p>

                      {effectiveGrowthAssistConversationCues.length === 0 ? (
                        <div className={styles.emptyState}>
                          <p>
                            Cuando el workbench detecte conversaciones calientes o
                            atrasadas, aqui apareceran sugerencias de arranque en
                            lenguaje simple.
                          </p>
                        </div>
                      ) : (
                        effectiveGrowthAssistConversationCues.map((cue) => (
                          <div className={styles.assistCueCard} key={cue.key}>
                            <div className={styles.invoiceCardHeader}>
                              <strong>{cue.title}</strong>
                              <span
                                className={`${styles.statusPill} ${growthAssistWarmthTone(
                                  cue.warmth,
                                )}`}
                              >
                                {growthAssistWarmthLabel(cue.warmth)}
                              </span>
                            </div>
                            <small>{cue.summary}</small>
                            <div className={styles.assistReplyBox}>
                              <span className={styles.muted}>Sugerencia de arranque</span>
                              <strong>{cue.suggestedReply}</strong>
                            </div>
                            <small>{cue.nextMove}</small>
                          </div>
                        ))
                      )}
                    </div>

                    <div className={styles.detailCard}>
                      <div className={styles.sectionHeading}>
                        <div>
                          <span className={styles.label}>Radar de calor</span>
                          <h3>Por que cada lead se ve asi</h3>
                        </div>
                      </div>

                      <div className={styles.badgeRow}>
                        <span className={styles.badge}>
                          Dominante{' '}
                          {growthAssistDominantWarmthLabel(
                            effectiveGrowthAssistLeadWarmthSummary.dominantWarmth,
                          )}
                        </span>
                      </div>

                      {effectiveGrowthAssistLeadWarmthHints.length === 0 ? (
                        <div className={styles.emptyState}>
                          <p>
                            Cuando haya señales de calor comercial mas claras, aqui
                            veras por que cada conversacion merece atencion y con que
                            ritmo conviene moverla.
                          </p>
                        </div>
                      ) : (
                        <div className={styles.stack}>
                          {effectiveGrowthAssistLeadWarmthHints.map((hint) => (
                            <div className={styles.assistCueCard} key={hint.key}>
                              <div className={styles.invoiceCardHeader}>
                                <strong>{hint.title}</strong>
                                <span
                                  className={`${styles.statusPill} ${growthAssistWarmthTone(
                                    hint.warmth,
                                  )}`}
                                >
                                  {growthAssistWarmthLabel(hint.warmth)}
                                </span>
                              </div>
                              <small>{hint.signalSummary}</small>
                              <div className={styles.assistReplyBox}>
                                <span className={styles.muted}>Por que se ve asi</span>
                                <strong>{hint.whyWarmth}</strong>
                              </div>
                              <small>
                                <strong>Cadencia sugerida:</strong> {hint.recommendedCadence}
                              </small>
                              <small>
                                <strong>Riesgo si se enfria:</strong> {hint.riskNote}
                              </small>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className={styles.detailCard}>
                      <div className={styles.sectionHeading}>
                        <div>
                          <span className={styles.label}>Reply suggestions</span>
                          <h3>Mensajes listos para adaptar</h3>
                        </div>
                      </div>

                      {effectiveGrowthAssistReplySuggestions.length === 0 ? (
                        <div className={styles.emptyState}>
                          <p>
                            Cuando el sistema detecte conversaciones que piden
                            movimiento, aqui veras borradores simples para responder
                            sin pensar desde cero.
                          </p>
                        </div>
                      ) : (
                        <div className={styles.stack}>
                          {effectiveGrowthAssistReplySuggestions.map((suggestion) => (
                            <div className={styles.assistCueCard} key={suggestion.key}>
                              <div className={styles.invoiceCardHeader}>
                                <strong>{suggestion.title}</strong>
                                <span
                                  className={`${styles.statusPill} ${growthAssistWarmthTone(
                                    suggestion.warmth,
                                  )}`}
                                >
                                  {growthAssistWarmthLabel(suggestion.warmth)}
                                </span>
                              </div>
                              <small>{suggestion.reason}</small>
                              <div className={styles.assistReplyBox}>
                                <span className={styles.muted}>Objetivo del mensaje</span>
                                <strong>{suggestion.goal}</strong>
                              </div>
                              <div className={styles.assistReplyBox}>
                                <span className={styles.muted}>
                                  Borrador sugerido
                                </span>
                                <strong>{suggestion.suggestedReply}</strong>
                              </div>
                              <small>{suggestion.followUpPrompt}</small>
                              <div className={styles.assistChecklist}>
                                {suggestion.checklist.map((item) => (
                                  <span className={styles.badge} key={item}>
                                    {item}
                                  </span>
                                ))}
                              </div>
                              <div className={styles.inlineActionRow}>
                                <button
                                  className={styles.secondaryButton}
                                  onClick={() =>
                                    void copyGrowthAssistReplySuggestion(
                                      suggestion.key,
                                      suggestion.suggestedReply,
                                      suggestion.followUpPrompt,
                                    )
                                  }
                                  type="button"
                                >
                                  {copiedGrowthAssistReplyKey === suggestion.key
                                    ? 'Copiado'
                                    : 'Copiar sugerencia'}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className={styles.detailCard}>
                      <div className={styles.sectionHeading}>
                        <div>
                          <span className={styles.label}>Playbooks guiados</span>
                          <h3>Traduccion del sistema a lenguaje de negocio</h3>
                        </div>
                      </div>

                      <p className={styles.muted}>
                        El negocio ya tiene guardado este criterio de reparto:
                        {' '}
                        <strong>
                          {describeGrowthOperationalCaseAutoAssignmentPolicy(
                            effectiveGrowthAssistSummary?.savedPolicyKey ??
                              growthOperationalCaseAutoAssignmentSettings?.defaultPolicyKey ??
                              'balanced',
                          )}
                        </strong>
                        . En lenguaje simple, eso significa{' '}
                        {describeGrowthAssistAutoAssignmentPolicy(
                          effectiveGrowthAssistSummary?.savedPolicyKey ??
                            growthOperationalCaseAutoAssignmentSettings?.defaultPolicyKey ??
                            'balanced',
                        )}
                        .
                      </p>

                      <div className={styles.stack}>
                        {effectiveGrowthAssistPlaybooks.map((playbook) => (
                          <div className={styles.invoiceItemCard} key={playbook.key}>
                            <strong>{playbook.title}</strong>
                            <small>{playbook.detail}</small>
                            <small>
                              <strong>Objetivo:</strong> {playbook.goal}
                            </small>
                            <small>
                              <strong>Evita:</strong> {playbook.avoid}
                            </small>
                            <small>
                              <strong>Se ve bien cuando:</strong>{' '}
                              {playbook.successSignal}
                            </small>
                            <small>
                              <strong>Cuando usarlo:</strong> {playbook.whenToUse}
                            </small>
                            <div className={styles.assistChecklist}>
                              {playbook.steps.map((step) => (
                                <span className={styles.badge} key={step}>
                                  {step}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className={styles.inlineActionRow}>
                        <button
                          className={styles.secondaryButton}
                          disabled={
                            growthActionLoading ===
                            `auto-assign:${currentTenancy.tenant.slug}`
                          }
                          onClick={() =>
                            void handleAutoAssignGrowthOperationalCases(
                              currentTenancy.tenant.slug,
                            )
                          }
                          type="button"
                        >
                          {growthActionLoading ===
                          `auto-assign:${currentTenancy.tenant.slug}`
                            ? 'Organizando...'
                            : 'Auto-organizar cola'}
                        </button>
                        <button
                          className={styles.ghostButton}
                          disabled={
                            growthActionLoading ===
                            `review-routing:${currentTenancy.tenant.slug}`
                          }
                          onClick={() =>
                            void handleReviewGrowthOperationalCaseRouting(
                              currentTenancy.tenant.slug,
                            )
                          }
                          type="button"
                        >
                          {growthActionLoading ===
                          `review-routing:${currentTenancy.tenant.slug}`
                            ? 'Revisando...'
                            : 'Revisar vencidos'}
                        </button>
                        <button
                          className={styles.ghostButton}
                          disabled={growthActionLoading === 'run-monitor'}
                          onClick={() => void handleRunGrowthOperationalMonitor()}
                          type="button"
                        >
                          {growthActionLoading === 'run-monitor'
                            ? 'Actualizando...'
                            : 'Actualizar salud del canal'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className={styles.twoColumn}>
                    <div className={styles.detailCard}>
                      <div className={styles.sectionHeading}>
                        <div>
                          <span className={styles.label}>Esperando cliente</span>
                          <h3>Recordatorios que no piden accion inmediata</h3>
                        </div>
                      </div>

                      {effectiveGrowthAssistWaitingCustomerCards.length === 0 ? (
                        <div className={styles.emptyState}>
                          <p>
                            Por ahora no hay seguimientos claramente en espera del
                            cliente. Todo lo visible pide accion del equipo o esta bajo
                            control.
                          </p>
                        </div>
                      ) : (
                        effectiveGrowthAssistWaitingCustomerCards.map((entry) => (
                          <div className={styles.invoiceItemCard} key={entry.id}>
                            <div className={styles.invoiceCardHeader}>
                              <strong>{entry.title}</strong>
                              <span className={styles.statusPill}>
                                {growthOperationalCaseFollowUpStateLabel(
                                  entry.followUpState,
                                )}
                              </span>
                            </div>
                            <small>{entry.summary}</small>
                            <small>{entry.nextAction}</small>
                            <div className={styles.badgeRow}>
                              <span className={styles.badge}>
                                {entry.assignedUserEmail ?? 'Sin owner'}
                              </span>
                              {entry.dueAt ? (
                                <span className={styles.badge}>
                                  Revisar otra vez {formatDate(entry.dueAt)}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className={styles.detailCard}>
                      <div className={styles.sectionHeading}>
                        <div>
                          <span className={styles.label}>Salud del canal</span>
                          <h3>Lectura simple de WhatsApp y delivery</h3>
                        </div>
                      </div>

                      {effectiveGrowthAssistChannelHealth || whatsappSummary ? (
                        <>
                          <p className={styles.muted}>
                            Estado actual del canal:{' '}
                            <strong>
                              {operationalStatusLabel(
                                effectiveGrowthAssistChannelHealth?.overallStatus ??
                                  whatsappSummary?.operationalDashboard.overallStatus ??
                                  'healthy',
                              )}
                            </strong>
                            . Hoy hay{' '}
                            <strong>
                              {effectiveGrowthAssistChannelHealth?.totalAlertCount ??
                                whatsappSummary?.operationalAlerts.length ??
                                0}
                            </strong>{' '}
                            alertas activas y{' '}
                            <strong>
                              {effectiveGrowthAssistChannelHealth?.readyRetryCount ??
                                whatsappSummary?.retryOperations.readyNowCount ??
                                0}
                            </strong>{' '}
                            mensajes listos para reintento.
                          </p>
                          <div className={styles.badgeRow}>
                            <span className={styles.badge}>
                              Entregados {whatsappSummary?.totals.deliveredCount ?? 0}
                            </span>
                            <span className={styles.badge}>
                              Leidos {whatsappSummary?.totals.readCount ?? 0}
                            </span>
                            <span className={styles.badge}>
                              Fallidos {whatsappSummary?.totals.failedCount ?? 0}
                            </span>
                            <span className={styles.badge}>
                              Ready retries{' '}
                              {whatsappSummary?.retryOperations.readyNowCount ?? 0}
                            </span>
                          </div>
                          {effectiveGrowthAssistChannelHealth?.topAlertTitle ||
                          whatsappSummary?.operationalAlerts[0] ? (
                            <div className={styles.invoiceItemCard}>
                              <strong>
                                Alerta principal:{' '}
                                {effectiveGrowthAssistChannelHealth?.topAlertTitle ??
                                  whatsappSummary?.operationalAlerts[0]?.title}
                              </strong>
                              <small>
                                {effectiveGrowthAssistChannelHealth?.topAlertSummary ??
                                  whatsappSummary?.operationalAlerts[0]?.summary}
                              </small>
                              <small>
                                Siguiente paso sugerido:{' '}
                                {effectiveGrowthAssistChannelHealth?.topAlertRecommendedAction ??
                                  whatsappSummary?.operationalAlerts[0]?.recommendedAction}
                              </small>
                            </div>
                          ) : (
                            <div className={styles.emptyState}>
                              <p>
                                No hay alertas activas; el canal esta respirando bien.
                              </p>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className={styles.emptyState}>
                          <p>
                            Cuando termine de cargar el summary, aqui veremos una
                            lectura simple del canal y de los retries.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
              {growthFleetOperatorBrief ? (
                <div className={styles.operatorBrief}>
                  <div className={styles.sectionHeading}>
                    <div>
                      <span className={styles.label}>Fleet operator brief</span>
                      <h3>Radar compartido de tenancies Growth</h3>
                    </div>
                    <span className={styles.statusPill}>
                      {growthFleetSnapshots.length}/{growthAccessibleTenancies.length}{' '}
                      tenancies
                    </span>
                  </div>
                  <p>{growthFleetOperatorBrief.headline}</p>
                  <small>{growthFleetOperatorBrief.detail}</small>
                  <div className={styles.badgeRow}>
                    <span className={styles.badge}>
                      Criticos {growthFleetOverview.statusCounts.critical}
                    </span>
                    <span className={styles.badge}>
                      Warning {growthFleetOverview.statusCounts.warning}
                    </span>
                    <span className={styles.badge}>
                      Ready retries {growthFleetOverview.totalReadyRetries}
                    </span>
                    <span className={styles.badge}>
                      Hotspots {growthFleetTopAlerts.length}
                    </span>
                  </div>
                </div>
              ) : null}

              <div className={styles.invoiceKpiGrid}>
                <div className={styles.commercialCard}>
                  <span className={styles.muted}>Tenancies con Growth</span>
                  <strong>{growthAccessibleTenancies.length}</strong>
                  <small>
                    {growthFleetSnapshots.length} hidratadas
                    {growthFleetPartialFailureCount > 0
                      ? ` · ${growthFleetPartialFailureCount} pendientes`
                      : ''}
                  </small>
                </div>
                <div className={styles.commercialCard}>
                  <span className={styles.muted}>Estados criticos</span>
                  <strong>{growthFleetOverview.statusCounts.critical}</strong>
                  <small>{growthFleetOverview.statusCounts.warning} warning</small>
                </div>
                <div className={styles.commercialCard}>
                  <span className={styles.muted}>Alertas activas</span>
                  <strong>{growthFleetOverview.totalActiveAlerts}</strong>
                  <small>{growthFleetOverview.totalCriticalAlerts} criticas</small>
                </div>
                <div className={styles.commercialCard}>
                  <span className={styles.muted}>Ready-now retries</span>
                  <strong>{growthFleetOverview.totalReadyRetries}</strong>
                  <small>
                    {growthFleetOverview.totalOperationalCases} casos operativos
                  </small>
                </div>
              </div>

              <div className={styles.twoColumn}>
                <div className={styles.detailCard}>
                  <div className={styles.sectionHeading}>
                    <div>
                      <span className={styles.label}>Operational cases</span>
                      <h3>Cola compartida ya promovida a workflow</h3>
                    </div>
                    <div className={styles.inlineActionRow}>
                      <small className={styles.muted}>
                        {filteredGrowthFleetOperationalCases.length} visibles ·{' '}
                        {growthFleetOperationalCaseQueue.length} abiertas
                      </small>
                      {selectedGrowthFleetTenant ? (
                        <>
                          <button
                            className={styles.ghostButton}
                            disabled={
                              growthActionLoading ===
                              `auto-assign:${selectedGrowthFleetTenant.tenancy.tenant.slug}`
                            }
                            onClick={() =>
                              void handleAutoAssignGrowthOperationalCases(
                                selectedGrowthFleetTenant.tenancy.tenant.slug,
                              )
                            }
                            type="button"
                          >
                            {growthActionLoading ===
                            `auto-assign:${selectedGrowthFleetTenant.tenancy.tenant.slug}`
                              ? 'Auto-asignando...'
                              : 'Auto-asignar'}
                          </button>
                          <button
                            className={styles.ghostButton}
                            disabled={
                              growthActionLoading ===
                              `review-routing:${selectedGrowthFleetTenant.tenancy.tenant.slug}`
                            }
                            onClick={() =>
                              void handleReviewGrowthOperationalCaseRouting(
                                selectedGrowthFleetTenant.tenancy.tenant.slug,
                              )
                            }
                            type="button"
                          >
                            {growthActionLoading ===
                            `review-routing:${selectedGrowthFleetTenant.tenancy.tenant.slug}`
                              ? 'Revisando...'
                              : 'Revisar routing'}
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <p className={styles.muted}>
                    La auto-asignacion fleet corre con el pack por defecto
                    guardado en cada tenant. Desde el workspace puntual puedes
                    cambiar y persistir ese pack antes de volver a dispararla.
                  </p>

                  <div className={styles.selectorGrid}>
                    <button
                      className={`${styles.selectorCard} ${
                        growthFleetOperationalCaseRoutingFilter === 'all'
                          ? styles.selectorCardActive
                          : ''
                      }`}
                      onClick={() => setGrowthFleetOperationalCaseRoutingFilter('all')}
                      type="button"
                    >
                      <span>Todos los lanes</span>
                      <small>
                        {growthFleetOperationalCaseQueue.length} casos abiertos en la
                        flota
                      </small>
                    </button>
                    {growthOperationalCaseRoutingPolicies.map((policy) => (
                      <button
                        className={`${styles.selectorCard} ${
                          growthFleetOperationalCaseRoutingFilter === policy.key
                            ? styles.selectorCardActive
                            : ''
                        }`}
                        key={`fleet-lane-${policy.key}`}
                        onClick={() =>
                          setGrowthFleetOperationalCaseRoutingFilter(policy.key)
                        }
                        type="button"
                      >
                        <span>{policy.label}</span>
                        <small>
                          {growthFleetOperationalCaseCountsByRoutingPolicy[policy.key]}{' '}
                          casos · {policy.summary}
                        </small>
                      </button>
                    ))}
                  </div>

                  {filteredGrowthFleetOperationalCases.length === 0 ? (
                    <div className={styles.emptyState}>
                      <p>
                        No hay casos operativos abiertos para el lane elegido en la
                        flota; por ahora seguimos leyendo solo la presión derivada en
                        ese carril.
                      </p>
                    </div>
                  ) : (
                    <div className={styles.stack}>
                      {visibleGrowthFleetOperationalCaseLanes
                        .filter((lane) => lane.entries.length > 0)
                        .map((lane) => (
                          <div className={styles.stack} key={`fleet-lane-stack-${lane.key}`}>
                            <div className={styles.invoiceCardHeader}>
                              <strong>{lane.label}</strong>
                              <span className={styles.statusPill}>
                                {lane.count} casos
                              </span>
                            </div>
                            <small>{lane.summary}</small>
                            {lane.entries.map((entry) => (
                              <div
                                className={styles.invoiceItemCard}
                                key={`${entry.tenantSlug}-${entry.id}`}
                              >
                                <div className={styles.invoiceCardHeader}>
                                  <strong>{entry.title}</strong>
                                  <span
                                    className={`${styles.statusPill} ${operationalStatusTone(
                                      entry.priority,
                                    )}`}
                                  >
                                    {growthOperationalCaseStatusLabel(entry.status)}
                                  </span>
                                </div>
                                <small>
                                  {entry.tenantName} · {entry.tenantSlug}
                                </small>
                                <div className={styles.badgeRow}>
                                  <span className={styles.badge}>
                                    {growthOperationalCaseTypeLabel(entry.caseType)}
                                  </span>
                                  <span className={styles.badge}>
                                    {growthOperationalCaseRoutingPolicyLabel(
                                      entry.routingPolicyKey,
                                    )}
                                  </span>
                                  {entry.caseType === 'follow_up' &&
                                  entry.followUpState ? (
                                    <span className={styles.badge}>
                                      {growthOperationalCaseFollowUpStateLabel(
                                        entry.followUpState,
                                      )}
                                    </span>
                                  ) : null}
                                  <span className={styles.badge}>
                                    {entry.assignedUserEmail ?? 'Sin owner'}
                                  </span>
                                  {entry.dueAt ? (
                                    <span className={styles.badge}>
                                      Due {formatDate(entry.dueAt)}
                                    </span>
                                  ) : null}
                                </div>
                                <small>{entry.summary}</small>
                                <small>{entry.nextAction}</small>
                                <small>
                                  Lane: {growthOperationalCaseRoutingPolicySummary(entry.routingPolicyKey)}
                                </small>
                                <div className={styles.inlineActionRow}>
                                  {entry.caseType === 'follow_up' &&
                                  entry.status !== 'resolved' ? (
                                    <>
                                      <button
                                        className={styles.secondaryButton}
                                        disabled={
                                          growthActionLoading ===
                                          `follow-up-case:${entry.id}:pending_team`
                                        }
                                        onClick={() =>
                                          void handleUpdateGrowthOperationalCaseFollowUpState(
                                            {
                                              tenantSlug: entry.tenantSlug,
                                              caseId: entry.id,
                                              followUpState: 'pending_team',
                                              dueAt: entry.dueAt,
                                            },
                                          )
                                        }
                                        type="button"
                                      >
                                        {growthActionLoading ===
                                        `follow-up-case:${entry.id}:pending_team`
                                          ? 'Actualizando...'
                                          : 'Pendiente equipo'}
                                      </button>
                                      <button
                                        className={styles.ghostButton}
                                        disabled={
                                          growthActionLoading ===
                                          `follow-up-case:${entry.id}:scheduled`
                                        }
                                        onClick={() =>
                                          void handleUpdateGrowthOperationalCaseFollowUpState(
                                            {
                                              tenantSlug: entry.tenantSlug,
                                              caseId: entry.id,
                                              followUpState: 'scheduled',
                                              nextAction:
                                                entry.nextAction ||
                                                'Programar el siguiente outreach del equipo.',
                                              dueAt:
                                                entry.dueAt ??
                                                new Date(
                                                  Date.now() + 24 * 60 * 60 * 1000,
                                                ).toISOString(),
                                            },
                                          )
                                        }
                                        type="button"
                                      >
                                        {growthActionLoading ===
                                        `follow-up-case:${entry.id}:scheduled`
                                          ? 'Actualizando...'
                                          : 'Programar'}
                                      </button>
                                      <button
                                        className={styles.ghostButton}
                                        disabled={
                                          growthActionLoading ===
                                          `follow-up-case:${entry.id}:waiting_customer`
                                        }
                                        onClick={() =>
                                          void handleUpdateGrowthOperationalCaseFollowUpState(
                                            {
                                              tenantSlug: entry.tenantSlug,
                                              caseId: entry.id,
                                              followUpState: 'waiting_customer',
                                              nextAction:
                                                'Esperar respuesta del cliente antes del siguiente outreach.',
                                              dueAt: null,
                                            },
                                          )
                                        }
                                        type="button"
                                      >
                                        {growthActionLoading ===
                                        `follow-up-case:${entry.id}:waiting_customer`
                                          ? 'Actualizando...'
                                          : 'Esperando cliente'}
                                      </button>
                                    </>
                                  ) : null}
                                  {entry.status === 'open' ? (
                                    <button
                                      className={styles.secondaryButton}
                                      disabled={
                                        growthActionLoading === `take-case:${entry.id}`
                                      }
                                      onClick={() =>
                                        void handleTakeGrowthOperationalCase(
                                          entry.tenantSlug,
                                          entry.id,
                                        )
                                      }
                                      type="button"
                                    >
                                      {growthActionLoading === `take-case:${entry.id}`
                                        ? 'Tomando...'
                                        : 'Tomar'}
                                    </button>
                                  ) : null}
                                  {entry.status !== 'resolved' ? (
                                    <button
                                      className={styles.ghostButton}
                                      disabled={
                                        growthActionLoading === `resolve-case:${entry.id}`
                                      }
                                      onClick={() =>
                                        void handleResolveGrowthOperationalCase(
                                          entry.tenantSlug,
                                          entry.id,
                                        )
                                      }
                                      type="button"
                                    >
                                      {growthActionLoading === `resolve-case:${entry.id}`
                                        ? 'Resolviendo...'
                                        : 'Resolver'}
                                    </button>
                                  ) : null}
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                <div className={styles.detailCard}>
                  <div className={styles.sectionHeading}>
                    <div>
                      <span className={styles.label}>Fleet queue</span>
                      <h3>Ordena primero que tenant atender</h3>
                    </div>
                    <label className={styles.field}>
                      <span>Filtrar por estado</span>
                      <select
                        className={styles.selectField}
                        onChange={(event) =>
                          setGrowthFleetStatusFilter(
                            event.target.value === 'healthy'
                              ? 'healthy'
                              : event.target.value === 'warning'
                                ? 'warning'
                                : event.target.value === 'critical'
                                  ? 'critical'
                                  : 'all',
                          )
                        }
                        value={growthFleetStatusFilter}
                      >
                        <option value="all">Todos</option>
                        <option value="critical">Critico</option>
                        <option value="warning">Warning</option>
                        <option value="healthy">Saludable</option>
                      </select>
                    </label>
                  </div>

                  {filteredGrowthFleetSnapshots.length === 0 ? (
                    <div className={styles.emptyState}>
                      <p>
                        No hay tenancies visibles para el filtro actual de la consola
                        fleet.
                      </p>
                    </div>
                  ) : (
                    filteredGrowthFleetSnapshots.map((snapshot) => {
                      const isSelected =
                        effectiveSelectedGrowthFleetTenantSlug ===
                        snapshot.tenancy.tenant.slug;
                      const leadingAlert =
                        snapshot.summary.operationalAlerts[0] ?? null;
                      const latestRunAt =
                        snapshot.latestRun?.generatedAt ??
                        snapshot.analytics.windowEndAt ??
                        snapshot.summary.generatedAt;

                      return (
                        <div
                          className={`${styles.invoiceItemCard} ${
                            isSelected ? styles.drilldownCardActive : ''
                          }`}
                          key={snapshot.tenancy.tenant.id}
                        >
                          <div className={styles.invoiceCardHeader}>
                            <strong>{snapshot.tenancy.tenant.name}</strong>
                            <span
                              className={`${styles.statusPill} ${operationalStatusTone(
                                snapshot.summary.operationalDashboard.overallStatus,
                              )}`}
                            >
                              {operationalStatusLabel(
                                snapshot.summary.operationalDashboard.overallStatus,
                              )}
                            </span>
                          </div>
                          <small>
                            {snapshot.tenancy.tenant.slug}
                            {currentTenancy?.tenant.slug === snapshot.tenancy.tenant.slug
                              ? ' · workspace actual'
                              : ''}
                          </small>
                          <div className={styles.badgeRow}>
                            <span className={styles.badge}>
                              Alerts {snapshot.summary.operationalAlerts.length}
                            </span>
                            <span className={styles.badge}>
                              Ready retries{' '}
                              {snapshot.summary.retryOperations.readyNowCount}
                            </span>
                            <span className={styles.badge}>
                              Ack {snapshot.acknowledgements.length}
                            </span>
                          </div>
                          <small>
                            Ultima corrida {formatDate(latestRunAt)} · scheduler{' '}
                            {snapshot.analytics.triggerSourceCounts.scheduler} · manual{' '}
                            {snapshot.analytics.triggerSourceCounts.manual}
                          </small>
                          <small>
                            {leadingAlert?.title ??
                              'Sin alertas activas en el snapshot actual'}
                          </small>
                          <div className={styles.inlineActionRow}>
                            <button
                              className={styles.ghostButton}
                              onClick={() =>
                                setSelectedGrowthFleetTenantSlug(
                                  snapshot.tenancy.tenant.slug,
                                )
                              }
                              type="button"
                            >
                              Inspeccionar
                            </button>
                            {currentTenancy?.tenant.slug !== snapshot.tenancy.tenant.slug ? (
                              <button
                                className={styles.secondaryButton}
                                disabled={actionLoading !== null}
                                onClick={() =>
                                  void handleSelectTenancy(
                                    snapshot.tenancy.tenant.slug,
                                  )
                                }
                                type="button"
                              >
                                Abrir workspace
                              </button>
                            ) : null}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className={styles.detailCard}>
                  <div className={styles.sectionHeading}>
                    <div>
                      <span className={styles.label}>Fleet inspector</span>
                      <h3>Lectura rapida del tenant seleccionado</h3>
                    </div>
                  </div>

                  {!selectedGrowthFleetTenant ? (
                    <div className={styles.emptyState}>
                      <p>
                        Selecciona un tenant de la cola fleet para ver su lectura
                        operativa consolidada.
                      </p>
                    </div>
                  ) : (
                    <div className={styles.stack}>
                      <div className={styles.invoiceCardHeader}>
                        <strong>{selectedGrowthFleetTenant.tenancy.tenant.name}</strong>
                        <span
                          className={`${styles.statusPill} ${operationalStatusTone(
                            selectedGrowthFleetTenant.summary.operationalDashboard
                              .overallStatus,
                          )}`}
                        >
                          {operationalStatusLabel(
                            selectedGrowthFleetTenant.summary.operationalDashboard
                              .overallStatus,
                          )}
                        </span>
                      </div>
                      <small>
                        {selectedGrowthFleetTenant.tenancy.tenant.slug} · membership{' '}
                        {selectedGrowthFleetTenant.tenancy.membership.status}
                      </small>
                      <div className={styles.badgeRow}>
                        <span className={styles.badge}>
                          Leading provider:{' '}
                          {humanizeKey(
                            selectedGrowthFleetTenant.summary.operationalDashboard
                              .leadingProvider,
                          )}
                        </span>
                        <span className={styles.badge}>
                          Leading taxonomy:{' '}
                          {humanizeKey(
                            selectedGrowthFleetTenant.summary.operationalDashboard
                              .leadingProviderTaxonomyDetail,
                          )}
                        </span>
                        <span className={styles.badge}>
                          Ready retries{' '}
                          {
                            selectedGrowthFleetTenant.summary.retryOperations
                              .readyNowCount
                          }
                        </span>
                        {selectedGrowthFleetTenantCaseCountsByRoutingPolicy
                          ? growthOperationalCaseRoutingPolicies.map((policy) => (
                              <span
                                className={styles.badge}
                                key={`selected-tenant-lane-${policy.key}`}
                              >
                                {policy.label}{' '}
                                {
                                  selectedGrowthFleetTenantCaseCountsByRoutingPolicy[
                                    policy.key
                                  ]
                                }
                              </span>
                            ))
                          : null}
                      </div>
                      <small>
                        Corridas historicas{' '}
                        {selectedGrowthFleetTenant.analytics.runCount} · scheduler{' '}
                        {
                          selectedGrowthFleetTenant.analytics.triggerSourceCounts
                            .scheduler
                        }{' '}
                        · manual{' '}
                        {
                          selectedGrowthFleetTenant.analytics.triggerSourceCounts
                            .manual
                        }
                      </small>
                      {selectedGrowthFleetTenant.summary.operationalAlerts[0] ? (
                        <div className={styles.invoiceItemCard}>
                          <div className={styles.invoiceCardHeader}>
                            <strong>
                              {
                                selectedGrowthFleetTenant.summary.operationalAlerts[0]
                                  .title
                              }
                            </strong>
                            <span className={styles.statusPill}>
                              {
                                selectedGrowthFleetTenant.summary.operationalAlerts[0]
                                  .severity
                              }
                            </span>
                          </div>
                          <small>
                            {
                              selectedGrowthFleetTenant.summary.operationalAlerts[0]
                                .summary
                            }
                          </small>
                          <small>
                            {
                              selectedGrowthFleetTenant.summary.operationalAlerts[0]
                                .recommendedAction
                            }
                          </small>
                        </div>
                      ) : null}
                      {selectedGrowthFleetTenant.analytics.thresholdCalibration
                        .slice(0, 2)
                        .map((suggestion) => (
                          <div
                            className={styles.invoiceItemCard}
                            key={suggestion.thresholdKey}
                          >
                            <div className={styles.invoiceCardHeader}>
                              <strong>{humanizeKey(suggestion.thresholdKey)}</strong>
                              <span className={styles.statusPill}>
                                {humanizeKey(suggestion.direction)}
                              </span>
                            </div>
                            <small>{suggestion.rationale}</small>
                            <small>
                              Actual{' '}
                              {formatThresholdValue(
                                suggestion.currentValue,
                                suggestion.thresholdUnit,
                              )}{' '}
                              · recomendado{' '}
                              {formatThresholdValue(
                                suggestion.recommendedValue,
                                suggestion.thresholdUnit,
                              )}
                            </small>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.twoColumn}>
                <div className={styles.detailCard}>
                  <div className={styles.sectionHeading}>
                    <div>
                      <span className={styles.label}>Fleet hotspots</span>
                      <h3>Alertas repetidas entre tenancies</h3>
                    </div>
                  </div>

                  {growthFleetTopAlerts.length === 0 ? (
                    <div className={styles.emptyState}>
                      <p>No hay alertas compartidas activas entre las tenancies visibles.</p>
                    </div>
                  ) : (
                    growthFleetTopAlerts.map((alert) => (
                      <div className={styles.invoiceItemCard} key={alert.key}>
                        <div className={styles.invoiceCardHeader}>
                          <strong>{alert.title}</strong>
                          <span
                            className={`${styles.statusPill} ${operationalStatusTone(
                              alert.severity === 'critical' ? 'critical' : 'warning',
                            )}`}
                          >
                            {alert.tenantCount} tenants
                          </span>
                        </div>
                        <small>
                          {alert.occurrenceCount} apariciones activas · ultima vez{' '}
                          {formatDate(alert.lastSeenAt)}
                        </small>
                      </div>
                    ))
                  )}
                </div>

                <div className={styles.detailCard}>
                  <div className={styles.sectionHeading}>
                    <div>
                      <span className={styles.label}>Taxonomy spread</span>
                      <h3>Patrones compartidos del provider</h3>
                    </div>
                  </div>

                  {growthFleetTopTaxonomy.length === 0 ? (
                    <div className={styles.emptyState}>
                      <p>No hay taxonomias dominantes compartidas entre tenancies.</p>
                    </div>
                  ) : (
                    growthFleetTopTaxonomy.map((entry) => (
                      <div className={styles.invoiceItemCard} key={entry.key}>
                        <div className={styles.invoiceCardHeader}>
                          <strong>{humanizeKey(entry.providerTaxonomyDetail)}</strong>
                          <span className={styles.statusPill}>
                            {entry.tenantCount} tenants
                          </span>
                        </div>
                        <small>
                          {entry.provider} · {humanizeKey(entry.providerTaxonomyFamily)}
                        </small>
                        <small>{entry.messageCount} mensajes afectados</small>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className={styles.twoColumn}>
                <div className={styles.detailCard}>
                  <div className={styles.sectionHeading}>
                    <div>
                      <span className={styles.label}>Escalation candidates</span>
                      <h3>Donde conviene intervenir primero</h3>
                    </div>
                  </div>

                  {growthFleetEscalationCandidates.length === 0 ? (
                    <div className={styles.emptyState}>
                      <p>
                        La flota no muestra señales fuertes de escalación en este
                        momento.
                      </p>
                    </div>
                  ) : (
                    growthFleetEscalationCandidates.map((entry) => (
                      <div className={styles.invoiceItemCard} key={entry.tenantSlug}>
                        <div className={styles.invoiceCardHeader}>
                          <strong>{entry.tenantName}</strong>
                          <span
                            className={`${styles.statusPill} ${operationalStatusTone(
                              entry.overallStatus,
                            )}`}
                          >
                            score {entry.score}
                          </span>
                        </div>
                        <small>{entry.tenantSlug}</small>
                        <div className={styles.badgeRow}>
                          <span className={styles.badge}>
                            Criticas {entry.criticalAlertCount}
                          </span>
                          <span className={styles.badge}>
                            Sin ack {entry.unacknowledgedCriticalCount}
                          </span>
                          <span className={styles.badge}>
                            Ready retries {entry.readyNowCount}
                          </span>
                          <span className={styles.badge}>
                            Unassigned {entry.unassignedThreadCount}
                          </span>
                        </div>
                        <small>
                          Follow-ups vencidos {entry.overdueFollowUpCount}
                          {entry.staleSchedulerCoverage
                            ? ' · sin cobertura del scheduler'
                            : ''}
                        </small>
                      </div>
                    ))
                  )}
                </div>

                <div className={styles.detailCard}>
                  <div className={styles.sectionHeading}>
                    <div>
                      <span className={styles.label}>Staffing pressure</span>
                      <h3>Tenants con mayor presion operativa</h3>
                    </div>
                  </div>

                  {growthFleetStaffingPressure.length === 0 ? (
                    <div className={styles.emptyState}>
                      <p>
                        No hay presión visible de staffing en las colas cross-tenant.
                      </p>
                    </div>
                  ) : (
                    growthFleetStaffingPressure.map((entry) => (
                      <div className={styles.invoiceItemCard} key={entry.tenantSlug}>
                        <div className={styles.invoiceCardHeader}>
                          <strong>{entry.tenantName}</strong>
                          <span className={styles.statusPill}>
                            pressure {entry.pressureScore}
                          </span>
                        </div>
                        <small>{entry.tenantSlug}</small>
                        <div className={styles.badgeRow}>
                          <span className={styles.badge}>
                            Waiting on team {entry.waitingOnTeamCount}
                          </span>
                          <span className={styles.badge}>
                            Overdue first {entry.overdueFirstResponseCount}
                          </span>
                          <span className={styles.badge}>
                            Stale {entry.staleThreadCount}
                          </span>
                          <span className={styles.badge}>
                            Open {entry.openThreadCount}
                          </span>
                        </div>
                        <small>
                          Unassigned {entry.unassignedThreadCount} · overdue follow-up{' '}
                          {entry.overdueFollowUpCount}
                        </small>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className={styles.twoColumn}>
                <div className={styles.detailCard}>
                  <div className={styles.sectionHeading}>
                    <div>
                      <span className={styles.label}>Runbooks</span>
                      <h3>Playbooks operativos sugeridos por la flota</h3>
                    </div>
                  </div>

                  {growthFleetRunbooks.length === 0 ? (
                    <div className={styles.emptyState}>
                      <p>
                        La flota todavía no necesita runbooks explícitos; por ahora
                        el radar está lo bastante tranquilo.
                      </p>
                    </div>
                  ) : (
                    growthFleetRunbooks.map((runbook) => (
                      <div className={styles.invoiceItemCard} key={runbook.key}>
                        <div className={styles.invoiceCardHeader}>
                          <strong>{runbook.title}</strong>
                          <span
                            className={`${styles.statusPill} ${operationalStatusTone(
                              runbook.severity,
                            )}`}
                          >
                            {operationalStatusLabel(runbook.severity)}
                          </span>
                        </div>
                        <small>{runbook.summary}</small>
                        <div className={styles.badgeRow}>
                          {runbook.affectedTenants.slice(0, 4).map((entry) => (
                            <span className={styles.badge} key={`${runbook.key}-${entry}`}>
                              {entry}
                            </span>
                          ))}
                        </div>
                        <div className={styles.stack}>
                          {runbook.steps.map((step, index) => (
                            <small key={`${runbook.key}-step-${index + 1}`}>
                              {index + 1}. {step}
                            </small>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className={styles.detailCard}>
                  <div className={styles.sectionHeading}>
                    <div>
                      <span className={styles.label}>Ownership queue</span>
                      <h3>Threads cross-tenant que piden owner o seguimiento</h3>
                    </div>
                  </div>

                  {growthFleetOwnershipQueue.length === 0 ? (
                    <div className={styles.emptyState}>
                      <p>
                        No hay threads cross-tenant con presión suficiente como para
                        subir a una cola de ownership.
                      </p>
                    </div>
                  ) : (
                    growthFleetOwnershipQueue.map((thread) => {
                      const sourceKey =
                        !thread.assigneeUserId || thread.nextActionOwner !== 'team'
                          ? `thread:${thread.threadId}:ownership`
                          : `thread:${thread.threadId}:follow_up`;
                      const existingCase =
                        growthFleetOperationalCasesBySourceKey.get(
                          `${thread.tenantSlug}:${sourceKey}`,
                        ) ?? null;

                      return (
                        <div
                          className={styles.invoiceItemCard}
                          key={`${thread.tenantSlug}-${thread.threadId}`}
                        >
                          <div className={styles.invoiceCardHeader}>
                            <strong>{thread.subject}</strong>
                            <span className={styles.statusPill}>
                              score {thread.ownershipScore}
                            </span>
                          </div>
                          <small>
                            {thread.tenantName} · {thread.tenantSlug}
                          </small>
                          <div className={styles.badgeRow}>
                            <span className={styles.badge}>
                              {channelLabel(thread.channel)}
                            </span>
                            <span className={styles.badge}>
                              {humanizeKey(thread.priority)}
                            </span>
                            <span className={styles.badge}>
                              Owner {thread.assigneeUserId ?? 'sin owner'}
                            </span>
                            <span className={styles.badge}>
                              Next {humanizeKey(thread.nextActionOwner)}
                            </span>
                            {existingCase ? (
                              <span className={styles.badge}>
                                Caso {growthOperationalCaseStatusLabel(existingCase.status)}
                              </span>
                            ) : null}
                          </div>
                          <small>
                            First response {humanizeKey(thread.firstResponseStatus)} ·
                            Follow-up {humanizeKey(thread.followUpStatus)} · stale{' '}
                            {humanizeKey(thread.staleStatus)}
                          </small>
                          <small>
                            {thread.hoursSinceLastActivity}h desde última actividad
                          </small>
                          <div className={styles.inlineActionRow}>
                            {currentTenancy?.tenant.slug !== thread.tenantSlug ? (
                              <button
                                className={styles.secondaryButton}
                                disabled={actionLoading !== null}
                                onClick={() => void handleSelectTenancy(thread.tenantSlug)}
                                type="button"
                              >
                                Abrir tenant
                              </button>
                            ) : null}
                            {existingCase ? (
                              <button
                                className={styles.secondaryButton}
                                disabled={
                                  growthActionLoading === `take-case:${existingCase.id}` ||
                                  growthActionLoading === `resolve-case:${existingCase.id}`
                                }
                                onClick={() =>
                                  void (
                                    existingCase.status === 'open'
                                      ? handleTakeGrowthOperationalCase(
                                          thread.tenantSlug,
                                          existingCase.id,
                                        )
                                      : handleResolveGrowthOperationalCase(
                                          thread.tenantSlug,
                                          existingCase.id,
                                        )
                                  )
                                }
                                type="button"
                              >
                                {existingCase.status === 'open'
                                  ? 'Tomar caso'
                                  : 'Resolver caso'}
                              </button>
                            ) : (
                              <button
                                className={styles.secondaryButton}
                                disabled={
                                  growthActionLoading === `create-case:${sourceKey}`
                                }
                                onClick={() =>
                                  void handleCreateGrowthOperationalCase({
                                    tenantSlug: thread.tenantSlug,
                                    sourceKey,
                                    caseType:
                                      !thread.assigneeUserId ||
                                      thread.nextActionOwner !== 'team'
                                        ? 'ownership_routing'
                                        : 'follow_up',
                                    priority:
                                      thread.priority === 'critical'
                                        ? 'critical'
                                        : 'warning',
                                    title: !thread.assigneeUserId
                                      ? `Asignar owner: ${thread.subject}`
                                      : `Forzar follow-up: ${thread.subject}`,
                                    summary: !thread.assigneeUserId
                                      ? 'El thread cross-tenant sigue sin owner explícito.'
                                      : 'El thread ya requiere seguimiento explícito del equipo.',
                                    nextAction: !thread.assigneeUserId
                                      ? 'Tomar ownership y validar si el queue necesita rebalanceo.'
                                      : 'Definir siguiente outreach y confirmar responsable activo.',
                                    followUpState:
                                      !thread.assigneeUserId ||
                                      thread.nextActionOwner !== 'team'
                                        ? null
                                        : 'pending_team',
                                    threadId: thread.threadId,
                                  })
                                }
                                type="button"
                              >
                                {growthActionLoading === `create-case:${sourceKey}`
                                  ? 'Creando...'
                                  : 'Crear caso'}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {!currentTenancy ? (
                <div className={styles.emptyState}>
                  <p>
                    La consola fleet ya esta disponible. Si quieres abrir workbench,
                    monitor manual y drill-down detallado, elige un workspace actual.
                  </p>
                </div>
              ) : !currentTenantGrowthAccessible ? (
                <div className={styles.emptyState}>
                  <p>
                    El workspace actual no expone <code>growth.conversations.read</code>,
                    pero la vista fleet si detecto otras tenancies con acceso a
                    Growth. Cambia de tenant desde la cola superior para abrir el
                    detalle operativo.
                  </p>
                </div>
              ) : (
                <>
              {!growthProductEnabled ? (
                <div className={styles.emptyState}>
                  <p>
                    Este tenant ya deja operar el workspace de Growth por permisos
                    efectivos, aunque <code>/products</code> todavia no publique la
                    clave <code>growth</code>. La consola permanece visible para no
                    ocultar alertas ni workbench reales.
                  </p>
                </div>
              ) : null}
              {growthOperatorBrief ? (
                <div className={styles.operatorBrief}>
                  <div className={styles.sectionHeading}>
                    <div>
                      <span className={styles.label}>Operator brief</span>
                      <h3>Lectura rapida de esta cola</h3>
                    </div>
                    <span
                      className={`${styles.statusPill} ${operationalStatusTone(
                        whatsappSummary!.operationalDashboard.overallStatus,
                      )}`}
                    >
                      {operationalStatusLabel(
                        whatsappSummary!.operationalDashboard.overallStatus,
                      )}
                    </span>
                  </div>
                  <p>{growthOperatorBrief.headline}</p>
                  <small>{growthOperatorBrief.detail}</small>
                  <div className={styles.badgeRow}>
                    <span className={styles.badge}>
                      Provider dominante:{' '}
                      {humanizeKey(
                        whatsappSummary!.operationalDashboard.leadingProvider,
                      )}
                    </span>
                    <span className={styles.badge}>
                      Fallo lider:{' '}
                      {humanizeKey(
                        whatsappSummary!.operationalDashboard.leadingFailureClass,
                      )}
                    </span>
                    <span className={styles.badge}>
                      Fail rate async:{' '}
                      {formatRate(
                        whatsappSummary!.operationalDashboard
                          .asynchronousDeliveryFailureRate,
                      )}
                    </span>
                  </div>
                </div>
              ) : null}

              {whatsappSummary ? (
                <div className={styles.invoiceKpiGrid}>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Estado operativo</span>
                    <strong>
                      <span
                        className={`${styles.statusPill} ${operationalStatusTone(
                          whatsappSummary.operationalDashboard.overallStatus,
                        )}`}
                      >
                        {operationalStatusLabel(
                          whatsappSummary.operationalDashboard.overallStatus,
                        )}
                      </span>
                    </strong>
                  </div>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Alertas activas</span>
                    <strong>{whatsappSummary.operationalAlerts.length}</strong>
                    <small>
                      {whatsappSummary.operationalAlerts.filter(
                        (alert) => alert.severity === 'critical',
                      ).length}{' '}
                      criticas
                    </small>
                  </div>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Ready-now retries</span>
                    <strong>{whatsappSummary.retryOperations.readyNowCount}</strong>
                    <small>
                      Cooldown {whatsappSummary.retryOperations.cooldownBlockedCount}
                    </small>
                  </div>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Taxonomia lider</span>
                    <strong>
                      {humanizeKey(
                        whatsappSummary.operationalDashboard
                          .leadingProviderTaxonomyDetail,
                      )}
                    </strong>
                    <small>
                      {humanizeKey(
                        whatsappSummary.operationalDashboard.leadingFailureClass,
                      )}
                    </small>
                  </div>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Reconocidas</span>
                    <strong>{acknowledgedAlertCount}</strong>
                    <small>historial compartido {visibleAlertHistory.length}</small>
                  </div>
                </div>
              ) : null}

              {whatsappMonitorAnalytics ? (
                <div className={styles.twoColumn}>
                  <div className={styles.detailCard}>
                    <div className={styles.sectionHeading}>
                      <div>
                        <span className={styles.label}>Historical calibration</span>
                        <h3>Tendencia real de las corridas del monitor</h3>
                      </div>
                      <small className={styles.muted}>
                        {whatsappMonitorAnalytics.runCount} corridas · ventana{' '}
                        {formatDate(whatsappMonitorAnalytics.windowStartAt)} a{' '}
                        {formatDate(whatsappMonitorAnalytics.windowEndAt)}
                      </small>
                    </div>

                    <div className={styles.badgeRow}>
                      <span className={styles.badge}>
                        Healthy {whatsappMonitorAnalytics.statusCounts.healthy}
                      </span>
                      <span className={styles.badge}>
                        Warning {whatsappMonitorAnalytics.statusCounts.warning}
                      </span>
                      <span className={styles.badge}>
                        Critical {whatsappMonitorAnalytics.statusCounts.critical}
                      </span>
                      <span className={styles.badge}>
                        Manual {whatsappMonitorAnalytics.triggerSourceCounts.manual}
                      </span>
                      <span className={styles.badge}>
                        Scheduler{' '}
                        {whatsappMonitorAnalytics.triggerSourceCounts.scheduler}
                      </span>
                    </div>

                    {thresholdCalibrationSuggestions.length === 0 ? (
                      <div className={styles.emptyState}>
                        <p>
                          Todavia no hay suficiente historia persistida para sugerir
                          calibracion de thresholds.
                        </p>
                      </div>
                    ) : (
                      thresholdCalibrationSuggestions.map((suggestion) => (
                        <div className={styles.invoiceItemCard} key={suggestion.thresholdKey}>
                          <div className={styles.invoiceCardHeader}>
                            <strong>{humanizeKey(suggestion.thresholdKey)}</strong>
                            <span className={styles.statusPill}>
                              {humanizeKey(suggestion.direction)}
                            </span>
                          </div>
                          <small>{suggestion.rationale}</small>
                          <div className={styles.badgeRow}>
                            <span className={styles.badge}>
                              Actual{' '}
                              {formatThresholdValue(
                                suggestion.currentValue,
                                suggestion.thresholdUnit,
                              )}
                            </span>
                            <span className={styles.badge}>
                              Recomendado{' '}
                              {formatThresholdValue(
                                suggestion.recommendedValue,
                                suggestion.thresholdUnit,
                              )}
                            </span>
                            <span className={styles.badge}>
                              P95{' '}
                              {formatThresholdValue(
                                suggestion.p95Observed,
                                suggestion.thresholdUnit,
                              )}
                            </span>
                            <span className={styles.badge}>
                              Confianza {humanizeKey(suggestion.confidence)}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className={styles.detailCard}>
                    <div className={styles.sectionHeading}>
                      <div>
                        <span className={styles.label}>Alert recurrence</span>
                        <h3>Alertas que más se repiten en la bitácora</h3>
                      </div>
                    </div>

                    {leadingHistoricalAlerts.length === 0 ? (
                      <div className={styles.emptyState}>
                        <p>
                          La bitácora todavía no muestra alertas repetidas para este
                          tenant.
                        </p>
                      </div>
                    ) : (
                      leadingHistoricalAlerts.map((alert) => (
                        <div className={styles.invoiceItemCard} key={alert.alertKey}>
                          <div className={styles.invoiceCardHeader}>
                            <strong>{alert.title}</strong>
                            <span
                              className={`${styles.statusPill} ${operationalStatusTone(
                                alert.severity === 'critical'
                                  ? 'critical'
                                  : 'warning',
                              )}`}
                            >
                              {alert.occurrenceCount} veces
                            </span>
                          </div>
                          <small>
                            Ultima vez {formatDate(alert.lastSeenAt)} · severidad{' '}
                            {humanizeKey(alert.severity)}
                          </small>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : null}

              <div className={styles.detailCard}>
                <div className={styles.sectionHeading}>
                  <div>
                    <span className={styles.label}>Operational cases</span>
                    <h3>Cola compartida del tenant</h3>
                  </div>
                  <div className={styles.inlineActionRow}>
                    {filteredGrowthOperationalCases.length > 0 ? (
                      <small className={styles.muted}>
                        {filteredGrowthOperationalCases.length} visibles ·{' '}
                        {
                          growthOperationalCases.filter(
                            (entry) => entry.status !== 'resolved',
                          ).length
                        }{' '}
                        abiertas
                      </small>
                    ) : null}
                    {currentTenancy ? (
                      <>
                        <button
                          className={styles.ghostButton}
                          disabled={
                            growthActionLoading ===
                            `auto-assign:${currentTenancy.tenant.slug}`
                          }
                          onClick={() =>
                            void handleAutoAssignGrowthOperationalCases(
                              currentTenancy.tenant.slug,
                            )
                          }
                          type="button"
                        >
                          {growthActionLoading ===
                          `auto-assign:${currentTenancy.tenant.slug}`
                            ? 'Auto-asignando...'
                            : 'Auto-asignar'}
                        </button>
                        <button
                          className={styles.ghostButton}
                          disabled={
                            growthActionLoading ===
                            `review-routing:${currentTenancy.tenant.slug}`
                          }
                          onClick={() =>
                            void handleReviewGrowthOperationalCaseRouting(
                              currentTenancy.tenant.slug,
                            )
                          }
                          type="button"
                        >
                          {growthActionLoading ===
                          `review-routing:${currentTenancy.tenant.slug}`
                            ? 'Revisando...'
                            : 'Revisar routing'}
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>

                <div className={styles.selectorGrid}>
                  {growthOperationalCaseAutoAssignmentPolicies.map((policy) => (
                    <button
                      className={`${styles.selectorCard} ${
                        growthOperationalCaseAutoAssignmentPolicy === policy.key
                          ? styles.selectorCardActive
                          : ''
                      }`}
                      key={`tenant-auto-assign-policy-${policy.key}`}
                      onClick={() =>
                        setGrowthOperationalCaseAutoAssignmentPolicy(policy.key)
                      }
                      type="button"
                    >
                      <span>{policy.label}</span>
                      <small>{policy.summary}</small>
                    </button>
                  ))}
                </div>

                {currentTenancy ? (
                  <div className={styles.inlineActionRow}>
                    <small className={styles.muted}>
                      Pack por defecto actual:{' '}
                      {describeGrowthOperationalCaseAutoAssignmentPolicy(
                        growthOperationalCaseAutoAssignmentSettings?.defaultPolicyKey ??
                          'balanced',
                      )}
                    </small>
                    <button
                      className={styles.ghostButton}
                      disabled={
                        growthActionLoading ===
                          `save-auto-assign-settings:${currentTenancy.tenant.slug}` ||
                        growthOperationalCaseAutoAssignmentPolicy ===
                          (growthOperationalCaseAutoAssignmentSettings?.defaultPolicyKey ??
                            'balanced')
                      }
                      onClick={() =>
                        void handleSaveGrowthOperationalCaseAutoAssignmentSettings()
                      }
                      type="button"
                    >
                      {growthActionLoading ===
                      `save-auto-assign-settings:${currentTenancy.tenant.slug}`
                        ? 'Guardando pack...'
                        : 'Guardar pack por defecto'}
                    </button>
                  </div>
                ) : null}

                <div className={styles.selectorGrid}>
                  <button
                    className={`${styles.selectorCard} ${
                      growthOperationalCaseRoutingFilter === 'all'
                        ? styles.selectorCardActive
                        : ''
                    }`}
                    onClick={() => setGrowthOperationalCaseRoutingFilter('all')}
                    type="button"
                  >
                    <span>Todos los lanes</span>
                    <small>
                      {
                        growthOperationalCases.filter(
                          (entry) => entry.status !== 'resolved',
                        ).length
                      }{' '}
                      casos abiertos del tenant
                    </small>
                  </button>
                  {growthOperationalCaseRoutingPolicies.map((policy) => (
                    <button
                      className={`${styles.selectorCard} ${
                        growthOperationalCaseRoutingFilter === policy.key
                          ? styles.selectorCardActive
                          : ''
                      }`}
                      key={`tenant-lane-${policy.key}`}
                      onClick={() => setGrowthOperationalCaseRoutingFilter(policy.key)}
                      type="button"
                    >
                      <span>{policy.label}</span>
                      <small>
                        {currentTenantOperationalCaseCountsByRoutingPolicy[policy.key]}{' '}
                        casos · {policy.summary}
                      </small>
                    </button>
                  ))}
                </div>

                {filteredGrowthOperationalCases.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>
                      No hay casos abiertos para el lane elegido. Puedes promover
                      alertas o colas de ownership para dejarles dueño y estado
                      explícito.
                    </p>
                  </div>
                ) : (
                  <div className={styles.stack}>
                    {visibleGrowthOperationalCaseLanes
                      .filter((lane) => lane.entries.length > 0)
                      .map((lane) => (
                        <div className={styles.stack} key={`tenant-lane-stack-${lane.key}`}>
                          <div className={styles.invoiceCardHeader}>
                            <strong>{lane.label}</strong>
                            <span className={styles.statusPill}>
                              {lane.count} casos
                            </span>
                          </div>
                          <small>{lane.summary}</small>
                          {lane.entries.map((entry) => (
                            <div className={styles.invoiceItemCard} key={entry.id}>
                              <div className={styles.invoiceCardHeader}>
                                <strong>{entry.title}</strong>
                                <span
                                  className={`${styles.statusPill} ${operationalStatusTone(
                                    entry.priority,
                                  )}`}
                                >
                                  {growthOperationalCaseStatusLabel(entry.status)}
                                </span>
                              </div>
                              <small>{entry.summary}</small>
                              <div className={styles.badgeRow}>
                                <span className={styles.badge}>
                                  {growthOperationalCaseTypeLabel(entry.caseType)}
                                </span>
                                <span className={styles.badge}>
                                  {growthOperationalCaseRoutingPolicyLabel(
                                    entry.routingPolicyKey,
                                  )}
                                </span>
                                {entry.caseType === 'follow_up' &&
                                entry.followUpState ? (
                                  <span className={styles.badge}>
                                    {growthOperationalCaseFollowUpStateLabel(
                                      entry.followUpState,
                                    )}
                                  </span>
                                ) : null}
                                <span className={styles.badge}>
                                  {entry.assignedUserEmail ?? 'Sin owner'}
                                </span>
                                {entry.dueAt ? (
                                  <span className={styles.badge}>
                                    Due {formatDate(entry.dueAt)}
                                  </span>
                                ) : null}
                              </div>
                              <small>{entry.nextAction}</small>
                              <small>
                                Lane: {growthOperationalCaseRoutingPolicySummary(entry.routingPolicyKey)}
                              </small>
                              <div className={styles.inlineActionRow}>
                                {entry.caseType === 'follow_up' &&
                                entry.status !== 'resolved' ? (
                                  <>
                                    <button
                                      className={styles.secondaryButton}
                                      disabled={
                                        growthActionLoading ===
                                        `follow-up-case:${entry.id}:pending_team`
                                      }
                                      onClick={() =>
                                        currentTenancy
                                          ? void handleUpdateGrowthOperationalCaseFollowUpState(
                                              {
                                                tenantSlug: currentTenancy.tenant.slug,
                                                caseId: entry.id,
                                                followUpState: 'pending_team',
                                                dueAt: entry.dueAt,
                                              },
                                            )
                                          : undefined
                                      }
                                      type="button"
                                    >
                                      {growthActionLoading ===
                                      `follow-up-case:${entry.id}:pending_team`
                                        ? 'Actualizando...'
                                        : 'Pendiente equipo'}
                                    </button>
                                    <button
                                      className={styles.ghostButton}
                                      disabled={
                                        growthActionLoading ===
                                        `follow-up-case:${entry.id}:scheduled`
                                      }
                                      onClick={() =>
                                        currentTenancy
                                          ? void handleUpdateGrowthOperationalCaseFollowUpState(
                                              {
                                                tenantSlug: currentTenancy.tenant.slug,
                                                caseId: entry.id,
                                                followUpState: 'scheduled',
                                                nextAction:
                                                  entry.nextAction ||
                                                  'Programar el siguiente outreach del equipo.',
                                                dueAt:
                                                  entry.dueAt ??
                                                  new Date(
                                                    Date.now() +
                                                      24 * 60 * 60 * 1000,
                                                  ).toISOString(),
                                              },
                                            )
                                          : undefined
                                      }
                                      type="button"
                                    >
                                      {growthActionLoading ===
                                      `follow-up-case:${entry.id}:scheduled`
                                        ? 'Actualizando...'
                                        : 'Programar'}
                                    </button>
                                    <button
                                      className={styles.ghostButton}
                                      disabled={
                                        growthActionLoading ===
                                        `follow-up-case:${entry.id}:waiting_customer`
                                      }
                                      onClick={() =>
                                        currentTenancy
                                          ? void handleUpdateGrowthOperationalCaseFollowUpState(
                                              {
                                                tenantSlug: currentTenancy.tenant.slug,
                                                caseId: entry.id,
                                                followUpState: 'waiting_customer',
                                                nextAction:
                                                  'Esperar respuesta del cliente antes del siguiente outreach.',
                                                dueAt: null,
                                              },
                                            )
                                          : undefined
                                      }
                                      type="button"
                                    >
                                      {growthActionLoading ===
                                      `follow-up-case:${entry.id}:waiting_customer`
                                        ? 'Actualizando...'
                                        : 'Esperando cliente'}
                                    </button>
                                  </>
                                ) : null}
                                {entry.status === 'open' ? (
                                  <button
                                    className={styles.secondaryButton}
                                    disabled={
                                      growthActionLoading === `take-case:${entry.id}`
                                    }
                                    onClick={() =>
                                      currentTenancy
                                        ? void handleTakeGrowthOperationalCase(
                                            currentTenancy.tenant.slug,
                                            entry.id,
                                          )
                                        : undefined
                                    }
                                    type="button"
                                  >
                                    {growthActionLoading === `take-case:${entry.id}`
                                      ? 'Tomando...'
                                      : 'Tomar'}
                                  </button>
                                ) : null}
                                {entry.status !== 'resolved' ? (
                                  <button
                                    className={styles.ghostButton}
                                    disabled={
                                      growthActionLoading === `resolve-case:${entry.id}`
                                    }
                                    onClick={() =>
                                      currentTenancy
                                        ? void handleResolveGrowthOperationalCase(
                                            currentTenancy.tenant.slug,
                                            entry.id,
                                          )
                                        : undefined
                                    }
                                    type="button"
                                  >
                                    {growthActionLoading === `resolve-case:${entry.id}`
                                      ? 'Resolviendo...'
                                      : 'Resolver'}
                                  </button>
                                ) : (
                                  <button
                                    className={styles.ghostButton}
                                    disabled={
                                      growthActionLoading === `reopen-case:${entry.id}`
                                    }
                                    onClick={() =>
                                      currentTenancy
                                        ? void handleReopenGrowthOperationalCase(
                                            currentTenancy.tenant.slug,
                                            entry.id,
                                          )
                                        : undefined
                                    }
                                    type="button"
                                  >
                                    {growthActionLoading === `reopen-case:${entry.id}`
                                      ? 'Reabriendo...'
                                      : 'Reabrir'}
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div className={styles.twoColumn}>
                <div className={styles.detailCard}>
                  <div className={styles.sectionHeading}>
                    <div>
                      <span className={styles.label}>Workbench policy</span>
                      <h3>Filtros operativos de conversaciones</h3>
                    </div>
                    <div className={styles.inlineActionRow}>
                      <button
                        className={styles.secondaryButton}
                        disabled={growthLoading || !growthFiltersCustomized}
                        onClick={resetGrowthWorkspacePolicy}
                        type="button"
                      >
                        Resetear policy
                      </button>
                      {growthWorkbench ? (
                        <small className={styles.muted}>
                          Generado {formatDate(growthWorkbench.generatedAt)}
                        </small>
                      ) : null}
                    </div>
                  </div>

                  <div className={styles.badgeRow}>
                    <span className={styles.tokenPill}>
                      Canal: {channelLabel(growthChannelFilter)}
                    </span>
                    <span className={styles.tokenPill}>
                      First response: {firstResponseSlaHours}h
                    </span>
                    <span className={styles.tokenPill}>
                      Follow-up: {followUpSlaHours}h
                    </span>
                    <span className={styles.tokenPill}>
                      Stale: {staleThreadHours}h
                    </span>
                    {growthAssigneeFilter.trim() ? (
                      <span className={styles.tokenPill}>
                        Assignee: {growthAssigneeFilter.trim()}
                      </span>
                    ) : null}
                  </div>

                  <div className={styles.invoiceInlineGrid}>
                    <label className={styles.field}>
                      <span>Canal</span>
                      <select
                        className={styles.selectField}
                        onChange={(event) =>
                          setGrowthChannelFilter(
                            event.target.value === 'manual'
                              ? 'manual'
                              : event.target.value === 'whatsapp'
                                ? 'whatsapp'
                                : 'all',
                          )
                        }
                        value={growthChannelFilter}
                      >
                        <option value="all">Todos</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="manual">Manual</option>
                      </select>
                    </label>

                    <label className={styles.field}>
                      <span>Assignee user id</span>
                      <input
                        onChange={(event) => setGrowthAssigneeFilter(event.target.value)}
                        placeholder="user_123"
                        value={growthAssigneeFilter}
                      />
                    </label>
                  </div>

                  <div className={styles.invoiceInlineGrid}>
                    <label className={styles.field}>
                      <span>First response SLA (h)</span>
                      <input
                        inputMode="numeric"
                        onChange={(event) => setFirstResponseSlaHours(event.target.value)}
                        value={firstResponseSlaHours}
                      />
                    </label>
                    <label className={styles.field}>
                      <span>Follow-up SLA (h)</span>
                      <input
                        inputMode="numeric"
                        onChange={(event) => setFollowUpSlaHours(event.target.value)}
                        value={followUpSlaHours}
                      />
                    </label>
                  </div>

                  <label className={styles.field}>
                    <span>Stale thread (h)</span>
                    <input
                      inputMode="numeric"
                      onChange={(event) => setStaleThreadHours(event.target.value)}
                      value={staleThreadHours}
                    />
                  </label>

                  {growthWorkbench ? (
                    <div className={styles.invoiceKpiGrid}>
                      <div className={styles.commercialCard}>
                        <span className={styles.muted}>Open</span>
                        <strong>{growthWorkbench.summary.openThreadCount}</strong>
                      </div>
                      <div className={styles.commercialCard}>
                        <span className={styles.muted}>Unassigned</span>
                        <strong>{growthWorkbench.summary.unassignedThreadCount}</strong>
                      </div>
                      <div className={styles.commercialCard}>
                        <span className={styles.muted}>Waiting on team</span>
                        <strong>{growthWorkbench.summary.waitingOnTeamCount}</strong>
                      </div>
                      <div className={styles.commercialCard}>
                        <span className={styles.muted}>Stale</span>
                        <strong>{growthWorkbench.summary.staleThreadCount}</strong>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.emptyState}>
                      <p>{workbenchEmptyMessage}</p>
                    </div>
                  )}
                </div>

                <div className={styles.detailCard}>
                  <div className={styles.sectionHeading}>
                    <div>
                      <span className={styles.label}>Operational monitor</span>
                      <h3>Accion manual desde la UI</h3>
                    </div>
                    {whatsappMonitorSummary ? (
                      <span
                        className={`${styles.statusPill} ${operationalStatusTone(
                          whatsappMonitorSummary.overallStatus,
                        )}`}
                      >
                        {operationalStatusLabel(
                          whatsappMonitorSummary.overallStatus,
                        )}
                      </span>
                    ) : null}
                  </div>

                  <label className={styles.checkboxField}>
                    <input
                      checked={monitorAutoRunReadyRetries}
                      disabled={!canManageGrowthConversations}
                      onChange={(event) =>
                        setMonitorAutoRunReadyRetries(event.target.checked)
                      }
                      type="checkbox"
                    />
                    <span>Auto-run ready retries durante el monitor</span>
                  </label>

                  <label className={styles.field}>
                    <span>Retry ready limit</span>
                    <input
                      disabled={!canManageGrowthConversations}
                      inputMode="numeric"
                      onChange={(event) => setMonitorRetryReadyLimit(event.target.value)}
                      value={monitorRetryReadyLimit}
                    />
                  </label>

                  <button
                    className={styles.primaryButton}
                    disabled={
                      !canManageGrowthConversations ||
                      growthActionLoading === 'run-monitor'
                    }
                    onClick={() => void handleRunGrowthOperationalMonitor()}
                    type="button"
                  >
                    {growthActionLoading === 'run-monitor'
                      ? 'Ejecutando monitor...'
                      : 'Ejecutar monitor'}
                  </button>

                  {!canManageGrowthConversations ? (
                    <p className={styles.muted}>
                      Esta accion requiere <code>growth.conversations.manage</code>.
                    </p>
                  ) : null}

                  {whatsappMonitorSummary ? (
                    <div className={styles.stack}>
                      <div className={styles.invoiceKpiGrid}>
                        <div className={styles.commercialCard}>
                          <span className={styles.muted}>Alerts</span>
                          <strong>{whatsappMonitorSummary.totalAlertCount}</strong>
                        </div>
                        <div className={styles.commercialCard}>
                          <span className={styles.muted}>Critical</span>
                          <strong>{whatsappMonitorSummary.criticalAlertCount}</strong>
                        </div>
                        <div className={styles.commercialCard}>
                          <span className={styles.muted}>Warnings</span>
                          <strong>{whatsappMonitorSummary.warningAlertCount}</strong>
                        </div>
                        <div className={styles.commercialCard}>
                          <span className={styles.muted}>Retries run</span>
                          <strong>
                            {whatsappMonitorSummary.retryRunnerSummary?.retriedCount ?? 0}
                          </strong>
                        </div>
                      </div>
                      <small className={styles.muted}>
                        Ultima ejecucion {formatDate(whatsappMonitorSummary.generatedAt)}
                      </small>
                      <div className={styles.badgeRow}>
                        <span className={styles.badge}>
                          Runner:{' '}
                          {whatsappMonitorSummary.retryRunnerExecuted
                            ? 'ejecutado'
                            : 'solo evaluacion'}
                        </span>
                        <span className={styles.badge}>
                          Ready now:{' '}
                          {whatsappMonitorSummary.retryRunnerSummary?.readyNowCount ?? 0}
                        </span>
                        <span className={styles.badge}>
                          Cooldown:{' '}
                          {whatsappMonitorSummary.retryRunnerSummary
                            ?.skippedCooldownCount ?? 0}
                        </span>
                      </div>
                      {latestMonitorExecutions.length > 0 ? (
                        <div className={styles.stack}>
                          <small className={styles.muted}>
                            Ultimos retries evaluados por el monitor
                          </small>
                          {latestMonitorExecutions.map((execution) => (
                            <div
                              className={styles.invoiceItemCard}
                              key={`${execution.sourceMessageId}-${execution.retryMessageId ?? 'no-retry'}`}
                            >
                              <div className={styles.invoiceCardHeader}>
                                <strong>{execution.sourceMessageId}</strong>
                                <span className={styles.statusPill}>
                                  {retryDispositionLabel(execution.disposition)}
                                </span>
                              </div>
                              <small>
                                Estado {humanizeKey(execution.status)} · backoff{' '}
                                {execution.backoffMinutes} min
                              </small>
                              <small>
                                Proximo retry {formatDate(execution.nextRetryAt)}
                              </small>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className={styles.emptyState}>
                      <p>
                        Todavia no corrimos el monitor manual desde la UI en esta
                        sesion.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.twoColumn}>
                <div className={styles.stack}>
                  <div className={styles.sectionHeading}>
                    <div>
                      <span className={styles.label}>Operational alerts</span>
                      <h3>Lo que hoy pide atencion</h3>
                    </div>
                    {acknowledgedAlertCount > 0 ? (
                      <small className={styles.muted}>
                        {acknowledgedAlertCount} reconocidas
                      </small>
                    ) : null}
                  </div>

                  {leadingOperationalAlerts.length === 0 ? (
                    <div className={styles.emptyState}>
                      <p>No hay alertas activas en el resumen actual.</p>
                    </div>
                  ) : (
                    leadingOperationalAlerts.map((alert) => {
                      const acknowledgement =
                        currentTenantAlertAcknowledgements.get(alert.key) ?? null;
                      const existingCase =
                        currentTenantOperationalCasesBySourceKey.get(
                          `alert:${alert.key}`,
                        ) ?? null;

                      return (
                      <div
                        className={`${styles.invoiceItemCard} ${
                          growthDrilldownTarget?.kind === 'alert' &&
                          growthDrilldownTarget.key === alert.key
                            ? styles.drilldownCardActive
                            : ''
                        }`}
                        key={alert.key}
                      >
                        <div className={styles.invoiceCardHeader}>
                          <strong>{alert.title}</strong>
                          <span
                            className={`${styles.statusPill} ${operationalStatusTone(
                              alert.severity === 'critical' ? 'critical' : 'warning',
                            )}`}
                          >
                            {alert.severity === 'critical' ? 'Critica' : 'Warning'}
                          </span>
                        </div>
                        {acknowledgement ? (
                          <small>
                            Reconocida {formatDate(acknowledgement.acknowledgedAt)}
                            {acknowledgement.acknowledgedByEmail
                              ? ` por ${acknowledgement.acknowledgedByEmail}`
                              : ''}
                          </small>
                        ) : null}
                        <small>{alert.summary}</small>
                        <div className={styles.badgeRow}>
                          {alert.provider ? (
                            <span className={styles.badge}>{alert.provider}</span>
                          ) : null}
                          {alert.providerTaxonomyDetail ? (
                            <span className={styles.badge}>
                              {humanizeKey(alert.providerTaxonomyDetail)}
                            </span>
                          ) : null}
                          {alert.failureClass ? (
                            <span className={styles.badge}>
                              {humanizeKey(alert.failureClass)}
                            </span>
                          ) : null}
                          {existingCase ? (
                            <span className={styles.badge}>
                              Caso {growthOperationalCaseStatusLabel(existingCase.status)}
                            </span>
                          ) : null}
                        </div>
                        <small>
                          Observado {alert.observedValue} / threshold{' '}
                          {alert.thresholdValue}{' '}
                          {alert.thresholdUnit === 'rate' ? '(rate)' : '(count)'}
                        </small>
                        <small>{alert.recommendedAction}</small>
                        <div className={styles.inlineActionRow}>
                          <button
                            className={styles.ghostButton}
                            onClick={() =>
                              setGrowthDrilldownTarget({
                                kind: 'alert',
                                key: alert.key,
                              })
                            }
                            type="button"
                          >
                            Ver detalle
                          </button>
                          <button
                            className={styles.secondaryButton}
                            onClick={() => void toggleGrowthAlertAcknowledgement(alert)}
                            type="button"
                          >
                            {acknowledgement
                              ? 'Quitar reconocimiento'
                              : 'Reconocer alerta'}
                          </button>
                          {existingCase ? (
                            <button
                              className={styles.secondaryButton}
                              disabled={
                                growthActionLoading === `take-case:${existingCase.id}` ||
                                growthActionLoading === `resolve-case:${existingCase.id}`
                              }
                              onClick={() =>
                                void (
                                  existingCase.status === 'open'
                                    ? handleTakeGrowthOperationalCase(
                                        currentTenancy?.tenant.slug ?? '',
                                        existingCase.id,
                                      )
                                    : handleResolveGrowthOperationalCase(
                                        currentTenancy?.tenant.slug ?? '',
                                        existingCase.id,
                                      )
                                )
                              }
                              type="button"
                            >
                              {existingCase.status === 'open'
                                ? 'Tomar caso'
                                : 'Resolver caso'}
                            </button>
                          ) : (
                            <button
                              className={styles.secondaryButton}
                              disabled={
                                !currentTenancy ||
                                growthActionLoading === `create-case:alert:${alert.key}`
                              }
                              onClick={() =>
                                currentTenancy
                                  ? void handleCreateGrowthOperationalCase({
                                      tenantSlug: currentTenancy.tenant.slug,
                                      sourceKey: `alert:${alert.key}`,
                                      caseType: 'alert_escalation',
                                      priority: alert.severity,
                                      title: alert.title,
                                      summary: alert.summary,
                                      nextAction: alert.recommendedAction,
                                      alertKey: alert.key,
                                    })
                                  : undefined
                              }
                              type="button"
                            >
                              {growthActionLoading === `create-case:alert:${alert.key}`
                                ? 'Creando...'
                                : 'Crear caso'}
                            </button>
                          )}
                        </div>
                      </div>
                    )})
                  )}
                </div>

                <div className={styles.stack}>
                  <div className={styles.sectionHeading}>
                    <div>
                      <span className={styles.label}>Provider taxonomy</span>
                      <h3>Familias dominantes de fallo</h3>
                    </div>
                  </div>

                  {leadingProviderTaxonomy.length === 0 ? (
                    <div className={styles.emptyState}>
                      <p>Sin taxonomias de fallo relevantes en el resumen actual.</p>
                    </div>
                  ) : (
                    leadingProviderTaxonomy.map((entry) => (
                      <div
                        className={`${styles.invoiceItemCard} ${
                          growthDrilldownTarget?.kind === 'taxonomy' &&
                          growthDrilldownTarget.key ===
                            `${entry.provider}-${entry.providerTaxonomyFamily}-${entry.providerTaxonomyDetail}`
                            ? styles.drilldownCardActive
                            : ''
                        }`}
                        key={`${entry.provider}-${entry.providerTaxonomyFamily}-${entry.providerTaxonomyDetail}`}
                      >
                        <div className={styles.invoiceCardHeader}>
                          <strong>
                            {humanizeKey(entry.providerTaxonomyDetail)}
                          </strong>
                          <span className={styles.statusPill}>
                            {entry.messageCount} msgs
                          </span>
                        </div>
                        <small>
                          {entry.provider} · {humanizeKey(entry.providerTaxonomyFamily)}
                        </small>
                        <small>
                          {humanizeKey(entry.failureClass)} ·{' '}
                          {humanizeKey(entry.failurePhase)}
                        </small>
                        <div className={styles.inlineActionRow}>
                          <button
                            className={styles.ghostButton}
                            onClick={() =>
                              setGrowthDrilldownTarget({
                                kind: 'taxonomy',
                                key: `${entry.provider}-${entry.providerTaxonomyFamily}-${entry.providerTaxonomyDetail}`,
                              })
                            }
                            type="button"
                          >
                            Ver detalle
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className={styles.twoColumn}>
                <div className={styles.stack}>
                  <div className={styles.sectionHeading}>
                    <div>
                      <span className={styles.label}>Error codes</span>
                      <h3>Top codigos del provider</h3>
                    </div>
                  </div>

                  {leadingProviderErrors.length === 0 ? (
                    <div className={styles.emptyState}>
                      <p>No hay errores de provider relevantes en este momento.</p>
                    </div>
                  ) : (
                    leadingProviderErrors.map((entry) => (
                      <div
                        className={`${styles.invoiceItemCard} ${
                          growthDrilldownTarget?.kind === 'error' &&
                          growthDrilldownTarget.key ===
                            `${entry.provider}-${entry.providerErrorCode}-${entry.providerTaxonomyDetail}`
                            ? styles.drilldownCardActive
                            : ''
                        }`}
                        key={`${entry.provider}-${entry.providerErrorCode}-${entry.providerTaxonomyDetail}`}
                      >
                        <div className={styles.invoiceCardHeader}>
                          <strong>{entry.providerErrorCode}</strong>
                          <span className={styles.statusPill}>
                            {entry.occurrenceCount} casos
                          </span>
                        </div>
                        <small>
                          {humanizeKey(entry.providerTaxonomyDetail)} ·{' '}
                          {humanizeKey(entry.retryDisposition)}
                        </small>
                        <small>
                          {entry.latestProviderStatusDetail ??
                            entry.latestFailureReason ??
                            'Sin detalle adicional'}
                        </small>
                        <div className={styles.inlineActionRow}>
                          <button
                            className={styles.ghostButton}
                            onClick={() =>
                              setGrowthDrilldownTarget({
                                kind: 'error',
                                key: `${entry.provider}-${entry.providerErrorCode}-${entry.providerTaxonomyDetail}`,
                              })
                            }
                            type="button"
                          >
                            Ver detalle
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className={styles.stack}>
                  <div className={styles.sectionHeading}>
                    <div>
                      <span className={styles.label}>Conversation queue</span>
                      <h3>Threads mas urgentes del workbench</h3>
                    </div>
                  </div>

                  {workbenchThreads.length === 0 ? (
                    <div className={styles.emptyState}>
                      <p>{workbenchEmptyMessage}</p>
                    </div>
                  ) : (
                    workbenchThreads.map((thread) => (
                      <div
                        className={`${styles.invoiceItemCard} ${
                          growthDrilldownTarget?.kind === 'thread' &&
                          growthDrilldownTarget.key === thread.threadId
                            ? styles.drilldownCardActive
                            : ''
                        }`}
                        key={thread.threadId}
                      >
                        <div className={styles.invoiceCardHeader}>
                          <strong>{thread.subject}</strong>
                          <span className={styles.statusPill}>
                            {humanizeKey(thread.priority)}
                          </span>
                        </div>
                        <small>
                          {channelLabel(thread.channel)} · {humanizeKey(thread.nextActionOwner)}
                        </small>
                        <small>
                          First response {humanizeKey(thread.firstResponseStatus)} ·
                          Follow-up {humanizeKey(thread.followUpStatus)}
                        </small>
                        <small>
                          {thread.hoursSinceLastActivity}h desde ultima actividad ·{' '}
                          {thread.assigneeUserId ?? 'sin owner'}
                        </small>
                        <div className={styles.inlineActionRow}>
                          <button
                            className={styles.ghostButton}
                            onClick={() =>
                              setGrowthDrilldownTarget({
                                kind: 'thread',
                                key: thread.threadId,
                              })
                            }
                            type="button"
                          >
                            Ver detalle
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className={styles.twoColumn}>
                <div className={styles.detailCard}>
                  <div className={styles.sectionHeading}>
                    <div>
                      <span className={styles.label}>Drill-down inspector</span>
                      <h3>Detalle puntual del item seleccionado</h3>
                    </div>
                  </div>

                  {!growthDrilldownTarget ? (
                    <div className={styles.emptyState}>
                      <p>Selecciona una alerta, taxonomia, error, thread o entrada de historial para inspeccionarla mejor.</p>
                    </div>
                  ) : selectedGrowthAlert ? (
                    <div className={styles.stack}>
                      <div className={styles.invoiceCardHeader}>
                        <strong>{selectedGrowthAlert.title}</strong>
                        <span
                          className={`${styles.statusPill} ${operationalStatusTone(
                            selectedGrowthAlert.severity === 'critical'
                              ? 'critical'
                              : 'warning',
                          )}`}
                        >
                          {selectedGrowthAlert.severity === 'critical'
                            ? 'Critica'
                            : 'Warning'}
                        </span>
                      </div>
                      <small>{selectedGrowthAlert.summary}</small>
                      <div className={styles.badgeRow}>
                        <span className={styles.badge}>
                          Threshold: {selectedGrowthAlert.thresholdKey}
                        </span>
                        <span className={styles.badge}>
                          Observado: {selectedGrowthAlert.observedValue}
                        </span>
                        <span className={styles.badge}>
                          Threshold value: {selectedGrowthAlert.thresholdValue}
                        </span>
                        {selectedGrowthAlert.provider ? (
                          <span className={styles.badge}>
                            Provider: {selectedGrowthAlert.provider}
                          </span>
                        ) : null}
                      </div>
                      <small>{selectedGrowthAlert.recommendedAction}</small>
                    </div>
                  ) : selectedGrowthTaxonomy ? (
                    <div className={styles.stack}>
                      <div className={styles.invoiceCardHeader}>
                        <strong>
                          {humanizeKey(selectedGrowthTaxonomy.providerTaxonomyDetail)}
                        </strong>
                        <span className={styles.statusPill}>
                          {selectedGrowthTaxonomy.messageCount} msgs
                        </span>
                      </div>
                      <small>
                        {selectedGrowthTaxonomy.provider} ·{' '}
                        {humanizeKey(
                          selectedGrowthTaxonomy.providerTaxonomyFamily,
                        )}
                      </small>
                      <div className={styles.badgeRow}>
                        <span className={styles.badge}>
                          Failure class:{' '}
                          {humanizeKey(selectedGrowthTaxonomy.failureClass)}
                        </span>
                        <span className={styles.badge}>
                          Phase: {humanizeKey(selectedGrowthTaxonomy.failurePhase)}
                        </span>
                        <span className={styles.badge}>
                          Retryable: {selectedGrowthTaxonomy.retryableCount}
                        </span>
                        <span className={styles.badge}>
                          Permanent: {selectedGrowthTaxonomy.permanentCount}
                        </span>
                      </div>
                    </div>
                  ) : selectedGrowthErrorCode ? (
                    <div className={styles.stack}>
                      <div className={styles.invoiceCardHeader}>
                        <strong>{selectedGrowthErrorCode.providerErrorCode}</strong>
                        <span className={styles.statusPill}>
                          {selectedGrowthErrorCode.occurrenceCount} casos
                        </span>
                      </div>
                      <small>
                        {selectedGrowthErrorCode.provider} ·{' '}
                        {humanizeKey(
                          selectedGrowthErrorCode.providerTaxonomyDetail,
                        )}
                      </small>
                      <div className={styles.badgeRow}>
                        <span className={styles.badge}>
                          Retry: {retryDispositionLabel(selectedGrowthErrorCode.retryDisposition)}
                        </span>
                        <span className={styles.badge}>
                          Failure class:{' '}
                          {humanizeKey(selectedGrowthErrorCode.failureClass)}
                        </span>
                        <span className={styles.badge}>
                          Phase: {humanizeKey(selectedGrowthErrorCode.failurePhase)}
                        </span>
                      </div>
                      <small>
                        {selectedGrowthErrorCode.latestProviderStatusDetail ??
                          selectedGrowthErrorCode.latestFailureReason ??
                          'Sin detalle adicional'}
                      </small>
                    </div>
                  ) : selectedGrowthThread ? (
                    <div className={styles.stack}>
                      <div className={styles.invoiceCardHeader}>
                        <strong>{selectedGrowthThread.subject}</strong>
                        <span className={styles.statusPill}>
                          {humanizeKey(selectedGrowthThread.priority)}
                        </span>
                      </div>
                      <small>
                        {channelLabel(selectedGrowthThread.channel)} ·{' '}
                        {humanizeKey(selectedGrowthThread.nextActionOwner)}
                      </small>
                      <div className={styles.badgeRow}>
                        <span className={styles.badge}>
                          First response:{' '}
                          {humanizeKey(selectedGrowthThread.firstResponseStatus)}
                        </span>
                        <span className={styles.badge}>
                          Follow-up:{' '}
                          {humanizeKey(selectedGrowthThread.followUpStatus)}
                        </span>
                        <span className={styles.badge}>
                          Stale: {humanizeKey(selectedGrowthThread.staleStatus)}
                        </span>
                        <span className={styles.badge}>
                          Owner: {selectedGrowthThread.assigneeUserId ?? 'sin owner'}
                        </span>
                      </div>
                      <small>
                        {selectedGrowthThread.hoursSinceLastActivity}h desde ultima
                        actividad · {selectedGrowthThread.hoursSinceOpened}h desde apertura
                      </small>
                    </div>
                  ) : selectedGrowthHistoryEntry ? (
                    <div className={styles.stack}>
                      <div className={styles.invoiceCardHeader}>
                        <strong>
                          {selectedGrowthHistoryEntry.operationalAlerts[0]?.title ??
                            'Corrida sin alertas activas'}
                        </strong>
                        <span
                          className={`${styles.statusPill} ${operationalStatusTone(
                            selectedGrowthHistoryEntry.overallStatus,
                          )}`}
                        >
                          {operationalStatusLabel(selectedGrowthHistoryEntry.overallStatus)}
                        </span>
                      </div>
                      <small>
                        Fuente {selectedGrowthHistoryEntry.triggerSource} ·{' '}
                        {formatDate(selectedGrowthHistoryEntry.generatedAt)}
                      </small>
                      <div className={styles.badgeRow}>
                        <span className={styles.badge}>
                          Alerts: {selectedGrowthHistoryEntry.totalAlertCount}
                        </span>
                        <span className={styles.badge}>
                          Critical: {selectedGrowthHistoryEntry.criticalAlertCount}
                        </span>
                        <span className={styles.badge}>
                          Warnings: {selectedGrowthHistoryEntry.warningAlertCount}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.emptyState}>
                      <p>El item seleccionado ya no esta visible con los datos actuales del tenant.</p>
                    </div>
                  )}
                </div>

                <div className={styles.detailCard}>
                  <div className={styles.sectionHeading}>
                    <div>
                      <span className={styles.label}>Alert history</span>
                      <h3>Bitacora compartida del monitor</h3>
                    </div>
                  </div>

                  {visibleAlertHistory.length === 0 ? (
                    <div className={styles.emptyState}>
                      <p>
                        Todavia no hay corridas compartidas del monitor para este tenant.
                        Cuando un operador o el scheduler lo ejecuten, veremos la
                        bitacora operativa aqui.
                      </p>
                    </div>
                  ) : (
                    visibleAlertHistory.map((entry) => (
                      <div
                        className={`${styles.invoiceItemCard} ${
                          growthDrilldownTarget?.kind === 'history' &&
                          growthDrilldownTarget.key === entry.id
                            ? styles.drilldownCardActive
                            : ''
                        }`}
                        key={entry.id}
                      >
                        <div className={styles.invoiceCardHeader}>
                          <strong>
                            {entry.operationalAlerts[0]?.title ?? 'Corrida sin alertas'}
                          </strong>
                          <span
                            className={`${styles.statusPill} ${operationalStatusTone(
                              entry.overallStatus,
                            )}`}
                          >
                            {operationalStatusLabel(entry.overallStatus)}
                          </span>
                        </div>
                        <small>
                          {entry.triggerSource} · {formatDate(entry.generatedAt)}
                        </small>
                        <small>
                          {entry.totalAlertCount} alerts · {entry.criticalAlertCount}{' '}
                          criticas · {entry.warningAlertCount} warnings
                        </small>
                        <div className={styles.inlineActionRow}>
                          <button
                            className={styles.ghostButton}
                            onClick={() =>
                              setGrowthDrilldownTarget({
                                kind: 'history',
                                key: entry.id,
                              })
                            }
                            type="button"
                          >
                            Ver detalle
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
                </>
              )}
            </div>
          )}
        </section>

        <section className={styles.adminPanel}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.label}>AI Operations Console</span>
              <h2>Superficie transversal del tenant para handoffs y approvals</h2>
            </div>
            {session &&
            currentTenancy &&
            (canReadGrowthConversations || canReadInvoicingReports) ? (
              <div className={styles.inlineActionRow}>
                <button
                  className={styles.ghostButton}
                  disabled={
                    tenantAiOperationsSummaryLoading ||
                    tenantAiSuggestionWorkspaceLoading ||
                    tenantAiApprovalWorkspaceLoading ||
                    tenantAiActivityFeedLoading ||
                    tenantAiMemoryWorkspaceLoading ||
                    tenantAiHealthWorkspaceLoading ||
                    tenantAiEvaluationWorkspaceLoading ||
                    tenantAiGovernanceWorkspaceLoading ||
                    tenantAiPolicySimulationWorkspaceLoading ||
                    tenantAiApprovalDesignWorkspaceLoading ||
                    tenantAiApprovalCapacityWorkspaceLoading ||
                    tenantAiApprovalSlaWorkspaceLoading ||
                    tenantAiApprovalStaffingWorkspaceLoading ||
                    tenantAiApprovalStaffingPlanWorkspaceLoading ||
                    tenantAiApprovalRolloutWorkspaceLoading ||
                    tenantAiApprovalReadinessWorkspaceLoading ||
                    tenantAiApprovalLaunchWorkspaceLoading
                  }
                  onClick={() => {
                    void refreshTenantAiOperationsConsole();
                  }}
                  type="button"
                >
                  {tenantAiOperationsSummaryLoading ||
                  tenantAiSuggestionWorkspaceLoading ||
                  tenantAiApprovalWorkspaceLoading ||
                  tenantAiActivityFeedLoading ||
                  tenantAiMemoryWorkspaceLoading ||
                  tenantAiHealthWorkspaceLoading ||
                  tenantAiEvaluationWorkspaceLoading ||
                  tenantAiGovernanceWorkspaceLoading ||
                  tenantAiPolicySimulationWorkspaceLoading ||
                  tenantAiApprovalDesignWorkspaceLoading ||
                  tenantAiApprovalCapacityWorkspaceLoading ||
                  tenantAiApprovalSlaWorkspaceLoading ||
                  tenantAiApprovalStaffingWorkspaceLoading ||
                  tenantAiApprovalStaffingPlanWorkspaceLoading ||
                  tenantAiApprovalRolloutWorkspaceLoading ||
                  tenantAiApprovalReadinessWorkspaceLoading ||
                  tenantAiApprovalLaunchWorkspaceLoading
                    ? 'Refrescando AI ops...'
                    : 'Refrescar AI ops'}
                </button>
              </div>
            ) : null}
          </div>

          {!session ? (
            <div className={styles.emptyState}>
              <p>Primero carguemos la sesión para abrir la consola transversal de AI.</p>
            </div>
          ) : !currentTenancy ? (
            <div className={styles.emptyState}>
              <p>Selecciona un tenant actual para habilitar la superficie operativa de AI.</p>
            </div>
          ) : !canReadGrowthConversations && !canReadInvoicingReports ? (
            <div className={styles.emptyState}>
              <p>
                Este tenant todavía no expone permisos de lectura para los agentes AI
                listos, así que la consola transversal queda bloqueada.
              </p>
            </div>
          ) : (
            <div className={styles.stack}>
              <div className={styles.twoColumn}>
                <div className={styles.detailCard}>
                <div className={styles.sectionHeading}>
                  <div>
                    <span className={styles.label}>Operations snapshot</span>
                    <h3>Estado consolidado del tenant</h3>
                  </div>
                  <span className={styles.statusPill}>
                    {tenantAiOperationsSummary
                      ? formatDate(tenantAiOperationsSummary.generatedAt)
                      : 'sin snapshot'}
                  </span>
                </div>

                <div className={styles.commercialMetricsGrid}>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Approvals totales</span>
                    <strong>
                      {tenantAiOperationsSummary?.approvalWorkspace.counts
                        .totalApprovalRequests ?? 0}
                    </strong>
                    <small>Solicitudes humanas acumuladas en los agentes AI.</small>
                  </div>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Handoffs totales</span>
                    <strong>
                      {tenantAiOperationsSummary?.handoffWorkspace.counts
                        .totalSuggestionRuns ?? 0}
                    </strong>
                    <small>Runs auditable preparados en el tenant.</small>
                  </div>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Pendientes de review</span>
                    <strong>
                      {tenantAiOperationsSummary?.actionCenter.counts
                        .pendingApprovalRequests ?? 0}
                    </strong>
                    <small>Aprobaciones esperando una decisión humana.</small>
                  </div>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Listos para escalar</span>
                    <strong>
                      {tenantAiOperationsSummary?.actionCenter.counts
                        .reviewableSuggestionRuns ?? 0}
                    </strong>
                    <small>Handoffs listos para pedir revisión humana.</small>
                  </div>
                </div>

                {tenantAiOperationsSummary?.approvalWorkspace
                  .oldestPendingApprovalRequest ? (
                  <div className={styles.assistCueCard}>
                    <strong>Cola prioritaria</strong>
                    <small>
                      {
                        tenantAiOperationsSummary.approvalWorkspace
                          .oldestPendingApprovalRequest.summary
                      }
                    </small>
                    <small>
                      Pendiente desde{' '}
                      {formatDate(
                        tenantAiOperationsSummary.approvalWorkspace
                          .oldestPendingApprovalRequest.createdAt,
                      )}
                    </small>
                  </div>
                ) : null}

                {tenantAiOperationsSummary?.handoffWorkspace.latestSuggestionRun ? (
                  <div className={styles.assistCueCard}>
                    <strong>Último handoff generado</strong>
                    <small>
                      {
                        tenantAiOperationsSummary.handoffWorkspace
                          .latestSuggestionRun.summary
                      }
                    </small>
                    <small>
                      Generado{' '}
                      {formatDate(
                        tenantAiOperationsSummary.handoffWorkspace
                          .latestSuggestionRun.createdAt,
                      )}{' '}
                      ·{' '}
                      {aiAgentCatalogByKey.get(
                        tenantAiOperationsSummary.handoffWorkspace
                          .latestSuggestionRun.agentKey,
                      )?.title ??
                        fallbackAiAgentTitle(
                          tenantAiOperationsSummary.handoffWorkspace
                            .latestSuggestionRun.agentKey,
                        )}
                    </small>
                  </div>
                ) : null}

                {tenantAiOperationsSummaryLoading && !tenantAiOperationsSummary ? (
                  <small className={styles.muted}>
                    Cargando snapshot transversal de AI...
                  </small>
                ) : null}
                </div>
                <div className={styles.detailCard}>
                  <div className={styles.sectionHeading}>
                    <div>
                      <span className={styles.label}>Quick actions</span>
                      <h3>Operar sin entrar al workspace embebido</h3>
                    </div>
                  </div>

                  <div className={styles.stack}>
                    <span className={styles.muted}>Handoffs recientes</span>
                    {tenantAiHandoffWorkspaceSummary?.recentSuggestionRuns
                      .slice(0, 2)
                      .map((entry) => {
                        const isInvoiceAgent =
                          entry.agentKey === 'invoice-document-assistant';
                        const actionKey = isInvoiceAgent
                          ? `request-invoice-ai-approval:${entry.id}`
                          : `request-ai-approval:${entry.id}`;
                        const canRequestHumanReview =
                          entry.approvalSummary.status === 'not_requested' ||
                          entry.approvalSummary.status === 'rejected';

                        return (
                          <div className={styles.assistCueCard} key={`ops-run:${entry.id}`}>
                            <strong>{entry.summary}</strong>
                            <small>
                              {formatDate(entry.createdAt)} ·{' '}
                              {aiAgentCatalogByKey.get(entry.agentKey)?.title ??
                                fallbackAiAgentTitle(entry.agentKey)}
                            </small>
                            <div className={styles.inlineActions}>
                              <button
                                className={styles.ghostButton}
                                type="button"
                                onClick={() => {
                                  void handleOpenTenantAiWorkspaceSuggestionRunDetail(
                                    entry.id,
                                  );
                                }}
                                disabled={
                                  growthActionLoading ===
                                  `load-tenant-ai-run-detail:${entry.id}`
                                }
                              >
                                Ver detalle
                              </button>
                              {canRequestHumanReview ? (
                                <button
                                  className={styles.secondaryButton}
                                  type="button"
                                  onClick={() => {
                                    void handleRequestTenantAiWorkspaceSuggestionRunApproval(
                                      entry.agentKey,
                                      entry.id,
                                    );
                                  }}
                                  disabled={
                                    (isInvoiceAgent
                                      ? actionLoading
                                      : growthActionLoading) === actionKey
                                  }
                                >
                                  Pedir revisión
                                </button>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}

                    {tenantAiApprovalWorkspaceSummary?.recentApprovalRequests.length ? (
                      <>
                        <span className={styles.muted}>Approvals recientes</span>
                        {tenantAiApprovalWorkspaceSummary.recentApprovalRequests
                          .slice(0, 2)
                          .map((entry) => {
                            const isInvoiceAgent =
                              entry.agentKey === 'invoice-document-assistant';
                            const reviewActionKey = isInvoiceAgent
                              ? `review-invoice-ai-approval:${entry.id}`
                              : `review-ai-approval:${entry.id}`;
                            const reviewLoading =
                              (isInvoiceAgent ? actionLoading : growthActionLoading) ===
                              reviewActionKey;

                            return (
                              <div
                                className={styles.assistCueCard}
                                key={`ops-approval:${entry.id}`}
                              >
                                <strong>{entry.summary}</strong>
                                <small>
                                  {formatDate(entry.createdAt)} ·{' '}
                                  {humanizeKey(entry.status)}
                                </small>
                                <div className={styles.inlineActions}>
                                  <button
                                    className={styles.ghostButton}
                                    type="button"
                                    onClick={() => {
                                      void handleOpenTenantAiWorkspaceSuggestionRunDetail(
                                        entry.suggestionRunId,
                                      );
                                    }}
                                    disabled={
                                      growthActionLoading ===
                                      `load-tenant-ai-run-detail:${entry.suggestionRunId}`
                                    }
                                  >
                                    Ver handoff
                                  </button>
                                  {entry.status === 'pending' ? (
                                    <button
                                      className={styles.secondaryButton}
                                      type="button"
                                      onClick={() => {
                                        void handleReviewTenantAiApprovalWorkspaceRequest(
                                          entry.agentKey,
                                          entry.id,
                                          'approved',
                                        );
                                      }}
                                      disabled={reviewLoading}
                                    >
                                      Aprobar
                                    </button>
                                  ) : null}
                                </div>
                              </div>
                            );
                          })}
                      </>
                    ) : null}

                    {tenantAiSuggestionWorkspaceLoading &&
                    tenantAiApprovalWorkspaceLoading &&
                    !tenantAiHandoffWorkspaceSummary &&
                    !tenantAiApprovalWorkspaceSummary ? (
                      <small className={styles.muted}>
                        Cargando cola operacional de AI...
                      </small>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className={styles.detailCard}>
                <div className={styles.sectionHeading}>
                  <div>
                    <span className={styles.label}>Activity feed</span>
                    <h3>Timeline transversal de handoffs y approvals</h3>
                  </div>
                  <span className={styles.statusPill}>
                    {tenantAiActivityFeed ? formatDate(tenantAiActivityFeed.generatedAt) : 'sin feed'}
                  </span>
                </div>

                <div className={styles.inlineActions}>
                  {tenantAiActivityFeedFilterOptions.map(({ key, label }) => (
                    <button
                      key={`ai-activity-filter:${key}`}
                      className={
                        tenantAiActivityFeedFilter === key
                          ? styles.secondaryButton
                          : styles.ghostButton
                      }
                      type="button"
                      onClick={() => {
                        setTenantAiActivityFeedFilter(key);
                      }}
                      disabled={tenantAiActivityFeedLoading}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className={styles.stack}>
                  {tenantAiActivityFeed?.entries.length ? (
                    tenantAiActivityFeed.entries.map((entry) => {
                      const isInvoiceAgent =
                        entry.agentKey === 'invoice-document-assistant';
                      const isPendingApprovalRequest =
                        entry.eventType === 'approval_requested' &&
                        entry.approvalRequestId !== null;
                      const reviewActionKey =
                        entry.approvalRequestId === null
                          ? null
                          : isInvoiceAgent
                            ? `review-invoice-ai-approval:${entry.approvalRequestId}`
                            : `review-ai-approval:${entry.approvalRequestId}`;

                      return (
                        <div
                          className={styles.assistCueCard}
                          key={`ai-activity:${entry.id}`}
                        >
                          <div className={styles.invoiceCardHeader}>
                            <strong>{entry.summary}</strong>
                            <span className={styles.statusPill}>
                              {humanizeAiActivityFeedEventType(entry.eventType)}
                            </span>
                          </div>
                          <small>
                            {formatDate(entry.occurredAt)} ·{' '}
                            {aiAgentCatalogByKey.get(entry.agentKey)?.title ??
                              fallbackAiAgentTitle(entry.agentKey)}
                          </small>
                          <small>{entry.detail}</small>
                          <div className={styles.inlineActions}>
                            <button
                              className={styles.ghostButton}
                              type="button"
                              onClick={() => {
                                void handleOpenTenantAiWorkspaceSuggestionRunDetail(
                                  entry.suggestionRunId,
                                );
                              }}
                              disabled={
                                growthActionLoading ===
                                `load-tenant-ai-run-detail:${entry.suggestionRunId}`
                              }
                            >
                              Ver handoff
                            </button>
                            {isPendingApprovalRequest && reviewActionKey ? (
                              <button
                                className={styles.secondaryButton}
                                type="button"
                                onClick={() => {
                                  void handleReviewTenantAiApprovalWorkspaceRequest(
                                    entry.agentKey,
                                    entry.approvalRequestId as string,
                                    'approved',
                                  );
                                }}
                                disabled={
                                  (isInvoiceAgent ? actionLoading : growthActionLoading) ===
                                  reviewActionKey
                                }
                              >
                                Aprobar
                              </button>
                            ) : null}
                          </div>
                        </div>
                      );
                    })
                  ) : tenantAiActivityFeedLoading ? (
                    <small className={styles.muted}>
                      Cargando timeline transversal de AI...
                    </small>
                  ) : (
                    <div className={styles.emptyState}>
                      <p>
                        Todavía no hay eventos para este filtro en la operación transversal
                        de AI.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.detailCard}>
                <div className={styles.sectionHeading}>
                  <div>
                    <span className={styles.label}>AI evaluation workspace</span>
                    <h3>Calidad de outcomes revisados por agente</h3>
                  </div>
                  <span
                    className={`${styles.statusPill} ${operationalStatusTone(
                      tenantAiEvaluationWorkspace?.overallStatus ?? 'healthy',
                    )}`}
                  >
                    {tenantAiEvaluationWorkspace
                      ? operationalStatusLabel(
                          tenantAiEvaluationWorkspace.overallStatus,
                        )
                      : 'sin evaluación'}
                  </span>
                </div>

                <div className={styles.commercialMetricsGrid}>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Outcomes revisados</span>
                    <strong>
                      {tenantAiEvaluationWorkspace?.counts.reviewedApprovalRequests ?? 0}
                    </strong>
                    <small>Total de decisiones humanas ya registradas.</small>
                  </div>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Aprobados</span>
                    <strong>
                      {tenantAiEvaluationWorkspace?.counts
                        .approvedReviewedApprovalRequests ?? 0}
                    </strong>
                    <small>Handoffs que sí superaron la revisión humana.</small>
                  </div>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Rechazados</span>
                    <strong>
                      {tenantAiEvaluationWorkspace?.counts
                        .rejectedReviewedApprovalRequests ?? 0}
                    </strong>
                    <small>Casos donde la revisión humana frenó el handoff.</small>
                  </div>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Agentes evaluados</span>
                    <strong>
                      {tenantAiEvaluationWorkspace?.counts.agentsWithReviewedOutcomes ?? 0}
                    </strong>
                    <small>Agentes con señal suficiente para leer calidad.</small>
                  </div>
                </div>

                <div className={styles.stack}>
                  {tenantAiEvaluationWorkspace?.agents.length ? (
                    tenantAiEvaluationWorkspace.agents.map((agent) => (
                      <div
                        className={styles.assistCueCard}
                        key={`ai-evaluation:${agent.agentKey}`}
                      >
                        <div className={styles.invoiceCardHeader}>
                          <strong>{agent.title}</strong>
                          <span
                            className={`${styles.statusPill} ${operationalStatusTone(
                              agent.status,
                            )}`}
                          >
                            {operationalStatusLabel(agent.status)}
                          </span>
                        </div>
                        <small>
                          {humanizeKey(agent.domainKey)} · {agent.reviewedApprovalRequestsCount}{' '}
                          reviewed · {agent.approvedReviewedApprovalRequestsCount}{' '}
                          approved · {agent.rejectedReviewedApprovalRequestsCount}{' '}
                          rejected
                        </small>
                        <small>
                          Approval rate:{' '}
                          {agent.approvalRatePercentage === null
                            ? 'sin data'
                            : `${agent.approvalRatePercentage}%`}
                        </small>
                        {agent.latestReviewedAt ? (
                          <small>
                            Última revisión {formatDate(agent.latestReviewedAt)}
                          </small>
                        ) : null}
                        <div className={styles.stack}>
                          {agent.notes.map((note, index) => (
                            <small key={`ai-evaluation-note:${agent.agentKey}:${index}`}>
                              {note}
                            </small>
                          ))}
                        </div>
                        <div className={styles.inlineActions}>
                          {agent.latestReviewedApprovalRequest ? (
                            <button
                              className={styles.ghostButton}
                              type="button"
                              onClick={() => {
                                void handleOpenTenantAiWorkspaceSuggestionRunDetail(
                                  agent.latestReviewedApprovalRequest!.suggestionRunId,
                                );
                              }}
                              disabled={
                                growthActionLoading ===
                                `load-tenant-ai-run-detail:${agent.latestReviewedApprovalRequest.suggestionRunId}`
                              }
                            >
                              Abrir último resultado
                            </button>
                          ) : null}
                        </div>
                      </div>
                    ))
                  ) : tenantAiEvaluationWorkspaceLoading ? (
                    <small className={styles.muted}>
                      Cargando evaluación transversal de AI...
                    </small>
                  ) : (
                    <div className={styles.emptyState}>
                      <p>
                        Aún no hay resultados humanos suficientes para evaluar estos
                        agentes.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.detailCard}>
                <div className={styles.sectionHeading}>
                  <div>
                    <span className={styles.label}>AI health workspace</span>
                    <h3>Observabilidad operativa por agente</h3>
                  </div>
                  <span
                    className={`${styles.statusPill} ${operationalStatusTone(
                      tenantAiHealthWorkspace?.overallStatus ?? 'healthy',
                    )}`}
                  >
                    {tenantAiHealthWorkspace
                      ? operationalStatusLabel(tenantAiHealthWorkspace.overallStatus)
                      : 'sin salud'}
                  </span>
                </div>

                <div className={styles.commercialMetricsGrid}>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Healthy</span>
                    <strong>{tenantAiHealthWorkspace?.counts.healthyAgents ?? 0}</strong>
                    <small>Agentes sin fricción operativa inmediata.</small>
                  </div>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Warning</span>
                    <strong>{tenantAiHealthWorkspace?.counts.warningAgents ?? 0}</strong>
                    <small>Agentes con handoffs o posture que piden atención.</small>
                  </div>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Critical</span>
                    <strong>{tenantAiHealthWorkspace?.counts.criticalAgents ?? 0}</strong>
                    <small>Agentes con approvals pendientes activos.</small>
                  </div>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Agentes visibles</span>
                    <strong>{tenantAiHealthWorkspace?.counts.totalAgents ?? 0}</strong>
                    <small>Scope actual de observabilidad transversal.</small>
                  </div>
                </div>

                <div className={styles.stack}>
                  {tenantAiHealthWorkspace?.agents.length ? (
                    tenantAiHealthWorkspace.agents.map((agent) => (
                      <div
                        className={styles.assistCueCard}
                        key={`ai-health:${agent.agentKey}`}
                      >
                        <div className={styles.invoiceCardHeader}>
                          <strong>{agent.title}</strong>
                          <span
                            className={`${styles.statusPill} ${operationalStatusTone(
                              agent.status,
                            )}`}
                          >
                            {operationalStatusLabel(agent.status)}
                          </span>
                        </div>
                        <small>
                          {humanizeKey(agent.domainKey)} · {agent.pendingApprovalRequestsCount}{' '}
                          pending approvals · {agent.reviewableSuggestionRunsCount}{' '}
                          reviewable handoffs
                        </small>
                        {agent.recentActivityAt ? (
                          <small>
                            Última actividad {formatDate(agent.recentActivityAt)}
                          </small>
                        ) : null}
                        <div className={styles.stack}>
                          {agent.notes.map((note, index) => (
                            <small key={`ai-health-note:${agent.agentKey}:${index}`}>
                              {note}
                            </small>
                          ))}
                        </div>
                        <div className={styles.inlineActions}>
                          {agent.latestSuggestionRun ? (
                            <button
                              className={styles.ghostButton}
                              type="button"
                              onClick={() => {
                                void handleOpenTenantAiWorkspaceSuggestionRunDetail(
                                  agent.latestSuggestionRun!.id,
                                );
                              }}
                              disabled={
                                growthActionLoading ===
                                `load-tenant-ai-run-detail:${agent.latestSuggestionRun.id}`
                              }
                            >
                              Abrir handoff
                            </button>
                          ) : null}
                          {agent.oldestPendingApprovalRequest ? (
                            <button
                              className={styles.secondaryButton}
                              type="button"
                              onClick={() => {
                                void handleReviewTenantAiApprovalWorkspaceRequest(
                                  agent.agentKey,
                                  agent.oldestPendingApprovalRequest!.id,
                                  'approved',
                                );
                              }}
                              disabled={
                                (agent.agentKey === 'invoice-document-assistant'
                                  ? actionLoading
                                  : growthActionLoading) ===
                                (agent.agentKey === 'invoice-document-assistant'
                                  ? `review-invoice-ai-approval:${agent.oldestPendingApprovalRequest.id}`
                                  : `review-ai-approval:${agent.oldestPendingApprovalRequest.id}`)
                              }
                            >
                              Resolver pendiente
                            </button>
                          ) : null}
                        </div>
                      </div>
                    ))
                  ) : tenantAiHealthWorkspaceLoading ? (
                    <small className={styles.muted}>
                      Cargando observabilidad transversal de AI...
                    </small>
                  ) : (
                    <div className={styles.emptyState}>
                      <p>
                        Todavía no hay suficiente señal operativa para construir salud por
                        agente en este tenant.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.detailCard}>
                <div className={styles.sectionHeading}>
                  <div>
                    <span className={styles.label}>AI governance workspace</span>
                    <h3>Guardrails, approvals y postura por agente</h3>
                  </div>
                  <span className={styles.statusPill}>
                    {tenantAiGovernanceWorkspace
                      ? formatDate(tenantAiGovernanceWorkspace.generatedAt)
                      : 'sin gobernanza'}
                  </span>
                </div>

                <div className={styles.commercialMetricsGrid}>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Agentes visibles</span>
                    <strong>{tenantAiGovernanceWorkspace?.counts.totalAgents ?? 0}</strong>
                    <small>Agentes listos y gobernados en este tenant.</small>
                  </div>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Suggestion mode</span>
                    <strong>
                      {tenantAiGovernanceWorkspace?.counts.suggestionModeAgents ?? 0}
                    </strong>
                    <small>Agentes que hoy operan en modo sugerencia.</small>
                  </div>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Guarded planned</span>
                    <strong>
                      {tenantAiGovernanceWorkspace?.counts
                        .guardedExecutionPlannedAgents ?? 0}
                    </strong>
                    <small>Agentes con ejecución guardada todavía bloqueada.</small>
                  </div>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Tools con fricción</span>
                    <strong>
                      {(tenantAiGovernanceWorkspace?.counts.approvalRequiredTools ??
                        0) +
                        (tenantAiGovernanceWorkspace?.counts.blockedTools ?? 0)}
                    </strong>
                    <small>Tools que exigen approval o siguen bloqueados.</small>
                  </div>
                </div>

                <div className={styles.stack}>
                  {tenantAiGovernanceWorkspace?.agents.length ? (
                    tenantAiGovernanceWorkspace.agents.map((agent) => (
                      <div
                        className={styles.assistCueCard}
                        key={`ai-governance:${agent.agentKey}`}
                      >
                        <div className={styles.invoiceCardHeader}>
                          <strong>{agent.title}</strong>
                          <span className={styles.statusPill}>
                            {humanizeKey(agent.domainKey)}
                          </span>
                        </div>
                        <small>
                          Prompt pack {agent.promptPack.key}@{agent.promptPack.version} ·{' '}
                          {agent.promptPack.mode}
                        </small>
                        <small>
                          Tool posture: {agent.toolAccessSummary.allowedCount} allowed,{' '}
                          {agent.toolAccessSummary.approvalRequiredCount}{' '}
                          approval-required, {agent.toolAccessSummary.blockedCount} blocked
                        </small>
                        <small>
                          Execution modes:{' '}
                          {agent.executionModes
                            .map((entry) => humanizeKey(entry))
                            .join(', ')}
                        </small>
                        <div className={styles.stack}>
                          {agent.notes.map((note, index) => (
                            <small key={`ai-governance-note:${agent.agentKey}:${index}`}>
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
                            Review requirements:{' '}
                            {agent.reviewRequirementHighlights.join(' | ')}
                          </small>
                          <small>
                            Blocked capabilities:{' '}
                            {agent.blockedCapabilities.length
                              ? agent.blockedCapabilities.join(', ')
                              : 'none'}
                          </small>
                        </div>
                      </div>
                    ))
                  ) : tenantAiGovernanceWorkspaceLoading ? (
                    <small className={styles.muted}>
                      Cargando gobernanza transversal de AI...
                    </small>
                  ) : (
                    <div className={styles.emptyState}>
                      <p>
                        Todavía no hay suficiente información para resumir la
                        gobernanza transversal de AI en este tenant.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.detailCard}>
                <div className={styles.sectionHeading}>
                  <div>
                    <span className={styles.label}>AI policy simulation</span>
                    <h3>Que cambiaria si abrimos guarded execution con review</h3>
                  </div>
                  <span className={styles.statusPill}>
                    {tenantAiPolicySimulationWorkspace
                      ? formatDate(tenantAiPolicySimulationWorkspace.generatedAt)
                      : 'sin simulacion'}
                  </span>
                </div>

                <div className={styles.commercialMetricsGrid}>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Agentes simulados</span>
                    <strong>
                      {tenantAiPolicySimulationWorkspace?.counts.totalAgents ?? 0}
                    </strong>
                    <small>Agentes visibles dentro del escenario review-first.</small>
                  </div>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Con delta</span>
                    <strong>
                      {tenantAiPolicySimulationWorkspace?.counts
                        .agentsWithSimulationDelta ?? 0}
                    </strong>
                    <small>Agentes que cambiarian de postura si abrimos el gate.</small>
                  </div>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Promovidos a review</span>
                    <strong>
                      {tenantAiPolicySimulationWorkspace?.counts
                        .toolsPromotedToApprovalRequired ?? 0}
                    </strong>
                    <small>Tools que pasarian de blocked a approval-required.</small>
                  </div>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Siguen bloqueados</span>
                    <strong>
                      {tenantAiPolicySimulationWorkspace?.counts.toolsStillBlocked ?? 0}
                    </strong>
                    <small>Tools que ni asi conviene abrir todavia.</small>
                  </div>
                </div>

                <div className={styles.stack}>
                  {tenantAiPolicySimulationWorkspace?.agents.length ? (
                    tenantAiPolicySimulationWorkspace.agents.map((agent) => (
                      <div
                        className={styles.assistCueCard}
                        key={`ai-policy-simulation:${agent.agentKey}`}
                      >
                        <div className={styles.invoiceCardHeader}>
                          <strong>{agent.title}</strong>
                          <span
                            className={`${styles.statusPill} ${policySimulationStatusTone(
                              agent.simulationStatus,
                            )}`}
                          >
                            {policySimulationStatusLabel(agent.simulationStatus)}
                          </span>
                        </div>
                        <small>
                          {humanizeKey(agent.domainKey)} · current {agent.currentToolAccessSummary.allowedCount}
                          /{agent.currentToolAccessSummary.approvalRequiredCount}/
                          {agent.currentToolAccessSummary.blockedCount} {'->'} simulated{' '}
                          {agent.simulatedToolAccessSummary.allowedCount}/
                          {agent.simulatedToolAccessSummary.approvalRequiredCount}/
                          {agent.simulatedToolAccessSummary.blockedCount}
                        </small>
                        <small>
                          Approval policies:{' '}
                          {agent.approvalPolicyKeys.length
                            ? agent.approvalPolicyKeys.join(', ')
                            : 'none'}
                        </small>
                        <div className={styles.stack}>
                          {agent.notes.map((note, index) => (
                            <small
                              key={`ai-policy-simulation-note:${agent.agentKey}:${index}`}
                            >
                              {note}
                            </small>
                          ))}
                        </div>
                        <div className={styles.stack}>
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
                  ) : tenantAiPolicySimulationWorkspaceLoading ? (
                    <small className={styles.muted}>
                      Cargando simulacion de politicas de AI...
                    </small>
                  ) : (
                    <div className={styles.emptyState}>
                      <p>
                        Todavia no hay suficiente contexto para simular cambios de
                        postura en este tenant.
                      </p>
                    </div>
                  )}
                </div>
              </div>

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
                      {tenantAiApprovalDesignWorkspace?.counts
                        .currentExpectedHumanReviews ?? 0}
                    </strong>
                    <small>Backlog y handoffs reviewables bajo la postura actual.</small>
                  </div>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Human reviews simulados</span>
                    <strong>
                      {tenantAiApprovalDesignWorkspace?.counts
                        .simulatedExpectedHumanReviews ?? 0}
                    </strong>
                    <small>Carga esperada si pasamos a un diseno mas review-first.</small>
                  </div>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Touches extra</span>
                    <strong>
                      {tenantAiApprovalDesignWorkspace?.counts
                        .addedHumanReviewTouches ?? 0}
                    </strong>
                    <small>Revision adicional que el nuevo diseno agregaria.</small>
                  </div>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Agentes con mas revision</span>
                    <strong>
                      {tenantAiApprovalDesignWorkspace?.counts
                        .agentsWithHeavierReview ?? 0}
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
                          {agent.currentExpectedReviewLoad.totalHumanReviewTouches}{' '}
                          {'->'} simulated load{' '}
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
                            <small
                              key={`ai-approval-design-note:${agent.agentKey}:${index}`}
                            >
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
                      {tenantAiApprovalCapacityWorkspace?.counts
                        .currentMinimumReviewsPerDay ?? 0}
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
                      {tenantAiApprovalCapacityWorkspace?.counts
                        .agentsAtCapacityRisk ?? 0}
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
                            <small
                              key={`ai-approval-capacity-note:${agent.agentKey}:${index}`}
                            >
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
                      {tenantAiApprovalSlaWorkspace?.counts.simulatedBacklogTouches ??
                        0}
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
                      <div
                        className={styles.assistCueCard}
                        key={`ai-approval-sla:${agent.agentKey}`}
                      >
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
                    <small className={styles.muted}>
                      Cargando SLA de approvals de AI...
                    </small>
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
                      {tenantAiApprovalStaffingWorkspace?.counts
                        .addedReviewerEquivalents ?? 0}
                    </strong>
                    <small>Reviewer-equivalents adicionales que harian falta.</small>
                  </div>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Agentes con gap</span>
                    <strong>
                      {tenantAiApprovalStaffingWorkspace?.counts
                        .agentsNeedingMoreCoverage ?? 0}
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
                            <small
                              key={`ai-approval-staffing-note:${agent.agentKey}:${index}`}
                            >
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
                      {tenantAiApprovalStaffingPlanWorkspace?.counts
                        .agentsRequiringIncrease ?? 0}
                    </strong>
                    <small>Agentes donde el plan pide aumentar cobertura.</small>
                  </div>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Prioridades activas</span>
                    <strong>
                      {tenantAiApprovalStaffingPlanWorkspace?.counts
                        .highestPriorityAgents ?? 0}
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
                    <strong>
                      {tenantAiApprovalRolloutWorkspace?.counts.phase1Agents ?? 0}
                    </strong>
                    <small>Agentes que piden refuerzo antes de abrir el path.</small>
                  </div>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Phase 2</span>
                    <strong>
                      {tenantAiApprovalRolloutWorkspace?.counts.phase2Agents ?? 0}
                    </strong>
                    <small>Agentes que pueden entrar despues sin refuerzo extra.</small>
                  </div>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Hold</span>
                    <strong>
                      {tenantAiApprovalRolloutWorkspace?.counts.holdAgents ?? 0}
                    </strong>
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
                            <small
                              key={`ai-approval-rollout-action:${agent.agentKey}:${index}`}
                            >
                              {action}
                            </small>
                          ))}
                        </div>
                        <div className={styles.stack}>
                          {agent.notes.map((note, index) => (
                            <small
                              key={`ai-approval-rollout-note:${agent.agentKey}:${index}`}
                            >
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
                    <strong>
                      {tenantAiApprovalReadinessWorkspace?.counts.readyNowAgents ?? 0}
                    </strong>
                    <small>Agentes que ya pueden abrir el path con la cobertura actual.</small>
                  </div>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Needs coverage</span>
                    <strong>
                      {tenantAiApprovalReadinessWorkspace?.counts
                        .needsCoverageAgents ?? 0}
                    </strong>
                    <small>Agentes que primero necesitan refuerzo humano o bajar riesgo.</small>
                  </div>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Blocked</span>
                    <strong>
                      {tenantAiApprovalReadinessWorkspace?.counts.blockedAgents ?? 0}
                    </strong>
                    <small>Agentes que siguen cerrados por guardrails de diseño.</small>
                  </div>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Total</span>
                    <strong>
                      {tenantAiApprovalReadinessWorkspace?.counts.totalAgents ?? 0}
                    </strong>
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
                          {approvalSlaStatusLabel(agent.simulatedSlaStatus)} {' · '}
                          extra coverage {agent.additionalReviewerEquivalentsToAssign}
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
                            <small
                              key={`ai-approval-readiness-note:${agent.agentKey}:${index}`}
                            >
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
                    <strong>
                      {tenantAiApprovalLaunchWorkspace?.counts.launchNowAgents ?? 0}
                    </strong>
                    <small>Agentes que podemos abrir en la ventana actual.</small>
                  </div>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Pilot next</span>
                    <strong>
                      {tenantAiApprovalLaunchWorkspace?.counts
                        .pilotAfterCoverageAgents ?? 0}
                    </strong>
                    <small>Agentes que primero necesitan cobertura o estabilizar SLA.</small>
                  </div>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Hold</span>
                    <strong>
                      {tenantAiApprovalLaunchWorkspace?.counts.holdAgents ?? 0}
                    </strong>
                    <small>Agentes que no deberiamos meter todavia en launch scope.</small>
                  </div>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Coverage gap</span>
                    <strong>
                      {tenantAiApprovalLaunchWorkspace?.counts.totalCoverageGap ?? 0}
                    </strong>
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
                          {humanizeKey(agent.domainKey)} · {humanizeKey(agent.launchWindow)} ·
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
                            <small
                              key={`ai-approval-launch-check:${agent.agentKey}:${index}`}
                            >
                              {item}
                            </small>
                          ))}
                        </div>
                        <div className={styles.stack}>
                          {agent.notes.map((note, index) => (
                            <small
                              key={`ai-approval-launch-note:${agent.agentKey}:${index}`}
                            >
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

              <div className={styles.detailCard}>
                <div className={styles.sectionHeading}>
                  <div>
                    <span className={styles.label}>Tenant AI memory</span>
                    <h3>Memoria operativa por agente y dominio</h3>
                  </div>
                  <span className={styles.statusPill}>
                    {tenantAiMemoryWorkspace
                      ? formatDate(tenantAiMemoryWorkspace.generatedAt)
                      : 'sin memoria'}
                  </span>
                </div>

                <div className={styles.commercialMetricsGrid}>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Agentes activos</span>
                    <strong>{tenantAiMemoryWorkspace?.counts.totalAgents ?? 0}</strong>
                    <small>Agentes AI listos y visibles en este tenant.</small>
                  </div>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Con handoffs</span>
                    <strong>
                      {tenantAiMemoryWorkspace?.counts.agentsWithSuggestionRuns ?? 0}
                    </strong>
                    <small>Agentes que ya prepararon al menos un handoff.</small>
                  </div>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Con approvals pendientes</span>
                    <strong>
                      {tenantAiMemoryWorkspace?.counts.agentsWithPendingApprovals ?? 0}
                    </strong>
                    <small>Agentes que hoy esperan revisión humana.</small>
                  </div>
                  <div className={styles.commercialCard}>
                    <span className={styles.muted}>Pending approvals</span>
                    <strong>
                      {tenantAiMemoryWorkspace?.counts.totalPendingApprovalRequests ?? 0}
                    </strong>
                    <small>Backlog humano que la memoria operativa recuerda.</small>
                  </div>
                </div>

                <div className={styles.stack}>
                  {tenantAiMemoryWorkspace?.agents.length ? (
                    tenantAiMemoryWorkspace.agents.map((agent) => (
                      <div
                        className={styles.assistCueCard}
                        key={`ai-memory:${agent.agentKey}`}
                      >
                        <div className={styles.invoiceCardHeader}>
                          <strong>{agent.title}</strong>
                          <span className={styles.statusPill}>
                            {humanizeKey(agent.domainKey)}
                          </span>
                        </div>
                        <small>
                          Prompt pack {agent.promptPack.key}@{agent.promptPack.version} ·{' '}
                          {agent.promptPack.mode}
                        </small>
                        <small>
                          Tool posture: {agent.toolAccessSummary.allowedCount} allowed,{' '}
                          {agent.toolAccessSummary.approvalRequiredCount}{' '}
                          approval-required, {agent.toolAccessSummary.blockedCount} blocked
                        </small>
                        {agent.recentActivityAt ? (
                          <small>
                            Última actividad {formatDate(agent.recentActivityAt)}
                          </small>
                        ) : null}
                        <div className={styles.stack}>
                          {agent.memoryNotes.map((note, index) => (
                            <small key={`ai-memory-note:${agent.agentKey}:${index}`}>
                              {note}
                            </small>
                          ))}
                        </div>
                        <div className={styles.inlineActions}>
                          {agent.latestSuggestionRun ? (
                            <button
                              className={styles.ghostButton}
                              type="button"
                              onClick={() => {
                                void handleOpenTenantAiWorkspaceSuggestionRunDetail(
                                  agent.latestSuggestionRun!.id,
                                );
                              }}
                              disabled={
                                growthActionLoading ===
                                `load-tenant-ai-run-detail:${agent.latestSuggestionRun.id}`
                              }
                            >
                              Abrir último handoff
                            </button>
                          ) : null}
                          {agent.oldestPendingApprovalRequest ? (
                            <button
                              className={styles.secondaryButton}
                              type="button"
                              onClick={() => {
                                void handleReviewTenantAiApprovalWorkspaceRequest(
                                  agent.agentKey,
                                  agent.oldestPendingApprovalRequest!.id,
                                  'approved',
                                );
                              }}
                              disabled={
                                (agent.agentKey === 'invoice-document-assistant'
                                  ? actionLoading
                                  : growthActionLoading) ===
                                (agent.agentKey === 'invoice-document-assistant'
                                  ? `review-invoice-ai-approval:${agent.oldestPendingApprovalRequest.id}`
                                  : `review-ai-approval:${agent.oldestPendingApprovalRequest.id}`)
                              }
                            >
                              Aprobar pendiente más antiguo
                            </button>
                          ) : null}
                        </div>
                      </div>
                    ))
                  ) : tenantAiMemoryWorkspaceLoading ? (
                    <small className={styles.muted}>
                      Cargando memoria transversal de AI...
                    </small>
                  ) : (
                    <div className={styles.emptyState}>
                      <p>
                        La memoria operativa todavía no tiene suficientes señales para este
                        tenant.
                      </p>
                    </div>
                  )}
                </div>
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

              {invoiceDocumentDraftingAssist ? (
                <div className={styles.twoColumn}>
                  <div className={styles.detailCard}>
                    <div className={styles.sectionHeading}>
                      <div>
                        <span className={styles.label}>Invoicing Assist</span>
                        <h3>Surface determinística para drafting documental</h3>
                      </div>
                      <span
                        className={`${styles.statusPill} ${operationalStatusTone(
                          invoiceDocumentDraftingAssist.summary.tone,
                        )}`}
                      >
                        {operationalStatusLabel(
                          invoiceDocumentDraftingAssist.summary.tone,
                        )}
                      </span>
                    </div>

                    <p>{invoiceDocumentDraftingAssist.summary.headline}</p>
                    <small>{invoiceDocumentDraftingAssist.summary.detail}</small>

                    <div className={styles.invoiceKpiGrid}>
                      <div className={styles.commercialCard}>
                        <span className={styles.muted}>Readiness</span>
                        <strong>
                          {invoiceDocumentDraftingAssist.summary.readinessStatus}
                        </strong>
                        <small>Estado base del carril tributario</small>
                      </div>
                      <div className={styles.commercialCard}>
                        <span className={styles.muted}>Outstanding</span>
                        <strong>
                          {formatMoney(
                            invoiceDocumentDraftingAssist.reportSnapshot
                              .outstandingTotalInCents,
                            invoicePortfolioCurrency,
                          )}
                        </strong>
                        <small>Saldo pendiente agregado del tenant</small>
                      </div>
                      <div className={styles.commercialCard}>
                        <span className={styles.muted}>Invoices</span>
                        <strong>
                          {invoiceDocumentDraftingAssist.reportSnapshot.invoiceCount}
                        </strong>
                        <small>Base documental ya registrada</small>
                      </div>
                      <div className={styles.commercialCard}>
                        <span className={styles.muted}>Customers</span>
                        <strong>
                          {invoiceDocumentDraftingAssist.reportSnapshot.customerCount}
                        </strong>
                        <small>Contexto comercial disponible</small>
                      </div>
                    </div>

                    <div className={styles.stack}>
                      <div className={styles.sectionHeading}>
                        <div>
                          <span className={styles.label}>Checklist</span>
                          <h3>Controles formales que la IA debe respetar</h3>
                        </div>
                      </div>
                      {invoiceDocumentDraftingAssist.checklist.map((entry) => (
                        <div className={styles.invoiceItemCard} key={entry.key}>
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
                          <small>{entry.detail}</small>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.detailCard}>
                    <div className={styles.sectionHeading}>
                      <div>
                        <span className={styles.label}>AI Capability Platform</span>
                        <h3>Invoice Document Assistant</h3>
                      </div>
                      {activeInvoiceAiAgent ? (
                        <span
                          className={`${styles.statusPill} ${aiAgentAvailabilityTone(
                            activeInvoiceAiAgent.availability,
                          )}`}
                        >
                          {aiAgentAvailabilityLabel(activeInvoiceAiAgent.availability)}
                        </span>
                      ) : null}
                    </div>

                    {invoiceAssistantAiEnvelope ? (
                      <div className={styles.stack}>
                        <p className={styles.muted}>
                          <strong>{invoiceAssistantAiEnvelope.agent.title}</strong>{' '}
                          recibe este contrato determinístico y se mantiene en modo
                          sugerencia. Ayuda a explicar, revisar y ordenar, pero no
                          firma ni envía documentos.
                        </p>
                        <div className={styles.badgeRow}>
                          <span className={styles.badge}>
                            Surface {invoiceAssistantAiEnvelope.surface.key}
                          </span>
                          <span className={styles.badge}>
                            Prompt pack {invoiceAssistantAiEnvelope.promptPack.key}
                          </span>
                          <span className={styles.badge}>
                            Mode {invoiceAssistantAiEnvelope.mode}
                          </span>
                        </div>
                        <p className={styles.muted}>
                          <strong>
                            {invoiceAssistantAiEnvelope.promptPack.objective}
                          </strong>
                        </p>

                        <div className={styles.actionRow}>
                          <button
                            className={styles.primaryButton}
                            disabled={
                              !canReadInvoicingReports ||
                              actionLoading === 'prepare-invoice-ai-suggestion-run'
                            }
                            onClick={() => void handlePrepareInvoiceAiSuggestionRun()}
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
                          {activeInvoiceAiToolAccess.map((entry) => (
                            <div className={styles.invoiceItemCard} key={entry.tool.key}>
                              <div className={styles.invoiceCardHeader}>
                                <strong>{entry.tool.title}</strong>
                                <span className={styles.statusPill}>
                                  {entry.accessLevel}
                                </span>
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
                          {invoiceAssistantAiSuggestionRuns.length === 0 ? (
                            <div className={styles.emptyState}>
                              <p>Todavia no hay handoffs auditables para este agente.</p>
                            </div>
                          ) : (
                            invoiceAssistantAiSuggestionRuns.slice(0, 3).map((entry) => {
                              const hasPendingApproval =
                                entry.approvalSummary.status === 'pending';
                              const hasApprovedApproval =
                                entry.approvalSummary.status === 'approved';

                              return (
                                <div className={styles.invoiceItemCard} key={entry.id}>
                                  <div className={styles.invoiceCardHeader}>
                                    <strong>{entry.promptPackKey}</strong>
                                    <span className={styles.statusPill}>
                                      {entry.status}
                                    </span>
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
                                            entry.approvalSummary
                                              .latestRequestedAt,
                                        )}`
                                      : ''}
                                  </small>
                                  <div className={styles.actionRow}>
                                    <button
                                      className={styles.ghostButton}
                                      disabled={
                                        actionLoading ===
                                        `load-invoice-ai-run-detail:${entry.id}`
                                      }
                                      onClick={() =>
                                        void handleOpenInvoiceAiSuggestionRunDetail(
                                          entry.id,
                                        )
                                      }
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
                                      onClick={() =>
                                        void handleRequestInvoiceAiSuggestionRunApproval(
                                          entry.id,
                                        )
                                      }
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
                        {selectedInvoiceAiSuggestionRunDetail ? (
                          <div className={styles.stack}>
                            <div className={styles.sectionHeading}>
                              <div>
                                <span className={styles.label}>
                                  Selected handoff
                                </span>
                                <h3>Timeline de aprobación</h3>
                              </div>
                            </div>
                            <div className={styles.invoiceItemCard}>
                              <div className={styles.invoiceCardHeader}>
                                <strong>
                                  {selectedInvoiceAiSuggestionRunDetail.promptPackKey}
                                </strong>
                                <span className={styles.statusPill}>
                                  {humanizeKey(
                                    selectedInvoiceAiSuggestionRunDetail
                                      .approvalSummary.status,
                                  )}
                                </span>
                              </div>
                              <small>
                                {selectedInvoiceAiSuggestionRunDetail.summary}
                              </small>
                              <small>
                                Outputs:{' '}
                                {selectedInvoiceAiSuggestionRunDetail.suggestedOutputKeys.join(
                                  ', ',
                                )}
                              </small>
                              {selectedInvoiceAiSuggestionRunDetail.approvalRequests
                                .length === 0 ? (
                                <small className={styles.muted}>
                                  Todavía no hay approval requests para este
                                  handoff.
                                </small>
                              ) : (
                                selectedInvoiceAiSuggestionRunDetail.approvalRequests.map(
                                  (entry) => (
                                    <div
                                      className={styles.invoiceItemCard}
                                      key={entry.id}
                                    >
                                      <div className={styles.invoiceCardHeader}>
                                        <strong>{entry.policyKey}</strong>
                                        <span className={styles.statusPill}>
                                          {humanizeKey(entry.status)}
                                        </span>
                                      </div>
                                      <small>
                                        Solicitada {formatDate(entry.createdAt)}
                                        {entry.reviewedAt
                                          ? ` · revisada ${formatDate(
                                              entry.reviewedAt,
                                            )}`
                                          : ''}
                                      </small>
                                      {entry.rationale ? (
                                        <small>{entry.rationale}</small>
                                      ) : null}
                                      {entry.reviewNote ? (
                                        <small>{entry.reviewNote}</small>
                                      ) : null}
                                    </div>
                                  ),
                                )
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
                          {invoiceAssistantAiApprovalPolicies.length === 0 ? (
                            <div className={styles.emptyState}>
                              <p>Este agente todavía no expone políticas de revisión.</p>
                            </div>
                          ) : (
                            invoiceAssistantAiApprovalPolicies.map((entry) => (
                              <div className={styles.invoiceItemCard} key={entry.policyKey}>
                                <div className={styles.invoiceCardHeader}>
                                  <strong>{entry.title}</strong>
                                  <span className={styles.statusPill}>
                                    {entry.scope}
                                  </span>
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
                            {(
                              [
                                'all',
                                'pending',
                                'approved',
                                'rejected',
                              ] as const
                            ).map((filter) => (
                              <button
                                key={filter}
                                className={
                                  invoiceAiApprovalStatusFilter === filter
                                    ? styles.secondaryButton
                                    : styles.ghostButton
                                }
                                onClick={() => {
                                  setInvoiceAiApprovalStatusFilter(filter);
                                }}
                                type="button"
                              >
                                {filter === 'all' ? 'Todas' : humanizeKey(filter)}
                              </button>
                            ))}
                          </div>
                          {invoiceAssistantAiApprovalRequests.length === 0 ? (
                            <div className={styles.emptyState}>
                              <p>
                                No hay approvals en estado{' '}
                                {invoiceAiApprovalStatusFilter === 'all'
                                  ? 'visible'
                                  : humanizeKey(invoiceAiApprovalStatusFilter)}
                                .
                              </p>
                            </div>
                          ) : (
                            invoiceAssistantAiApprovalRequests.slice(0, 3).map((entry) => (
                              <div className={styles.invoiceItemCard} key={entry.id}>
                                <div className={styles.invoiceCardHeader}>
                                  <strong>{entry.policyKey}</strong>
                                  <span className={styles.statusPill}>
                                    {entry.status}
                                  </span>
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
                                    onClick={() =>
                                      void handleOpenInvoiceAiSuggestionRunDetail(
                                        entry.suggestionRunId,
                                      )
                                    }
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
                                      onClick={() =>
                                        void handleReviewInvoiceAiApprovalRequest(
                                          entry.id,
                                          'approved',
                                        )
                                      }
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
                                      onClick={() =>
                                        void handleReviewInvoiceAiApprovalRequest(
                                          entry.id,
                                          'rejected',
                                        )
                                      }
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
                          Cuando el envelope AI esté disponible, aquí veremos el
                          handoff auditable del agente documental.
                        </p>
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

                      {extractedCertificateTaxId ? (
                        <div className={styles.detailCard}>
                          <span className={styles.muted}>
                            RUC extraido del certificado
                          </span>
                          <strong>{extractedCertificateTaxId}</strong>
                          <p>
                            {issuerTaxIdMatchesCertificate === true
                              ? 'El perfil fiscal actual ya coincide con el certificado inspeccionado.'
                              : issuerTaxIdMatchesCertificate === false
                                ? 'El RUC del perfil fiscal no coincide con el certificado. Antes de probar CELCER conviene alinearlos.'
                                : 'Todavia falta completar el RUC del perfil fiscal para contrastarlo contra el certificado.'}
                          </p>
                          <button
                            className={styles.secondaryButton}
                            disabled={issuerTaxId.trim() === extractedCertificateTaxId}
                            onClick={() => setIssuerTaxId(extractedCertificateTaxId)}
                            type="button"
                          >
                            Usar RUC del certificado
                          </button>
                          <button
                            className={styles.secondaryButton}
                            disabled={
                              actionLoading === 'sync-issuer-profile-tax-id' ||
                              !currentTenancy ||
                              !invoicingEnabled
                            }
                            onClick={handleSyncIssuerProfileTaxIdFromSignature}
                            type="button"
                          >
                            {actionLoading === 'sync-issuer-profile-tax-id'
                              ? 'Alineando...'
                              : 'Alinear y guardar'}
                          </button>
                        </div>
                      ) : null}

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
                        <>
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

                          <label className={styles.checkboxField}>
                            <input
                              checked={signatureHydrateMetadataFromPkcs12}
                              onChange={(event) =>
                                setSignatureHydrateMetadataFromPkcs12(
                                  event.target.checked,
                                )
                              }
                              type="checkbox"
                            />
                            <span>
                              Hidratar fingerprint y subject desde el PKCS#12 al
                              guardar
                            </span>
                          </label>
                        </>
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
                        firmar, y ahora ya puede producir una firma
                        criptografica inicial aunque XAdES completo siga
                        pendiente.
                      </p>

                      {electronicSignatureMaterialInspection ? (
                        <div className={styles.detailCard}>
                          <span className={styles.muted}>
                            PKCS#12 inspection
                          </span>
                          <h3>
                            {electronicSignatureMaterialInspection.inspection.status ===
                            'likely_usable'
                              ? 'Keystore abrible'
                              : electronicSignatureMaterialInspection.inspection
                                    .status === 'not_applicable'
                                ? 'No aplica'
                                : electronicSignatureMaterialInspection.inspection
                                      .status === 'not_configured'
                                  ? 'Sin configuracion'
                                  : 'Inspeccion con hallazgos'}
                          </h3>
                          <p>
                            {
                              electronicSignatureMaterialInspection.inspection
                                .detail
                            }
                          </p>
                          <div className={styles.invoiceInlineGrid}>
                            <div className={styles.field}>
                              <span>Probe method</span>
                              <input
                                disabled
                                value={
                                  electronicSignatureMaterialInspection.inspection
                                    .probeMethod
                                }
                              />
                            </div>
                            <div className={styles.field}>
                              <span>Encoding</span>
                              <input
                                disabled
                                value={
                                  electronicSignatureMaterialInspection.inspection
                                    .encoding
                                }
                              />
                            </div>
                          </div>
                          <div className={styles.invoiceInlineGrid}>
                            <div className={styles.field}>
                              <span>Extracted fingerprint</span>
                              <input
                                disabled
                                value={
                                  electronicSignatureMaterialInspection.inspection
                                    .extractedFingerprint ?? 'No extraido'
                                }
                              />
                            </div>
                            <div className={styles.field}>
                              <span>Extracted subject</span>
                              <input
                                disabled
                                value={
                                  electronicSignatureMaterialInspection.inspection
                                    .extractedSubjectName ?? 'No extraido'
                                }
                              />
                            </div>
                          </div>
                          <div className={styles.invoiceInlineGrid}>
                            <div className={styles.field}>
                              <span>Extracted issuer</span>
                              <input
                                disabled
                                value={
                                  electronicSignatureMaterialInspection.inspection
                                    .extractedIssuerName ?? 'No extraido'
                                }
                              />
                            </div>
                            <div className={styles.field}>
                              <span>Extracted tax ID</span>
                              <input
                                disabled
                                value={
                                  electronicSignatureMaterialInspection.inspection
                                    .extractedTaxId ?? 'No extraido'
                                }
                              />
                            </div>
                            <div className={styles.field}>
                              <span>Validity status</span>
                              <input
                                disabled
                                value={
                                  electronicSignatureMaterialInspection.inspection
                                    .certificateValidityStatus
                                }
                              />
                            </div>
                          </div>
                          <div className={styles.invoiceInlineGrid}>
                            <div className={styles.field}>
                              <span>Valid from</span>
                              <input
                                disabled
                                value={
                                  electronicSignatureMaterialInspection.inspection
                                    .validFrom ?? 'No extraido'
                                }
                              />
                            </div>
                            <div className={styles.field}>
                              <span>Valid until</span>
                              <input
                                disabled
                                value={
                                  electronicSignatureMaterialInspection.inspection
                                    .validUntil ?? 'No extraido'
                                }
                              />
                            </div>
                          </div>
                          <div className={styles.invoiceInlineGrid}>
                            <div className={styles.field}>
                              <span>Days until expiry</span>
                              <input
                                disabled
                                value={
                                  electronicSignatureMaterialInspection.inspection
                                    .daysUntilExpiry !== null
                                    ? String(
                                        electronicSignatureMaterialInspection
                                          .inspection.daysUntilExpiry,
                                      )
                                    : 'No calculado'
                                }
                              />
                            </div>
                            <div className={styles.field}>
                              <span>Crypto proof</span>
                              <input
                                disabled
                                value={
                                  electronicSignatureMaterialInspection.inspection
                                    .cryptographicProofStatus
                                }
                              />
                            </div>
                          </div>
                          <p>
                            {
                              electronicSignatureMaterialInspection.inspection
                                .cryptographicProofDetail
                            }
                          </p>
                        </div>
                      ) : null}
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
                        `sri_offline_ws` ya empezamos a modelar URLs y,
                        opcionalmente, secretos por tenant sin cambiar el
                        contrato del gateway.
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
                                  ? 'Listo para sandbox remoto con firma interna'
                                  : electronicSandboxReadiness.isReadyForPresignedRemoteSandboxSubmission
                                    ? 'Listo para sandbox remoto con XML prefirmado'
                                    : electronicSandboxReadiness.isReadyForLocalStubSubmission
                                      ? 'Listo para validacion local con stub'
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
                            <div className={styles.detailCard}>
                              <span className={styles.muted}>Local stub</span>
                              <strong>
                                {electronicSandboxReadiness.isReadyForLocalStubSubmission
                                  ? 'Listo'
                                  : 'Pendiente'}
                              </strong>
                            </div>
                            <div className={styles.detailCard}>
                              <span className={styles.muted}>
                                Remote presigned
                              </span>
                              <strong>
                                {electronicSandboxReadiness.isReadyForPresignedRemoteSandboxSubmission
                                  ? 'Listo'
                                  : 'Pendiente'}
                              </strong>
                            </div>
                            <div className={styles.detailCard}>
                              <span className={styles.muted}>
                                Remote internal signer
                              </span>
                              <strong>
                                {electronicSandboxReadiness.isReadyForRemoteSandboxSubmission
                                  ? 'Listo'
                                  : 'Pendiente'}
                              </strong>
                            </div>
                            <div className={styles.detailCard}>
                              <span className={styles.muted}>
                                PKCS#12 interno
                              </span>
                              <strong>
                                {electronicSandboxReadiness.isInternalSignerMaterialReady
                                  ? 'Cargable'
                                  : electronicSandboxReadiness.internalSignerMaterialStatus ===
                                      'not_applicable'
                                    ? 'No aplica'
                                    : electronicSandboxReadiness.internalSignerMaterialStatus ===
                                        'not_configured'
                                      ? 'No configurado'
                                      : 'Pendiente'}
                              </strong>
                              <small>
                                {
                                  electronicSandboxReadiness.internalSignerMaterialDetail
                                }
                              </small>
                            </div>
                            <div className={styles.detailCard}>
                              <span className={styles.muted}>
                                Vigencia certificado
                              </span>
                              <strong>
                                {electronicSandboxReadiness.internalSignerCertificateValidityStatus ===
                                'valid'
                                  ? 'Vigente'
                                  : electronicSandboxReadiness
                                        .internalSignerCertificateValidityStatus ===
                                      'expiring_soon'
                                    ? 'Por vencer'
                                    : electronicSandboxReadiness
                                          .internalSignerCertificateValidityStatus ===
                                        'expired'
                                      ? 'Vencido'
                                      : electronicSandboxReadiness
                                            .internalSignerCertificateValidityStatus ===
                                          'not_yet_valid'
                                        ? 'Aun no vigente'
                                        : electronicSandboxReadiness
                                              .internalSignerCertificateValidityStatus ===
                                            'not_applicable'
                                          ? 'No aplica'
                                          : 'Desconocida'}
                              </strong>
                              <small>
                                {
                                  electronicSandboxReadiness.internalSignerCertificateValidityDetail
                                }
                              </small>
                              {electronicSandboxReadiness.internalSignerCertificateValidUntil ? (
                                <small>
                                  Vence:
                                  {' '}
                                  {
                                    electronicSandboxReadiness.internalSignerCertificateValidUntil
                                  }
                                </small>
                              ) : null}
                            </div>
                            <div className={styles.detailCard}>
                              <span className={styles.muted}>
                                Prueba criptografica
                              </span>
                              <strong>
                                {electronicSandboxReadiness.internalSignerCryptoProofStatus ===
                                'verified'
                                  ? 'Verificada'
                                  : electronicSandboxReadiness
                                        .internalSignerCryptoProofStatus ===
                                      'not_applicable'
                                    ? 'No aplica'
                                    : electronicSandboxReadiness
                                          .internalSignerCryptoProofStatus ===
                                        'unknown'
                                      ? 'Pendiente'
                                      : 'Fallida'}
                              </strong>
                              <small>
                                {
                                  electronicSandboxReadiness.internalSignerCryptoProofDetail
                                }
                              </small>
                            </div>
                            <div className={styles.detailCard}>
                              <span className={styles.muted}>
                                Compatibilidad offline
                              </span>
                              <strong>
                                {electronicSandboxReadiness.internalSignerOfflineCompatibilityStatus ===
                                'verified'
                                  ? 'Verificada'
                                  : electronicSandboxReadiness
                                        .internalSignerOfflineCompatibilityStatus ===
                                      'not_applicable'
                                    ? 'No aplica'
                                    : electronicSandboxReadiness
                                          .internalSignerOfflineCompatibilityStatus ===
                                        'unknown'
                                      ? 'Pendiente'
                                      : 'Fallida'}
                              </strong>
                              <small>
                                {
                                  electronicSandboxReadiness.internalSignerOfflineCompatibilityDetail
                                }
                              </small>
                            </div>
                            <div className={styles.detailCard}>
                              <span className={styles.muted}>
                                Alineacion emisor-certificado
                              </span>
                              <strong>
                                {electronicSandboxReadiness.internalSignerIssuerAlignmentStatus ===
                                'matched'
                                  ? 'Alineado'
                                  : electronicSandboxReadiness.internalSignerIssuerAlignmentStatus ===
                                      'mismatched'
                                    ? 'Desalineado'
                                    : electronicSandboxReadiness.internalSignerIssuerAlignmentStatus ===
                                        'not_applicable'
                                      ? 'No aplica'
                                      : 'Sin evidencia'}
                              </strong>
                              <small>
                                {
                                  electronicSandboxReadiness.internalSignerIssuerAlignmentDetail
                                }
                              </small>
                              {electronicSandboxReadiness.internalSignerExtractedTaxId ? (
                                <small>
                                  RUC extraido:
                                  {' '}
                                  {
                                    electronicSandboxReadiness.internalSignerExtractedTaxId
                                  }
                                </small>
                              ) : null}
                            </div>
                            <div className={styles.detailCard}>
                              <span className={styles.muted}>
                                Ultimo feedback remoto SRI
                              </span>
                              <strong>
                                {electronicSandboxReadiness.latestRemoteSriSubmissionCategory ===
                                'taxpayer_not_registered'
                                  ? 'Emisor no registrado'
                                  : electronicSandboxReadiness.latestRemoteSriSubmissionCategory ===
                                      'xml_structure'
                                    ? 'Estructura XML'
                                    : electronicSandboxReadiness.latestRemoteSriSubmissionCategory ===
                                        'authorization_rejected'
                                      ? 'Autorizacion rechazada'
                                      : electronicSandboxReadiness.latestRemoteSriSubmissionCategory ===
                                          'technical_failure'
                                        ? 'Falla tecnica'
                                        : electronicSandboxReadiness.latestRemoteSriSubmissionSummary
                                          ? 'Registrado'
                                          : 'Sin historial remoto'}
                              </strong>
                              <small>
                                {electronicSandboxReadiness.latestRemoteSriSubmissionSummary ??
                                  'Todavia no existe un envio remoto reciente registrado para este tenant.'}
                              </small>
                              {electronicSandboxReadiness.latestRemoteSriSubmissionOccurredAt ? (
                                <small>
                                  Ultimo intento:
                                  {' '}
                                  {formatDate(
                                    electronicSandboxReadiness.latestRemoteSriSubmissionOccurredAt,
                                  )}
                                  {electronicSandboxReadiness.latestRemoteSriSubmissionStatus
                                    ? ` · ${electronicSandboxReadiness.latestRemoteSriSubmissionStatus}`
                                    : ''}
                                </small>
                              ) : null}
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

                        {selectedInvoiceDetail.documentCode === '04' ||
                        selectedInvoiceDetail.documentCode === '05' ||
                        selectedInvoiceDetail.documentCode === '06' ||
                        selectedInvoiceDetail.documentCode === '07' ? (
                          <div className={styles.detailCard}>
                            <div className={styles.sectionHeading}>
                              <div>
                                <span className={styles.label}>
                                  {selectedInvoiceDetail.documentCode === '05'
                                    ? 'Debit note'
                                    : selectedInvoiceDetail.documentCode === '06'
                                      ? 'Remission guide'
                                    : selectedInvoiceDetail.documentCode === '07'
                                      ? 'Withholding'
                                      : 'Credit note'}
                                </span>
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

                        {selectedInvoiceDetail.documentCode === '06' ? (
                          <div className={styles.detailCard}>
                            <div className={styles.sectionHeading}>
                              <div>
                                <span className={styles.label}>Shipment</span>
                                <h3>Datos de traslado</h3>
                              </div>
                            </div>

                            <div className={styles.invoiceDetailGrid}>
                              <div>
                                <span className={styles.muted}>Transportista</span>
                                <strong>
                                  {findRideAdditionalInfoValue(
                                    selectedInvoiceRide,
                                    'Transportista',
                                  ) ?? 'No registrado'}
                                </strong>
                              </div>
                              <div>
                                <span className={styles.muted}>Identificacion</span>
                                <strong>
                                  {findRideAdditionalInfoValue(
                                    selectedInvoiceRide,
                                    'Identificacion transportista',
                                  ) ?? 'No registrada'}
                                </strong>
                              </div>
                              <div>
                                <span className={styles.muted}>Direccion partida</span>
                                <strong>
                                  {findRideAdditionalInfoValue(
                                    selectedInvoiceRide,
                                    'Direccion partida',
                                  ) ?? 'No registrada'}
                                </strong>
                              </div>
                              <div>
                                <span className={styles.muted}>Direccion llegada</span>
                                <strong>
                                  {findRideAdditionalInfoValue(
                                    selectedInvoiceRide,
                                    'Direccion llegada',
                                  ) ?? 'No registrada'}
                                </strong>
                              </div>
                              <div>
                                <span className={styles.muted}>Fecha inicio</span>
                                <strong>
                                  {formatDate(
                                    findRideAdditionalInfoValue(
                                      selectedInvoiceRide,
                                      'Fecha inicio traslado',
                                    ),
                                  )}
                                </strong>
                              </div>
                              <div>
                                <span className={styles.muted}>Fecha fin</span>
                                <strong>
                                  {formatDate(
                                    findRideAdditionalInfoValue(
                                      selectedInvoiceRide,
                                      'Fecha fin traslado',
                                    ),
                                  )}
                                </strong>
                              </div>
                              <div>
                                <span className={styles.muted}>Placa</span>
                                <strong>
                                  {findRideAdditionalInfoValue(
                                    selectedInvoiceRide,
                                    'Placa',
                                  ) ?? 'No registrada'}
                                </strong>
                              </div>
                              <div>
                                <span className={styles.muted}>Ruta</span>
                                <strong>
                                  {findRideAdditionalInfoValue(
                                    selectedInvoiceRide,
                                    'Ruta',
                                  ) ?? 'No registrada'}
                                </strong>
                              </div>
                            </div>
                          </div>
                        ) : null}

                        {(selectedInvoiceDetail.documentCode ?? '01') === '01' ? (
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

                        {(selectedInvoiceDetail.documentCode ?? '01') === '01' ? (
                          <div className={styles.detailCard}>
                            <div className={styles.sectionHeading}>
                              <div>
                                <span className={styles.label}>Remission guide</span>
                                <h3>Crear borrador `06` desde esta factura</h3>
                              </div>
                            </div>

                            <form className={styles.stack} onSubmit={handleCreateRemissionGuide}>
                              <label className={styles.field}>
                                <span>Motivo de traslado</span>
                                <textarea
                                  onChange={(event) =>
                                    setNewRemissionGuideReason(event.target.value)
                                  }
                                  placeholder="Traslado de mercaderia al cliente."
                                  value={newRemissionGuideReason}
                                />
                              </label>

                              <div className={styles.invoiceInlineGrid}>
                                <label className={styles.field}>
                                  <span>Inicio traslado</span>
                                  <input
                                    onChange={(event) =>
                                      setNewRemissionGuideStartAt(event.target.value)
                                    }
                                    type="datetime-local"
                                    value={newRemissionGuideStartAt}
                                  />
                                </label>
                                <label className={styles.field}>
                                  <span>Fin traslado</span>
                                  <input
                                    onChange={(event) =>
                                      setNewRemissionGuideEndAt(event.target.value)
                                    }
                                    type="datetime-local"
                                    value={newRemissionGuideEndAt}
                                  />
                                </label>
                              </div>

                              <div className={styles.invoiceInlineGrid}>
                                <label className={styles.field}>
                                  <span>Direccion partida</span>
                                  <input
                                    onChange={(event) =>
                                      setNewRemissionGuideDepartureAddress(
                                        event.target.value,
                                      )
                                    }
                                    placeholder="Sucursal Matriz"
                                    value={newRemissionGuideDepartureAddress}
                                  />
                                </label>
                                <label className={styles.field}>
                                  <span>Direccion llegada</span>
                                  <input
                                    onChange={(event) =>
                                      setNewRemissionGuideArrivalAddress(
                                        event.target.value,
                                      )
                                    }
                                    placeholder="Bodega del cliente"
                                    value={newRemissionGuideArrivalAddress}
                                  />
                                </label>
                              </div>

                              <div className={styles.invoiceInlineGrid}>
                                <label className={styles.field}>
                                  <span>Transportista</span>
                                  <input
                                    onChange={(event) =>
                                      setNewRemissionGuideCarrierName(
                                        event.target.value,
                                      )
                                    }
                                    placeholder="Transportes Demo S.A."
                                    value={newRemissionGuideCarrierName}
                                  />
                                </label>
                                <label className={styles.field}>
                                  <span>Tipo identificacion</span>
                                  <select
                                    onChange={(event) =>
                                      setNewRemissionGuideCarrierIdentificationType(
                                        event.target.value as
                                          | '04'
                                          | '05'
                                          | '06'
                                          | '07'
                                          | '08',
                                      )
                                    }
                                    value={newRemissionGuideCarrierIdentificationType}
                                  >
                                    <option value="04">RUC</option>
                                    <option value="05">Cedula</option>
                                    <option value="06">Pasaporte</option>
                                    <option value="07">Consumidor final</option>
                                    <option value="08">Exterior</option>
                                  </select>
                                </label>
                              </div>

                              <div className={styles.invoiceInlineGrid}>
                                <label className={styles.field}>
                                  <span>Identificacion transportista</span>
                                  <input
                                    onChange={(event) =>
                                      setNewRemissionGuideCarrierIdentification(
                                        event.target.value,
                                      )
                                    }
                                    placeholder="1790012345001"
                                    value={newRemissionGuideCarrierIdentification}
                                  />
                                </label>
                                <label className={styles.field}>
                                  <span>Placa</span>
                                  <input
                                    onChange={(event) =>
                                      setNewRemissionGuideVehiclePlate(
                                        event.target.value,
                                      )
                                    }
                                    placeholder="ABC-1234"
                                    value={newRemissionGuideVehiclePlate}
                                  />
                                </label>
                              </div>

                              <div className={styles.invoiceInlineGrid}>
                                <label className={styles.field}>
                                  <span>Ruta</span>
                                  <input
                                    onChange={(event) =>
                                      setNewRemissionGuideRoute(event.target.value)
                                    }
                                    placeholder="Matriz - Cliente"
                                    value={newRemissionGuideRoute}
                                  />
                                </label>
                                <label className={styles.field}>
                                  <span>Fecha emision</span>
                                  <input
                                    onChange={(event) =>
                                      setNewRemissionGuideIssuedAt(
                                        event.target.value,
                                      )
                                    }
                                    type="datetime-local"
                                    value={newRemissionGuideIssuedAt}
                                  />
                                </label>
                              </div>

                              <label className={styles.field}>
                                <span>Notas</span>
                                <input
                                  onChange={(event) =>
                                    setNewRemissionGuideNotes(event.target.value)
                                  }
                                  placeholder="Guia de remision de prueba."
                                  value={newRemissionGuideNotes}
                                />
                              </label>

                              <button
                                className={styles.secondaryButton}
                                disabled={
                                  actionLoading === 'create-remission-guide' ||
                                  !newRemissionGuideReason.trim() ||
                                  !newRemissionGuideStartAt.trim() ||
                                  !newRemissionGuideEndAt.trim() ||
                                  !newRemissionGuideDepartureAddress.trim() ||
                                  !newRemissionGuideArrivalAddress.trim() ||
                                  !newRemissionGuideCarrierName.trim() ||
                                  !newRemissionGuideCarrierIdentification.trim() ||
                                  !newRemissionGuideVehiclePlate.trim()
                                }
                                type="submit"
                              >
                                {actionLoading === 'create-remission-guide'
                                  ? 'Creando guia de remision...'
                                  : 'Crear guia de remision'}
                              </button>
                              <p className={styles.muted}>
                                Este flujo crea un borrador `06` con documento sustento, metadata de traslado y detalle logistico base para continuar el carril electronico.
                              </p>
                            </form>
                          </div>
                        ) : null}

                        {(selectedInvoiceDetail.documentCode ?? '01') === '01' ? (
                          <div className={styles.detailCard}>
                            <div className={styles.sectionHeading}>
                              <div>
                                <span className={styles.label}>Debit note</span>
                                <h3>Crear borrador `05` desde esta factura</h3>
                              </div>
                            </div>

                            <form className={styles.stack} onSubmit={handleCreateDebitNote}>
                              <label className={styles.field}>
                                <span>Motivo</span>
                                <textarea
                                  onChange={(event) =>
                                    setNewDebitNoteReason(event.target.value)
                                  }
                                  placeholder="Interes por mora de la factura origen."
                                  value={newDebitNoteReason}
                                />
                              </label>

                              <div className={styles.invoiceInlineGrid}>
                                <label className={styles.field}>
                                  <span>Valor inicial (centavos)</span>
                                  <input
                                    min="1"
                                    onChange={(event) =>
                                      setNewDebitNoteAmountInCents(event.target.value)
                                    }
                                    placeholder="2500"
                                    step="1"
                                    type="number"
                                    value={newDebitNoteAmountInCents}
                                  />
                                </label>
                                <label className={styles.field}>
                                  <span>Tasa IVA opcional</span>
                                  <select
                                    onChange={(event) =>
                                      setNewDebitNoteTaxRateId(event.target.value)
                                    }
                                    value={newDebitNoteTaxRateId}
                                  >
                                    <option value="">Sin impuesto</option>
                                    {taxRates.map((taxRate) => (
                                      <option key={taxRate.id} value={taxRate.id}>
                                        {taxRate.name} · {formatPercentage(taxRate.percentage)}%
                                      </option>
                                    ))}
                                  </select>
                                </label>
                              </div>

                              <div className={styles.invoiceInlineGrid}>
                                <label className={styles.field}>
                                  <span>Fecha emision</span>
                                  <input
                                    onChange={(event) =>
                                      setNewDebitNoteIssuedAt(event.target.value)
                                    }
                                    type="datetime-local"
                                    value={newDebitNoteIssuedAt}
                                  />
                                </label>
                                <label className={styles.field}>
                                  <span>Notas</span>
                                  <input
                                    onChange={(event) =>
                                      setNewDebitNoteNotes(event.target.value)
                                    }
                                    placeholder="Nota de debito de prueba."
                                    value={newDebitNoteNotes}
                                  />
                                </label>
                              </div>

                              <button
                                className={styles.secondaryButton}
                                disabled={
                                  actionLoading === 'create-debit-note' ||
                                  !newDebitNoteReason.trim() ||
                                  !/^\d+$/.test(newDebitNoteAmountInCents.trim()) ||
                                  Number(newDebitNoteAmountInCents) < 1
                                }
                                type="submit"
                              >
                                {actionLoading === 'create-debit-note'
                                  ? 'Creando nota de debito...'
                                  : 'Crear nota de debito'}
                              </button>
                              <p className={styles.muted}>
                                Este flujo crea un borrador `05` con documento sustento, motivo inicial y una primera linea positiva para continuar el carril electronico.
                              </p>
                            </form>
                          </div>
                        ) : null}

                        {(selectedInvoiceDetail.documentCode ?? '01') === '01' ? (
                          <div className={styles.detailCard}>
                            <div className={styles.sectionHeading}>
                              <div>
                                <span className={styles.label}>Withholding</span>
                                <h3>Crear borrador `07` desde esta factura</h3>
                              </div>
                            </div>

                            <form className={styles.stack} onSubmit={handleCreateWithholding}>
                              <label className={styles.field}>
                                <span>Motivo</span>
                                <textarea
                                  onChange={(event) =>
                                    setNewWithholdingReason(event.target.value)
                                  }
                                  placeholder="Retencion sobre la factura origen."
                                  value={newWithholdingReason}
                                />
                              </label>

                              <div className={styles.invoiceInlineGrid}>
                                <label className={styles.field}>
                                  <span>Valor retenido (centavos)</span>
                                  <input
                                    min="1"
                                    onChange={(event) =>
                                      setNewWithholdingAmountInCents(event.target.value)
                                    }
                                    placeholder="1000"
                                    step="1"
                                    type="number"
                                    value={newWithholdingAmountInCents}
                                  />
                                </label>
                                <label className={styles.field}>
                                  <span>Tasa opcional</span>
                                  <select
                                    onChange={(event) =>
                                      setNewWithholdingTaxRateId(event.target.value)
                                    }
                                    value={newWithholdingTaxRateId}
                                  >
                                    <option value="">Sin tasa</option>
                                    {taxRates.map((taxRate) => (
                                      <option key={taxRate.id} value={taxRate.id}>
                                        {taxRate.name} · {formatPercentage(taxRate.percentage)}%
                                      </option>
                                    ))}
                                  </select>
                                </label>
                              </div>

                              <div className={styles.invoiceInlineGrid}>
                                <label className={styles.field}>
                                  <span>Fecha emision</span>
                                  <input
                                    onChange={(event) =>
                                      setNewWithholdingIssuedAt(event.target.value)
                                    }
                                    type="datetime-local"
                                    value={newWithholdingIssuedAt}
                                  />
                                </label>
                                <label className={styles.field}>
                                  <span>Notas</span>
                                  <input
                                    onChange={(event) =>
                                      setNewWithholdingNotes(event.target.value)
                                    }
                                    placeholder="Comprobante de retencion de prueba."
                                    value={newWithholdingNotes}
                                  />
                                </label>
                              </div>

                              <button
                                className={styles.secondaryButton}
                                disabled={
                                  actionLoading === 'create-withholding' ||
                                  !newWithholdingReason.trim() ||
                                  !/^\d+$/.test(newWithholdingAmountInCents.trim()) ||
                                  Number(newWithholdingAmountInCents) < 1
                                }
                                type="submit"
                              >
                                {actionLoading === 'create-withholding'
                                  ? 'Creando comprobante de retencion...'
                                  : 'Crear comprobante de retencion'}
                              </button>
                              <p className={styles.muted}>
                                Este flujo crea un borrador `07` con documento sustento, motivo inicial y una primera linea para continuar el carril electronico del comprobante de retencion.
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
                                  {event.sriDiagnostics?.summary ? (
                                    <small>
                                      Diagnostico SRI: {event.sriDiagnostics.summary}
                                    </small>
                                  ) : null}
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
                                  {event.sriDiagnostics?.messages.length ? (
                                    <details>
                                      <summary>Mensajes estructurados SRI</summary>
                                      <div className={styles.stack}>
                                        {event.sriDiagnostics.messages.map(
                                          (message, index) => (
                                            <div
                                              className={styles.detailCard}
                                              key={`${event.id}-sri-message-${index}`}
                                            >
                                              <small>
                                                {message.identifier
                                                  ? `Identificador ${message.identifier}`
                                                  : 'Mensaje SRI'}
                                              </small>
                                              <strong>{message.message}</strong>
                                              {message.additionalInfo.map(
                                                (detail, detailIndex) => (
                                                  <small
                                                    key={`${event.id}-sri-message-${index}-detail-${detailIndex}`}
                                                  >
                                                    {detail}
                                                  </small>
                                                ),
                                              )}
                                            </div>
                                          ),
                                        )}
                                      </div>
                                    </details>
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
                                <h3>
                                  {formatElectronicDocumentLabel(
                                    selectedInvoiceDocument.invoice.documentCode,
                                  )}{' '}
                                  {selectedInvoiceDocument.invoice.number}
                                </h3>
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
