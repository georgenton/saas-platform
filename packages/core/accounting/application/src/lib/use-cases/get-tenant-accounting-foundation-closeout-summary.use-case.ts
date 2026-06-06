import { TenantAccountingFoundationCloseoutSummaryView } from '@saas-platform/accounting-domain';
import { GetTenantAccountingLegalBooksReadinessPacketUseCase } from './get-tenant-accounting-legal-books-readiness-packet.use-case';
import { GetTenantAccountingPeriodCloseoutTimelineUseCase } from './get-tenant-accounting-period-closeout-timeline.use-case';
import { GetTenantAccountingProfessionalCloseoutWorkspaceUseCase } from './get-tenant-accounting-professional-closeout-workspace.use-case';
import { RequestTenantAccountingFinancialStatementFinalReviewPacketUseCase } from './request-tenant-accounting-financial-statement-final-review-packet.use-case';

export class GetTenantAccountingFoundationCloseoutSummaryUseCase {
  constructor(
    private readonly getTenantAccountingProfessionalCloseoutWorkspaceUseCase: GetTenantAccountingProfessionalCloseoutWorkspaceUseCase,
    private readonly getTenantAccountingLegalBooksReadinessPacketUseCase: GetTenantAccountingLegalBooksReadinessPacketUseCase,
    private readonly requestTenantAccountingFinancialStatementFinalReviewPacketUseCase: RequestTenantAccountingFinancialStatementFinalReviewPacketUseCase,
    private readonly getTenantAccountingPeriodCloseoutTimelineUseCase: GetTenantAccountingPeriodCloseoutTimelineUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingFoundationCloseoutSummaryView> {
    const [
      professionalCloseoutWorkspace,
      legalBooksReadiness,
      financialStatementFinalReview,
      closeoutTimeline,
    ] = await Promise.all([
      this.getTenantAccountingProfessionalCloseoutWorkspaceUseCase.execute(
        input,
      ),
      this.getTenantAccountingLegalBooksReadinessPacketUseCase.execute(input),
      this.requestTenantAccountingFinancialStatementFinalReviewPacketUseCase.execute(
        input,
      ),
      this.getTenantAccountingPeriodCloseoutTimelineUseCase.execute(input),
    ]);
    const completedScope = [
      'Tax-to-accounting intake bridge',
      'Chart mapping workspace',
      'Journal draft approval and registry',
      'Ledger registry and trial balance',
      'Bank reconciliation evidence controls',
      'Period lock, reopen and audit trail',
      'Financial statement preview and review packets',
      'Evidence vault and accountant handoff',
      'Accountant review lifecycle and certification readiness',
      'Professional closeout workspace and artifact packet',
    ];
    const advancedAccountingBacklog = [
      'Official legal book generation and signing',
      'Certified bank-feed reconciliation',
      'Advanced adjusting-entry automation',
      'Multi-period financial statements',
      'External accountant/auditor portal',
      'Accounting policies and closing templates',
    ];
    const blockers = [
      ...professionalCloseoutWorkspace.blockers,
      ...legalBooksReadiness.blockers,
      ...financialStatementFinalReview.blockers,
      ...closeoutTimeline.blockers,
    ];
    const legalBooksReady =
      legalBooksReadiness.readinessStatus ===
      'ready_for_legal_book_preparation';
    const finalReviewReady =
      financialStatementFinalReview.reviewStatus ===
      'ready_for_final_review';
    const summaryStatus =
      blockers.length > 0
        ? 'blocked'
        : legalBooksReady && finalReviewReady
          ? 'foundation_complete'
          : 'needs_review';

    return {
      ...input,
      generatedAt: this.nowProvider(),
      summaryStatus,
      professionalCloseoutWorkspace,
      legalBooksReadiness,
      financialStatementFinalReview,
      closeoutTimeline,
      completedScope,
      advancedAccountingBacklog,
      recommendedNextProduct: 'tax_compliance_deeper',
      summary: {
        completedScopeCount: completedScope.length,
        backlogItemCount: advancedAccountingBacklog.length,
        timelineEventCount: closeoutTimeline.summary.eventCount,
        legalBooksReady,
        finalReviewReady,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        summaryStatus === 'foundation_complete'
          ? 'Evaluar siguiente producto: profundizar Tax Compliance EC.'
          : 'Completar readiness de libros, final review y timeline.',
      guardrails: [
        'Foundation closeout declara alcance operativo construido, no certificacion legal.',
        'Accounting Advanced debe abrirse solo si clientes requieren libros oficiales o portal profesional.',
      ],
    };
  }
}
