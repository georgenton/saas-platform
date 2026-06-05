import { PartyFiscalCleanupPacket } from '@saas-platform/parties-domain';
import { PartyNotFoundError } from '../errors/party-not-found.error';
import { GetTenantPartyFiscalCleanupWorkspaceUseCase } from './get-tenant-party-fiscal-cleanup-workspace.use-case';

export class GetTenantPartyFiscalCleanupPacketUseCase {
  constructor(
    private readonly getTenantPartyFiscalCleanupWorkspaceUseCase: GetTenantPartyFiscalCleanupWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    partyId: string;
  }): Promise<PartyFiscalCleanupPacket> {
    const workspace =
      await this.getTenantPartyFiscalCleanupWorkspaceUseCase.execute(
        input.tenantSlug,
      );
    const party = workspace.priorityParties.find(
      (candidate) => candidate.id === input.partyId,
    );

    if (!party) {
      throw new PartyNotFoundError(input.tenantSlug, input.partyId);
    }

    const duplicateWarnings = workspace.duplicateGroups
      .filter((group) => group.partyIds.includes(input.partyId))
      .map((group) => ({
        key: group.key,
        reason: group.reason,
        partyIds: [...group.partyIds],
        displayNames: [...group.displayNames],
      }));
    const readinessStatus =
      party.priority === 'critical' || duplicateWarnings.length > 0
        ? 'blocked'
        : party.missingFields.length > 0
          ? 'needs_review'
          : 'ready';

    return {
      tenantSlug: input.tenantSlug,
      partyId: input.partyId,
      generatedAt: this.nowProvider(),
      readinessStatus,
      partySnapshot: {
        id: party.id,
        displayName: party.displayName,
        roles: [...party.roles],
        taxpayerId: party.taxpayerId,
        priority: party.priority,
        missingFields: [...party.missingFields],
        reviewNotes: [...party.reviewNotes],
      },
      suggestedPayload: {
        taxpayerId: party.taxpayerId,
        identificationType: null,
        fiscalAddress: null,
        email: null,
        taxpayerName: party.displayName,
      },
      duplicateWarnings,
      checklist: buildChecklist(party.missingFields, duplicateWarnings.length),
      nextStep:
        readinessStatus === 'blocked'
          ? 'Resolver identidad fiscal critica o duplicados antes de usar este tercero en obligaciones tributarias.'
          : readinessStatus === 'needs_review'
            ? 'Completar payload sugerido y validar datos con el responsable fiscal.'
            : 'Tercero listo para ser usado como evidencia fiscal compartida.',
      guardrails: [
        'Packet de correccion: no edita ni fusiona terceros automaticamente.',
        'Validar RUC/cedula y razon social contra fuente oficial antes de persistir cambios.',
      ],
    };
  }
}

function buildChecklist(missingFields: string[], duplicateCount: number): string[] {
  const steps = missingFields.map((field) => `Completar ${field}.`);

  if (duplicateCount > 0) {
    steps.unshift('Revisar duplicados antes de actualizar datos fiscales.');
  }

  return steps.length > 0 ? steps : ['Confirmar datos fiscales completos.'];
}
