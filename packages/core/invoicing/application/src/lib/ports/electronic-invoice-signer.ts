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

export interface DescribeElectronicInvoiceSignerCapabilityInput {
  signatureSettings: ElectronicSignatureSettings;
}

export type ElectronicInvoiceSignatureMode =
  | 'stub_local'
  | 'xades_pkcs12_stub'
  | 'xades_pkcs12_real';

export interface ElectronicInvoiceSignerCapability {
  signatureMode: ElectronicInvoiceSignatureMode;
  supportsSriOfflineSubmission: boolean;
  detail: string;
}

export interface SignedElectronicInvoice {
  signedXml: string;
  signedAt: Date;
  signerName: string;
  capability: ElectronicInvoiceSignerCapability;
}

export interface ElectronicInvoiceSigner {
  describeCapability(
    input: DescribeElectronicInvoiceSignerCapabilityInput,
  ): ElectronicInvoiceSignerCapability;
  sign(input: SignElectronicInvoiceInput): Promise<SignedElectronicInvoice>;
}
