import { PartyDuplicateMergeReadinessWorkspace } from '@saas-platform/parties-domain';
import { ListTenantPartiesUseCase } from './list-tenant-parties.use-case';
import {
  buildDuplicateGroups,
  buildReadinessStatus,
  toPartyDirectoryV2Snapshot,
} from './party-directory-v2.helpers';

export class GetTenantPartyDuplicateMergeReadinessWorkspaceUseCase {
  constructor(
    private readonly listTenantPartiesUseCase: ListTenantPartiesUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
  ): Promise<PartyDuplicateMergeReadinessWorkspace> {
    const snapshots = (
      await this.listTenantPartiesUseCase.execute(tenantSlug)
    ).map((party) => toPartyDirectoryV2Snapshot(party));
    const duplicateGroups = buildDuplicateGroups(snapshots);
    const affectedPartyIds = new Set(
      duplicateGroups.flatMap((group) => group.partyIds),
    );
    const blockingGroupCount = duplicateGroups.filter(
      (group) => group.mergeRisk === 'high',
    ).length;

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      readinessStatus: buildReadinessStatus({
        blockedCount: blockingGroupCount,
        needsReviewCount: duplicateGroups.length,
      }),
      summary: {
        duplicateGroupCount: duplicateGroups.length,
        affectedPartyCount: affectedPartyIds.size,
        blockingGroupCount,
      },
      duplicateGroups,
      nextStep:
        duplicateGroups.length > 0
          ? 'Revisar grupos duplicados y preparar una fusion auditada antes de automatizar alias.'
          : 'No hay duplicados detectados por RUC/cedula, email o nombre normalizado.',
      guardrails: [
        'Este workspace no ejecuta merge; solo prepara evidencia y checklist.',
        'Un merge real debe conservar referencias historicas de facturas, ordenes, evidencias SRI y asientos contables.',
      ],
    };
  }
}
