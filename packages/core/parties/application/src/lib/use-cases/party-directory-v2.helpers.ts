import {
  Party,
  PartyDirectoryV2DuplicateReason,
  PartyDirectoryV2ReadinessStatus,
  PartyDirectoryV2Snapshot,
  PartyDuplicateMergeReadinessWorkspace,
} from '@saas-platform/parties-domain';

export function toPartyDirectoryV2Snapshot(
  party: Party,
): PartyDirectoryV2Snapshot {
  const fiscalProfile = party.fiscalProfile;

  return {
    id: party.id,
    displayName: party.displayName,
    roles: party.roles,
    sourceContext: party.sourceContext,
    taxpayerId: fiscalProfile?.taxpayerId ?? party.taxId ?? null,
    identificationType:
      fiscalProfile?.identificationType ?? party.identificationType ?? null,
    fiscalAddress: fiscalProfile?.fiscalAddress ?? party.billingAddress ?? null,
    email: fiscalProfile?.email ?? party.email ?? null,
    completenessStatus: fiscalProfile?.completenessStatus ?? 'needs_review',
    missingFields: fiscalProfile?.missingFields ?? ['fiscal_profile'],
    reviewNotes: fiscalProfile?.reviewNotes ?? [],
    linkedProducts: inferLinkedProducts(party.roles),
    updatedAt: party.updatedAt,
  };
}

export function inferLinkedProducts(roles: string[]): string[] {
  const products = new Set<string>();

  for (const role of roles) {
    if (role === 'customer') {
      products.add('invoicing');
      products.add('ecommerce');
      products.add('tax-compliance-ec');
    }

    if (role === 'supplier') {
      products.add('tax-compliance-ec');
      products.add('accounting-foundation');
    }

    if (role === 'lead') {
      products.add('growth');
      products.add('ecommerce');
    }
  }

  return Array.from(products).sort((left, right) => left.localeCompare(right));
}

export function buildReadinessStatus(input: {
  blockedCount: number;
  needsReviewCount: number;
}): PartyDirectoryV2ReadinessStatus {
  if (input.blockedCount > 0) {
    return 'blocked';
  }

  if (input.needsReviewCount > 0) {
    return 'needs_review';
  }

  return 'ready';
}

export function buildDuplicateGroups(
  snapshots: PartyDirectoryV2Snapshot[],
): PartyDuplicateMergeReadinessWorkspace['duplicateGroups'] {
  const groups = new Map<
    string,
    {
      reason: PartyDirectoryV2DuplicateReason;
      parties: PartyDirectoryV2Snapshot[];
    }
  >();

  for (const party of snapshots) {
    const values: Array<[PartyDirectoryV2DuplicateReason, string | null]> = [
      ['taxpayer_id', party.taxpayerId],
      ['email', party.email],
      ['display_name', party.displayName],
    ];

    for (const [reason, rawValue] of values) {
      const normalized = normalizeDuplicateKey(rawValue);

      if (!normalized) {
        continue;
      }

      const key = `${reason}:${normalized}`;
      const current = groups.get(key) ?? { reason, parties: [] };
      current.parties.push(party);
      groups.set(key, current);
    }
  }

  return Array.from(groups.entries())
    .filter(([, group]) => group.parties.length > 1)
    .map(([key, group]) => {
      const mergeRisk: 'high' | 'medium' | 'low' =
        group.reason === 'taxpayer_id'
          ? 'high'
          : hasFiscalConflict(group.parties)
            ? 'high'
            : group.reason === 'email'
              ? 'medium'
              : 'low';
      const sortedParties = [...group.parties].sort(
        (left, right) =>
          Number(right.completenessStatus === 'complete') -
            Number(left.completenessStatus === 'complete') ||
          right.updatedAt.getTime() - left.updatedAt.getTime(),
      );

      return {
        key,
        reason: group.reason,
        partyIds: group.parties.map((party) => party.id),
        displayNames: group.parties.map((party) => party.displayName),
        suggestedSurvivorPartyId: sortedParties[0]?.id ?? null,
        mergeRisk,
        checklist: [
          'Comparar RUC/cedula, email fiscal y direccion antes de fusionar.',
          'Validar referencias desde Invoicing, Ecommerce y Tax Compliance.',
          'Ejecutar fusion solo cuando exista auditoria de superviviente y alias.',
        ],
      };
    })
    .sort((left, right) => left.key.localeCompare(right.key));
}

function normalizeDuplicateKey(value: string | null): string | null {
  const normalized = value?.trim().toLowerCase().replace(/\s+/g, ' ');

  return normalized && normalized.length > 1 ? normalized : null;
}

function hasFiscalConflict(parties: PartyDirectoryV2Snapshot[]): boolean {
  return (
    new Set(
      parties
        .map((party) => party.taxpayerId)
        .filter((taxpayerId): taxpayerId is string => Boolean(taxpayerId)),
    ).size > 1
  );
}
