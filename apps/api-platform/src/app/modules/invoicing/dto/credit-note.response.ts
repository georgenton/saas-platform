import { Invoice } from '@saas-platform/invoicing-domain';
import {
  InvoiceDetailResponseDto,
  toInvoiceDetailResponseDto,
} from './invoice-detail.response';

export interface CreditNoteResponseDto {
  invoice: InvoiceDetailResponseDto;
  creditNote: {
    sourceInvoiceId: string | null;
    sourceInvoiceNumber: string | null;
    sourceInvoiceIssuedAt: string | null;
    reason: string | null;
  };
}

export const toCreditNoteResponseDto = (
  detail: Parameters<typeof toInvoiceDetailResponseDto>[0],
  sourceInvoice: Invoice,
): CreditNoteResponseDto => {
  const creditNote = detail.invoice.toPrimitives();

  return {
    invoice: toInvoiceDetailResponseDto(detail),
    creditNote: {
      sourceInvoiceId: creditNote.modifiedDocumentId ?? sourceInvoice.id,
      sourceInvoiceNumber: creditNote.modifiedDocumentNumber ?? sourceInvoice.number,
      sourceInvoiceIssuedAt:
        creditNote.modifiedDocumentIssuedAt?.toISOString() ??
        sourceInvoice.issuedAt.toISOString(),
      reason: creditNote.modificationReason ?? null,
    },
  };
};
