export type EcuadorTaxpayerRegime =
  | 'general'
  | 'rimpe_entrepreneur'
  | 'rimpe_popular_business'
  | 'unknown';

export type EcuadorTaxObligationKey =
  | 'vat'
  | 'income_tax'
  | 'withholding'
  | 'annexes';

export type EcuadorTaxObligationFrequency =
  | 'monthly'
  | 'semiannual'
  | 'annual'
  | 'event_driven'
  | 'unknown';

export type EcuadorTaxReadinessStatus =
  | 'ready'
  | 'needs_review'
  | 'blocked';
export type EcuadorTaxDueStatus =
  | 'overdue'
  | 'due_soon'
  | 'upcoming'
  | 'unscheduled';
export type EcuadorTaxReviewPriority = 'critical' | 'high' | 'normal';
export type EcuadorTaxPeriodWorkspaceStatus =
  | 'blocked'
  | 'needs_review'
  | 'ready_for_accountant'
  | 'ready_for_declaration';
export type EcuadorTaxReconciliationStatus =
  | 'blocked'
  | 'needs_review'
  | 'reconciled';
export type EcuadorTaxVatDeclarationReadinessStatus =
  | 'blocked'
  | 'needs_review'
  | 'ready_for_accountant';
export type EcuadorTaxPeriodCloseoutStatus =
  | 'blocked'
  | 'needs_review'
  | 'ready_for_accountant'
  | 'ready_for_external_filing';
export type EcuadorTaxComplianceEventType =
  | 'period_workspace_generated'
  | 'accountant_packet_requested'
  | 'accountant_review_transitioned'
  | 'declaration_draft_requested'
  | 'due_monitor_reviewed'
  | 'tax_sales_book_generated'
  | 'tax_reconciliation_reviewed'
  | 'vat_readiness_packet_requested'
  | 'period_closeout_packet_requested';
export type EcuadorTaxAccountantReviewStatus =
  | 'pending_accountant'
  | 'in_review'
  | 'changes_requested'
  | 'approved';

export interface EcuadorTaxpayerProfileView {
  tenantSlug: string;
  tenantId: string;
  generatedAt: Date;
  country: 'EC';
  legalName: string;
  commercialName: string | null;
  taxpayerId: string | null;
  regime: EcuadorTaxpayerRegime;
  accountingObligated: boolean | null;
  specialTaxpayerCode: string | null;
  matrixAddress: string | null;
  establishmentAddress: string | null;
  source: 'invoicing_issuer_profile';
  readinessStatus: EcuadorTaxReadinessStatus;
  missingFields: string[];
  reviewNotes: string[];
  thirdPartyFiscalSummary: {
    totalParties: number;
    completeParties: number;
    needsReviewParties: number;
    missingFieldCounts: Record<string, number>;
  };
}

export interface EcuadorTaxObligationView {
  key: EcuadorTaxObligationKey;
  label: string;
  applies: boolean;
  frequency: EcuadorTaxObligationFrequency;
  source: 'sri_rule_of_thumb';
  readinessStatus: EcuadorTaxReadinessStatus;
  dependsOn: string[];
  notes: string[];
}

export interface EcuadorTaxObligationMatrixView {
  tenantSlug: string;
  generatedAt: Date;
  taxpayerProfile: EcuadorTaxpayerProfileView;
  obligations: EcuadorTaxObligationView[];
  guardrails: string[];
}

export interface EcuadorTaxCalendarEntryView {
  obligationKey: EcuadorTaxObligationKey;
  label: string;
  period: string;
  frequency: EcuadorTaxObligationFrequency;
  dueDate: string | null;
  dueDay: number | null;
  source: 'sri_rule_of_thumb';
  readinessStatus: EcuadorTaxReadinessStatus;
  notes: string[];
}

export interface EcuadorTaxObligationCalendarView {
  tenantSlug: string;
  year: number;
  generatedAt: Date;
  taxpayerProfile: EcuadorTaxpayerProfileView;
  ninthDigit: string | null;
  entries: EcuadorTaxCalendarEntryView[];
  guardrails: string[];
}

export interface EcuadorTaxCalendarReviewEntryView
  extends EcuadorTaxCalendarEntryView {
  dueStatus: EcuadorTaxDueStatus;
  daysUntilDue: number | null;
  reviewPriority: EcuadorTaxReviewPriority;
  reviewReasons: string[];
}

export interface EcuadorTaxCalendarReviewWorkspaceView {
  tenantSlug: string;
  year: number;
  generatedAt: Date;
  asOfDate: string;
  taxpayerProfile: EcuadorTaxpayerProfileView;
  summary: {
    totalEntries: number;
    overdueCount: number;
    dueSoonCount: number;
    blockedCount: number;
    needsReviewCount: number;
  };
  priorityEntries: EcuadorTaxCalendarReviewEntryView[];
  nextActions: string[];
  guardrails: string[];
}

