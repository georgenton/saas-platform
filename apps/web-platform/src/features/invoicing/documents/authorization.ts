import type {
  InvoiceDocumentResponse,
  InvoiceRideResponse,
} from '../../../app/types';

export function canPrintRideAsAuthorized({
  document,
  ride,
}: {
  document: InvoiceDocumentResponse;
  ride: InvoiceRideResponse | null;
}): boolean {
  return Boolean(
    ride?.ride.canBePrintedAsAuthorized &&
      document.invoice.electronicStatus === 'authorized',
  );
}
