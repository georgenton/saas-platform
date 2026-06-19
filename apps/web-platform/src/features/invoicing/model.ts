export type InvoicingReadinessTone =
  | 'success'
  | 'warning'
  | 'danger'
  | 'neutral';

export type InvoicingWorkspaceHeroActionKey =
  | 'configure-issuer'
  | 'review-signature'
  | 'review-pending'
  | 'create-invoice';

export type InvoicingWorkspaceSubview =
  | 'overview'
  | 'settings'
  | 'draft'
  | 'items'
  | 'sri-lifecycle'
  | 'documents'
  | 'closeout';

export type InvoicingWorkspaceHeroState =
  | 'operating'
  | 'no-issuer'
  | 'readiness-blocked'
  | 'no-invoices'
  | 'permission-limited';

export type InvoicingWorkspaceMetric = {
  key: string;
  label: string;
  value: string;
};

export type InvoicingWorkspaceReadinessSignal = {
  key: string;
  label: string;
  value: string;
  sub: string;
  tone: InvoicingReadinessTone;
};

export type InvoicingWorkspaceReadiness = {
  ready: boolean;
  blockers: string[];
  pillars: InvoicingWorkspaceReadinessSignal[];
};

export type InvoicingWorkspaceHero = {
  eyebrow: string;
  title: string;
  description: string;
  primaryActionLabel: string;
  primaryActionKey: InvoicingWorkspaceHeroActionKey;
  state: InvoicingWorkspaceHeroState;
};

export type InvoicingWorkspaceStage =
  | 'none'
  | 'generated'
  | 'submitted'
  | 'authorized'
  | 'rejected';

export type InvoicingWorkspaceStagePreview = {
  customerName: string;
  electronicLabel: string;
  id: string;
  number: string;
  statusLabel: string;
  total: string;
  stage: InvoicingWorkspaceStage;
};

export type InvoicingWorkspaceFoundationModel = {
  generatedFrom: 'client-composed';
  hero: InvoicingWorkspaceHero;
  metrics: InvoicingWorkspaceMetric[];
  readiness: InvoicingWorkspaceReadiness;
  nextActions: string[];
  stagePreview: InvoicingWorkspaceStagePreview | null;
};