export interface EcuadorTaxDueMonitorAlertView {
  obligationKey: EcuadorTaxObligationKey;
  label: string;
  period: string;
  dueDate: string | null;
  dueStatus: EcuadorTaxDueStatus;
  daysUntilDue: number | null;
  severity: EcuadorTaxReviewPriority;
  message: string;
}

export interface EcuadorTaxDueMonitorView {
  tenantSlug: string;
  year: number;
  generatedAt: Date;
  asOfDate: string;
  windowDays: number;
  alerts: EcuadorTaxDueMonitorAlertView[];
  summary: {
    overdueCount: number;
    dueSoonCount: number;
    unscheduledCount: number;
  };
  guardrails: string[];
}

export interface EcuadorTaxEvidenceSummaryView {
  invoicing: {
    invoiceCount: number;
    statusBreakdown: Array<{ status: string; count: number }>;
    totalsByCurrency: Array<{
      currency: string;
      subtotalInCents: number;
      taxInCents: number;
      totalInCents: number;
      paidInCents: number;
      outstandingTotalInCents: number;
    }>;
    monthlyTotals: Array<{
      month: string;
      currency: string;
      invoiceCount: number;
      totalInCents: number;
      taxInCents: number;
    }>;
  };
  parties: {
    totalParties: number;
    completeParties: number;
    needsReviewParties: number;
    issueSummaries: Array<{ issue: string; count: number }>;
    incompletePartyIds: string[];
  };
  ecommerce: {
    status: 'connected' | 'no_activity' | 'requires_review';
    orderCount: number;
    readyToInvoiceCount: number;
    blockedCount: number;
    needsFiscalDataCount: number;
    confirmedPaymentEventCount: number;
    disputedPaymentEventCount: number;
    deliveredEventCount: number;
    period: string;
    notes: string[];
  };
}

export interface EcuadorTaxEcommerceEvidenceSummaryView {
  tenantSlug: string;
  period: string;
  generatedAt: Date;
  status: EcuadorTaxEvidenceSummaryView['ecommerce']['status'];
  orderCount: number;
  readyToInvoiceCount: number;
  blockedCount: number;
  needsFiscalDataCount: number;
  confirmedPaymentEventCount: number;
  disputedPaymentEventCount: number;
  deliveredEventCount: number;
  orderHighlights: Array<{
    orderDraftId: string;
    productEntityId: string;
    orderLabel: string;
    invoicingReadinessStatus: string;
    status: string;
    updatedAt: Date;
  }>;
  notes: string[];
}

export interface EcuadorTaxSalesBookView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  source: 'invoicing_and_ecommerce_operational_evidence';
  readinessStatus: EcuadorTaxReadinessStatus;
  totalsByCurrency: Array<{
    currency: string;
    documentCount: number;
    subtotalInCents: number;
    taxInCents: number;
    totalInCents: number;
    paidInCents: number;
    outstandingTotalInCents: number;
  }>;
  documentRows: Array<{
    invoiceId: string;
    number: string;
    documentCode: string | null;
    status: string;
    electronicStatus: string | null;
    issuedAt: Date;
    currency: string;
    subtotalInCents: number;
    taxInCents: number;
    totalInCents: number;
    paidInCents: number;
    outstandingTotalInCents: number;
    customerId: string;
    buyerIdentification: string | null;
    buyerName: string | null;
    blockers: string[];
  }>;
  ecommerceEvidence: EcuadorTaxEcommerceEvidenceSummaryView;
  blockers: string[];
  reviewNotes: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxPeriodPreparationPacketView {
  tenantSlug: string;
  period: string;
  generatedAt: Date;
  taxpayerProfile: EcuadorTaxpayerProfileView;
  obligations: EcuadorTaxObligationView[];
  readinessStatus: EcuadorTaxReadinessStatus;
  evidenceSummary: EcuadorTaxEvidenceSummaryView;
  salesBookPreview: {
    readinessStatus: EcuadorTaxReadinessStatus;
    documentCount: number;
    blockerCount: number;
    ecommerceOrderCount: number;
  };
  evidenceChecklist: string[];
  accountantHandoff: {
    recommended: boolean;
    reason: string;
    packetSummary: string;
  };
  blockedBy: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxDeclarationDraftPacketView {
  tenantSlug: string;
  period: string;
  generatedAt: Date;
  taxpayerProfile: EcuadorTaxpayerProfileView;
  readinessStatus: EcuadorTaxReadinessStatus;
  declarationSections: Array<{
    section: string;
    readinessStatus: EcuadorTaxReadinessStatus;
    source: string;
    summary: string;
    blockers: string[];
  }>;
  accountantReview: {
    required: boolean;
    reasons: string[];
    suggestedQuestions: string[];
  };
  sourcePackets: {
    preparationPacketGeneratedAt: Date;
    calendarEntryCount: number;
    evidenceSummary: EcuadorTaxEvidenceSummaryView;
    salesBookReadinessStatus: EcuadorTaxReadinessStatus;
  };
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxPeriodWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  status: EcuadorTaxPeriodWorkspaceStatus;
  taxpayerProfile: EcuadorTaxpayerProfileView;
  calendarEntries: EcuadorTaxCalendarEntryView[];
  dueAlerts: EcuadorTaxDueMonitorAlertView[];
  preparationPacket: EcuadorTaxPeriodPreparationPacketView;
  declarationDraftPacket: EcuadorTaxDeclarationDraftPacketView;
  salesBook: EcuadorTaxSalesBookView;
  blockers: string[];
  nextActions: string[];
  guardrails: string[];
}

export interface EcuadorTaxReconciliationCheckView {
  key: string;
  source: string;
  readinessStatus: EcuadorTaxReadinessStatus;
  summary: string;
  blockers: string[];
}

export interface EcuadorTaxReconciliationWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  status: EcuadorTaxReconciliationStatus;
  salesBook: EcuadorTaxSalesBookView;
  ecommerceEvidence: EcuadorTaxEcommerceEvidenceSummaryView;
  accountantReviews: EcuadorTaxAccountantReviewView[];
  checks: EcuadorTaxReconciliationCheckView[];
  blockers: string[];
  reviewNotes: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAccountantReviewPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  executiveSummary: string;
  workspaceStatus: EcuadorTaxPeriodWorkspaceStatus;
  declarationSections: EcuadorTaxDeclarationDraftPacketView['declarationSections'];
  suggestedQuestions: string[];
  missingEvidence: string[];
  calendarAlerts: EcuadorTaxDueMonitorAlertView[];
  incompleteThirdPartyIds: string[];
  sourceEvidenceSummary: EcuadorTaxEvidenceSummaryView;
  handoffChecklist: string[];
  responsibilityGuardrails: string[];
  nextStep: string;
}

