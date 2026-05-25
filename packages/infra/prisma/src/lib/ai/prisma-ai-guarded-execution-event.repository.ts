import { Injectable } from '@nestjs/common';
import { AiGuardedExecutionEventRepository } from '@saas-platform/ai-application';
import {
  AiGuardedExecutionEventRecord,
  AiGuardedExecutionEventType,
  CreateAiGuardedExecutionEventCommand,
} from '@saas-platform/ai-domain';
import { PrismaService } from '../prisma.service';

type AiGuardedExecutionEventRow = {
  id: string;
  tenantId: string;
  tenantSlug: string;
  agentKey: string;
  eventType: 'executed' | 'rolled_back';
  approvalRequestId: string;
  suggestionRunId: string;
  toolKey: string;
  caseId: string;
  safeFallbackMode: 'suggestion_only' | null;
  summary: string;
  detail: string;
  occurredAt: Date;
  createdByUserId: string | null;
  createdByEmail: string | null;
  createdAt: Date;
};

@Injectable()
export class PrismaAiGuardedExecutionEventRepository
  implements AiGuardedExecutionEventRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(
    command: CreateAiGuardedExecutionEventCommand,
  ): Promise<AiGuardedExecutionEventRecord> {
    const record = await this.delegate.create({
      data: {
        tenantId: command.tenantId,
        tenantSlug: command.tenantSlug,
        agentKey: command.agentKey,
        eventType: command.eventType,
        approvalRequestId: command.approvalRequestId,
        suggestionRunId: command.suggestionRunId,
        toolKey: command.toolKey,
        caseId: command.caseId,
        safeFallbackMode: command.safeFallbackMode,
        summary: command.summary,
        detail: command.detail,
        occurredAt: command.occurredAt,
        createdByUserId: command.createdByUserId,
        createdByEmail: command.createdByEmail,
      },
    });

    return this.toRecord(record as AiGuardedExecutionEventRow);
  }

  async findByTenantId(
    tenantId: string,
    options?: {
      agentKeys?: string[] | null;
      limit?: number | null;
      eventTypes?: AiGuardedExecutionEventType[] | null;
    },
  ): Promise<AiGuardedExecutionEventRecord[]> {
    const take =
      options?.limit === null || options?.limit === undefined
        ? undefined
        : options.limit;
    const records = await this.delegate.findMany({
      where: {
        tenantId,
        ...(options?.agentKeys && options.agentKeys.length > 0
          ? {
              agentKey: {
                in: options.agentKeys,
              },
            }
          : {}),
        ...(options?.eventTypes && options.eventTypes.length > 0
          ? {
              eventType: {
                in: options.eventTypes,
              },
            }
          : {}),
      },
      orderBy: [{ occurredAt: 'desc' }, { createdAt: 'desc' }],
      ...(take !== undefined ? { take } : {}),
    });

    return records.map((record) =>
      this.toRecord(record as AiGuardedExecutionEventRow),
    );
  }

  private toRecord(
    record: AiGuardedExecutionEventRow,
  ): AiGuardedExecutionEventRecord {
    return {
      id: record.id,
      tenantId: record.tenantId,
      tenantSlug: record.tenantSlug,
      agentKey: record.agentKey,
      eventType: record.eventType,
      approvalRequestId: record.approvalRequestId,
      suggestionRunId: record.suggestionRunId,
      toolKey: record.toolKey,
      caseId: record.caseId,
      safeFallbackMode: record.safeFallbackMode,
      summary: record.summary,
      detail: record.detail,
      occurredAt: record.occurredAt,
      createdByUserId: record.createdByUserId,
      createdByEmail: record.createdByEmail,
      createdAt: record.createdAt,
    };
  }

  private get delegate(): any {
    return (this.prisma as any).aiGuardedExecutionEvent;
  }
}
