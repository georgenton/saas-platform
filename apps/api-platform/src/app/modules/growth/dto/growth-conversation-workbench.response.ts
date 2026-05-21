import {
  TenantGrowthConversationWorkbenchThreadView,
  TenantGrowthConversationWorkbenchView,
} from '@saas-platform/growth-application';

export interface GrowthConversationWorkbenchThreadResponseDto {
  threadId: string;
  leadId: string | null;
  assigneeUserId: string | null;
  subject: string;
  channel: string;
  status: string;
  latestMessagePreview: string | null;
  nextActionOwner: string;
  firstResponseStatus: string;
  followUpStatus: string;
  staleStatus: string;
  priority: string;
  messageCount: number;
  hoursSinceLastActivity: number;
  hoursSinceLastInbound: number | null;
  hoursSinceOpened: number;
  openedAt: string;
  lastActivityAt: string;
  lastInboundAt: string | null;
  lastOutboundAt: string | null;
}

export interface GrowthConversationWorkbenchResponseDto {
  tenantSlug: string;
  generatedAt: string;
  policy: {
    firstResponseSlaHours: number;
    followUpSlaHours: number;
    staleThreadHours: number;
  };
  summary: {
    openThreadCount: number;
    unassignedThreadCount: number;
    waitingOnTeamCount: number;
    waitingOnCustomerCount: number;
    overdueFirstResponseCount: number;
    overdueFollowUpCount: number;
    staleThreadCount: number;
  };
  threads: GrowthConversationWorkbenchThreadResponseDto[];
}

const toThreadResponseDto = (
  thread: TenantGrowthConversationWorkbenchThreadView,
): GrowthConversationWorkbenchThreadResponseDto => ({
  threadId: thread.threadId,
  leadId: thread.leadId,
  assigneeUserId: thread.assigneeUserId,
  subject: thread.subject,
  channel: thread.channel,
  status: thread.status,
  latestMessagePreview: thread.latestMessagePreview,
  nextActionOwner: thread.nextActionOwner,
  firstResponseStatus: thread.firstResponseStatus,
  followUpStatus: thread.followUpStatus,
  staleStatus: thread.staleStatus,
  priority: thread.priority,
  messageCount: thread.messageCount,
  hoursSinceLastActivity: thread.hoursSinceLastActivity,
  hoursSinceLastInbound: thread.hoursSinceLastInbound,
  hoursSinceOpened: thread.hoursSinceOpened,
  openedAt: thread.openedAt.toISOString(),
  lastActivityAt: thread.lastActivityAt.toISOString(),
  lastInboundAt: thread.lastInboundAt?.toISOString() ?? null,
  lastOutboundAt: thread.lastOutboundAt?.toISOString() ?? null,
});

export const toGrowthConversationWorkbenchResponseDto = (
  view: TenantGrowthConversationWorkbenchView,
): GrowthConversationWorkbenchResponseDto => ({
  tenantSlug: view.tenantSlug,
  generatedAt: view.generatedAt.toISOString(),
  policy: { ...view.policy },
  summary: { ...view.summary },
  threads: view.threads.map((thread) => toThreadResponseDto(thread)),
});
