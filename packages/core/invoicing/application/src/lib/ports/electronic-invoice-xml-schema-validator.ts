export interface ValidateElectronicInvoiceXmlSchemaInput {
  xml: string;
}

export interface ElectronicInvoiceXmlSchemaValidator {
  validate(
    input: ValidateElectronicInvoiceXmlSchemaInput,
  ): Promise<string[]>;
}
