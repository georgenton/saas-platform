import {
  EcuadorTaxComplianceDeclarationCloseoutV3View,
  EcuadorTaxDeclarationFormKey,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { RequestTenantEcuadorTaxDeclarationArtifactExportV2UseCase } from './request-tenant-ecuador-tax-declaration-artifact-export-v2.use-case';

export class RequestTenantEcuadorTaxComplianceDeclarationCloseoutV3UseCase {
  constructor(
    private readonly requestTenantEcuadorTaxDeclarationArtifactExportV2UseCase: RequestTenantEcuadorTaxDeclarationArtifactExportV2UseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    formKey?: EcuadorTaxDeclarationFormKey;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxComplianceDeclarationCloseoutV3View> {
    const artifactExport =
      await this.requestTenantEcuadorTaxDeclarationArtifactExportV2UseCase.execute(
        {
          ...input,
          recordEvent: false,
        },
      );
    const { formBoxBinder, annexesReadiness, accountantReviewRoom } =
      artifactExport;
    const obligationWorkspace = accountantReviewRoom.obligationWorkspace;
    const closeoutItems: EcuadorTaxComplianceDeclarationCloseoutV3View['closeoutItems'] =
      [
        item(
          'obligations',
          'Obligaciones por declarar',
          obligationWorkspace.workspaceStatus,
          obligationWorkspace.obligations.map(
            (obligation) =>
              `${obligation.label}: ${obligation.status} · ${obligation.formCoverage}`,
          ),
        ),
        item(
          'form_box_binder',
          'Casilleros con evidencia',
          formBoxBinder.binderStatus,
          formBoxBinder.boxes.map(
            (box) =>
              `${box.boxKey}: ${box.confidence} · ${box.sourceRowCount} ledger rows`,
          ),
        ),
        item(
          'annexes',
          'Anexos readiness 2.0',
          annexesReadiness.readinessStatus,
          annexesReadiness.annexes.map(
            (annex) =>
              `${annex.label}: ${annex.status} · ${annex.sourceRowCount} rows`,
          ),
        ),
        item(
          'accountant_review_room',
          'Sala de revision contador 3.0',
          accountantReviewRoom.roomStatus,
          accountantReviewRoom.reviewSections.map(
            (section) =>
              `${section.label}: ${section.questionCount} preguntas · ${section.status}`,
          ),
        ),
        item(
          'artifact_export',
          'Artifacts operativos',
          artifactExport.readinessStatus,
          artifactExport.artifacts.map(
            (artifact) => `${artifact.label}: ${artifact.supportStatus}`,
          ),
        ),
      ];
    const blockers = [
      ...obligationWorkspace.blockers,
      ...formBoxBinder.blockers,
      ...annexesReadiness.blockers,
      ...accountantReviewRoom.blockers,
      ...artifactExport.artifacts.flatMap((artifact) => artifact.blockers),
    ];
    const uniqueBlockers = [...new Set(blockers)];
    const accountantQuestionCount = accountantReviewRoom.summary.questionCount;
    const closeoutStatus = resolveCloseoutStatus({
      blockers: uniqueBlockers,
      accountantQuestionCount,
      obligationStatus: obligationWorkspace.workspaceStatus,
      artifactStatus: artifactExport.readinessStatus,
    });
    const summary = {
      itemCount: closeoutItems.length,
      readyItemCount: closeoutItems.filter((item) => item.status === 'ready')
        .length,
      blockerCount: uniqueBlockers.length,
      accountantQuestionCount,
      availableArtifactCount: artifactExport.summary.availableArtifactCount,
    };
    const view: EcuadorTaxComplianceDeclarationCloseoutV3View = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      obligationWorkspace,
      formBoxBinder,
      annexesReadiness,
      accountantReviewRoom,
      artifactExport,
      closeoutItems,
      summary,
      recommendedNextStep: resolveRecommendedNextStep(closeoutStatus),
      blockers: uniqueBlockers,
      nextStep: resolveNextStep(closeoutStatus),
      guardrails: [
        'Closeout 3.0 decide readiness operacional; no presenta, paga ni firma declaraciones.',
        'La salida ready_for_external_filing requiere ejecucion humana en SRI.',
        'Accounting Advanced solo se recomienda cuando el bloqueo exige contabilidad formal.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_compliance_declaration_closeout_v3_requested',
        source: 'tax_compliance_declaration_closeout_v3',
        payload: {
          closeoutStatus,
          recommendedNextStep: view.recommendedNextStep,
          summary,
        },
      });
    }

    return view;
  }
}

function item(
  key: string,
  label: string,
  status: EcuadorTaxReadinessStatus,
  evidence: string[],
): EcuadorTaxComplianceDeclarationCloseoutV3View['closeoutItems'][number] {
  return {
    key,
    label,
    status,
    evidence,
  };
}

function resolveCloseoutStatus(input: {
  blockers: string[];
  accountantQuestionCount: number;
  obligationStatus: EcuadorTaxReadinessStatus;
  artifactStatus: EcuadorTaxReadinessStatus;
}): EcuadorTaxComplianceDeclarationCloseoutV3View['closeoutStatus'] {
  if (
    input.blockers.some(
      (blocker) => blocker.includes('accounting') || blocker.includes('ledger'),
    )
  ) {
    return 'accounting_advanced_candidate';
  }

  if (
    input.blockers.length > 0 ||
    input.obligationStatus === 'blocked' ||
    input.artifactStatus === 'blocked'
  ) {
    return 'blocked';
  }

  return input.accountantQuestionCount > 0 ||
    input.obligationStatus === 'needs_review' ||
    input.artifactStatus === 'needs_review'
    ? 'accountant_review_required'
    : 'ready_for_external_filing';
}

function resolveRecommendedNextStep(
  status: EcuadorTaxComplianceDeclarationCloseoutV3View['closeoutStatus'],
): EcuadorTaxComplianceDeclarationCloseoutV3View['recommendedNextStep'] {
  if (status === 'ready_for_external_filing') {
    return 'external_filing_handoff';
  }

  if (status === 'accountant_review_required') {
    return 'accountant_review';
  }

  return status === 'accounting_advanced_candidate'
    ? 'accounting_advanced_discovery'
    : 'tax_evidence_cleanup';
}

function resolveNextStep(
  status: EcuadorTaxComplianceDeclarationCloseoutV3View['closeoutStatus'],
): string {
  if (status === 'ready_for_external_filing') {
    return 'Registrar handoff externo y mantener evidencia de filing/pago fuera de automatizacion.';
  }

  if (status === 'accountant_review_required') {
    return 'Enviar room 3.0 y artifacts al contador antes de filing externo.';
  }

  return status === 'accounting_advanced_candidate'
    ? 'Abrir discovery de Accounting Advanced por necesidad contable formal.'
    : 'Resolver blockers de evidencia, parties, anexos o casilleros antes de cerrar declaracion.';
}
