import {
  ConversationChannel,
  ConversationMessage,
  ConversationThread,
} from '@saas-platform/growth-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { ConversationMessageRepository } from '../ports/conversation-message.repository';
import { ConversationThreadRepository } from '../ports/conversation-thread.repository';

export interface TenantGrowthConversationWorkbenchQuery {
  assigneeUserId?: string | null;
  channel?: ConversationChannel | null;
  firstResponseSlaHours?: number;
  followUpSlaHours?: number;
  staleThreadHours?: number;
}

export type GrowthConversationNextActionOwner = 'team' | 'customer' | 'none';
export type GrowthConversationFirstResponseStatus =
  | 'not_applicable'
  | 'pending'
  | 'met'
  | 'overdue';
export type GrowthConversationFollowUpStatus =
  | 'not_applicable'
  | 'pending'
  | 'overdue';
export type GrowthConversationStaleStatus = 'fresh' | 'stale';
export type GrowthConversationWorkbenchPriority =
  | 'critical'
  | 'high'
  | 'normal';

export interface TenantGrowthConversationWorkbenchThreadView {
  threadId: string;
  leadId: string | null;
  assigneeUserId: string | null;
  subject: string;
  channel: ConversationChannel;
  status: string;
  latestMessagePreview: string | null;
  nextActionOwner: GrowthConversationNextActionOwner;
  firstResponseStatus: GrowthConversationFirstResponseStatus;
  followUpStatus: GrowthConversationFollowUpStatus;
  staleStatus: GrowthConversationStaleStatus;
  priority: GrowthConversationWorkbenchPriority;
  messageCount: number;
  hoursSinceLastActivity: number;
  hoursSinceLastInbound: number | null;
  hoursSinceOpened: number;
  openedAt: Date;
  lastActivityAt: Date;
  lastInboundAt: Date | null;
  lastOutboundAt: Date | null;
}

export interface TenantGrowthConversationWorkbenchView {
  tenantSlug: string;
  generatedAt: Date;
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
  threads: TenantGrowthConversationWorkbenchThreadView[];
}

const DEFAULT_FIRST_RESPONSE_SLA_HOURS = 1;
const DEFAULT_FOLLOW_UP_SLA_HOURS = 12;
const DEFAULT_STALE_THREAD_HOURS = 48;

export class GetTenantGrowthConversationWorkbenchUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly conversationThreadRepository: ConversationThreadRepository,
    private readonly conversationMessageRepository: ConversationMessageRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    query: TenantGrowthConversationWorkbenchQuery = {},
  ): Promise<TenantGrowthConversationWorkbenchView> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const policy = {
      firstResponseSlaHours: this.normalizeHours(
        query.firstResponseSlaHours,
        DEFAULT_FIRST_RESPONSE_SLA_HOURS,
      ),
      followUpSlaHours: this.normalizeHours(
        query.followUpSlaHours,
        DEFAULT_FOLLOW_UP_SLA_HOURS,
      ),
      staleThreadHours: this.normalizeHours(
        query.staleThreadHours,
        DEFAULT_STALE_THREAD_HOURS,
      ),
    };

    const threadSource = query.channel
      ? this.conversationThreadRepository.findByTenantIdAndChannel(
          tenant.id,
          query.channel,
          query.assigneeUserId,
        )
      : this.conversationThreadRepository.findByTenantId(
          tenant.id,
          query.assigneeUserId,
        );

    const threads = (await threadSource).filter((thread) => thread.status === 'open');

    const threadViews = await Promise.all(
      threads.map(async (thread) => {
        const messages = await this.conversationMessageRepository.findByTenantIdAndThreadId(
          tenant.id,
          thread.id,
        );

        return this.toThreadView(thread, messages, policy);
      }),
    );

    const sortedThreads = [...threadViews].sort((left, right) => {
      const priorityOrder = { critical: 0, high: 1, normal: 2 } as const;
      const leftScore = priorityOrder[left.priority];
      const rightScore = priorityOrder[right.priority];

      return (
        leftScore - rightScore ||
        right.hoursSinceLastActivity - left.hoursSinceLastActivity ||
        left.threadId.localeCompare(right.threadId)
      );
    });

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      policy,
      summary: {
        openThreadCount: sortedThreads.length,
        unassignedThreadCount: sortedThreads.filter(
          (thread) => !thread.assigneeUserId,
        ).length,
        waitingOnTeamCount: sortedThreads.filter(
          (thread) => thread.nextActionOwner === 'team',
        ).length,
        waitingOnCustomerCount: sortedThreads.filter(
          (thread) => thread.nextActionOwner === 'customer',
        ).length,
        overdueFirstResponseCount: sortedThreads.filter(
          (thread) => thread.firstResponseStatus === 'overdue',
        ).length,
        overdueFollowUpCount: sortedThreads.filter(
          (thread) => thread.followUpStatus === 'overdue',
        ).length,
        staleThreadCount: sortedThreads.filter(
          (thread) => thread.staleStatus === 'stale',
        ).length,
      },
      threads: sortedThreads,
    };
  }

  private toThreadView(
    thread: ConversationThread,
    messages: ConversationMessage[],
    policy: {
      firstResponseSlaHours: number;
      followUpSlaHours: number;
      staleThreadHours: number;
    },
  ): TenantGrowthConversationWorkbenchThreadView {
    const now = this.nowProvider();
    const sortedMessages = [...messages].sort(
      (left, right) => left.createdAt.getTime() - right.createdAt.getTime(),
    );
    const latestMessage = sortedMessages[sortedMessages.length - 1] ?? null;
    const firstInboundMessage =
      sortedMessages.find((message) => message.direction === 'inbound') ?? null;
    const firstOutboundAfterInbound =
      firstInboundMessage
        ? sortedMessages.find(
            (message) =>
              message.direction === 'outbound' &&
              message.createdAt.getTime() >= firstInboundMessage.createdAt.getTime(),
          ) ?? null
        : null;
    const lastInboundMessage =
      [...sortedMessages]
        .reverse()
        .find((message) => message.direction === 'inbound') ?? null;
    const lastOutboundMessage =
      [...sortedMessages]
        .reverse()
        .find((message) => message.direction === 'outbound') ?? null;

    const nextActionOwner = this.resolveNextActionOwner(latestMessage);
    const firstResponseStatus = this.resolveFirstResponseStatus(
      firstInboundMessage,
      firstOutboundAfterInbound,
      now,
      policy.firstResponseSlaHours,
    );
    const followUpStatus = this.resolveFollowUpStatus(
      nextActionOwner,
      lastInboundMessage,
      now,
      policy.followUpSlaHours,
    );
    const hoursSinceLastActivity = this.diffHours(now, thread.lastActivityAt);
    const staleStatus: GrowthConversationStaleStatus =
      hoursSinceLastActivity >= policy.staleThreadHours ? 'stale' : 'fresh';

    return {
      threadId: thread.id,
      leadId: thread.leadId,
      assigneeUserId: thread.assigneeUserId,
      subject: thread.subject,
      channel: thread.channel,
      status: thread.status,
      latestMessagePreview: thread.latestMessagePreview,
      nextActionOwner,
      firstResponseStatus,
      followUpStatus,
      staleStatus,
      priority: this.resolvePriority(
        thread,
        nextActionOwner,
        firstResponseStatus,
        followUpStatus,
        staleStatus,
      ),
      messageCount: thread.messageCount,
      hoursSinceLastActivity,
      hoursSinceLastInbound: lastInboundMessage
        ? this.diffHours(now, lastInboundMessage.createdAt)
        : null,
      hoursSinceOpened: this.diffHours(now, thread.openedAt),
      openedAt: thread.openedAt,
      lastActivityAt: thread.lastActivityAt,
      lastInboundAt: lastInboundMessage?.createdAt ?? null,
      lastOutboundAt: lastOutboundMessage?.createdAt ?? null,
    };
  }

  private resolveNextActionOwner(
    latestMessage: ConversationMessage | null,
  ): GrowthConversationNextActionOwner {
    if (!latestMessage) {
      return 'none';
    }

    if (latestMessage.direction === 'inbound') {
      return 'team';
    }

    if (latestMessage.direction === 'outbound') {
      return 'customer';
    }

    return 'team';
  }

  private resolveFirstResponseStatus(
    firstInboundMessage: ConversationMessage | null,
    firstOutboundAfterInbound: ConversationMessage | null,
    now: Date,
    firstResponseSlaHours: number,
  ): GrowthConversationFirstResponseStatus {
    if (!firstInboundMessage) {
      return 'not_applicable';
    }

    if (firstOutboundAfterInbound) {
      return this.diffHours(
        firstOutboundAfterInbound.createdAt,
        firstInboundMessage.createdAt,
      ) <= firstResponseSlaHours
        ? 'met'
        : 'overdue';
    }

    return this.diffHours(now, firstInboundMessage.createdAt) >
      firstResponseSlaHours
      ? 'overdue'
      : 'pending';
  }

  private resolveFollowUpStatus(
    nextActionOwner: GrowthConversationNextActionOwner,
    lastInboundMessage: ConversationMessage | null,
    now: Date,
    followUpSlaHours: number,
  ): GrowthConversationFollowUpStatus {
    if (nextActionOwner !== 'team' || !lastInboundMessage) {
      return 'not_applicable';
    }

    return this.diffHours(now, lastInboundMessage.createdAt) >
      followUpSlaHours
      ? 'overdue'
      : 'pending';
  }

  private resolvePriority(
    thread: ConversationThread,
    nextActionOwner: GrowthConversationNextActionOwner,
    firstResponseStatus: GrowthConversationFirstResponseStatus,
    followUpStatus: GrowthConversationFollowUpStatus,
    staleStatus: GrowthConversationStaleStatus,
  ): GrowthConversationWorkbenchPriority {
    if (
      firstResponseStatus === 'overdue' ||
      followUpStatus === 'overdue'
    ) {
      return 'critical';
    }

    if (
      nextActionOwner === 'team' &&
      (!thread.assigneeUserId || staleStatus === 'stale')
    ) {
      return 'high';
    }

    return 'normal';
  }

  private diffHours(later: Date, earlier: Date): number {
    return Number(
      ((later.getTime() - earlier.getTime()) / (1000 * 60 * 60)).toFixed(2),
    );
  }

  private normalizeHours(value: number | undefined, fallback: number): number {
    if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
      return fallback;
    }

    return value;
  }
}
