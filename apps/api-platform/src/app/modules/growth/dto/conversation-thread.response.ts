import { ConversationThread } from '@saas-platform/growth-domain';

export interface ConversationThreadResponseDto {
  id: string;
  tenantId: string;
  leadId: string | null;
  assigneeUserId: string | null;
  subject: string;
  channel: string;
  externalConversationId: string | null;
  participantDisplayName: string | null;
  participantHandle: string | null;
  status: string;
  latestMessagePreview: string | null;
  messageCount: number;
  openedAt: string;
  closedAt: string | null;
  lastActivityAt: string;
  createdAt: string;
  updatedAt: string;
}

export const toConversationThreadResponseDto = (
  thread: ConversationThread,
): ConversationThreadResponseDto => {
  const data = thread.toPrimitives();

  return {
    id: data.id,
    tenantId: data.tenantId,
    leadId: data.leadId,
    assigneeUserId: data.assigneeUserId ?? null,
    subject: data.subject,
    channel: data.channel,
    externalConversationId: data.externalConversationId ?? null,
    participantDisplayName: data.participantDisplayName ?? null,
    participantHandle: data.participantHandle ?? null,
    status: data.status,
    latestMessagePreview: data.latestMessagePreview,
    messageCount: data.messageCount,
    openedAt: data.openedAt.toISOString(),
    closedAt: data.closedAt?.toISOString() ?? null,
    lastActivityAt: data.lastActivityAt.toISOString(),
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  };
};
