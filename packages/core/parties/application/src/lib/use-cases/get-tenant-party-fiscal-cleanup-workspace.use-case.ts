import { PartyFiscalCleanupWorkspace } from '@saas-platform/parties-domain';
import { GetTenantPartyFiscalReadinessSummaryUseCase } from './get-tenant-party-fiscal-readiness-summary.use-case';
import { ListTenantPartiesUseCase } from './list-tenant-parties.use-case';

export class GetTenantPartyFiscalCleanupWorkspaceUseCase {
  constructor(
    private readonly getTenantPartyFiscalReadinessSummaryUseCase: GetTenantPartyFiscalReadinessSummaryUseCase,
    private readonly listTenantPartiesUseCase: ListTenantPartiesUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(tenantSlug: string): Promise<PartyFiscalCleanupWorkspace> {
    const [summary, parties] = await Promise.all([
      this.getTenantPartyFiscalReadinessSummaryUseCase.execute(tenantSlug),
      this.listTenantPartiesUseCase.execute(tenantSlug),
    ]);
    const duplicateGroups = buildDuplicateGroups(
      parties.map((party) => ({
        id: party.id,
        displayName: party.displayName,
        taxpayerId: party.fiscalProfile?.taxpayerId ?? null,
        email: party.fiscalProfile?.email ?? null,
      })),
    );
    const priorityParties: PartyFiscalCleanupWorkspace['priorityParties'] =
      summary.incompleteParties.map((party) => {
      const hasIdentityIssue = party.missingFields.some((field) =>
        ['taxpayer_id', 'identification_type', 'fiscal_profile'].includes(field),
      );
      const priority =
        hasIdentityIssue || party.roles.includes('supplier')
          ? 'critical'
          : party.roles.includes('customer')
            ? 'high'
            : 'normal';

      return {
        id: party.id,
        displayName: party.displayName,
        roles: [...party.roles],
        taxpayerId: party.taxpayerId,
        priority,
        missingFields: [...party.missingFields],
        reviewNotes: [...party.reviewNotes],
        suggestedAction: buildSuggestedAction(party.missingFields),
      };
    });
    const criticalIssueCount = priorityParties.filter(
      (party) => party.priority === 'critical',
    ).length;
    const readinessStatus =
      criticalIssueCount > 0 || duplicateGroups.length > 0
        ? 'blocked'
        : summary.needsReviewParties > 0
          ? 'needs_review'
          : 'ready';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      readinessStatus,
      summary: {
        totalParties: summary.totalParties,
        completeParties: summary.completeParties,
        needsReviewParties: summary.needsReviewParties,
        duplicateGroupCount: duplicateGroups.length,
        criticalIssueCount,
      },
      priorityParties,
      duplicateGroups,
      issueSummaries: summary.issueSummaries,
      nextStep:
        readinessStatus === 'blocked'
          ? 'Resolver identidad fiscal y duplicados antes de cerrar impuestos, anexos o retenciones.'
          : readinessStatus === 'needs_review'
            ? 'Completar campos fiscales pendientes antes de usar terceros en nuevos periodos.'
            : 'Directorio fiscal listo para Invoicing, Ecommerce y Tax Compliance.',
      guardrails: [
        'Workspace de limpieza: no fusiona terceros ni cambia datos automaticamente.',
        'La validacion oficial de RUC/cedula debe integrarse en un slice posterior.',
      ],
    };
  }
}

function buildDuplicateGroups(
  parties: Array<{
    id: string;
    displayName: string;
    taxpayerId: string | null;
    email: string | null;
  }>,
): PartyFiscalCleanupWorkspace['duplicateGroups'] {
  const groups = new Map<
    string,
    { reason: 'taxpayer_id' | 'email' | 'display_name'; parties: typeof parties }
  >();

  for (const party of parties) {
    for (const [reason, rawValue] of [
      ['taxpayer_id', party.taxpayerId],
      ['email', party.email],
      ['display_name', party.displayName],
    ] as const) {
      const normalized = rawValue?.trim().toLowerCase();

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
    .map(([key, group]) => ({
      key,
      reason: group.reason,
      partyIds: group.parties.map((party) => party.id),
      displayNames: group.parties.map((party) => party.displayName),
      suggestedAction: 'Revisar posible duplicado antes de preparar anexos o retenciones.',
    }));
}

function buildSuggestedAction(missingFields: string[]): string {
  if (missingFields.includes('fiscal_profile')) {
    return 'Crear perfil fiscal con identificacion, direccion y email.';
  }

  if (missingFields.includes('taxpayer_id')) {
    return 'Completar RUC/cedula y tipo de identificacion.';
  }

  if (missingFields.includes('fiscal_address')) {
    return 'Completar direccion fiscal.';
  }

  return 'Revisar datos fiscales pendientes.';
}
