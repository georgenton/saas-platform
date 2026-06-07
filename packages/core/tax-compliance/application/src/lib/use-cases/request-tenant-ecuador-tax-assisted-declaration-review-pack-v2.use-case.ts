import {
  EcuadorTaxAssistedDeclarationReviewPackV2View,
  EcuadorTaxDeclarationFormKey,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAccountingEvidenceFromFoundationUseCase } from './get-tenant-ecuador-tax-accounting-evidence-from-foundation.use-case';
import { GetTenantEcuadorTaxCommandCenterV2UseCase } from './get-tenant-ecuador-tax-command-center-v2.use-case';
import { RequestTenantEcuadorTaxDeclarationFormDraftPacketUseCase } from './request-tenant-ecuador-tax-declaration-form-draft-packet.use-case';

export class RequestTenantEcuadorTaxAssistedDeclarationReviewPackV2UseCase {
  constructor(
    private readonly getTenantEcuadorTaxCommandCenterV2UseCase: GetTenantEcuadorTaxCommandCenterV2UseCase,
    private readonly getTenantEcuadorTaxAccountingEvidenceFromFoundationUseCase: GetTenantEcuadorTaxAccountingEvidenceFromFoundationUseCase,
    private readonly requestTenantEcuadorTaxDeclarationFormDraftPacketUseCase: RequestTenantEcuadorTaxDeclarationFormDraftPacketUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    formKey?: EcuadorTaxDeclarationFormKey;
  }): Promise<EcuadorTaxAssistedDeclarationReviewPackV2View> {
    const formKey = input.formKey ?? 'iva';
    const [commandCenter, accountingEvidence, draftPacket] = await Promise.all([
      this.getTenantEcuadorTaxCommandCenterV2UseCase.execute(input),
      this.getTenantEcuadorTaxAccountingEvidenceFromFoundationUseCase.execute(
        input,
      ),
      this.requestTenantEcuadorTaxDeclarationFormDraftPacketUseCase.execute({
        ...input,
        formKey,
        recordEvent: false,
      }),
    ]);
    const reviewItems: EcuadorTaxAssistedDeclarationReviewPackV2View['reviewItems'] =
      [
        {
          key: 'draft_boxes',
          label: 'Declaration draft boxes',
          status: draftPacket.readinessStatus,
          owner: 'accountant',
          evidenceRefs: draftPacket.suggestedBoxes.map((box) => box.boxKey),
          question:
            'Los valores sugeridos del formulario coinciden con evidencia SRI/plataforma?',
        },
        {
          key: 'accounting_evidence',
          label: 'Accounting comparative evidence',
          status: accountingEvidence.readinessStatus,
          owner: 'accountant',
          evidenceRefs: accountingEvidence.evidenceSources.map(
            (source) => source.key,
          ),
          question:
            'Las diferencias entre Accounting Foundation y evidencia tributaria estan explicadas?',
        },
        {
          key: 'command_center_v2',
          label: 'Command center 2.0',
          status:
            commandCenter.commandStatus === 'blocked'
              ? 'blocked'
              : commandCenter.commandStatus === 'ready' ||
                  commandCenter.commandStatus === 'externally_filed'
                ? 'ready'
                : 'needs_review',
          owner: 'operator',
          evidenceRefs: commandCenter.commandTiles.map((tile) => tile.key),
          question:
            'Queda alguna accion operativa pendiente antes del filing handoff?',
        },
      ];
    const blockers = [
      ...draftPacket.blockers,
      ...accountingEvidence.blockers,
      ...commandCenter.blockers,
    ];
    const readinessStatus =
      blockers.length > 0 || reviewItems.some((item) => item.status === 'blocked')
        ? 'blocked'
        : reviewItems.some((item) => item.status === 'needs_review')
          ? 'needs_review'
          : 'ready';

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
      commandCenter,
      accountingEvidence,
      reviewItems,
      summary: {
        reviewItemCount: reviewItems.length,
        accountantQuestionCount: reviewItems.filter(
          (item) => item.owner === 'accountant',
        ).length,
        blockedItemCount: reviewItems.filter((item) => item.status === 'blocked')
          .length,
        readyItemCount: reviewItems.filter((item) => item.status === 'ready')
          .length,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        readinessStatus === 'ready'
          ? 'Enviar pack asistido al contador para revision final de declaracion.'
          : 'Resolver items bloqueados antes de preparar filing handoff.',
      guardrails: [
        'Pack asistido explica y compara; no declara ni paga automaticamente.',
        'AI/automatizacion no reemplaza criterio del contador.',
      ],
    };
  }
}
