import { TenantElectronicSignatureMaterialInspectionView } from '@saas-platform/invoicing-application';

export interface ElectronicSignatureMaterialInspectionResponseDto {
  tenantSlug: string;
  signatureProvider: string | null;
  certificateLabel: string | null;
  storageMode: string | null;
  isActive: boolean;
  materialConfigured: boolean;
  inspection: {
    status: 'not_configured' | 'not_applicable' | 'likely_usable' | 'invalid';
    detail: string;
    encoding: 'not_applicable' | 'base64_der' | 'pem_like' | 'unknown';
    probeMethod: 'not_applicable' | 'shape_only' | 'openssl_pkcs12';
    certificateValidityStatus:
      | 'not_applicable'
      | 'unknown'
      | 'valid'
      | 'expiring_soon'
      | 'expired'
      | 'not_yet_valid';
    cryptographicProofStatus:
      | 'not_applicable'
      | 'unknown'
      | 'verified'
      | 'failed';
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
  };
}

export function toElectronicSignatureMaterialInspectionResponseDto(
  view: TenantElectronicSignatureMaterialInspectionView,
): ElectronicSignatureMaterialInspectionResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    signatureProvider: view.signatureProvider,
    certificateLabel: view.certificateLabel,
    storageMode: view.storageMode,
    isActive: view.isActive,
    materialConfigured: view.materialConfigured,
    inspection: {
      status: view.inspection.status,
      detail: view.inspection.detail,
      encoding: view.inspection.encoding,
      probeMethod: view.inspection.probeMethod,
      certificateValidityStatus: view.inspection.certificateValidityStatus,
      cryptographicProofStatus: view.inspection.cryptographicProofStatus,
      cryptographicProofDetail: view.inspection.cryptographicProofDetail,
      passwordPresent: view.inspection.passwordPresent,
      hasAdvisoryWarning: view.inspection.hasAdvisoryWarning,
      fingerprintPresent: view.inspection.fingerprintPresent,
      subjectNamePresent: view.inspection.subjectNamePresent,
      extractedFingerprint: view.inspection.extractedFingerprint,
      extractedTaxId: view.inspection.extractedTaxId,
      extractedSubjectName: view.inspection.extractedSubjectName,
      extractedIssuerName: view.inspection.extractedIssuerName,
      validFrom: view.inspection.validFrom,
      validUntil: view.inspection.validUntil,
      daysUntilExpiry: view.inspection.daysUntilExpiry,
      byteLength: view.inspection.byteLength,
    },
  };
}
