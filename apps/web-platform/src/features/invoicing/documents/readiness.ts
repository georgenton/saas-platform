import type { InvoiceDocumentResponse } from '../../../app/types';

export type DocumentReadinessCheck = {
  detail: string;
  key: 'issuer' | 'buyer' | 'numbering' | 'lines';
  label: string;
  ok: boolean;
};

export function deriveDocumentReadiness(
  document: InvoiceDocumentResponse,
): DocumentReadinessCheck[] {
  return [
    {
      detail: document.issuer.taxId
        ? 'RUC y ambiente configurados.'
        : 'Falta RUC o ambiente del emisor.',
      key: 'issuer',
      label: 'Emisor',
      ok: Boolean(
        document.issuer.legalName &&
          document.issuer.taxId &&
          document.issuer.environment,
      ),
    },
    {
      detail:
        (document.customer.identification ?? document.customer.taxId)
          ? 'Comprador identificado.'
          : 'Falta la identificación fiscal del comprador.',
      key: 'buyer',
      label: 'Comprador',
      ok: Boolean(
        document.customer.name &&
          (document.customer.identification ?? document.customer.taxId),
      ),
    },
    {
      detail: 'Serie, punto de emisión y secuencial asignados.',
      key: 'numbering',
      label: 'Numeración',
      ok: Boolean(
        document.invoice.documentCode &&
          document.invoice.establishmentCode &&
          document.invoice.emissionPointCode &&
          document.invoice.sequenceNumber !== null,
      ),
    },
    {
      detail:
        document.lines.length > 0
          ? `${document.lines.length} línea${document.lines.length === 1 ? '' : 's'} lista${document.lines.length === 1 ? '' : 's'}.`
          : 'La factura no tiene líneas.',
      key: 'lines',
      label: 'Líneas y totales',
      ok: document.lines.length > 0,
    },
  ];
}
