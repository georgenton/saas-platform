import { TaxRate } from '@saas-platform/invoicing-domain';

export interface TaxRateResponseDto {
  id: string;
  tenantId: string;
  name: string;
  percentage: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const toTaxRateResponseDto = (
  taxRate: TaxRate,
): TaxRateResponseDto => {
  const data = taxRate.toPrimitives();

  return {
    id: data.id,
    tenantId: data.tenantId,
    name: data.name,
    percentage: data.percentage,
    isActive: data.isActive,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  };
};
