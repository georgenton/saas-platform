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

export type EcuadorTaxReadinessStatus = 'ready' | 'needs_review' | 'blocked';
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
export type EcuadorTaxVatApprovalStatus =
  | 'draft'
  | 'needs_accountant_review'
  | 'changes_requested'
  | 'approved_for_external_filing';
export type EcuadorTaxOperationalCloseoutStatus =
  | 'open'
  | 'in_review'
  | 'ready_for_external_filing'
  | 'closed_operationally';
export type EcuadorTaxFilingHandoffStatus =
  | 'payment_pending'
  | 'filed_externally'
  | 'paid_externally'
  | 'filing_rejected';
export type EcuadorTaxPurchaseExpenseCategory =
  | 'inventory'
  | 'services'
  | 'operating_expense'
  | 'asset'
  | 'non_deductible'
  | 'uncategorized';
export type EcuadorTaxPurchaseExpenseEvidenceStatus =
  | 'draft'
  | 'needs_supplier_data'
  | 'needs_tax_review'
  | 'ready';
export type EcuadorTaxSriVoucherDirection = 'issued' | 'received';
export type EcuadorTaxSriVoucherType =
  | 'invoice'
  | 'credit_note'
  | 'debit_note'
  | 'withholding'
  | 'purchase_settlement'
  | 'remission_guide'
  | 'other';
export type EcuadorTaxSriEvidenceImportSource =
  | 'sri_report'
  | 'sri_xml'
  | 'manual_summary';
export type EcuadorTaxSriReconciliationIssueSeverity =
  | 'blocking'
  | 'review'
  | 'info';
export type EcuadorTaxDeclarationFormKey =
  | 'iva'
  | 'income_tax_natural_person'
  | 'income_tax_company'
  | 'withholding_income_tax'
  | 'multiple_payments'
  | 'multiple_declarations';
export type EcuadorTaxDeclarationFormSupportStatus =
  | 'draftable'
  | 'needs_review'
  | 'manual_only';
export type EcuadorTaxComplianceEventType =
  | 'period_workspace_generated'
  | 'accountant_packet_requested'
  | 'accountant_review_transitioned'
  | 'declaration_draft_requested'
  | 'due_monitor_reviewed'
  | 'tax_sales_book_generated'
  | 'tax_reconciliation_reviewed'
  | 'vat_readiness_packet_requested'
  | 'period_closeout_packet_requested'
  | 'purchase_expense_evidence_reviewed'
  | 'vat_input_output_reconciliation_requested'
  | 'income_tax_evidence_packet_requested'
  | 'purchase_expense_evidence_recorded'
  | 'supplier_fiscal_readiness_reviewed'
  | 'withholding_evidence_packet_requested'
  | 'withholding_draft_bridge_requested'
  | 'withholding_draft_executed'
  | 'tax_rule_catalog_reviewed'
  | 'accountant_workbench_reviewed'
  | 'tax_obligation_settings_upserted'
  | 'vat_declaration_draft_requested'
  | 'period_evidence_vault_reviewed'
  | 'vat_declaration_approval_transitioned'
  | 'withholding_registry_reviewed'
  | 'period_operational_closeout_transitioned'
  | 'tax_filing_handoff_recorded'
  | 'tax_annexes_readiness_reviewed'
  | 'tax_accounting_bridge_preview_requested'
  | 'tax_accounting_bridge_mapping_upserted'
  | 'tax_review_assistant_packet_requested'
  | 'tax_period_closeout_report_requested'
  | 'tax_accounting_readiness_packet_requested'
  | 'sri_fiscal_evidence_import_recorded'
  | 'sri_fiscal_evidence_workspace_reviewed'
  | 'sri_platform_reconciliation_reviewed'
  | 'tax_declaration_form_catalog_reviewed'
  | 'tax_declaration_form_draft_packet_requested'
  | 'tax_filing_guide_packet_requested'
  | 'tax_declaration_artifact_export_requested';
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
  persistedSettings: EcuadorTaxObligationSettingsView | null;
  guardrails: string[];
}

