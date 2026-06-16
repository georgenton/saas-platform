export type InvoicingReadinessTone = 'success' | 'warning' | 'neutral';

export type InvoicingWorkspaceMetric = {
  key: string;
  label: string;
  value: string;
};

export type InvoicingWorkspaceReadinessSignal = {
  key: string;
  label: string;
  value: string;
  tone: InvoicingReadinessTone;
};

export type InvoicingWorkspaceFoundationModel = {
  generatedFrom: 'client-composed';
  summary: {
    eyebrow: string;
    title: string;
    description: string;
  };
  metrics: InvoicingWorkspaceMetric[];
  readiness: InvoicingWorkspaceReadinessSignal[];
  nextActions: string[];
};
