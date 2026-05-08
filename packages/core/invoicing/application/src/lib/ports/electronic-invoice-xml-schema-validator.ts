export interface ValidateElectronicInvoiceXmlSchemaInput {
  documentCode: string;
  xml: string;
}

export interface ElectronicInvoiceXmlSchemaSupportDescriptor {
  documentCode: string;
  schemaLabel: string;
  isSchemaAvailable: boolean;
  detail: string;
}

export interface ElectronicInvoiceXmlSchemaValidator {
  validate(
    input: ValidateElectronicInvoiceXmlSchemaInput,
  ): Promise<string[]>;
  describeSupport(
    documentCode: string,
  ): Promise<ElectronicInvoiceXmlSchemaSupportDescriptor>;
}
