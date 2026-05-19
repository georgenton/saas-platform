import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import {
  ConversationChannel,
  ConversationThread,
  ConversationThreadStatus,
} from '@saas-platform/growth-domain';
import { LeadNotFoundError } from '../errors/lead-not-found.error';
import { ConversationThreadIdGenerator } from '../ports/conversation-thread-id.generator';
import { ConversationThreadRepository } from '../ports/conversation-thread.repository';
import { LeadRepository } from '../ports/lead.repository';

export interface CreateTenantConversationThreadInput {
  tenantSlug: string;
  leadId?: string | null;
  subject: string;
  channel?: ConversationChannel | null;
  status?: ConversationThreadStatus | null;
}

export class CreateTenantConversationThreadUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly leadRepository: LeadRepository,
    private readonly conversationThreadRepository: ConversationThreadRepository,
    private readonly conversationThreadIdGenerator: ConversationThreadIdGenerator,
  ) {}

  async execute(
    input: CreateTenantConversationThreadInput,
  ): Promise<ConversationThread> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const normalizedLeadId = this.normalizeOptionalValue(input.leadId);

    if (normalizedLeadId) {
      const lead = await this.leadRepository.findByTenantIdAndId(
        tenant.id,
        normalizedLeadId,
      );

      if (!lead) {
        throw new LeadNotFoundError(input.tenantSlug, normalizedLeadId);
      }
    }

    const now = new Date();
    const thread = ConversationThread.create({
      id: this.conversationThreadIdGenerator.generate(),
      tenantId: tenant.id,
      leadId: normalizedLeadId,
      assigneeUserId: null,
      subject: input.subject.trim(),
      channel: input.channel ?? 'manual',
      externalConversationId: null,
      participantDisplayName: null,
      participantHandle: null,
      status: input.status ?? 'open',
      latestMessagePreview: null,
      messageCount: 0,
      openedAt: now,
      closedAt: null,
      lastActivityAt: now,
      createdAt: now,
      updatedAt: now,
    });

    await this.conversationThreadRepository.save(thread);

    return thread;
  }

  private normalizeOptionalValue(value?: string | null): string | null {
    const normalizedValue = value?.trim();

    return normalizedValue ? normalizedValue : null;
  }
}
