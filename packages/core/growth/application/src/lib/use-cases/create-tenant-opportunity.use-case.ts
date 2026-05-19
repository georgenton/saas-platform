import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { ConversationThread, Opportunity, OpportunityStage } from '@saas-platform/growth-domain';
import { ConversationThreadNotFoundError } from '../errors/conversation-thread-not-found.error';
import { LeadNotFoundError } from '../errors/lead-not-found.error';
import { OpportunityIdGenerator } from '../ports/opportunity-id.generator';
import { OpportunityRepository } from '../ports/opportunity.repository';
import { ConversationThreadRepository } from '../ports/conversation-thread.repository';
import { LeadRepository } from '../ports/lead.repository';

export interface CreateTenantOpportunityInput {
  tenantSlug: string;
  leadId?: string | null;
  threadId?: string | null;
  title: string;
  stage?: OpportunityStage | null;
  amountInCents?: number | null;
  currency?: string | null;
  notes?: string | null;
}

export class CreateTenantOpportunityUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly leadRepository: LeadRepository,
    private readonly conversationThreadRepository: ConversationThreadRepository,
    private readonly opportunityRepository: OpportunityRepository,
    private readonly opportunityIdGenerator: OpportunityIdGenerator,
  ) {}

  async execute(
    input: CreateTenantOpportunityInput,
  ): Promise<Opportunity> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const normalizedLeadId = this.normalizeOptionalValue(input.leadId);
    const normalizedThreadId = this.normalizeOptionalValue(input.threadId);

    if (normalizedLeadId) {
      const lead = await this.leadRepository.findByTenantIdAndId(
        tenant.id,
        normalizedLeadId,
      );

      if (!lead) {
        throw new LeadNotFoundError(input.tenantSlug, normalizedLeadId);
      }
    }

    if (normalizedThreadId) {
      const thread = await this.conversationThreadRepository.findByTenantIdAndId(
        tenant.id,
        normalizedThreadId,
      );

      if (!thread) {
        throw new ConversationThreadNotFoundError(
          input.tenantSlug,
          normalizedThreadId,
        );
      }

      this.assertRelatedEntitiesAlign(
        input.tenantSlug,
        normalizedLeadId,
        normalizedThreadId,
        thread,
      );
    }

    const now = new Date();
    const stage = input.stage ?? 'new';
    const opportunity = Opportunity.create({
      id: this.opportunityIdGenerator.generate(),
      tenantId: tenant.id,
      leadId: normalizedLeadId,
      threadId: normalizedThreadId,
      assigneeUserId: null,
      title: input.title.trim(),
      stage,
      amountInCents: this.normalizeOptionalNumber(input.amountInCents),
      currency: this.normalizeOptionalValue(input.currency)?.toUpperCase() ?? null,
      notes: this.normalizeOptionalValue(input.notes),
      closedAt: this.resolveClosedAt(stage, now),
      createdAt: now,
      updatedAt: now,
    });

    await this.opportunityRepository.save(opportunity);

    return opportunity;
  }

  private assertRelatedEntitiesAlign(
    tenantSlug: string,
    leadId: string | null,
    threadId: string,
    thread: ConversationThread,
  ): void {
    if (leadId && thread.leadId && thread.leadId !== leadId) {
      throw new ConversationThreadNotFoundError(tenantSlug, threadId);
    }
  }

  private resolveClosedAt(
    stage: OpportunityStage,
    now: Date,
  ): Date | null {
    return stage === 'won' || stage === 'lost' ? now : null;
  }

  private normalizeOptionalNumber(value?: number | null): number | null {
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
  }

  private normalizeOptionalValue(value?: string | null): string | null {
    const normalizedValue = value?.trim();

    return normalizedValue ? normalizedValue : null;
  }
}
