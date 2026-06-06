import { TenantAccountingReconciliationMatchPacketView } from '@saas-platform/accounting-domain';
import { GetTenantAccountingBankReconciliationWorkspaceUseCase } from './get-tenant-accounting-bank-reconciliation-workspace.use-case';

export class RequestTenantAccountingReconciliationMatchPacketUseCase {
  constructor(
    private readonly getTenantAccountingBankReconciliationWorkspaceUseCase: GetTenantAccountingBankReconciliationWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    candidateKeys?: string[];
    decision: 'prepare' | 'approve';
    reviewerUserId?: string | null;
    reviewerEmail?: string | null;
    note?: string | null;
  }): Promise<TenantAccountingReconciliationMatchPacketView> {
    const workspace =
      await this.getTenantAccountingBankReconciliationWorkspaceUseCase.execute(
        input,
      );
    const requestedCandidateKeys =
      input.candidateKeys && input.candidateKeys.length > 0
        ? [...new Set(input.candidateKeys)]
        : workspace.candidates
            .filter((candidate) => candidate.matchStatus === 'exact_match')
            .map((candidate) => candidate.candidateKey);
    const selectedCandidates = workspace.candidates.filter((candidate) =>
      requestedCandidateKeys.includes(candidate.candidateKey),
    );
    const missingCandidateKeys = requestedCandidateKeys.filter(
      (candidateKey) =>
        !workspace.candidates.some(
          (candidate) => candidate.candidateKey === candidateKey,
        ),
    );
    const needsReviewCandidates = selectedCandidates.filter(
      (candidate) => candidate.matchStatus !== 'exact_match',
    );
    const blockers = [
      ...workspace.blockers,
      ...(missingCandidateKeys.length > 0
        ? ['accounting.reconciliation_match_packet.unknown_candidates']
        : []),
      ...(selectedCandidates.length === 0
        ? ['accounting.reconciliation_match_packet.no_candidates_selected']
        : []),
      ...(needsReviewCandidates.length > 0
        ? ['accounting.reconciliation_match_packet.candidates_need_review']
        : []),
      ...(input.decision === 'approve' && !input.reviewerEmail
        ? ['accounting.reconciliation_match_packet.reviewer_required']
        : []),
    ];
    const approvedCandidateKeys =
      input.decision === 'approve' && blockers.length === 0
        ? selectedCandidates.map((candidate) => candidate.candidateKey)
        : [];
    const approvedAmountInCents = selectedCandidates
      .filter((candidate) =>
        approvedCandidateKeys.includes(candidate.candidateKey),
      )
      .reduce((total, candidate) => total + candidate.amountInCents, 0);
    const approvalChecklist = [
      {
        key: 'workspace_ready',
        label: 'Workspace de conciliacion listo',
        status: workspace.readinessStatus,
        detail: `${workspace.summary.exactMatchCount}/${workspace.summary.candidateCount} candidatos exactos.`,
      },
      {
        key: 'candidate_selection',
        label: 'Seleccion de matches',
        status:
          selectedCandidates.length > 0 && missingCandidateKeys.length === 0
            ? 'ready' as const
            : 'blocked' as const,
        detail: `${selectedCandidates.length} candidatos seleccionados.`,
      },
      {
        key: 'human_review',
        label: 'Revision humana',
        status:
          input.decision === 'approve' && input.reviewerEmail
            ? 'ready' as const
            : 'needs_review' as const,
        detail:
          input.decision === 'approve'
            ? `Aprobado por ${input.reviewerEmail ?? 'reviewer pendiente'}.`
            : 'Packet preparado para revision.',
      },
    ];
    const exactMatchCount = selectedCandidates.filter(
      (candidate) => candidate.matchStatus === 'exact_match',
    ).length;

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      packetStatus:
        blockers.length > 0
          ? 'blocked'
          : input.decision === 'approve'
            ? 'approved'
            : 'ready_for_approval',
      decision: input.decision,
      reviewerUserId: input.reviewerUserId ?? null,
      reviewerEmail: input.reviewerEmail ?? null,
      note: input.note ?? null,
      selectedCandidateKeys: requestedCandidateKeys,
      approvedCandidateKeys,
      workspace,
      approvalChecklist,
      summary: {
        selectedCandidateCount: selectedCandidates.length,
        approvedCandidateCount: approvedCandidateKeys.length,
        exactMatchCount,
        needsReviewCount: selectedCandidates.length - exactMatchCount,
        approvedAmountInCents,
        remainingDifferenceInCents: workspace.summary.totalDifferenceInCents,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        blockers.length > 0
          ? 'Resolver candidatos faltantes o con revision antes de aprobar.'
          : input.decision === 'approve'
            ? 'Usar readiness de conciliacion como evidencia para cierre del periodo.'
            : 'Revisar packet y aprobar matches si corresponden.',
      guardrails: [
        'Aprobacion operacional; no modifica extractos, journals ni bancos reales.',
        'Mantener evidencia externa del banco para auditoria.',
        'Diferencias abiertas deben resolverse con ajustes contables separados.',
      ],
    };
  }
}
