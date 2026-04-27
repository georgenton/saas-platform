import { Customer } from '@saas-platform/invoicing-domain';

export interface CustomerResponseDto {
  id: string;
  tenantId: string;
  name: string;
  email: string | null;
  taxId: string | null;
  createdAt: string;
  updatedAt: string;
}

export const toCustomerResponseDto = (
  customer: Customer,
): CustomerResponseDto => {
  const data = customer.toPrimitives();

  return {
    id: data.id,
    tenantId: data.tenantId,
    name: data.name,
    email: data.email ?? null,
    taxId: data.taxId ?? null,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  };
};
