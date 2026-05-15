import { ElectronicSignatureSettings } from '@saas-platform/invoicing-domain';

export type ElectronicSignatureMaterialInspectionStatus =
  | 'not_configured'
  | 'not_applicable'
  | 'likely_usable'
  | 'invalid';

export type ElectronicSignatureCertificateValidityStatus =
  | 'not_applicable'
  | 'unknown'
  | 'valid'
  | 'expiring_soon'
  | 'expired'
  | 'not_yet_valid';

export type ElectronicSignatureCryptographicProofStatus =
  | 'not_applicable'
  | 'unknown'
  | 'verified'
  | 'failed';

export interface InspectElectronicSignatureMaterialInput {
  signatureSettings: ElectronicSignatureSettings;
}

export interface ElectronicSignatureMaterialInspection {
  status: ElectronicSignatureMaterialInspectionStatus;
  detail: string;
  encoding: 'not_applicable' | 'base64_der' | 'pem_like' | 'unknown';
  probeMethod: 'not_applicable' | 'shape_only' | 'openssl_pkcs12';
  certificateValidityStatus: ElectronicSignatureCertificateValidityStatus;
  cryptographicProofStatus: ElectronicSignatureCryptographicProofStatus;
  cryptographicProofDetail: string;
  passwordPresent: boolean;
  hasAdvisoryWarning: boolean;
  fingerprintPresent: boolean;
  subjectNamePresent: boolean;
  extractedFingerprint: string | null;
  extractedTaxId: string | null;
  extractedSubjectName: string | null;
  extractedIssuerName: string | null;
  validFrom: string | null;
  validUntil: string | null;
  daysUntilExpiry: number | null;
  byteLength: number | null;
}

export interface ElectronicSignatureMaterialInspector {
  inspect(
    input: InspectElectronicSignatureMaterialInput,
  ): Promise<ElectronicSignatureMaterialInspection>;
}
