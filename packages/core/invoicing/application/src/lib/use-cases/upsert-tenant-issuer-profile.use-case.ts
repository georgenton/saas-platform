import {
  IssuerEmissionType,
  IssuerEnvironment,
  IssuerProfile,
} from '@saas-platform/invoicing-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { IssuerProfileRepository } from '../ports/issuer-profile.repository';

export interface UpsertTenantIssuerProfileInput {
  tenantSlug: string;
  legalName: string;
  commercialName?: string | null;
  taxId: string;
  environment: IssuerEnvironment;
  emissionType?: IssuerEmissionType;
  accountingObligated: boolean;
  specialTaxpayerCode?: string | null;
  rimpeTaxpayerType?: string | null;
  matrixAddress: string;
  establishmentAddress: string;
}

export class UpsertTenantIssuerProfileUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly issuerProfileRepository: IssuerProfileRepository,
  ) {}

  async execute(input: UpsertTenantIssuerProfileInput): Promise<IssuerProfile> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const now = new Date();
    const existingProfile = await this.issuerProfileRepository.findByTenantId(
      tenant.id,
    );

    const profile = IssuerProfile.create({
      id: existingProfile?.id ?? `${tenant.id}:issuer-profile`,
      tenantId: tenant.id,
      legalName: input.legalName.trim(),
      commercialName: this.normalizeOptionalValue(input.commercialName),
      taxId: input.taxId.trim(),
      environment: input.environment,
      emissionType: input.emissionType ?? 'normal',
      accountingObligated: input.accountingObligated,
      specialTaxpayerCode: this.normalizeOptionalValue(
        input.specialTaxpayerCode,
      ),
      rimpeTaxpayerType: this.normalizeOptionalValue(input.rimpeTaxpayerType),
      matrixAddress: input.matrixAddress.trim(),
      establishmentAddress: input.establishmentAddress.trim(),
      createdAt: existingProfile?.createdAt ?? now,
      updatedAt: now,
    });

    await this.issuerProfileRepository.save(profile);

    return profile;
  }

  private normalizeOptionalValue(value?: string | null): string | null {
    const normalizedValue = value?.trim();

    return normalizedValue ? normalizedValue : null;
  }
}
