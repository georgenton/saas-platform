import { PartyProductRoleBridgeWorkspace } from '@saas-platform/parties-domain';
import { ListTenantPartiesUseCase } from './list-tenant-parties.use-case';
import {
  buildReadinessStatus,
  toPartyDirectoryV2Snapshot,
} from './party-directory-v2.helpers';

export class GetTenantPartyProductRoleBridgeWorkspaceUseCase {
  constructor(
    private readonly listTenantPartiesUseCase: ListTenantPartiesUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(tenantSlug: string): Promise<PartyProductRoleBridgeWorkspace> {
    const snapshots = (
      await this.listTenantPartiesUseCase.execute(tenantSlug)
    ).map((party) => toPartyDirectoryV2Snapshot(party));
    const roleBuckets = new Map<
      string,
      {
        totalParties: number;
        linkedProducts: Set<string>;
        missingFiscalProfileCount: number;
      }
    >();
    const productLinks = new Map<
      string,
      {
        productKey: string;
        role: string;
        partyIds: string[];
        readinessImpact: string;
      }
    >();

    for (const party of snapshots) {
      for (const role of party.roles) {
        const roleBucket = roleBuckets.get(role) ?? {
          totalParties: 0,
          linkedProducts: new Set<string>(),
          missingFiscalProfileCount: 0,
        };
        roleBucket.totalParties += 1;
        roleBucket.missingFiscalProfileCount +=
          party.completenessStatus === 'complete' ? 0 : 1;

        for (const productKey of party.linkedProducts) {
          roleBucket.linkedProducts.add(productKey);
          const linkKey = `${productKey}:${role}`;
          const productLink = productLinks.get(linkKey) ?? {
            productKey,
            role,
            partyIds: [],
            readinessImpact: buildReadinessImpact(productKey, role),
          };
          productLink.partyIds.push(party.id);
          productLinks.set(linkKey, productLink);
        }

        roleBuckets.set(role, roleBucket);
      }
    }

    const missingFiscalProfileCount = snapshots.filter(
      (party) => party.completenessStatus !== 'complete',
    ).length;

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      readinessStatus: buildReadinessStatus({
        blockedCount: 0,
        needsReviewCount: missingFiscalProfileCount,
      }),
      roleSummaries: Array.from(roleBuckets.entries())
        .map(([role, summary]) => ({
          role,
          totalParties: summary.totalParties,
          linkedProducts: Array.from(summary.linkedProducts).sort(
            (left, right) => left.localeCompare(right),
          ),
          missingFiscalProfileCount: summary.missingFiscalProfileCount,
        }))
        .sort((left, right) => left.role.localeCompare(right.role)),
      productLinks: Array.from(productLinks.values())
        .map((link) => ({
          ...link,
          partyIds: [...link.partyIds].sort((left, right) =>
            left.localeCompare(right),
          ),
        }))
        .sort(
          (left, right) =>
            left.productKey.localeCompare(right.productKey) ||
            left.role.localeCompare(right.role),
        ),
      nextStep:
        'Usar el puente de roles para decidir si una parte nace en Invoicing, Ecommerce, Growth o Tax Compliance.',
      guardrails: [
        'El rol no debe inferir obligaciones tributarias por si solo; Tax Compliance decide por periodo y evidencia.',
        'Antes de mover escrituras fuera de Invoicing, mantener aliases hacia los IDs actuales de clientes.',
      ],
    };
  }
}

function buildReadinessImpact(productKey: string, role: string): string {
  if (productKey === 'tax-compliance-ec') {
    return `${role}: evidencia fiscal para IVA, renta, anexos y retenciones.`;
  }

  if (productKey === 'ecommerce') {
    return `${role}: captura comercial que debe terminar en datos fiscales limpios.`;
  }

  if (productKey === 'invoicing') {
    return `${role}: emision electronica y datos de receptor.`;
  }

  return `${role}: referencia compartida de tercero.`;
}