export interface EcuadorTaxObligationSettingsView {
  tenantSlug: string;
  generatedAt: Date;
  source: 'tax_compliance_event_ledger' | 'heuristic_fallback';
  regime: EcuadorTaxpayerRegime;
  accountingObligated: boolean | null;
  specialTaxpayerCode: string | null;
  ninthDigit: string | null;
  obligations: Array<{
    key: EcuadorTaxObligationKey;
    applies: boolean;
    frequency: EcuadorTaxObligationFrequency;
    notes: string[];
  }>;
  updatedByUserId: string | null;
  updatedByEmail: string | null;
  updatedAt: Date | null;
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

export interface EcuadorTaxSriVoucherEvidenceView {
  evidenceId: string;
  direction: EcuadorTaxSriVoucherDirection;
  voucherType: EcuadorTaxSriVoucherType;
  source: EcuadorTaxSriEvidenceImportSource;
  accessKey: string | null;
  authorizationNumber: string | null;
  authorizationDate: Date | null;
  issuedAt: Date | null;
  emitterTaxpayerId: string | null;
  emitterName: string | null;
  receiverTaxpayerId: string | null;
  receiverName: string | null;
  establishment: string | null;
  emissionPoint: string | null;
  sequential: string | null;
  documentNumber: string | null;
  currency: string;
  subtotalInCents: number;
  vatInCents: number;
  incomeTaxWithholdingInCents: number;
  vatWithholdingInCents: number;
  totalInCents: number;
  relatedAccessKey: string | null;
  xmlReference: string | null;
  rideReference: string | null;
  readinessStatus: EcuadorTaxReadinessStatus;
  blockers: string[];
  reviewNotes: string[];
}

export interface EcuadorTaxSriFiscalEvidenceWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  source: 'tax_compliance_event_ledger';
  summary: {
    totalVouchers: number;
    issuedVouchers: number;
    receivedVouchers: number;
    duplicateAccessKeys: number;
    readyVouchers: number;
    needsReviewVouchers: number;
    blockedVouchers: number;
    importedBatchCount: number;
  };
  totalsByDirectionAndCurrency: Array<{
    direction: EcuadorTaxSriVoucherDirection;
    currency: string;
    voucherCount: number;
    subtotalInCents: number;
    vatInCents: number;
    incomeTaxWithholdingInCents: number;
    vatWithholdingInCents: number;
    totalInCents: number;
  }>;
  voucherRows: EcuadorTaxSriVoucherEvidenceView[];
  blockers: string[];
  reviewNotes: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxSriFiscalEvidenceImportBatchView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  importId: string;
  source: EcuadorTaxSriEvidenceImportSource;
  importedByUserId: string | null;
  importedByEmail: string | null;
  summary: EcuadorTaxSriFiscalEvidenceWorkspaceView['summary'];
  voucherRows: EcuadorTaxSriVoucherEvidenceView[];
  blockers: string[];
  reviewNotes: string[];
  guardrails: string[];
}

