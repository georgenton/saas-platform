import { EcuadorTaxFilingReadinessCertificateView } from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAccountantHandoffRoomV2UseCase } from './get-tenant-ecuador-tax-accountant-handoff-room-v2.use-case';

export class RequestTenantEcuadorTaxFilingReadinessCertificateUseCase {
  constructor(
    private readonly getTenantEcuadorTaxAccountantHandoffRoomV2UseCase: GetTenantEcuadorTaxAccountantHandoffRoomV2UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxFilingReadinessCertificateView> {
    const handoffRoom =
      await this.getTenantEcuadorTaxAccountantHandoffRoomV2UseCase.execute(
        input,
      );
    const certificationItems: EcuadorTaxFilingReadinessCertificateView['certificationItems'] =
      handoffRoom.handoffSections.map((section) => ({
        key: section.key,
        label: section.label,
        status: section.status,
        evidence: section.evidenceRefs,
        attestation:
          section.status === 'ready'
            ? 'Evidencia preparada para revision humana.'
            : 'Requiere revision antes de filing externo.',
      }));
    const blockers = [
      ...handoffRoom.blockers,
      ...certificationItems
        .filter((item) => item.status === 'blocked')
        .map((item) => item.key),
    ];
    const certificateStatus =
      blockers.length > 0 || handoffRoom.roomStatus === 'blocked'
        ? 'blocked'
        : handoffRoom.filingHandoff.status === 'filed_externally' ||
            handoffRoom.filingHandoff.status === 'paid_externally'
          ? 'ready_for_external_filing'
          : 'ready_for_accountant_review';

    return {
      ...input,
      generatedAt: this.nowProvider(),
      certificateStatus,
      handoffRoom,
      certificationItems,
      summary: {
        itemCount: certificationItems.length,
        readyItemCount: certificationItems.filter(
          (item) => item.status === 'ready',
        ).length,
        blockerCount: new Set(blockers).size,
        accountantQuestionCount: handoffRoom.summary.questionCount,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        certificateStatus === 'blocked'
          ? 'Resolver blockers antes de emitir certificado interno.'
          : 'Usar certificado como readiness interno previo a declaracion externa.',
      guardrails: [
        'Certificado interno no es comprobante de presentacion ni pago SRI.',
        'Solo acredita readiness operativo para revision/firma humana.',
      ],
    };
  }
}
