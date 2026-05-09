import { Invoice } from '@saas-platform/invoicing-domain';
import {
  InvoiceDetailResponseDto,
  toInvoiceDetailResponseDto,
} from './invoice-detail.response';

export interface WithholdingResponseDto {
  invoice: InvoiceDetailResponseDto;
  withholding: {
    sourceInvoiceId: string | null;
    sourceInvoiceNumber: string | null;
    sourceInvoiceIssuedAt: string | null;
    reason: string | null;
    amountInCents: number;
  };
}

export const toWithholdingResponseDto = (
  detail: Parameters<typeof toInvoiceDetailResponseDto>[0],
  sourceInvoice: Invoice,
): WithholdingResponseDto => {
  const withholding = detail.invoice.toPrimitives();

  return {
    invoice: toInvoiceDetailResponseDto(detail),
    withholding: {
      sourceInvoiceId: withholding.modifiedDocumentId ?? sourceInvoice.id,
      sourceInvoiceNumber:
        withholding.modifiedDocumentNumber ?? sourceInvoice.number,
      sourceInvoiceIssuedAt:
        withholding.modifiedDocumentIssuedAt?.toISOString() ??
        sourceInvoice.issuedAt.toISOString(),
      reason: withholding.modificationReason ?? null,
      amountInCents: detail.totals.subtotalInCents,
    },
  };
};
