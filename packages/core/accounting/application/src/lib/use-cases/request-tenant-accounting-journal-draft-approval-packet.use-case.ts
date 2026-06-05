import { TenantAccountingJournalDraftApprovalPacketView } from '@saas-platform/accounting-domain';
import { GetTenantAccountingJournalDraftPreviewUseCase } from './get-tenant-accounting-journal-draft-preview.use-case';

export class RequestTenantAccountingJournalDraftApprovalPacketUseCase {
  constructor(
    private readonly getTenantAccountingJournalDraftPreviewUseCase: GetTenantAccountingJournalDraftPreviewUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    draftEntryKeys?: string[];
    decision: 'approve' | 'reject';
    reviewerUserId?: string | null;
    reviewerEmail?: string | null;
    note?: string | null;
  }): Promise<TenantAccountingJournalDraftApprovalPacketView> {
    const preview =
      await this.getTenantAccountingJournalDraftPreviewUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
      });
    const requestedKeys = new Set(input.draftEntryKeys ?? []);
    const selectedEntries =
      requestedKeys.size > 0
        ? preview.draftEntries.filter((entry) =>
            requestedKeys.has(entry.draftEntryKey),
          )
        : preview.draftEntries;
    const blockedEntries = selectedEntries.filter(
      (entry) => entry.blockers.length > 0 || !entry.totals.balanced,
    );
    const missingKeys = [...requestedKeys].filter(
      (key) => !preview.draftEntries.some((entry) => entry.draftEntryKey === key),
    );
    const blockers = [
      ...preview.blockers,
      ...blockedEntries.flatMap((entry) => entry.blockers),
      ...missingKeys.map((key) => `accounting.journal.unknown_draft.${key}`),
    ];
    const approvalStatus =
      blockers.length > 0
        ? 'needs_mapping'
        : input.decision === 'approve'
          ? 'approved_for_posting'
          : 'rejected';
    const approvedDraftEntryKeys =
      approvalStatus === 'approved_for_posting'
        ? selectedEntries.map((entry) => entry.draftEntryKey)
        : [];
    const rejectedDraftEntryKeys =
      approvalStatus === 'rejected'
        ? selectedEntries.map((entry) => entry.draftEntryKey)
        : [];

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      approvalStatus,
      reviewerUserId: input.reviewerUserId ?? null,
      reviewerEmail: input.reviewerEmail ?? null,
      note: normalize(input.note),
      approvedDraftEntryKeys,
      rejectedDraftEntryKeys,
      draftEntries: selectedEntries,
      summary: {
        requestedDraftEntryCount: selectedEntries.length,
        approvedDraftEntryCount: approvedDraftEntryKeys.length,
        rejectedDraftEntryCount: rejectedDraftEntryKeys.length,
        blockedDraftEntryCount: blockedEntries.length,
        balancedDraftCount: selectedEntries.filter((entry) => entry.totals.balanced)
          .length,
        totalDebitInCents: selectedEntries.reduce(
          (total, entry) => total + entry.totals.debitInCents,
          0,
        ),
        totalCreditInCents: selectedEntries.reduce(
          (total, entry) => total + entry.totals.creditInCents,
          0,
        ),
      },
      blockers: [...new Set(blockers)],
      nextStep:
        approvalStatus === 'approved_for_posting'
          ? 'Usar estos borradores aprobados como insumo de ledger preview; el posteo formal queda pendiente.'
          : approvalStatus === 'rejected'
            ? 'Corregir evidencia o mappings antes de solicitar nueva aprobacion.'
            : 'Resolver mappings y blockers antes de aprobar borradores.',
      guardrails: [
        'Approval packet operativo: no postea asientos ni abre diario oficial.',
        'La aprobacion deja trazabilidad de revision humana, no reemplaza criterio profesional.',
        'El posteo contable formal requiere un slice posterior con repositorio de journals.',
      ],
    };
  }
}

function normalize(value?: string | null): string | null {
  const normalized = value?.trim();

  return normalized ? normalized : null;
}
