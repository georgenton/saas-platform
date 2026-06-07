import { PartiesProductCloseoutPack } from '@saas-platform/parties-domain';
import { GetTenantPartyDirectoryCoreV2WorkspaceUseCase } from './get-tenant-party-directory-core-v2-workspace.use-case';
import { GetTenantPartyDuplicateMergeReadinessWorkspaceUseCase } from './get-tenant-party-duplicate-merge-readiness-workspace.use-case';
import { GetTenantPartyFiscalIdentityProfileWorkspaceUseCase } from './get-tenant-party-fiscal-identity-profile-workspace.use-case';
import { GetTenantPartyProductRoleBridgeWorkspaceUseCase } from './get-tenant-party-product-role-bridge-workspace.use-case';
import { GetTenantPartySupplierCustomerFiscalReadinessWorkspaceUseCase } from './get-tenant-party-supplier-customer-fiscal-readiness-workspace.use-case';

export class RequestTenantPartiesProductCloseoutPackUseCase {
  constructor(
    private readonly getTenantPartyDirectoryCoreV2WorkspaceUseCase: GetTenantPartyDirectoryCoreV2WorkspaceUseCase,
    private readonly getTenantPartyFiscalIdentityProfileWorkspaceUseCase: GetTenantPartyFiscalIdentityProfileWorkspaceUseCase,
    private readonly getTenantPartyProductRoleBridgeWorkspaceUseCase: GetTenantPartyProductRoleBridgeWorkspaceUseCase,
    private readonly getTenantPartyDuplicateMergeReadinessWorkspaceUseCase: GetTenantPartyDuplicateMergeReadinessWorkspaceUseCase,
    private readonly getTenantPartySupplierCustomerFiscalReadinessWorkspaceUseCase: GetTenantPartySupplierCustomerFiscalReadinessWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(tenantSlug: string): Promise<PartiesProductCloseoutPack> {
    const [
      directoryCore,
      fiscalIdentity,
      productRoleBridge,
      duplicateMerge,
      supplierCustomerReadiness,
    ] = await Promise.all([
      this.getTenantPartyDirectoryCoreV2WorkspaceUseCase.execute(tenantSlug),
      this.getTenantPartyFiscalIdentityProfileWorkspaceUseCase.execute(
        tenantSlug,
      ),
      this.getTenantPartyProductRoleBridgeWorkspaceUseCase.execute(tenantSlug),
      this.getTenantPartyDuplicateMergeReadinessWorkspaceUseCase.execute(
        tenantSlug,
      ),
      this.getTenantPartySupplierCustomerFiscalReadinessWorkspaceUseCase.execute(
        tenantSlug,
      ),
    ]);
    const statuses = [
      directoryCore.readinessStatus,
      fiscalIdentity.readinessStatus,
      productRoleBridge.readinessStatus,
      duplicateMerge.readinessStatus,
      supplierCustomerReadiness.readinessStatus,
    ];
    const readinessStatus = statuses.includes('blocked')
      ? 'blocked'
      : statuses.includes('needs_review')
        ? 'needs_review'
        : 'ready';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      readinessStatus,
      directoryCore: directoryCore.summary,
      fiscalIdentity: fiscalIdentity.summary,
      productRoleBridge: productRoleBridge.roleSummaries,
      duplicateMerge: duplicateMerge.summary,
      supplierCustomerReadiness: supplierCustomerReadiness.summary,
      acceptanceChecklist: [
        {
          item: 'Directorio compartido consultable por tenant',
          status:
            directoryCore.summary.totalParties > 0 ? 'passed' : 'needs_review',
          evidence: `${directoryCore.summary.totalParties} parties expuestas en Parties 2.0.`,
        },
        {
          item: 'Identidad fiscal Ecuador preparada',
          status:
            fiscalIdentity.summary.missingTaxpayerIdCount === 0 &&
            fiscalIdentity.summary.missingIdentificationTypeCount === 0
              ? 'passed'
              : 'blocked',
          evidence: `${fiscalIdentity.summary.completeProfiles}/${fiscalIdentity.summary.totalParties} perfiles completos.`,
        },
        {
          item: 'Roles conectados a productos principales',
          status:
            productRoleBridge.productLinks.length > 0
              ? 'passed'
              : 'needs_review',
          evidence: `${productRoleBridge.productLinks.length} enlaces producto/rol derivados.`,
        },
        {
          item: 'Merge readiness sin ejecucion destructiva',
          status:
            duplicateMerge.summary.blockingGroupCount === 0
              ? 'passed'
              : 'blocked',
          evidence: `${duplicateMerge.summary.duplicateGroupCount} grupos duplicados detectados.`,
        },
        {
          item: 'Clientes/proveedores listos para Tax Compliance',
          status:
            supplierCustomerReadiness.summary.blockedForDeclarationsCount === 0
              ? 'passed'
              : 'blocked',
          evidence: `${supplierCustomerReadiness.summary.readyForTaxComplianceCount} parties listas para evidencia tributaria.`,
        },
      ],
      recommendedNextProduct:
        readinessStatus === 'ready'
          ? 'tax-compliance-hardening'
          : 'accounting-advanced-discovery',
      nextStep:
        readinessStatus === 'ready'
          ? 'Cerrar Parties 2.0 como foundation y volver a Tax Compliance hardening.'
          : 'Resolver identidad fiscal y duplicados antes de ampliar contabilidad avanzada.',
      guardrails: [
        'El closeout no declara impuestos ni fusiona terceros automaticamente.',
        'Accounting Advanced solo debe abrirse cuando existan necesidades de libros, bancos certificados o ledger formal.',
      ],
    };
  }
}
