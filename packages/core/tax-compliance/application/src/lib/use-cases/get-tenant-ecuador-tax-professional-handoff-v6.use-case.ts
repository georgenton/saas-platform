import {
  EcuadorTaxProfessionalHandoffV6View,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAccountantHandoffRoomV2UseCase } from './get-tenant-ecuador-tax-accountant-handoff-room-v2.use-case';
import { RequestTenantEcuadorTaxComplianceAnnualCloseoutV5UseCase } from './request-tenant-ecuador-tax-compliance-annual-closeout-v5.use-case';

export class GetTenantEcuadorTaxProfessionalHandoffV6UseCase {
  constructor(
    private readonly getAccountantHandoffRoomUseCase: GetTenantEcuadorTaxAccountantHandoffRoomV2UseCase,
    private readonly getAnnualCloseoutUseCase: RequestTenantEcuadorTaxComplianceAnnualCloseoutV5UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxProfessionalHandoffV6View> {
    const [accountantHandoffRoom, annualCloseout] = await Promise.all([
      this.getAccountantHandoffRoomUseCase.execute(input),
      this.getAnnualCloseoutUseCase.execute(input),
    ]);
    const professionalReviewSections: EcuadorTaxProfessionalHandoffV6View['professionalReviewSections'] =
      [
        section(
          'period_handoff',
          'Handoff mensual al contador',
          accountantHandoffRoom.roomStatus,
          'accountant',
          ['accountant_handoff_room_v2'],
          'Que preguntas del periodo deben responderse antes de filing externo?',
        ),
        section(
          'annual_closeout',
          'Cierre anual y auditoria',
          annualCloseout.closeoutStatus,
          'external_professional',
          ['annual_closeout_v5'],
          'El cierre anual esta listo para revision externa o requiere mas evidencia?',
        ),
        section(
          'accounting_gate',
          'Decision Accounting Advanced',
          annualCloseout.checklist.find((item) => item.key === 'accounting_gate')
            ?.status ?? 'needs_review',
          'accountant',
          ['accounting_advanced_discovery_gate'],
          'La necesidad detectada exige contabilidad formal o puede seguir en Tax Compliance?',
        ),
      ];
    const blockers = [
      ...accountantHandoffRoom.blockers,
      ...annualCloseout.blockers,
      ...professionalReviewSections
        .filter((item) => item.status === 'blocked')
        .map((item) => item.key),
    ];
    const handoffStatus = resolveStatus(
      blockers,
      professionalReviewSections.filter((item) => item.status === 'needs_review')
        .length,
    );
    const accountantRequired =
      handoffStatus !== 'ready' ||
      annualCloseout.decision.status === 'ready_for_external_accountant_review';
    const openAdvancedAccountingNow =
      annualCloseout.decision.recommendedNextProduct === 'accounting-advanced';

    return {
      ...input,
      generatedAt: this.nowProvider(),
      handoffStatus,
      accountantHandoffRoom,
      annualCloseout,
      professionalReviewSections,
      decision: {
        serviceMode: openAdvancedAccountingNow
          ? 'accounting_advanced_discovery'
          : accountantRequired
            ? 'external_accountant_review'
            : 'self_service_assisted',
        reason: openAdvancedAccountingNow
          ? 'El cierre anual o el gate contable muestran necesidad de discovery de Accounting Advanced.'
          : accountantRequired
            ? 'La plataforma puede preparar evidencia, pero el cierre exige revision profesional externa.'
            : 'La evidencia permite continuar con Tax Compliance asistido sin abrir contabilidad avanzada.',
        accountantRequired,
      },
      summary: {
        sectionCount: professionalReviewSections.length,
        accountantOwnedSectionCount: professionalReviewSections.filter(
          (item) => item.owner !== 'operator',
        ).length,
        readySectionCount: professionalReviewSections.filter(
          (item) => item.status === 'ready',
        ).length,
        needsReviewSectionCount: professionalReviewSections.filter(
          (item) => item.status === 'needs_review',
        ).length,
        blockedSectionCount: professionalReviewSections.filter(
          (item) => item.status === 'blocked',
        ).length,
      },
      blockers: [...new Set(blockers)],
      nextStep: openAdvancedAccountingNow
        ? 'Preparar discovery de Accounting Advanced con contador externo.'
        : 'Enviar paquete profesional al contador y registrar respuestas como evidencia externa.',
      guardrails: [
        'Este handoff prepara evidencia; no certifica cumplimiento ni presenta declaraciones.',
        'El contador externo sigue siendo responsable de criterio profesional, filing y certificacion.',
        'Accounting Advanced solo se abre con senales contables formales.',
      ],
    };
  }
}

function section(
  key: string,
  label: string,
  status: EcuadorTaxReadinessStatus,
  owner: EcuadorTaxProfessionalHandoffV6View['professionalReviewSections'][number]['owner'],
  evidenceRefs: string[],
  question: string,
): EcuadorTaxProfessionalHandoffV6View['professionalReviewSections'][number] {
  return { key, label, status, owner, evidenceRefs, question };
}

function resolveStatus(
  blockers: string[],
  needsReviewCount: number,
): EcuadorTaxReadinessStatus {
  if (blockers.length > 0) {
    return 'blocked';
  }

  return needsReviewCount > 0 ? 'needs_review' : 'ready';
}