export interface EcuadorTaxSriPlatformReconciliationWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  sriEvidenceSummary: EcuadorTaxSriFiscalEvidenceWorkspaceView['summary'];
  platformSummary: {
    salesDocuments: number;
    purchaseDocuments: number;
    ecommerceOrdersReadyToInvoice: number;
  };
  issueSummary: {
    totalIssues: number;
    blockingIssues: number;
    reviewIssues: number;
    infoIssues: number;
  };
  issues: Array<{
    key: string;
    severity: EcuadorTaxSriReconciliationIssueSeverity;
    source: 'sri' | 'platform' | 'cross_check';
    summary: string;
    evidenceIds: string[];
    platformReferences: string[];
    suggestedAction: string;
  }>;
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxDeclarationFormCatalogView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  taxpayerProfile: EcuadorTaxpayerProfileView;
  forms: Array<{
    formKey: EcuadorTaxDeclarationFormKey;
    label: string;
    obligationKey: EcuadorTaxObligationKey | 'payment';
    supportStatus: EcuadorTaxDeclarationFormSupportStatus;
    periodicity: EcuadorTaxObligationFrequency;
    taxpayerCompatibility: EcuadorTaxReadinessStatus;
    requiredEvidence: string[];
    draftableBoxes: Array<{
      boxKey: string;
      label: string;
      source: string;
      calculation: string;
    }>;
    manualOnlyBoxes: string[];
    blockers: string[];
    reviewNotes: string[];
  }>;
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxDeclarationFormDraftPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  formKey: EcuadorTaxDeclarationFormKey;
  formLabel: string;
  readinessStatus: EcuadorTaxReadinessStatus;
  supportStatus: EcuadorTaxDeclarationFormSupportStatus;
  suggestedBoxes: Array<{
    boxKey: string;
    label: string;
    suggestedValueInCents: number | null;
    currency: string | null;
    readinessStatus: EcuadorTaxReadinessStatus;
    source: string;
    calculation: string;
    evidenceIds: string[];
    platformReferences: string[];
    explanation: string;
    blockers: string[];
  }>;
  manualOnlyBoxes: Array<{
    boxKey: string;
    reason: string;
    requiredOwner: 'operator' | 'accountant';
  }>;
  evidenceSummary: {
    sriVouchers: number;
    reconciliationIssues: number;
    blockingIssues: number;
    reviewIssues: number;
  };
  accountantReview: {
    required: boolean;
    reasons: string[];
    suggestedQuestions: string[];
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxFilingGuidePacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  formKey: EcuadorTaxDeclarationFormKey;
  readinessStatus: EcuadorTaxReadinessStatus;
  assistantMode: 'guided_manual_entry';
  steps: Array<{
    key: string;
    order: number;
    title: string;
    instruction: string;
    source: string;
    humanGate: boolean;
  }>;
  copyChecklist: Array<{
    boxKey: string;
    label: string;
    valueLabel: string;
    evidenceCount: number;
    reviewRequired: boolean;
  }>;
  accountantQuestions: string[];
  blockedCapabilities: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxDeclarationArtifactExportView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  formKey: EcuadorTaxDeclarationFormKey;
  readinessStatus: EcuadorTaxReadinessStatus;
  exportMode: 'guided_manual' | 'technical_artifact_available';
  artifacts: Array<{
    key: string;
    label: string;
    format: 'json' | 'csv' | 'xlsx' | 'xml' | 'manual_checklist';
    supportStatus: 'available' | 'manual_only' | 'blocked';
    payload: Record<string, unknown>;
    blockers: string[];
  }>;
  blockedCapabilities: string[];
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

export interface EcuadorTaxPurchaseExpenseEvidenceRecordView {
  evidenceId: string;
  tenantSlug: string;
  period: string;
  year: number;
  supplierPartyId: string | null;
  supplierName: string;
  supplierTaxpayerId: string | null;
  documentNumber: string | null;
  documentCode: string | null;
  issuedAt: Date | null;
  category: EcuadorTaxPurchaseExpenseCategory;
  currency: string;
  subtotalInCents: number;
  vatInCents: number;
  totalInCents: number;
  deductible: boolean | null;
  supportReference: string | null;
  status: EcuadorTaxPurchaseExpenseEvidenceStatus;
  readinessStatus: EcuadorTaxReadinessStatus;
  blockers: string[];
  reviewNotes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EcuadorTaxPurchaseExpenseEvidenceWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  source: 'operational_intake';
  documentRows: Array<{
    evidenceId: string;
    supplierPartyId: string | null;
    supplierName: string;
    supplierTaxpayerId: string | null;
    documentNumber: string | null;
    documentCode: string | null;
    issuedAt: Date | null;
    category: EcuadorTaxPurchaseExpenseCategory;
    currency: string;
    subtotalInCents: number;
    vatInCents: number;
    totalInCents: number;
    deductible: boolean | null;
    supportReference: string | null;
    status: EcuadorTaxPurchaseExpenseEvidenceStatus;
    readinessStatus: EcuadorTaxReadinessStatus;
    blockers: string[];
    reviewNotes: string[];
  }>;
  totalsByCurrency: Array<{
    currency: string;
    documentCount: number;
    subtotalInCents: number;
    vatInCents: number;
    totalInCents: number;
    deductibleSubtotalInCents: number;
  }>;
  supplierReadiness: {
    totalSuppliers: number;
    completeSuppliers: number;
    needsReviewSuppliers: number;
    incompleteSupplierIds: string[];
  };
  blockers: string[];
  reviewNotes: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxSupplierFiscalReadinessWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  summary: {
    supplierCount: number;
    completeSupplierCount: number;
    needsReviewSupplierCount: number;
    purchaseEvidenceSupplierCount: number;
  };
  supplierRows: Array<{
    supplierKey: string;
    supplierPartyId: string | null;
    supplierName: string;
    supplierTaxpayerId: string | null;
    source: 'parties' | 'purchase_expense_evidence';
    purchaseEvidenceCount: number;
    missingFields: string[];
    readinessStatus: EcuadorTaxReadinessStatus;
    blockers: string[];
  }>;
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxVatInputOutputReconciliationPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  outputVatByCurrency: EcuadorTaxVatDeclarationReadinessPacketView['vatSummaryByCurrency'];
  inputVatByCurrency: Array<{
    currency: string;
    creditableVatInCents: number;
    purchaseDocumentCount: number;
  }>;
  netVatByCurrency: Array<{
    currency: string;
    outputVatInCents: number;
    inputVatInCents: number;
    estimatedVatPayableInCents: number;
  }>;
  purchaseExpenseEvidenceStatus: EcuadorTaxReadinessStatus;
  vatReadinessStatus: EcuadorTaxVatDeclarationReadinessStatus;
  blockers: string[];
  accountantQuestions: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxVatDeclarationDraftView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  vatObligation: EcuadorTaxCalendarEntryView | null;
  outputVatByCurrency: EcuadorTaxVatInputOutputReconciliationPacketView['outputVatByCurrency'];
  inputVatByCurrency: EcuadorTaxVatInputOutputReconciliationPacketView['inputVatByCurrency'];
  netVatByCurrency: EcuadorTaxVatInputOutputReconciliationPacketView['netVatByCurrency'];
  declarationSections: Array<{
    key: string;
    label: string;
    readinessStatus: EcuadorTaxReadinessStatus;
    amountInCents: number;
    currency: string | null;
    notes: string[];
  }>;
  blockers: string[];
  accountantQuestions: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxVatDeclarationApprovalView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  status: EcuadorTaxVatApprovalStatus;
  draft: EcuadorTaxVatDeclarationDraftView;
  transitionHistory: Array<{
    status: EcuadorTaxVatApprovalStatus;
    transitionedAt: Date;
    transitionedByUserId: string | null;
    transitionedByEmail: string | null;
    note: string | null;
  }>;
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxIncomeTaxEvidencePacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  incomeObligation: EcuadorTaxCalendarEntryView | null;
  revenueByCurrency: Array<{
    currency: string;
    grossRevenueInCents: number;
    documentCount: number;
  }>;
  expenseByCurrency: Array<{
    currency: string;
    deductibleExpenseInCents: number;
    expenseDocumentCount: number;
  }>;
  estimatedTaxableBaseByCurrency: Array<{
    currency: string;
    revenueInCents: number;
    deductibleExpenseInCents: number;
    estimatedTaxableBaseInCents: number;
  }>;
  blockers: string[];
  accountantQuestions: string[];
  supportChecklist: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxWithholdingEvidencePacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  withholdingObligation: EcuadorTaxCalendarEntryView | null;
  salesCandidates: Array<{
    invoiceId: string;
    number: string;
    buyerName: string | null;
    buyerIdentification: string | null;
    currency: string;
    taxableBaseInCents: number;
    vatInCents: number;
    candidateReason: string;
  }>;
  purchaseCandidates: Array<{
    evidenceId: string;
    supplierName: string;
    supplierTaxpayerId: string | null;
    currency: string;
    taxableBaseInCents: number;
    vatInCents: number;
    category: EcuadorTaxPurchaseExpenseCategory;
    candidateReason: string;
  }>;
  blockers: string[];
  accountantQuestions: string[];
  supportChecklist: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxWithholdingDraftBridgePacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  source: 'withholding_evidence_packet';
  selectedCandidate: {
    candidateType: 'sale' | 'purchase';
    candidateId: string;
    label: string;
    currency: string;
    taxableBaseInCents: number;
    vatInCents: number;
    candidateReason: string;
  } | null;
  createWithholdingDraftInput: {
    sourceInvoiceId: string;
    reason: string;
    amountInCents: number;
    taxRateId: string | null;
    number: string | null;
    issuedAt: Date | null;
    notes: string | null;
  } | null;
  bridgeChecklist: string[];
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxWithholdingDraftExecutionPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  bridgePacket: EcuadorTaxWithholdingDraftBridgePacketView;
  withholdingDraft: {
    id: string;
    number: string;
    status: string;
    documentCode: string | null;
    sourceInvoiceId: string | null;
    sourceInvoiceNumber: string | null;
    amountInCents: number;
    currency: string;
  } | null;
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxWithholdingRegistryView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  summary: {
    salesCandidateCount: number;
    purchaseCandidateCount: number;
    executedDraftCount: number;
    pendingSupportCount: number;
  };
  rows: Array<{
    key: string;
    source: 'sales_candidate' | 'purchase_candidate' | 'executed_draft';
    label: string;
    readinessStatus: EcuadorTaxReadinessStatus;
    amountInCents: number;
    currency: string;
    supportReference: string | null;
    nextStep: string;
  }>;
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxRuleCatalogView {
  tenantSlug: string;
  generatedAt: Date;
  country: 'EC';
  readinessStatus: EcuadorTaxReadinessStatus;
  rules: Array<{
    ruleKey: string;
    obligationKey: EcuadorTaxObligationKey;
    title: string;
    appliesToCategory: EcuadorTaxPurchaseExpenseCategory | null;
    appliesWhen: string[];
    operationalEffect: string;
    accountantReviewRecommended: boolean;
    evidenceInputs: string[];
    guardrails: string[];
  }>;
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAccountantWorkbenchView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  summary: {
    blockingSectionCount: number;
    needsReviewSectionCount: number;
    readySectionCount: number;
    accountantReviewCount: number;
    ruleCount: number;
  };
  sections: Array<{
    key: string;
    label: string;
    readinessStatus: EcuadorTaxReadinessStatus;
    blockerCount: number;
    questionCount: number;
    nextStep: string;
  }>;
  blockers: string[];
  accountantQuestions: string[];
  latestAccountantReview: EcuadorTaxAccountantReviewView | null;
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxPeriodEvidenceVaultView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  folders: Array<{
    key: string;
    label: string;
    readinessStatus: EcuadorTaxReadinessStatus;
    artifactCount: number;
    missingItems: string[];
    nextStep: string;
  }>;
  exportedSummary: {
    salesDocuments: number;
    purchaseDocuments: number;
    withholdingCandidates: number;
    accountantReviews: number;
    auditEventCount: number;
  };
  missingItems: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxOperationalCloseoutView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  status: EcuadorTaxOperationalCloseoutStatus;
  checklist: Array<{
    key: string;
    label: string;
    completed: boolean;
    blocker: string | null;
  }>;
  vatApprovalStatus: EcuadorTaxVatApprovalStatus;
  withholdingReadinessStatus: EcuadorTaxReadinessStatus;
  evidenceVaultStatus: EcuadorTaxReadinessStatus;
  transitionHistory: Array<{
    status: EcuadorTaxOperationalCloseoutStatus;
    transitionedAt: Date;
    transitionedByUserId: string | null;
    transitionedByEmail: string | null;
    note: string | null;
  }>;
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxFilingHandoffView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  status: EcuadorTaxFilingHandoffStatus | null;
  externalReference: string | null;
  filedAt: Date | null;
  paidAt: Date | null;
  amountPaidInCents: number | null;
  currency: string | null;
  responsibleUserId: string | null;
  responsibleEmail: string | null;
  note: string | null;
  operationalCloseoutStatus: EcuadorTaxOperationalCloseoutStatus;
  transitionHistory: Array<{
    status: EcuadorTaxFilingHandoffStatus;
    recordedAt: Date;
    externalReference: string | null;
    responsibleUserId: string | null;
    responsibleEmail: string | null;
    note: string | null;
  }>;
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAnnexesReadinessView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  annexes: Array<{
    key: string;
    label: string;
    applies: boolean;
    readinessStatus: EcuadorTaxReadinessStatus;
    evidenceSources: string[];
    blockerCount: number;
    blockers: string[];
    nextStep: string;
  }>;
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAccountingBridgePreviewView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  entries: Array<{
    key: string;
    label: string;
    source: string;
    debitInCents: number;
    creditInCents: number;
    currency: string;
    accountHint: string | null;
    requiresChartOfAccounts: boolean;
    notes: string[];
  }>;
  summary: {
    entryCount: number;
    requiresChartOfAccountsCount: number;
    salesDocuments: number;
    purchaseDocuments: number;
    withholdingCandidates: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAccountingBridgeMappingView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  rows: Array<{
    accountHint: string;
    suggestedAccountCode: string | null;
    suggestedAccountName: string | null;
    mapped: boolean;
    previewEntryCount: number;
    updatedByUserId: string | null;
    updatedByEmail: string | null;
    updatedAt: Date | null;
  }>;
  summary: {
    hintCount: number;
    mappedHintCount: number;
    unmappedHintCount: number;
    previewEntryCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAccountingBridgeSuggestedAccountsView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  rows: Array<{
    accountHint: string;
    suggestedAccountCode: string;
    suggestedAccountName: string;
    category:
      | 'sales'
      | 'vat'
      | 'withholding'
      | 'purchase'
      | 'expense'
      | 'uncategorized';
    source: string;
    appliesToEntryKeys: string[];
    notes: string[];
  }>;
  summary: {
    suggestionCount: number;
    previewHintCount: number;
    unmatchedHintCount: number;
  };
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxGrowthReminderPacketView {
  tenantSlug: string;
  year: number;
  generatedAt: Date;
  asOfDate: string;
  readinessStatus: EcuadorTaxReadinessStatus;
  reminders: Array<{
    key: string;
    obligationKey: string;
    period: string;
    dueDate: string | null;
    severity: 'critical' | 'high' | 'normal';
    channel: 'whatsapp' | 'manual';
    suggestedMessage: string;
    owner: 'operator' | 'accountant';
    source: string;
  }>;
  summary: {
    reminderCount: number;
    overdueCount: number;
    dueSoonCount: number;
  };
  targetWorkspace: {
    productKey: 'growth';
    handoffMode: 'operator_assist';
  };
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxReviewAssistantPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  executiveSummary: string;
  riskSignals: Array<{
    key: string;
    severity: EcuadorTaxReviewPriority;
    label: string;
    detail: string;
    source: string;
  }>;
  accountantQuestions: string[];
  suggestedActions: Array<{
    key: string;
    label: string;
    owner: 'operator' | 'accountant' | 'system';
    priority: EcuadorTaxReviewPriority;
    source: string;
  }>;
  contextSnapshot: {
    vatApprovalStatus: EcuadorTaxVatApprovalStatus;
    operationalCloseoutStatus: EcuadorTaxOperationalCloseoutStatus;
    filingHandoffStatus: EcuadorTaxFilingHandoffStatus | null;
    annexesReadinessStatus: EcuadorTaxReadinessStatus;
    accountingBridgeReadinessStatus: EcuadorTaxReadinessStatus;
    accountingBridgeMappingStatus: EcuadorTaxReadinessStatus;
    accountingBridgeUnmappedHintCount: number;
    evidenceVaultStatus: EcuadorTaxReadinessStatus;
    eventCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxPeriodCloseoutReportView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  sections: Array<{
    key: string;
    label: string;
    readinessStatus: EcuadorTaxReadinessStatus;
    summary: string;
    blockerCount: number;
    artifactCount: number;
  }>;
  totals: {
    salesDocuments: number;
    purchaseDocuments: number;
    withholdingCandidates: number;
    annexesApplicable: number;
    accountingPreviewEntries: number;
    accountingMappedHints: number;
    accountingUnmappedHints: number;
    auditEventCount: number;
  };
  filingHandoffStatus: EcuadorTaxFilingHandoffStatus | null;
  closeoutStatus: EcuadorTaxOperationalCloseoutStatus;
  blockers: string[];
  accountantQuestions: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAccountingReadinessPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  recommendation: 'stay_in_tax_compliance' | 'graduate_to_accounting';
  summary: {
    accountingMappedHints: number;
    accountingUnmappedHints: number;
    closeoutBlockerCount: number;
    assistantRiskSignalCount: number;
    evidenceArtifactCount: number;
    auditEventCount: number;
  };
  decisionSignals: Array<{
    key: string;
    label: string;
    severity: EcuadorTaxReviewPriority;
    rationale: string;
  }>;
  suggestedAccountingScope: Array<{
    key: string;
    label: string;
    reason: string;
    source: string;
  }>;
  nextProductRecommendation: {
    productKey: 'tax-compliance-ec' | 'accounting';
    rationale: string;
  };
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
  approvalReadiness:
    | 'blocked'
    | 'needs_accountant_review'
    | 'ready_for_human_approval';
  remainingBlockers: string[];
  evidenceSummary: EcuadorTaxEvidenceSummaryView;
  declarationSections: EcuadorTaxDeclarationDraftPacketView['declarationSections'];
  availableAuditEvents: EcuadorTaxComplianceEventView[];
  approvalChecklist: string[];
  nextStep: string;
  guardrails: string[];
}
