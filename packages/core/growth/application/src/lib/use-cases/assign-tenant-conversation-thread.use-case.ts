import {
  MembershipRepository,
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { ConversationThread } from '@saas-platform/growth-domain';
import { ConversationThreadNotFoundError } from '../errors/conversation-thread-not-found.error';
import { GrowthAssigneeMembershipNotFoundError } from '../errors/growth-assignee-membership-not-found.error';
import { ConversationThreadRepository } from '../ports/conversation-thread.repository';

export interface AssignTenantConversationThreadInput {
  tenantSlug: string;
  threadId: string;
  assigneeUserId?: string | null;
}

export class AssignTenantConversationThreadUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly membershipRepository: MembershipRepository,
    private readonly conversationThreadRepository: ConversationThreadRepository,
  ) {}

  async execute(
    input: AssignTenantConversationThreadInput,
  ): Promise<ConversationThread> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const thread = await this.conversationThreadRepository.findByTenantIdAndId(
      tenant.id,
      input.threadId,
    );

    if (!thread) {
      throw new ConversationThreadNotFoundError(input.tenantSlug, input.threadId);
    }

    const normalizedAssigneeUserId = this.normalizeOptionalValue(
      input.assigneeUserId,
    );

    if (normalizedAssigneeUserId) {
      const membership = await this.membershipRepository.findByTenantAndUser(
        tenant.id,
        normalizedAssigneeUserId,
      );

      if (!membership) {
        throw new GrowthAssigneeMembershipNotFoundError(
          input.tenantSlug,
          normalizedAssigneeUserId,
        );
      }
    }

    const updatedAt = new Date();
    const updatedThread = ConversationThread.create({
      ...thread.toPrimitives(),
      assigneeUserId: normalizedAssigneeUserId,
      updatedAt,
    });

    await this.conversationThreadRepository.save(updatedThread);

    return updatedThread;
  }

  private normalizeOptionalValue(value?: string | null): string | null {
    const normalizedValue = value?.trim();

    return normalizedValue ? normalizedValue : null;
  }
}
