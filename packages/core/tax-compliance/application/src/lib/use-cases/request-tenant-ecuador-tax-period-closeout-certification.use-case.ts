import {
  EcuadorTaxPeriodCloseoutCertificationView,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxDeclarationReviewLoopWorkspaceUseCase } from './get-tenant-ecuador-tax-declaration-review-loop-workspace.use-case';
import { GetTenantEcuadorTaxObligationMatrixV2WorkspaceUseCase } from './get-tenant-ecuador-tax-obligation-matrix-v2-workspace.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { RequestTenantEcuadorTaxPeriodCloseoutReportUseCase } from './request-tenant-ecuador-tax-period-closeout-report.use-case';

export class RequestTenantEcuadorTaxPeriodCloseoutCertificationUseCase {
  constructor(
    private readonly requestTenantEcuadorTaxPeriodCloseoutReportUseCase: RequestTenantEcuadorTaxPeriodCloseoutReportUseCase,
    private readonly getTenantEcuadorTaxDeclarationReviewLoopWorkspaceUseCase: GetTenantEcuadorTaxDeclarationReviewLoopWorkspaceUseCase,
    private readonly getTenantEcuadorTaxObligationMatrixV2WorkspaceUseCase: GetTenantEcuadorTaxObligationMatrixV2WorkspaceUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxPeriodCloseoutCertificationView> {
    const [closeoutReport, declarationReviewLoop, obligationMatrix] =
      await Promise.all([
        this.requestTenantEcuadorTaxPeriodCloseoutReportUseCase.execute({
          ...input,
          recordEvent: false,
        }),
        this.getTenantEcuadorTaxDeclarationReviewLoopWorkspaceUseCase.execute(input),
        this.getTenantEcuadorTaxObligationMatrixV2WorkspaceUseCase.execute({
          ...input,
          recordEvent: false,
        }),
      ]);
    const certificationChecklist = [
      {
        key: 'obligations',
        label: 'Obligaciones del contribuyente',
        status: obligationMatrix.readinessStatus,
        detail: `${obligationMatrix.summary.appliesCount} obligaciones aplicables.`,
      },
      {
        key: 'closeout_report',
        label: 'Reporte de cierre tributario',
        status: closeoutReport.readinessStatus,
        detail: `${closeoutReport.sections.length} secciones de evidencia.`,
      },
      {
        key: 'declaration_review_loop',
        label: 'Revision contador/declaracion',
        status: resolveReviewLoopStatus(declarationReviewLoop.loopStatus),
        detail: declarationReviewLoop.nextStep,
      },
      {
        key: 'external_filing',
        label: 'Filing/pago externo',
        status: declarationReviewLoop.summary.filedExternally
          ? ('ready' as const)
          : ('needs_review' as const),
        detail: declarationReviewLoop.summary.filedExternally
          ? 'Declaracion o pago externo registrado.'
          : 'Registrar filing/pago externo cuando el contador lo complete.',
      },
    ];
    const blockers = [
      ...closeoutReport.blockers,
      ...declarationReviewLoop.blockers,
      ...obligationMatrix.blockers,
    ];
    const certificationStatus = resolveCertificationStatus({
      blockers,
      checklist: certificationChecklist,
      filedExternally: declarationReviewLoop.summary.filedExternally,
    });
    const view: EcuadorTaxPeriodCloseoutCertificationView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      certificationStatus,
      closeoutReport,
      declarationReviewLoop,
      obligationMatrix,
      certificationChecklist,
      summary: {
        checklistCount: certificationChecklist.length,
        readyChecklistCount: certificationChecklist.filter(
          (item) => item.status === 'ready',
        ).length,
        blockerCount: blockers.length,
        accountantQuestionCount: closeoutReport.accountantQuestions.length,
        filedExternally: declarationReviewLoop.summary.filedExternally,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        certificationStatus === 'blocked'
          ? 'Resolver blockers antes de certificar el cierre tributario.'
          : certificationStatus === 'needs_accountant_review'
            ? 'Enviar checklist de certificacion a contador para aprobacion.'
            : certificationStatus === 'ready_to_certify'
              ? 'Registrar filing/pago externo para completar cierre certificado.'
              : 'Periodo tributario certificado operacionalmente con filing externo registrado.',
      guardrails: [
        'Certificacion operacional interna; no sustituye declaracion, pago ni auditoria oficial.',
        'Debe conservarse junto con soportes SRI, anexos y evidencia del contador.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_period_closeout_certification_requested',
        source: 'tax_period_closeout_certification',
        payload: {
          certificationStatus,
          summary: view.summary,
          blockerCount: view.blockers.length,
        },
      });
    }

    return view;
  }
}

function resolveReviewLoopStatus(
  loopStatus: EcuadorTaxPeriodCloseoutCertificationView['declarationReviewLoop']['loopStatus'],
): EcuadorTaxReadinessStatus {
  if (loopStatus === 'changes_requested') {
    return 'blocked';
  }

  return loopStatus === 'approved_for_filing' || loopStatus === 'filed_externally'
    ? 'ready'
    : 'needs_review';
}

function resolveCertificationStatus(input: {
  blockers: string[];
  checklist: Array<{ status: EcuadorTaxReadinessStatus }>;
  filedExternally: boolean;
}): EcuadorTaxPeriodCloseoutCertificationView['certificationStatus'] {
  if (input.blockers.length > 0 || input.checklist.some((item) => item.status === 'blocked')) {
    return 'blocked';
  }

  if (input.filedExternally) {
    return 'externally_filed';
  }

  return input.checklist.some((item) => item.status === 'needs_review')
    ? 'needs_accountant_review'
    : 'ready_to_certify';
}
