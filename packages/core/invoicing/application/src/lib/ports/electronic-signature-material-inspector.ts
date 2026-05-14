import { ElectronicSignatureSettings } from '@saas-platform/invoicing-domain';

export type ElectronicSignatureMaterialInspectionStatus =
  | 'not_configured'
  | 'not_applicable'
  | 'likely_usable'
  | 'invalid';

export interface InspectElectronicSignatureMaterialInput {
  signatureSettings: ElectronicSignatureSettings;
}

export interface ElectronicSignatureMaterialInspection {
  status: ElectronicSignatureMaterialInspectionStatus;
  detail: string;
  encoding: 'not_applicable' | 'base64_der' | 'pem_like' | 'unknown';
  passwordPresent: boolean;
  fingerprintPresent: boolean;
  subjectNamePresent: boolean;
  byteLength: number | null;
}

export interface ElectronicSignatureMaterialInspector {
  inspect(
    input: InspectElectronicSignatureMaterialInput,
  ): Promise<ElectronicSignatureMaterialInspection>;
}
