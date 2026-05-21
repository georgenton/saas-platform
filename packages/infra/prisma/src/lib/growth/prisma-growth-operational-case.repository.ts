import { Injectable } from '@nestjs/common';
import {
  CreateGrowthOperationalCaseCommand,
  GrowthOperationalCaseRecord,
  GrowthOperationalCaseRepository,
  GrowthOperationalCaseRoutingPolicyKey,
  GrowthOperationalCaseStatus,
} from '@saas-platform/growth-application';
import { PrismaService } from '../prisma.service';

type GrowthOperationalCaseRow = GrowthOperationalCaseRecord;

@Injectable()
export class PrismaGrowthOperationalCaseRepository
  implements GrowthOperationalCaseRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(
    command: CreateGrowthOperationalCaseCommand,
  ): Promise<GrowthOperationalCaseRecord> {
    const record = await this.delegate.create({
      data: {
        tenantId: command.tenantId,
        sourceKey: command.sourceKey,
        caseType: command.caseType,
        status: command.status,
        priority: command.priority,
        title: command.title,
        summary: command.summary,
        nextAction: command.nextAction,
        followUpState: command.followUpState,
        routingPolicyKey: command.routingPolicyKey,
        threadId: command.threadId,
        alertKey: command.alertKey,
        dueAt: command.dueAt,
        assignedUserId: command.assignedUserId,
        assignedUserEmail: command.assignedUserEmail,
        createdByUserId: command.createdByUserId,
        createdByEmail: command.createdByEmail,
        resolvedAt: command.resolvedAt,
        resolvedByUserId: command.resolvedByUserId,
        resolvedByEmail: command.resolvedByEmail,
      },
    });

    return this.toRecord(record as GrowthOperationalCaseRow);
  }

  async save(
    record: GrowthOperationalCaseRecord,
  ): Promise<GrowthOperationalCaseRecord> {
    const saved = await this.delegate.update({
      where: {
        id: record.id,
      },
      data: {
        sourceKey: record.sourceKey,
        caseType: record.caseType,
        status: record.status,
        priority: record.priority,
        title: record.title,
        summary: record.summary,
        nextAction: record.nextAction,
        followUpState: record.followUpState,
        routingPolicyKey: record.routingPolicyKey,
        threadId: record.threadId,
        alertKey: record.alertKey,
        dueAt: record.dueAt,
        assignedUserId: record.assignedUserId,
        assignedUserEmail: record.assignedUserEmail,
        createdByUserId: record.createdByUserId,
        createdByEmail: record.createdByEmail,
        resolvedAt: record.resolvedAt,
        resolvedByUserId: record.resolvedByUserId,
        resolvedByEmail: record.resolvedByEmail,
      },
    });

    return this.toRecord(saved as GrowthOperationalCaseRow);
  }

  async findByTenantId(
    tenantId: string,
    filters?: {
      status?: GrowthOperationalCaseStatus | null;
      routingPolicyKey?: GrowthOperationalCaseRoutingPolicyKey | null;
    },
  ): Promise<GrowthOperationalCaseRecord[]> {
    const records = await this.delegate.findMany({
      where: {
        tenantId,
        ...(filters?.status ? { status: filters.status } : {}),
        ...(filters?.routingPolicyKey
          ? { routingPolicyKey: filters.routingPolicyKey }
          : {}),
      },
      orderBy: [
        { status: 'asc' },
        { priority: 'desc' },
        { dueAt: 'asc' },
        { updatedAt: 'desc' },
      ],
    });

    return records.map((record) => this.toRecord(record as GrowthOperationalCaseRow));
  }

  async findByTenantIdAndId(
    tenantId: string,
    caseId: string,
  ): Promise<GrowthOperationalCaseRecord | null> {
    const record = await this.delegate.findFirst({
      where: {
        tenantId,
        id: caseId,
      },
    });

    return record ? this.toRecord(record as GrowthOperationalCaseRow) : null;
  }

  async findByTenantIdAndSourceKey(
    tenantId: string,
    sourceKey: string,
  ): Promise<GrowthOperationalCaseRecord | null> {
    const record = await this.delegate.findUnique({
      where: {
        tenantId_sourceKey: {
          tenantId,
          sourceKey,
        },
      },
    });

    return record ? this.toRecord(record as GrowthOperationalCaseRow) : null;
  }

  private toRecord(record: GrowthOperationalCaseRow): GrowthOperationalCaseRecord {
    return {
      ...record,
    };
  }

  private get delegate(): any {
    return (this.prisma as any).growthOperationalCase;
  }
}
