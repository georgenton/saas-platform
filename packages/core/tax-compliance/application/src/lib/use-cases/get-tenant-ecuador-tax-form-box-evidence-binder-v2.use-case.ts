import {
  EcuadorTaxDeclarationFormKey,
  EcuadorTaxFormBoxEvidenceBinderV2View,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxFormBoxEvidenceBinderUseCase } from './get-tenant-ecuador-tax-form-box-evidence-binder.use-case';
import { GetTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase } from './get-tenant-ecuador-tax-sri-reconciliation-exception-queue-v62.use-case';

export class GetTenantEcuadorTaxFormBoxEvidenceBinderV2UseCase {
  constructor(
    private readonly getTenantEcuadorTaxFormBoxEvidenceBinderUseCase: GetTenantEcuadorTaxFormBoxEvidenceBinderUseCase,
    private readonly getTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase: GetTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    formKey?: EcuadorTaxDeclarationFormKey;
  }): Promise<EcuadorTaxFormBoxEvidenceBinderV2View> {
    const [baseBinder, exceptionQueue] = await Promise.all([
      this.getTenantEcuadorTaxFormBoxEvidenceBinderUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase.execute(
        input,
      ),
    ]);
    const queueRefs = exceptionQueue.exceptions.map(
      (exception) => exception.key,
    );
    const boxEvidenceContracts = baseBinder.boxes.map((box, index) => {
      const exceptionRefs =
        box.confidence === 'low' || box.sriPlatformDifferenceCount > 0
          ? queueRefs.slice(0, 3)
          : [];
      const reviewRequired =
        box.accountantRequired ||
        box.confidence !== 'high' ||
        exceptionRefs.length > 0;

      return {
        boxKey: box.boxKey,
        label: box.label,
        suggestedValueInCents: box.suggestedValueInCents,
        currency: box.currency,
        readinessStatus:
          exceptionQueue.queueStatus === 'blocked' && index === 0
            ? ('blocked' as const)
            : box.readinessStatus,
        confidence:
          exceptionRefs.length > 0 ? ('low' as const) : box.confidence,
        evidenceRefs: box.evidenceIds,
        exceptionRefs,
        accountantQuestion: reviewRequired
          ? `Validar ${box.label} contra evidencia SRI, plataforma y soporte del periodo.`
          : `Confirmar ${box.label} como casillero listo para copia manual.`,
        reviewRequired,
        copyGuidance:
          'Copiar valor sugerido solo despues de revisar evidencia y casilleros manual-only.',
      };
    });
    const blockers = [
      ...baseBinder.blockers,
      ...exceptionQueue.blockers,
      ...boxEvidenceContracts
        .filter((box) => box.readinessStatus === 'blocked')
        .map((box) => `form_box_v2.${box.boxKey}.blocked`),
    ];
    const binderStatus = resolveStatus(
      boxEvidenceContracts.map((box) => box.readinessStatus),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      formKey: baseBinder.formKey,
      binderStatus,
      baseBinder,
      exceptionQueue,
      boxEvidenceContracts,
      summary: {
        boxCount: boxEvidenceContracts.length,
        readyBoxCount: boxEvidenceContracts.filter(
          (box) => box.readinessStatus === 'ready',
        ).length,
        reviewRequiredCount: boxEvidenceContracts.filter(
          (box) => box.reviewRequired,
        ).length,
        lowConfidenceCount: boxEvidenceContracts.filter(
          (box) => box.confidence === 'low',
        ).length,
        exceptionLinkedBoxCount: boxEvidenceContracts.filter(
          (box) => box.exceptionRefs.length > 0,
        ).length,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        binderStatus === 'ready'
          ? 'Usar binder 2.0 para packet contador o filing asistido.'
          : 'Resolver casilleros con excepciones, baja confianza o blockers antes de filing.',
      guardrails: [
        'Binder 2.0 prepara evidencia por casillero; no presenta declaraciones.',
        'Toda guia de copia requiere revision humana y no automatiza portal SRI.',
      ],
    };
  }
}

function resolveStatus(
  statuses: EcuadorTaxReadinessStatus[],
  blockers: string[],
): EcuadorTaxReadinessStatus {
  if (blockers.length > 0 || statuses.includes('blocked')) {
    return 'blocked';
  }

  return statuses.includes('needs_review') ? 'needs_review' : 'ready';
}
