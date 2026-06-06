import {
  AccountingReadinessStatus,
  TenantAccountingFinancialStatementReviewPacketView,
} from '@saas-platform/accounting-domain';
import { GetTenantAccountingFinancialStatementPreviewUseCase } from './get-tenant-accounting-financial-statement-preview.use-case';
import { GetTenantAccountingPeriodCloseoutReportUseCase } from './get-tenant-accounting-period-closeout-report.use-case';

export class RequestTenantAccountingFinancialStatementReviewPacketUseCase {
  constructor(
    private readonly getTenantAccountingFinancialStatementPreviewUseCase: GetTenantAccountingFinancialStatementPreviewUseCase,
    private readonly getTenantAccountingPeriodCloseoutReportUseCase: GetTenantAccountingPeriodCloseoutReportUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    decision: 'prepare' | 'approve' | 'flag';
    reviewerUserId?: string | null;
    reviewerEmail?: string | null;
    note?: string | null;
    evidenceReference?: string | null;
  }): Promise<TenantAccountingFinancialStatementReviewPacketView> {
    const [preview, closeoutReport] = await Promise.all([
      this.getTenantAccountingFinancialStatementPreviewUseCase.execute(input),
      this.getTenantAccountingPeriodCloseoutReportUseCase.execute(input),
    ]);
    const reviewChecklist: TenantAccountingFinancialStatementReviewPacketView['reviewChecklist'] =
      [
        {
          key: 'financial_preview',
          label: 'Financial preview',
          status:
            preview.previewStatus === 'ready_for_review'
              ? 'ready'
              : preview.previewStatus === 'blocked'
                ? 'blocked'
                : 'needs_review',
          detail: `Preview financiero en estado ${preview.previewStatus}.`,
        },
        {
          key: 'balance_sheet',
          label: 'Balance sheet',
          status: preview.summary.balanceSheetBalanced ? 'ready' : 'blocked',
          detail: preview.summary.balanceSheetBalanced
            ? 'Balance sheet preview cuadra con resultado retenido del periodo.'
            : 'Balance sheet preview no cuadra todavia.',
        },
        {
          key: 'closeout_report',
          label: 'Closeout report',
          status: toReportReadiness(closeoutReport.reportStatus),
          detail: `Closeout report en estado ${closeoutReport.reportStatus}.`,
        },
        {
          key: 'reviewer_evidence',
          label: 'Reviewer evidence',
          status:
            input.decision === 'prepare' ||
            ((input.reviewerEmail || input.reviewerUserId) &&
              input.evidenceReference)
              ? 'ready'
              : 'blocked',
          detail:
            input.decision === 'prepare'
              ? 'Preparacion no exige reviewer ni evidencia final.'
              : 'Aprobacion/flag requiere reviewer y referencia de evidencia.',
        },
      ];
    const checklistBlockers = reviewChecklist
      .filter((item) => item.status === 'blocked')
      .map((item) => `accounting.financial_statement_review.${item.key}`);
    const flagBlockers =
      input.decision === 'flag' && !input.note
        ? ['accounting.financial_statement_review.flag_note_required']
        : [];
    const blockers = [
      ...preview.blockers,
      ...closeoutReport.blockers,
      ...checklistBlockers,
      ...flagBlockers,
    ];
    const reviewStatus =
      blockers.length > 0
        ? 'blocked'
        : input.decision === 'approve'
          ? 'approved'
          : input.decision === 'flag'
            ? 'flagged'
            : 'ready_for_approval';

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      reviewStatus,
      decision: input.decision,
      reviewerUserId: input.reviewerUserId ?? null,
      reviewerEmail: input.reviewerEmail ?? null,
      note: input.note ?? null,
      evidenceReference: input.evidenceReference ?? null,
      preview,
      closeoutReport,
      reviewChecklist,
      summary: {
        checklistCount: reviewChecklist.length,
        readyChecklistCount: reviewChecklist.filter(
          (item) => item.status === 'ready',
        ).length,
        blockedChecklistCount: reviewChecklist.filter(
          (item) => item.status === 'blocked',
        ).length,
        netIncomeInCents: preview.summary.netIncomeInCents,
        balanceSheetBalanced: preview.summary.balanceSheetBalanced,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        reviewStatus === 'approved'
          ? 'Usar aprobacion de estados preview como evidencia para handoff y lock interno.'
          : reviewStatus === 'flagged'
            ? 'Resolver observaciones del reviewer antes de lock interno.'
            : reviewStatus === 'ready_for_approval'
              ? 'Enviar previews financieros a aprobacion humana.'
              : 'Resolver blockers antes de aprobar estados financieros internos.',
      guardrails: [
        'Packet de revision interna; no emite estados financieros oficiales.',
        'Aprobacion conserva decision y evidencia, pero no reemplaza firma profesional.',
        'No crea ajustes contables automaticamente.',
      ],
    };
  }
}

function toReportReadiness(
  reportStatus: 'ready' | 'needs_review' | 'blocked',
): AccountingReadinessStatus {
  return reportStatus === 'ready'
    ? 'ready'
    : reportStatus === 'blocked'
      ? 'blocked'
      : 'needs_review';
}
