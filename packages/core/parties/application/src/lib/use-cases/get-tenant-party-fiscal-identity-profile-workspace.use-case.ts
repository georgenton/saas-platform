import { PartyFiscalIdentityProfileWorkspace } from '@saas-platform/parties-domain';
import { GetTenantPartyFiscalReadinessSummaryUseCase } from './get-tenant-party-fiscal-readiness-summary.use-case';
import { ListTenantPartiesUseCase } from './list-tenant-parties.use-case';
import {
  buildReadinessStatus,
  toPartyDirectoryV2Snapshot,
} from './party-directory-v2.helpers';

export class GetTenantPartyFiscalIdentityProfileWorkspaceUseCase {
  constructor(
    private readonly listTenantPartiesUseCase: ListTenantPartiesUseCase,
    private readonly getTenantPartyFiscalReadinessSummaryUseCase: GetTenantPartyFiscalReadinessSummaryUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
  ): Promise<PartyFiscalIdentityProfileWorkspace> {
    const [parties, fiscalSummary] = await Promise.all([
      this.listTenantPartiesUseCase.execute(tenantSlug),
      this.getTenantPartyFiscalReadinessSummaryUseCase.execute(tenantSlug),
    ]);
    const snapshots = parties.map((party) => toPartyDirectoryV2Snapshot(party));
    const profiles = snapshots.map((party) => ({
      partyId: party.id,
      displayName: party.displayName,
      taxpayerId: party.taxpayerId,
      taxpayerName: party.displayName,
      identificationType: party.identificationType,
      fiscalAddress: party.fiscalAddress,
      email: party.email,
      status: party.completenessStatus,
      missingFields: [...party.missingFields],
      reviewNotes: [...party.reviewNotes],
    }));
    const countMissing = (field: string): number =>
      profiles.filter((profile) => profile.missingFields.includes(field))
        .length;
    const readinessStatus = buildReadinessStatus({
      blockedCount:
        countMissing('taxpayer_id') + countMissing('identification_type'),
      needsReviewCount: fiscalSummary.needsReviewParties,
    });

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      readinessStatus,
      summary: {
        totalParties: profiles.length,
        completeProfiles: fiscalSummary.completeParties,
        needsReviewProfiles: fiscalSummary.needsReviewParties,
        missingTaxpayerIdCount: countMissing('taxpayer_id'),
        missingIdentificationTypeCount: countMissing('identification_type'),
        missingFiscalAddressCount: countMissing('fiscal_address'),
        missingEmailCount: countMissing('email'),
      },
      profiles: profiles.sort((left, right) =>
        left.displayName.localeCompare(right.displayName),
      ),
      issueSummaries: fiscalSummary.issueSummaries,
      nextStep:
        readinessStatus === 'blocked'
          ? 'Corregir RUC/cedula y tipo de identificacion antes de preparar anexos, IVA o renta.'
          : readinessStatus === 'needs_review'
            ? 'Completar direccion fiscal y email para reducir friccion operativa.'
            : 'Identidad fiscal lista para reutilizar en formularios y evidencias tributarias.',
      guardrails: [
        'La identidad fiscal preparada aqui no sustituye validacion oficial del SRI.',
        'Las correcciones deben conservar trazabilidad del operador y fuente de evidencia.',
      ],
    };
  }
}
