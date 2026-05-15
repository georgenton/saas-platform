import {
  ElectronicSignatureSettings,
  IssuerProfile,
} from '@saas-platform/invoicing-domain';

export type ElectronicInvoiceOfflineSignatureProbeStatus =
  | 'not_applicable'
  | 'unknown'
  | 'verified'
  | 'failed';

export interface ProbeElectronicInvoiceOfflineSignatureInput {
  tenantSlug: string;
  signatureSettings: ElectronicSignatureSettings;
  issuerProfile: IssuerProfile;
}

export interface ElectronicInvoiceOfflineSignatureProbeResult {
  status: ElectronicInvoiceOfflineSignatureProbeStatus;
  detail: string;
  verifiedDocumentCodes: Array<'04' | '05' | '06' | '07'>;
}

export interface ElectronicInvoiceOfflineSignatureProbe {
  inspect(
    input: ProbeElectronicInvoiceOfflineSignatureInput,
  ): Promise<ElectronicInvoiceOfflineSignatureProbeResult>;
}
