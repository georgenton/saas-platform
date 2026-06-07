import { PartySupplierCustomerFiscalReadinessWorkspace } from '@saas-platform/parties-domain';
import { ListTenantPartiesUseCase } from './list-tenant-parties.use-case';
import {
  buildReadinessStatus,
  toPartyDirectoryV2Snapshot,
} from './party-directory-v2.helpers';

export class GetTenantPartySupplierCustomerFiscalReadinessWorkspaceUseCase {
  constructor(
    private readonly listTenantPartiesUseCase: ListTenantPartiesUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
  ): Promise<PartySupplierCustomerFiscalReadinessWorkspace> {
    const snapshots = (
      await this.listTenantPartiesUseCase.execute(tenantSlug)
    ).map((party) => toPartyDirectoryV2Snapshot(party));
    const customerReadiness = snapshots.filter((party) =>
      party.roles.includes('customer'),
    );
    const supplierReadiness = snapshots.filter((party) =>
      party.roles.includes('supplier'),
    );
    const fiscalReady = snapshots.filter(
      (party) => party.completenessStatus === 'complete',
    );
    const blockedForDeclarations = snapshots.filter((party) =>
      party.missingFields.some((field) =>
        ['taxpayer_id', 'identification_type', 'fiscal_profile'].includes(
          field,
        ),
      ),
    );

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      readinessStatus: buildReadinessStatus({
        blockedCount: blockedForDeclarations.length,
        needsReviewCount: snapshots.length - fiscalReady.length,
      }),
      summary: {
        customerCount: customerReadiness.length,
        supplierCount: supplierReadiness.length,
        readyForInvoicingCount: customerReadiness.filter(
          (party) => party.completenessStatus === 'complete',
        ).length,
        readyForTaxComplianceCount: fiscalReady.length,
        blockedForDeclarationsCount: blockedForDeclarations.length,
      },
      customerReadiness: customerReadiness.sort((left, right) =>
        left.displayName.localeCompare(right.displayName),
      ),
      supplierReadiness: supplierReadiness.sort((left, right) =>
        left.displayName.localeCompare(right.displayName),
      ),
      nextStep:
        blockedForDeclarations.length > 0
          ? 'Corregir identidad fiscal de clientes/proveedores antes de preparar declaraciones.'
          : 'Clientes y proveedores listos para evidencia fiscal asistida.',
      guardrails: [
        'Hoy proveedores pueden venir como rol futuro; la persistencia dedicada se debe agregar sin duplicar clientes.',
        'Tax Compliance decide si una parte participa en un periodo segun evidencia, no solo por rol.',
      ],
    };
  }
}
