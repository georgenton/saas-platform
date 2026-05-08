import { Invoice } from '@saas-platform/invoicing-domain';
import {
  InvoiceDetailResponseDto,
  toInvoiceDetailResponseDto,
} from './invoice-detail.response';

export interface DebitNoteResponseDto {
  invoice: InvoiceDetailResponseDto;
  debitNote: {
    sourceInvoiceId: string | null;
    sourceInvoiceNumber: string | null;
    sourceInvoiceIssuedAt: string | null;
    reason: string | null;
    amountInCents: number;
  };
}

export const toDebitNoteResponseDto = (
  detail: Parameters<typeof toInvoiceDetailResponseDto>[0],
  sourceInvoice: Invoice,
): DebitNoteResponseDto => {
  const debitNote = detail.invoice.toPrimitives();

  return {
    invoice: toInvoiceDetailResponseDto(detail),
    debitNote: {
      sourceInvoiceId: debitNote.modifiedDocumentId ?? sourceInvoice.id,
      sourceInvoiceNumber: debitNote.modifiedDocumentNumber ?? sourceInvoice.number,
      sourceInvoiceIssuedAt:
        debitNote.modifiedDocumentIssuedAt?.toISOString() ??
        sourceInvoice.issuedAt.toISOString(),
      reason: debitNote.modificationReason ?? null,
      amountInCents: detail.totals.subtotalInCents,
    },
  };
};
