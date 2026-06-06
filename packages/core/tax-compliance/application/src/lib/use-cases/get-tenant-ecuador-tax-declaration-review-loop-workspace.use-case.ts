import { EcuadorTaxDeclarationReviewLoopWorkspaceView } from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxDeclarationSourceLedgerUseCase } from './get-tenant-ecuador-tax-declaration-source-ledger.use-case';
import { GetTenantEcuadorTaxFilingHandoffUseCase } from './get-tenant-ecuador-tax-filing-handoff.use-case';
import { ListTenantEcuadorTaxAccountantReviewsUseCase } from './list-tenant-ecuador-tax-accountant-reviews.use-case';

export class GetTenantEcuadorTaxDeclarationReviewLoopWorkspaceUseCase {
  constructor(
    private readonly listTenantEcuadorTaxAccountantReviewsUseCase: ListTenantEcuadorTaxAccountantReviewsUseCase,
    private readonly getTenantEcuadorTaxFilingHandoffUseCase: GetTenantEcuadorTaxFilingHandoffUseCase,
    private readonly getTenantEcuadorTaxDeclarationSourceLedgerUseCase: GetTenantEcuadorTaxDeclarationSourceLedgerUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxDeclarationReviewLoopWorkspaceView> {
    const [reviews, filingHandoff, sourceLedger] = await Promise.all([
      this.listTenantEcuadorTaxAccountantReviewsUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
      }),
      this.getTenantEcuadorTaxFilingHandoffUseCase.execute(input),
      this.getTenantEcuadorTaxDeclarationSourceLedgerUseCase.execute(input),
    ]);
    const latestAccountantReview = reviews[0] ?? null;
    const filedExternally =
      filingHandoff.status === 'filed_externally' ||
      filingHandoff.status === 'paid_externally';
    const loopStatus =
      filedExternally
        ? 'filed_externally'
        : latestAccountantReview?.status === 'approved'
          ? 'approved_for_filing'
          : latestAccountantReview?.status === 'changes_requested'
            ? 'changes_requested'
            : latestAccountantReview
              ? 'sent_to_accountant'
              : 'draft_ready';
    const reviewChecklist: EcuadorTaxDeclarationReviewLoopWorkspaceView['reviewChecklist'] =
      [
        {
          key: 'source_ledger',
          label: 'Ledger fiscal preparado',
          status: sourceLedger.readinessStatus,
          detail: sourceLedger.nextStep,
        },
        {
          key: 'accountant_review',
          label: 'Revision contador',
          status: latestAccountantReview ? 'ready' : 'needs_review',
          detail: latestAccountantReview
            ? `Ultimo review ${latestAccountantReview.status}.`
            : 'Solicitar review contador.',
        },
        {
          key: 'external_filing_handoff',
          label: 'Handoff declaracion externa',
          status: filedExternally ? 'ready' : 'needs_review',
          detail: filingHandoff.nextStep,
        },
      ];
    const blockers = [
      ...sourceLedger.blockers,
      ...filingHandoff.blockers,
      ...reviewChecklist
        .filter((item) => item.status === 'blocked')
        .map((item) => `tax_review_loop.${item.key}.blocked`),
    ];
    const readyChecklistCount = reviewChecklist.filter(
      (item) => item.status === 'ready',
    ).length;

    return {
      ...input,
      generatedAt: this.nowProvider(),
      loopStatus,
      latestAccountantReview,
      filingHandoff,
      sourceLedger,
      reviewChecklist,
      summary: {
        checklistCount: reviewChecklist.length,
        readyChecklistCount,
        sourceRowCount: sourceLedger.summary.rowCount,
        blockerCount: blockers.length,
        filedExternally,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        loopStatus === 'filed_externally'
          ? 'Conservar comprobante externo y evidencia del periodo.'
          : loopStatus === 'approved_for_filing'
            ? 'Presentar declaracion externamente y registrar handoff.'
            : 'Completar review contador antes de presentar declaracion.',
      guardrails: [
        'El loop registra aprobaciones y filing externo; no presenta declaraciones.',
        'La aprobacion final debe venir de humano responsable o contador.',
      ],
    };
  }
}
