export type ElectronicInvoicingReadinessStatus =
  | 'ready'
  | 'warning'
  | 'blocked';

export interface ElectronicInvoicingReadinessCheck {
  key:
    | 'issuer_profile'
    | 'invoice_numbering'
    | 'signature_settings'
    | 'signature_material'
    | 'signature_material_probe'
    | 'signature_certificate_validity'
    | 'signature_crypto_proof'
    | 'signature_offline_probe'
    | 'signature_issuer_alignment'
    | 'signature_capability'
    | 'submission_settings'
    | 'submission_gateway'
    | 'submission_transport'
    | 'environment_alignment'
    | 'sandbox_taxpayer_registration'
    | 'remote_feedback'
    | 'credentials_secret';
  label: string;
  status: ElectronicInvoicingReadinessStatus;
  detail: string;
}

export interface ElectronicInvoicingDocumentSupport {
  documentCode: '01' | '04' | '05' | '06' | '07';
  label: string;
  numberingConfigured: boolean;
  previewAvailable: boolean;
  rideAvailable: boolean;
  schemaValidationAvailable: boolean;
  submitSupported: boolean;
  detail: string;
}

export interface ElectronicInvoicingSandboxReadiness {
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
  checks: ElectronicInvoicingReadinessCheck[];
  documentSupport: ElectronicInvoicingDocumentSupport[];
  recommendedNextStep: string;
}
