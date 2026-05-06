export class InvoiceElectronicSecretResolutionError extends Error {
  constructor(secretRef: string) {
    super(
      `No se pudo resolver el secreto requerido para el comprobante electronico: ${secretRef}.`,
    );
    this.name = 'InvoiceElectronicSecretResolutionError';
  }
}
