import {
  EcuadorTaxComplianceEventView,
  EcuadorTaxPartyFiscalValidationLedgerView,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxSriTaxpayerValidationReadinessUseCase } from './get-tenant-ecuador-tax-sri-taxpayer-validation-readiness.use-case';
import { ListTenantEcuadorTaxComplianceEventsUseCase } from './list-tenant-ecuador-tax-compliance-events.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';

type ImportedEvidenceRow = {
  partyId: string | null;
  displayName: string;
  taxpayerId: string | null;
  validationStatus: EcuadorTaxReadinessStatus;
  sourceReference: string | null;
  observedAt: string | null;
  discrepancies: string[];
};

export class GetTenantEcuadorTaxPartyFiscalValidationLedgerUseCase {
  constructor(
    private readonly getTenantEcuadorTaxSriTaxpayerValidationReadinessUseCase: GetTenantEcuadorTaxSriTaxpayerValidationReadinessUseCase,
    private readonly listTenantEcuadorTaxComplianceEventsUseCase: ListTenantEcuadorTaxComplianceEventsUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxPartyFiscalValidationLedgerView> {
    const [readiness, events] = await Promise.all([
      this.getTenantEcuadorTaxSriTaxpayerValidationReadinessUseCase.execute(
        input,
      ),
      this.listTenantEcuadorTaxComplianceEventsUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        limit: 200,
      }),
    ]);
    const importEvents = events.filter(
      (event) => event.eventType === 'tax_party_sri_evidence_import_recorded',
    );
    const rowsByPartyId = new Map<string, ImportedEvidenceRow[]>();

    for (const event of importEvents) {
      for (const row of extractRows(event)) {
        if (!row.partyId) {
          continue;
        }

        rowsByPartyId.set(row.partyId, [
          ...(rowsByPartyId.get(row.partyId) ?? []),
          row,
        ]);
      }
    }

    const entries = readiness.validationCandidates.map((candidate) => {
      const rows = rowsByPartyId.get(candidate.partyId) ?? [];
      const latestRow = rows[0] ?? null;
      const discrepancyCount = rows.reduce(
        (sum, row) => sum + row.discrepancies.length,
        0,
      );
      const auditTrail = importEvents
        .filter((event) =>
          extractRows(event).some((row) => row.partyId === candidate.partyId),
        )
        .map((event) => ({
          eventId: event.id,
          eventType: event.eventType,
          source: event.source,
          occurredAt: event.occurredAt,
          detail: `Evidencia SRI para ${candidate.displayName}.`,
        }));

      return {
        partyId: candidate.partyId,
        displayName: candidate.displayName,
        taxpayerId: candidate.taxpayerId,
        currentReadinessStatus: candidate.validationStatus,
        latestEvidenceStatus: latestRow?.validationStatus ?? null,
        latestEvidenceSource: latestRow?.sourceReference ?? null,
        latestEvidenceAt: latestRow?.observedAt
          ? new Date(latestRow.observedAt)
          : null,
        discrepancyCount,
        overrideRequired:
          discrepancyCount > 0 || latestRow?.validationStatus === 'blocked',
        auditTrail,
      };
    });
    const blockers = entries
      .filter((entry) => entry.overrideRequired)
      .map((entry) => `party_validation_ledger.${entry.partyId}`);
    const ledgerStatus =
      blockers.length > 0
        ? 'blocked'
        : entries.some((entry) => !entry.latestEvidenceStatus)
          ? 'needs_review'
          : 'ready';
    const ledger: EcuadorTaxPartyFiscalValidationLedgerView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      ledgerStatus,
      entries,
      summary: {
        entryCount: entries.length,
        evidenceBackedCount: entries.filter(
          (entry) => entry.latestEvidenceStatus,
        ).length,
        discrepancyCount: entries.reduce(
          (sum, entry) => sum + entry.discrepancyCount,
          0,
        ),
        overrideRequiredCount: entries.filter((entry) => entry.overrideRequired)
          .length,
      },
      blockers,
      nextStep:
        ledgerStatus === 'ready'
          ? 'Usar ledger fiscal de parties como soporte para recalculo tributario.'
          : 'Completar evidencia u overrides antes de cerrar declaraciones.',
      guardrails: [
        'El ledger reconstruye evidencia desde eventos tributarios; no reemplaza repositorio oficial de Parties.',
        'Los overrides humanos deben conservar fuente y responsable.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_party_fiscal_validation_ledger_reviewed',
        source: 'tax_party_fiscal_validation_ledger',
        payload: {
          ledgerStatus,
          entryCount: ledger.summary.entryCount,
          discrepancyCount: ledger.summary.discrepancyCount,
        },
      });
    }

    return ledger;
  }
}

function extractRows(
  event: EcuadorTaxComplianceEventView,
): ImportedEvidenceRow[] {
  const rows = event.payload['rows'];

  return Array.isArray(rows) ? (rows as ImportedEvidenceRow[]) : [];
}
