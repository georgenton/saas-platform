import { Injectable } from '@nestjs/common';
import { AiApprovalRequestRepository } from '@saas-platform/ai-application';
import {
  AiApprovalRequestRecord,
  CreateAiApprovalRequestCommand,
  ReviewAiApprovalRequestCommand,
} from '@saas-platform/ai-domain';
import { PrismaService } from '../prisma.service';

type AiApprovalRequestRow = {
  id: string;
  tenantId: string;
  tenantSlug: string;
  agentKey: string;
  policyKey: string;
  scope: 'suggestion_review';
  suggestionRunId: string;
  requestedByUserId: string;
  requestedByEmail: string | null;
  rationale: string | null;
  summary: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedAt: Date | null;
  reviewedByUserId: string | null;
  reviewedByEmail: string | null;
  reviewNote: string | null;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class PrismaAiApprovalRequestRepository
  implements AiApprovalRequestRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(
    command: CreateAiApprovalRequestCommand,
  ): Promise<AiApprovalRequestRecord> {
    const record = await this.delegate.create({
      data: {
        tenantId: command.tenantId,
        tenantSlug: command.tenantSlug,
        agentKey: command.agentKey,
        policyKey: command.policyKey,
        scope: command.scope,
        suggestionRunId: command.suggestionRunId,
        requestedByUserId: command.requestedByUserId,
        requestedByEmail: command.requestedByEmail,
        rationale: command.rationale,
        summary: command.summary,
        status: command.status,
      },
    });

    return this.toRecord(record as AiApprovalRequestRow);
  }

  async findByTenantIdAndAgentKey(
    tenantId: string,
    agentKey: string,
    limit?: number | null,
  ): Promise<AiApprovalRequestRecord[]> {
    const records = await this.delegate.findMany({
      where: {
        tenantId,
        agentKey,
      },
      orderBy: [{ createdAt: 'desc' }],
      take: limit ?? 10,
    });

    return records.map((record) => this.toRecord(record as AiApprovalRequestRow));
  }

  async findByIdAndTenantIdAndAgentKey(
    requestId: string,
    tenantId: string,
    agentKey: string,
  ): Promise<AiApprovalRequestRecord | null> {
    const record = await this.delegate.findFirst({
      where: {
        id: requestId,
        tenantId,
        agentKey,
      },
    });

    if (!record) {
      return null;
    }

    return this.toRecord(record as AiApprovalRequestRow);
  }

  async findPendingBySuggestionRunId(
    suggestionRunId: string,
    tenantId: string,
    agentKey: string,
  ): Promise<AiApprovalRequestRecord | null> {
    const record = await this.delegate.findFirst({
      where: {
        suggestionRunId,
        tenantId,
        agentKey,
        status: 'pending',
      },
      orderBy: [{ createdAt: 'desc' }],
    });

    if (!record) {
      return null;
    }

    return this.toRecord(record as AiApprovalRequestRow);
  }

  async review(
    command: ReviewAiApprovalRequestCommand,
  ): Promise<AiApprovalRequestRecord> {
    const record = await this.delegate.update({
      where: {
        id: command.requestId,
      },
      data: {
        status: command.status,
        reviewedAt: new Date(),
        reviewedByUserId: command.reviewedByUserId,
        reviewedByEmail: command.reviewedByEmail,
        reviewNote: command.reviewNote,
      },
    });

    return this.toRecord(record as AiApprovalRequestRow);
  }

  private toRecord(record: AiApprovalRequestRow): AiApprovalRequestRecord {
    return {
      id: record.id,
      tenantId: record.tenantId,
      tenantSlug: record.tenantSlug,
      agentKey: record.agentKey,
      policyKey: record.policyKey,
      scope: record.scope,
      suggestionRunId: record.suggestionRunId,
      requestedByUserId: record.requestedByUserId,
      requestedByEmail: record.requestedByEmail,
      rationale: record.rationale,
      summary: record.summary,
      status: record.status,
      reviewedAt: record.reviewedAt,
      reviewedByUserId: record.reviewedByUserId,
      reviewedByEmail: record.reviewedByEmail,
      reviewNote: record.reviewNote,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  private get delegate(): any {
    return (this.prisma as any).aiApprovalRequest;
  }
}
