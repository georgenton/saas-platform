import {
  EcuadorTaxDeclarationFormKey,
  EcuadorTaxFilingAssistantV2View,
} from '@saas-platform/tax-compliance-domain';
import { RequestTenantEcuadorTaxAiFilingAssistantPacketUseCase } from './request-tenant-ecuador-tax-ai-filing-assistant-packet.use-case';
import { RequestTenantEcuadorTaxAssistedDeclarationReviewPackV2UseCase } from './request-tenant-ecuador-tax-assisted-declaration-review-pack-v2.use-case';

export class RequestTenantEcuadorTaxFilingAssistantV2UseCase {
  constructor(
    private readonly requestTenantEcuadorTaxAiFilingAssistantPacketUseCase: RequestTenantEcuadorTaxAiFilingAssistantPacketUseCase,
    private readonly requestTenantEcuadorTaxAssistedDeclarationReviewPackV2UseCase: RequestTenantEcuadorTaxAssistedDeclarationReviewPackV2UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    formKey?: EcuadorTaxDeclarationFormKey;
  }): Promise<EcuadorTaxFilingAssistantV2View> {
    const [assistantPacket, assistedReviewPack] = await Promise.all([
      this.requestTenantEcuadorTaxAiFilingAssistantPacketUseCase.execute(input),
      this.requestTenantEcuadorTaxAssistedDeclarationReviewPackV2UseCase.execute(
        input,
      ),
    ]);
    const blockers = [
      ...assistantPacket.blockers,
      ...assistedReviewPack.blockers,
    ];
    const walkthrough = assistantPacket.suggestedSteps.map((step) => ({
      key: step.key,
      order: step.order,
      title: step.title,
      status:
        blockers.length > 0
          ? ('blocked' as const)
          : step.humanGate
            ? ('needs_review' as const)
            : ('ready' as const),
      evidenceRefs: assistantPacket.evidenceUsed.slice(0, 12),
      humanGate: step.humanGate,
      instruction: step.instruction,
    }));
    const assistantStatus =
      blockers.length > 0 || assistedReviewPack.readinessStatus === 'blocked'
        ? 'blocked'
        : assistantPacket.assistantStatus === 'ready' &&
            assistedReviewPack.readinessStatus === 'ready'
          ? 'ready'
          : 'needs_review';

    return {
      ...input,
      generatedAt: this.nowProvider(),
      assistantStatus,
      assistantPacket,
      assistedReviewPack,
      walkthrough,
      summary: {
        stepCount: walkthrough.length,
        humanGateCount: walkthrough.filter((step) => step.humanGate).length,
        accountantQuestionCount:
          assistantPacket.accountantQuestions.length +
          assistedReviewPack.summary.accountantQuestionCount,
        blockerCount: new Set(blockers).size,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        assistantStatus === 'blocked'
          ? 'Resolver blockers antes de usar el asistente de filing 2.0.'
          : 'Usar walkthrough asistido para preparar carga manual supervisada en SRI.',
      guardrails: [
        'El asistente 2.0 guia; no declara, firma ni paga.',
        'Cada paso mantiene un gate humano y trazabilidad de evidencia.',
      ],
    };
  }
}
