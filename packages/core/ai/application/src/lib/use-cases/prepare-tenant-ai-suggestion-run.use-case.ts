import {
  AiSuggestionRunRecord,
  TenantAiSuggestionEnvelope,
} from '@saas-platform/ai-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { AiSuggestionRunRepository } from '../ports/ai-suggestion-run.repository';
import { GetTenantAiSuggestionEnvelopeUseCase } from './get-tenant-ai-suggestion-envelope.use-case';

export interface PrepareTenantAiSuggestionRunCommand {
  tenantSlug: string;
  agentKey: string;
  requestedByUserId: string;
  requestedByEmail: string | null;
}

export class PrepareTenantAiSuggestionRunUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly aiSuggestionRunRepository: AiSuggestionRunRepository,
    private readonly getTenantAiSuggestionEnvelopeUseCase: GetTenantAiSuggestionEnvelopeUseCase,
  ) {}

  async execute(
    command: PrepareTenantAiSuggestionRunCommand,
  ): Promise<AiSuggestionRunRecord> {
    const tenant = await this.tenantRepository.findBySlug(command.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(command.tenantSlug);
    }

    const envelope = await this.getTenantAiSuggestionEnvelopeUseCase.execute(
      command.tenantSlug,
      command.agentKey,
    );

    return this.aiSuggestionRunRepository.create({
      tenantId: tenant.id,
      tenantSlug: command.tenantSlug,
      agentKey: envelope.agent.key,
      mode: envelope.mode,
      status: 'prepared',
      surfaceKey: envelope.surface.key,
      sourceContractKey: envelope.surface.sourceContractKey,
      sourceGeneratedAt: envelope.surface.sourceGeneratedAt,
      promptPackKey: envelope.promptPack.key,
      promptPackVersion: envelope.promptPack.version,
      generatedAt: envelope.generatedAt,
      requestedByUserId: command.requestedByUserId,
      requestedByEmail: command.requestedByEmail,
      summary: this.buildSummary(envelope),
      suggestedOutputKeys: envelope.promptPack.suggestedOutputs.map(
        (entry) => entry.key,
      ),
      envelope,
    });
  }

  private buildSummary(envelope: TenantAiSuggestionEnvelope): string {
    return `${envelope.agent.title} prepared a suggestion-mode handoff for ${envelope.surface.title} using prompt pack ${envelope.promptPack.key}@${envelope.promptPack.version}.`;
  }
}
