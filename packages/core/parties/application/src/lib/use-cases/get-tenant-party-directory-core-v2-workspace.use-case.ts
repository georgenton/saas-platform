import { PartyDirectoryCoreV2Workspace } from '@saas-platform/parties-domain';
import { GetTenantPartyFiscalReadinessSummaryUseCase } from './get-tenant-party-fiscal-readiness-summary.use-case';
import { ListTenantPartiesUseCase } from './list-tenant-parties.use-case';
import {
  buildReadinessStatus,
  toPartyDirectoryV2Snapshot,
} from './party-directory-v2.helpers';

export class GetTenantPartyDirectoryCoreV2WorkspaceUseCase {
  constructor(
    private readonly listTenantPartiesUseCase: ListTenantPartiesUseCase,
    private readonly getTenantPartyFiscalReadinessSummaryUseCase: GetTenantPartyFiscalReadinessSummaryUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(tenantSlug: string): Promise<PartyDirectoryCoreV2Workspace> {
    const [parties, fiscalSummary] = await Promise.all([
      this.listTenantPartiesUseCase.execute(tenantSlug),
      this.getTenantPartyFiscalReadinessSummaryUseCase.execute(tenantSlug),
    ]);
    const snapshots = parties.map((party) => toPartyDirectoryV2Snapshot(party));
    const linkedProducts = new Set(
      snapshots.flatMap((party) => party.linkedProducts),
    );
    const readinessStatus = buildReadinessStatus({
      blockedCount: 0,
      needsReviewCount: fiscalSummary.needsReviewParties,
    });

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      readinessStatus,
      summary: {
        totalParties: snapshots.length,
        completeParties: fiscalSummary.completeParties,
        needsReviewParties: fiscalSummary.needsReviewParties,
        customerCount: snapshots.filter((party) =>
          party.roles.includes('customer'),
        ).length,
        supplierCount: snapshots.filter((party) =>
          party.roles.includes('supplier'),
        ).length,
        linkedProductCount: linkedProducts.size,
      },
      parties: snapshots.sort((left, right) =>
        left.displayName.localeCompare(right.displayName),
      ),
      nextStep:
        readinessStatus === 'ready'
          ? 'Usar Parties 2.0 como directorio fiscal compartido para Invoicing, Ecommerce y Tax Compliance.'
          : 'Completar perfiles fiscales pendientes antes de depender del directorio en declaraciones o cierres.',
      guardrails: [
        'Parties 2.0 consolida lectura fiscal; la persistencia propia de proveedores queda para un slice posterior.',
        'Los enlaces de producto son derivados por rol y deben confirmarse antes de automatizar fusiones.',
      ],
    };
  }
}
