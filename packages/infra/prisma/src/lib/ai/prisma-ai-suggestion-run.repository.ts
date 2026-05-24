import { Injectable } from '@nestjs/common';
import {
  AiSuggestionRunRepository,
} from '@saas-platform/ai-application';
import {
  AiSuggestionRunRecord,
  CreateAiSuggestionRunCommand,
  TenantAiSuggestionEnvelope,
} from '@saas-platform/ai-domain';
import { PrismaService } from '../prisma.service';

type AiSuggestionRunRow = {
  id: string;
  tenantId: string;
  tenantSlug: string;
  agentKey: string;
  mode: 'suggestion';
  status: 'prepared';
  surfaceKey: string;
  sourceContractKey: string;
  sourceGeneratedAt: Date;
  promptPackKey: string;
  promptPackVersion: string;
  generatedAt: Date;
  requestedByUserId: string;
  requestedByEmail: string | null;
  summary: string;
  suggestedOutputKeysJson: string;
  envelopeJson: string;
  createdAt: Date;
};

@Injectable()
export class PrismaAiSuggestionRunRepository
  implements AiSuggestionRunRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(
    command: CreateAiSuggestionRunCommand,
  ): Promise<AiSuggestionRunRecord> {
    const record = await this.delegate.create({
      data: {
        tenantId: command.tenantId,
        tenantSlug: command.tenantSlug,
        agentKey: command.agentKey,
        mode: command.mode,
        status: command.status,
        surfaceKey: command.surfaceKey,
        sourceContractKey: command.sourceContractKey,
        sourceGeneratedAt: command.sourceGeneratedAt,
        promptPackKey: command.promptPackKey,
        promptPackVersion: command.promptPackVersion,
        generatedAt: command.generatedAt,
        requestedByUserId: command.requestedByUserId,
        requestedByEmail: command.requestedByEmail,
        summary: command.summary,
        suggestedOutputKeysJson: JSON.stringify(command.suggestedOutputKeys),
        envelopeJson: JSON.stringify(command.envelope),
      },
    });

    return this.toRecord(record as AiSuggestionRunRow);
  }

  async findByTenantIdAndAgentKey(
    tenantId: string,
    agentKey: string,
    limit?: number | null,
  ): Promise<AiSuggestionRunRecord[]> {
    const take = limit === null || limit === undefined ? undefined : limit;
    const records = await this.delegate.findMany({
      where: {
        tenantId,
        agentKey,
      },
      orderBy: [{ createdAt: 'desc' }],
      ...(take !== undefined ? { take } : {}),
    });

    return records.map((record) => this.toRecord(record as AiSuggestionRunRow));
  }

  async findByIdAndTenantIdAndAgentKey(
    suggestionRunId: string,
    tenantId: string,
    agentKey: string,
  ): Promise<AiSuggestionRunRecord | null> {
    const record = await this.delegate.findFirst({
      where: {
        id: suggestionRunId,
        tenantId,
        agentKey,
      },
    });

    if (!record) {
      return null;
    }

    return this.toRecord(record as AiSuggestionRunRow);
  }

  private toRecord(record: AiSuggestionRunRow): AiSuggestionRunRecord {
    const envelope = JSON.parse(record.envelopeJson) as TenantAiSuggestionEnvelope & {
      generatedAt: string;
      surface: TenantAiSuggestionEnvelope['surface'] & { sourceGeneratedAt: string };
    };

    return {
      id: record.id,
      tenantId: record.tenantId,
      tenantSlug: record.tenantSlug,
      agentKey: record.agentKey,
      mode: record.mode,
      status: record.status,
      surfaceKey: record.surfaceKey,
      sourceContractKey: record.sourceContractKey,
      sourceGeneratedAt: record.sourceGeneratedAt,
      promptPackKey: record.promptPackKey,
      promptPackVersion: record.promptPackVersion,
      generatedAt: record.generatedAt,
      requestedByUserId: record.requestedByUserId,
      requestedByEmail: record.requestedByEmail,
      summary: record.summary,
      suggestedOutputKeys: JSON.parse(record.suggestedOutputKeysJson),
      envelope: {
        ...envelope,
        generatedAt: new Date(envelope.generatedAt),
        surface: {
          ...envelope.surface,
          sourceGeneratedAt: new Date(envelope.surface.sourceGeneratedAt),
        },
      },
      createdAt: record.createdAt,
    };
  }

  private get delegate(): any {
    return (this.prisma as any).aiSuggestionRun;
  }
}
