import {
  EcuadorTaxReadinessStatus,
  EcuadorTaxSriFilingReceiptEvidenceVaultView,
} from '@saas-platform/tax-compliance-domain';
import { ListTenantEcuadorTaxExternalFilingResultsUseCase } from './list-tenant-ecuador-tax-external-filing-results.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';

export class GetTenantEcuadorTaxSriFilingReceiptEvidenceVaultUseCase {
  constructor(
    private readonly listTenantEcuadorTaxExternalFilingResultsUseCase: ListTenantEcuadorTaxExternalFilingResultsUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxSriFilingReceiptEvidenceVaultView> {
    const filingResults =
      await this.listTenantEcuadorTaxExternalFilingResultsUseCase.execute(
        input,
      );
    const receiptFolders: EcuadorTaxSriFilingReceiptEvidenceVaultView['receiptFolders'] =
      filingResults.map((result) => {
        const requiredItems = [
          'external_reference',
          'filing_receipt_or_screen',
          result.resultStatus === 'paid_externally' ? 'payment_receipt' : null,
        ].filter((item): item is string => item !== null);
        const missingItems = [
          result.externalReference ? null : 'external_reference',
          result.evidenceRefs.length > 0 ? null : 'filing_receipt_or_screen',
          result.resultStatus === 'paid_externally' && !result.paidAt
            ? 'payment_receipt'
            : null,
        ].filter((item): item is string => item !== null);

        return {
          key: result.resultId,
          label: `${result.obligationKey} ${result.formKey ?? 'manual'}`,
          readinessStatus:
            result.resultStatus === 'rejected_externally'
              ? ('blocked' as const)
              : missingItems.length > 0
                ? ('needs_review' as const)
                : ('ready' as const),
          externalReference: result.externalReference,
          evidenceRefs: result.evidenceRefs,
          requiredItems,
          missingItems,
        };
      });
    const blockers = [
      filingResults.length === 0 ? 'receipt_vault.no_external_results' : null,
      ...receiptFolders.flatMap((folder) =>
        folder.missingItems.map(
          (item) => `receipt_vault.${folder.key}.${item}`,
        ),
      ),
      ...filingResults
        .filter((result) => result.resultStatus === 'rejected_externally')
        .map((result) => `receipt_vault.${result.resultId}.filing_rejected`),
    ].filter((blocker): blocker is string => blocker !== null);
    const vaultStatus = resolveStatus(
      receiptFolders.map((folder) => folder.readinessStatus),
      blockers,
    );
    const summary = {
      folderCount: receiptFolders.length,
      readyFolderCount: receiptFolders.filter(
        (folder) => folder.readinessStatus === 'ready',
      ).length,
      evidenceRefCount: receiptFolders.reduce(
        (total, folder) => total + folder.evidenceRefs.length,
        0,
      ),
      missingItemCount: receiptFolders.reduce(
        (total, folder) => total + folder.missingItems.length,
        0,
      ),
    };
    const view: EcuadorTaxSriFilingReceiptEvidenceVaultView = {
      ...input,
      generatedAt: this.nowProvider(),
      vaultStatus,
      filingResults,
      receiptFolders,
      summary,
      blockers: [...new Set(blockers)],
      nextStep:
        vaultStatus === 'ready'
          ? 'Usar vault de recibos como evidencia post-filing defendible.'
          : 'Adjuntar referencias, recibos o pantallas aportadas por operador/contador.',
      guardrails: [
        'Vault organiza evidencia aportada; no descarga recibos desde SRI.',
        'Capturas, PDFs y referencias deben conservarse como soporte externo.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_sri_filing_receipt_evidence_vault_reviewed',
        source: 'tax_sri_filing_receipt_evidence_vault',
        payload: { vaultStatus, summary },
      });
    }

    return view;
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
