import { IssuerProfile } from '@saas-platform/invoicing-domain';

export interface IssuerProfileResponseDto {
  id: string;
  tenantId: string;
  legalName: string;
  commercialName: string | null;
  taxId: string;
  environment: string;
  emissionType: string;
  accountingObligated: boolean;
  specialTaxpayerCode: string | null;
  rimpeTaxpayerType: string | null;
  matrixAddress: string;
  establishmentAddress: string;
  createdAt: string;
  updatedAt: string;
}

export const toIssuerProfileResponseDto = (
  profile: IssuerProfile,
): IssuerProfileResponseDto => {
  const data = profile.toPrimitives();

  return {
    id: data.id,
    tenantId: data.tenantId,
    legalName: data.legalName,
    commercialName: data.commercialName,
    taxId: data.taxId,
    environment: data.environment,
    emissionType: data.emissionType,
    accountingObligated: data.accountingObligated,
    specialTaxpayerCode: data.specialTaxpayerCode,
    rimpeTaxpayerType: data.rimpeTaxpayerType,
    matrixAddress: data.matrixAddress,
    establishmentAddress: data.establishmentAddress,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  };
};
