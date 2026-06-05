import { TenantAccountingIntakeWorkspaceView } from '@saas-platform/accounting-domain';

export interface AccountingIntakeWorkspaceResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  productKey: 'accounting';
  sourceProductKey: 'tax-compliance-ec';
  readinessStatus: string;
  recommendation: string;
  summary: {
    accountingMappedHints: number;
    accountingUnmappedHints: number;
    closeoutBlockerCount: number;
    evidenceArtifactCount: number;
    auditEventCount: number;
    decisionSignalCount: number;
  };
  intakeSignals: Array<{
    key: string;
    label: string;
    severity: string;
    rationale: string;
  }>;
  proposedScope: Array<{
    key: string;
    label: string;
    reason: string;
    source: string;
  }>;
  blockedCapabilities: string[];
  nextStep: string;
  guardrails: string[];
}

export function toAccountingIntakeWorkspaceResponseDto(
  view: TenantAccountingIntakeWorkspaceView,
): AccountingIntakeWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    period: view.period,
    year: view.year,
    generatedAt: view.generatedAt.toISOString(),
    productKey: view.productKey,
    sourceProductKey: view.sourceProductKey,
    readinessStatus: view.readinessStatus,
    recommendation: view.recommendation,
    summary: { ...view.summary },
    intakeSignals: view.intakeSignals.map((signal) => ({ ...signal })),
    proposedScope: view.proposedScope.map((scope) => ({ ...scope })),
    blockedCapabilities: [...view.blockedCapabilities],
    nextStep: view.nextStep,
    guardrails: [...view.guardrails],
  };
}
