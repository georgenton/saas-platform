export class InvoiceElectronicXmlValidationError extends Error {
  constructor(issues: string[]) {
    super(
      `El XML del comprobante electronico no paso la validacion previa: ${issues.join(
        ' | ',
      )}`,
    );
    this.name = 'InvoiceElectronicXmlValidationError';
  }
}
