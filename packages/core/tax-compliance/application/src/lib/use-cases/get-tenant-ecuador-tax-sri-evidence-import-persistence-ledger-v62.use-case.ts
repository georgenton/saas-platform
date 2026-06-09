import {
  EcuadorTaxReadinessStatus,
  EcuadorTaxSriEvidenceImportPersistenceLedgerV62View,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxSriSourceImportCenterV2UseCase } from './get-tenant-ecuador-tax-sri-source-import-center-v2.use-case';
import { ListTenantEcuadorTaxComplianceEventsUseCase } from './list-tenant-ecuador-tax-compliance-events.use-case';

export class GetTenantEcuadorTaxSriEvidenceImportPersistenceLedgerV62UseCase {
  constructor(
    private readonly getTenantEcuadorTaxSriSourceImportCenterV2UseCase: GetTenantEcuadorTaxSriSourceImportCenterV2UseCase,
    private readonly listTenantEcuadorTaxComplianceEventsUseCase: ListTenantEcuadorTaxComplianceEventsUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxSriEvidenceImportPersistenceLedgerV62View> {
    const [center, events] = await Promise.all([
      this.getTenantEcuadorTaxSriSourceImportCenterV2UseCase.execute(input),
      this.listTenantEcuadorTaxComplianceEventsUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        limit: 50,
      }),
    ]);
    const importEvents = events.filter(
      (event) => event.eventType === 'sri_fiscal_evidence_import_recorded',
    );
    const importBatches = importEvents.map((event) => {
      const payload = event.payload as {
        importId?: string;
        source?: string;
        importedByEmail?: string | null;
        summary?: {
          totalVouchers?: number;
          issuedVouchers?: number;
          receivedVouchers?: number;
          duplicateAccessKeys?: number;
          blockedVouchers?: number;
          needsReviewVouchers?: number;
        };
      };
      const duplicateAccessKeys = payload.summary?.duplicateAccessKeys ?? 0;
      const blockedVouchers = payload.summary?.blockedVouchers ?? 0;
      const needsReviewVouchers = payload.summary?.needsReviewVouchers ?? 0;
      const status: EcuadorTaxReadinessStatus =
        blockedVouchers > 0
          ? 'blocked'
          : needsReviewVouchers > 0 || duplicateAccessKeys > 0
            ? 'needs_review'
            : 'ready';

      return {
        importId: payload.importId ?? event.id,
        source: payload.source ?? event.source,
        importedByEmail: payload.importedByEmail ?? null,
        recordedAt: event.occurredAt,
        status,
        issuedVoucherCount: payload.summary?.issuedVouchers ?? 0,
        receivedVoucherCount: payload.summary?.receivedVouchers ?? 0,
        duplicateAccessKeys,
        hashControl: `event:${event.id}:period:${input.period}`,
        reconciliationStatus: center.reconciliation.readinessStatus,
        nextAction:
          status === 'ready'
            ? 'Usar batch como evidencia fiscal del periodo.'
            : 'Revisar duplicados, vouchers incompletos o diferencias con plataforma.',
      };
    });
    const fallbackBatches =
      importBatches.length > 0
        ? importBatches
        : [
            {
              importId: `derived_${input.period}_sri_source_center`,
              source: 'derived_workspace',
              importedByEmail: null,
              recordedAt: center.generatedAt,
              status: center.centerStatus,
              issuedVoucherCount:
                center.intake.workspace.summary.issuedVouchers,
              receivedVoucherCount:
                center.intake.workspace.summary.receivedVouchers,
              duplicateAccessKeys: center.summary.duplicateAccessKeys,
              hashControl: `derived:${input.tenantSlug}:${input.period}`,
              reconciliationStatus: center.reconciliation.readinessStatus,
              nextAction:
                'Registrar un batch SRI aportado por contribuyente para trazabilidad completa.',
            },
          ];
    const blockers = [
      ...center.blockers,
      ...fallbackBatches
        .filter((batch) => batch.status === 'blocked')
        .map((batch) => `sri_import_batch.${batch.importId}.blocked`),
    ];
    const ledgerStatus = resolveStatus(
      fallbackBatches.map((batch) => batch.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      ledgerStatus,
      importBatches: fallbackBatches,
      sourceChannels: center.sourceChannels,
      summary: {
        batchCount: fallbackBatches.length,
        persistedBatchCount: importBatches.length,
        totalVoucherCount: fallbackBatches.reduce(
          (total, batch) =>
            total + batch.issuedVoucherCount + batch.receivedVoucherCount,
          0,
        ),
        duplicateAccessKeys: center.summary.duplicateAccessKeys,
        reconciliationIssueCount: center.summary.reconciliationIssueCount,
        blockingIssueCount: center.summary.blockingIssueCount,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        importBatches.length > 0
          ? 'Usar ledger persistente de importaciones para excepciones, formularios y packet contador.'
          : 'Registrar/importar evidencia SRI real para reemplazar el ledger derivado.',
      guardrails: [
        'El ledger guarda trazabilidad operativa; no descarga informacion SRI automaticamente.',
        'Hash control identifica lotes del periodo, no firma ni certifica datos tributarios.',
      ],
    };
  }
}

function resolveStatus(
  statuses: EcuadorTaxReadinessStatus[],
  blockers: string[],
): EcuadorTaxReadinessStatus {
  if (blockers.length > 0 || statuses.includes('blocked')) {
    return 'blocked';
  }

  return statuses.includes('needs_review') ? 'needs_review' : 'ready';
}
