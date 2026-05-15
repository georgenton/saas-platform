export class InvoiceElectronicSigningOperationError extends Error {
  constructor(detail: string) {
    super(
      `No se pudo completar la operacion de firma electronica interna: ${detail}`,
    );
    this.name = 'InvoiceElectronicSigningOperationError';
  }
}
