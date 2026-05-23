import {
  AiApprovalRequestRecord,
  AiApprovalRequestStatus,
} from '@saas-platform/ai-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { AiApprovalRequestAlreadyReviewedError } from '../errors/ai-approval-request-already-reviewed.error';
import { AiApprovalRequestNotFoundError } from '../errors/ai-approval-request-not-found.error';
import { AiApprovalRequestRepository } from '../ports/ai-approval-request.repository';

export interface ReviewTenantAiApprovalRequestCommand {
  tenantSlug: string;
  agentKey: string;
  requestId: string;
  status: Exclude<AiApprovalRequestStatus, 'pending'>;
  reviewedByUserId: string;
  reviewedByEmail: string | null;
  reviewNote: string | null;
}

export class ReviewTenantAiApprovalRequestUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly aiApprovalRequestRepository: AiApprovalRequestRepository,
  ) {}

  async execute(
    command: ReviewTenantAiApprovalRequestCommand,
  ): Promise<AiApprovalRequestRecord> {
    const tenant = await this.tenantRepository.findBySlug(command.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(command.tenantSlug);
    }

    const request =
      await this.aiApprovalRequestRepository.findByIdAndTenantIdAndAgentKey(
        command.requestId,
        tenant.id,
        command.agentKey,
      );

    if (!request) {
      throw new AiApprovalRequestNotFoundError(command.requestId);
    }

    if (request.status !== 'pending') {
      throw new AiApprovalRequestAlreadyReviewedError(command.requestId);
    }

    return this.aiApprovalRequestRepository.review({
      requestId: command.requestId,
      status: command.status,
      reviewedByUserId: command.reviewedByUserId,
      reviewedByEmail: command.reviewedByEmail,
      reviewNote: command.reviewNote,
    });
  }
}
