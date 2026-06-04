import {
  IssuerProfileRepository,
} from '@saas-platform/invoicing-application';
import { IssuerProfile } from '@saas-platform/invoicing-domain';
import { PartyDirectoryRepository } from '@saas-platform/parties-application';
import {
  EcuadorTaxpayerProfileView,
  EcuadorTaxpayerRegime,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';

export class GetTenantEcuadorTaxpayerProfileUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly issuerProfileRepository: IssuerProfileRepository,
    private readonly partyDirectoryRepository: PartyDirectoryRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(tenantSlug: string): Promise<EcuadorTaxpayerProfileView> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const issuerProfile = await this.issuerProfileRepository.findByTenantId(
      tenant.id,
    );
    const parties = await this.partyDirectoryRepository.findByTenantId(
      tenant.id,
    );

    const missingFields = [
      issuerProfile?.legalName ? null : 'legal_name',
      issuerProfile?.taxId ? null : 'taxpayer_id',
      issuerProfile?.matrixAddress ? null : 'matrix_address',
      issuerProfile?.establishmentAddress ? null : 'establishment_address',
    ].filter((field): field is string => field !== null);

    const reviewNotes = buildReviewNotes(issuerProfile);

    return {
      tenantSlug,
      tenantId: tenant.id,
      generatedAt: this.nowProvider(),
      country: 'EC',
      legalName: issuerProfile?.legalName ?? tenant.name,
      commercialName: issuerProfile?.commercialName ?? null,
      taxpayerId: issuerProfile?.taxId ?? null,
      regime: inferRegime(issuerProfile?.rimpeTaxpayerType ?? null),
      accountingObligated: issuerProfile?.accountingObligated ?? null,
      specialTaxpayerCode: issuerProfile?.specialTaxpayerCode ?? null,
      matrixAddress: issuerProfile?.matrixAddress ?? null,
      establishmentAddress: issuerProfile?.establishmentAddress ?? null,
      source: 'invoicing_issuer_profile',
      readinessStatus: getReadinessStatus(missingFields, reviewNotes),
      missingFields,
      reviewNotes,
      thirdPartyFiscalSummary: parties.reduce(
        (summary, party) => {
          const fiscalProfile = party.fiscalProfile;

          if (!fiscalProfile) {
            summary.needsReviewParties += 1;
            summary.missingFieldCounts.fiscal_profile =
              (summary.missingFieldCounts.fiscal_profile ?? 0) + 1;
            return summary;
          }

          if (fiscalProfile.completenessStatus === 'complete') {
            summary.completeParties += 1;
          } else {
            summary.needsReviewParties += 1;
          }

          for (const field of fiscalProfile.missingFields) {
            summary.missingFieldCounts[field] =
              (summary.missingFieldCounts[field] ?? 0) + 1;
          }

          return summary;
        },
        {
          totalParties: parties.length,
          completeParties: 0,
          needsReviewParties: 0,
          missingFieldCounts: {} as Record<string, number>,
        },
      ),
    };
  }
}

function inferRegime(rimpeTaxpayerType: string | null): EcuadorTaxpayerRegime {
  if (!rimpeTaxpayerType) {
    return 'general';
  }

  const normalized = rimpeTaxpayerType.toLowerCase();

  if (normalized.includes('popular')) {
    return 'rimpe_popular_business';
  }

  if (normalized.includes('emprendedor') || normalized.includes('entrepreneur')) {
    return 'rimpe_entrepreneur';
  }

  return 'unknown';
}

function buildReviewNotes(issuerProfile: IssuerProfile | null): string[] {
  if (!issuerProfile) {
    return ['issuer_profile_missing'];
  }

  return [
    issuerProfile.taxId && issuerProfile.taxId.length !== 13
      ? 'ruc_should_have_13_digits'
      : null,
    issuerProfile.rimpeTaxpayerType
      ? 'rimpe_regime_requires_specific_periodicity_review'
      : null,
    issuerProfile.accountingObligated
      ? 'accounting_obligated_taxpayer_should_have_accountant_review'
      : null,
    issuerProfile.specialTaxpayerCode
      ? 'special_taxpayer_deadlines_may_override_standard_calendar'
      : null,
  ].filter((note): note is string => note !== null);
}

function getReadinessStatus(
  missingFields: string[],
  reviewNotes: string[],
): EcuadorTaxReadinessStatus {
  if (missingFields.length > 0) {
    return 'blocked';
  }

  if (reviewNotes.length > 0) {
    return 'needs_review';
  }

  return 'ready';
}
