import { Payment } from '@saas-platform/invoicing-domain';

export interface PaymentResponseDto {
  id: string;
  tenantId: string;
  invoiceId: string;
  amountInCents: number;
  currency: string;
  method: string;
  reference: string | null;
  paidAt: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export const toPaymentResponseDto = (
  payment: Payment,
): PaymentResponseDto => {
  const data = payment.toPrimitives();

  return {
    id: data.id,
    tenantId: data.tenantId,
    invoiceId: data.invoiceId,
    amountInCents: data.amountInCents,
    currency: data.currency,
    method: data.method,
    reference: data.reference,
    paidAt: data.paidAt.toISOString(),
    notes: data.notes,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  };
};
