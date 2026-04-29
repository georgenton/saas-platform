import { Payment } from '@saas-platform/invoicing-domain';

export interface PaymentResponseDto {
  id: string;
  tenantId: string;
  invoiceId: string;
  amountInCents: number;
  currency: string;
  status: string;
  method: string;
  reference: string | null;
  paidAt: string;
  notes: string | null;
  reversedAt: string | null;
  reversalReason: string | null;
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
    status: data.status,
    method: data.method,
    reference: data.reference,
    paidAt: data.paidAt.toISOString(),
    notes: data.notes,
    reversedAt: data.reversedAt?.toISOString() ?? null,
    reversalReason: data.reversalReason,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  };
};