export interface EcuadorTaxAuditReadinessView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  generatedOutputs: Array<{
    eventType: string;
    generated: boolean;
    source: string;
    recommendedPersistence: string;
  }>;
  missingPersistence: string[];
  recommendedAuditEvents: Array<{
    eventType: string;
    reason: string;
    minimumPayload: string[];
  }>;
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxVatDeclarationReadinessPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxVatDeclarationReadinessStatus;
  reconciliationStatus: EcuadorTaxReconciliationStatus;
  vatObligation: EcuadorTaxCalendarEntryView | null;
  salesTotalsByCurrency: EcuadorTaxSalesBookView['totalsByCurrency'];
  vatSummaryByCurrency: Array<{
    currency: string;
    taxableBaseInCents: number;
    vatInCents: number;
    documentCount: number;
  }>;
  blockers: string[];
  accountantQuestions: string[];
  supportChecklist: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxPeriodCloseoutPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  closeoutStatus: EcuadorTaxPeriodCloseoutStatus;
  workspaceStatus: EcuadorTaxPeriodWorkspaceStatus;
  salesBookStatus: EcuadorTaxReadinessStatus;
  reconciliationStatus: EcuadorTaxReconciliationStatus;
  vatReadinessStatus: EcuadorTaxVatDeclarationReadinessStatus;
  latestAccountantReview: EcuadorTaxAccountantReviewView | null;
  approvalReadiness: EcuadorTaxDeclarationApprovalPacketView['approvalReadiness'];
  ledgerCompleteness: {
    requiredEventTypes: EcuadorTaxComplianceEventType[];
    presentEventTypes: EcuadorTaxComplianceEventType[];
    missingEventTypes: EcuadorTaxComplianceEventType[];
  };
  closeoutChecklist: string[];
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxComplianceEventView {
  id: string;
  tenantId: string;
  tenantSlug: string;
  period: string;
  year: number;
  eventType: EcuadorTaxComplianceEventType;
  source: string;
  payload: Record<string, unknown>;
  occurredAt: Date;
  createdAt: Date;
}

export interface EcuadorTaxAccountantReviewView {
  id: string;
  tenantId: string;
  tenantSlug: string;
  period: string;
  year: number;
  status: EcuadorTaxAccountantReviewStatus;
  requestedByUserId: string | null;
  requestedByEmail: string | null;
  summary: string;
  questions: string[];
  evidenceSummary: EcuadorTaxEvidenceSummaryView;
  transitionHistory: Array<{
    status: EcuadorTaxAccountantReviewStatus;
    transitionedAt: Date;
    transitionedByUserId: string | null;
    note: string | null;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface EcuadorTaxDeclarationApprovalPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  latestAccountantReview: EcuadorTaxAccountantReviewView | null;
  approvalReadiness: 'blocked' | 'needs_accountant_review' | 'ready_for_human_approval';
  remainingBlockers: string[];
  evidenceSummary: EcuadorTaxEvidenceSummaryView;
  declarationSections: EcuadorTaxDeclarationDraftPacketView['declarationSections'];
  availableAuditEvents: EcuadorTaxComplianceEventView[];
  approvalChecklist: string[];
  nextStep: string;
  guardrails: string[];
}
