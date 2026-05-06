import {
  ElectronicSignatureSettings,
  IssuerProfile,
} from '@saas-platform/invoicing-domain';

export interface SignElectronicInvoiceInput {
  tenantSlug: string;
  invoiceId: string;
  accessKey: string;
  xml: string;
  issuerProfile: IssuerProfile;
  signatureSettings: ElectronicSignatureSettings;
}

export interface SignedElectronicInvoice {
  signedXml: string;
  signedAt: Date;
  signerName: string;
}

export interface ElectronicInvoiceSigner {
  sign(input: SignElectronicInvoiceInput): Promise<SignedElectronicInvoice>;
}
