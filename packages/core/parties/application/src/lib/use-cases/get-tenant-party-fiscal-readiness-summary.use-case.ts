import {
  Party,
  PartyFiscalReadinessSummary,
} from '@saas-platform/parties-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { PartyDirectoryRepository } from '../ports/party-directory.repository';

export class GetTenantPartyFiscalReadinessSummaryUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly partyDirectoryRepository: PartyDirectoryRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(tenantSlug: string): Promise<PartyFiscalReadinessSummary> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const parties = await this.partyDirectoryRepository.findByTenantId(
      tenant.id,
    );

    return buildPartyFiscalReadinessSummary({
      tenantSlug,
      generatedAt: this.nowProvider(),
      parties,
    });
  }
}

function buildPartyFiscalReadinessSummary(input: {
  tenantSlug: string;
  generatedAt: Date;
  parties: Party[];
}): PartyFiscalReadinessSummary {
  const roleBuckets = new Map<
    string,
    { totalParties: number; completeParties: number; needsReviewParties: number }
  >();
  const issueBuckets = new Map<string, number>();
  const incompleteParties: PartyFiscalReadinessSummary['incompleteParties'] = [];

  let completeParties = 0;
  let needsReviewParties = 0;

  for (const party of input.parties) {
    const fiscalProfile = party.fiscalProfile;
    const isComplete = fiscalProfile?.completenessStatus === 'complete';

    if (isComplete) {
      completeParties += 1;
    } else {
      needsReviewParties += 1;
    }

    for (const role of party.roles) {
      const bucket =
        roleBuckets.get(role) ??
        { totalParties: 0, completeParties: 0, needsReviewParties: 0 };
      bucket.totalParties += 1;
      bucket.completeParties += isComplete ? 1 : 0;
      bucket.needsReviewParties += isComplete ? 0 : 1;
      roleBuckets.set(role, bucket);
    }

    const missingFields = fiscalProfile?.missingFields ?? ['fiscal_profile'];
    const reviewNotes = fiscalProfile?.reviewNotes ?? [];

    for (const issue of [...missingFields, ...reviewNotes]) {
      issueBuckets.set(issue, (issueBuckets.get(issue) ?? 0) + 1);
    }

    if (!isComplete) {
      incompleteParties.push({
        id: party.id,
        displayName: party.displayName,
        roles: party.roles,
        taxpayerId: fiscalProfile?.taxpayerId ?? null,
        identificationType: fiscalProfile?.identificationType ?? null,
        fiscalAddress: fiscalProfile?.fiscalAddress ?? null,
        email: fiscalProfile?.email ?? null,
        completenessStatus: fiscalProfile?.completenessStatus ?? 'needs_review',
        missingFields,
        reviewNotes,
      });
    }
  }

  return {
    tenantSlug: input.tenantSlug,
    generatedAt: input.generatedAt,
    totalParties: input.parties.length,
    completeParties,
    needsReviewParties,
    roleSummaries: Array.from(roleBuckets.entries())
      .map(([role, summary]) => ({ role, ...summary }))
      .sort((left, right) => left.role.localeCompare(right.role)),
    issueSummaries: Array.from(issueBuckets.entries())
      .map(([issue, count]) => ({ issue, count }))
      .sort((left, right) => left.issue.localeCompare(right.issue)),
    incompleteParties: incompleteParties.sort((left, right) =>
      left.displayName.localeCompare(right.displayName),
    ),
    guardrails: [
      'Este resumen fiscal se deriva del directorio compartido de terceros; no reemplaza validacion oficial del SRI.',
      'Los proveedores aun no tienen persistencia propia y deben incorporarse sin duplicar clientes existentes.',
    ],
  };
}
