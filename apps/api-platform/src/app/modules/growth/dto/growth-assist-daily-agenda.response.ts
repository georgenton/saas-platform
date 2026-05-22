import { TenantGrowthAssistDailyAgendaView } from '@saas-platform/growth-application';

export interface GrowthAssistTaskResponseDto {
  key: string;
  urgency: 'today' | 'soon' | 'watch';
  category: 'reply_now' | 'follow_up' | 'assign_owner' | 'channel_risk';
  title: string;
  summary: string;
  actionLabel: string;
  dueAt: string | null;
  threadId: string | null;
  operationalCaseId: string | null;
}

export interface GrowthAssistConversationCueResponseDto {
  key: string;
  warmth: 'hot' | 'warm' | 'watch';
  title: string;
  summary: string;
  suggestedReply: string;
  nextMove: string;
  threadId: string;
}

export interface GrowthAssistPlaybookResponseDto {
  key: string;
  title: string;
  detail: string;
}

export interface GrowthAssistWaitingCustomerResponseDto {
  caseId: string;
  title: string;
  summary: string;
  nextAction: string;
  assignedUserEmail: string | null;
  dueAt: string | null;
}

export interface GrowthAssistDailyAgendaResponseDto {
  tenantSlug: string;
  generatedAt: string;
  summary: {
    tone: 'healthy' | 'warning' | 'critical';
    headline: string;
    detail: string;
    replyNowCount: number;
    followUpNowCount: number;
    waitingCustomerCount: number;
    queueToOrganizeCount: number;
    channelRiskCount: number;
    savedPolicyKey: 'balanced' | 'owner_queue_first' | 'follow_up_first';
  };
  tasks: GrowthAssistTaskResponseDto[];
  conversationCues: GrowthAssistConversationCueResponseDto[];
  playbooks: GrowthAssistPlaybookResponseDto[];
  waitingCustomerQueue: GrowthAssistWaitingCustomerResponseDto[];
  channelHealth: {
    overallStatus: 'healthy' | 'warning' | 'critical';
    totalAlertCount: number;
    readyRetryCount: number;
    topAlertTitle: string | null;
    topAlertSummary: string | null;
    topAlertRecommendedAction: string | null;
  };
}

export const toGrowthAssistDailyAgendaResponseDto = (
  view: TenantGrowthAssistDailyAgendaView,
): GrowthAssistDailyAgendaResponseDto => ({
  tenantSlug: view.tenantSlug,
  generatedAt: view.generatedAt.toISOString(),
  summary: { ...view.summary },
  tasks: view.tasks.map((task) => ({
    ...task,
    dueAt: task.dueAt?.toISOString() ?? null,
  })),
  conversationCues: view.conversationCues.map((cue) => ({ ...cue })),
  playbooks: view.playbooks.map((playbook) => ({ ...playbook })),
  waitingCustomerQueue: view.waitingCustomerQueue.map((entry) => ({
    ...entry,
    dueAt: entry.dueAt?.toISOString() ?? null,
  })),
  channelHealth: { ...view.channelHealth },
});
