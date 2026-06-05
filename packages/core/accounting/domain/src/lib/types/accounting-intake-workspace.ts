export type AccountingReadinessStatus = 'ready' | 'needs_review' | 'blocked';

export interface TenantAccountingIntakeWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  productKey: 'accounting';
  sourceProductKey: 'tax-compliance-ec';
  readinessStatus: AccountingReadinessStatus;
  recommendation: 'stay_in_tax_compliance' | 'graduate_to_accounting';
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
    severity: 'critical' | 'high' | 'normal';
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
