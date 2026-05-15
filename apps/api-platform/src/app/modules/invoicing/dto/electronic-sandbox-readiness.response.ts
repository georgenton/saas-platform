import { ElectronicInvoicingSandboxReadiness } from '@saas-platform/invoicing-application';

export interface ElectronicSandboxReadinessResponseDto {
  tenantSlug: string;
  stage: 'electronic_invoicing_ec_mvp';
  environment: 'test' | 'production' | null;
  signatureProvider: string | null;
  submissionProvider: string | null;
  transmissionMode: string | null;
  internalSignerMaterialStatus:
    | 'not_configured'
    | 'not_applicable'
    | 'likely_usable'
    | 'invalid';
  internalSignerMaterialDetail: string;
  isInternalSignerMaterialReady: boolean;
  internalSignerCertificateValidityStatus:
    | 'not_applicable'
    | 'unknown'
    | 'valid'
    | 'expiring_soon'
    | 'expired'
    | 'not_yet_valid';
  internalSignerCertificateValidityDetail: string;
  internalSignerCertificateValidUntil: string | null;
  isInternalSignerCertificateCurrentlyValid: boolean;
  internalSignerCryptoProofStatus:
    | 'not_applicable'
    | 'unknown'
    | 'verified'
    | 'failed';
  internalSignerCryptoProofDetail: string;
  isInternalSignerCryptographicallyReady: boolean;
  internalSignerOfflineCompatibilityStatus:
    | 'not_applicable'
    | 'unknown'
    | 'verified'
    | 'failed';
  internalSignerOfflineCompatibilityDetail: string;
  isInternalSignerOfflineCompatible: boolean;
  internalSignerIssuerAlignmentStatus:
    | 'not_applicable'
    | 'unknown'
    | 'matched'
    | 'mismatched';
  internalSignerIssuerAlignmentDetail: string;
  internalSignerExtractedTaxId: string | null;
  isInternalSignerIssuerAligned: boolean;
  latestRemoteSriSubmissionStatus: string | null;
  latestRemoteSriSubmissionSummary: string | null;
  latestRemoteSriSubmissionCategory:
    | 'taxpayer_not_registered'
    | 'xml_structure'
    | 'authorization_rejected'
    | 'technical_failure'
    | 'unknown'
    | null;
  latestRemoteSriSubmissionOccurredAt: string | null;
  isReadyForLocalStubSubmission: boolean;
  isReadyForRemoteSandboxSubmission: boolean;
  isReadyForPresignedRemoteSandboxSubmission: boolean;
  blockers: string[];
  warnings: string[];
  checks: Array<{
    key: string;
    label: string;
    status: 'ready' | 'warning' | 'blocked';
    detail: string;
  }>;
  documentSupport: Array<{
    documentCode: '01' | '04' | '05' | '06' | '07';
    label: string;
    numberingConfigured: boolean;
    previewAvailable: boolean;
    rideAvailable: boolean;
    schemaValidationAvailable: boolean;
    submitSupported: boolean;
    detail: string;
  }>;
  recommendedNextStep: string;
}

export function toElectronicSandboxReadinessResponseDto(
  readiness: ElectronicInvoicingSandboxReadiness,
): ElectronicSandboxReadinessResponseDto {
  return {
    tenantSlug: readiness.tenantSlug,
    stage: readiness.stage,
    environment: readiness.environment,
    signatureProvider: readiness.signatureProvider,
    submissionProvider: readiness.submissionProvider,
    transmissionMode: readiness.transmissionMode,
    internalSignerMaterialStatus: readiness.internalSignerMaterialStatus,
    internalSignerMaterialDetail: readiness.internalSignerMaterialDetail,
    isInternalSignerMaterialReady: readiness.isInternalSignerMaterialReady,
    internalSignerCertificateValidityStatus:
      readiness.internalSignerCertificateValidityStatus,
    internalSignerCertificateValidityDetail:
      readiness.internalSignerCertificateValidityDetail,
    internalSignerCertificateValidUntil:
      readiness.internalSignerCertificateValidUntil,
    isInternalSignerCertificateCurrentlyValid:
      readiness.isInternalSignerCertificateCurrentlyValid,
    internalSignerCryptoProofStatus: readiness.internalSignerCryptoProofStatus,
    internalSignerCryptoProofDetail: readiness.internalSignerCryptoProofDetail,
    isInternalSignerCryptographicallyReady:
      readiness.isInternalSignerCryptographicallyReady,
    internalSignerOfflineCompatibilityStatus:
      readiness.internalSignerOfflineCompatibilityStatus,
    internalSignerOfflineCompatibilityDetail:
      readiness.internalSignerOfflineCompatibilityDetail,
    isInternalSignerOfflineCompatible:
      readiness.isInternalSignerOfflineCompatible,
    internalSignerIssuerAlignmentStatus:
      readiness.internalSignerIssuerAlignmentStatus,
    internalSignerIssuerAlignmentDetail:
      readiness.internalSignerIssuerAlignmentDetail,
    internalSignerExtractedTaxId: readiness.internalSignerExtractedTaxId,
    isInternalSignerIssuerAligned:
      readiness.isInternalSignerIssuerAligned,
    latestRemoteSriSubmissionStatus: readiness.latestRemoteSriSubmissionStatus,
    latestRemoteSriSubmissionSummary:
      readiness.latestRemoteSriSubmissionSummary,
    latestRemoteSriSubmissionCategory:
      readiness.latestRemoteSriSubmissionCategory,
    latestRemoteSriSubmissionOccurredAt:
      readiness.latestRemoteSriSubmissionOccurredAt,
    isReadyForLocalStubSubmission: readiness.isReadyForLocalStubSubmission,
    isReadyForRemoteSandboxSubmission:
      readiness.isReadyForRemoteSandboxSubmission,
    isReadyForPresignedRemoteSandboxSubmission:
      readiness.isReadyForPresignedRemoteSandboxSubmission,
    blockers: readiness.blockers,
    warnings: readiness.warnings,
    checks: readiness.checks.map((check) => ({
      key: check.key,
      label: check.label,
      status: check.status,
      detail: check.detail,
    })),
    documentSupport: readiness.documentSupport.map((item) => ({
      documentCode: item.documentCode,
      label: item.label,
      numberingConfigured: item.numberingConfigured,
      previewAvailable: item.previewAvailable,
      rideAvailable: item.rideAvailable,
      schemaValidationAvailable: item.schemaValidationAvailable,
      submitSupported: item.submitSupported,
      detail: item.detail,
    })),
    recommendedNextStep: readiness.recommendedNextStep,
  };
}
