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
    | 'signature_capability'
    | 'submission_settings'
    | 'submission_gateway'
    | 'submission_transport'
    | 'environment_alignment'
    | 'credentials_secret';
  label: string;
  status: ElectronicInvoicingReadinessStatus;
  detail: string;
}

export interface ElectronicInvoicingSandboxReadiness {
  tenantSlug: string;
  stage: 'electronic_invoicing_ec_mvp';
  environment: 'test' | 'production' | null;
  signatureProvider: string | null;
  submissionProvider: string | null;
  transmissionMode: string | null;
  isReadyForRemoteSandboxSubmission: boolean;
  blockers: string[];
  warnings: string[];
  checks: ElectronicInvoicingReadinessCheck[];
  recommendedNextStep: string;
}
