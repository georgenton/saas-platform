import { TenantAccountingOpeningBalanceApprovalPacketView } from '@saas-platform/accounting-domain';
import { GetTenantAccountingOpeningBalanceWorkspaceUseCase } from './get-tenant-accounting-opening-balance-workspace.use-case';

export class RequestTenantAccountingOpeningBalanceApprovalPacketUseCase {
  constructor(
    private readonly getTenantAccountingOpeningBalanceWorkspaceUseCase: GetTenantAccountingOpeningBalanceWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    decision: 'prepare' | 'approve' | 'reject';
    reviewerUserId?: string | null;
    reviewerEmail?: string | null;
    note?: string | null;
    evidenceReference?: string | null;
    lineKeys?: string[];
  }): Promise<TenantAccountingOpeningBalanceApprovalPacketView> {
    const workspace =
      await this.getTenantAccountingOpeningBalanceWorkspaceUseCase.execute(
        input,
      );
    const selectedLineKeys =
      input.lineKeys && input.lineKeys.length > 0
        ? input.lineKeys
        : workspace.balanceLines.map((line) => line.lineKey);
    const selectedLines = workspace.balanceLines.filter((line) =>
      selectedLineKeys.includes(line.lineKey),
    );
    const blockers = [
      ...workspace.blockers,
      ...(selectedLines.length === 0
        ? ['accounting.opening_balance_approval.no_lines_selected']
        : []),
      ...(workspace.summary.balanced
        ? []
        : ['accounting.opening_balance_approval.unbalanced']),
      ...(input.decision === 'approve' && workspace.readinessStatus === 'blocked'
        ? ['accounting.opening_balance_approval.workspace_blocked']
        : []),
      ...(input.decision === 'approve' && !input.reviewerEmail
        ? ['accounting.opening_balance_approval.reviewer_required']
        : []),
    ];
    const rejectedLineKeys =
      input.decision === 'reject' ? selectedLines.map((line) => line.lineKey) : [];
    const approvedLineKeys =
      input.decision === 'approve' && blockers.length === 0
        ? selectedLines.map((line) => line.lineKey)
        : [];
    const blockedLineCount = selectedLines.filter(
      (line) => line.reviewStatus === 'blocked',
    ).length;
    const approvalStatus =
      blockers.length > 0
        ? 'blocked'
        : input.decision === 'approve'
          ? 'approved'
          : input.decision === 'reject'
            ? 'needs_review'
            : workspace.readinessStatus === 'ready'
              ? 'ready_for_approval'
              : 'needs_review';

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      approvalStatus,
      decision: input.decision,
      reviewerUserId: input.reviewerUserId ?? null,
      reviewerEmail: input.reviewerEmail ?? null,
      note: input.note ?? null,
      evidenceReference: input.evidenceReference ?? null,
      workspace,
      approvedLineKeys,
      rejectedLineKeys,
      checklist: [
        {
          key: 'opening_lines',
          label: 'Opening lines',
          status: selectedLines.length > 0 ? 'ready' : 'blocked',
          detail: `${selectedLines.length}/${workspace.balanceLines.length} lineas seleccionadas.`,
        },
        {
          key: 'balanced',
          label: 'Balanced opening adjustment',
          status: workspace.summary.balanced ? 'ready' : 'blocked',
          detail: workspace.summary.balanced
            ? 'Debito y credito de apertura cuadran.'
            : 'Debito y credito de apertura no cuadran.',
        },
        {
          key: 'reviewer',
          label: 'Human reviewer',
          status:
            input.decision !== 'approve' || input.reviewerEmail
              ? 'ready'
              : 'blocked',
          detail: input.reviewerEmail
            ? `Review por ${input.reviewerEmail}.`
            : 'Aprobacion final requiere reviewer.',
        },
      ],
      summary: {
        lineCount: selectedLines.length,
        approvedLineCount: approvedLineKeys.length,
        rejectedLineCount: rejectedLineKeys.length,
        blockedLineCount,
        totalDebitInCents: selectedLines.reduce(
          (total, line) => total + line.debitInCents,
          0,
        ),
        totalCreditInCents: selectedLines.reduce(
          (total, line) => total + line.creditInCents,
          0,
        ),
        balanced: workspace.summary.balanced,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        approvalStatus === 'approved'
          ? 'Materializar asiento de apertura en el journal registry interno.'
          : 'Resolver saldos iniciales y preparar aprobacion humana.',
      guardrails: [
        'Approval packet no registra asientos por si mismo.',
        'La aprobacion requiere reviewer humano y evidencia revisable.',
        'No reemplaza migracion contable historica ni certificacion profesional.',
      ],
    };
  }
}
