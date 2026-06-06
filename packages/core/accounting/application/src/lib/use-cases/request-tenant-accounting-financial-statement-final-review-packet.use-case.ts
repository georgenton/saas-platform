import { TenantAccountingFinancialStatementFinalReviewPacketView } from '@saas-platform/accounting-domain';
import { GetTenantAccountingFinancialStatementPreviewUseCase } from './get-tenant-accounting-financial-statement-preview.use-case';
import { GetTenantAccountingProfessionalCloseoutWorkspaceUseCase } from './get-tenant-accounting-professional-closeout-workspace.use-case';
import { ListTenantAccountingExternalCloseoutRecordsUseCase } from './list-tenant-accounting-external-closeout-records.use-case';

export class RequestTenantAccountingFinancialStatementFinalReviewPacketUseCase {
  constructor(
    private readonly getTenantAccountingFinancialStatementPreviewUseCase: GetTenantAccountingFinancialStatementPreviewUseCase,
    private readonly getTenantAccountingProfessionalCloseoutWorkspaceUseCase: GetTenantAccountingProfessionalCloseoutWorkspaceUseCase,
    private readonly listTenantAccountingExternalCloseoutRecordsUseCase: ListTenantAccountingExternalCloseoutRecordsUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingFinancialStatementFinalReviewPacketView> {
    const [financialStatementPreview, professionalCloseoutWorkspace, records] =
      await Promise.all([
        this.getTenantAccountingFinancialStatementPreviewUseCase.execute(input),
        this.getTenantAccountingProfessionalCloseoutWorkspaceUseCase.execute(
          input,
        ),
        this.listTenantAccountingExternalCloseoutRecordsUseCase.execute(input),
      ]);
    const externalCloseoutRecord = records[0] ?? null;
    const externalCloseoutRecorded =
      externalCloseoutRecord?.status === 'confirmed_by_accountant';
    const checklist: TenantAccountingFinancialStatementFinalReviewPacketView['checklist'] =
      [
        {
          key: 'financial_preview_ready',
          label: 'Financial statement preview',
          status:
            financialStatementPreview.previewStatus === 'ready_for_review'
              ? 'ready'
              : 'needs_review',
          detail: financialStatementPreview.nextStep,
        },
        {
          key: 'professional_workspace_ready',
          label: 'Professional closeout workspace',
          status:
            professionalCloseoutWorkspace.workspaceStatus ===
              'ready_for_closeout' ||
            professionalCloseoutWorkspace.workspaceStatus ===
              'closed_externally'
              ? 'ready'
              : 'needs_review',
          detail: professionalCloseoutWorkspace.nextStep,
        },
        {
          key: 'corrections_resolved',
          label: 'Correcciones resueltas',
          status:
            professionalCloseoutWorkspace.correctionsQueue.summary.openCount ===
              0 &&
            professionalCloseoutWorkspace.correctionsQueue.summary
              .inProgressCount === 0
              ? 'ready'
              : 'needs_review',
          detail: professionalCloseoutWorkspace.correctionsQueue.nextStep,
        },
        {
          key: 'external_closeout_confirmed',
          label: 'Cierre externo confirmado',
          status: externalCloseoutRecorded ? 'ready' : 'needs_review',
          detail: externalCloseoutRecorded
            ? 'Confirmacion externa registrada.'
            : 'Registrar confirmacion externa antes de final review.',
        },
      ];
    const blockers = [
      ...financialStatementPreview.blockers,
      ...professionalCloseoutWorkspace.blockers,
    ];
    const readyChecklistCount = checklist.filter(
      (item) => item.status === 'ready',
    ).length;
    const reviewStatus =
      blockers.length > 0
        ? 'blocked'
        : readyChecklistCount === checklist.length
          ? 'ready_for_final_review'
          : 'needs_review';

    return {
      ...input,
      generatedAt: this.nowProvider(),
      reviewStatus,
      financialStatementPreview,
      professionalCloseoutWorkspace,
      externalCloseoutRecord,
      checklist,
      summary: {
        checklistCount: checklist.length,
        readyChecklistCount,
        correctionCount:
          professionalCloseoutWorkspace.summary.correctionCount,
        netIncomeInCents:
          financialStatementPreview.summary.netIncomeInCents,
        externalCloseoutRecorded,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        reviewStatus === 'ready_for_final_review'
          ? 'Compartir paquete de final review con contador.'
          : 'Completar checklist antes de final review.',
      guardrails: [
        'Final review packet no emite estados financieros oficiales.',
        'No aplica ajustes ni reemplaza aprobacion profesional.',
      ],
    };
  }
}
