import {
  EcuadorTaxPartySriEvidenceImportView,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxSriTaxpayerValidationReadinessUseCase } from './get-tenant-ecuador-tax-sri-taxpayer-validation-readiness.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';

export class RecordTenantEcuadorTaxPartySriEvidenceImportUseCase {
  constructor(
    private readonly getTenantEcuadorTaxSriTaxpayerValidationReadinessUseCase: GetTenantEcuadorTaxSriTaxpayerValidationReadinessUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    source: 'sri_report' | 'sri_xml' | 'manual_summary' | 'future_api';
    importedByEmail?: string | null;
    rows: Array<{
      partyId?: string | null;
      taxpayerId?: string | null;
      taxpayerName?: string | null;
      validationStatus?: EcuadorTaxReadinessStatus;
      sourceReference?: string | null;
      observedAt?: Date | string | null;
    }>;
  }): Promise<EcuadorTaxPartySriEvidenceImportView> {
    const readiness =
      await this.getTenantEcuadorTaxSriTaxpayerValidationReadinessUseCase.execute(
        input,
      );
    const candidatesByPartyId = new Map(
      readiness.validationCandidates.map((candidate) => [
        candidate.partyId,
        candidate,
      ]),
    );
    const candidatesByTaxpayerId = new Map(
      readiness.validationCandidates
        .filter((candidate) => candidate.taxpayerId)
        .map((candidate) => [candidate.taxpayerId, candidate]),
    );
    const evidenceRows = input.rows.map((row) => {
      const matched =
        (row.partyId ? candidatesByPartyId.get(row.partyId) : null) ??
        (row.taxpayerId ? candidatesByTaxpayerId.get(row.taxpayerId) : null) ??
        null;
      const validationStatus = row.validationStatus ?? 'needs_review';
      const discrepancies = [
        !matched ? 'party_not_matched' : null,
        matched?.taxpayerId &&
        row.taxpayerId &&
        matched.taxpayerId !== row.taxpayerId
          ? 'taxpayer_id_mismatch'
          : null,
        matched?.displayName &&
        row.taxpayerName &&
        normalize(matched.displayName) !== normalize(row.taxpayerName)
          ? 'taxpayer_name_review'
          : null,
      ].filter((item): item is string => item !== null);

      return {
        partyId: matched?.partyId ?? row.partyId ?? null,
        displayName:
          matched?.displayName ?? row.taxpayerName ?? 'Unmatched taxpayer',
        taxpayerId: row.taxpayerId ?? matched?.taxpayerId ?? null,
        taxpayerName: row.taxpayerName ?? null,
        validationStatus,
        sourceReference: row.sourceReference ?? null,
        observedAt: row.observedAt ? new Date(row.observedAt) : null,
        matchedReadinessStatus: matched?.validationStatus ?? 'needs_review',
        discrepancies,
      };
    });
    const blockers = evidenceRows
      .filter(
        (row) =>
          row.validationStatus === 'blocked' || row.discrepancies.length > 0,
      )
      .map((row) => `party_sri_evidence.${row.partyId ?? row.taxpayerId}`);
    const importStatus =
      blockers.length > 0
        ? 'blocked'
        : evidenceRows.some((row) => row.validationStatus === 'needs_review')
          ? 'needs_review'
          : 'ready';
    const event =
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_party_sri_evidence_import_recorded',
        source: 'tax_party_sri_evidence_import',
        payload: {
          source: input.source,
          importedByEmail: input.importedByEmail ?? null,
          rows: evidenceRows.map((row) => ({
            ...row,
            observedAt: row.observedAt?.toISOString() ?? null,
          })),
          importStatus,
        },
      });

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      importStatus,
      source: input.source,
      importedByEmail: input.importedByEmail ?? null,
      evidenceRows,
      summary: {
        rowCount: evidenceRows.length,
        matchedPartyCount: evidenceRows.filter((row) => row.partyId).length,
        blockedRowCount: evidenceRows.filter(
          (row) => row.validationStatus === 'blocked',
        ).length,
        discrepancyCount: evidenceRows.reduce(
          (sum, row) => sum + row.discrepancies.length,
          0,
        ),
      },
      eventId: event.id,
      blockers: [...new Set(blockers)],
      nextStep:
        importStatus === 'ready'
          ? 'Usar evidencia SRI de terceros para recalcular declaraciones.'
          : 'Resolver discrepancias de evidencia SRI antes de cerrar formularios.',
      guardrails: [
        'Este import registra evidencia del contribuyente; no consulta SRI en linea.',
        'Las discrepancias requieren revision humana antes de corregir Parties.',
      ],
    };
  }
}

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}
