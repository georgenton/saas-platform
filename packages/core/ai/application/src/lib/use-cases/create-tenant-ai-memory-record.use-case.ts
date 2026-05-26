import { AiMemoryRecord, CreateAiMemoryRecordCommand } from '@saas-platform/ai-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { AiMemoryRecordRepository } from '../ports/ai-memory-record.repository';

export interface CreateTenantAiMemoryRecordInput
  extends Omit<CreateAiMemoryRecordCommand, 'tenantId' | 'status'> {
  tenantSlug: string;
}

export class CreateTenantAiMemoryRecordUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly aiMemoryRecordRepository: AiMemoryRecordRepository,
  ) {}

  async execute(input: CreateTenantAiMemoryRecordInput) {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const command = {
      ...input,
      tenantId: tenant.id,
      status: 'active',
    } as const;

    const existingRecord = await this.findAutomationDuplicate(command);

    if (existingRecord) {
      const updatedRecord = await this.aiMemoryRecordRepository.updateByIdAndTenantId(
        existingRecord.id,
        tenant.id,
        {
          sourceKind: command.sourceKind,
          freshness: command.freshness,
          title: command.title,
          summary: command.summary,
          detail: command.detail,
          tags: this.mergeTags(existingRecord.tags, command.tags),
          status: 'active',
        },
      );

      if (updatedRecord) {
        return updatedRecord;
      }
    }

    return this.aiMemoryRecordRepository.create(command);
  }

  private async findAutomationDuplicate(
    command: CreateAiMemoryRecordCommand,
  ): Promise<AiMemoryRecord | null> {
    if (command.sourceKind === 'operator_note') {
      return null;
    }

    const candidates = await this.aiMemoryRecordRepository.findByTenantId(
      command.tenantId,
      {
        scopes: [command.scope],
        statuses: ['active'],
        domainKeys: command.domainKey ? [command.domainKey] : null,
        agentKeys: command.agentKey ? [command.agentKey] : null,
        limit: null,
      },
    );

    return (
      candidates.find(
        (entry) =>
          entry.scope === command.scope &&
          entry.domainKey === command.domainKey &&
          entry.agentKey === command.agentKey &&
          entry.sourceKind === command.sourceKind &&
          this.normalizeDedupText(entry.title) ===
            this.normalizeDedupText(command.title),
      ) ?? null
    );
  }

  private mergeTags(existingTags: string[], incomingTags: string[]): string[] {
    return Array.from(new Set([...existingTags, ...incomingTags]));
  }

  private normalizeDedupText(value: string): string {
    return value.trim().toLowerCase();
  }
}
