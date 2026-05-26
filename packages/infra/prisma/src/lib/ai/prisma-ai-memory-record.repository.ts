import { Injectable } from '@nestjs/common';
import { AiMemoryRecordRepository } from '@saas-platform/ai-application';
import {
  AiDomainKey,
  AiMemoryRecord,
  AiMemoryRecordScope,
  AiMemoryRecordStatus,
  AiMemoryRecordSourceKind,
  CreateAiMemoryRecordCommand,
} from '@saas-platform/ai-domain';
import { PrismaService } from '../prisma.service';

type AiMemoryRecordRow = {
  id: string;
  tenantId: string;
  tenantSlug: string;
  scope: AiMemoryRecordScope;
  domainKey: AiDomainKey | null;
  agentKey: string | null;
  sourceKind: AiMemoryRecordSourceKind;
  freshness: 'working_memory' | 'durable_memory';
  title: string;
  summary: string;
  detail: string;
  tagsJson: string;
  status: AiMemoryRecordStatus;
  createdByUserId: string | null;
  createdByEmail: string | null;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class PrismaAiMemoryRecordRepository implements AiMemoryRecordRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(command: CreateAiMemoryRecordCommand): Promise<AiMemoryRecord> {
    const record = await this.delegate.create({
      data: {
        tenantId: command.tenantId,
        tenantSlug: command.tenantSlug,
        scope: command.scope,
        domainKey: command.domainKey,
        agentKey: command.agentKey,
        sourceKind: command.sourceKind,
        freshness: command.freshness,
        title: command.title,
        summary: command.summary,
        detail: command.detail,
        tagsJson: JSON.stringify(command.tags),
        status: command.status,
        createdByUserId: command.createdByUserId,
        createdByEmail: command.createdByEmail,
      },
    });

    return this.toRecord(record as AiMemoryRecordRow);
  }

  async findByIdAndTenantId(
    recordId: string,
    tenantId: string,
  ): Promise<AiMemoryRecord | null> {
    const record = await this.delegate.findFirst({
      where: {
        id: recordId,
        tenantId,
      },
    });

    if (!record) {
      return null;
    }

    return this.toRecord(record as AiMemoryRecordRow);
  }

  async findByTenantId(
    tenantId: string,
    options?: {
      scopes?: AiMemoryRecordScope[] | null;
      statuses?: AiMemoryRecordStatus[] | null;
      domainKeys?: AiDomainKey[] | null;
      agentKeys?: string[] | null;
      limit?: number | null;
    },
  ): Promise<AiMemoryRecord[]> {
    const take =
      options?.limit === null || options?.limit === undefined
        ? undefined
        : options.limit;
    const visibilityOr: Array<Record<string, unknown>> = [];

    if (options?.domainKeys && options.domainKeys.length > 0) {
      visibilityOr.push({ scope: 'tenant' });
      visibilityOr.push({ domainKey: { in: options.domainKeys } });
    }

    if (options?.agentKeys && options.agentKeys.length > 0) {
      visibilityOr.push({ scope: 'tenant' });
      visibilityOr.push({ agentKey: { in: options.agentKeys } });
    }

    const records = await this.delegate.findMany({
      where: {
        tenantId,
        ...(options?.statuses && options.statuses.length > 0
          ? { status: { in: options.statuses } }
          : {}),
        ...(options?.scopes && options.scopes.length > 0
          ? { scope: { in: options.scopes } }
          : {}),
        ...(visibilityOr.length > 0 ? { OR: visibilityOr } : {}),
      },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
      ...(take !== undefined ? { take } : {}),
    });

    return records.map((entry) => this.toRecord(entry as AiMemoryRecordRow));
  }

  async updateByIdAndTenantId(
    recordId: string,
    tenantId: string,
    patch: {
      sourceKind?: AiMemoryRecord['sourceKind'];
      freshness?: AiMemoryRecord['freshness'];
      title?: string;
      summary?: string;
      detail?: string;
      tags?: string[];
      status?: AiMemoryRecordStatus;
    },
  ): Promise<AiMemoryRecord | null> {
    const data: Record<string, unknown> = {};

    if (patch.sourceKind !== undefined) {
      data.sourceKind = patch.sourceKind;
    }

    if (patch.freshness !== undefined) {
      data.freshness = patch.freshness;
    }

    if (patch.title !== undefined) {
      data.title = patch.title;
    }

    if (patch.summary !== undefined) {
      data.summary = patch.summary;
    }

    if (patch.detail !== undefined) {
      data.detail = patch.detail;
    }

    if (patch.tags !== undefined) {
      data.tagsJson = JSON.stringify(patch.tags);
    }

    if (patch.status !== undefined) {
      data.status = patch.status;
    }

    if (Object.keys(data).length === 0) {
      return this.findByIdAndTenantId(recordId, tenantId);
    }

    const updateResult = await this.delegate.updateMany({
      where: {
        id: recordId,
        tenantId,
      },
      data,
    });

    if (!updateResult.count) {
      return null;
    }

    return this.findByIdAndTenantId(recordId, tenantId);
  }

  private toRecord(record: AiMemoryRecordRow): AiMemoryRecord {
    return {
      id: record.id,
      tenantId: record.tenantId,
      tenantSlug: record.tenantSlug,
      scope: record.scope,
      domainKey: record.domainKey,
      agentKey: record.agentKey,
      sourceKind: record.sourceKind,
      freshness: record.freshness,
      title: record.title,
      summary: record.summary,
      detail: record.detail,
      tags: JSON.parse(record.tagsJson),
      status: record.status,
      createdByUserId: record.createdByUserId,
      createdByEmail: record.createdByEmail,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  private get delegate(): any {
    return (this.prisma as any).aiMemoryRecord;
  }
}
