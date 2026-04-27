import { InvoiceItem } from '@saas-platform/invoicing-domain';

export interface InvoiceItemResponseDto {
  id: string;
  tenantId: string;
  invoiceId: string;
  position: number;
  description: string;
  quantity: number;
  unitPriceInCents: number;
  lineTotalInCents: number;
  createdAt: string;
  updatedAt: string;
}

export const toInvoiceItemResponseDto = (
  item: InvoiceItem,
): InvoiceItemResponseDto => {
  const data = item.toPrimitives();

  return {
    id: data.id,
    tenantId: data.tenantId,
    invoiceId: data.invoiceId,
    position: data.position,
    description: data.description,
    quantity: data.quantity,
    unitPriceInCents: data.unitPriceInCents,
    lineTotalInCents: data.lineTotalInCents,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  };
};
