import { ElectronicInvoicingSandboxReadiness } from '@saas-platform/invoicing-application';

export interface ElectronicSandboxReadinessResponseDto {
  tenantSlug: string;
  stage: 'electronic_invoicing_ec_mvp';
  environment: 'test' | 'production' | null;
  signatureProvider: string | null;
  submissionProvider: string | null;
  transmissionMode: string | null;
  isReadyForRemoteSandboxSubmission: boolean;
  blockers: string[];
  warnings: string[];
  checks: Array<{
    key: string;
    label: string;
    status: 'ready' | 'warning' | 'blocked';
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
    isReadyForRemoteSandboxSubmission:
      readiness.isReadyForRemoteSandboxSubmission,
    blockers: readiness.blockers,
    warnings: readiness.warnings,
    checks: readiness.checks.map((check) => ({
      key: check.key,
      label: check.label,
      status: check.status,
      detail: check.detail,
    })),
    recommendedNextStep: readiness.recommendedNextStep,
  };
}
