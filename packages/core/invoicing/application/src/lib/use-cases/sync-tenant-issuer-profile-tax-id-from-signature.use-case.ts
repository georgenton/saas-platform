import { IssuerProfile } from '@saas-platform/invoicing-domain';
import { ElectronicSignatureExtractedTaxIdUnavailableError } from '../errors/electronic-signature-extracted-tax-id-unavailable.error';
import { GetTenantIssuerProfileUseCase } from './get-tenant-issuer-profile.use-case';
import { InspectTenantElectronicSignatureMaterialUseCase } from './inspect-tenant-electronic-signature-material.use-case';
import { UpsertTenantIssuerProfileUseCase } from './upsert-tenant-issuer-profile.use-case';

export class SyncTenantIssuerProfileTaxIdFromSignatureUseCase {
  constructor(
    private readonly getTenantIssuerProfileUseCase: GetTenantIssuerProfileUseCase,
    private readonly inspectTenantElectronicSignatureMaterialUseCase: InspectTenantElectronicSignatureMaterialUseCase,
    private readonly upsertTenantIssuerProfileUseCase: UpsertTenantIssuerProfileUseCase,
  ) {}

  async execute(tenantSlug: string): Promise<IssuerProfile> {
    const [profile, inspectionView] = await Promise.all([
      this.getTenantIssuerProfileUseCase.execute(tenantSlug),
      this.inspectTenantElectronicSignatureMaterialUseCase.execute(tenantSlug),
    ]);

    const extractedTaxId = inspectionView.inspection.extractedTaxId?.trim();

    if (!extractedTaxId) {
      throw new ElectronicSignatureExtractedTaxIdUnavailableError(
        tenantSlug,
        inspectionView.inspection.detail,
      );
    }

    if (profile.taxId.trim() === extractedTaxId) {
      return profile;
    }

    return this.upsertTenantIssuerProfileUseCase.execute({
      tenantSlug,
      legalName: profile.legalName,
      commercialName: profile.commercialName,
      taxId: extractedTaxId,
      environment: profile.environment,
      emissionType: profile.emissionType,
      accountingObligated: profile.accountingObligated,
      specialTaxpayerCode: profile.specialTaxpayerCode,
      rimpeTaxpayerType: profile.rimpeTaxpayerType,
      matrixAddress: profile.matrixAddress,
      establishmentAddress: profile.establishmentAddress,
    });
  }
}
