import { PartyFiscalCorrectionResult } from '@saas-platform/parties-domain';
import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { PartyNotFoundError } from '../errors/party-not-found.error';
import { PartyDirectoryRepository } from '../ports/party-directory.repository';

export class ApplyTenantPartyFiscalCorrectionUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly partyDirectoryRepository: PartyDirectoryRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    partyId: string;
    taxpayerId?: string | null;
    identificationType?: string | null;
    fiscalAddress?: string | null;
    email?: string | null;
    taxpayerName?: string | null;
  }): Promise<PartyFiscalCorrectionResult> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const appliedAt = this.nowProvider();
    const correctedParty =
      await this.partyDirectoryRepository.applyFiscalCorrection?.(
        tenant.id,
        input.partyId,
        {
          taxpayerId: normalize(input.taxpayerId),
          identificationType: normalize(input.identificationType),
          fiscalAddress: normalize(input.fiscalAddress),
          email: normalize(input.email),
          taxpayerName: normalize(input.taxpayerName),
          appliedAt,
        },
      );

    if (!correctedParty) {
      throw new PartyNotFoundError(input.tenantSlug, input.partyId);
    }

    const fiscalProfile = correctedParty.fiscalProfile;
    const remainingMissingFields = fiscalProfile?.missingFields ?? [];
    const reviewNotes = fiscalProfile?.reviewNotes ?? [];
    const status =
      remainingMissingFields.length === 0 && reviewNotes.length === 0
        ? 'applied'
        : 'needs_review';

    return {
      tenantSlug: input.tenantSlug,
      partyId: input.partyId,
      appliedAt,
      status,
      correctedParty: {
        id: correctedParty.id,
        displayName: correctedParty.displayName,
        roles: correctedParty.roles,
        taxpayerId: fiscalProfile?.taxpayerId ?? correctedParty.taxId,
        identificationType:
          fiscalProfile?.identificationType ?? correctedParty.identificationType,
        fiscalAddress: fiscalProfile?.fiscalAddress ?? correctedParty.billingAddress,
        email: fiscalProfile?.email ?? correctedParty.email,
        completenessStatus: fiscalProfile?.completenessStatus ?? 'needs_review',
        missingFields: remainingMissingFields,
        reviewNotes,
      },
      remainingMissingFields,
      reviewNotes,
      nextStep:
        status === 'applied'
          ? 'Tercero fiscal corregido y listo para evidencias tributarias.'
          : 'Revisar campos restantes antes de usar el tercero en cierre tributario.',
      guardrails: [
        'La correccion actualiza el backing store disponible; no valida RUC/cedula contra fuente oficial.',
        'No fusiona duplicados ni resuelve identidades compartidas automaticamente.',
      ],
    };
  }
}

function normalize(value?: string | null): string | null {
  const normalized = value?.trim();

  return normalized ? normalized : null;
}
